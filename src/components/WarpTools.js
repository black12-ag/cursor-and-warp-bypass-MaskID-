import React, { useState } from 'react';
import { Card, Button, notification, Alert, List, Tag, Modal } from 'antd';
import {
  ReloadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

const WarpTools = ({ systemInfo, isAdminMode }) => {
  const [loading, setLoading] = useState({
    reset: false,
    remove: false
  });

  const executeScript = async (scriptName, description, isDestructive = false) => {
    if (isDestructive) {
      confirm({
        title: `Confirm ${description}`,
        icon: <ExclamationCircleOutlined />,
        content: `Are you sure you want to proceed with ${description}? This action cannot be undone.`,
        okText: 'Yes, Proceed',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          await performScript(scriptName, description);
        }
      });
    } else {
      await performScript(scriptName, description);
    }
  };

  const performScript = async (scriptName, description) => {
    try {
      const scriptKey = scriptName.replace('warp_', '');
      setLoading(prev => ({ ...prev, [scriptKey]: true }));
      
      notification.info({
        message: 'Starting Process',
        description: `Starting ${description}...`,
        duration: 2
      });

      const result = await window.electronAPI.executePythonScript(scriptName);
      
      if (result.success) {
        notification.success({
          message: 'Success!',
          description: `${description} completed successfully.`,
          duration: 4
        });
      } else {
        notification.error({
          message: 'Process Failed',
          description: `${description} failed. Check terminal output for details.`,
          duration: 6
        });
      }
    } catch (error) {
      notification.error({
        message: 'Execution Error',
        description: error.message,
        duration: 6
      });
    } finally {
      const scriptKey = scriptName.replace('warp_', '');
      setLoading(prev => ({ ...prev, [scriptKey]: false }));
    }
  };

  const platformSupport = {
    'darwin': { name: 'macOS', supported: true },
    'win32': { name: 'Windows', supported: true },
    'linux': { name: 'Linux', supported: false }
  };

  const currentPlatform = systemInfo?.platform || 'unknown';
  const isSupported = platformSupport[currentPlatform]?.supported || false;

  return (
    <div>
      <Alert
        message="Warp Terminal Bypass Tools"
        description="These tools help reset your Warp terminal identity or completely remove the application. Choose the appropriate tool based on your needs."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {!isSupported && (
        <Alert
          message="Limited Platform Support"
          description={`Linux support is currently limited. These tools are optimized for macOS and Windows.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <div className="system-info-grid">
        <Card 
          className="tool-card"
          title={
            <span>
              <ReloadOutlined /> Identity Reset (Recommended)
            </span>
          }
          extra={
            <div className="platform-support">
              {Object.entries(platformSupport).map(([platform, info]) => (
                <Tag 
                  key={platform} 
                  color={info.supported ? 'green' : 'orange'}
                  className={`platform-tag ${info.supported ? 'supported' : 'unsupported'}`}
                >
                  {info.name}
                </Tag>
              ))}
            </div>
          }
        >
          <p className="description-text">
            Resets your Warp machine identity while keeping the application installed.
            Perfect for bypassing device limitations without the need to reinstall.
          </p>

          <List 
            size="small"
            className="feature-list"
            dataSource={[
              'Keeps Warp installed',
              'Resets machine identity',
              'Clears user data and preferences',
              'Fast and convenient',
              'No need to reinstall'
            ]}
            renderItem={item => (
              <List.Item>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                {item}
              </List.Item>
            )}
          />

          <div className="action-buttons">
            <Button
              type="primary"
              size="large"
              icon={loading.reset ? <LoadingOutlined spin /> : <ReloadOutlined />}
              onClick={() => executeScript('warp_id_reset', 'Warp Identity Reset')}
              loading={loading.reset}
              disabled={!isSupported}
            >
              Reset Identity
            </Button>
          </div>

          <div className="warning-text" style={{ marginTop: 12 }}>
            <ExclamationCircleOutlined />
            Warp will see you as a new user after reset
          </div>
        </Card>

        <Card 
          className="tool-card"
          title={
            <span>
              <DeleteOutlined /> Complete Removal
            </span>
          }
        >
          <p className="description-text">
            Completely removes Warp terminal from your system and cleans all traces.
            Use this when you want a completely fresh start or need to troubleshoot issues.
          </p>

          <List 
            size="small"
            className="feature-list"
            dataSource={[
              'Removes entire application',
              'Deep system cleanup',
              'Fresh machine identity',
              'Complete uninstallation',
              'Requires reinstallation'
            ]}
            renderItem={item => (
              <List.Item>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                {item}
              </List.Item>
            )}
          />

          <div className="danger-zone">
            <h4>⚠️ Danger Zone</h4>
            <p style={{ color: '#666', marginBottom: 12 }}>
              This will completely remove Warp from your system. You will need to reinstall it afterwards.
            </p>
            
            <Button
              type="primary"
              danger
              size="large"
              icon={loading.remove ? <LoadingOutlined spin /> : <DeleteOutlined />}
              onClick={() => executeScript('warp_remover', 'Complete Warp Removal', true)}
              loading={loading.remove}
              disabled={!isSupported}
            >
              Remove Warp Completely
            </Button>
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <h4>Which Tool Should You Use?</h4>
        <div className="system-info-grid">
          <div>
            <h5 style={{ color: '#1890ff' }}>Use Identity Reset When:</h5>
            <ul className="feature-list">
              <li>You want to bypass machine limits</li>
              <li>You need a fresh start without reinstalling</li>
              <li>You want to fix app issues quickly</li>
              <li>You prefer faster recovery</li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: '#ff4d4f' }}>Use Complete Removal When:</h5>
            <ul className="feature-list">
              <li>You want a clean slate reinstall</li>
              <li>You're troubleshooting serious issues</li>
              <li>You need to remove all traces</li>
              <li>You're switching to a different terminal</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h4>How These Tools Work</h4>
        <p className="description-text">
          Both tools target different aspects of Warp's system integration:
        </p>
        <ul className="feature-list">
          <li>
            <strong>Identity Reset:</strong> Clears user data, preferences, and machine-specific identifiers
          </li>
          <li>
            <strong>Complete Removal:</strong> Removes application files, system entries, and all user data
          </li>
          <li>
            <strong>Safe Operation:</strong> Handles permission errors gracefully
          </li>
          <li>
            <strong>Cross-Platform:</strong> Works on both macOS and Windows with platform-specific optimizations
          </li>
        </ul>
      </Card>

      {isAdminMode && (
        <div className="status-badge success" style={{ marginTop: 16 }}>
          <CheckCircleOutlined />
          Running with administrator privileges - Full access available
        </div>
      )}

      {!isAdminMode && (
        <div className="status-badge warning" style={{ marginTop: 16 }}>
          <WarningOutlined />
          Some features may require administrator privileges
        </div>
      )}
    </div>
  );
};

export default WarpTools;
