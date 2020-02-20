import React from 'react';

export type IconViewType =
    | 'check'
    | 'ellipsis'
    | 'export-dropdown'
    | 'export-group-arrow'
    | 'export-group-back-arrow'
    | 'eye'
    | 'next-poll-arrow'
    | 'plus'
    | 'previous-poll-arrow'
    | 'sidebar-back-arrow';

export interface IconViewProps {
    type: IconViewType;
}

const IconView: React.FunctionComponent<IconViewProps> = ({
    type,
}) => {
    switch (type) {
        case 'check':
            return (
                <svg width="9" height="7" fill="none" viewBox="0 0 9 7">
                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M.5 3.5L3 6 8.5.5"/>
                </svg>
            );
        case 'ellipsis':
            return (
                <svg width="18" height="4" fill="none" viewBox="0 0 18 4">
                    <path fill="#9EA7B3" fillRule="evenodd" d="M15.178 0C14.13 0 13.28.895 13.28 2s.85 2 1.898 2c1.047 0 1.897-.895 1.897-2s-.85-2-1.897-2zM8.537 0C7.49 0 6.64.895 6.64 2s.85 2 1.897 2c1.048 0 1.898-.895 1.898-2s-.85-2-1.898-2zM1.897 0C.85 0 0 .895 0 2s.85 2 1.897 2c1.048 0 1.897-.895 1.897-2s-.849-2-1.897-2z" clipRule="evenodd" />
                </svg>
            );
        case 'export-dropdown':
            return (
                <svg width="17" height="7" fill="none" viewBox="0 0 17 7">
                    <path fill="#fff" fillRule="evenodd" d="M.29.2c-.387.268-.387.702 0 .97l7.375 5.087c.227.156.537.221.833.194.297.029.609-.036.837-.194L16.71 1.17c.388-.267.388-.701 0-.969-.388-.267-1.017-.267-1.404 0L8.5 4.895 1.695.201C1.308-.067.68-.067.291.2z" clipRule="evenodd"/>
                </svg>
            );
        case 'export-group-arrow':
            return (
                <svg width="9" height="15" fill="none" viewBox="0 0 9 15">
                    <path stroke="#3D3D3D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1.154 14l6.5-6.5-6.5-6.5"/>
                </svg>
            );
        case 'export-group-back-arrow':
            return (
                <svg width="9" height="15" fill="none" viewBox="0 0 9 15">
                    <path stroke="#3D3D3D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.5 1L1 7.5 7.5 14"/>
                </svg>
            );
        case 'eye':
            return (
                <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 41.2 45" width="41.2" height="45">
                    <defs>
                        <path d="M0 0L41.2 0L41.2 45L0 45L0 0Z" id="a2HRTXdDgB"></path>
                        <clipPath id="clipe7Mub4M0VZ">
                            <use xlinkHref="#a2HRTXdDgB" opacity="1"></use>
                        </clipPath>
                    </defs>
                    <g><g><g><g clipPath="url(#clipe7Mub4M0VZ)" opacity="1">
                        <image xlinkHref="data:image/png;base64,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" x="0" y="0" width="124" height="148" transform="matrix(0.33225806451612905 0 0 0.30405405405405406 -0.0032136513448577375 0.0019940780878755504)"></image>
                    </g></g></g></g>
                </svg>
            );
        case 'next-poll-arrow':
            return (
                <svg width="18" height="31" fill="none" viewBox="0 0 18 31">
                    <path fill="#fff" fillRule="evenodd" d="M1.374 30.703a1.012 1.012 0 0 0 1.432 0l14.25-14.25c.258-.258.348-.622.268-.953.08-.331-.01-.695-.268-.953L2.806.297a1.012 1.012 0 0 0-1.432 0L.297 1.374a1.012 1.012 0 0 0 0 1.432L12.99 15.5.297 28.194a1.012 1.012 0 0 0 0 1.432l1.077 1.077z" clipRule="evenodd"/>
                </svg>
            );
        case 'plus':
            return (
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <rect width="1.778" height="16" x="7.111" fill="#202020" rx=".889"/>
                    <rect width="1.778" height="16" x="16" y="7.111" fill="#202020" rx=".889" transform="rotate(90 16 7.111)"/>
                </svg>
            );
        case 'previous-poll-arrow':
            return (
                <svg width="18" height="31" fill="none" viewBox="0 0 18 31">
                    <path fill="#fff" fillRule="evenodd" d="M15.978.296a1.012 1.012 0 0 0-1.431 0L.297 14.546a1.012 1.012 0 0 0-.269.954c-.08.331.01.695.269.953l14.25 14.25a1.012 1.012 0 0 0 1.431 0l1.078-1.077a1.012 1.012 0 0 0 0-1.432L4.36 15.5 17.056 2.806a1.012 1.012 0 0 0 0-1.432L15.978.296z" clipRule="evenodd"/>
                </svg>
            );
        case 'sidebar-back-arrow':
            return (
                <svg width="9" height="15" fill="none" viewBox="0 0 9 15">
                    <path stroke="#202020" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.5 1L1 7.5 7.5 14"/>
                </svg>
            );
    }
};

export default IconView;
