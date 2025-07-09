import React from 'react';
import { useBook } from '../context/BookContext';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { X, Volume2, Gauge, Music } from 'lucide-react';

interface TTSControlsProps {
  onClose: () => void;
}

const TTSControls: React.FC<TTSControlsProps> = ({ onClose }) => {
  const { state, dispatch } = useBook();
  const { ttsSettings } = state;

  const handleSettingChange = (setting: keyof typeof ttsSettings, value: number | boolean) => {
    dispatch({
      type: 'UPDATE_TTS_SETTINGS',
      payload: { [setting]: value }
    });
  };

  const testVoice = () => {
    const utterance = new SpeechSynthesisUtterance('Hello! This is how I sound with these settings.');
    utterance.rate = ttsSettings.speed;
    utterance.pitch = ttsSettings.pitch;
    utterance.volume = ttsSettings.volume / 100;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-card/95 backdrop-blur-sm border-b border-border/50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            Voice Settings
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Speed Control */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary" />
              <label className="font-medium">Speed: {ttsSettings.speed.toFixed(1)}x</label>
            </div>
            <Slider
              value={[ttsSettings.speed]}
              onValueChange={([value]) => handleSettingChange('speed', value)}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Pitch Control */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              <label className="font-medium">Pitch: {ttsSettings.pitch.toFixed(1)}</label>
            </div>
            <Slider
              value={[ttsSettings.pitch]}
              onValueChange={([value]) => handleSettingChange('pitch', value)}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              <label className="font-medium">Volume: {Math.round(ttsSettings.volume * 100)}%</label>
            </div>
            <Slider
              value={[ttsSettings.volume]}
              onValueChange={([value]) => handleSettingChange('volume', value)}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Quiet</span>
              <span>Loud</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6">
          <Button
            onClick={testVoice}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Test Voice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TTSControls;