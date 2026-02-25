## LamVault – Serverless File Processing App with Authentication

LamVault is a fully serverless, cloud-native file processing application. Users can securely upload files, which are automatically processed (compressed, optionally converted or thumbnail generated) and stored in AWS S3. The app uses AWS Lambda, API Gateway, DynamoDB, and Cognito for authentication, with a modern React frontend.

<img width="1536" height="1024" alt="ChatGPT Image Feb 25, 2026, 11_26_13 PM" src="https://github.com/user-attachments/assets/2d85a9ea-c911-407d-8cac-6189a5e4f672" />


### Features

✅ Fully serverless architecture – no backend servers to manage.

✅ User authentication via AWS Cognito (email/password login).

✅ Secure file uploads via pre-signed S3 URLs.

✅ Automated file processing using AWS Lambda.

✅ File metadata tracking with DynamoDB.

✅ Fast file delivery using CloudFront.

✅ React frontend with upload progress, login, and file list.

## Tech Stack

**Frontend:** React, Axios

**Backend:** AWS Lambda (Node.js), API Gateway, DynamoDB

**Authentication:** AWS Cognito

**File Storage:** AWS S3

**Distribution:** AWS CloudFront

**Infrastructure as Code:** AWS CDK (Node.js)

## Project Structure

```
lam-vault/
│
├── cdk/                        # AWS CDK backend
│   ├── bin/cdk-app.js
│   ├── lib/file-processor-stack.js
│   └── package.json
│
├── lambda/                     # Lambda functions
│   ├── generatePresignedURL/index.js
│   ├── fileProcessor/index.js
│   └── thumbnailGenerator/index.js
│
├── frontend/                   # React frontend
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── components/
│           ├── Login.js
│           ├── FileUpload.js
│           └── FileList.js
│
└── README.md
```

## Architecture

```
[React Frontend] 
      |
      v
  [AWS Cognito Authentication]
      |
      v
[API Gateway] → [Lambda: Generate Pre-signed URL] → [S3 Upload Bucket]
                                                 |
                                                 v
                                       [Lambda: File Processor]
                                                 |
                                                 v
                                       [DynamoDB: File Metadata]
                                                 |
                                                 v
                                       [CloudFront: File Access]
```

### Flow

1. User logs in using Cognito.
2. User requests a pre-signed URL to upload files.
3. React uploads file directly to S3.
4. S3 triggers Lambda to process the file.
5. DynamoDB stores metadata.
6. Processed files are available via CloudFront.

## Setup & Deployment

### 1. Backend (CDK)

```bash
# Navigate to backend folder
cd cdk
npm install

# Bootstrap AWS environment
cdk bootstrap

# Deploy CDK stack
cdk deploy
```

**Outputs:**
- API Gateway URL
- Cognito User Pool ID
- Cognito App Client ID

### 2. Frontend (React)

Set environment variables in `.env`:

```
REACT_APP_API_URL=<API_GATEWAY_URL>
REACT_APP_USER_POOL_ID=<COGNITO_USER_POOL_ID>
REACT_APP_USER_POOL_CLIENT_ID=<COGNITO_CLIENT_ID>
```

Install dependencies and build:

```bash
cd frontend
npm install
npm run build
```

Deploy `build/` folder to S3 + CloudFront.

## Usage

1. Open the React frontend in a browser.
2. Sign up or log in using your email and password (Cognito).
3. Upload files using the File Upload component.
4. View processed files in the File List component.

## Advanced Features

- File compression & thumbnail generation.
- Real-time file status using DynamoDB.
- Serverless, scalable, and cost-efficient architecture.
- Optional SNS notifications for completed processing.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | API Gateway endpoint URL |
| `REACT_APP_USER_POOL_ID` | Cognito User Pool ID |
| `REACT_APP_USER_POOL_CLIENT_ID` | Cognito App Client ID |
| `BUCKET_NAME` | S3 bucket name (Lambda environment) |
| `TABLE_NAME` | DynamoDB table name (Lambda environment) |

## Tech Notes

- **Serverless:** All backend logic runs in Lambda functions.
- **Direct file upload:** React → S3 via pre-signed URL.
- **Authentication:** AWS Cognito protects API endpoints.
- **Deployment:** CDK manages infrastructure as code.

## Future Enhancements

- Add video/image previews on frontend.
- Add SNS push notifications for completed file processing.
- Add Step Functions for multi-step processing workflows.
- Add role-based access control (Cognito groups).

## License

MIT License – free to use, modify, and deploy.
