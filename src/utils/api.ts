// Base your API (replace with your actual API KEY)
const BASE_KEY: string = import.meta.env.VITE_API_KEY || '12345678910'; // Example API for testing

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: BASE_KEY });

export const post = async (promt : string) => {

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${promt}`,
  });

  return response.text;
}