import { useState } from 'react';
import { UploadCloud, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DetectTab() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
const handleFileSelection = (selectedFile) => {
  setFile({ url: URL.createObjectURL(selectedFile), raw: selectedFile });
  setResult(null);
};

const runAnalysis = async () => {
  setIsAnalyzing(true);
  try {
    const formData = new FormData();
    formData.append("file", file.raw);
    const response = await fetch("https://deepfake-detection2.onrender.com/predict", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setResult({
      isDeepfake: data.label === "FAKE",
      confidence: (data.confidence * 100).toFixed(1),
      anomalies: data.label === "FAKE" ? ["Model detected synthetic patterns"] : []
    });
  } catch (err) {
    console.error(err);
  } finally {
    setIsAnalyzing(false);
  }
};

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h2 className="text-4xl font-light tracking-tight">Media <span className="font-bold">Analysis</span></h2>
        <p className="text-gray-400 mt-2">Upload synthetic media to run inference through the backend detection model.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Upload Zone */}
        <div 
          className={`glass-panel rounded-2xl flex flex-col items-center justify-center p-8 transition-colors duration-300 relative overflow-hidden ${
            dragActive ? 'border-neon-blue bg-neon-blue/5' : 'border-white/10'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="w-full h-full flex flex-col items-center">
              <img src={file.url} alt="Preview" className="max-h-64 object-contain rounded-lg mb-6 shadow-2xl" />
              <button 
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 relative overflow-hidden"
              >
                {isAnalyzing ? 'Running Inference...' : 'Analyze Media'}
                {isAnalyzing && (
                  <motion.div 
                    className="absolute inset-0 bg-neon-blue/20"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                )}
              </button>
            </div>
          ) : (
            <>
              <UploadCloud size={48} className="text-gray-400 mb-4" />
              <p className="text-lg mb-2 text-center font-light tracking-wide">Drag and drop media here</p>
              <p className="text-sm text-gray-500 text-center mb-6 font-mono">Supports JPG, PNG, MP4</p>
              <label className="px-6 py-3 border border-white/20 rounded-full cursor-pointer hover:bg-white/10 transition-colors uppercase tracking-widest text-xs">
                Browse Files
                <input type="file" className="hidden" onChange={(e) => handleFileSelection(e.target.files[0])} />
              </label>
            </>
          )}
        </div>

        {/* Results Zone */}
        <div className="glass-panel rounded-2xl p-8 flex flex-col">
          <h3 className="text-xl font-medium mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Inference Report</h3>
          
          {!result && !isAnalyzing && (
            <div className="flex-1 flex items-center justify-center text-gray-500 font-light">
              Awaiting media input...
            </div>
          )}

          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-neon-blue font-mono text-sm animate-pulse uppercase tracking-widest">Extracting features...</p>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full"
            >
              <div className={`p-6 rounded-xl border flex items-center space-x-4 mb-8 ${result.isDeepfake ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
                {result.isDeepfake ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
                <div>
                  <h4 className="text-2xl font-bold tracking-tight">{result.isDeepfake ? 'Deepfake Detected' : 'Authentic Media'}</h4>
                  <p className="text-sm opacity-80 uppercase tracking-widest mt-1">Confidence Score: <span className="font-mono font-bold text-lg">{result.confidence}%</span></p>
                </div>
              </div>

              {result.isDeepfake && (
                <div>
                  <h5 className="text-xs text-gray-400 uppercase tracking-widest mb-3">Flagged Anomalies</h5>
                  <ul className="space-y-2">
                    {result.anomalies.map((anomaly, idx) => (
                      <li key={idx} className="bg-white/5 border border-white/10 p-3 rounded text-sm font-mono flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full before:mr-3">
                        {anomaly}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}