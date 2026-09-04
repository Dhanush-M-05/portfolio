import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

export const Button = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary', // 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'right',
  className = '',
  disabled = false,
  download = false,
  target,
  rel,
  type = 'button',
  ...rest
}) => {
  const buttonClasses = `btn btn-${variant} btn-${size} ${className} ${disabled ? 'btn-disabled' : ''}`.trim();

  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left" aria-hidden="true">
          {typeof Icon === 'function' ? <Icon size={size === 'sm' ? 15 : size === 'lg' ? 20 : 18} /> : Icon}
        </span>
      )}
      <span className="btn-text">{children}</span>
      {Icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right" aria-hidden="true">
          {typeof Icon === 'function' ? <Icon size={size === 'sm' ? 15 : size === 'lg' ? 20 : 18} /> : Icon}
        </span>
      )}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={buttonClasses} {...rest}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={buttonClasses}
        download={download}
        target={target || (href.startsWith('http') ? '_blank' : undefined)}
        rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;
