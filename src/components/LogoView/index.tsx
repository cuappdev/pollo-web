import React from 'react';

export type LogoViewType =
    | 'small-background'
    | 'large-background'
    | 'no-background';

export interface LogoViewProps {
    type: LogoViewType;
}

const LogoView: React.FunctionComponent<LogoViewProps> = ({
    type,
}) => {
    switch (type) {
        case 'small-background':
            return (
                <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                    <rect width="64" height="64" fill="url(#a)" rx="13.824"/>
                    <circle cx="42.368" cy="46.208" r="5.248" fill="#fff"/>
                    <path fill="#fff" d="M28.791 12.672c6.921 0 12.873 4.608 12.873 11.902 0 2.186-.192 9.346-8.96 12.738-3.425 1.325-4.315 3.904-4.315 5.917v4.641c0 1.538-1.381 3.586-3.621 3.586s-3.689-2.048-3.689-3.586v-5.92c0-4.19 2.217-7.582 7.081-9.758 5.97-2.67 6.4-5.632 6.4-7.618 0-1.986-1.984-4.994-5.546-4.994-2.39 0-3.67 1.538-4.413 2.59-.781 1.384-.793 2.918-.793 3.878 0 1.984-1.536 3.648-3.584 3.648-1.983 0-3.712-1.607-3.712-3.586 0-1.446-.279-4.134 1.36-7.04 1.783-3.158 5.566-6.232 10.92-6.398z"/>
                    <defs>
                        <linearGradient id="a" x1="32" x2="32" y2="64" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#3BD5B1"/>
                            <stop offset="1" stopColor="#1FB28D"/>
                        </linearGradient>
                    </defs>
                </svg>
            );
        case 'large-background':
            return (
                <svg width="170" height="170" fill="none" viewBox="0 0 170 170">
                    <rect width="170" height="170" fill="url(#a)" rx="36.936"/>
                    <circle cx="112.54" cy="122.74" r="13.94" fill="#fff"/>
                    <path fill="#fff" d="M76.477 33.66c18.383 0 34.193 12.24 34.193 31.615 0 5.808-.51 24.825-23.8 33.835-9.098 3.52-11.461 10.37-11.461 15.718v12.327c0 4.085-3.669 9.525-9.619 9.525-5.95 0-9.799-5.44-9.799-9.524v-15.728c0-11.128 5.889-20.138 18.809-25.918 15.858-7.094 17-14.96 17-20.234C91.8 60 86.53 52.01 77.068 52.01c-6.348 0-9.748 4.084-11.722 6.878-2.075 3.677-2.106 7.751-2.106 10.301 0 5.27-4.08 9.69-9.52 9.69-5.268 0-9.86-4.267-9.86-9.524 0-3.843-.74-10.982 3.615-18.7 4.734-8.39 14.783-16.556 29.002-16.996z"/>
                    <defs>
                        <linearGradient id="a" x1="85" x2="85" y2="170" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#3BD5B1"/>
                            <stop offset="1" stopColor="#1FB28D"/>
                        </linearGradient>
                    </defs>
                </svg>
            );
        case 'no-background':
            return (
                <svg width="100" height="100" fill="none" viewBox="0 0 100 100">
                    <ellipse cx="66.2" cy="72.2" fill="#fff" rx="8.2" ry="8.2"/>
                    <path fill="#fff" d="M44.986 19.8C55.8 19.8 65.1 27 65.1 38.397c0 3.416-.3 14.603-14 19.903-5.352 2.07-6.742 6.1-6.742 9.246v7.251c0 2.403-2.158 5.603-5.658 5.603-3.5 0-5.764-3.2-5.764-5.603v-9.25C32.936 59 36.4 53.7 44 50.3c9.328-4.173 10-8.8 10-11.903 0-3.102-3.1-7.802-8.666-7.802-3.734 0-5.734 2.402-6.895 4.046C37.219 36.804 37.2 39.2 37.2 40.7c0 3.1-2.4 5.7-5.6 5.7-3.099 0-5.8-2.51-5.8-5.603 0-2.26-.436-6.46 2.126-11 2.785-4.935 8.696-9.738 17.06-9.997z"/>
                </svg>
            );
    }
};

export default LogoView;
