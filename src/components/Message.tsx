import type { ReactNode } from 'react';

interface MessageProps {
    variant?: 'danger' | 'success' | 'info';
    children: ReactNode;
}

const Message = ({ variant = 'info', children }: MessageProps) => {
    // Define as cores baseado na variante
    let colorClass = 'bg-blue-100 text-blue-800 border-blue-200';

    if (variant === 'danger') {
        colorClass = 'bg-red-100 text-red-800 border-red-200';
    } else if (variant === 'success') {
        colorClass = 'bg-green-100 text-green-800 border-green-200';
    }

    return (
        <div className={`p-4 mb-4 text-sm rounded-lg border ${colorClass}`} role="alert">
            {children}
        </div>
    );
};

export default Message;