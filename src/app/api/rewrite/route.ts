import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const platformPrompts: Record<string, string> = {
  telegram: "Telegram-пост: лаконично, дружелюбно, можно с эмодзи",
  instagram:
    "Instagram-пост: визуально-описательный стиль, хештеги, вовлекающий тон",
  vk: "ВКонтакте: допускается более длинный текст, разговорный стиль, сообщество",
  facebook:
    "Facebook-пост: профессионально-дружелюбный, с вопросом к аудитории",
};

const tonePrompts: Record<string, string> = {
  casual: "в очень непринуждённом, разговорном стиле",
  professional: "в деловом, но тёплом тоне",
  creative: "креативно, с юмором и неожиданными оборотами",
};

export async function POST(request: Request) {
  try {
    const { text, platform, tone } = await request.json();

    if (!text || !platform || !tone) {
      return NextResponse.json(
        { error: "Недостаточно данных" },
        { status: 400 },
      );
    }

    const platformGuide = platformPrompts[platform] || "";
    const toneGuide = tonePrompts[tone] || "";

    const systemMessage = `Ты — профессиональный SMM-редактор. Перепиши текст пользователя в соответствии с требованиями. 
Стиль платформы: ${platformGuide}. 
Тон: ${toneGuide}.
Верни ТОЛЬКО готовый текст, без пояснений и кавычек.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: text },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const rewritten = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ result: rewritten });
  } catch (error: unknown) {
    console.error(
      "DeepSeek API error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Ошибка при обработке запроса" },
      { status: 500 },
    );
  }
}
