import { Groq } from 'groq-sdk';

export interface IconGenerationResponse {
  name: string;
  icon: string;
  format?: 'svg' | 'png' | 'base64';
}

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export const generateMaterialIcon = async (prompt: string): Promise<IconGenerationResponse> => {
  try {
    console.log('1. Iniciando generación de ícono...');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional Material Design SVG icon creator. Your task is to:

1. Convert any concept into a minimal, recognizable Material Design icon
2. Use the following specifications:
   - SVG format with viewBox="0 0 24 24"
   - Only black (#000000) fills
   - Single weight strokes (2px)
   - Clean, minimal paths
   - Pixel-perfect alignment
   - Material Design style guidelines

3. Design Rules:
   - Focus on the most distinctive features of the concept
   - Use geometric shapes creatively
   - Keep details minimal but recognizable
   - Center the icon in the viewBox
   - Maintain proper padding (2px from edges)
   - Use clean paths and shapes
   - No text or numbers allowed
   - No gradients or complex effects

4. Output Format:
   - Only valid SVG code
   - Include width="24" height="24" attributes
   - Use standard SVG path commands
   - Ensure browser compatibility

Remember: Any concept should be transformed into a clean, professional Material Design icon.`,
        },
        {
          role: 'user',
          content: `Create a Material Design icon representing: "${prompt}".

Requirements:
- Must be instantly recognizable as the concept
- Follow Material Design style
- Keep it minimal but distinctive
- Use proper icon proportions
- Ensure visual clarity at small sizes

Return only the SVG code.`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7, // Balance entre creatividad y consistencia
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    console.log('3. Respuesta recibida de Groq AI');
    const svgContent = completion.choices[0]?.message?.content || '';
    console.log('4. Contenido SVG:', svgContent.slice(0, 100) + '...');

    let cleanSvg = svgContent.match(/<svg[\s\S]*?<\/svg>/)?.[0] || '';
    console.log('5. SVG extraído:', cleanSvg ? 'Éxito' : 'Fallido');

    // Añadir o actualizar atributos importantes si no están presentes
    if (!cleanSvg.includes('viewBox')) {
      cleanSvg = cleanSvg.replace('<svg', '<svg viewBox="0 0 24 24"');
    }

    // Asegurarse de que tenga width y height
    if (!cleanSvg.includes('width=') || !cleanSvg.includes('height=')) {
      cleanSvg = cleanSvg.replace('<svg', '<svg width="24" height="24"');
    }

    if (!cleanSvg) {
      throw new Error('No se pudo generar un SVG válido');
    }

    console.log('6. SVG limpio y formateado:', cleanSvg.slice(0, 100) + '...');

    return {
      name: `Custom${prompt.replace(/[^a-zA-Z0-9]/g, '')}Icon`,
      icon: cleanSvg,
      format: 'svg',
    };
  } catch (error) {
    console.error('❌ Error en generación:', error);
    throw error;
  }
};
