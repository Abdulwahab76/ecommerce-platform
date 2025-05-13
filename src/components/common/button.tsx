import React from 'react';

interface ButtonProps {
    variant?: 'solid' | 'outline';
    color?: string;
    bgColor?: string;
    rounded?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'solid',
    color = 'white',
    bgColor = 'black',
    rounded = true,
    children,
    onClick,
    className
}) => {
    const baseStyles = `px-4 py-2 font-medium focus:outline-none transition-all`;
    const variantStyles =
        variant === 'solid'
            ? `bg-${bgColor} text-${color}`
            : `border border-${bgColor} text-${bgColor} bg-transparent`;
    const roundedStyles = rounded ? 'rounded-full' : 'rounded';

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${roundedStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;