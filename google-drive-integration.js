/**
 * Google Drive Integration for Gallery
 * Fetches images directly from Google Drive folders
 */

// Configuration - UPDATE THESE
const GOOGLE_DRIVE_CONFIG = {
    FOLDER_ID: '156np5iFYk8z7gyTP0x-tLZZWIzUUBOSY',
    API_KEY: 'AIzaSyDRQ06Rd9nY_-h9WiHy_4Jia_k879SYC4I', // Inserted per user
    // Map subfolder names to categories
    CATEGORY_MAP: {
        'Corporate Events': 'commercial',
        'Potraiture': 'photography',
        'sports and nature photography': 'personal',
        'garduation': 'personal'
    }
};

/**
 * Fetch all images from Google Drive folder and subfolders
 * Returns array of image objects with metadata
 */
async function fetchGoogleDriveImages() {
    if (!GOOGLE_DRIVE_CONFIG.API_KEY || GOOGLE_DRIVE_CONFIG.API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') {
        console.error('❌ Google API Key not configured. See setup instructions.');
        return [];
    }

    const images = [];

    try {
        // Get all subfolders in the main folder
        const subfolders = await getSubfolders(GOOGLE_DRIVE_CONFIG.FOLDER_ID);

        // For each subfolder, get all images
        for (const subfolder of subfolders) {
            const folderImages = await getImagesInFolder(subfolder.id, subfolder.name);
            images.push(...folderImages);
        }

        console.log(`✅ Successfully loaded ${images.length} images from Google Drive`);
        return images;
    } catch (error) {
        console.error('❌ Error fetching Google Drive images:', error);
        return [];
    }
}

/**
 * Get all subfolders within a parent folder
 */
async function getSubfolders(parentFolderId) {
    const query = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&key=${GOOGLE_DRIVE_CONFIG.API_KEY}&fields=files(id,name)&pageSize=100`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    return data.files || [];
}

/**
 * Get all image files within a folder
 */
async function getImagesInFolder(folderId, folderName) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const mimeTypes = imageExtensions.map(ext => `mimeType='image/${ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : ext}'`).join(' or ');

    const query = `'${folderId}' in parents and (${mimeTypes}) and trashed=false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&key=${GOOGLE_DRIVE_CONFIG.API_KEY}&fields=files(id,name,webContentLink,thumbnailLink)&pageSize=1000`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    const files = data.files || [];

    // Map to category based on folder name
    const category = GOOGLE_DRIVE_CONFIG.CATEGORY_MAP[folderName] || 'general';

    return files.map((file, index) => {
        // Use proper URL format for displaying in img tags
        // The &export=view parameter tells Google Drive to display the image in the browser
        const fullUrl = `https://drive.google.com/uc?id=${file.id}&export=view`;
        
        // For thumbnails, use the Drive API's thumbnailLink
        let thumbUrl = file.thumbnailLink || fullUrl;

        // Resize thumbnail if it has size param
        if (/=s\d+$/.test(thumbUrl)) {
            thumbUrl = thumbUrl.replace(/=s\d+$/, '=s800');
        }

        console.log(`✅ Added image: ${file.name}`, {
            fullUrl: fullUrl,
            thumbUrl: thumbUrl,
            fileId: file.id
        });

        return {
            id: file.id,
            thumb: thumbUrl,
            full: fullUrl,
            title: file.name.replace(/\.[^/.]+$/, ''),
            category: category,
            folderName: folderName,
            description: `${file.name} — ${category}`,
            original: file
        };
    });
}

/**
 * Alternative: Fetch images using direct shared folder links
 * (Use this if API key setup is problematic)
 */
async function fetchGoogleDriveImagesSimple() {
    // This would require the folder to be publicly shared
    // and using a workaround since direct API calls may have CORS issues
    console.log('Using simple fetch method...');

    // For now, return empty - backend solution recommended for production
    return [];
}

/**
 * Convert Google Drive file ID to direct image URL
 */
function getGoogleDriveImageUrl(fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Convert Google Drive file ID to thumbnail URL
 */
function getGoogleDriveThumbnailUrl(fileId, size = 200) {
    return `https://drive.google.com/uc?export=view&id=${fileId}&sz=w${size}`;
}

/**
 * Setup Google Drive integration with fallback to local images
 */
async function initializeGalleryWithGoogleDrive() {
    console.log('🔄 Initializing Google Drive integration...');

    const driveImages = await fetchGoogleDriveImages();

    if (driveImages.length > 0) {
        console.log(`✅ Loaded ${driveImages.length} images from Google Drive`);
        return driveImages;
    } else {
        console.log('⚠️ No images from Google Drive, falling back to local images');
        return null;
    }
}
