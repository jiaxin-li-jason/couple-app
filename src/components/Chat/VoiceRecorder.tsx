'use client';
import { useRef, useState } from 'react';

interface Props {
  onSend: (blob: Blob) => void;
  onClose: () => void;
}

export default function VoiceRecorder({ onSend, onClose }: Props) {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<NodeJS.Timeout>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        onSend(blob);
      };

      mediaRecorder.current.start();
      setRecording(true);
      setTime(0);
      timer.current = setInterval(() => setTime((t) => t + 1), 1000);
    } catch {
      alert('无法访问麦克风');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
    clearInterval(timer.current);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-2">
      {!recording ? (
        <div className="flex gap-2">
          <button onClick={startRecording} className="flex-1 bg-love-400 text-white rounded-xl py-3 text-sm font-medium">
            🎤 开始录音
          </button>
          <button onClick={onClose} className="bg-white rounded-xl px-6 py-3 text-gray-400 text-sm">取消</button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-love-400 text-lg font-bold animate-pulse">🔴 录音中 {time}s</p>
          <button onClick={stopRecording} className="mt-2 bg-white rounded-xl px-6 py-2 text-gray-600 text-sm">停止并发送</button>
        </div>
      )}
    </div>
  );
}
