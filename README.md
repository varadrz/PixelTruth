# ◈ PixelTruth: Browser-Native Image Authenticity Analysis!

PixelTruth is an advanced, high-performance web application designed for the decentralised detection of AI-generated imagery. Utilizing state-of-the-art Vision Transformers (ViT) and optimized ONNX runtimes, it provides enterprise-grade image verification without the need for server-side processing or external API dependencies.

---

## ⛶ Application Interface
<img width="1904" height="906" alt="Interface Dashboard" src="https://github.com/user-attachments/assets/efd27aa7-d0e3-4c58-9af4-1c2e15038501" />
<img width="1905" height="911" alt="Analysis Feedback" src="https://github.com/user-attachments/assets/3a0427fc-511e-42a0-9ee0-f70d4c8a928a" />

---

## ⚡ Core Value Propositions

*   **Zero-Trust Security Model**: Images are processed exclusively within the local browser environment. No telemetry, metadata, or pixel data ever leaves the client device.
*   **High-Performance ML Inference**: Leveraging `Transformers.js` v3 and ONNX Runtime Web for near-instant analysis.
*   **Wasm Multithreading**: Optimized engine performance via `SharedArrayBuffer` and Cross-Origin Isolation (COOP/COEP).
*   **Offline Operational Capability**: Fully functional without internet connectivity after the initial model weight synchronization (~90MB).
*   **Precision Engineering**: Validated against rigorous real-world and synthetic datasets with a ~98.84% accuracy rating.

---

## 🏗️ Technical Architecture

### Intelligent Edge Inference
PixelTruth shifts the computational burden of deep learning from the server to the edge. By utilizing **Vision Transformer (ViT-base-patch16-224)** architectures locally, the application eliminates latency associated with network round-trips while maintaining total data sovereignty.

### Multithreaded Processing
To achieve real-time performance, PixelTruth implements a specialized service worker (`coi-serviceworker.js`) to bypass browser security restrictions on `SharedArrayBuffer`. This enables the ONNX runtime to utilize multiple CPU cores for parallelized tensor operations, significantly reducing inference time.

### Technology Stack
| Layer | Specification |
|:--- |:--- |
| **Frontend Framework** | Next.js 14 (App Router Architecture) |
| **Inference Engine** | ONNX Runtime Web v1.19+ |
| **Model Abstraction** | Hugging Face Transformers.js v3 |
| **Model Weights** | `Deepfake-Detection-Exp-02-21-ONNX` |
| **Interface System** | Vanilla CSS Modules (Zero-Dependency) |

---

## 🚀 Deployment & Orchestration

### Environment Setup
1.  **Repository Initialization**:
    ```bash
    git clone https://github.com/your-username/PixelTruth.git
    cd PixelTruth
    ```
2.  **Dependency Management**:
    ```bash
    npm ci
    ```
3.  **Local Execution**:
    ```bash
    npm run dev
    ```

### Continuous Delivery
The project is configured for automated deployment to **GitHub Pages** via GitHub Actions.
*   **Workflow**: `.github/workflows/deploy.yml`
*   **Triggers**: Automatic on `push` to `main`.
*   **Optimization**: Implements Next.js static export (`output: 'export'`) for maximized performance and edge delivery.

---

## 📖 Operational Logic

1.  **Ingestion & Normalization**: Images are decoded and projected into a 224x224 RGB tensor space.
2.  **Edge Inference**: The quantized ViT model processes the tensor through its attention layers locally.
3.  **Probabilistic Analysis**: The model generates logit distributions for `Real` vs `Deepfake` classifications.
4.  **Verdict Synthesis**: A confidence-weighted assessment is rendered to the user with granular probability metrics.

---

## 📄 Licensing & Attribution

Distributed under the **MIT License**.
*   **Model Source**: [prithivMLmods/Deepfake-Detection-Exp-02-21](https://huggingface.co/prithivMLmods)
*   **Engine**: [Transformers.js](https://github.com/xenova/transformers.js)
