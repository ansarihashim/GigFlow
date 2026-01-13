import { useEffect, useState } from 'react';

export default function Toast({ message, title, onClose, duration = 5000 }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slight delay to allow animation to trigger
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for fade out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-24 right-6 z-50 transition-all duration-300 transform 
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
            <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 p-4 max-w-sm w-full flex items-start gap-4">
                <div className="flex-shrink-0 text-green-500 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#222222] mb-1">
                        {message}
                    </h4>
                    {title && (
                        <p className="text-sm text-[#717171]">
                            Gig: <span className="font-medium text-[#222222]">{title}</span>
                        </p>
                    )}
                </div>

                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-[#717171] hover:text-[#222222] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
