import * as React from 'react';

type InputProps = {
  id: string;
  type: string;
  value?: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  onEnter: (value: string) => void;
};

const Input = ({
  id,
  type,
  value,
  onChange,
  disabled = false,
  placeholder = '',
  onEnter,
}: InputProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onEnter(event.currentTarget.value);
    }
  };

  return (
    <div className='relative flex w-full items-center gap-2'>
      <input
        className='inline-flex h-8 w-full appearance-none items-center justify-center rounded-md bg-figma-secondaryBg px-3 text-xs leading-none text-figma-primary outline-none focus:outline-blue-700 disabled:cursor-not-allowed disabled:text-figma-secondary dark:focus:outline-figma-blue'
        type={type}
        id={id}
        onChange={onChange}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Input;
