
import { GoogleGenAI } from "@google/genai";
import { Era, AnalysisResult } from "../types";

// Always create a new instance right before use to ensure the latest environment config is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Analyzes an image to extract visual features for consistency in generation.
 * Uses gemini-3-pro-preview for deep understanding of complex visual reasoning tasks.
 */
export const analyzeUserPhoto = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const prompt = `Analiza esta foto de una persona. Describe detalladamente sus rasgos faciales, color y estilo de cabello, y complexión para que pueda recrear a esta misma persona en una ilustración histórica. Responde en formato JSON con las claves: "features" (rasgos), "clothingStyle" (estilo actual) y "vibe" (personalidad visual).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json"
    }
  });

  // response.text is a getter property, not a method.
  const resultText = response.text;
  try {
    return JSON.parse(resultText || '{}') as AnalysisResult;
  } catch (e) {
    console.error("Error parsing analysis", e);
    return { features: "Persona promedio", clothingStyle: "Casual", vibe: "Neutral" };
  }
};

/**
 * Generates a historical image based on user analysis and selected era.
 * Uses gemini-2.5-flash-image for general image generation tasks.
 */
export const generateHistoricalScene = async (analysis: AnalysisResult, era: Era): Promise<string> => {
  const ai = getAI();
  const prompt = `Una fotografía cinematográfica de alta calidad de una persona con estos rasgos: ${analysis.features}. La persona está vestida y ambientada en la época de ${era}. La escena debe ser históricamente precisa, con iluminación dramática y detalles épicos. El rostro debe conservar la esencia de la descripción proporcionada.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let imageUrl = "";
  // Find the image part within the candidates' content parts.
  if (response.candidates) {
    for (const candidate of response.candidates) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
      if (imageUrl) break;
    }
  }

  if (!imageUrl) throw new Error("No se pudo generar la imagen");
  return imageUrl;
};

/**
 * Edits an existing generated image using a text prompt.
 * Uses gemini-2.5-flash-image for image editing tasks.
 */
export const editHistoricalImage = async (base64Image: string, editPrompt: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Modifica esta imagen según la siguiente instrucción: "${editPrompt}". Mantén el estilo histórico y la coherencia de la persona, pero aplica el cambio solicitado de forma artística y realista.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    }
  });

  let imageUrl = "";
  // Find the image part in the parts array, as it might contain text alongside image data.
  if (response.candidates) {
    for (const candidate of response.candidates) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
      if (imageUrl) break;
    }
  }

  if (!imageUrl) throw new Error("No se pudo editar la imagen");
  return imageUrl;
};
