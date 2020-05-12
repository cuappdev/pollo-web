import React from 'react';

export type IconViewType =
    | 'add-option-plus'
    | 'black-x'
    | 'check'
    | 'ellipsis'
    | 'export-date-selected'
    | 'export-date-unselected'
    | 'export-dropdown'
    | 'export-group-arrow'
    | 'export-group-back-arrow'
    | 'new-group-close'
    | 'next-poll-arrow'
    | 'option-selected-check'
    | 'option-unselected-check'
    | 'plus'
    | 'previous-poll-arrow'
    | 'right-arrow'
    | 'sidebar-back-arrow';

export interface IconViewProps {
    type: IconViewType;
}

const IconView: React.FunctionComponent<IconViewProps> = ({
    type,
}) => {
    switch (type) {
        case 'add-option-plus':
            return (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5.78711 4.13574H9.35547V5.67383H5.78711V9.7168H4.15234V5.67383H0.583984V4.13574H4.15234V0.400391H5.78711V4.13574Z" fill="#9EA7B3"/>
                </svg>
            );
        case 'black-x':
            return (
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <rect x="15.5547" width="2" height="22" rx="1" transform="rotate(45 15.5547 0)" fill="#202020"/>
                    <rect width="2" height="22" rx="1" transform="matrix(-0.707107 0.707107 0.707107 0.707107 1.41406 0)" fill="#202020"/>
                </svg>
            );
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
        case 'export-date-selected':
            return (
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25Z" fill="#29C09E"/>
                    <path d="M7.60938 13.5871L10.8702 16.8479L17.9355 9.78271" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'export-date-unselected':
            return (
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <circle cx="12.5" cy="12.5" r="12" stroke="white"/>
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
        case 'new-group-close':
            return (
                <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
                    <rect x="10.0859" width="1.29635" height="14.2599" rx="0.648177" transform="rotate(45 10.0859 0)" fill="#202020"/>
                    <rect width="1.29635" height="14.2599" rx="0.648177" transform="matrix(-0.707107 0.707107 0.707107 0.707107 0.916016 0)" fill="#202020"/>
                </svg>
            );
        case 'next-poll-arrow':
            return (
                <svg width="18" height="31" fill="none" viewBox="0 0 18 31">
                    <path fill="#fff" fillRule="evenodd" d="M1.374 30.703a1.012 1.012 0 0 0 1.432 0l14.25-14.25c.258-.258.348-.622.268-.953.08-.331-.01-.695-.268-.953L2.806.297a1.012 1.012 0 0 0-1.432 0L.297 1.374a1.012 1.012 0 0 0 0 1.432L12.99 15.5.297 28.194a1.012 1.012 0 0 0 0 1.432l1.077 1.077z" clipRule="evenodd"/>
                </svg>
            );
        case 'option-selected-check':
            return (
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <path opacity="0.5" d="M22 11.5C22 17.299 17.299 22 11.5 22C5.70101 22 1 17.299 1 11.5C1 5.70101 5.70101 1 11.5 1C17.299 1 22 5.70101 22 11.5Z" stroke="#9EA7B3" strokeWidth="2"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.5 23C17.8513 23 23 17.8513 23 11.5C23 5.14873 17.8513 0 11.5 0C5.14873 0 0 5.14873 0 11.5C0 17.8513 5.14873 23 11.5 23Z" fill="#29C09E"/>
                    <path d="M7 12.5L10 15.5L16.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'option-unselected-check':
            return (
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <path opacity="0.5" d="M22 11.5C22 17.299 17.299 22 11.5 22C5.70101 22 1 17.299 1 11.5C1 5.70101 5.70101 1 11.5 1C17.299 1 22 5.70101 22 11.5Z" stroke="#9EA7B3" strokeWidth="2"/>
                    <path opacity="0.5" d="M7 12.5L10 15.5L16.5 9" stroke="#9EA7B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        case 'right-arrow':
            return (
                <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                    <path d="M1.1543 14L7.6543 7.5L1.1543 1" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
