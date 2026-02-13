
import React, { useRef, useState, useCallback } from 'react';
import { Camera as CameraIcon, Upload, X, Check } from 'lucide-react';

interface Props {
  onCaptured: (photo: string) => void;
}

const PhotoBooth: React.FC<Props> = ({ onCaptured }) => {
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("No se pudo acceder a la cámara.");
      setMode(null);
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/jpeg');
        setPreview(data);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  if (preview) {
    return (
      <div className="glass p-6 rounded-3xl space-y-6 text-center">
        <div className="relative inline-block mx-auto rounded-2xl overflow-hidden border-4 border-sky-500/30">
          <img src={preview} className="max-h-[400px] w-auto" alt="Preview" />
          <button 
            onClick={() => { setPreview(null); if(mode === 'camera') startCamera(); }}
            className="absolute top-4 right-4 bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => onCaptured(preview)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-green-500/20"
          >
            <Check size={20} />
            <span>Confirmar y Analizar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <button 
        onClick={startCamera}
        className="group relative h-64 glass rounded-3xl flex flex-col items-center justify-center space-y-4 hover:border-sky-500 transition-all overflow-hidden"
      >
        <div className="bg-sky-500/10 p-5 rounded-2xl group-hover:scale-110 transition-transform">
          <CameraIcon className="text-sky-400" size={48} />
        </div>
        <span className="text-xl font-bold">Usar Cámara</span>
        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>

      <label className="group relative h-64 glass rounded-3xl flex flex-col items-center justify-center space-y-4 hover:border-purple-500 cursor-pointer transition-all overflow-hidden">
        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        <div className="bg-purple-500/10 p-5 rounded-2xl group-hover:scale-110 transition-transform">
          <Upload className="text-purple-400" size={48} />
        </div>
        <span className="text-xl font-bold">Subir Foto</span>
        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </label>

      {mode === 'camera' && !preview && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="max-w-full h-[70vh] rounded-2xl border-2 border-slate-800" />
          <div className="mt-8 flex space-x-6">
            <button onClick={() => { stopCamera(); setMode(null); }} className="bg-slate-800 p-4 rounded-full text-white">
              <X size={32} />
            </button>
            <button onClick={capture} className="bg-white p-6 rounded-full text-black shadow-2xl hover:scale-110 transition-transform">
              <CameraIcon size={40} />
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoBooth;
