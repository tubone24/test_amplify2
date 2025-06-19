import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL || "";
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN || "";
const CONFLUENCE_USER_EMAIL = process.env.CONFLUENCE_USER_EMAIL || "";

// Basic Auth用のヘッダーを生成
function getAuthHeaders(): Record<string, string> {
  const auth = Buffer.from(
    `${CONFLUENCE_USER_EMAIL}:${CONFLUENCE_API_TOKEN}`
  ).toString("base64");
  return {
    Authorization: `Basic ${auth}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

// Confluence API呼び出し用のヘルパー関数
async function callConfluenceAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const baseUrl = `${CONFLUENCE_BASE_URL}/wiki`;
  const url = `${baseUrl}/rest/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Confluence API error: ${response.status}`);
  }

  return response.json();
}

// Confluenceページ検索ツール
export const confluenceSearchPagesTool = createTool({
  id: "confluence_search_pages",
  description: "Confluenceでページを検索します（CQLクエリ対応）",
  inputSchema: z.object({
    cql: z.string().describe("CQL（Confluence Query Language）検索クエリ"),
    limit: z
      .number()
      .optional()
      .describe("取得するページ数の上限（デフォルト: 25）"),
    start: z
      .number()
      .optional()
      .describe("検索結果の開始位置（ページネーション用）"),
  }),
  execute: async ({ context }) => {
    const params = new URLSearchParams();
    params.append("cql", context.cql);
    if (context.limit) params.append("limit", context.limit.toString());
    if (context.start) params.append("start", context.start.toString());

    try {
      const data = await callConfluenceAPI(`/search?${params.toString()}`);

      const pages = data.results.map((result: any) => ({
        id: result.content?.id,
        title: result.content?.title,
        url: result.url ? `${CONFLUENCE_BASE_URL}/wiki${result.url}` : null,
      }));

      return { pages, total: data.totalSize };
    } catch (error) {
      return { error: String(error) };
    }
  },
});

// Confluenceページ詳細取得ツール
export const confluenceGetPageTool = createTool({
  id: "confluence_get_page",
  description: "指定されたIDのConfluenceページの詳細を取得します",
  inputSchema: z.object({
    pageId: z.string().describe("取得するページのID"),
    expand: z
      .string()
      .optional()
      .describe("追加で取得する情報（例: body.storage,version,space）"),
  }),
  execute: async ({ context }) => {
    const params = new URLSearchParams();
    if (context.expand) params.append("expand", context.expand);

    try {
      const endpoint = `/content/${context.pageId}${params.toString() ? `?${params.toString()}` : ""}`;
      const page = await callConfluenceAPI(endpoint);

      return {
        page: {
          id: page.id,
          title: page.title,
          url: `${CONFLUENCE_BASE_URL}/wiki${page._links?.webui}`,
          content: page.body?.storage?.value || null,
        },
      };
    } catch (error) {
      return { error: String(error) };
    }
  },
});
