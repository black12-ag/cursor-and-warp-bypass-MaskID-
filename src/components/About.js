import React from 'react';
import { Card, Tag, Alert, Divider } from 'antd';
import {
  InfoCircleOutlined,
  GithubOutlined,
  BugOutlined,
  HeartOutlined,
  ToolOutlined
} from '@ant-design/icons';

const About = () => {
  return (
    <div>
      <Alert
        message="About Bypass Tools Suite"
        description="A unified cross-platform application for bypassing limitations in popular development tools."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div className="system-info-grid">
        <Card
          title={
            <span>
              <ToolOutlined /> Application Info
            </span>
          }
        >
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">Bypass Tools Suite</span>
          </div>

          <div className="info-item">
            <span className="info-label">Version</span>
            <Tag color="blue">1.0.0</Tag>
          </div>

          <div className="info-item">
            <span className="info-label">License</span>
            <Tag color="green">MIT</Tag>
          </div>

          <div className="info-item">
            <span className="info-label">Built With</span>
            <div>
              <Tag color="cyan">Electron</Tag>
              <Tag color="blue">React</Tag>
              <Tag color="orange">Python</Tag>
              <Tag color="purple">Ant Design</Tag>
            </div>
          </div>

          <div className="info-item">
            <span className="info-label">Platform Support</span>
            <div>
              <Tag color="green">macOS</Tag>
              <Tag color="green">Windows</Tag>
              <Tag color="orange">Linux</Tag>
            </div>
          </div>
        </Card>

        <Card
          title={
            <span>
              <HeartOutlined /> Features
            </span>
          }
        >
          <ul className="feature-list">
            <li>
              <strong>Cursor IDE Tools:</strong>
              <ul>
                <li>Token limit bypass</li>
                <li>Version restriction bypass</li>
                <li>Pro feature enablement</li>
              </ul>
            </li>
            <li>
              <strong>Warp Terminal Tools:</strong>
              <ul>
                <li>Machine identity reset</li>
                <li>Complete application removal</li>
                <li>Clean system state</li>
              </ul>
            </li>
            <li>
              <strong>Safety Features:</strong>
              <ul>
                <li>Automatic file backups</li>
                <li>Graceful error handling</li>
                <li>Reversible operations</li>
              </ul>
            </li>
          </ul>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <h4>📋 Integrated Tools</h4>
        <p className="description-text">
          This application integrates and provides a GUI for several powerful bypass tools:
        </p>

        <div className="system-info-grid">
          <div>
            <h5>🔧 Cursor Bypass Tool</h5>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Original repository: <code>black12-ag/cursor-bypass-tool</code>
            </p>
            <ul className="feature-list" style={{ fontSize: '13px' }}>
              <li>Token usage limit removal</li>
              <li>Version bypass functionality</li>
              <li>User interface modifications</li>
              <li>Multi-platform support</li>
            </ul>
          </div>

          <div>
            <h5>🔄 Warp Bypass Tool</h5>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Original repository: <code>black12-ag/warp-bypass</code>
            </p>
            <ul className="feature-list" style={{ fontSize: '13px' }}>
              <li>Machine identity reset</li>
              <li>Complete application removal</li>
              <li>System cleanup utilities</li>
              <li>Cross-platform compatibility</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h4>⚖️ Legal & Ethical Use</h4>
        <Alert
          message="Educational Purpose"
          description="These tools are provided for educational purposes and personal use only. Users are responsible for complying with all applicable terms of service and laws."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div className="feature-list">
          <h5>Important Notes:</h5>
          <ul>
            <li>These tools modify application files and may void warranties</li>
            <li>Use at your own risk - always backup your data</li>
            <li>Respect the terms of service of applications being modified</li>
            <li>The authors are not responsible for any damages or consequences</li>
            <li>Support the original developers by purchasing legitimate licenses</li>
          </ul>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h4>🛠️ Technical Details</h4>
        
        <div className="system-info-grid">
          <div>
            <h5>Architecture</h5>
            <ul className="feature-list" style={{ fontSize: '13px' }}>
              <li><strong>Frontend:</strong> React with Ant Design</li>
              <li><strong>Backend:</strong> Python scripts</li>
              <li><strong>Runtime:</strong> Electron</li>
              <li><strong>IPC:</strong> Secure context isolation</li>
              <li><strong>Packaging:</strong> Electron Builder</li>
            </ul>
          </div>

          <div>
            <h5>Security</h5>
            <ul className="feature-list" style={{ fontSize: '13px' }}>
              <li><strong>Context Isolation:</strong> Enabled</li>
              <li><strong>Node Integration:</strong> Disabled</li>
              <li><strong>Permissions:</strong> Minimal required access</li>
              <li><strong>Sandboxing:</strong> Partial (for file operations)</li>
              <li><strong>Updates:</strong> Manual verification</li>
            </ul>
          </div>
        </div>
      </Card>

      <Divider />

      <div style={{ textAlign: 'center', color: '#666' }}>
        <p>
          <HeartOutlined style={{ color: '#ff4d4f' }} /> Made with care for the developer community
        </p>
        <p style={{ fontSize: '12px' }}>
          This application combines the functionality of multiple bypass tools into a single, 
          user-friendly interface while maintaining the safety and reliability of the original scripts.
        </p>
      </div>
    </div>
  );
};

export default About;
