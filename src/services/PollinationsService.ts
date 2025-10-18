export class PollinationsService {
  private static readonly BASE_URL = 'https://image.pollinations.ai/prompt/';
  private static readonly AUDIO_URL = 'https://text-to-speech.pollinations.ai';

  static async generateImage(prompt: string): Promise<Blob> {
    const encodedPrompt = encodeURIComponent(prompt);
    const endpoint = `${this.BASE_URL}${encodedPrompt}?width=600&height=800&seed=42&nologo=True`;

    const response = await fetch(endpoint, {
      method: 'GET',
    });

    if (!response.ok) {
      let errorMsg = `Image Generation Error (${response.status}): ${response.statusText}`;
      try {
        errorMsg = `Image Generation Error: ${await response.text()}`;
      } catch (jsonError) {
        console.error('Could not parse error response', jsonError);
      }
      throw new Error(errorMsg);
    }

    return response.blob();
  }

  static async enhanceDrawing(base64ImageData: string, artMode: string = 'happy'): Promise<string> {
    const getModePrompt = (mode: string) => {
      switch (mode.toLowerCase()) {
        case 'scary':
          return 'child-friendly spooky illustration with friendly ghosts or silly monsters, colorful, cute';
        case 'science':
          return 'educational science illustration for children, bright colors, scientific elements';
        case 'moral':
          return 'heartwarming illustration about kindness and friendship, gentle, warm colors';
        case 'health':
          return 'healthy lifestyle illustration for kids, active, vibrant, happy';
        case 'adventure':
          return 'exciting adventure illustration, brave characters, colorful landscapes';
        case 'nature':
          return 'beautiful nature illustration, plants and animals, peaceful, natural colors';
        case 'fantasy':
          return 'magical fantasy illustration, enchanted, whimsical, dreamy colors';
        case 'happy':
        default:
          return 'cheerful, colorful, child-friendly illustration';
      }
    };

    const prompt = `Transform this child's drawing into a ${getModePrompt(artMode)}, keeping the original concept but making it polished and beautiful, professional children's book style`;
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `${this.BASE_URL}${encodedPrompt}?width=512&height=512&nologo=True&enhance=true`;

    return url;
  }

  static async generateAudio(text: string): Promise<string> {
    const encodedText = encodeURIComponent(text);
    return `${this.AUDIO_URL}?voice=alloy&text=${encodedText}`;
  }
}