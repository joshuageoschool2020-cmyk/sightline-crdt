import React, { useState } from 'react';
import { VisualObject, ScenePreset } from '../types/sightline';
import { Download, X, Copy, Check, FileCode, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: ScenePreset;
  objects: VisualObject[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  scene,
  objects,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'coco' | 'voc' | 'sightline'>('coco');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Convert objects to COCO JSON
  const generateCOCO = () => {
    const categoriesMap = new Map<string, number>();
    let categoryCounter = 1;

    objects.forEach((obj) => {
      if (!categoriesMap.has(obj.current.name)) {
        categoriesMap.set(obj.current.name, categoryCounter++);
      }
    });

    const categories = Array.from(categoriesMap.entries()).map(([name, id]) => ({
      id,
      name,
      supercategory: 'object',
    }));

    const annotations = objects.map((obj, index) => {
      const [x1, y1, x2, y2] = obj.current.coordinates;
      const width = x2 - x1;
      const height = y2 - y1;
      return {
        id: index + 1,
        image_id: 1,
        category_id: categoriesMap.get(obj.current.name) || 1,
        bbox: [x1, y1, width, height],
        area: width * height,
        iscrowd: 0,
        sightline_metadata: {
          confidence: obj.current.confidence,
          status: obj.status,
          human_verified: obj.status === 'verified' || obj.status === 'corrected',
          revision_count: obj.history.length,
        },
      };
    });

    return JSON.stringify(
      {
        info: {
          description: `INB Sightline Export - ${scene.title}`,
          url: 'https://inb-sightline.io',
          version: '1.0',
          year: 2026,
          contributor: 'INB Sightline Multi-Architect Engine',
          date_created: new Date().toISOString(),
        },
        images: [
          {
            id: 1,
            width: 1920,
            height: 1080,
            file_name: `${scene.id}.jpg`,
            license: 1,
            date_captured: new Date().toISOString(),
          },
        ],
        annotations,
        categories,
      },
      null,
      2
    );
  };

  // Convert objects to Pascal VOC XML
  const generatePascalVOC = () => {
    const objectXml = objects
      .map((obj) => {
        const [x1, y1, x2, y2] = obj.current.coordinates;
        return `  <object>
    <name>${obj.current.name}</name>
    <pose>Unspecified</pose>
    <truncated>0</truncated>
    <difficult>0</difficult>
    <confidence>${obj.current.confidence}</confidence>
    <sightline_status>${obj.status}</sightline_status>
    <bndbox>
      <xmin>${Math.round(x1 * 19.2)}</xmin>
      <ymin>${Math.round(y1 * 10.8)}</ymin>
      <xmax>${Math.round(x2 * 19.2)}</xmax>
      <ymax>${Math.round(y2 * 10.8)}</ymax>
    </bndbox>
  </object>`;
      })
      .join('\n');

    return `<annotation>
  <folder>sightline_exports</folder>
  <filename>${scene.id}.jpg</filename>
  <source>
    <database>INB Sightline Collaborative CRDT Ground Truth</database>
  </source>
  <size>
    <width>1920</width>
    <height>1080</height>
    <depth>3</depth>
  </size>
  <segmented>0</segmented>
${objectXml}
</annotation>`;
  };

  // Full Sightline CRDT lineage export
  const generateSightlineJSON = () => {
    return JSON.stringify(
      {
        platform: 'INB Sightline CRDT',
        scene: {
          id: scene.id,
          title: scene.title,
          category: scene.category,
        },
        timestamp: new Date().toISOString(),
        objects,
      },
      null,
      2
    );
  };

  const getExportData = () => {
    switch (selectedFormat) {
      case 'coco':
        return { data: generateCOCO(), filename: `sightline_coco_${scene.id}.json`, type: 'application/json' };
      case 'voc':
        return { data: generatePascalVOC(), filename: `sightline_voc_${scene.id}.xml`, type: 'application/xml' };
      case 'sightline':
        return { data: generateSightlineJSON(), filename: `sightline_crdt_${scene.id}.json`, type: 'application/json' };
    }
  };

  const currentExport = getExportData();

  const handleDownload = () => {
    const blob = new Blob([currentExport.data], { type: currentExport.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentExport.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentExport.data);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-white flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Task 6: Commercial Dataset Packaging Engine</span>
            </div>
            <h3 className="text-base font-semibold text-white">
              Export Verified Ground Truth Dataset
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-3 shrink-0">
          <button
            onClick={() => setSelectedFormat('coco')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFormat === 'coco'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            COCO JSON (ML Standard)
          </button>
          <button
            onClick={() => setSelectedFormat('voc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFormat === 'voc'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Pascal VOC XML
          </button>
          <button
            onClick={() => setSelectedFormat('sightline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedFormat === 'sightline'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Sightline CRDT Audit JSON
          </button>
        </div>

        {/* Code Preview Box */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-950 rounded-xl border border-slate-800 min-h-[220px]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 shrink-0">
            <span className="font-mono">{currentExport.filename}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="flex-1 p-3 overflow-auto font-mono text-[11px] text-slate-300 leading-relaxed">
            {currentExport.data}
          </pre>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 shrink-0">
          <div className="text-xs text-slate-400">
            Contains <strong className="text-white">{objects.length}</strong> annotations for{' '}
            <strong className="text-white">{scene.title}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
