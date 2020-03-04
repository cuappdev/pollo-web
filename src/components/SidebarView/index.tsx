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
    currentPoll?: Poll;
    onBackButtonClick(): void;
    onComposeGroup(): void;
    onComposePoll(): void;
    onEditPollDate(pollDate: PollDate);
    onEditSession(session: Session): void;
    onSelectPoll(poll: Poll): void;
    onSelectPollDate(pollDate: PollDate): void;
    onSelectSession(session: Session): void;
    type: SidebarViewType;
}

const SidebarView: React.FunctionComponent<SidebarViewProps> = ({
    currentPoll,
    onBackButtonClick,
    onComposeGroup,
    onComposePoll,
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
            const { letter, text } = answerChoice;
            return text === '' && letter ? letter : text;
        }
        const firstChoiceLetter = Object.keys(poll.answerChoices)[0];
        const text = poll.answerChoices[firstChoiceLetter].text;
        const letter = poll.answerChoices[firstChoiceLetter].letter;
        return text === '' && letter ? letter : text;
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

    const getEmptyStateDescription = () => {
        if (type.type === 'group-list') {
            return 'Tap "+" above to create a group!';
        }
        return 'Tap "+" above to create a poll!';
    }

    const getEmptyStateImage = () => {
        return type.type === 'group-list' ? 'blondeman.png' : 'blondelady.png';
    };

    const getEmptyStateMessage = () => {
        if (type.type === 'group-list') {
            return 'No groups created';
        }
        return 'No polls created';
    };

    const livePollExists = () => {
        if (type.type === 'single-group') {
            if (!type.session.dates) {
                return false;
            }
            const liveDate = type.session.dates.find((date: PollDate) => {
                const livePoll = date.polls.find((poll: Poll) => poll.state === 'live');
                return livePoll !== undefined;
            });
            return liveDate !== undefined;
        } else if (type.type === 'single-date') {
            const livePoll = type.pollDate.polls.find((poll: Poll) => poll.state === 'live');
            return livePoll !== undefined;
        }
        return false;
    };

    const renderEmptyState = () => {
        return (
            <div className="sidebar-view-empty-state-container">
                <div className="sidebar-view-empty-state-icon">
                    <img
                        src={require(`../../images/${getEmptyStateImage()}`)}
                        width="50px"
                        height="50px"
                    />
                </div>
                <div className="sidebar-view-empty-state-message">
                    {getEmptyStateMessage()}
                </div>
                <div className="sidebar-view-empty-state-description">
                    {getEmptyStateDescription()}
                </div>
            </div>
        );
    };

    const renderSidebarContent = () => {
        switch (type.type) {
            case 'group-list':
                if (type.sessions.length === 0) {
                    return renderEmptyState();
                }
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
                if (!dates || dates.length === 0) {
                    return renderEmptyState();
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
                if (type.pollDate.polls.length === 0) {
                    return renderEmptyState();
                }
                return type.pollDate.polls.map((poll: Poll) => {
                    return (
                        <div className="sidebar-cell-container">
                            <div className="sidebar-cell-text-container">
                                <button 
                                    className={cx(
                                        'sidebar-cell-title-text',
                                        currentPoll && currentPoll.id === poll.id && 'bold',
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
                {(type.type === 'group-list' || !livePollExists()) && (
                    <button 
                        className="sidebar-header-icon-button"
                        onClick={type.type === 'group-list' ? onComposeGroup : onComposePoll}
                    >
                        <IconView type="plus" />
                    </button>
                )}
            </div>
            <div className="sidebar-content-container">
                {renderSidebarContent()}
            </div>
        </div>
    );
};

export default SidebarView;
