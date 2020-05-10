import cx from 'classnames';
import React from 'react';

import IconView from '../IconView';
import {
    Poll,
    PollAnswerChoice,
    PollDate,
    Session,
} from '../../types';
import { getDateString, secondsBetween } from '../../utils/functions';

import './styles.scss';

export interface SidebarViewProps {
    currentPoll?: Poll;
    onBackButtonClick(): void;
    onComposeGroup(): void;
    onComposePoll(): void;
    onSelectPoll(pollIndex: number): void;
    onSelectPollDate(pollDateIndex: number): void;
    onSelectSession(session: Session): void;
    pollDate?: PollDate;
    session?: Session;
    sessions: Session[];
    showOverlay: boolean;
}

const SidebarView: React.FunctionComponent<SidebarViewProps> = ({
    currentPoll,
    onBackButtonClick,
    onComposeGroup,
    onComposePoll,
    onSelectPoll,
    onSelectPollDate,
    onSelectSession,
    pollDate,
    session,
    sessions,
    showOverlay,
}) => {
    const getDefaultAnswer = (poll: Poll) => {
        if (poll.correctAnswer !== undefined && poll.correctAnswer >= 0) {
            const answerChoice = poll.answerChoices.find((answerChoice: PollAnswerChoice, index: number) => {
                return index === poll.correctAnswer;
            }) as PollAnswerChoice;
            const { index, text } = answerChoice;
            const letter = String.fromCharCode('A'.charCodeAt(0) + index);
            return text === '' ? letter : text;
        }
        const firstChoiceLetter = Object.keys(poll.answerChoices)[0];
        const text = poll.answerChoices[firstChoiceLetter].text;
        return text === '' ? firstChoiceLetter : text;
    };

    const getHeaderText = () => {
        if (session && pollDate) {
            return getDateString(pollDate.date);
        }
        if (session) {
            return session.name;
        }
        return 'Groups';
    };

    const getEmptyStateDescription = () => {
        if (!session) {
            return 'Tap "+" above to create a group!';
        }
        return 'Tap "+" above to create a poll!';
    }

    const getEmptyStateImage = () => {
        return !session ? 'blondeman.png' : 'blondelady.png';
    };

    const getEmptyStateMessage = () => {
        if (!session) {
            return 'No groups created';
        }
        return 'No polls created';
    };

    const getGroupLivenessDescription = (session: Session) => {
        if (!session.updatedAt) {
            return null;
        }
        const secondsElapsed = secondsBetween(
            new Date(parseFloat(session.updatedAt) * 1000), 
            new Date(),
        );
        const oneMinuteSeconds = 60;
        const oneHourSeconds = 3600;
        const oneDaySeconds = 86400;
        const oneWeekSeconds = 604800;
        if (secondsElapsed < oneHourSeconds) {
            const minutes = Math.ceil(secondsElapsed / oneMinuteSeconds);
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        if (secondsElapsed < oneDaySeconds) {
            const hours = Math.floor(secondsElapsed / oneHourSeconds);
            return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ago`;
        }
        if (secondsElapsed < oneWeekSeconds) {
            const days = Math.floor(secondsElapsed / oneDaySeconds);
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        }
        return getDateString(session.updatedAt, true);
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
        if (!session) {
            if (sessions.length === 0) {
                return renderEmptyState();
            }
            return sessions.map((session: Session) => {
                return (
                    <button 
                        className="sidebar-view-cell-container"
                        onClick={() => onSelectSession(session)}
                    >
                        <div className="sidebar-view-cell-text-container">
                            <div 
                                className={cx(
                                    'sidebar-view-cell-title-text',
                                    session.isLive && 'bold',
                                )}
                            >
                                {session.name}
                            </div>
                            {session.isLive ? (
                                <div className="sidebar-view-cell-live-text-container">
                                    <div className="sidebar-view-cell-live-dot" />
                                    <div className="sidebar-view-cell-live-text">
                                        Live Now
                                    </div>
                                </div>
                            ) : (
                                <div className="sidebar-view-cell-subtitle-text">
                                    Last live {getGroupLivenessDescription(session)}
                                </div>
                            )}
                        </div>
                        <div className="sidebar-view-cell-icon">
                            <IconView type="right-arrow" />
                        </div>
                    </button>
                );
            });
        }
        if (!pollDate) {
            const { dates } = session;
            if (!dates || dates.length === 0) {
                return renderEmptyState();
            }
            return dates.map((pollDate: PollDate, pollDateIndex: number) => {
                const pollCount = pollDate.polls.length;
                if (pollCount === 0) {
                    return null;
                }
                return (
                    <button 
                        className="sidebar-view-cell-container"
                        onClick={() => onSelectPollDate(pollDateIndex)}
                    >
                        <div className="sidebar-view-cell-text-container">
                            <div className="sidebar-view-cell-title-text">
                                {getDateString(pollDate.date)}
                            </div>
                            <div className="sidebar-view-cell-subtitle-text">
                                {`${pollCount} ${pollCount === 1 ? 'Question' : 'Questions'}`}
                            </div>
                        </div>
                        <div className="sidebar-view-cell-icon">
                            <IconView type="right-arrow" />
                        </div>
                    </button>
                );
            });
        }
        if (pollDate.polls.length === 0) {
            return renderEmptyState();
        }
        return pollDate.polls.map((poll: Poll, pollIndex: number) => {
            return (
                <button 
                    className="sidebar-view-cell-container"
                    onClick={() => onSelectPoll(pollIndex)}
                >
                    <div className="sidebar-view-cell-text-container">
                        <div 
                            className={cx(
                                'sidebar-view-cell-title-text',
                                currentPoll && currentPoll.id === poll.id && 'bold',
                                poll.state === 'live' && 'bold',
                            )}
                        >
                            {poll.text === '' ? 'Untitled' : poll.text}
                        </div>
                        {poll.state === 'live' ? (
                            <div className="sidebar-view-cell-live-text-container">
                                <div className="sidebar-view-cell-live-dot" />
                                <div className="sidebar-view-cell-live-text">
                                    Live Now
                                </div>
                            </div>
                        ) : (
                            <div className="sidebar-view-cell-subtitle-text">
                                {getDefaultAnswer(poll)}
                            </div>
                        )}
                    </div>
                </button>
            );
        });
    };

    const shouldShowHeaderIconButton = () => {
        if (session) {
            if (!session.dates) {
                return true;
            }
            const liveDate = session.dates.find((date: PollDate) => {
                const livePoll = date.polls.find((poll: Poll) => poll.state === 'live');
                return livePoll !== undefined;
            });
            return liveDate === undefined;
        }
        return true;
    };

    return (
        <div className="sidebar-view-container">
            <div className="sidebar-view-header-container">
                <div className="sidebar-view-header-text-container">
                    {session && (
                        <button 
                            className="sidebar-view-header-arrow-button"
                            onClick={onBackButtonClick}
                        >
                            <IconView type="sidebar-back-arrow" />
                        </button>
                    )}
                    <div className="sidebar-view-header-text">
                        {getHeaderText()}
                    </div>
                </div>
                {shouldShowHeaderIconButton() && (
                    <button 
                        className="sidebar-view-header-icon-button"
                        onClick={session ? onComposePoll : onComposeGroup}
                    >
                        <IconView type="plus" />
                    </button>
                )}
            </div>
            <div className="sidebar-view-content-container">
                {renderSidebarContent()}
            </div>
            {showOverlay && <div className="sidebar-view-overlay" />}
        </div>
    );
};

export default SidebarView;
