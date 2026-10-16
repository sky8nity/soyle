import { useEffect, useRef } from 'react';
import { useFaceTracking, LIP_CONTOUR_INDICES, type FaceMetrics } from '../../hooks/useFaceTracking';

interface Props {
  active?: boolean;
  showGuide?: boolean;
  targetPosition?: string; // emoji for target
  metricLabel?: string; // e.g. "Mouth open"
  metricKey?: 'mouthOpenRatio' | 'lipWidthRatio';
  inTarget?: boolean;
  onMetrics?: (metrics: FaceMetrics) => void;
  onStream?: (stream: MediaStream | null) => void;
}

export default function VideoCapture({
  active = false,
  showGuide = true,
  targetPosition = '⬆️',
  metricLabel = 'Mouth open',
  metricKey = 'mouthOpenRatio',
  inTarget = false,
  onMetrics,
  onStream,
}: Props) {
  const { videoRef, streamRef, status, metrics, landmarks, start, stop } = useFaceTracking();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (active) start();
    else stop();
  }, [active, start, stop]);

  useEffect(() => {
    onMetrics?.(metrics);
  }, [metrics, onMetrics]);

  useEffect(() => {
    onStream?.(status === 'ready' ? streamRef.current : null);
  }, [status, onStream, streamRef]);

  // Draw the live lip-contour overlay each time new landmarks arrive.
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    if (!landmarks) return;

    ctx.strokeStyle = inTarget ? '#10B981' : '#6366F1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    LIP_CONTOUR_INDICES.forEach((idx, i) => {
      const p = landmarks[idx];
      const x = p.x * width;
      const y = p.y * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = inTarget ? '#10B98166' : '#6366F133';
    ctx.fill();
  }, [landmarks, inTarget]);

  return (
    <div className="space-y-3">
      {/* Camera view */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)', opacity: status === 'ready' ? 1 : 0 }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Idle placeholder */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <div className="text-5xl mb-3">📷</div>
            <p className="text-slate-300 text-sm text-center px-4">Position your face in the frame<br/>then press Start</p>
          </div>
        )}

        {/* Loading AI model / requesting camera */}
        {(status === 'requesting' || status === 'loading') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-slate-900/80">
            <div className="text-4xl mb-3 animate-pulse">🤖</div>
            <p className="text-slate-300 text-sm text-center px-4">
              {status === 'requesting' ? 'Requesting camera access…' : 'Loading AI model…'}
            </p>
          </div>
        )}

        {/* Permission denied */}
        {status === 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-slate-900/90 px-6 text-center">
            <div className="text-4xl mb-3">🚫</div>
            <p className="text-slate-200 text-sm">Camera access was denied.</p>
            <p className="text-slate-400 text-xs mt-1">Allow camera access in your browser settings, then press Start again.</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-slate-900/90 px-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-slate-200 text-sm">Couldn't start the camera or AI model.</p>
            <p className="text-slate-400 text-xs mt-1">Check your camera and try again.</p>
          </div>
        )}

        {/* No face detected warning */}
        {status === 'ready' && !metrics.faceDetected && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
              <p className="text-amber-300 text-sm font-medium">No face detected — move closer to the camera</p>
            </div>
          </div>
        )}

        {/* Live metric readout */}
        {status === 'ready' && metrics.faceDetected && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 z-10">
            <p className={`text-sm font-medium text-center ${inTarget ? 'text-emerald-400' : 'text-indigo-300'}`}>
              🔍 {metricLabel}: {Math.round(metrics[metricKey] * 200)}%
            </p>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
          <div className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
          <span className="text-white text-xs font-medium">{status === 'ready' ? 'AI Active' : 'Standby'}</span>
        </div>

        {/* Recording indicator */}
        {status === 'ready' && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-500/80 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-medium">REC</span>
          </div>
        )}

        {/* Corner brackets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 480 360" preserveAspectRatio="xMidYMid meet">
          <g stroke="#4F46E5" strokeWidth="2" opacity="0.6">
            <path d="M 30 30 L 30 55 M 30 30 L 55 30" />
            <path d="M 450 30 L 450 55 M 450 30 L 425 30" />
            <path d="M 30 330 L 30 305 M 30 330 L 55 330" />
            <path d="M 450 330 L 450 305 M 450 330 L 425 330" />
          </g>
        </svg>
      </div>

      {/* Target position guide */}
      {showGuide && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
          <p className="text-xs text-indigo-500 font-medium mb-1">TARGET MOVEMENT</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{targetPosition}</span>
            <span className="text-slate-600 text-sm">Watch the overlay — your mouth and jaw should match the highlighted position</span>
          </div>
        </div>
      )}
    </div>
  );
}
