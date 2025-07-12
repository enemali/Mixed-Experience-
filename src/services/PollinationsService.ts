export class PollinationsService {
  private static readonly BASE_URL = '/api/pollinations/prompt/';

  static async generateImage(prompt: string): Promise<Blob> {
    const apiKey = import.meta.env.VITE_POLLINATIONS_API_KEY;
    if (!apiKey) {
      throw new Error('Pollinations API key is required. Please set VITE_POLLINATIONS_API_KEY in your environment variables.');
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const endpoint = `${this.BASE_URL}${encodedPrompt}?width=600&height=800&seed=42&nologo=True&apikey=${apiKey}`;

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
}