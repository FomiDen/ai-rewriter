interface RewriteParams {
  text: string;
  platform: string;
  tone: string;
}

export async function fetchRewrite(params: RewriteParams): Promise<string> {
  const res = await fetch("/api/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка при рерайте");
  return data.result as string;
}
