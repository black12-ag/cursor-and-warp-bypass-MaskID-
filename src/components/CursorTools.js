import React, { useState } from 'react';
import { Card, Button, notification, Alert, List, Tag, Row, Col, Divider } from 'antd';
import {
  RocketOutlined,
  TagOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
  UserAddOutlined,
  GoogleOutlined,
  GithubOutlined,
  ToolOutlined,
  DeleteOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  SafetyOutlined,
  PoweroffOutlined
} from '@ant-design/icons';

const CursorTools = ({ systemInfo, isAdminMode }) => {
  const [loading, setLoading] = useState({});

  const executeScript = async (scriptName, description) => {
    try {
      setLoading(prev => ({ ...prev, [scriptName]: true }));
      
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
      setLoading(prev => ({ ...prev, [scriptName]: false }));
    }
  };

  const tools = [
    {
      id: 'reset_machine',
      title: 'Machine Reset',
      icon: <ReloadOutlined />,
      description: 'Reset Cursor machine identity for fresh registration',
      script: 'reset_machine_manual',
      category: 'reset',
      color: '#52c41a'
    },
    {
      id: 'register_google',
      title: 'Google Registration',
      icon: <GoogleOutlined />,
      description: 'Register new Cursor account with Google (Lifetime Access)',
      script: 'cursor_register_google', 
      category: 'register',
      color: '#1890ff',
      premium: true
    },
    {
      id: 'register_github',
      title: 'GitHub Registration', 
      icon: <GithubOutlined />,
      description: 'Register new Cursor account with GitHub (Lifetime Access)',
      script: 'cursor_register_github',
      category: 'register', 
      color: '#722ed1',
      premium: true
    },
    {
      id: 'register_manual',
      title: 'Manual Registration',
      icon: <UserAddOutlined />,
      description: 'Manually register new Cursor account with email',
      script: 'cursor_register_manual',
      category: 'register',
      color: '#13c2c2'
    },
    {
      id: 'bypass_token_limit',
      title: 'Token Limit Bypass',
      icon: <RocketOutlined />,
      description: 'Remove token usage limitations and enable unlimited requests',
      script: 'bypass_token_limit',
      category: 'bypass',
      color: '#fa541c'
    },
    {
      id: 'bypass_version', 
      title: 'Version Bypass',
      icon: <TagOutlined />,
      description: 'Bypass version restrictions and access newer features',
      script: 'bypass_version',
      category: 'bypass',
      color: '#fa8c16'
    },
    {
      id: 'totally_reset',
      title: 'Complete Reset',
      icon: <PoweroffOutlined />,
      description: 'Completely reset Cursor to factory settings',
      script: 'totally_reset_cursor',
      category: 'reset',
      color: '#f5222d'
    },
    {
      id: 'disable_auto_update',
      title: 'Disable Auto Update',
      icon: <SafetyOutlined />,
      description: 'Prevent Cursor from automatically updating',
      script: 'disable_auto_update',
      category: 'settings',
      color: '#722ed1'
    },
    {
      id: 'delete_google_account',
      title: 'Delete Google Account',
      icon: <DeleteOutlined />,
      description: 'Remove Google account from Cursor',
      script: 'delete_cursor_google',
      category: 'cleanup',
      color: '#ff4d4f'
    },
    {
      id: 'check_user_authorized',
      title: 'Check Authorization',
      icon: <InfoCircleOutlined />,
      description: 'Verify user authorization status',
      script: 'check_user_authorized',
      category: 'info',
      color: '#1890ff'
    },
    {
      id: 'quit_cursor',
      title: 'Quit Cursor',
      icon: <PoweroffOutlined />,
      description: 'Safely quit all Cursor processes',
      script: 'quit_cursor',
      category: 'utility',
      color: '#faad14'
    }
  ];

  const features = [
    'Remove token usage limits',
    'Bypass version restrictions', 
    'Enable Pro features',
    'Cross-platform compatibility',
    'Automatic backup creation'
  ];

  const platformSupport = {
    'darwin': { name: 'macOS', supported: true },
    'win32': { name: 'Windows', supported: true },
    'linux': { name: 'Linux', supported: true }
  };

  const currentPlatform = systemInfo?.platform || 'unknown';
  const isSupported = platformSupport[currentPlatform]?.supported || false;

  const categoryColors = {
    'bypass': '#fa541c',
    'register': '#1890ff', 
    'reset': '#52c41a',
    'settings': '#722ed1',
    'cleanup': '#ff4d4f',
    'info': '#13c2c2',
    'utility': '#faad14'
  };

  const getCategoryBadge = (category) => {
    const categoryNames = {
      'bypass': 'Bypass',
      'register': 'Register',
      'reset': 'Reset',
      'settings': 'Settings', 
      'cleanup': 'Cleanup',
      'info': 'Info',
      'utility': 'Utility'
    };
    return (
      <Tag color={categoryColors[category]} size="small">
        {categoryNames[category] || category}
      </Tag>
    );
  };

  const renderToolCard = (tool) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={tool.id}>
      <Card
        size="small"
        hoverable
        style={{ 
          height: '100%', 
          marginBottom: 12,
          border: `2px solid ${tool.color}20`,
          borderRadius: 8
        }}
        bodyStyle={{ padding: '16px' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: tool.color, fontSize: '14px', fontWeight: 600 }}>
              {tool.icon} {tool.title}
            </span>
            {tool.premium && <Tag color="gold" size="small">PRO</Tag>}
          </div>
        }
        extra={getCategoryBadge(tool.category)}
      >
        <p style={{ 
          fontSize: '13px', 
          color: '#666', 
          marginBottom: 16, 
          lineHeight: '1.4',
          minHeight: '42px'
        }}>
          {tool.description}
        </p>
        
        <Button
          type="primary"
          size="small"
          block
          style={{ 
            backgroundColor: tool.color,
            borderColor: tool.color,
            height: '32px'
          }}
          icon={loading[tool.script] ? <LoadingOutlined spin /> : tool.icon}
          onClick={() => executeScript(tool.script, tool.title)}
          loading={loading[tool.script]}
          disabled={!isSupported}
        >
          {loading[tool.script] ? 'Running...' : 'Execute'}
        </Button>
      </Card>
    </Col>
  );

  return (
    <div>
      <Alert
        message="Complete Cursor IDE Bypass Tools Suite"
        description="Access all 11+ powerful tools from the original cursor-bypass-tool repository in one unified interface. Ensure Cursor is closed before running any tool."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {!isSupported && (
        <Alert
          message="Platform Warning"
          description={`Your platform (${currentPlatform}) may have limited compatibility. Some tools might require manual configuration.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Platform Support Info */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <span><strong>Platform Support:</strong></span>
          <div>
            {Object.entries(platformSupport).map(([platform, info]) => (
              <Tag 
                key={platform} 
                color={info.supported ? 'green' : 'orange'}
                style={{ margin: '0 4px' }}
              >
                {info.name} {info.supported ? '✓' : '⚠️'}
              </Tag>
            ))}
            {isAdminMode && <Tag color="blue">Admin Mode ✓</Tag>}
          </div>
        </div>
      </Card>

      {/* Tools Grid */}
      <Row gutter={[12, 12]}>
        {tools.map(tool => renderToolCard(tool))}
      </Row>

      {/* Feature Summary */}
      <Card style={{ marginTop: 16 }} title="Complete Feature Set">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <h5 style={{ color: '#1890ff' }}>🔧 Registration & Auth Tools:</h5>
            <ul style={{ fontSize: '13px', paddingLeft: 20 }}>
              <li>Google Account Registration (Lifetime Access)</li>
              <li>GitHub Account Registration (Lifetime Access)</li>
              <li>Manual Email Registration</li>
              <li>Machine Identity Reset</li>
              <li>Account Authorization Check</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <h5 style={{ color: '#fa541c' }}>🚀 Bypass & Enhancement:</h5>
            <ul style={{ fontSize: '13px', paddingLeft: 20 }}>
              <li>Token Usage Limit Removal</li>
              <li>Version Restriction Bypass</li>
              <li>Auto-Update Prevention</li>
              <li>Complete System Reset</li>
              <li>Process Management</li>
            </ul>
          </Col>
        </Row>
        
        <Divider />
        
        <div style={{ textAlign: 'center', color: '#666', fontSize: '13px' }}>
          <strong>🛡️ Safety Features:</strong> Automatic backups • Reversible changes • Error handling • Admin privilege management
        </div>
      </Card>
    </div>
  );
};

export default CursorTools;
