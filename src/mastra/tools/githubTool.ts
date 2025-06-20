import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const githubCreateIssueTool = createTool({
  id: "githubCreateIssue",
  description:
    "GitHub上でイシューを作成します。バグ報告、機能要求、質問などに使用できます。",
  inputSchema: z.object({
    owner: z
      .string()
      .describe("リポジトリの所有者名（ユーザー名またはorganization名）"),
    repo: z.string().describe("リポジトリ名"),
    title: z.string().describe("イシューのタイトル"),
    body: z.string().optional().describe("イシューの本文・詳細説明"),
    labels: z
      .array(z.string())
      .optional()
      .describe("イシューに付けるラベル（例: ['bug', 'enhancement']）"),
    assignees: z
      .array(z.string())
      .optional()
      .describe("イシューを担当するユーザー名のリスト"),
    milestone: z.number().optional().describe("マイルストーン番号"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    issueNumber: z.number().optional(),
    issueUrl: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { owner, repo, title, body, labels, assignees, milestone } = context;

    console.log("=== GitHub Tool Debug ===");
    console.log("GITHUB_TOKEN:", process.env.GITHUB_TOKEN ? "設定済み" : "未設定");
    console.log("GITHUB_TOKEN値の最初の5文字:", process.env.GITHUB_TOKEN?.substring(0, 5) || "なし");
    console.log("=== Debug End ===");

    const token = process.env.GITHUB_TOKEN;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body, labels, assignees, milestone }),
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const issueData = await response.json();
      return {
        success: true,
        issueNumber: issueData.number,
        issueUrl: issueData.html_url,
      };
    } catch (error) {
      return {
        success: false,
        error: String(error),
      };
    }
  },
});
