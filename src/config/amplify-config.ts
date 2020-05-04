/**
 * This file configures the amplify library used.
 */
import { Config } from './config';
/* eslint-disable */
export const AmplifyConfig = {
  aws_project_region: Config.AwsRegion,
  aws_cognito_identity_pool_id: Config.IdentityPoolId,
  aws_cognito_region: Config.AwsRegion,
  aws_user_pools_id: Config.CognitoPoolId,
  aws_user_pools_web_client_id: Config.CognitoClientId
};
/* eslint-enable */
