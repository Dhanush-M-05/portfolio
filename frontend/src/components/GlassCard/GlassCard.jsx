import React from 'react';
import './GlassCard.css';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  elevated = false,
  gradientBorder = false,
  as: Component = 'div',
  ...rest
}) => {
  const classes = [
    'custom-glass-card',
    hoverEffect ? 'has-hover' : '',
    elevated ? 'is-elevated' : '',
    gradientBorder ? 'has-gradient-border' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export default GlassCard;
