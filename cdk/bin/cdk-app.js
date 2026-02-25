#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FileProcessorStack } from '../lib/file-processor-stack.js';

const app = new cdk.App();
new FileProcessorStack(app, 'LamVaultStack');