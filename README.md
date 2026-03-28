# ◈ PixelTruth — AI vs Real Image Detector

Detect AI-generated images entirely in the browser. **No API. No Server. 100% Private.**

PixelTruth is a high-performance web application designed to distinguish between authentic photographs and AI-generated imagery. By leveraging the latest in browser-based machine learning, it provides an instant, secure, and cost-free solution for image verification.

---

## ✨ Key Features

- **🚀 100% In-Browser Inference**: No images are ever uploaded to a server. Your data stays on your device.
- **🧠 Advanced Vision Transformer**: Powered by the `Deep-Fake-Detector-v2` ViT model via Transformers.js.
- **⚡ Offline-Ready**: After the initial model download (~90MB), PixelTruth works completely offline.
- **🎯 Professional Accuracy**: Achieves ~98.84% accuracy on curated real/deepfake validation sets.
- **💎 Premium UI**: A clean, modern interface with real-time analysis animations and high-fidelity metrics.

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

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Project**:
   Navigate to `http://localhost:3000` in your browser.

---

## 📖 Model Details

The detection engine uses a **Vision Transformer (ViT)** fine-tuned on a massive dataset of authentic and synthetic images.
- **Base Model**: `google/vit-base-patch16-224-in21k`
- **Labels**: `Realism` (Authentic) / `Deepfake` (AI Generated)
- **Input**: RGB images, automatically processed to 224×224 resolution.

---

## 🌐 Deployment

PixelTruth is optimized for static deployment on platforms like **Vercel**.

```bash
# Deploy with Vercel CLI
vercel --prod
```

*No environment variables or backend configuration required.*

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
