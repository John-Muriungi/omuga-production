# Google Drive Integration Setup Guide

Your photofolio is now configured to pull images directly from Google Drive! Follow these steps to get it working.

## Step 1: Get Your Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **Create a new project** (or select existing):
   - Click project dropdown at top
   - Click "NEW PROJECT"
   - Name it "Photofolio" or similar
   - Click "CREATE"

3. **Enable Google Drive API**:
   - Search for "Google Drive API" in the search bar
   - Click on it
   - Click "ENABLE"

4. **Create API Key**:
   - Go to "Credentials" in left menu
   - Click "Create Credentials" → "API Key"
   - Copy the API Key (a long string of characters)

## Step 2: Make Your Google Drive Folder Public

1. Open your Google Drive folder: https://drive.google.com/drive/folders/156np5iFYk8z7gyTP0x-tLZZWIzUUBOSY
2. Right-click the folder → **"Share"**
3. Click "Change to anyone with the link"
4. Set permission to **"Viewer"**
5. Copy the link (optional, mostly for reference)

## Step 3: Add Your API Key to the Code

### Option A: Direct Configuration (RECOMMENDED FOR DEVELOPMENT)

1. Open [google-drive-integration.js](google-drive-integration.js)
2. Find this line (around line 6):
   ```javascript
   API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
   ```
3. Replace with your actual API Key:
   ```javascript
   API_KEY: 'AIzaSyD...(your actual key here)...',
   ```
4. Save the file

### Option B: Environment Variable (RECOMMENDED FOR PRODUCTION)

If deploying to a server, use environment variables instead of hardcoding:

```javascript
API_KEY: process.env.GOOGLE_DRIVE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE',
```

Then set the environment variable on your server.

## Step 4: Verify Your Folder Structure

Your Google Drive folder should have this structure:

```
📁 156np5iFYk8z7gyTP0x-tLZZWIzUUBOSY (Your main folder)
├─ 📁 Corporate Events
│  ├─ photo1.jpg
│  ├─ photo2.jpg
│  └─ ...
├─ 📁 Potraiture
│  ├─ photo1.jpg
│  ├─ photo2.jpg
│  └─ ...
├─ 📁 sports and nature photography
│  ├─ photo1.jpg
│  ├─ photo2.jpg
│  └─ ...
└─ 📁 [4th category]
   └─ ...
```

**Note:** Folder names must exactly match the category mappings in `google-drive-integration.js`

## Step 5: Test It

1. Open [gallery.html](gallery.html) in your browser
2. Open **Browser Developer Console** (F12 or Right-click → Inspect → Console)
3. You should see:
   - ✅ "✅ Successfully loaded X images from Google Drive" → **Success!**
   - ❌ "⚠️ Google Drive loading failed..." → Check your API Key and folder structure

## Troubleshooting

### "API Key not configured"

- Make sure you've added the API Key to `google-drive-integration.js`
- Check that the key is inside the quotes: `API_KEY: 'YOUR_KEY_HERE'`

### "403 Forbidden" error

- Your folder might not be public. Go back to Step 2
- Or your API Key doesn't have Drive API enabled. Check Google Cloud Console

### "404 Not Found" error

- The folder ID might be wrong. Double-check the URL
- Current folder ID: `156np5iFYk8z7gyTP0x-tLZZWIzUUBOSY`

### Images not showing

- Gallery images might not have proper file extensions (.jpg, .png, etc.)
- Make sure all images are in supported formats: JPG, JPEG, PNG, GIF, WebP

### CORS errors

- This is normal for direct file access. The code uses `drive.google.com/uc?export=view` URLs which should work
- If persistence issues, you may need a backend proxy

## Advanced: Add a 4th Category

If you have a 4th folder, add it to the category map in `google-drive-integration.js`:

```javascript
CATEGORY_MAP: {
    'Corporate Events': 'commercial',
    'Potraiture': 'photography',
    'sports and nature photography': 'personal',
    'Your 4th Folder': 'your-category-name'  // ADD THIS
}
```

## Auto-Refresh

Your gallery automatically fetches new images from Google Drive when the page loads. Just add new images to your folders and refresh!

## Security Notes

⚠️ **Important for Production:**

- Never hardcode API Keys in front-end code that's publicly available
- Use a backend server or environment variables
- Consider using OAuth 2.0 for a more secure solution
- Restrict your API Key to only Domain restrictions

---

**Questions?** Check the browser console (F12) for detailed error messages!
