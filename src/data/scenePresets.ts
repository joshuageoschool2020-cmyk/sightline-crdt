import { ScenePreset } from '../types/sightline';

export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'scene-logistics',
    title: 'Automated Logistics & Warehouse Fulfillment',
    category: 'Industrial Robotics',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80',
    initialObjects: [
      {
        id: 'obj-logistics-1',
        current: {
          name: 'Heavy Duty Forklift',
          confidence: 0.94,
          coordinates: [12, 38, 44, 88],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 360000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Heavy Duty Forklift' },
              confidence: { oldValue: null, newValue: 0.94 },
              coordinates: { oldValue: null, newValue: [12, 38, 44, 88] },
            },
          },
        ],
        status: 'verified',
      },
      {
        id: 'obj-logistics-2',
        current: {
          name: 'Cardboard Pallet Box (Uncertain Stacking)',
          confidence: 0.62,
          coordinates: [52, 45, 78, 85],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 320000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Cardboard Pallet Box (Uncertain Stacking)' },
              confidence: { oldValue: null, newValue: 0.62 },
              coordinates: { oldValue: null, newValue: [52, 45, 78, 85] },
            },
          },
        ],
        status: 'uncertain',
      },
      {
        id: 'obj-logistics-3',
        current: {
          name: 'Overhead Conveyor Sensor',
          confidence: 0.73,
          coordinates: [35, 10, 65, 28],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 280000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Overhead Conveyor Sensor' },
              confidence: { oldValue: null, newValue: 0.73 },
              coordinates: { oldValue: null, newValue: [35, 10, 65, 28] },
            },
          },
        ],
        status: 'uncertain',
      },
    ],
  },
  {
    id: 'scene-autonomous',
    title: 'Urban Autonomous Driving & Pedestrian Junction',
    category: 'Mobility Vision',
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1400&q=80',
    initialObjects: [
      {
        id: 'obj-auto-1',
        current: {
          name: 'Electric Sedan (Inbound Lane)',
          confidence: 0.96,
          coordinates: [22, 50, 56, 85],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 400000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Electric Sedan (Inbound Lane)' },
              confidence: { oldValue: null, newValue: 0.96 },
              coordinates: { oldValue: null, newValue: [22, 50, 56, 85] },
            },
          },
        ],
        status: 'verified',
      },
      {
        id: 'obj-auto-2',
        current: {
          name: 'Cyclist / Scooter (Occluded Path)',
          confidence: 0.58,
          coordinates: [64, 48, 82, 79],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 350000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Cyclist / Scooter (Occluded Path)' },
              confidence: { oldValue: null, newValue: 0.58 },
              coordinates: { oldValue: null, newValue: [64, 48, 82, 79] },
            },
          },
        ],
        status: 'uncertain',
      },
      {
        id: 'obj-auto-3',
        current: {
          name: 'Crosswalk Traffic Signal',
          confidence: 0.89,
          coordinates: [75, 18, 88, 38],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 300000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Crosswalk Traffic Signal' },
              confidence: { oldValue: null, newValue: 0.89 },
              coordinates: { oldValue: null, newValue: [75, 18, 88, 38] },
            },
          },
        ],
        status: 'verified',
      },
    ],
  },
  {
    id: 'scene-electronics',
    title: 'High-Density PCB Assembly Quality Inspection',
    category: 'Hardware QC',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    initialObjects: [
      {
        id: 'obj-pcb-1',
        current: {
          name: 'Microcontroller QFP-64 IC',
          confidence: 0.98,
          coordinates: [30, 28, 62, 68],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 500000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Microcontroller QFP-64 IC' },
              confidence: { oldValue: null, newValue: 0.98 },
              coordinates: { oldValue: null, newValue: [30, 28, 62, 68] },
            },
          },
        ],
        status: 'verified',
      },
      {
        id: 'obj-pcb-2',
        current: {
          name: 'SMD Ceramic Capacitor (Solder Bridge Suspicion)',
          confidence: 0.52,
          coordinates: [68, 42, 85, 58],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 450000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'SMD Ceramic Capacitor (Solder Bridge Suspicion)' },
              confidence: { oldValue: null, newValue: 0.52 },
              coordinates: { oldValue: null, newValue: [68, 42, 85, 58] },
            },
          },
        ],
        status: 'uncertain',
      },
      {
        id: 'obj-pcb-3',
        current: {
          name: 'Gold Plated Edge Connector Pins',
          confidence: 0.91,
          coordinates: [8, 72, 88, 92],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 410000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Gold Plated Edge Connector Pins' },
              confidence: { oldValue: null, newValue: 0.91 },
              coordinates: { oldValue: null, newValue: [8, 72, 88, 92] },
            },
          },
        ],
        status: 'verified',
      },
    ],
  },
  {
    id: 'scene-visdrone',
    title: 'VisDrone High-Altitude Aerial Traffic',
    category: 'Drone Vision Benchmark',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1400&q=80',
    initialObjects: [
      {
        id: 'obj-drone-1',
        current: {
          name: 'Compact Vehicle (Shadow Occlusion)',
          confidence: 0.54,
          coordinates: [42, 60, 52, 72],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 300000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Compact Vehicle (Shadow Occlusion)' },
              confidence: { oldValue: null, newValue: 0.54 },
              coordinates: { oldValue: null, newValue: [42, 60, 52, 72] },
            },
          },
        ],
        status: 'uncertain',
      },
      {
        id: 'obj-drone-2',
        current: {
          name: 'Delivery Van (Intersection Turn)',
          confidence: 0.89,
          coordinates: [65, 35, 80, 52],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 250000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Delivery Van (Intersection Turn)' },
              confidence: { oldValue: null, newValue: 0.89 },
              coordinates: { oldValue: null, newValue: [65, 35, 80, 52] },
            },
          },
        ],
        status: 'verified',
      },
      {
        id: 'obj-drone-3',
        current: {
          name: 'Pedestrian Crossing (Pixel Boundary Drift)',
          confidence: 0.49,
          coordinates: [24, 78, 30, 88],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 210000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Pedestrian Crossing (Pixel Boundary Drift)' },
              confidence: { oldValue: null, newValue: 0.49 },
              coordinates: { oldValue: null, newValue: [24, 78, 30, 88] },
            },
          },
        ],
        status: 'uncertain',
      },
    ],
  },
  {
    id: 'scene-maritime',
    title: 'Maritime Deep-Water Port & Fleet Logistics',
    category: 'Port & Marine Fleet Vision',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1400&q=80',
    initialObjects: [
      {
        id: 'obj-sea-1',
        current: {
          name: 'Ultra-Large Container Vessel (Bow Section)',
          confidence: 0.96,
          coordinates: [15, 25, 75, 78],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 360000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Ultra-Large Container Vessel (Bow Section)' },
              confidence: { oldValue: null, newValue: 0.96 },
              coordinates: { oldValue: null, newValue: [15, 25, 75, 78] },
            },
          },
        ],
        status: 'verified',
      },
      {
        id: 'obj-sea-2',
        current: {
          name: 'Quayside Gantry Crane (Trolley Assembly)',
          confidence: 0.58,
          coordinates: [58, 12, 85, 45],
        },
        history: [
          {
            timestamp: new Date(Date.now() - 310000).toISOString(),
            author: 'ai',
            changes: {
              name: { oldValue: null, newValue: 'Quayside Gantry Crane (Trolley Assembly)' },
              confidence: { oldValue: null, newValue: 0.58 },
              coordinates: { oldValue: null, newValue: [58, 12, 85, 45] },
            },
          },
        ],
        status: 'uncertain',
      },
    ],
  },
];
