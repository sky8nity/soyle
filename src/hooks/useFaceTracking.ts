import { useRef, useState, useCallback, useEffect } from 'react';
import { FaceLandmarker, FilesetResolver, type NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface FaceMetrics {
  mouthOpenRatio: number; // vertical lip gap / face height
  lipWidthRatio: number; // mouth corner span / face width
  faceDetected: boolean;
}

export type TrackingStatus = 'idle' | 'requesting' | 'loading' | 'ready' | 'denied' | 'error';

// Outer lip contour, in drawing order, from MediaPipe's 478-point face mesh.
export const LIP_CONTOUR_INDICES = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61,
];

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

function getFaceLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = FilesetResolver.forVisionTasks(WASM_URL).then(fileset =>
      FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
      })
    );
  }
  return landmarkerPromise;
}

const EMPTY_METRICS: FaceMetrics = { mouthOpenRatio: 0, lipWidthRatio: 0, faceDetected: false };

function dist(a: NormalizedLandmark, b: NormalizedLandmark) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function useFaceTracking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [status, setStatus] = useState<TrackingStatus>('idle');
  const [metrics, setMetrics] = useState<FaceMetrics>(EMPTY_METRICS);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);

  const loop = useCallback((landmarker: FaceLandmarker) => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(() => loop(landmarker));
      return;
    }

    const result = landmarker.detectForVideo(video, performance.now());
    const points = result.faceLandmarks?.[0];

    if (points && points.length > 0) {
      const mouthOpen = dist(points[13], points[14]);
      const faceHeight = dist(points[10], points[152]);
      const mouthWidth = dist(points[61], points[291]);
      const faceWidth = dist(points[234], points[454]);
      setMetrics({
        mouthOpenRatio: faceHeight > 0 ? mouthOpen / faceHeight : 0,
        lipWidthRatio: faceWidth > 0 ? mouthWidth / faceWidth : 0,
        faceDetected: true,
      });
      setLandmarks(points);
    } else {
      setMetrics(EMPTY_METRICS);
      setLandmarks(null);
    }

    rafRef.current = requestAnimationFrame(() => loop(landmarker));
  }, []);

  const start = useCallback(async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus('loading');
      const landmarker = await getFaceLandmarker();
      setStatus('ready');
      loop(landmarker);
    } catch (err) {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      setStatus(err instanceof DOMException && err.name === 'NotAllowedError' ? 'denied' : 'error');
    }
  }, [loop]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setStatus('idle');
    setMetrics(EMPTY_METRICS);
    setLandmarks(null);
  }, []);

  useEffect(() => stop, [stop]);

  return { videoRef, streamRef, status, metrics, landmarks, start, stop };
}
