import React from 'react';

export type IconViewType =
    | 'check'
    | 'ellipsis'
    | 'export-dropdown'
    | 'export-group-arrow'
    | 'export-group-back-arrow'
    | 'plus';

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
                    <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" d="M.5 3.5L3 6 8.5.5"/>
                </svg>
            );
        case 'ellipsis':
            return (
                <svg width="18" height="4" fill="none" viewBox="0 0 18 4">
                    <path fill="#9EA7B3" fill-rule="evenodd" d="M15.178 0C14.13 0 13.28.895 13.28 2s.85 2 1.898 2c1.047 0 1.897-.895 1.897-2s-.85-2-1.897-2zM8.537 0C7.49 0 6.64.895 6.64 2s.85 2 1.897 2c1.048 0 1.898-.895 1.898-2s-.85-2-1.898-2zM1.897 0C.85 0 0 .895 0 2s.85 2 1.897 2c1.048 0 1.897-.895 1.897-2s-.849-2-1.897-2z" clip-rule="evenodd" />
                </svg>
            );
        case 'export-dropdown':
            return (
                <svg width="17" height="7" fill="none" viewBox="0 0 17 7">
                    <path fill="#fff" fill-rule="evenodd" d="M.29.2c-.387.268-.387.702 0 .97l7.375 5.087c.227.156.537.221.833.194.297.029.609-.036.837-.194L16.71 1.17c.388-.267.388-.701 0-.969-.388-.267-1.017-.267-1.404 0L8.5 4.895 1.695.201C1.308-.067.68-.067.291.2z" clip-rule="evenodd"/>
                </svg>
            );
        case 'export-group-arrow':
            return (
                <svg width="9" height="15" fill="none" viewBox="0 0 9 15">
                    <path stroke="#3D3D3D" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.154 14l6.5-6.5-6.5-6.5"/>
                </svg>
            );
        case 'export-group-back-arrow':
            return (
                <svg width="9" height="15" fill="none" viewBox="0 0 9 15">
                    <path stroke="#3D3D3D" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.5 1L1 7.5 7.5 14"/>
                </svg>
            );
        case 'plus':
            return (
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <rect width="1.778" height="16" x="7.111" fill="#202020" rx=".889"/>
                    <rect width="1.778" height="16" x="16" y="7.111" fill="#202020" rx=".889" transform="rotate(90 16 7.111)"/>
                </svg>
            );
    }
};

export default IconView;
