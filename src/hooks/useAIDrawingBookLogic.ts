import { useState, useRef, useCallback, useEffect } from 'react';
import { GeminiService } from '../services/GeminiService';
import { PollinationsService } from '../services/PollinationsService';
import { ElevenLabsService } from '../services/ElevenLabsService';

export type ArtMode = 'happy' | 'scary' | 'science' | 'moral' | 'health' | 'adventure' | 'nature' | 'fantasy';

interface HistoryItem {
  sketch: string;
  generated: string;
  colored?: string;
  story?: string;
  prompt?: string;
}

export const useAIDrawingBookLogic = () => {
  // Refs
  const sketchCanvasRef = useRef<HTMLCanvasElement>(null);
  const coloringCanvasRef = useRef<HTMLCanvasElement>(null);
  const webcamVideoRef = useRef<HTMLVideoElement>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(5);
  const [isPenMode, setIsPenMode] = useState(false);

  // Content state
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [story, setStory] = useState('');
  const [recognizedImage, setRecognizedImage] = useState('');
  const [error, setError] = useState('');

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGettingIdea, setIsGettingIdea] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isTypingStory, setIsTypingStory] = useState(false);
  const [isReadingStory, setIsReadingStory] = useState(false);

  // Story display
  const [displayedStory, setDisplayedStory] = useState('');
  const [showStorySection, setShowStorySection] = useState(false);
  const [storyImageBase64, setStoryImageBase64] = useState<string | null>(null);
  const [showStoryImage, setShowStoryImage] = useState(false);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);

  // Webcam
  const [showWebcam, setShowWebcam] = useState(false);

  // Video generation
  const [generatedAudioBlob, setGeneratedAudioBlob] = useState<Blob | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);

  // Colors palette
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B400', '#52B788',
    '#000000', '#FFFFFF', '#FF1493', '#00CED1', '#FFD700'
  ];

  // Initialize canvases
  useEffect(() => {
    if (sketchCanvasRef.current) {
      const canvas = sketchCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }

    if (coloringCanvasRef.current) {
      const canvas = coloringCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    }
  }, []);

  // Toggle pen mode
  const togglePenMode = useCallback(() => {
    setIsPenMode(prev => !prev);
  }, []);

  // Drawing handlers
  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!sketchCanvasRef.current) return;
    e.preventDefault();
    setIsDrawing(true);
    const ctx = sketchCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, sketchCanvasRef.current);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getCoordinates]);

  const drawSketch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !sketchCanvasRef.current) return;
    e.preventDefault();

    const ctx = sketchCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, sketchCanvasRef.current);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, getCoordinates]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Coloring handlers
  const handleColoringClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!coloringCanvasRef.current || !hasGeneratedContent) return;
    e.preventDefault();

    if (isPenMode) {
      setIsDrawing(true);
      const ctx = coloringCanvasRef.current.getContext('2d');
      if (!ctx) return;

      const { x, y } = getCoordinates(e, coloringCanvasRef.current);
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      const { x, y } = getCoordinates(e, coloringCanvasRef.current);
      floodFill(x, y, selectedColor);
    }
  }, [hasGeneratedContent, isPenMode, selectedColor, getCoordinates]);

  const handleColoringMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isPenMode || !coloringCanvasRef.current) return;
    e.preventDefault();

    const ctx = coloringCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, coloringCanvasRef.current);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, isPenMode, selectedColor, brushSize, getCoordinates]);

  const handleColoringMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Flood fill algorithm
  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    if (!coloringCanvasRef.current) return;

    const canvas = coloringCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const fillColorRgb = hexToRgb(fillColor);
    const startPos = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    if (startR === fillColorRgb.r && startG === fillColorRgb.g && startB === fillColorRgb.b) {
      return;
    }

    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

      const pos = (y * canvas.width + x) * 4;
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];

      if (r === startR && g === startG && b === startB) {
        visited.add(key);
        data[pos] = fillColorRgb.r;
        data[pos + 1] = fillColorRgb.g;
        data[pos + 2] = fillColorRgb.b;
        data[pos + 3] = 255;

        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const handleColorSelect = useCallback((color: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedColor(color);
  }, []);

  // Get canvas as base64
  const getCanvasAsBase64 = useCallback((canvas: HTMLCanvasElement | null): string => {
    if (!canvas) return '';
    return canvas.toDataURL('image/png').split(',')[1];
  }, []);

  // Clear all
  const handleClearAll = useCallback(() => {
    if (sketchCanvasRef.current) {
      const ctx = sketchCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, sketchCanvasRef.current.width, sketchCanvasRef.current.height);
      }
    }
    setHasGeneratedContent(false);
    setCurrentPrompt('');
    setStory('');
    setRecognizedImage('');
    setError('');
  }, []);

  // Get drawing idea
  const getDrawingIdea = useCallback(async () => {
    setIsGettingIdea(true);
    setError('');
    try {
      const idea = await GeminiService.generateDrawingIdeas('happy');
      setCurrentPrompt(idea);
    } catch (err) {
      setError('Failed to generate drawing idea. Please try again.');
      console.error(err);
    } finally {
      setIsGettingIdea(false);
    }
  }, []);

  // Enhance drawing
  const enhanceDrawing = useCallback(async () => {
    if (!sketchCanvasRef.current) return;

    setIsGenerating(true);
    setError('');

    try {
      const sketchBase64 = getCanvasAsBase64(sketchCanvasRef.current);
      if (!sketchBase64) {
        throw new Error('No drawing to enhance');
      }

      console.log('Starting image analysis...');
      // Recognize image
      const description = await GeminiService.analyzeImage(sketchBase64);
      console.log('Image description:', description);
      setRecognizedImage(description);

      console.log('Generating enhanced image...');
      // Enhance with Pollinations (pass description, not base64)
      const enhancedUrl = await PollinationsService.enhanceDrawing(description, 'happy');
      console.log('Enhanced URL:', enhancedUrl);

      // Load enhanced image onto coloring canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onerror = (error) => {
        console.error('Image load error:', error);
        setError('Failed to load generated image. Please try again.');
        setIsGenerating(false);
      };

      img.onload = () => {
        console.log('Image loaded successfully');
        if (coloringCanvasRef.current) {
          const ctx = coloringCanvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, coloringCanvasRef.current.width, coloringCanvasRef.current.height);
            ctx.drawImage(img, 0, 0, coloringCanvasRef.current.width, coloringCanvasRef.current.height);

            const generatedBase64 = getCanvasAsBase64(coloringCanvasRef.current);

            // Add to history
            const newItem: HistoryItem = {
              sketch: sketchBase64,
              generated: generatedBase64,
              prompt: description
            };

            setHistory(prev => {
              const newHistory = [...prev, newItem];
              if (newHistory.length > 5) {
                newHistory.shift();
              }
              return newHistory;
            });

            setSelectedHistoryIndex(history.length);
            setHasGeneratedContent(true);
            setIsGenerating(false);
            console.log('Enhancement complete!');
          }
        }
      };

      img.src = enhancedUrl;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to enhance drawing: ${errorMessage}`);
      console.error('Enhancement error:', err);
      setIsGenerating(false);
    }
  }, [getCanvasAsBase64, history.length]);

  // Generate story
  const generateStory = useCallback(async () => {
    if (selectedHistoryIndex === null) return;

    setIsGeneratingStory(true);
    setError('');

    try {
      const currentItem = history[selectedHistoryIndex];
      const prompt = currentItem.prompt || recognizedImage || 'a drawing';

      const storyText = await GeminiService.generateStory(prompt, 'happy');
      setStory(storyText);

      // Update history with story
      setHistory(prev => {
        const newHistory = [...prev];
        newHistory[selectedHistoryIndex] = {
          ...newHistory[selectedHistoryIndex],
          story: storyText
        };
        return newHistory;
      });

      // Typewriter effect
      setIsTypingStory(true);
      setDisplayedStory('');
      let index = 0;
      const interval = setInterval(() => {
        if (index < storyText.length) {
          setDisplayedStory(storyText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTypingStory(false);
        }
      }, 30);

      setShowStorySection(true);

    } catch (err) {
      setError('Failed to generate story. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingStory(false);
    }
  }, [selectedHistoryIndex, history, recognizedImage]);

  // Read story
  const handleReadStory = useCallback(async (provider: 'pollinations' | 'elevenlabs') => {
    if (!story) return;

    setIsReadingStory(true);
    setError('');

    try {
      if (provider === 'pollinations') {
        const audioUrl = await PollinationsService.generateAudio(story);
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsReadingStory(false);
        audio.play();
      } else {
        const audioBlob = await ElevenLabsService.generateSpeech(story);
        setGeneratedAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsReadingStory(false);
        audio.play();
      }
    } catch (err) {
      setError('Failed to read story. Please try again.');
      console.error(err);
      setIsReadingStory(false);
    }
  }, [story]);

  // Video generation placeholder
  const generateAndDownloadVideo = useCallback(async () => {
    setIsGeneratingVideo(true);
    try {
      // Video generation logic would go here
      console.log('Video generation not implemented');
    } catch (err) {
      setError('Failed to generate video.');
      console.error(err);
    } finally {
      setIsGeneratingVideo(false);
    }
  }, []);

  // History handlers
  const handleSelectHistory = useCallback((index: number) => {
    const item = history[index];
    setSelectedHistoryIndex(index);

    // Load the generated image to coloring canvas
    if (coloringCanvasRef.current && item.generated) {
      const ctx = coloringCanvasRef.current.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, coloringCanvasRef.current!.width, coloringCanvasRef.current!.height);
          ctx.drawImage(img, 0, 0, coloringCanvasRef.current!.width, coloringCanvasRef.current!.height);
        };
        img.src = `data:image/png;base64,${item.generated}`;
      }
    }

    // Load story if exists
    if (item.story) {
      setStory(item.story);
      setDisplayedStory(item.story);
    } else {
      setStory('');
      setDisplayedStory('');
    }

    setHasGeneratedContent(true);
  }, [history]);

  const handleDeleteHistory = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter((_, i) => i !== index));

    if (selectedHistoryIndex === index) {
      setSelectedHistoryIndex(null);
      setHasGeneratedContent(false);
      setStory('');
      setDisplayedStory('');
    } else if (selectedHistoryIndex !== null && selectedHistoryIndex > index) {
      setSelectedHistoryIndex(selectedHistoryIndex - 1);
    }
  }, [selectedHistoryIndex]);

  // Webcam handlers
  const handleWebcamCapture = useCallback((imageData: string) => {
    if (sketchCanvasRef.current) {
      const ctx = sketchCanvasRef.current.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, sketchCanvasRef.current!.width, sketchCanvasRef.current!.height);
          ctx.drawImage(img, 0, 0, sketchCanvasRef.current!.width, sketchCanvasRef.current!.height);
        };
        img.src = imageData;
      }
    }
    setShowWebcam(false);
  }, []);

  const handleWebcamCancel = useCallback(() => {
    setShowWebcam(false);
  }, []);

  return {
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
  };
};
