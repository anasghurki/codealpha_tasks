import React, { useRef, useState, useEffect } from "react";
import CanvasDrawModule from "react-canvas-draw";
import { Undo2, Trash2, X, Plus, Minus, Download, Send } from "lucide-react";

// Safe import for older CJS modules in Vite
const CanvasDraw = CanvasDrawModule.default ? CanvasDrawModule.default : CanvasDrawModule;

const Whiteboard = ({ onClose, onSend }) => {
  const canvasRef = useRef(null);
  
  const [color, setColor] = useState("#7c3aed"); // Lumina Purple
  const [radius, setRadius] = useState(3);
  
  const colors = [
    { name: "Purple", hex: "#7c3aed" },
    { name: "Teal", hex: "#0d9488" },
    { name: "Green", hex: "#22c55e" },
    { name: "Pink", hex: "#f472b6" },
    { name: "Black", hex: "#1f2937" },
  ];

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleClear = () => {
    canvasRef.current?.clear();
  };
  
  const downloadBoard = () => {
    if(!canvasRef.current) return;
    const dataUrl = canvasRef.current.getDataURL("image/png", false, "white");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "lumina-whiteboard.png";
    a.click();
  };

  const shareToChat = () => {
    if(!canvasRef.current || !onSend) return;
    const dataUrl = canvasRef.current.getDataURL("image/png", false, "white");
    onSend(dataUrl);
    onClose();
  };

  // Prevent scroll propagation to background while drawing
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 sm:p-8">
      {/* Glassmorphism Container */}
      <div 
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100 bg-white/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-black shadow-sm">L</div>
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">Collaborative Board</h2>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Side Toolbar - Fixed Scroll Cutoff */}
          <div className="w-20 sm:w-24 border-r border-gray-100 flex flex-col items-center py-4 gap-4 bg-gray-50/50 overflow-y-auto no-scrollbar shrink-0">
            
            {/* Color Picker */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Colors</span>
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`size-8 sm:size-10 rounded-full border-2 transition-all shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 mx-auto ${
                    color === c.hex ? "border-gray-800 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            <div className="w-8 h-px bg-gray-200 shrink-0"></div>

            {/* Brush Size */}
            <div className="flex flex-col gap-2 items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Size</span>
              <button 
                onClick={() => setRadius(r => Math.min(r + 2, 20))}
                className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50"
              >
                <Plus className="size-4" />
              </button>
              <span className="font-bold text-gray-800 text-sm leading-none py-1">{radius}</span>
              <button 
                onClick={() => setRadius(r => Math.max(r - 2, 1))}
                className="p-2 bg-white rounded-full text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50"
              >
                <Minus className="size-4" />
              </button>
            </div>

            <div className="w-8 h-px bg-gray-200 shrink-0"></div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mb-4">
              <button 
                onClick={handleUndo} 
                className="p-3 bg-white rounded-xl text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 hover:text-purple-600 transition-colors group mx-auto"
                title="Undo"
              >
                <Undo2 className="size-5 group-active:-translate-y-1 transition-transform" />
              </button>
              <button 
                onClick={handleClear} 
                className="p-3 bg-white rounded-xl text-gray-600 shadow-sm border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors group mx-auto"
                title="Clear Board"
              >
                <Trash2 className="size-5 group-active:scale-90 transition-transform" />
              </button>
              <button 
                onClick={downloadBoard} 
                className="p-3 bg-white rounded-xl text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 hover:text-green-600 transition-colors group mx-auto"
                title="Save Image"
              >
                <Download className="size-5 group-active:translate-y-1 transition-transform" />
              </button>
              
              {/* Send Option */}
              <button 
                onClick={shareToChat} 
                className="p-3 bg-purple-600 rounded-xl text-white shadow-md hover:bg-purple-700 transition-colors group mx-auto mt-2"
                title="Send to Chat"
              >
                <Send className="size-5 group-active:translate-x-1 transition-transform" />
              </button>
            </div>
            
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-hidden bg-transparent relative cursor-crosshair">
            <CanvasDraw
              ref={canvasRef}
              brushColor={color}
              brushRadius={radius}
              lazyRadius={2}
              hideGrid={false}
              gridColor="rgba(124, 58, 237, 0.05)"
              canvasWidth={window.innerWidth > 1024 ? 1000 : window.innerWidth - 100}
              canvasHeight={window.innerHeight * 0.75}
              className="absolute inset-0 z-0 bg-transparent"
              style={{ background: "transparent" }}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
