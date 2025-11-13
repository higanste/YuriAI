# How to Download and Install the Extension

## Quick Download

1. **Download from GitHub:**
   - Go to: https://github.com/higanste/AiAgent
   - Click the green "Code" button
   - Select "Download ZIP"
   - Extract the ZIP file

2. **Navigate to Extension Folder:**
   - Open the extracted folder
   - Go to the `extension` folder inside

3. **Install in Microsoft Edge:**
   - Open Microsoft Edge
   - Go to `edge://extensions/`
   - Enable "Developer mode" (toggle in bottom left)
   - Click "Load unpacked"
   - Select the `extension` folder
   - Done! The extension is now installed.

## Alternative: Direct Folder Download

If you have Git installed:
```bash
git clone https://github.com/higanste/AiAgent.git
cd AiAgent/extension
```

Then follow step 3 above to load it in Edge.

## What's Included

The extension folder contains:
- `manifest.json` - Extension configuration
- `background.js` - Background service worker
- `content.js` - Content script for web pages
- `popup.html/css/js` - Extension popup interface
- `icons/` - Extension icons
- `README.md` - Full documentation

## Troubleshooting

- **Extension not loading?** Make sure Developer mode is enabled
- **Icons missing?** See `ICON_INSTRUCTIONS.md` for creating icons
- **Errors in console?** Check that all files are in the extension folder

The extension is fully functional and ready to use!

