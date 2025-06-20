export async function POST(req: Request) {
  try {
    console.log("=== Server Action Debug ===");
    console.log("GITHUB_TOKEN:", process.env.GITHUB_TOKEN ? "設定済み" : "未設定");
    console.log("CONFLUENCE_BASE_URL:", process.env.CONFLUENCE_BASE_URL ? "設定済み" : "未設定");
    console.log("CONFLUENCE_API_TOKEN:", process.env.CONFLUENCE_API_TOKEN ? "設定済み" : "未設定");
    console.log("CONFLUENCE_USER_EMAIL:", process.env.CONFLUENCE_USER_EMAIL ? "設定済み" : "未設定");
    console.log("=== Debug End ===");
    
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
