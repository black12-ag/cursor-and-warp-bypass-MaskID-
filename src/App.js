import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, notification, Modal } from 'antd';
import {
  DesktopOutlined,
  CodeOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ToolOutlined
} from '@ant-design/icons';
import CursorTools from './components/CursorTools';
import WarpTools from './components/WarpTools';
import SystemInfo from './components/SystemInfo';
import Settings from './components/Settings';
import About from './components/About';
import OutputTerminal from './components/OutputTerminal';
import './App.css';

const { Header, Content, Sider, Footer } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTool, setSelectedTool] = useState('cursor');
  const [systemInfo, setSystemInfo] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [terminalVisible, setTerminalVisible] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Get system information on app start
    const fetchSystemInfo = async () => {
      try {
        const info = await window.electronAPI.getSystemInfo();
        setSystemInfo(info);
      } catch (error) {
        notification.error({
          message: 'Failed to get system information',
          description: error.message,
        });
      }
    };

    fetchSystemInfo();

    // Listen for script output
    const handleScriptOutput = (event, data) => {
      const timestamp = new Date().toLocaleTimeString();
      const outputLine = {
        timestamp,
        scriptName: data.scriptName,
        type: data.type,
        content: data.data
      };
      
      setTerminalOutput(prev => [...prev, outputLine]);
      
      // Show terminal if it's not visible and we have output
      if (!terminalVisible) {
        setTerminalVisible(true);
      }
    };

    window.electronAPI.onScriptOutput(handleScriptOutput);

    return () => {
      window.electronAPI.removeScriptOutputListener(handleScriptOutput);
    };
  }, [terminalVisible]);

  const menuItems = [
    {
      key: 'cursor',
      icon: <DesktopOutlined />,
      label: 'Cursor IDE Tools',
    },
    {
      key: 'warp',
      icon: <CodeOutlined />,
      label: 'Warp Terminal Tools',
    },
    {
      key: 'system',
      icon: <InfoCircleOutlined />,
      label: 'System Information',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      key: 'about',
      icon: <UserOutlined />,
      label: 'About',
    },
  ];

  const requestAdminPrivileges = async () => {
    try {
      const result = await window.electronAPI.requestAdminPrivileges();
      setIsAdminMode(result.isAdmin);
      
      if (result.success) {
        notification.success({
          message: 'Administrator Privileges',
          description: 'Running with administrator privileges',
        });
      } else {
        notification.warning({
          message: 'Administrator Privileges',
          description: 'Administrator privileges not available. Some features may be limited.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Failed to request admin privileges',
        description: error.message,
      });
    }
  };

  const renderContent = () => {
    switch (selectedTool) {
      case 'cursor':
        return <CursorTools systemInfo={systemInfo} isAdminMode={isAdminMode} />;
      case 'warp':
        return <WarpTools systemInfo={systemInfo} isAdminMode={isAdminMode} />;
      case 'system':
        return <SystemInfo systemInfo={systemInfo} />;
      case 'settings':
        return <Settings onRequestAdmin={requestAdminPrivileges} isAdminMode={isAdminMode} />;
      case 'about':
        return <About />;
      default:
        return <CursorTools systemInfo={systemInfo} isAdminMode={isAdminMode} />;
    }
  };

  const clearTerminal = () => {
    setTerminalOutput([]);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div className="app-logo">
          <ToolOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          {!collapsed && <span style={{ marginLeft: 12, color: 'white', fontWeight: 'bold' }}>Bypass Tools</span>}
        </div>
        
        <Menu
          theme="dark"
          defaultSelectedKeys={['cursor']}
          selectedKeys={[selectedTool]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => setSelectedTool(key)}
        />
      </Sider>
      
      <Layout>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <h2 style={{ margin: 0, color: '#1890ff' }}>
            {menuItems.find(item => item.key === selectedTool)?.label}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {systemInfo && (
              <span style={{ fontSize: '12px', color: '#666' }}>
                {systemInfo.platform} | {systemInfo.arch} 
                {isAdminMode && ' | Admin'}
              </span>
            )}
          </div>
        </Header>
        
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 560,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        
        <Footer style={{ textAlign: 'center', backgroundColor: colorBgContainer }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Bypass Tools Suite ©2024</span>
            <div>
              <a 
                onClick={() => setTerminalVisible(true)}
                style={{ marginRight: 16, cursor: 'pointer' }}
              >
                View Terminal Output ({terminalOutput.length})
              </a>
            </div>
          </div>
        </Footer>
      </Layout>

      <Modal
        title="Terminal Output"
        open={terminalVisible}
        onCancel={() => setTerminalVisible(false)}
        width={800}
        footer={[
          <button key="clear" onClick={clearTerminal}>
            Clear
          </button>,
          <button key="close" onClick={() => setTerminalVisible(false)}>
            Close
          </button>
        ]}
      >
        <OutputTerminal output={terminalOutput} />
      </Modal>
    </Layout>
  );
}

export default App;
