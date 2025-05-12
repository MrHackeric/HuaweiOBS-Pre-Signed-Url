const express = require('express');
const ObsClient = require('esdk-obs-nodejs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OBS client using env variables
const obsClient = new ObsClient({
  access_key_id: process.env.OBS_ACCESS_KEY,
  secret_access_key: process.env.OBS_SECRET_KEY,
  server: process.env.OBS_ENDPOINT,
});

console.log('🟢 OBS Client initialized');

// Health check endpoint
app.get('/', (req, res) => {
  res.send('🚀 Huawei OBS Pre-signed URL Generator is running');
});

// Signed URL endpoint
app.get('/generate-url', (req, res) => {
  const objectKey = `sensor_data_${Date.now()}.json`;
  const bucketName = process.env.OBS_BUCKET_NAME;
  const expiresIn = 3600;

  console.log(`\n🔧 Request received to generate signed URL`);
  console.log(`📦 Bucket: ${bucketName}`);
  console.log(`📝 Object Key: ${objectKey}`);
  console.log(`⏳ Expiry: ${expiresIn} seconds`);

  try {
    const result = obsClient.createSignedUrlSync({
      Method: 'PUT',
      Bucket: bucketName,
      Key: objectKey,
      Expires: expiresIn,
      Headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📤 Raw result from createSignedUrlSync:', result);

    if (result && result.SignedUrl) {
      console.log('✅ Signed URL generated successfully');
      res.json({
        signedUrl: result.SignedUrl,
        objectKey,
        expiresIn,
        bucket: bucketName,
      });
    } else {
      console.error('❌ Failed to generate signed URL (no SignedUrl field):', result);
      res.status(500).json({
        error: 'Failed to generate signed URL',
        details: result,
      });
    }
  } catch (err) {
    console.error('❌ Exception while generating signed URL:', err);
    res.status(500).json({
      error: 'Internal server error while generating signed URL',
      message: err.message,
    });
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down OBS client...');
  obsClient.close();
  process.exit();
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
