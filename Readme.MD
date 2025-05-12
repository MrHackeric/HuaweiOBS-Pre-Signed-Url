# 📡 Huawei OBS Pre-Signed URL Generator API

This Node.js application generates **pre-signed URLs** for uploading JSON data to Huawei Cloud **Object Storage Service (OBS)**. It is designed to run on **Render.com** and be accessed from external clients, such as an ESP32 device or browser, for secure and authenticated uploads.

---

## 🚀 Features

- 🔐 Securely generates **PUT** pre-signed URLs for Huawei OBS.
- 🧪 Built-in health check (`/`) and signed URL endpoint (`/generate-url`).
- 🪵 Includes full debugging logs for transparency and troubleshooting.
- 🌐 Easily deployable on [Render.com](https://render.com/).

---

## 🛠 Requirements

- Node.js 14+
- A Huawei OBS bucket and access credentials.
- A Render.com account (for deployment).
- `.env` file with credentials or environment variables set on Render.

---

## 🔧 Environment Variables

Create a `.env` file in your root directory with the following content:

```env
OBS_ACCESS_KEY=your_huawei_obs_access_key
OBS_SECRET_KEY=your_huawei_obs_secret_key
OBS_ENDPOINT=https://obs.YOUR-REGION.myhuaweicloud.com
OBS_BUCKET_NAME=your_obs_bucket_name
PORT=3000
````

Or set these as **Environment Variables** in Render.com dashboard under your service settings.

---

## 📦 Installation

```bash
git clone https://github.com/MrHackeric/HuaweiOBS-Pre-Signed-Url
cd HuaweiOBS-Pre-Signed-Url
npm install
```

Start the server locally:

```bash
node server.js
```

---

## 🌍 API Endpoints

### `GET /`

Health check route — confirms the server is running.

### `GET /generate-url`

Generates a pre-signed URL for uploading `application/json` data to your OBS bucket.

#### 🔄 Sample Response

```json
{
  "signedUrl": "https://obs.ap-southeast-3.myhuaweicloud.com/my-application-data/1747047265353.json?...",
  "objectKey": "sensor_data_1747047265353.json",
  "expiresIn": 3600,
  "bucket": "iot-sensor-data"
}
```

---

## 📤 ESP32 Integration (C++)

Your ESP32 device can hit this API and use the `signedUrl` to upload sensor data directly to Huawei OBS.

Example (simplified C++):

```cpp
HTTPClient http;
http.begin("https://your-api.onrender.com/generate-url");
int code = http.GET();
String json = http.getString();
// Extract signedUrl and then upload via PUT
```

---

## 🧪 Debugging & Logs

This application logs:

* OBS client initialization
* Incoming requests
* Generated object keys and expiration
* Raw responses from Huawei SDK
* Errors and exceptions

Perfect for debugging via Render logs.

---

## 🧹 Cleanup

OBS Client is properly closed on `SIGINT` (e.g. Ctrl+C or server shutdown).

---

## 📜 License

MIT — free to use, modify, and share.

---

## 🤝 Credits

Created by [Karimi Muriithi](https://github.com/MrHackeric) for integrating Huawei OBS into IoT workflows.