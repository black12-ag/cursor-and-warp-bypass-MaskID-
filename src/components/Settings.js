import React from 'react';
import { Card, Button, Switch, Alert, Divider } from 'antd';
import {
  SettingOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const Settings = ({ onRequestAdmin, isAdminMode }) => {
  return (
    <div>
      <Alert
        message="Application Settings"
        description="Configure application behavior and manage security permissions."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div className="system-info-grid">
        <Card
          title={
            <span>
              <SafetyOutlined /> Security & Permissions
            </span>
          }
        >
          <div className="info-item">
            <span className="info-label">Administrator Mode</span>
            <div>
              {isAdminMode ? (
                <div className="status-badge success">
                  <CheckCircleOutlined />
                  Active
                </div>
              ) : (
                <div>
                  <div className="status-badge warning" style={{ marginBottom: 8 }}>
                    <ExclamationCircleOutlined />
                    Inactive
                  </div>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={onRequestAdmin}
                  >
                    Request Admin Privileges
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Divider />

          <div className="description-text">
            <strong>Why Admin Privileges?</strong>
            <ul className="feature-list">
              <li>Modify application files in protected directories</li>
              <li>Clear system caches and registry entries</li>
              <li>Access and modify system-level configurations</li>
              <li>Ensure complete removal/reset operations</li>
            </ul>
          </div>
        </Card>

        <Card
          title={
            <span>
              <SettingOutlined /> Application Preferences
            </span>
          }
        >
          <div className="info-item">
            <span className="info-label">Auto-show Terminal Output</span>
            <Switch defaultChecked disabled />
          </div>

          <div className="info-item">
            <span className="info-label">Create Backups</span>
            <Switch defaultChecked disabled />
          </div>

          <div className="info-item">
            <span className="info-label">Confirm Destructive Actions</span>
            <Switch defaultChecked disabled />
          </div>

          <Divider />

          <div className="description-text">
            <em>Settings are currently read-only. These preferences are built into the application for safety.</em>
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <h4>Security Information</h4>
        <Alert
          message="Safe Operation"
          description="This application operates with strict security measures to protect your system while performing necessary modifications."
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div className="feature-list">
          <h5>Security Features:</h5>
          <ul>
            <li><strong>Automatic Backups:</strong> All original files are backed up before modification</li>
            <li><strong>Permission Checks:</strong> Operations only proceed with proper permissions</li>
            <li><strong>Error Handling:</strong> Graceful handling of permission and file access errors</li>
            <li><strong>Reversible Changes:</strong> All modifications can be undone using backup files</li>
            <li><strong>Confirmation Prompts:</strong> Destructive operations require explicit confirmation</li>
          </ul>
        </div>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h4>Platform-Specific Behavior</h4>
        
        <div className="system-info-grid">
          <div>
            <h5>🍎 macOS</h5>
            <ul className="feature-list" style={{ fontSize: '13px' }}>
              <li>Uses AppleScript for privilege elevation</li>
              <li>Modifies files in /Applications and ~/Library</li>
              <li>Updates Launch Services database</li>
              <li>Handles SIP (System Integrity Protection)</li>
            </ul>
          </div>

          <div>
            <h5>🪟 Windows</h5>
            <ul className="feature-list" style={{ fontSize: '13px' }}>
              <li>Requires "Run as Administrator" for full functionality</li>
              <li>Modifies files in Program Files and AppData</li>
              <li>Updates Windows Registry entries</li>
              <li>Handles UAC (User Account Control)</li>
            </ul>
          </div>

          <div>
            <h5>🐧 Linux</h5>
            <ul className="feature-list" style={{ fontSize: '13px' }}>
              <li>May require sudo for system-wide changes</li>
              <li>Modifies files in /opt and ~/.config</li>
              <li>Limited Warp support (Warp has limited Linux support)</li>
              <li>Handles various installation methods</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
