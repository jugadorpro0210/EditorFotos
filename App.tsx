
import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, History, Wand2, ArrowLeft, RefreshCw, Eraser, CameraIcon, Sparkles } from 'lucide-react';
import { analyzeUserPhoto, generateHistoricalScene, editHistoricalImage } from './services/geminiService';
import { Era, AnalysisResult, GeneratedImage } from './types';
import Header from './components/Header';
import EraSelector from './components/EraSelector';
import PhotoBooth from './components/PhotoBooth';
import ImageEditor from './components/ImageEditor';

const App: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'selecting' | 'result'>('upload');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const handlePhotoCaptured = async (photo: string) => {
    setUserPhoto(photo);
    setLoading(true);
    setLoadingMsg('Analizando tu esencia con Gemini 3 Pro...');
    try {
      const result = await analyzeUserPhoto(photo);
      setAnalysis(result);
      setStep('selecting');
    } catch (err) {
      alert('Error analizando la foto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEraSelected = async (era: Era) => {
    if (!analysis) return;
    setLoading(true);
    setLoadingMsg(`Viajando al ${era}... preparando tu llegada.`);
    try {
      const imageUrl = await generateHistoricalScene(analysis, era);
      const newImg: GeneratedImage = {
        url: imageUrl,
        era,
        prompt: `Generado en ${era}`,
        timestamp: Date.now()
      };
      setCurrentImage(newImg);
      setHistory(prev => [newImg, ...prev]);
      setStep('result');
    } catch (err) {
      alert('Error en el viaje temporal. La línea del tiempo es inestable.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (prompt: string) => {
    if (!currentImage) return;
    setLoading(true);
    setLoadingMsg('Aplicando modificaciones mágicas...');
    try {
      const editedUrl = await editHistoricalImage(currentImage.url, prompt);
      const newImg: GeneratedImage = {
        ...currentImage,
        url: editedUrl,
        prompt: prompt,
        timestamp: Date.now()
      };
      setCurrentImage(newImg);
      setHistory(prev => [newImg, ...prev]);
    } catch (err) {
      alert('No se pudo modificar la imagen. Intenta con otra instrucción.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('upload');
    setUserPhoto(null);
    setAnalysis(null);
    setCurrentImage(null);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={32} />
            </div>
            <p className="text-xl font-medium text-sky-200 animate-pulse">{loadingMsg}</p>
          </div>
        ) : (
          <>
            {step === 'upload' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold gradient-text">Tu Viaje Empieza Aquí</h2>
                  <p className="text-slate-400 text-lg">Sube una foto o usa la cámara para que nuestra IA capture tu esencia.</p>
                </div>
                <PhotoBooth onCaptured={handlePhotoCaptured} />
              </div>
            )}

            {step === 'selecting' && analysis && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="flex items-center space-x-4">
                  <button onClick={reset} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-3xl font-bold">Elige tu Destino</h2>
                </div>
                <EraSelector onSelect={handleEraSelected} />
              </div>
            )}

            {step === 'result' && currentImage && (
              <div className="space-y-8 animate-in zoom-in duration-500">
                <div className="flex justify-between items-center">
                  <button onClick={() => setStep('selecting')} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    <span>Cambiar Época</span>
                  </button>
                  <button onClick={reset} className="flex items-center space-x-2 text-sky-400 hover:text-sky-300 font-medium">
                    <RefreshCw size={20} />
                    <span>Nueva Foto</span>
                  </button>
                </div>
                
                <ImageEditor 
                  image={currentImage} 
                  onEdit={handleEdit} 
                  history={history.filter(h => h.era === currentImage.era)}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer / History Toggle (Mobile Friendly) */}
      {!loading && history.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="glass p-3 rounded-2xl flex items-center space-x-4 shadow-2xl">
            <div className="flex -space-x-3">
              {history.slice(0, 3).map((img, i) => (
                <img key={i} src={img.url} className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" alt="Historial" />
              ))}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{history.length} Viajes Realizados</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
