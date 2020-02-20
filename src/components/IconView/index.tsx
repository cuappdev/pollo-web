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
                <svg width="45" height="45" fill="none" viewBox="0 0 45 45">
                    <path fill="url(#a)" d="M0 0h41.818v50H0z"/>
                    <mask id="c" width="45" height="45" x="0" y="0" maskUnits="userSpaceOnUse">
                        <path fill="url(#b)" d="M0 0h45v45H0z"/>
                    </mask>
                    <g mask="url(#c)">
                        <path fill="#9EA7B3" d="M0 0h45v45H0z"/>
                    </g>
                    <defs>
                        <pattern id="a" width="1" height="1" patternContentUnits="objectBoundingBox">
                            <use transform="scale(.005)" xlinkHref="#d"/>
                        </pattern>
                        <pattern id="b" width="1" height="1" patternContentUnits="objectBoundingBox">
                            <use transform="scale(.005)" xlinkHref="#d"/>
                        </pattern>
                        <image id="d" width="200" height="200" xlinkHref="data:image/png;base64,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"/>
                    </defs>
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
