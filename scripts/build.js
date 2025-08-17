#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Bypass Tools Suite for distribution...\n');

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkRequirements() {
  console.log('🔍 Checking requirements...');
  
  // Check Node.js version
  const nodeVersion = process.version;
  console.log(`Node.js version: ${nodeVersion}`);
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Run this script from the project root.');
    process.exit(1);
  }
  
  // Check if backend directory exists
  if (!fs.existsSync('backend')) {
    console.error('❌ backend directory not found.');
    process.exit(1);
  }
  
  console.log('✅ Requirements check passed\n');
}

function prepareBuild() {
  console.log('🔧 Preparing build environment...');
  
  // Clean previous builds
  if (fs.existsSync('build')) {
    runCommand('rm -rf build', 'Cleaning previous React build');
  }
  
  if (fs.existsSync('dist')) {
    runCommand('rm -rf dist', 'Cleaning previous Electron build');
  }
  
  console.log('✅ Build environment prepared\n');
}

function buildReact() {
  runCommand('npm run build', 'Building React application');
}

function buildElectron() {
  const platform = process.platform;
  const arch = process.arch;
  
  console.log(`🔧 Building Electron app for ${platform}-${arch}...`);
  
  try {
    if (process.argv.includes('--all-platforms')) {
      runCommand('npm run dist-all', 'Building for all platforms');
    } else {
      runCommand('npm run dist', `Building for current platform (${platform}-${arch})`);
    }
  } catch (error) {
    console.error('❌ Electron build failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Ensure you have the required SDKs for target platforms');
    console.log('   - On Windows: Install Visual Studio Build Tools');
    console.log('   - On macOS: Install Xcode Command Line Tools');
    console.log('   - On Linux: Install build-essential');
    process.exit(1);
  }
}

function showResults() {
  console.log('🎉 Build completed successfully!\n');
  
  if (fs.existsSync('dist')) {
    console.log('📁 Built files are located in the dist/ directory:');
    const files = fs.readdirSync('dist');
    files.forEach(file => {
      const filePath = path.join('dist', file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   📄 ${file} (${size} MB)`);
    });
  }
  
  console.log('\n🚀 Installation instructions:');
  console.log('   macOS: Open the .dmg file and drag to Applications folder');
  console.log('   Windows: Run the .exe installer as Administrator');
  console.log('   Linux: Run the .AppImage file or install the .deb package');
  
  console.log('\n⚠️  Remember to run the app with administrator privileges for full functionality!');
}

// Main build process
function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║           Bypass Tools Suite Builder        ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  
  checkRequirements();
  prepareBuild();
  buildReact();
  buildElectron();
  showResults();
}

if (require.main === module) {
  main();
}
