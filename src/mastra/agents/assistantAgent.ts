import { Agent } from "@mastra/core/agent";
import { githubCreateIssueTool } from "../tools/githubTool";
import {
  confluenceSearchPagesTool,
  confluenceGetPageTool,
} from "../tools/confluenceTool";
import { getBedrockModel } from "../../lib/aws-config";

export const createAssistantAgent = async () => {
  const model = await getBedrockModel();

  return new Agent({
    name: "assistant",
    instructions: `あなたは親切で知識豊富なAIアシスタントです。

以下のツールを活用して、プロジェクト管理と情報検索をサポートしてください：

**Confluenceツール**:
- confluence_search_pages: CQLを使用してConfluenceでページを検索
- confluence_get_page: 特定のConfluenceページの詳細を取得

**GitHubツール**:
- githubCreateIssue: GitHubイシューを作成

**使用例**:
- 文書検索: まずconfluence_search_pagesでCQL検索を実行
- ページ詳細取得: confluence_get_pageで特定ページの内容を取得

ユーザーのリクエストに応じて、適切なツールを選択して情報を収集・提供してください。`,
    model,
    tools: {
      // Confluenceツール
      confluence_search_pages: confluenceSearchPagesTool,
      confluence_get_page: confluenceGetPageTool,

      // GitHubツール
      githubCreateIssue: githubCreateIssueTool,
    },
  });
};
