import AWS from 'aws-sdk';
import zlib from 'zlib';
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    const file = await S3.getObject({ Bucket: bucket, Key: key }).promise();

    const compressed = zlib.gzipSync(file.Body);
    const processedKey = `processed/${key}`;

    await S3.putObject({ Bucket: bucket, Key: processedKey, Body: compressed }).promise();

    await DynamoDB.put({
      TableName: process.env.TABLE_NAME,
      Item: {
        fileId: key,
        processedFileUrl: `s3://${bucket}/${processedKey}`,
        status: 'processed',
        uploadTimestamp: new Date().toISOString()
      }
    }).promise();
  }
};