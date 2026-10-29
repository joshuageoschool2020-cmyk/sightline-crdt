import { SightlineCRDTEngine } from '../services/crdtEngine';
import { VisualObject } from '../types/sightline';
import * as Y from 'yjs';

export interface TestResultItem {
  id: number;
  name: string;
  category: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  items: TestResultItem[];
  timestamp: string;
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

export async function runClientCRDTTests(): Promise<TestSuiteSummary> {
  const items: TestResultItem[] = [];

  const runSingle = async (
    id: number,
    name: string,
    category: string,
    fn: () => void | Promise<void>
  ) => {
    const t0 = performance.now();
    try {
      await fn();
      const durationMs = Math.round((performance.now() - t0) * 100) / 100;
      items.push({ id, name, category, passed: true, durationMs });
    } catch (err: any) {
      const durationMs = Math.round((performance.now() - t0) * 100) / 100;
      items.push({
        id,
        name,
        category,
        passed: false,
        durationMs,
        error: err?.message || String(err),
      });
    }
  };

  // TEST 1
  await runSingle(1, 'Initializes with clean empty or populated state', 'Core Lifecycle', () => {
    const engine = new SightlineCRDTEngine(`in-browser-test-${Date.now()}-1`);
    const objects = engine.getAllObjects();
    assert(Array.isArray(objects), 'Objects must be an array');
    assert(objects.length === 0, 'Initial objects count should be 0');
    engine.destroy();
  });

  // TEST 2
  await runSingle(2, 'Sets and retrieves visual objects with deep immutability', 'Data Integrity', () => {
    const engine = new SightlineCRDTEngine(`in-browser-test-${Date.now()}-2`);
    const testObj: VisualObject = {
      id: 'box_001',
      current: {
        name: 'Defect Spot',
        confidence: 0.92,
        coordinates: [10, 20, 30, 40],
      },
      history: [],
      status: 'uncertain',
    };

    engine.setObject(testObj);
    const retrieved = engine.getAllObjects();
    assert(retrieved.length === 1, 'Should contain exactly 1 object');
    assert(retrieved[0].id === 'box_001', 'Object ID matches');
    assert(retrieved[0].current.name === 'Defect Spot', 'Name matches');

    retrieved[0].current.name = 'Mutated Copy';
    const freshCheck = engine.getAllObjects();
    assert(freshCheck[0].current.name === 'Defect Spot', 'Engine data must be strictly immutable');
    engine.destroy();
  });

  // TEST 3
  await runSingle(3, 'Sanitizes out-of-bounds coordinates, NaN, and negative confidences', 'Fault Tolerance', () => {
    const engine = new SightlineCRDTEngine(`in-browser-test-${Date.now()}-3`);
    const malformedObj: VisualObject = {
      id: 'box_clamp',
      current: {
        name: 'OutOfBounds',
        confidence: 5.5,
        coordinates: [-50, 150, NaN as any, 80],
      },
      history: [],
      status: 'uncertain',
    };

    engine.setObject(malformedObj);
    const result = engine.getAllObjects()[0];
    assert(result.current.confidence <= 1.0, 'Confidence must be clamped to <= 1.0');
    assert(result.current.coordinates[0] === 0, 'Negative X must be clamped to 0');
    assert(result.current.coordinates[1] === 100, 'X > 100 must be clamped to 100');
    assert(result.current.coordinates[2] >= 0, 'NaN must be safely converted to finite number');
    engine.destroy();
  });

  // TEST 4
  await runSingle(4, 'Applies immutable patches and auto-elevates status for human vs AI', 'History & Audit', () => {
    const engine = new SightlineCRDTEngine(`in-browser-test-${Date.now()}-4`);
    engine.setObject({
      id: 'weld_joint',
      current: {
        name: 'Joint A',
        confidence: 0.65,
        coordinates: [20, 20, 40, 40],
      },
      history: [],
      status: 'uncertain',
    });

    const patched = engine.applyPatch('weld_joint', { name: 'Verified Joint A', confidence: 1.0 }, 'human');
    assert(patched === true, 'Patch must succeed');

    const updated = engine.getAllObjects()[0];
    assert(updated.current.name === 'Verified Joint A', 'Name must update');
    assert(updated.status === 'corrected', 'Human edit must set status to corrected');
    assert(updated.history.length === 1, 'History must contain 1 entry');
    assert(updated.history[0].author === 'human', 'History entry author must be human');
    assert(updated.history[0].changes['name'] !== undefined, 'Change record should include name diff');
    engine.destroy();
  });

  // TEST 5
  await runSingle(5, 'Prevents subscriber UI exceptions from breaking CRDT event loop (#799)', 'Issue #799 Isolation', () => {
    const engine = new SightlineCRDTEngine(`in-browser-test-${Date.now()}-5`);
    let successfulDispatches = 0;

    const unsubscribe = engine.subscribe(() => {
      successfulDispatches++;
      if (successfulDispatches === 2) {
        throw new Error('Simulated React render crash or UI error in subscriber');
      }
    });

    assert(successfulDispatches === 1, 'Initial trigger received');

    engine.setObject({
      id: 'crash_test_1',
      current: { name: 'Crash Test', confidence: 0.9, coordinates: [10, 10, 20, 20] },
      history: [],
      status: 'verified',
    });
    assert(successfulDispatches === 2, 'Faulty subscriber was called');

    engine.setObject({
      id: 'crash_test_2',
      current: { name: 'Next Object', confidence: 0.95, coordinates: [30, 30, 40, 40] },
      history: [],
      status: 'verified',
    });

    const list = engine.getAllObjects();
    assert(list.length === 2, 'Engine continued operating and stored 2 objects despite subscriber error');

    unsubscribe();
    engine.destroy();
  });

  // TEST 6
  await runSingle(6, 'Key-diffing scene seeding minimizes deletion tombstones', 'Issue #741 Prevention', () => {
    const engine = new SightlineCRDTEngine(`in-browser-test-${Date.now()}-6`);
    const sceneA: VisualObject[] = [
      { id: 'item_1', current: { name: 'Item 1', confidence: 0.9, coordinates: [10, 10, 20, 20] }, history: [], status: 'verified' },
      { id: 'item_2', current: { name: 'Item 2', confidence: 0.8, coordinates: [20, 20, 30, 30] }, history: [], status: 'uncertain' },
    ];
    engine.seedScene(sceneA);

    const metricsA = engine.getHealthMetrics();
    assert(metricsA.totalDeletions === 0, 'Initial seed should have 0 deletions');

    const sceneB: VisualObject[] = [
      { id: 'item_1', current: { name: 'Item 1 Updated', confidence: 0.95, coordinates: [10, 10, 25, 25] }, history: [], status: 'verified' },
      { id: 'item_3', current: { name: 'Item 3', confidence: 0.85, coordinates: [40, 40, 50, 50] }, history: [], status: 'verified' },
    ];
    engine.seedScene(sceneB);

    const metricsB = engine.getHealthMetrics();
    assert(metricsB.totalDeletions === 1, 'Only the single missing key was deleted');
    assert(metricsB.objectCount === 2, 'Scene B has exactly 2 objects');
    engine.destroy();
  });

  // TEST 7
  await runSingle(7, 'Survives rapid delete cycles and compacts to lean memory footprint (#741)', 'Issue #741 Compaction', () => {
    const engine = new SightlineCRDTEngine(`in-browser-test-${Date.now()}-7`);

    for (let i = 0; i < 300; i++) {
      const id = `churn_${i}`;
      engine.setObject({
        id,
        current: { name: `Churn ${i}`, confidence: 0.5, coordinates: [10, 10, 20, 20] },
        history: [],
        status: 'uncertain',
      });
      if (i >= 5) {
        engine.deleteObject(`churn_${i - 5}`);
      }
    }

    const preCompactMetrics = engine.getHealthMetrics();
    assert(preCompactMetrics.objectCount === 5, 'Must have exactly 5 live objects');
    assert(preCompactMetrics.totalDeletions > 250, 'Recorded deletion debt');

    const compacted = engine.compact();
    assert(compacted === true, 'Compaction must succeed');

    const postCompactMetrics = engine.getHealthMetrics();
    assert(postCompactMetrics.objectCount === 5, 'Live objects preserved through compaction');
    assert(postCompactMetrics.totalDeletions === 0, 'Tombstone deletion debt reset to 0');
    assert(postCompactMetrics.healthStatus === 'optimal', 'Health status returned to optimal');
    assert(postCompactMetrics.docByteSize < preCompactMetrics.docByteSize, 'Byte size reduced after purging tombstones');

    engine.destroy();
  });

  // TEST 8
  await runSingle(8, 'Two engine documents achieve deterministic state parity', 'CRDT Convergence', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const mapA = docA.getMap<VisualObject>('visualObjects');
    const mapB = docB.getMap<VisualObject>('visualObjects');

    mapA.set('sync_box', {
      id: 'sync_box',
      current: { name: 'Synchronized Object', confidence: 0.99, coordinates: [15, 15, 35, 35] },
      history: [],
      status: 'verified',
    });

    const updateA = Y.encodeStateAsUpdate(docA);
    Y.applyUpdate(docB, updateA);

    const syncedObj = mapB.get('sync_box');
    assert(syncedObj !== undefined, 'Peer B must have synchronized object');
    assert(syncedObj?.current.name === 'Synchronized Object', 'Peer B object properties match identically');

    docA.destroy();
    docB.destroy();
  });

  const passedCount = items.filter((i) => i.passed).length;
  return {
    total: items.length,
    passed: passedCount,
    failed: items.length - passedCount,
    items,
    timestamp: new Date().toLocaleTimeString(),
  };
}
