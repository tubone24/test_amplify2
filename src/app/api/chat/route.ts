export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const { AuthFetchAuthSessionServer } = await import(
      "@/lib/amplify-server-utils"
    );
    const session = await AuthFetchAuthSessionServer();

    if (!session || !session.credentials) {
      throw new Error("認証情報が利用できません。再度ログインしてください。");
    }
    const { mastra } = await import("@/mastra");
    const agent = mastra.getAgent("assistantAgent");

    const result = await agent.stream(messages);
    return result.toDataStreamResponse();
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "チャット処理中にエラーが発生しました",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
