import AWS from 'aws-sdk';
import sharp from 'sharp';

const S3 = new AWS.S3();

export const handler = async (event) => {
  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      // Only process image files (jpg, png)
      if (!key.match(/\.(jpg|jpeg|png)$/i)) continue;

      const originalFile = await S3.getObject({ Bucket: bucket, Key: key }).promise();

      // Generate thumbnail (200px width)
      const thumbnailBuffer = await sharp(originalFile.Body)
        .resize({ width: 200 })
        .toBuffer();

      const thumbnailKey = `thumbnails/${key}`;

      await S3.putObject({
        Bucket: bucket,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: 'image/jpeg',
      }).promise();

      console.log(`Thumbnail generated for ${key} -> ${thumbnailKey}`);
    }

    return { statusCode: 200, body: 'Thumbnails generated successfully.' };
  } catch (err) {
    console.error('Thumbnail generation error:', err);
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};