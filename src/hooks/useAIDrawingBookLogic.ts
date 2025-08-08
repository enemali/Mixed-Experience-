import { useState, useCallback } from 'react';
import { GeminiService } from '../services/GeminiService';
import { PollinationsService } from '../services/PollinationsService';
import { ElevenLabsService } from '../services/ElevenLabsService';

export type ArtMode = 'happy' | 'scary' | 'science' | 'moral' | 'health' | 'adventure' | 'nature' | 'fantasy';

export const useAIDrawingBookLogic = () => {
  const [selectedArtMode, setSelectedArtMode] = useState<ArtMode>('happy');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isEnhancingImage, setIsEnhancingImage] = useState(false);

  const generateDrawingIdeas = useCallback(async () => {
    setIsGeneratingIdeas(true);
    try {
      const ideas = await GeminiService.generateDrawingIdeas(selectedArtMode);
      return ideas;
    } catch (error) {
      console.error('Error generating drawing ideas:', error);
      throw error;
    } finally {
      setIsGeneratingIdeas(false);
    }
  }, [selectedArtMode]);

  const enhanceImage = useCallback(async (imageData: string) => {
    setIsEnhancingImage(true);
    try {
      const enhancedImageUrl = await PollinationsService.enhanceDrawing(imageData, selectedArtMode);
      return enhancedImageUrl;
    } catch (error) {
      console.error('Error enhancing image:', error);
      throw error;
    } finally {
      setIsEnhancingImage(false);
    }
  }, [selectedArtMode]);

  const generateStory = useCallback(async (imageDescription: string) => {
    setIsGeneratingStory(true);
    try {
      const story = await GeminiService.generateStory(imageDescription, selectedArtMode);
      return story;
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    } finally {
      setIsGeneratingStory(false);
    }
  }, [selectedArtMode]);

  const generateAudio = useCallback(async (text: string) => {
    setIsGeneratingAudio(true);
    try {
      const audioUrl = await ElevenLabsService.generateSpeech(text);
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    } finally {
      setIsGeneratingAudio(false);
    }
  }, []);

  return {
    selectedArtMode,
    setSelectedArtMode,
    isGeneratingIdeas,
    isGeneratingStory,
    isGeneratingAudio,
    isEnhancingImage,
    generateDrawingIdeas,
    enhanceImage,
    generateStory,
    generateAudio,
  };
};