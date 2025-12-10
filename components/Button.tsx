import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-pixel border-2 transition-transform active:translate-y-1 pixel-shadow pixel-shadow-hover focus:outline-none uppercase tracking-wider";
  
  const variants = {
    primary: "bg-retro-panel dark:bg-retro-darkPanel border-black dark:border-white text-black dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800",
    secondary: "bg-gray-200 dark:bg-gray-700 border-gray-500 text-gray-800 dark:text-gray-200",
    danger: "bg-red-100 dark:bg-red-900 border-red-600 text-red-800 dark:text-red-100"
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-xl",
    lg: "px-8 py-3 text-2xl"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
