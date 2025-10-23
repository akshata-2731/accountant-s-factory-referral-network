import React, { useState, useEffect } from 'react';
import { BellIcon } from './icons';

interface NotificationToastProps {
    message: string;
    note?: string;
    isRead: boolean;
    onClose: () => void;
    onMarkAsRead: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, note, isRead, onClose, onMarkAsRead }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fade in
        setIsVisible(true);

        // Set timer to auto-close only if it's read
        if (isRead) {
            const timer = setTimeout(() => {
                handleClose();
            }, 8000); // 8 seconds for read notifications
            return () => clearTimeout(timer);
        }
    }, [isRead]);
    
    const handleClose = () => {
        setIsVisible(false);
        // Wait for fade-out animation to finish before calling parent's onClose
        setTimeout(onClose, 300); 
    };

    return (
        <div 
            className={`relative flex items-start p-4 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} ${!isRead ? 'border-l-4 border-brand-teal' : ''}`}
        >
            <div className="flex-shrink-0 pt-0.5">
                <BellIcon className="w-6 h-6 text-brand-teal" />
            </div>
            <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-brand-gray">{message}</p>
                {note && (
                    <p className="mt-1 text-sm text-gray-500">{note}</p>
                )}
                {!isRead && (
                    <button 
                        onClick={onMarkAsRead}
                        className="mt-2 text-sm font-medium text-brand-teal hover:underline focus:outline-none"
                    >
                        Mark as read
                    </button>
                )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button
                    onClick={handleClose}
                    className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                >
                    <span className="sr-only">Close</span>
                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;