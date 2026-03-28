"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./page.module.css";

type Status = "idle" | "loading-model" | "analyzing" | "done" | "error";

type Result = {
  verdict: "AI" | "REAL";
  aiScore: number;
  realScore: number;
  confidence: number;
};

// Meter bar component
function Meter({
  label,
  value,
  color,
  glow,
}: {
  label: string;
  value: number;
  color: string;
  glow: string;
}) {
  return (
    <div className={styles.meter}>
      <div className={styles.meterTop}>
        <span className={styles.meterLabel}>{label}</span>
        <span className={styles.meterVal} style={{ color }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className={styles.meterTrack}>
        <div
          className={styles.meterFill}
          style={{
            width: `${value}%`,
            background: color,
            boxShadow: value > 50 ? glow : "none",
          }}
        />
      </div>
    </div>
  );
}

// Animated score circle
function ScoreCircle({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className={styles.circle}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="7"
        />
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)",
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className={styles.circleInner}>
        <span className={styles.circleVal} style={{ color }}>
          {Math.round(value)}
        </span>
        <span className={styles.circlePct}>%</span>
        <span className={styles.circleLabel}>{label}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [modelProgress, setModelProgress] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loadPhase, setLoadPhase] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipelineRef = useRef<any>(null);

  const loadPhrases = [
    "Fetching ViT model weights…",
    "Initialising ONNX runtime…",
    "Loading Vision Transformer…",
    "Almost ready…",
  ];

  const analyzePhases = [
    "Preprocessing image…",
    "Running inference…",
    "Scoring authenticity…",
  ];

  // Cycle through loading messages
  useEffect(() => {
    if (status === "loading-model" || status === "analyzing") {
      const t = setInterval(
        () => setLoadPhase((p) => p + 1),
        status === "loading-model" ? 2500 : 900
      );
      return () => clearInterval(t);
    }
  }, [status]);

  const loadModel = async () => {
    if (pipelineRef.current) return true;
    setStatus("loading-model");
    setModelProgress(0);
    try {
      // Dynamic import to avoid SSR issues
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;

      const pipe = await pipeline(
        "image-classification",
        "prithivMLmods/Deepfake-Detection-Exp-02-21-ONNX",
        {
          // @ts-expect-error progress_callback is valid at runtime
          progress_callback: (p: { progress?: number }) => {
            if (p?.progress !== undefined) {
              setModelProgress(Math.round(p.progress));
            }
          },
        }
      );
      pipelineRef.current = pipe;
      setModelLoaded(true);
      return true;
    } catch (e) {
      console.error(e);
      setError("Failed to load detection model. Please refresh and try again.");
      setStatus("error");
      return false;
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResult(null);
    setError(null);
    setStatus("idle");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const analyze = async () => {
    if (!imageUrl) return;
    setResult(null);
    setError(null);
    setLoadPhase(0);

    const ok = await loadModel();
    if (!ok) return;

    setStatus("analyzing");
    setLoadPhase(0);

    try {
      const output = await pipelineRef.current(imageUrl, { topk: 2 });

      // Model labels: "Deepfake" (id=0) and "Real" (id=1)
      let aiScore = 0;
      let realScore = 0;
      for (const item of output) {
        const lbl = (item.label as string).toLowerCase();
        if (lbl === "deepfake") {
          aiScore = item.score * 100;
        } else if (lbl === "real") {
          realScore = item.score * 100;
        }
      }

      const verdict: "AI" | "REAL" = aiScore > realScore ? "AI" : "REAL";
      const confidence = Math.max(aiScore, realScore);

      setResult({ verdict, aiScore, realScore, confidence });
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError("Analysis failed. Please try a different image.");
      setStatus("error");
    }
  };

  const reset = () => {
    setImageUrl(null);
    setResult(null);
    setError(null);
    setStatus("idle");
    if (fileRef.current) fileRef.current.value = "";
  };

  const isAI = result?.verdict === "AI";
  const verdictColor = result
    ? isAI
      ? "var(--ai)"
      : "var(--real)"
    : "var(--neutral)";

  const currentPhase =
    status === "loading-model"
      ? loadPhrases[loadPhase % loadPhrases.length]
      : analyzePhases[loadPhase % analyzePhases.length];

  return (
    <main className={styles.main}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          <span>
            PIXEL<strong>TRUTH</strong>
          </span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          100% In-Browser · No API · No Data Sent
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          AI <span className={styles.vs}>vs</span> Real
        </h1>
        <p className={styles.heroSub}>
          Drop any image. The model runs entirely on your device.
        </p>
      </section>

      {/* ── Main Layout ── */}
      <div className={styles.layout}>
        {/* Left: Upload */}
        <div className={styles.left}>
          <div
            className={`${styles.dropzone} ${dragOver ? styles.over : ""} ${imageUrl ? styles.hasImg : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !imageUrl && fileRef.current?.click()}
          >
            {imageUrl ? (
              <div className={styles.imgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Upload" className={styles.img} />
                {result && (
                  <div
                    className={styles.imgBadge}
                    style={{
                      background: verdictColor,
                      boxShadow: `0 0 20px ${verdictColor}`,
                    }}
                  >
                    {isAI ? "⚠ AI" : "✓ REAL"}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.uploadHint}>
                <div className={styles.uploadIcon}>⬡</div>
                <p className={styles.uploadTitle}>Drop image here</p>
                <p className={styles.uploadSub}>or click to browse</p>
                <div className={styles.formats}>JPG · PNG · WEBP · GIF</div>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />

          <div className={styles.btnRow}>
            <button
              className={`${styles.btn} ${styles.btnPrimary} ${!imageUrl || status === "loading-model" || status === "analyzing" ? styles.btnDisabled : ""}`}
              onClick={analyze}
              disabled={
                !imageUrl ||
                status === "loading-model" ||
                status === "analyzing"
              }
            >
              {status === "loading-model" || status === "analyzing" ? (
                <span className={styles.btnLoading}>
                  <span className={styles.spinner} />
                  {currentPhase}
                </span>
              ) : (
                "◈ Analyze Image"
              )}
            </button>

            {imageUrl && (
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={reset}>
                ✕
              </button>
            )}
          </div>

          {/* Model loading progress */}
          {status === "loading-model" && (
            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${modelProgress}%` }}
                />
              </div>
              <span className={styles.progressLabel}>
                Downloading model… {modelProgress}%
              </span>
            </div>
          )}

          {modelLoaded && status === "idle" && (
            <p className={styles.modelReady}>✓ Model cached · Ready</p>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {/* Info cards */}
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>🧠</span>
              <div>
                <strong>ViT Model</strong>
                <p>Vision Transformer fine-tuned on real vs deepfake datasets</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>🔒</span>
              <div>
                <strong>Fully Private</strong>
                <p>Images never leave your browser — zero server contact</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>⚡</span>
              <div>
                <strong>Cached After First Use</strong>
                <p>Model downloads once (~90MB), then works offline</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className={styles.right}>
          {status === "idle" && !result && (
            <div className={styles.empty}>
              <div className={styles.emptyGlyph}>◈</div>
              <p>Upload an image<br />to begin detection</p>
            </div>
          )}

          {(status === "loading-model" || status === "analyzing") && (
            <div className={styles.scanning}>
              <div className={styles.scanRing}>
                <div className={styles.scanPulse} />
                <div className={styles.scanLine} />
              </div>
              <p className={styles.scanLabel}>{currentPhase}</p>
              {status === "loading-model" && (
                <p className={styles.scanSub}>First run downloads ~90MB</p>
              )}
            </div>
          )}

          {result && status === "done" && (
            <div
              className={styles.results}
              style={{
                borderColor: isAI
                  ? "rgba(255,64,96,0.3)"
                  : "rgba(0,214,143,0.3)",
                boxShadow: isAI ? "var(--glow-ai)" : "var(--glow-real)",
              }}
            >
              {/* Verdict */}
              <div
                className={styles.verdict}
                style={{
                  background: isAI
                    ? "rgba(255,64,96,0.08)"
                    : "rgba(0,214,143,0.08)",
                  borderBottomColor: isAI
                    ? "rgba(255,64,96,0.2)"
                    : "rgba(0,214,143,0.2)",
                }}
              >
                <span
                  className={styles.verdictIcon}
                  style={{ color: verdictColor }}
                >
                  {isAI ? "⚠" : "✓"}
                </span>
                <div>
                  <div
                    className={styles.verdictText}
                    style={{ color: verdictColor }}
                  >
                    {isAI ? "AI GENERATED" : "REAL IMAGE"}
                  </div>
                  <div className={styles.verdictConf}>
                    {result.confidence.toFixed(1)}% confidence
                  </div>
                </div>
              </div>

              {/* Circles */}
              <div className={styles.circles}>
                <ScoreCircle
                  value={result.aiScore}
                  label="AI"
                  color="var(--ai)"
                />
                <div className={styles.divider} />
                <ScoreCircle
                  value={result.realScore}
                  label="Real"
                  color="var(--real)"
                />
              </div>

              {/* Meters */}
              <div className={styles.meters}>
                <Meter
                  label="AI Probability"
                  value={result.aiScore}
                  color="var(--ai)"
                  glow="0 0 12px rgba(255,64,96,0.6)"
                />
                <Meter
                  label="Real Probability"
                  value={result.realScore}
                  color="var(--real)"
                  glow="0 0 12px rgba(0,214,143,0.6)"
                />
              </div>

              {/* Interpretation */}
              <div className={styles.interpret}>
                <span className={styles.interpretTag}>INTERPRETATION</span>
                <p className={styles.interpretText}>
                  {isAI
                    ? result.aiScore > 85
                      ? "Very high likelihood this image was generated by an AI model (Midjourney, DALL·E, Stable Diffusion, etc.)."
                      : result.aiScore > 65
                      ? "Likely AI-generated. Some characteristics match synthetic imagery patterns."
                      : "Possibly AI-generated, but the model is not fully certain. Inspect manually."
                    : result.realScore > 85
                    ? "High confidence this is an authentic photograph with no synthetic manipulation detected."
                    : result.realScore > 65
                    ? "Likely a real image, though some unusual features were noted."
                    : "Probably real, but confidence is low. The image may have been edited."}
                </p>
              </div>

              {/* Analyze again */}
              <button
                className={`${styles.btn} ${styles.btnSecondaryFull}`}
                onClick={() => fileRef.current?.click()}
              >
                Try Another Image
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        Model: <strong>Deep-Fake-Detector-v2</strong> (ViT) via Transformers.js
        · Runs entirely on your device · No data leaves your browser
      </footer>
    </main>
  );
}
