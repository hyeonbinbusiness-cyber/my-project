import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

export const initializeChat = async (): Promise<Chat> => {
  if (chatSession) return chatSession;

  // Assuming API_KEY is available in the environment.
  // In a real deployed static site, this needs proxying or careful handling.
  // For this demo, we use the env variable directly as per instructions.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are 'aflow_bot', a digital assistant for the motion designer known as 'aflow'. 
      
      Persona:
      - Tone: Cool, professional, slightly cryptic but helpful, minimal.
      - Style: Motion design focused. You understand keyframes, easing, 3D renderers (Octane, Redshift), and typography.
      - Name constraints: Always refer to the designer as "aflow" (all lowercase).
      
      Goal:
      - Answer questions about aflow's work style.
      - aflow's style is described as: "bold, kinetic, experimental, and user-centric".
      - If asked about availability, say "aflow is currently open for select collaborations."
      - Keep responses short and punchy. No long paragraphs. Use bullet points if needed.
      `,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = await initializeChat();
    const result = await chat.sendMessage({ message });
    return result.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the creative matrix. Try again.";
  }
};