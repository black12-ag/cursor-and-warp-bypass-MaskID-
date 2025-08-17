import React from 'react';
import { Card, Descriptions, Tag, Alert } from 'antd';
import {
  DesktopOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

const SystemInfo = ({ systemInfo }) => {
  if (!systemInfo) {
    return (
      <Alert
        message="Loading System Information"
        description="Gathering system details..."
        type="info"
        showIcon
      />
    );
  }

  const getPlatformName = (platform) => {
    const platformNames = {
      'darwin': 'macOS',
      'win32': 'Windows',
      'linux': 'Linux',
      'freebsd': 'FreeBSD',
      'openbsd': 'OpenBSD'
    };
    return platformNames[platform] || platform;
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'darwin':
        return '🍎';
      case 'win32':
        return '🪟';
      case 'linux':
        return '🐧';
      default:
        return '💻';
    }
  };

  const getArchitecture = (arch) => {
    const archNames = {
      'x64': 'x86_64 (64-bit)',
      'ia32': 'x86 (32-bit)', 
      'arm64': 'ARM64 (64-bit)',
      'arm': 'ARM (32-bit)'
    };
    return archNames[arch] || arch;
  };

  const getSupportLevel = (platform) => {
    const support = {
      'darwin': { level: 'Full', color: 'green', icon: <CheckCircleOutlined /> },
      'win32': { level: 'Full', color: 'green', icon: <CheckCircleOutlined /> },
      'linux': { level: 'Limited', color: 'orange', icon: <WarningOutlined /> }
    };
    return support[platform] || { level: 'Unknown', color: 'red', icon: <WarningOutlined /> };
  };

  const platformName = getPlatformName(systemInfo.platform);
  const platformIcon = getPlatformIcon(systemInfo.platform);
  const architecture = getArchitecture(systemInfo.arch);
  const support = getSupportLevel(systemInfo.platform);

  return (
    <div>
      <Alert
        message="System Information"
        description="Current system details and compatibility information for bypass tools."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div className="system-info-grid">
        <Card 
          title={
            <span>
              <DesktopOutlined /> System Details
            </span>
          }
        >
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Operating System">
              <span style={{ fontSize: '16px' }}>
                {platformIcon} {platformName}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Architecture">
              {architecture}
            </Descriptions.Item>
            <Descriptions.Item label="Node.js Version">
              {systemInfo.version}
            </Descriptions.Item>
            <Descriptions.Item label="App Version">
              {systemInfo.appVersion}
            </Descriptions.Item>
            <Descriptions.Item label="Platform Code">
              <code>{systemInfo.platform}</code>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title={
            <span>
              <InfoCircleOutlined /> Tool Compatibility
            </span>
          }
        >
          <div className="info-item">
            <span className="info-label">Support Level</span>
            <Tag color={support.color} icon={support.icon}>
              {support.level} Support
            </Tag>
          </div>

          <div className="info-item">
            <span className="info-label">Cursor Tools</span>
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Supported
            </Tag>
          </div>

          <div className="info-item">
            <span className="info-label">Warp Tools</span>
            <Tag 
              color={systemInfo.platform === 'linux' ? 'orange' : 'green'} 
              icon={systemInfo.platform === 'linux' ? <WarningOutlined /> : <CheckCircleOutlined />}
            >
              {systemInfo.platform === 'linux' ? 'Limited' : 'Full'} Support
            </Tag>
          </div>

          <div className="info-item">
            <span className="info-label">Admin Privileges</span>
            <Tag color="blue">
              Platform Dependent
            </Tag>
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <h4>Platform-Specific Notes</h4>
        
        {systemInfo.platform === 'darwin' && (
          <Alert
            message="macOS Detected"
            description="All tools are fully supported. Some operations may require administrator privileges, which will be requested when needed."
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {systemInfo.platform === 'win32' && (
          <Alert
            message="Windows Detected" 
            description="All tools are fully supported. For best results, run the application as Administrator for operations that modify system files."
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {systemInfo.platform === 'linux' && (
          <Alert
            message="Linux Detected"
            description="Cursor tools are fully supported. Warp terminal tools have limited support as Warp has limited Linux availability."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div className="feature-list">
          <h5>System Requirements:</h5>
          <ul>
            <li>Node.js runtime (provided by Electron)</li>
            <li>Python 3.6+ (for backend scripts)</li>
            <li>Administrator/root privileges (for some operations)</li>
            <li>Target applications installed (Cursor IDE, Warp Terminal)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default SystemInfo;
