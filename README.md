# Sightline CRDT — Visual Dataset Verification & Active Uncertainty Triage

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Architecture: Local-First](https://img.shields.io/badge/Architecture-Local--First-emerald.svg)]()
[![Sync: WebRTC CRDT](https://img.shields.io/badge/Sync-Yjs_WebRTC-indigo.svg)]()
[![Privacy: UAE PDPL Compliant](https://img.shields.io/badge/Data_Privacy-In--Browser_Memory-green.svg)]()

> **Sightline CRDT** is a real-time, privacy-preserving verification engine designed to eliminate bounding box drift, occlusions, and false positives in computer vision training datasets.

🔗 **Live Production Platform:** [sightline-crdt.netlify.app](https://sightline-crdt.netlify.app)  
📄 **Technical Benchmark Specification:** [Benchmark Report (PDF)](https://sightline-crdt.netlify.app/Sightline_Dataset_Verification_Report.pdf)

---

## The Problem: Data Quality Over Raw Volume

In modern computer vision pipelines (Ultralytics YOLO, torchvision, Detectron2), **12% to 18% of validation mAP loss** is caused by boundary drift, loose coordinates, and false-positive label noise in custom datasets.

Traditional data tooling presents two critical bottlenecks:
1. **Cloud Data Exposure:** Centralized annotation platforms require uploading proprietary raw sensor feeds to external servers, violating client NDAs in robotics and industrial inspection.
2. **Server-Side Merge Conflicts:** Distributed teams auditing frames concurrently face database write locks and painful synchronization latency.

---

## Architectural Highlights

- **100% Client-Side Privacy:** Imagery runs strictly inside in-browser memory. Zero images or training vectors are transmitted or stored on external cloud databases, satisfying international data protection standards and UAE Federal Decree-Law No. 45 of 2021.
- **Deterministic Peer Sync (Yjs CRDTs):** Employs Conflict-Free Replicated Data Types over WebRTC data channels for real-time multi-auditor collaboration with sub-millisecond local latency.
- **Active Uncertainty Triage:** Automatically flags low-confidence bounding boxes (< 85% confidence / high IoU overlap) into a high-throughput human verification queue.
- **Sub-Pixel Coordinate Manipulation:** Millimeter-precise coordinate snapping for tight occlusion handling and micro-defect segmentation.
- **Universal Training Deliverables:** One-click exports directly formatted for training pipelines:
  - Ultralytics YOLOv8 / YOLOv11 (`<class_id> <x_center> <y_center> <width> <height>` + `data.yaml`)
  - Standard COCO JSON (Instances 1.0 schema)
  - Pascal VOC XML

---

## Quick Start (Run Locally)

```bash
# Clone the repository
git clone https://github.com/your-username/sightline-crdt.git

# Install dependencies
npm install

# Start local verification server
npm run dev
