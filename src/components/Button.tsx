import * as React from 'react';
import classnames from 'classnames';

interface ButtonProps {
  id: string;
  variant: 'primary' | 'secondary';
  size: 'sm' | 'default';
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ id, variant, size = 'default', onClick, children }: ButtonProps) => {
  const variants = {
    primary: 'bg-figma-blue hover:bg-figma-blue-hover',
    secondary: 'bg-figma-secondaryBg hover:bg-figma-secondaryBg-hover',
  };

  const sizes = {
    sm: 'h-8 w-max',
    default: 'h-8 w-full',
  };

  return (
    <button
      className={classnames(
        variants[variant],
        sizes[size],
        'h-8 w-full rounded-md px-2 text-xs text-figma-secondary outline-none focus:outline-blue-700'
      )}
      id={id}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
