# ◈ PixelTruth — AI vs Real Image Detector

Detect AI-generated images entirely in the browser. **No API. No Server. 100% Private.**

PixelTruth is a high-performance web application designed to distinguish between authentic photographs and AI-generated imagery. By leveraging the latest in browser-based machine learning, it provides an instant, secure, and cost-free solution for image verification.

---
# ⛶ Screen Shots
<img width="1904" height="906" alt="Screenshot 2026-03-28 123723" src="https://github.com/user-attachments/assets/efd27aa7-d0e3-4c58-9af4-1c2e15038501" />
<img width="1905" height="911" alt="Screenshot 2026-03-28 123619" src="https://github.com/user-attachments/assets/3a0427fc-511e-42a0-9ee0-f70d4c8a928a" />

---

## ✨ Key Features

- **🚀 100% In-Browser Inference**: No images are ever uploaded to a server. Your data stays on your device.
- **🧠 Advanced Vision Transformer**: Powered by the `Deep-Fake-Detector-v2` ViT model via Transformers.js.
- **⚡ Offline-Ready**: After the initial model download (~90MB), PixelTruth works completely offline.
- **🎯 Professional Accuracy**: Achieves ~98.84% accuracy on curated real/deepfake validation sets.
- **💎 Premium UI**: A clean, modern interface with real-time analysis animations and high-fidelity metrics.
- **🖼️ Broad Support**: Compatible with JPG, PNG, WEBP, and GIF formats.

---

## 🔒 Privacy First

PixelTruth is built with a **Privacy-First** architecture. Unlike other AI detection tools, PixelTruth:
- **Never uploads your images**: All processing happens locally in your browser's memory.
- **Has no backend**: The application is a static site; there is no server to receive or store your data.
- **Uses local caching**: Once the model is downloaded, it is stored in your browser's IndexedDB for future use, requiring no further network activity.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router) |
| **ML Runtime** | [Transformers.js v3](https://huggingface.co/docs/transformers.js/) + ONNX Runtime Web |
| **Model** | `prithivMLmods/Deepfake-Detection-Exp-02-21-ONNX` |
| **Styling** | Vanilla CSS (Modern Modules) |
| **Architecture** | Vision Transformer (`ViT-base-patch16-224`) |

---

## 🚀 Getting Started

### Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/PixelTruth.git
   cd PixelTruth
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Project**:
   Navigate to `http://localhost:3000` in your browser.

---

## 📖 How It Works

1. **Image Preprocessing**: When you drop an image, PixelTruth resizes and normalizes it to a 224x224 RGB format required by the Vision Transformer.
2. **Local Inference**: The browser-based ONNX runtime executes the model weights on your local CPU or GPU (via WebGL/WebGPU if available).
3. **Probability Scoring**: The model outputs a probability distribution across two labels: `Real` and `Deepfake`.
4. **Verdict Generation**: Based on the primary score and a confidence threshold, the UI displays a detailed analysis of the image's authenticity.

---

## 🌐 Deployment

PixelTruth is optimized for static deployment on **GitHub Pages**.

### Automated Deployment
The included GitHub Action (`.github/workflows/deploy.yml`) will automatically build and deploy the application whenever you push to the `main` branch.

### Manual Setup
1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Your site will be live at `https://<username>.github.io/PixelTruth/`.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
