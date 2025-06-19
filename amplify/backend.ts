import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
});

// 認証済みユーザーにBedrock権限を付与
const authenticatedUserIamRole =
  backend.auth.resources.authenticatedUserIamRole;

// Bedrock用のAWSマネージドポリシーを追加（最小権限の原則に従う）
authenticatedUserIamRole.addManagedPolicy(
  ManagedPolicy.fromAwsManagedPolicyName("AmazonBedrockFullAccess")
);

// GitHub APIアクセス用の権限（必要に応じて）
authenticatedUserIamRole.addManagedPolicy(
  ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess")
);
