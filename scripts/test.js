#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Bypass Tools Suite...\n');

function runTest(testName, testFn) {
  try {
    console.log(`🔍 ${testName}...`);
    testFn();
    console.log(`✅ ${testName} passed\n`);
  } catch (error) {
    console.error(`❌ ${testName} failed:`, error.message);
    console.log('');
  }
}

function testProjectStructure() {
  const requiredFiles = [
    'package.json',
    'public/electron.js',
    'public/preload.js',
    'public/index.html',
    'src/App.js',
    'src/index.js',
    'backend/bypass_token_limit.py',
    'backend/warp_id_reset.py',
    'backend/warp_remover.py'
  ];

  const requiredDirs = [
    'src/components',
    'backend',
    'public'
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`Required file missing: ${file}`);
    }
  }

  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      throw new Error(`Required directory missing: ${dir}`);
    }
  }
}

function testDependencies() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    'react',
    'electron',
    'antd',
    '@ant-design/icons'
  ];

  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep]) {
      throw new Error(`Required dependency missing: ${dep}`);
    }
  }

  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    throw new Error('node_modules not found. Run npm install first.');
  }
}

function testBuild() {
  try {
    execSync('npm run build', { stdio: 'pipe' });
    
    if (!fs.existsSync('build')) {
      throw new Error('Build directory not created');
    }
    
    const buildFiles = ['build/index.html', 'build/static'];
    for (const file of buildFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Build file missing: ${file}`);
      }
    }
  } catch (error) {
    throw new Error(`Build failed: ${error.message}`);
  }
}

function testPythonScripts() {
  const pythonScripts = [
    'backend/bypass_token_limit.py',
    'backend/bypass_version.py',
    'backend/warp_id_reset.py',
    'backend/warp_remover.py'
  ];

  for (const script of pythonScripts) {
    if (!fs.existsSync(script)) {
      throw new Error(`Python script missing: ${script}`);
    }

    // Check if script has proper shebang and imports
    const content = fs.readFileSync(script, 'utf8');
    if (!content.includes('import')) {
      throw new Error(`Python script appears invalid: ${script}`);
    }
  }
}

function testElectronConfig() {
  const electronJs = fs.readFileSync('public/electron.js', 'utf8');
  const preloadJs = fs.readFileSync('public/preload.js', 'utf8');

  // Check for essential Electron functionality
  if (!electronJs.includes('BrowserWindow') || !electronJs.includes('ipcMain')) {
    throw new Error('electron.js missing essential functionality');
  }

  if (!preloadJs.includes('contextBridge') || !preloadJs.includes('ipcRenderer')) {
    throw new Error('preload.js missing essential functionality');
  }
}

function testSecurityFeatures() {
  const preloadJs = fs.readFileSync('public/preload.js', 'utf8');
  const electronJs = fs.readFileSync('public/electron.js', 'utf8');

  // Check for security best practices
  if (!preloadJs.includes('contextBridge.exposeInMainWorld')) {
    throw new Error('Missing secure context bridge setup');
  }

  if (!electronJs.includes('contextIsolation: true')) {
    throw new Error('Context isolation not enabled');
  }

  if (!electronJs.includes('nodeIntegration: false')) {
    throw new Error('Node integration not properly disabled');
  }
}

// Main test runner
function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║         Bypass Tools Suite Test Suite       ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  const tests = [
    ['Project Structure', testProjectStructure],
    ['Dependencies', testDependencies],
    ['Python Scripts', testPythonScripts],
    ['Electron Configuration', testElectronConfig],
    ['Security Features', testSecurityFeatures],
    ['React Build', testBuild]
  ];

  let passed = 0;
  let failed = 0;

  for (const [name, testFn] of tests) {
    try {
      runTest(name, testFn);
      passed++;
    } catch (error) {
      console.error(`❌ ${name} failed:`, error.message);
      console.log('');
      failed++;
    }
  }

  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed! The application is ready for distribution.');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run dist (to build for current platform)');
    console.log('   2. Or run: npm run dist-all (to build for all platforms)');
    console.log('   3. Test the built application');
    console.log('   4. Distribute the installers\n');
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues before distribution.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
