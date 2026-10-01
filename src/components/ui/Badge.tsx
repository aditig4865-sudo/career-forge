import React, { HTMLAttributes } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'skill' | 'status';
}

export function Badge({ variant = 'skill', className = '', children, ...props }: BadgeProps) {
  const variantClass = styles[variant];
  const combinedClassName = `${styles.badge} ${variantClass} ${className}`.trim();
  
  return (
    <span className={combinedClassName} {...props}>
      {children}
    </span>
  );
}
