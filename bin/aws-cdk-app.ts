#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkAppStack } from '../lib/aws-cdk-app-stack';

const app = new cdk.App();
new AwsCdkAppStack(app, 'AwsCdkAppStack', {
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
