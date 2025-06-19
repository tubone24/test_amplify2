import { AuthFetchAuthSessionServer } from './amplify-server-utils';

export async function getBedrockModel() {
  try {
    const { createAmazonBedrock } = await import("@ai-sdk/amazon-bedrock");
    const modelId = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";
    const region = process.env.AWS_REGION || 'us-east-1';
    const session = await AuthFetchAuthSessionServer();
    const bedrock = createAmazonBedrock({
      region,
      accessKeyId: session.credentials.accessKeyId,
      secretAccessKey: session.credentials.secretAccessKey,
      sessionToken: session.credentials.sessionToken,
    });
    const model = bedrock(modelId);
    return model;
  } catch (error) {
    console.error('[Bedrock] Error in getBedrockModel:', error);
    throw error;
  }
}