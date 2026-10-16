import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { exercises } from '../data/mockData';
import VideoCapture from '../components/VideoCapture';
import Badge from '../components/Badge';
import type { ExerciseCategory } from '../types';
import type { FaceMetrics } from '../hooks/useFaceTracking';

// Heuristic, hand-tuned ranges — not clinically calibrated. Every category is scored
// against mouth opening or lip stretch, the only movements a webcam can reliably see;
// true tongue-tip position can't be tracked through the teeth/cheeks.
const CATEGORY_TARGETS: Record<ExerciseCategory, { key: keyof Omit<FaceMetrics, 'faceDetected'>; label: string; range: [number, number] }> = {
  tongue: { key: 'mouthOpenRatio', label: 'Mouth open', range: [0.12, 0.55] },
  jaw: { key: 'mouthOpenRatio', label: 'Jaw drop', range: [0.18, 0.6] },
  breath: { key: 'mouthOpenRatio', label: 'Mouth open', range: [0.04, 0.22] },
  lips: { key: 'lipWidthRatio', label: 'Lip stretch', range: [0.38, 0.62] },
};

export default function ExercisePlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const exercise = exercises.find(e => e.id === id);

  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [noFaceWarning, setNoFaceWarning] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [liveMetrics, setLiveMetrics] = useState<FaceMetrics>({ mouthOpenRatio: 0, lipWidthRatio: 0, faceDetected: false });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const samplesRef = useRef<FaceMetrics[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
    };
  }, []);

  if (!exercise) return (
    <div className="text-center py-20">
      <p className="text-slate-400">Exercise not found.</p>
      <button onClick={() => navigate('/exercises')} className="mt-4 text-indigo-600 hover:underline">← Back</button>
    </div>
  );

  const target = CATEGORY_TARGETS[exercise.category];

  const categoryColors: Record<string, string> = {
    tongue: 'text-indigo-600 bg-indigo-50',
    lips: 'text-emerald-600 bg-emerald-50',
    jaw: 'text-amber-600 bg-amber-50',
    breath: 'text-purple-600 bg-purple-50',
  };

  function finishRecording(): Promise<string | null> {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return Promise.resolve(null);
    return new Promise(resolve => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        resolve(blob.size > 0 ? URL.createObjectURL(blob) : null);
      };
      recorder.stop();
    });
  }

  function computeScore() {
    const samples = samplesRef.current;
    if (samples.length === 0) return { score: 0, noFace: true };

    const detected = samples.filter(s => s.faceDetected);
    if (detected.length / samples.length < 0.3) return { score: 0, noFace: true };

    const inRange = detected.filter(s => {
      const value = s[target.key];
      return value >= target.range[0] && value <= target.range[1];
    });
    const fraction = inRange.length / detected.length;
    return { score: Math.round(Math.min(100, Math.max(40, 60 + 40 * fraction))), noFace: false };
  }

  const handleStream = useCallback((stream: MediaStream | null) => {
    if (!stream) return;
    chunksRef.current = [];
    try {
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch {
      mediaRecorderRef.current = null;
    }
  }, []);

  const handleMetrics = useCallback((metrics: FaceMetrics) => {
    setLiveMetrics(metrics);
    samplesRef.current.push(metrics);
  }, []);

  function handleStart() {
    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current);
      recordingUrlRef.current = null;
    }
    setRecordingUrl(null);
    setScore(null);
    setNoFaceWarning(false);
    samplesRef.current = [];
    setActive(true);
    setStep(0);

    intervalRef.current = setInterval(() => {
      setStep(prev => {
        if (prev >= exercise!.instructions.length - 1) {
          clearInterval(intervalRef.current!);
          void endSession();
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
  }

  async function endSession() {
    setActive(false);
    const url = await finishRecording();
    recordingUrlRef.current = url;
    setRecordingUrl(url);
    const result = computeScore();
    setNoFaceWarning(result.noFace);
    setScore(result.score);
  }

  function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    void endSession();
    setStep(0);
  }

  const inTarget = liveMetrics.faceDetected &&
    liveMetrics[target.key] >= target.range[0] &&
    liveMetrics[target.key] <= target.range[1];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/exercises')} className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1">
        ← Back to Exercises
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera panel */}
        <div className="space-y-4">
          <VideoCapture
            active={active}
            showGuide={true}
            targetPosition={exercise.tongueGuide}
            metricLabel={target.label}
            metricKey={target.key}
            inTarget={inTarget}
            onMetrics={handleMetrics}
            onStream={handleStream}
          />

          <div className="flex gap-3">
            {!active && score === null && (
              <button onClick={handleStart} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                ▶ Start Exercise
              </button>
            )}
            {active && (
              <button onClick={handleStop} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                ⏹ Stop
              </button>
            )}
            {score !== null && (
              <button onClick={handleStart} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                🔄 Try Again
              </button>
            )}
          </div>

          {score !== null && (
            <div className={`rounded-2xl p-6 text-center border ${noFaceWarning ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
              {noFaceWarning ? (
                <>
                  <div className="text-5xl mb-2">🙈</div>
                  <p className="text-amber-700 font-bold">Couldn't see your face clearly</p>
                  <p className="text-amber-600 text-sm mt-1">Move closer to the camera and make sure the room is well-lit, then try again.</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-2">{score >= 90 ? '🌟' : score >= 75 ? '⭐' : '💪'}</div>
                  <p className="text-emerald-700 font-bold text-3xl">{score}%</p>
                  <p className="text-emerald-600 text-sm mt-1">
                    {score >= 90 ? 'Excellent mouth & jaw control!' : score >= 75 ? 'Good work, keep practicing!' : 'Getting better! Try again.'}
                  </p>
                  <div className="mt-3 text-xs text-emerald-500">
                    AI measured {target.label.toLowerCase()} across the session
                  </div>
                </>
              )}
            </div>
          )}

          {recordingUrl && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
              <p className="text-sm font-semibold text-slate-700">▶ Watch your session</p>
              <video src={recordingUrl} controls className="w-full rounded-xl bg-slate-900" style={{ transform: 'scaleX(-1)' }} />
            </div>
          )}
        </div>

        {/* Instructions panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{exercise.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{exercise.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge difficulty={exercise.difficulty} />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${categoryColors[exercise.category]}`}>
                    {exercise.category}
                  </span>
                  <span className="text-slate-400 text-xs">{exercise.duration}s</span>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm">{exercise.description}</p>
          </div>

          {/* Target movement highlight */}
          <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">{exercise.tongueGuide}</span>
            <div>
              <p className="text-indigo-700 text-xs font-semibold uppercase tracking-wide">Target Movement</p>
              <p className="text-indigo-600 text-sm">{exercise.targetMovement}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-700 mb-3">Step-by-step Instructions</h3>
            <ol className="space-y-3">
              {exercise.instructions.map((inst, i) => (
                <li key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                  active && i === step ? 'bg-indigo-50 border border-indigo-200 scale-[1.01]' :
                  (active && i < step) || (score !== null) ? 'bg-emerald-50' : 'bg-slate-50'
                }`}>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    (active && i < step) || (score !== null) ? 'bg-emerald-500 text-white' :
                    active && i === step ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {(active && i < step) || (score !== null) ? '✓' : i + 1}
                  </span>
                  <span className="text-slate-700 text-sm">{inst}</span>
                </li>
              ))}
            </ol>
          </div>

          {active && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              <strong>🤖 AI Feedback:</strong> {
                step === 0 ? 'Position your face in the camera frame...' :
                !liveMetrics.faceDetected ? 'Looking for your face...' :
                `Tracking ${target.label.toLowerCase()} — ${inTarget ? 'great, keep it there!' : 'adjust to match the target.'}`
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
