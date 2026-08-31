# 🖨️ PrintBolt High-Fidelity Font & Document Engine

This service is a private, self-hosted document conversion container running on **Google Cloud Run (Firebase Gen 2)** with the **complete Microsoft TrueType, Windows 10/11, and Google Font packages** pre-installed.

---

## 💰 Free Tier Quota on Google Cloud Run:
- **2,000,000 requests / month FREE**
- **360,000 GB-seconds of compute FREE**
- **180,000 vCPU-seconds FREE**
- **$0.00 / month cost** (scales to 0 instances when idle).

---

## 🚀 How to Deploy (2 Ways)

### Method 1: Using `deploy.ps1` (Fastest with gcloud CLI)
1. Open PowerShell in `f:\PrintFam\PCPrint\font-engine\`.
2. Run:
   ```powershell
   .\deploy.ps1
   ```
3. Copy the resulting `Service URL` (e.g. `https://printbolt-font-engine-xxxxx-uc.a.run.app`).
4. Paste it as an Environment Variable in your Cloudflare Pages dashboard:
   - Variable Name: `DOC_CONVERTER_URL`
   - Value: `https://printbolt-font-engine-xxxxx-uc.a.run.app`

---

### Method 2: Via Google Cloud Web Console (No CLI needed)
1. Go to [Google Cloud Run Console](https://console.cloud.google.com/run).
2. Click **Create Service**.
3. Select **Continuously deploy from a repository** (Connect your GitHub repo `PrintFam-Web-` or upload the `font-engine` folder).
4. Set:
   - **Service Name**: `printbolt-font-engine`
   - **Authentication**: `Allow unauthenticated invocations`
   - **Container Port**: `3000`
   - **Memory**: `1 GiB`
   - **CPU**: `1`
   - **Min instances**: `0` (scales down to 0 to stay 100% free)
5. Click **Create**.
6. Copy the generated URL and add `DOC_CONVERTER_URL` to Cloudflare Pages settings.
