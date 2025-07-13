import React from "react";
import {
  Palette,
  Sparkles,
  RotateCcw,
  BookOpen,
  Wand2,
  Camera,
  Loader,
  Lightbulb,
  Play,
  Volume2,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  Zap,
  Download,
  Eye,
} from "lucide-react";
import { GeminiService } from "../services/GeminiService";
import { useAIDrawingBookLogic } from "../hooks/useAIDrawingBookLogic";
import ColorPalette from "./ColorPalette";
import HistoryThumbnails from "./HistoryThumbnails";
import WebcamModal from "./WebcamModal";
import MagicWandAnimation from "./MagicWandAnimation";
import "../index.css";

interface AIDrawingBookProps {
  onBack: () => void;
}

const AIDrawingBook: React.FC<AIDrawingBookProps> = ({ onBack }) => {
  const {
    // Refs
    sketchCanvasRef,
    coloringCanvasRef,
    webcamVideoRef,

    // State
    selectedColor,
    hasGeneratedContent,
    currentPrompt,
    story,
    recognizedImage,
    isGenerating,
    isGettingIdea,
    isGeneratingStory,
    isTypingStory,
    displayedStory,
    showStorySection,
    error,
    isReadingStory,
    storyImageBase64,
    showStoryImage,
    history,
    selectedHistoryIndex,
    showWebcam,
    colors,

    // Video generation
    generatedAudioBlob,
    isGeneratingVideo,
    ffmpegLoaded,
    ffmpegLoading,
    generateAndDownloadVideo,

    // Pen tool state
    togglePenMode,
    isPenMode,
    brushSize,
    setBrushSize,

    // Drawing handlers
    startDrawing,
    drawSketch,
    stopDrawing,
    handleColoringClick,
    handleColorSelect,

    // Action handlers
    handleClearAll,
    getDrawingIdea,
    enhanceDrawing,
    generateStory,
    handleReadStory,

    // History handlers
    handleSelectHistory,
    handleDeleteHistory,

    // Webcam handlers
    setShowWebcam,
    handleWebcamCapture,
    handleWebcamCancel,

    // Pen tool handlers
    handleColoringMouseMove,
    handleColoringMouseUp,
  } = useAIDrawingBookLogic();

  // API Key Check UI
  if (!GeminiService.getApiKey()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md text-center border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Camera size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            AI Magic Needs Setup
          </h2>
          <p className="text-white/80 mb-6 leading-relaxed">
            To unlock the full AI drawing experience, please configure your Gemini API key in the environment variables.
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg border border-white/30"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-blue-600 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-2 py-0">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30"
            >
              <ArrowLeft size={18} className="text-white" />
              <span className="text-white font-semibold hidden sm:inline">Back</span>
            </button>

            <div className="text-center flex-1 ">
              <h1 className="text-3xl font-black text-white drop-shadow-lg">
                ✨ AI Art Studio
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-6 pt-2 pb-6 max-w-full overflow-hidden">
        {/* Center Panel - Main Canvas Area */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">

          {/* AI Prompt Display */}
          {currentPrompt && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl  shadow-lg border border-white/20">
              <div className="flex items-center">
                <Lightbulb size={18} className="text-yellow-300" />
                <span className="font-bold text-white">Drawing Inspiration:</span>
              </div>
              <p className="text-white/90 leading-relaxed">{currentPrompt}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/50 text-red-100 rounded-2xl shadow-lg">
              <div className="flex items-center ">
                <span className="text-red-300">⚠️</span>
                <span className="font-semibold">Error:</span>
              </div>
              <p className="">{error}</p>
            </div>
          )}

          {/* Canvas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 flex-1">

            {/* Drawing Canvas */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/50 to-pink-500/50 backdrop-blur-sm p-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Palette size={20} />
                    Draw Here
                  </h3>
                  <button
                    onClick={() => setShowWebcam(true)}
                    disabled={showWebcam}
                    className="flex items-center gap-2 px-4 py-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
                  >
                    <Camera size={16} />
                    <span className="hidden sm:inline">Photo</span>
                  </button>
                </div>
              </div>

              <div className="p-2">
                <div className="relative aspect-square bg-white/95 rounded-2xl overflow-hidden shadow-inner">

                {recognizedImage && (
                  <div className=" bg-white/10 backdrop-blur-sm border border-white/20 text-blue-600 rounded-xl">
                    <div className="flex flex-wrap items-center gap-2 ">
                      <span className="font-bold">AI Vision: {recognizedImage}</span>
                    </div>
                  </div>
                )}

                  <canvas
                    ref={sketchCanvasRef}
                    className={`w-full h-full rounded-2xl cursor-crosshair transition-opacity duration-300 ${showWebcam ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      }`}
                    onMouseDown={startDrawing}
                    onMouseMove={drawSketch}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={drawSketch}
                    onTouchEnd={stopDrawing}
                  />

                  {showWebcam && (
                    <WebcamModal
                      showWebcam={showWebcam}
                      webcamVideoRef={webcamVideoRef}
                      onCapture={handleWebcamCapture}
                      onCancel={handleWebcamCancel}
                    />
                  )}

                  {!showWebcam && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center text-gray-400">
                        <Palette size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Start drawing!</p>
                      </div>
                    </div>
                  )}

                </div>

                {/*  drawing Action Buttons  */}
                <div className="lg:w-full flex flex-col gap-1">
                  {/* Color Palette & Tools */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-1 border border-white/20">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2 justify-between">
                      {/* Action Buttons */}
                        <button
                          onClick={getDrawingIdea}
                          disabled={isGettingIdea}
                          className="flex items-center justify-center gap-1 px-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20"
                        >
                          {isGettingIdea ? (
                            <>
                              <Loader size={20} className="animate-spin" />
                              <span>Thinking...</span>
                            </>
                          ) : (
                            <>
                              <Lightbulb size={20} />
                              <span>Idea</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={enhanceDrawing}
                          disabled={isGenerating || history.length >= 10 || showWebcam}
                          className="flex items-center justify-center gap-1 px-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20"
                          title={
                            history.length >= 10
                              ? "Maximum of 10 drawings reached. Delete a thumbnail to create more."
                              : showWebcam
                                ? "Close camera first"
                                : undefined
                          }
                        >
                          {isGenerating ? (
                            <>
                              <Loader size={20} className="animate-spin" />
                              <span>Creating...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 size={20} />
                              <span>AI</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleClearAll}
                          className="flex items-center justify-center gap-1 px-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
                        >
                          <Trash2 size={20} />
                          <span>Clear</span>
                        </button>
                    </h4>

                    {/* gallery */}
                    <div className="w-full  justify-between">
                      <h3 className="font-bold text-white text-center">Gallery</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-1">

                      {history.length === 0 ? (
                        <div className="col-span-3 text-center text-white/60 py-8">
                          No drawings yet
                        </div>
                      ) : (
                        history.map((item, index) => (
                          <div
                            key={index}
                            className={`relative aspect-square border-2 rounded-xl cursor-pointer overflow-hidden transform transition-all duration-300 hover:scale-105
                      ${selectedHistoryIndex === index ? 'border-white ring-2 ring-white/50' : 'border-white/30 hover:border-white/50'}`}
                            onClick={() => handleSelectHistory(index)}
                          >
                            <img
                              src={`data:image/png;base64,${item.generated}`}
                              alt={`Drawing ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => handleDeleteHistory(index, e)}
                              className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 shadow-lg"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                  {/* Gallery & Controls */}
                 
                </div>

              </div>
            </div>

            {/* AI Generated Canvas */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500/50 to-blue-500/50 backdrop-blur-sm">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Wand2 size={20} />
                  AI Magic Canvas
                </h3>
              </div>

              <div className="p-2">
                <div className="relative aspect-square bg-white/95 rounded-2xl overflow-hidden shadow-inner">
                  <MagicWandAnimation isVisible={isGenerating} />

                  {storyImageBase64 && (
                    <div
                      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 z-20"
                      style={{ opacity: showStoryImage ? 1 : 0 }}
                    >
                      <img
                        src={`data:image/png;base64,${storyImageBase64}`}
                        alt="Story Illustration"
                        className={`w-full h-full object-contain rounded-2xl ${showStoryImage ? "slow-fade-animation" : ""}`}
                      />
                    </div>
                  )}

                  <canvas
                    ref={coloringCanvasRef}
                    className={`w-full h-full rounded-2xl transition-opacity duration-1000 ${hasGeneratedContent ? "block cursor-crosshair" : "hidden"
                      }`}
                    style={{
                      opacity: showStoryImage ? 0 : 1,
                      zIndex: 10,
                      position: "relative",
                    }}
                    onMouseDown={handleColoringClick}
                    onMouseMove={handleColoringMouseMove}
                    onMouseUp={handleColoringMouseUp}
                    onMouseLeave={handleColoringMouseUp}
                    onTouchStart={handleColoringClick}
                    onTouchMove={handleColoringMouseMove}
                    onTouchEnd={handleColoringMouseUp}
                  />

                {/* Story Section Overlay */}
                {showStorySection && (
                  <div className="absolute inset-0 z-40 flex flex-col justify-center items-center p-4 rounded-2xl bg-black/70">
                    <div className="w-full max-w-md">
                      <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        <button
                          onClick={generateStory}
                          disabled={isGeneratingStory || isTypingStory}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20"
                        >
                          {isGeneratingStory || isTypingStory ? (
                            <>
                              <Loader size={16} className="animate-spin" />
                              {isGeneratingStory ? 'Creating...' : 'Writing...'}
                            </>
                          ) : (
                            <>
                              <Zap size={16} />
                              Create Story
                            </>
                          )}
                        </button>

                        {!isTypingStory && story && (
                          <button
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
                            onClick={() => handleReadStory('pollinations')}
                            disabled={isReadingStory}
                          >
                            {isReadingStory ? (
                              <>
                                <Loader size={16} className="animate-spin" />
                                Reading...
                              </>
                            ) : (
                              <>
                                <Volume2 size={16} />
                                Read Aloud
                              </>
                            )}
                          </button>
                        )}

                        {!isTypingStory && story && generatedAudioBlob && (
                          <button
                            onClick={generateAndDownloadVideo}
                            disabled={isGeneratingVideo || selectedHistoryIndex === null || ffmpegLoading || !ffmpegLoaded}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20"
                          >
                            {ffmpegLoading ? (
                              <>
                                <Loader size={16} className="animate-spin" />
                                Loading...
                              </>
                            ) : isGeneratingVideo ? (
                              <>
                                <Loader size={16} className="animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Download size={16} />
                                Video
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Story Display */}
                      {(story || displayedStory) && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 max-h-40 overflow-y-auto">
                          <div className="text-sm leading-relaxed text-white">
                            {isTypingStory ? (
                              <span>
                                {displayedStory}
                                <span className="animate-pulse text-orange-300">|</span>
                              </span>
                            ) : (
                              story
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                  {hasGeneratedContent && (
                    <div className="absolute bottom-4 right-4 z-30">
                      <div
                        className="w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-colors duration-200"
                        style={{ backgroundColor: selectedColor }}
                        title={`Current color: ${selectedColor}`}
                      />
                    </div>
                  )}

                  {!isGenerating && !hasGeneratedContent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Sparkles size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="font-medium">AI artwork appears here!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/*  Tools & Story */}
              <div className="lg:w-full flex flex-col gap-1">
                {/* Color Palette & Tools */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-1 border border-white/20">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2 justify-between">
                    Tools

                    {/* Pen Tool Toggle */}
                    <button
                      onClick={togglePenMode}
                      disabled={!hasGeneratedContent}
                      className={`p-1 rounded-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border ${isPenMode
                          ? 'bg-purple-500/80 text-white border-white/30'
                          : 'bg-white/20 text-white hover:bg-white/30 border-white/20'
                        }`}
                      title={isPenMode ? 'Switch to Fill Tool' : 'Switch to Pen Tool'}
                    >
                      {isPenMode ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v11H4V4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>

                    {/* Mode Indicator */}
                    <div
                      className={`text-sm font-medium py-2 px-4 rounded-full ${isPenMode
                          ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                          : 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                        }`}
                    >
                      {isPenMode ? '✏️ Pen Mode' : '🎨 Fill Mode'}
                    </div>
                  </h4>


                  {/* Brush Size Slider */}
                  {isPenMode && hasGeneratedContent && (
                    <div className="mb-4">
                      <label className="text-white block text-center mb-2">Brush Size</label>
                      <input
                        type="range"
                        min="2"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center text-white/70 mt-1">{brushSize}px</div>
                    </div>
                  )}

                  {/* Color Grid */}
                  <div className="grid grid-cols-12 gap-1">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleColorSelect(color, e)}
                        disabled={!hasGeneratedContent}
                        className={`aspect-square rounded-2xl border-2 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${selectedColor === color ? 'border-white ring-2 ring-white/50' : 'border-white/30'
                          }`}
                        style={{ backgroundColor: color }}
                        title={`Color: ${color}`}
                      />
                    ))}
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AIDrawingBook;