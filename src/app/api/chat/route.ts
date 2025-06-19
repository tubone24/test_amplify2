export async function POST(req: Request) {
  console.log("[Chat API] Request received");

  try {
    const { messages } = await req.json();
    console.log("[Chat API] Messages parsed:", messages.length);

    // Cognito認証情報の確認
    const { AuthFetchAuthSessionServer } = await import(
      "@/lib/amplify-server-utils"
    );
    const session = await AuthFetchAuthSessionServer();

    console.log("[Chat API] Auth session status:", {
      hasSession: !!session,
      hasCredentials: !!session?.credentials,
      hasAccessKey: !!session?.credentials?.accessKeyId,
      region: process.env.AWS_REGION,
    });

    if (!session || !session.credentials) {
      console.error("[Chat API] No Cognito credentials available");
      throw new Error("認証情報が利用できません。再度ログインしてください。");
    }

    // ランタイムでのみMastraを初期化
    console.log("[Chat API] Initializing Mastra...");
    const { mastra } = await import("@/mastra");
    const agent = mastra.getAgent("assistantAgent");

    console.log("[Chat API] Streaming response...");
    const result = await agent.stream(messages);
    return result.toDataStreamResponse();
  } catch (err) {
    console.error("[Chat API] Error occurred:", err);
    console.error(
      "[Chat API] Error stack:",
      err instanceof Error ? err.stack : "No stack trace"
    );

    // エラー情報を詳細に記録
    const errorInfo = {
      message: err instanceof Error ? err.message : "Unknown error",
      type: err instanceof Error ? err.constructor.name : typeof err,
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      awsRegion: process.env.AWS_REGION,
    };

    console.error("[Chat API] Error info:", JSON.stringify(errorInfo, null, 2));

    return new Response(
      JSON.stringify({
        error: "チャット処理中にエラーが発生しました",
        details: errorInfo.message,
        timestamp: errorInfo.timestamp,
        type: errorInfo.type,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
