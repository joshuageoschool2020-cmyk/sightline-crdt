import React, { useState, useEffect, useRef } from 'react';
import { SightlineCRDTEngine, CRDTHealthMetrics } from './services/crdtEngine';
import { SCENE_PRESETS } from './data/scenePresets';
import { VisualObject, ScenePreset, ObjectStatus } from './types/sightline';
import { TopBar } from './components/TopBar';
import { VisualCanvas } from './components/VisualCanvas';
import { ObjectInspector } from './components/ObjectInspector';
import { SpeechControllerModal } from './components/SpeechControllerModal';
import { RoadmapView } from './components/RoadmapView';
import { TriageQueue } from './components/TriageQueue';
import { CommercialFlywheel } from './components/CommercialFlywheel';
import { ExportModal } from './components/ExportModal';
import { LaunchCoversModal } from './components/LaunchCoversModal';
import { UpgradeModal } from './components/UpgradeModal';
import { LandingPage } from './components/LandingPage';
import { ModelBenchmarkView } from './components/ModelBenchmarkView';
import { 
  Upload, 
  Layers, 
  Workflow, 
  CheckCircle2, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'canvas' | 'benchmark' | 'roadmap' | 'triage' | 'flywheel'>('landing');
  const [scenes, setScenes] = useState<ScenePreset[]>(SCENE_PRESETS);
  const [currentSceneId, setCurrentSceneId] = useState<string>(SCENE_PRESETS[0].id);
  const [objects, setObjects] = useState<VisualObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCoversOpen, setIsCoversOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [voiceTargetId, setVoiceTargetId] = useState<string | null>(null);
  const [peerCount, setPeerCount] = useState<number>(1);
  const [crdtMetrics, setCrdtMetrics] = useState<CRDTHealthMetrics | null>(null);

  // CRDT Engine Reference
  const engineRef = useRef<SightlineCRDTEngine | null>(null);

  const currentScene = scenes.find((s) => s.id === currentSceneId) || scenes[0];

  // Initialize CRDT Engine and Subscribe once
  useEffect(() => {
    const engine = new SightlineCRDTEngine('inb-sightline-public-room');
    engineRef.current = engine;

    // Seed initial scene objects
    engine.seedScene(currentScene.initialObjects);

    // Single Observer Subscription with guaranteed cleanup
    const unsubscribe = engine.subscribe((updatedObjects) => {
      setObjects(updatedObjects);
      setPeerCount(engine.getConnectedPeerCount());
      setCrdtMetrics(engine.getHealthMetrics());
    });

    const peerInterval = setInterval(() => {
      if (engineRef.current) {
        setPeerCount(engineRef.current.getConnectedPeerCount());
        setCrdtMetrics(engineRef.current.getHealthMetrics());
      }
    }, 4000);

    return () => {
      clearInterval(peerInterval);
      unsubscribe();
      engine.destroy();
    };
  }, []);

  const handleCompactCRDT = () => {
    if (engineRef.current) {
      engineRef.current.compact();
      setCrdtMetrics(engineRef.current.getHealthMetrics());
    }
  };

  // When changing scenes, seed the CRDT engine
  const handleSelectScene = (sceneId: string) => {
    setCurrentSceneId(sceneId);
    setSelectedObjectId(null);
    const target = scenes.find((s) => s.id === sceneId);
    if (target && engineRef.current) {
      engineRef.current.seedScene(target.initialObjects);
    }
  };

  // Safe Immutable Patch Wrapper
  const handleApplyPatch = (
    id: string,
    updates: Partial<VisualObject['current']>,
    author: 'human' | 'ai' = 'human',
    status?: ObjectStatus
  ) => {
    if (!engineRef.current) return;
    engineRef.current.applyPatch(id, updates, author, status);
  };

  // Add Object
  const handleAddObject = (newObj: VisualObject) => {
    if (!engineRef.current) return;
    engineRef.current.setObject(newObj);
  };

  // Delete Object
  const handleDeleteObject = (id: string) => {
    if (!engineRef.current) return;
    engineRef.current.deleteObject(id);
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
  };

  // Reset current scene to defaults
  const handleResetScene = () => {
    if (!engineRef.current || !currentScene) return;
    engineRef.current.seedScene(currentScene.initialObjects);
    setSelectedObjectId(null);
  };

  // Custom User Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const customScene: ScenePreset = {
        id: `custom-scene-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Custom Upload',
        imageUrl: dataUrl,
        initialObjects: [
          {
            id: `obj-initial-${Date.now()}`,
            current: {
              name: 'Detected Entity',
              confidence: 0.65,
              coordinates: [20, 20, 60, 60],
            },
            history: [
              {
                timestamp: new Date().toISOString(),
                author: 'ai',
                changes: {
                  created: { oldValue: null, newValue: 'Detected Entity' },
                },
              },
            ],
            status: 'uncertain',
          },
        ],
      };

      setScenes((prev) => [customScene, ...prev]);
      setCurrentSceneId(customScene.id);
      setSelectedObjectId(null);
      if (engineRef.current) {
        engineRef.current.seedScene(customScene.initialObjects);
      }
    };
    reader.readAsDataURL(file);
  };

  const selectedObject = objects.find((o) => o.id === selectedObjectId) || null;
  const uncertainCount = objects.filter((o) => o.status === 'uncertain').length;
  const verifiedCount = objects.filter((o) => o.status === 'verified').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Top Bar with Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        peerCount={peerCount}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenCovers={() => setIsCoversOpen(true)}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        uncertainCount={uncertainCount}
        totalCount={objects.length}
        verifiedCount={verifiedCount}
        crdtMetrics={crdtMetrics}
        onCompactCRDT={handleCompactCRDT}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'landing' && (
          <LandingPage
            onLaunchStudio={() => setActiveTab('canvas')}
            onOpenUpgrade={() => setIsUpgradeOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onTestBenchmark={(sceneId) => {
              handleSelectScene(sceneId);
              setActiveTab('canvas');
            }}
          />
        )}

        {activeTab === 'benchmark' && (
          <ModelBenchmarkView
            onSelectScene={(sceneId) => handleSelectScene(sceneId)}
            onOpenCanvas={() => setActiveTab('canvas')}
          />
        )}

        {activeTab === 'canvas' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sub-Nav / Scene Picker Rail */}
            <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col p-3 space-y-4 select-none shrink-0">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-2">
                  Test Datasets & Scenes
                </span>
                <div className="space-y-1.5">
                  {scenes.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => handleSelectScene(scene.id)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                        currentSceneId === scene.id
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                      <div className="truncate">
                        <div className="font-medium truncate">{scene.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{scene.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Custom Image */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-slate-700 bg-slate-950/60 hover:bg-slate-800/40 hover:border-slate-500 cursor-pointer text-xs text-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Upload Custom Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Architecture Engine Snapshot */}
              <div className="mt-auto p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="text-white font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Visual CRDT Engine
                </div>
                <div className="text-slate-500 text-[10px]">Deterministic Peer Mesh</div>
                <div className="text-slate-500 text-[10px]">Schema Status: Synchronized</div>
              </div>
            </aside>

            {/* Central Visual Canvas Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <VisualCanvas
                scene={currentScene}
                objects={objects}
                selectedObjectId={selectedObjectId}
                onSelectObject={setSelectedObjectId}
                onApplyPatch={handleApplyPatch}
                onDeleteObject={handleDeleteObject}
                onAddObject={handleAddObject}
                onResetScene={handleResetScene}
                onOpenVoiceModal={(id) => setVoiceTargetId(id)}
              />
            </div>

            {/* Right Inspector & Lineage Rail */}
            <ObjectInspector
              selectedObject={selectedObject}
              allObjects={objects}
              onApplyPatch={handleApplyPatch}
              onOpenVoiceModal={(id) => setVoiceTargetId(id)}
              onSelectObject={setSelectedObjectId}
            />
          </div>
        )}

        {activeTab === 'triage' && (
          <TriageQueue
            objects={objects}
            onApplyPatch={handleApplyPatch}
            onDeleteObject={handleDeleteObject}
            onSelectObject={setSelectedObjectId}
            onSwitchToCanvas={() => setActiveTab('canvas')}
          />
        )}

        {activeTab === 'roadmap' && <RoadmapView />}

        {activeTab === 'flywheel' && (
          <CommercialFlywheel
            objects={objects}
            onSwitchToCanvas={() => setActiveTab('canvas')}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Voice Correction Modal (Task 1) */}
      {voiceTargetId && (
        <SpeechControllerModal
          targetObject={objects.find((o) => o.id === voiceTargetId) || null}
          isOpen={!!voiceTargetId}
          onClose={() => setVoiceTargetId(null)}
          onApplyPatch={handleApplyPatch}
        />
      )}

      {/* Dataset Packaging & Export Modal (Task 6) */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        scene={currentScene}
        objects={objects}
      />

      {/* Launch Showcase Covers Modal (Peerlist / Product Hunt) */}
      <LaunchCoversModal
        isOpen={isCoversOpen}
        onClose={() => setIsCoversOpen(false)}
      />

      {/* Pro Upgrade & Monetization Modal (50% OFF Launch Deal) */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />


    </div>
  );
}
