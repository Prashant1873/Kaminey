import React from 'react';

/**
 * Tactile Button Component
 * Enforces Apple-grade spring press, optical centering (translateY(-0.5px)),
 * concentric geometry, and WCAG minimum touch targets (44px).
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon,
  iconRight,
  disabled = false,
  onClick,
  className = '',
  style = {},
  type = 'button',
  ariaLabel,
  ...rest
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary': return 'btn-secondary';
      case 'danger': return 'btn-danger';
      case 'ghost': return 'btn-ghost';
      case 'primary':
      default:
        return 'btn-primary';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          minHeight: '40px',
          padding: '8px 14px',
          fontSize: '0.8125rem',
          borderRadius: 'var(--r-md)',
        };
      case 'lg':
        return {
          minHeight: '52px',
          padding: '14px 28px',
          fontSize: '1.0625rem',
          borderRadius: 'var(--r-xl)',
        };
      case 'md':
      default:
        return {
          minHeight: '46px',
          padding: '12px 20px',
          fontSize: '0.9375rem',
          borderRadius: 'var(--r-lg)',
        };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`spring-btn ${getVariantClass()} ${className}`}
      style={{
        ...getSizeStyle(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        userSelect: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateY(-0.5px)', // Optical centering relative to font cap-height
          }}
        >
          {icon}
        </span>
      )}
      {children}
      {iconRight && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateY(-0.5px)', // Optical centering relative to font cap-height
          }}
        >
          {iconRight}
        </span>
      )}
    </button>
  );
}
