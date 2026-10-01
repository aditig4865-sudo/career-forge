import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClass = styles.button;
  const variantClass = styles[variant];
  const widthClass = fullWidth ? styles.fullWidth : '';
  
  const combinedClassName = `${baseClass} ${variantClass} ${widthClass} ${className}`.trim();
  
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
