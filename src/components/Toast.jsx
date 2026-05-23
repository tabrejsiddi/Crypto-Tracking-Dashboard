import React, { useEffect } from 'react';

/**
 * SingleToast - Renders an individual toast popup and manages its auto-removal timer
 */
function SingleToast({ id, title, msg, type, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 5500);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  let iconClass = "fa-info-circle";
  if (type === 'success') iconClass = "fa-circle-check";
  if (type === 'error') iconClass = "fa-triangle-exclamation";
  if (type === 'warning') iconClass = "fa-triangle-exclamation";

  return (
    <div className={`toast ${type} show`}>
      <i className={`fa-solid ${iconClass} toast-icon`}></i>
      <div className="toast-info">
        <div className="toast-title">{title}</div>
        <div className="toast-msg">{msg}</div>
      </div>
    </div>
  );
}

/**
 * Toast Container - Renders a stack of active toasts in the top right
 */
export default function Toast({ toasts, onRemove }) {
  return (
    <div id="toast-container" className="toast-container">
      {toasts.map((toast) => (
        <SingleToast 
          key={toast.id}
          id={toast.id}
          title={toast.title}
          msg={toast.msg}
          type={toast.type}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
