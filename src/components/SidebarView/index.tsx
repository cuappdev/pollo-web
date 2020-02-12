import cx from 'classnames';
import React from 'react';

import IconView from '../IconView';
import {
    Poll,
    PollAnswerChoice,
    PollDate,
    Session,
} from '../../types';
import { getDateString } from '../../utils/functions';

import './styles.scss';

export type SidebarViewType =
    | { type: 'group-list'; sessions: Session[] }
    | { type: 'single-group'; session: Session }
    | { type: 'single-date'; pollDate: PollDate }

export interface SidebarViewProps {
    onBackButtonClick(): void;
    onCreateGroup(): void;
    onCreatePoll(): void;
    onEditPollDate(pollDate: PollDate);
    onEditSession(session: Session): void;
    onSelectPoll(poll: Poll): void;
    onSelectPollDate(pollDate: PollDate): void;
    onSelectSession(session: Session): void;
    type: SidebarViewType;
}

const SidebarView: React.FunctionComponent<SidebarViewProps> = ({
    onBackButtonClick,
    onCreateGroup,
    onCreatePoll,
    onEditPollDate,
    onEditSession,
    onSelectPoll,
    onSelectPollDate,
    onSelectSession,
    type,
}) => {
    const getDefaultAnswer = (poll: Poll) => {
        if (poll.correctAnswer) {
            const answerChoice = poll.answerChoices.find((answerChoice: PollAnswerChoice) => {
                return answerChoice.letter === poll.correctAnswer;
            }) as PollAnswerChoice;
            return answerChoice.text;
        }
        const firstChoiceLetter = Object.keys(poll.answerChoices)[0];
        return poll.answerChoices[firstChoiceLetter].text;
    };

    const getHeaderText = () => {
        switch (type.type) {
            case 'group-list':
                return 'Groups';
            case 'single-group':
                return type.session.name;
            case 'single-date':
                return getDateString(type.pollDate);
        }
    };

    const renderSidebarContent = () => {
        switch (type.type) {
            case 'group-list':
                return type.sessions.map((session: Session) => {
                    return (
                        <div className="sidebar-cell-container">
                            <div className="sidebar-cell-text-container">
                                <button 
                                    className={cx(
                                        'sidebar-cell-title-text',
                                        session.isLive && 'bold',
                                    )}
                                    onClick={() => onSelectSession(session)}
                                >
                                    {session.name}
                                </button>
                                {session.isLive ? (
                                    <div className="sidebar-cell-live-text-container">
                                        <div className="sidebar-cell-live-dot" />
                                        <div className="sidebar-cell-live-text">
                                            Live Now
                                        </div>
                                    </div>
                                ) : (
                                    <div className="sidebar-cell-subtitle-text">
                                        Last live
                                    </div>
                                )}
                            </div>
                            <button
                                className="sidebar-cell-icon-button"
                                onClick={() => onEditSession(session)}
                            >
                                <IconView type="ellipsis" />
                            </button>
                        </div>
                    );
                });
            case 'single-group':
                const { dates } = type.session;
                if (!dates) {
                    return null;
                }
                return dates.map((pollDate: PollDate) => {
                    const pollCount = pollDate.polls.length;
                    return (
                        <div className="sidebar-cell-container">
                            <div className="sidebar-cell-text-container">
                                <button 
                                    className="sidebar-cell-title-text"
                                    onClick={() => onSelectPollDate(pollDate)}
                                >
                                    {getDateString(pollDate)}
                                </button>
                                <div className="sidebar-cell-subtitle-text">
                                    {`${pollCount} ${pollCount === 1 ? 'Question' : 'Questions'}`}
                                </div>
                            </div>
                            <button
                                className="sidebar-cell-icon-button"
                                onClick={() => onEditPollDate(pollDate)}
                            >
                                <IconView type="ellipsis" />
                            </button>
                        </div>
                    );
                });
            case 'single-date':
                return type.pollDate.polls.map((poll: Poll) => {
                    return (
                        <div className="sidebar-cell-container">
                            <div className="sidebar-cell-text-container">
                                <button 
                                    className={cx(
                                        'sidebar-cell-title-text',
                                        poll.state === 'live' && 'bold',
                                    )}
                                    onClick={() => onSelectPoll(poll)}
                                >
                                    {poll.text === '' ? 'Untitled' : poll.text}
                                </button>
                                {poll.state === 'live' ? (
                                    <div className="sidebar-cell-live-text-container">
                                        <div className="sidebar-cell-live-dot" />
                                        <div className="sidebar-cell-live-text">
                                            Live Now
                                        </div>
                                    </div>
                                ) : (
                                    <div className="sidebar-cell-subtitle-text">
                                        {getDefaultAnswer(poll)}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                });
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header-container">
                <div className="sidebar-header-text-container">
                    {type.type !== 'group-list' && (
                        <button 
                            className="sidebar-header-arrow-button"
                            onClick={onBackButtonClick}
                        >
                            <IconView type="sidebar-back-arrow" />
                        </button>
                    )}
                    <div className="sidebar-header-text">
                        {getHeaderText()}
                    </div>
                </div>
                <button 
                    className="sidebar-header-icon-button"
                    onClick={type.type === 'group-list' ? onCreateGroup : onCreatePoll}
                >
                    <IconView type="plus" />
                </button>
            </div>
            <div className="sidebar-content-container">
                {renderSidebarContent()}
            </div>
        </div>
    );
};

export default SidebarView;
