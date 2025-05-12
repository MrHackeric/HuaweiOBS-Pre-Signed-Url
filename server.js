require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OBS = require('esdk-obs-nodejs'); // Huawei OBS SDK

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize OBS client
const obsClient = new OBS({
  access_key_id: process.env.OBS_AK,
  secret_access_key: process.env.OBS_SK,
  server: process.env.OBS_ENDPOINT, // e.g., obs.ap-southeast-2.myhuaweicloud.com
  signature: 'v4'
});

const bucketName = process.env.OBS_BUCKET; // e.g., iot-sensor-data
const objectKey = 'sensor_data.json'; // the file name

app.get('/signed-url', async (req, res) => {
  try {
    const expires = 3600; // 1 hour

    // Generate PUT signed URL (upload)
    const putUrl = obsClient.createSignedUrlSync({
      Method: 'PUT',
      Bucket: bucketName,
      Key: objectKey,
      Expires: expires
    });

    // Generate GET signed URL (download)
    const getUrl = obsClient.createSignedUrlSync({
      Method: 'GET',
      Bucket: bucketName,
      Key: objectKey,
      Expires: expires
    });

    console.log('✅ Signed URLs generated:');
    console.log('  PUT:', putUrl.SignedUrl);
    console.log('  GET:', getUrl.SignedUrl);

    res.json({
      success: true,
      message: 'Signed URLs generated successfully.',
      signedUrlPut: putUrl.SignedUrl,
      signedUrlGet: getUrl.SignedUrl,
      expiresInSeconds: expires
    });
  } catch (error) {
    console.error('❌ Error generating signed URLs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate signed URLs.',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

// const express = require('express');
// const ObsClient = require('esdk-obs-nodejs');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Initialize OBS client using env variables
// const obsClient = new ObsClient({
//   access_key_id: process.env.OBS_ACCESS_KEY,
//   secret_access_key: process.env.OBS_SECRET_KEY,
//   server: process.env.OBS_ENDPOINT,
// });

// console.log('🟢 OBS Client initialized');

// // Health check endpoint
// app.get('/', (req, res) => {
//   res.send('🚀 Huawei OBS Pre-signed URL Generator is running');
// });

// // Signed URL endpoint
// app.get('/generate-url', (req, res) => {
//   const objectKey = 'sensor_data.json';  // Use a fixed filename for consistency
//   const bucketName = process.env.OBS_BUCKET_NAME;
//   const expiresIn = 3600;  // Signed URL expiration time (in seconds)

//   console.log(`\n🔧 Request received to generate signed URL`);
//   console.log(`📦 Bucket: ${bucketName}`);
//   console.log(`📝 Object Key: ${objectKey}`);
//   console.log(`⏳ Expiry: ${expiresIn} seconds`);

//   try {
//     const result = obsClient.createSignedUrlSync({
//       Method: 'PUT',
//       Bucket: bucketName,
//       Key: objectKey,
//       Expires: expiresIn,
//       Headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     console.log('📤 Raw result from createSignedUrlSync:', result);

//     if (result && result.SignedUrl) {
//       console.log('✅ Signed URL generated successfully');
//       res.json({
//         signedUrl: result.SignedUrl,
//         objectKey,
//         expiresIn,
//         bucket: bucketName,
//       });
//     } else {
//       console.error('❌ Failed to generate signed URL (no SignedUrl field):', result);
//       res.status(500).json({
//         error: 'Failed to generate signed URL',
//         details: result,
//       });
//     }
//   } catch (err) {
//     console.error('❌ Exception while generating signed URL:', err);
//     res.status(500).json({
//       error: 'Internal server error while generating signed URL',
//       message: err.message,
//     });
//   }
// });

// // Graceful shutdown
// process.on('SIGINT', () => {
//   console.log('🛑 Shutting down OBS client...');
//   obsClient.close();
//   process.exit();
// });

// app.listen(port, () => {
//   console.log(`✅ Server running on port ${port}`);
// });
