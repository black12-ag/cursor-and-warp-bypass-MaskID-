import React, { useEffect, useRef } from 'react';

const OutputTerminal = ({ output }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="terminal-output" ref={terminalRef}>
      {output.length === 0 ? (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          No output yet. Run a tool to see the results here.
        </div>
      ) : (
        output.map((line, index) => (
          <div key={index} className="terminal-line">
            <span className="terminal-timestamp">{line.timestamp}</span>
            <span className="terminal-script">{line.scriptName}</span>
            <span className={`terminal-content ${line.type}`}>
              {line.content}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default OutputTerminal;
