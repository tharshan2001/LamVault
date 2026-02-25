import AWS from 'aws-sdk';
const S3 = new AWS.S3();

export const handler = async (event) => {
  const { fileName } = JSON.parse(event.body);
  const uploadUrl = await S3.getSignedUrlPromise('putObject', {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Expires: 60
  });
  return { statusCode: 200, body: JSON.stringify({ uploadUrl }) };
};