import React from 'react';

import IconView from '../IconView';
import {
    Poll,
    PollDate,
    Session,
} from '../../types';

import './styles.scss';

export type GroupsViewType =
    | { type: 'group-list'; sessions: Session[] }
    | { type: 'single-group'; session: Session }
    | { type: 'single-date'; pollDate: PollDate }

export interface GroupsViewProps {
    onCreateGroup(): void;
    onCreatePoll(): void;
    onEditSession(session: Session): void;
    onSelectPoll(poll: Poll): void;
    onSelectSession(session: Session): void;
    type: GroupsViewType;
}

const GroupsView: React.FunctionComponent<GroupsViewProps> = ({
    onCreateGroup,
    onCreatePoll,
    onEditSession,
    onSelectPoll,
    onSelectSession,
    type,
}) => {
    const getHeaderText = () => {
        switch (type.type) {
            case 'group-list':
                return 'Groups';
            case 'single-group':
                return type.session.name;
            case 'single-date':
                return type.pollDate.date;
        }
    };

    const renderGroupContent = () => {
        switch (type.type) {
            case 'group-list':
                return type.sessions.map((session: Session) => {
                    return (
                        <button 
                            className="session-cell"
                            onClick={() => onSelectSession(session)}
                        >
                            <div className="session-text-container">
                                <div className="session-name-text">
                                    {session.name}
                                </div>
                                {session.isLive ? (
                                    <div className="session-live-text-container">
                                        <div className="session-live-dot" />
                                        <div className="session-live-text">
                                            Live Now
                                        </div>
                                    </div>
                                ) : (
                                    <div className="session-last-live-text">
                                        Last live
                                    </div>
                                )}
                            </div>
                            <button
                                className="edit-session-icon-button"
                                onClick={() => onEditSession(session)}
                            >
                                <IconView type="ellipsis" />
                            </button>
                        </button>
                    );
                });
            case 'single-group':
                return <div />;
            case 'single-date':
                return <div />;
        }
    };

    return (
        <div className="sidebar">
            <div className="groups-header-container">
                <div className="groups-header-text">
                    {getHeaderText()}
                </div>
                <button 
                    className="groups-header-icon-button"
                    onClick={type.type === 'group-list' ? onCreateGroup : onCreatePoll}
                >
                    <IconView type="plus" />
                </button>
            </div>
            <div className="group-content-container">
                {renderGroupContent()}
            </div>
        </div>
    );
};

export default GroupsView;
