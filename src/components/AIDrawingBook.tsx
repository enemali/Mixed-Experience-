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
  Settings,
  X,
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
  const [showColorPalette, setShowColorPalette] = React.useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const slideIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [showBrushSlider, setShowBrushSlider] = React.useState(false);
  const colorButtonRef = React.useRef<HTMLButtonElement>(null);
  const brushButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isStoryMode, setIsStoryMode] = React.useState(false);

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
    setShowStorySection,
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

  // Track story mode based on story generation/reading states
  React.useEffect(() => {
    const shouldShowStoryMode = isGeneratingStory || isTypingStory || isReadingStory;
    setIsStoryMode(shouldShowStoryMode);
  }, [isGeneratingStory, isTypingStory, isReadingStory]);

  // Slideshow logic for cycling through images
  React.useEffect(() => {
    if (isStoryMode && selectedHistoryIndex !== null && history[selectedHistoryIndex]) {
      // Start slideshow
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % 2); // Cycle through 0, 1 only
      }, 3000); // Change image every 3 seconds

      return () => {
        if (slideIntervalRef.current) {
          clearInterval(slideIntervalRef.current);
          slideIntervalRef.current = null;
        }
      };
    } else {
      // Clear slideshow when not in story mode
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
      setCurrentSlideIndex(0);
    }
  }, [isStoryMode, selectedHistoryIndex, history]);

  // Get current slide image
  const getCurrentSlideImage = () => {
    if (selectedHistoryIndex === null || !history[selectedHistoryIndex]) return null;
    
    const currentHistory = history[selectedHistoryIndex];
    switch (currentSlideIndex) {
      case 0: return currentHistory.generated; // AI enhanced/generated image
      case 1: return storyImageBase64 || currentHistory.generated; // Painted/story version or fallback
      default: return currentHistory.generated;
    }
  };

  const handleCloseStoryMode = () => {
    // Stop any ongoing story reading/generation
    if (isReadingStory) {
      // Stop reading story (this would need to be implemented in the hook)
      // For now, we'll just close the story mode
    }
    setIsStoryMode(false);
    // Clear slideshow
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = null;
    }
  };

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
        <div className="max-w-full mx-auto px-4 py-2">
          <div className="text-center">
            <h1 className="text-2xl font-black text-white drop-shadow-lg">
              ✨ AI Art Studio
            </h1>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex flex-row gap-1 max-w-full overflow-hidden">
        
        {/* Left Sidebar - 1/12 of body width */}
        <div className="w-1/1 flex flex-col bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 overflow-y-auto relative py-1">
          
          {/* Navigation Button */}
          <div className="px-1 mb-2">
            <button
              onClick={onBack}
              className="w-full aspect-square bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center justify-center group"
              title="Back to Library"
            >
              <ArrowLeft size={30} className="text-white" />
            </button>
            <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
              Back
            </div>
          </div>

          {/* Drawing Actions Group */}
          <div className="px-1 mb-3">
            
            <div className="flex flex-col gap-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={getDrawingIdea}
                  disabled={isGettingIdea}
                  className="w-full aspect-square bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20 flex items-center justify-center"
                  title="Get Drawing Idea"
                >
                  {isGettingIdea ? (
                    <Loader size={30} className="animate-spin" />
                  ) : (
                    <Lightbulb size={30} />
                  )}
                </button>
                <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                  Idea
                </div>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={enhanceDrawing}
                  disabled={isGenerating || history.length >= 5 || showWebcam}
                  className="w-full aspect-square bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20 flex items-center justify-center"
                  title="AI Magic"
                >
                  {isGenerating ? (
                    <Loader size={30} className="animate-spin" />
                  ) : (
                    <Wand2 size={30} />
                  )}
                </button>
                <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                  Magic
                </div>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={handleClearAll}
                  className="w-full aspect-square bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 flex items-center justify-center"
                  title="Clear All"
                >
                  <Trash2 size={30} />
                </button>
                <div className="text-white text-xs text-center opacity-0 lg:opacity-100 transition-opacity duration-300">
                  Clear
                </div>
              </div>

              {showStorySection && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setShowWebcam(true)}
                    disabled={showWebcam}
                    className="w-full aspect-square bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30 flex items-center justify-center"
                    title="Take Photo"
                  >
                    <Camera size={30} />
                  </button>
                  <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                    Photo
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Story Tools Group */}
          {hasGeneratedContent && (
            <div className="px-1 mb-3">
              <div className="text-white text-xs text-center mb-2 opacity-0 lg:opacity-100 font-semibold">
                {/* Story buttons */}
              </div>
              <div className="flex flex-col gap-1">
                {(!story || (selectedHistoryIndex !== null && history[selectedHistoryIndex] && !history[selectedHistoryIndex].story)) && (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={generateStory}
                      disabled={isGeneratingStory || isTypingStory}
                      className="w-full aspect-square bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20 flex items-center justify-center"
                      title="Generate Story"
                    >
                      {isGeneratingStory || isTypingStory ? (
                        <Loader size={30} className="animate-spin" />
                      ) : (
                        <Zap size={30} />
                      )}
                    </button>
                    <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                      Create
                    </div>
                  </div>
                )}

                {!isTypingStory && story && (
                  <div className="flex flex-col items-center">
                    <button
                      className="w-full aspect-square bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 flex items-center justify-center"
                      onClick={() => handleReadStory('pollinations')}
                      disabled={isReadingStory}
                      title="Read Story"
                    >
                      {isReadingStory ? (
                        <Loader size={30} className="animate-spin" />
                      ) : (
                        <Volume2 size={30} />
                      )}
                    </button>
                    <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                      Read
                    </div>
                  </div>
                )}

                {!isTypingStory && story && generatedAudioBlob && (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={generateAndDownloadVideo}
                      disabled={isGeneratingVideo || selectedHistoryIndex === null || ffmpegLoading || !ffmpegLoaded}
                      className="w-full aspect-square bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20 flex items-center justify-center"
                      title="Generate Video"
                    >
                      {ffmpegLoading ? (
                        <Loader size={30} className="animate-spin" />
                      ) : isGeneratingVideo ? (
                        <Loader size={30} className="animate-spin" />
                      ) : (
                        <Download size={30} />
                      )}
                    </button>
                    <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                      Video
                    </div>
                  </div>
                )}

                {story && (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setShowStorySection(!showStorySection)}
                      className="w-full aspect-square bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center justify-center"
                      title="Toggle Story"
                    >
                      <BookOpen size={30} />
                    </button>
                    <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                      {showStorySection ? 'Hide' : 'Show'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drawing Tools Group */}
          {hasGeneratedContent && (
            <div className="px-1">
              <div className="text-white text-xs text-center mb-2 opacity-0 lg:opacity-100 font-semibold">
                Tools
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-col items-center">
                  <button
                    onClick={togglePenMode}
                    disabled={!hasGeneratedContent}
                    className={`w-full aspect-square rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border flex items-center justify-center ${isPenMode
                        ? 'bg-purple-500/80 text-white border-white/30'
                        : 'bg-white/20 text-white hover:bg-white/30 border-white/20'
                      }`}
                    title={isPenMode ? 'Switch to Fill Tool' : 'Switch to Pen Tool'}
                  >
                    {isPenMode ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v11H4V4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                    {isPenMode ? 'Pen' : 'Fill'}
                  </div>
                </div>

                {isPenMode && (
                  <div className="flex flex-col items-center relative">
                    <button
                      ref={brushButtonRef}
                      onClick={() => setShowBrushSlider(!showBrushSlider)}
                      className="w-full aspect-square bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center justify-center"
                      title="Brush Size"
                    >
                      <Settings size={30} />
                    </button>
                    <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                      Size
                    </div>
                    
                    {/* Brush Size Slider - positioned next to button */}
                    {showBrushSlider && (
                      <div className="absolute left-full top-0 ml-2 bg-white/90 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 p-3 z-50 transform transition-all duration-300 ease-out animate-in slide-in-from-left-2">
                        <div className="flex flex-col items-center gap-2">
                          <label className="text-gray-800 text-xs font-medium">Brush Size</label>
                          <input
                            type="range"
                            min="2"
                            max="20"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="text-gray-600 text-xs">{brushSize}px</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col items-center relative">
                  <button
                    ref={colorButtonRef}
                    onClick={() => setShowColorPalette(!showColorPalette)}
                    className="w-full aspect-square rounded-full border-2 border-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: selectedColor }}
                    title="Color Palette"
                  >
                    <Palette size={30} className="text-white drop-shadow-lg" />
                  </button>
                  <div className="text-white text-xs text-center mt-1 opacity-0 lg:opacity-100 transition-opacity duration-300">
                    Color
                  </div>
                  
                  {/* Color Palette - positioned next to button */}
                  {showColorPalette && (
                    <div className="absolute  top-14  bg-white/90 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 z-50 transform transition-all duration-300 ease-out animate-in slide-in-from-left-2">
                      <div className="flex flex-col gap-1">
                        {/* <h4 className="text-gray-800 text-xs font-medium text-center">Colors</h4> */}
                        <div className="flex flex-col gap-1">
                          {colors.map((color, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                handleColorSelect(color, e);
                                // setShowColorPalette(false);
                              }}
                              disabled={!hasGeneratedContent}
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${selectedColor === color ? 'border-gray-800 ring-2 ring-gray-400' : 'border-white/50'
                                }`}
                              style={{ backgroundColor: color }}
                              title={`Color: ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area - Different layouts based on story mode */}
        <div className="flex-1 flex flex-col gap-2 min-w-0 relative overflow-hidden">
          
          {/* Story Mode Layout */}
          <div className={`absolute inset-0 z-20 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-600 transition-all duration-700 ease-in-out ${
            isStoryMode 
              ? 'transform translate-x-0 opacity-100' 
              : 'transform translate-x-full opacity-0 pointer-events-none'
          }`}>
              {/* Close Button */}
              <button
                onClick={handleCloseStoryMode}
                className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-300 transform hover:scale-110 border border-white/30 flex items-center justify-center group"
                title="Close Story Mode"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="h-full flex gap-4 p-4">
                {/* AI Generated Image - Left Side */}
                <div className={`w-1/2 flex flex-col transition-all duration-700 ease-in-out ${
                  isStoryMode 
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform -translate-x-full opacity-0'
                }`}>
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 flex-1">
                    <div className="bg-gradient-to-r from-green-500/50 to-blue-500/50 backdrop-blur-sm p-2 rounded-t-lg">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Wand2 size={20} />
                        AI Illustration
                      </h3>
                    </div>
                    <div className="p-4 flex-1 flex items-center justify-center">
                      <div className="relative aspect-square bg-white/95 rounded-lg overflow-hidden shadow-inner max-w-full max-h-full">
                        {/* Slideshow indicator */}
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                          {currentSlideIndex === 0 ? 'AI Enhanced' : 'Painted Version'}
                        </div>
                        
                        {/* Drawn Image Overlay - Top Left */}
                        {selectedHistoryIndex !== null && history[selectedHistoryIndex] && (
                          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                              <img
                                src={`data:image/png;base64,${history[selectedHistoryIndex].sketch}`}
                                alt="Your Original Drawing"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                              Your Drawing
                            </div>
                          </div>
                        )}
                        
                        {storyImageBase64 ? (
                          <img
                            src={`data:image/png;base64,${getCurrentSlideImage()}`}
                            alt={currentSlideIndex === 0 ? 'AI Enhanced Art' : 'Painted Version'}
                            className="w-full h-full object-fill rounded-lg transition-opacity duration-500"
                            key={currentSlideIndex} // Force re-render for smooth transition
                          />
                        ) : selectedHistoryIndex !== null && history[selectedHistoryIndex] ? (
                          <img
                            src={`data:image/png;base64,${getCurrentSlideImage()}`}
                            alt={currentSlideIndex === 0 ? 'AI Enhanced Art' : 'Painted Version'}
                            className="w-full h-full object-fill rounded-lg transition-opacity duration-500"
                            key={currentSlideIndex} // Force re-render for smooth transition
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Sparkles size={48} className="opacity-50" />
                          </div>
                        )}
                        
                        {/* Slideshow navigation dots */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {[0, 1].map((index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlideIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentSlideIndex 
                                  ? 'bg-white scale-125' 
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                              title={index === 0 ? 'AI Enhanced' : 'Painted Version'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Text - Right Side */}
                <div className={`w-1/2 flex flex-col transition-all duration-700 ease-in-out delay-200 ${
                  isStoryMode 
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform translate-x-full opacity-0'
                }`}>
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 flex-1">
                    <div className="bg-gradient-to-r from-orange-500/50 to-pink-500/50 backdrop-blur-sm p-2 rounded-t-lg">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <BookOpen size={20} />
                        {isGeneratingStory ? 'Creating Story...' : isTypingStory ? 'Writing Story...' : isReadingStory ? 'Reading Story...' : 'Your Story'}
                      </h3>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto transform transition-all duration-500 ease-out">
                      <div className="text-white text-lg leading-relaxed">
                        {/* ----------------------------------- */}
                        {(story || displayedStory) && (
                            <div className="w-full rounded-lg border border-white/20 p-4 transform transition-all duration-300 ease-out">
                              <div className="text-lg leading-relaxed text-white">
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
                        {/* ----------------------------------- */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          

          {/* Normal Layout - Hidden when in story mode */}
          <div className={`transition-all duration-700 ease-in-out ${
            isStoryMode 
              ? 'transform -translate-x-full opacity-0 pointer-events-none' 
              : 'transform translate-x-0 opacity-100'
          }`}>

          {/* AI Prompt Display */}
          {currentPrompt && (
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 shadow-lg border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb size={30} className="text-yellow-300" />
                <span className="font-bold text-white text-sm">Drawing Inspiration:</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">{currentPrompt}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/50 text-red-100 rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-300">⚠️</span>
                <span className="font-semibold text-sm">Error:</span>
              </div>
              <p className="text-xs">{error}</p>
            </div>
          )}

          {/* Canvas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1">

            {/* Drawing Canvas */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/50 to-pink-500/50 backdrop-blur-sm">
                Draw here
              </div>

              <div className="p-1">
                <div className="relative aspect-square bg-white/95 rounded-lg overflow-hidden shadow-inner">

                  {recognizedImage && (
                    <div className="absolute top-1 left-1 right-1 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-600 rounded-lg p-1 z-10">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-bold text-xs">AI Vision: {recognizedImage}</span>
                      </div>
                    </div>
                  )}

                  <canvas
                    ref={sketchCanvasRef}
                    className={`w-full h-full rounded-lg cursor-crosshair transition-opacity duration-300 ${showWebcam ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    style={{ touchAction: 'none' }}
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
                        <Palette size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="font-medium text-sm">Start drawing!</p>
                      </div>
                    </div>
                  )}

                </div>

                
              </div>
            </div>

            {/* Gallery */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl  border border-white/20">
                  {/* <h4 className="text-white font-bold text-center  text-sm">Gallery ({history.length}/5)</h4> */}
                  
                  <div className="grid grid-cols-5 gap-1">
                    {history.length === 0 ? (
                      <div className="col-span-5 text-center text-white/60 py-2">
                        <span className="text-xs">No drawings</span>
                      </div>
                    ) : (
                      history.map((item, index) => (
                        <div
                          key={index}
                          className={`w-18 h-18 relative aspect-square border-2 rounded-lg cursor-pointer overflow-hidden transform transition-all duration-300 hover:scale-105
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
                            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-all duration-200 shadow-lg"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div> 
            
            {/* AI Generated Canvas */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500/50 to-blue-500/50 backdrop-blur-sm">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <Wand2 size={18} />
                  AI Drawing
                </h3>
              </div>

              <div className="p-2">
                <div className="relative aspect-square bg-white/95 rounded-lg overflow-hidden shadow-inner">
                  <MagicWandAnimation isVisible={isGenerating} />

                  <canvas
                    ref={coloringCanvasRef}
                    className={`w-full h-full rounded-lg ${hasGeneratedContent ? "block cursor-crosshair" : "hidden"}`}
                    style={{
                      zIndex: 10,
                      position: "relative",
                      touchAction: 'none'
                    }}
                    onMouseDown={handleColoringClick}
                    onMouseMove={handleColoringMouseMove}
                    onMouseUp={handleColoringMouseUp}
                    onMouseLeave={handleColoringMouseUp}
                    onTouchStart={handleColoringClick}
                    onTouchMove={handleColoringMouseMove}
                    onTouchEnd={handleColoringMouseUp}
                    onTouchCancel={handleColoringMouseUp}
                  />

                  {!isGenerating && !hasGeneratedContent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="font-medium text-sm">AI artwork appears here!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Story Section Overlay */}
              <div>
                  {showStorySection && (
                    <div className="absolute z-40 flex items-center justify-center rounded-lg bg-black/70"> 
                      <div className="flex gap-2 w-full max-w-2xl">
                        {/* Drawn Image on the Left */}
                        {/* <div className="flex-shrink-0 w-12 h-12">
                          {selectedHistoryIndex !== null && history[selectedHistoryIndex] && (
                            <img
                              src={`data:image/png;base64,${history[selectedHistoryIndex].sketch}`}
                              alt="Your Drawing"
                              className="w-full h-full object-cover rounded-lg border-2 border-red-500 shadow-lg"
                            />
                          )}
                        </div> */}
                        {/* Story Content on the Right */}
                        <div className="flex-1 min-w-0">
                          {(story || displayedStory) && (
                            <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-1">
                              <div className="text-xs leading-relaxed text-white">
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
                    </div>
                  )}
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