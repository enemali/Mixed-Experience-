const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const encodedText = encodeURIComponent(text);
    const audioUrl = `https://text-to-speech.pollinations.ai?voice=alloy&text=${encodedText}`;

    console.log('Fetching audio from:', audioUrl);

    const audioResponse = await fetch(audioUrl);

    if (!audioResponse.ok) {
      console.error('Audio generation failed:', audioResponse.status, audioResponse.statusText);
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate audio",
          status: audioResponse.status,
          statusText: audioResponse.statusText
        }),
        {
          status: audioResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const audioBlob = await audioResponse.blob();
    
    return new Response(audioBlob, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });

  } catch (error) {
    console.error('Error in audio generation:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});