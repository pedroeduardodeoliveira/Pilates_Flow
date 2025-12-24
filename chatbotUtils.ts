import { GoogleGenAI } from "@google/genai";
import { Student, StudioSettings, AgendaItem } from './types';

// Função para substituir variáveis no template
export const replaceVariablesInTemplate = (
  template: string,
  student: Student,
  studioSettings: StudioSettings,
  additionalVars?: Record<string, string>
): string => {
  let message = template;

  message = message.replace(/{aluno}/g, student.name);
  message = message.replace(/{estudio}/g, studioSettings.appName);

  if (additionalVars) {
    for (const key in additionalVars) {
      message = message.replace(new RegExp(`{${key}}`, 'g'), additionalVars[key]);
    }
  }
  return message;
};

// Função para gerar uma mensagem mais natural com a API Gemini
export const generateChatbotMessage = async (promptText: string): Promise<string> => {
  try {
    // Always use `const ai = new GoogleGenAI({apiKey: process.env.API_KEY});`
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    // When using generate content for text answers, do *not* define the model first and call generate content later.
    // You must use `ai.models.generateContent` to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Basic Text Tasks: 'gemini-3-flash-preview'
      contents: promptText,
      config: {
        systemInstruction: "Você é um assistente de chatbot amigável para um estúdio de Pilates. Reformule a mensagem do usuário para que soe como um WhatsApp mais natural, conversacional e acolhedor, mantendo o contexto e as informações chave. Use emojis relevantes.",
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });
    // The `GenerateContentResponse` object features a `text` property (not a method, so do not call `text()`)
    // that directly returns the string output.
    return response.text || "Não foi possível gerar a mensagem.";
  } catch (error) {
    console.error("Erro ao comunicar com a API Gemini:", error);
    return `Olá ${promptText.substring(promptText.indexOf('Olá ') + 4, promptText.indexOf('!'))}! Houve um erro ao gerar a mensagem. Mas a intenção era: ${promptText.slice(promptText.indexOf('!') + 1)}.`;
  }
};

interface ChatbotMessagePayload {
  student: Student;
  // FIX: Constrain templateKey to exclude 'isEnabled' as it's not an automation feature object
  templateKey: 'classReminder' | 'expiryWarning' | 'birthdayMessage' | 'paymentConfirmation' | 'welcomeMessage' | 'rescheduleNotification';
  studioSettings: StudioSettings;
  agendaItems: AgendaItem[]; // Usado para buscar próxima aula
  allStudents: Student[]; // Usado para buscar instrutor do aluno (se necessário)
  additionalVars?: Record<string, string>;
}

// Função principal para enviar (simular) mensagem WhatsApp
export const sendWhatsAppMessage = async ({
  student,
  templateKey,
  studioSettings,
  agendaItems,
  additionalVars,
}: ChatbotMessagePayload): Promise<void> => {
  const chatbotSettings = studioSettings.chatbotSettings;

  // Ensure chatbotSettings exist and are enabled globally.
  if (!chatbotSettings?.isEnabled) {
    return; // Chatbot desativado globalmente
  }

  // Access the specific feature's settings.
  // The type of `templateKey` is now guaranteed to refer to an object with `isEnabled` and `template`.
  const featureSettings = chatbotSettings[templateKey];

  // Check if the specific automation is enabled.
  if (!featureSettings.isEnabled) {
    return; // Automação específica desativada
  }

  const template = featureSettings.template;
  if (!template) {
    console.warn(`Template para ${templateKey} não encontrado.`);
    return;
  }

  let finalAdditionalVars = { ...additionalVars };

  // Lógica específica para variáveis de templates
  if (templateKey === 'welcomeMessage') {
    // FIX: Simplified logic for 'proxima_aula' to just show the first schedule entry or a default message
    // A more robust implementation would involve filtering `agendaItems` by `student.name`
    // and `new Date().getDay()` to find the *actual* next class,
    // but the original comment suggests a simplification.
    const studentNextClass = student.schedule?.[0]; // Assuming schedule format "Day - HH:MM"
    if (studentNextClass) {
      finalAdditionalVars.proxima_aula = studentNextClass;
    } else {
      finalAdditionalVars.proxima_aula = "em breve (entraremos em contato para agendar)";
    }
  } else if (templateKey === 'rescheduleNotification') {
    // 'novo_horario' já deve vir em additionalVars
  } else if (templateKey === 'classReminder') {
    // 'hora' já deve vir em additionalVars
  }

  const rawMessage = replaceVariablesInTemplate(template, student, studioSettings, finalAdditionalVars);
  const aiGeneratedMessage = await generateChatbotMessage(rawMessage);

  console.log(`--- Chatbot Pilates Flow (Simulação WhatsApp) ---`);
  console.log(`Para: ${student.name} (${student.phone})`);
  console.log(`Mensagem (${templateKey}):`);
  console.log(aiGeneratedMessage);
  console.log(`--------------------------------------------------`);
};