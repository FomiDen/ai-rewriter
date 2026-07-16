import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { NextRequest } from "next/server";

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

const IP_LIMIT = 3;
const GLOBAL_LIMIT = Number(process.env.DAILY_GLOBAL_LIMIT) || Infinity;

// Хранилище в памяти: IP → { count, date }
const ipUsage = new Map<string, { count: number; date: string }>();
let globalCount = 0;
let globalDate = new Date().toISOString().slice(0, 10);

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  return realIp || "unknown";
}

interface RewriteRequestBody {
  text: string;
  platform: string;
  tone: string;
}

export async function POST(request: NextRequest) {
  const today = getToday();

  // Сброс глобального счётчика при новом дне
  if (globalDate !== today) {
    globalCount = 0;
    globalDate = today;
  }

  if (globalCount >= GLOBAL_LIMIT) {
    return NextResponse.json(
      { error: "Общий дневной лимит сервиса исчерпан. Попробуйте завтра." },
      { status: 429 },
    );
  }

  let body: RewriteRequestBody;
  try {
    body = (await request.json()) as RewriteRequestBody;
  } catch {
    return NextResponse.json({ error: "Неверный JSON" }, { status: 400 });
  }

  const { text, platform, tone } = body;
  if (!text || !platform || !tone) {
    return NextResponse.json({ error: "Недостаточно данных" }, { status: 400 });
  }

  // Проверка лимита по IP
  const ip = getIP(request);
  const ipData = ipUsage.get(ip) || { count: 0, date: today };
  if (ipData.date !== today) {
    ipData.count = 0;
    ipData.date = today;
  }

  if (ipData.count >= IP_LIMIT) {
    return NextResponse.json(
      { error: "Бесплатный лимит (3 в день) исчерпан. Попробуйте завтра." },
      { status: 429 },
    );
  }

  try {
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

    // Увеличиваем счётчики только при успехе
    ipData.count += 1;
    ipUsage.set(ip, ipData);
    globalCount += 1;

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
