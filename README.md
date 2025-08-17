# Bypass Tools Suite

A unified cross-platform GUI application that combines the functionality of popular bypass tools for Cursor IDE and Warp Terminal.

## Features

### 🔧 Cursor IDE Tools
- **Token Limit Bypass**: Remove token usage limitations and enable unlimited requests
- **Version Bypass**: Bypass version restrictions and access newer features
- **Pro Feature Enable**: Enable Pro features without subscription
- **Automatic Backups**: Safe modifications with automatic backup creation

### 🔄 Warp Terminal Tools  
- **Identity Reset**: Reset machine identity while keeping app installed (Recommended)
- **Complete Removal**: Completely remove Warp and all traces from system
- **Cross-Platform**: Works on macOS and Windows (Linux limited)
- **Safe Operation**: Graceful error handling and confirmation prompts

## Platform Support

| Platform | Cursor Tools | Warp Tools | Status |
|----------|--------------|------------|--------|
| 🍎 macOS | ✅ Full | ✅ Full | Complete |
| 🪟 Windows | ✅ Full | ✅ Full | Complete |
| 🐧 Linux | ✅ Full | ⚠️ Limited | Partial |

## Quick Start

### Prerequisites
- Node.js 16+ (for development)
- Python 3.6+ (for backend scripts)
- Administrator privileges (recommended)

### Installation

#### Option 1: Download Release (Recommended)
1. Download the latest release for your platform from the releases page
2. Install/run the application:
   - **macOS**: Open the `.dmg` file and drag to Applications
   - **Windows**: Run the `.exe` installer as Administrator
   - **Linux**: Run the `.AppImage` file or install the `.deb` package

#### Option 2: Build from Source
```bash
# Clone the repository
git clone <repository-url>
cd bypass-tools-suite

# Install dependencies
npm install

# For development
npm run electron-dev

# Build for production
npm run build
npm run dist

# Build for all platforms (requires appropriate SDKs)
npm run dist-all
```

## Usage

1. **Launch the application** - Run as Administrator on Windows for full functionality
2. **Select a tool category** - Choose between Cursor IDE or Warp Terminal tools
3. **Choose specific tool** - Select the bypass operation you want to perform
4. **Execute safely** - Follow prompts and warnings, backups are created automatically
5. **Monitor progress** - Watch terminal output for real-time feedback

### Security Notes

- **Administrator privileges** are required for modifying system files
- **Automatic backups** are created before any modifications
- **All operations are reversible** using the backup files
- **Safe error handling** prevents system damage

## How It Works

### Architecture
- **Frontend**: React with Ant Design for modern UI
- **Backend**: Python scripts (from original repositories)
- **Runtime**: Electron for cross-platform compatibility
- **IPC**: Secure communication between frontend and Python processes

### Integrated Tools
This application provides a GUI for these excellent command-line tools:
- [cursor-bypass-tool](https://github.com/black12-ag/cursor-bypass-tool) by black12-ag
- [warp-bypass](https://github.com/black12-ag/warp-bypass) by black12-ag

## Development

### Project Structure
```
bypass-tools-suite/
├── public/              # Electron main process and static files
│   ├── electron.js      # Main Electron process
│   ├── preload.js       # Secure IPC bridge
│   └── index.html       # HTML template
├── src/                 # React frontend source
│   ├── components/      # React components
│   ├── App.js          # Main app component  
│   └── index.js        # React entry point
├── backend/            # Python scripts
│   ├── bypass_*.py     # Cursor bypass scripts
│   ├── warp_*.py       # Warp bypass scripts
│   └── requirements.txt # Python dependencies
└── dist/               # Built applications
```

### Development Scripts
```bash
npm start           # Start React development server
npm run electron    # Start Electron in production mode
npm run electron-dev # Start Electron in development mode
npm run build       # Build React app for production
npm run dist        # Build Electron app for current platform
npm run dist-all    # Build for all platforms
```

### Building for Distribution

#### macOS (.dmg)
```bash
npm run build
npm run dist
# Output: dist/Bypass Tools Suite-1.0.0.dmg
```

#### Windows (.exe)
```bash
npm run build  
npm run dist
# Output: dist/Bypass Tools Suite Setup 1.0.0.exe
```

#### Linux (.AppImage, .deb)
```bash
npm run build
npm run dist
# Output: dist/Bypass Tools Suite-1.0.0.AppImage
#         dist/bypass-tools-suite_1.0.0_amd64.deb
```

## Legal & Ethical Use

⚖️ **Educational Purpose Only**
These tools are provided for educational purposes and personal use only. Users are responsible for complying with all applicable terms of service and laws.

### Important Notes
- These tools modify application files and may void warranties
- Use at your own risk - always backup your data
- Respect the terms of service of applications being modified  
- The authors are not responsible for any damages or consequences
- Support the original developers by purchasing legitimate licenses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

- Original bypass tools by [black12-ag](https://github.com/black12-ag)
- GUI implementation using React, Electron, and Ant Design
- Cross-platform packaging with Electron Builder

---

⭐ **Star this repository if you find it useful!**

Made with ❤️ for the developer community
