import React, { useEffect, useRef } from 'react';

/**
 * ConsoleBox Component - Renders real-time execution outputs of our async promise fetches
 */
export default function ConsoleBox({ logs, onClear }) {
  const consoleBodyRef = useRef(null);

  // Auto-scroll to bottom of log stream whenever logs change
  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="console-box">
      <div className="console-header">
        <div className="window-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <span className="console-title">
          <i className="fa-solid fa-code text-cyan"></i> Live Asynchronous Log Stream
        </span>
        <button className="clear-btn" onClick={onClear} title="Clear Log Console">
          <i className="fa-solid fa-trash-can"></i> Clear Log
        </button>
      </div>
      
      <div ref={consoleBodyRef} className="console-body">
        {logs.map((log, index) => (
          <div key={index} className={`log-line ${log.type}`}>
            <span className="log-time">[{log.time}]</span> {log.text}
          </div>
        ))}
      </div>
    </div>
  );
}
