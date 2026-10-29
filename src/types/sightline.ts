export type AuthorType = 'human' | 'ai';
export type ObjectStatus = 'verified' | 'uncertain' | 'corrected';

export interface FieldChange<T = unknown> {
  oldValue: T;
  newValue: T;
}

export interface HistoryEntry {
  timestamp: string;
  author: AuthorType;
  changes: Record<string, FieldChange>;
}

export interface VisualObjectCurrent {
  name: string;
  confidence: number;
  coordinates: [number, number, number, number]; // [x1, y1, x2, y2] in normalized coordinates (0-100 or px)
}

export interface VisualObject {
  id: string;
  current: VisualObjectCurrent;
  history: HistoryEntry[];
  status: ObjectStatus;
}

export interface ScenePreset {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  initialObjects: VisualObject[];
}

export interface ArchitectTask {
  id: string;
  taskNumber: number;
  title: string;
  stage: string;
  objective: string;
  technicalDetails: {
    yjsImpact: string;
    immutableState: string;
    historyLogic: string;
    observerRendering: string;
  };
  workerInstruction: string;
  status: 'completed' | 'in-progress' | 'queued';
  targetWorker: 'Continue.dev' | 'Qoder';
}
