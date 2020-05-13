import cx from 'classnames';
import React from 'react';
import { GoogleLogout } from 'react-google-login';

import { googleClientId } from '../../utils/constants';

import './styles.scss';

export type GroupHeaderViewType =
    | { type: 'group-settings'; code: string; title: string; onLogoutButtonClick(): void }
    | { type: 'plain'; code: string; title: string }
    | { type: 'polls'; code: string; currentPollIndex: number; pollCount: number; title: string };

export interface GroupHeaderViewProps {
    type: GroupHeaderViewType;
}

const GroupHeaderView: React.FunctionComponent<GroupHeaderViewProps> = ({
    type,
}) => {
    return (
        <div className="group-header-view-container">
            <div 
                className={cx(
                    'group-header-view-title-text',
                    type.type === 'group-settings' && 'group-settings',
                )}
            >
                {type.title}
            </div>
            <div
                className={cx(
                    'group-header-view-code-text',
                    type.type === 'plain' && 'plain',
                    type.type === 'group-settings' && 'group-settings',
                )}
            >
                Code: {type.code}
            </div>
            {type.type === 'polls' && (
                <div className="group-header-view-poll-index-label">
                    {`${type.currentPollIndex + 1}/${type.pollCount}`}
                </div>
            )}
            {type.type === 'group-settings' && (
                <>
                    <div className="group-header-view-attendance-label">
                        Attendance
                    </div>
                    <GoogleLogout
                        className="group-header-view-log-out-button"
                        clientId={googleClientId}
                        buttonText=""
                        onLogoutSuccess={type.onLogoutButtonClick}
                        render={renderProps => {
                            return (
                                <button 
                                    className="group-header-view-logout-button"
                                    disabled={renderProps.disabled}
                                    onClick={renderProps.onClick}
                                >
                                    Log Out
                                </button>
                            );
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default GroupHeaderView;
