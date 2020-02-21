import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import IconView from '../IconView';

import { secondsBetween } from '../../utils/functions';
import { Poll, PollAnswerChoice } from '../../types';

import './styles.scss';

export interface PollCardViewProps {
    isCurrentPoll: boolean;
    livePoll?: Poll;
    onEditPoll(poll: Poll): void;
    onPollButtonClick(poll: Poll): void;
    poll: Poll;
}

const PollCardView: React.FunctionComponent<PollCardViewProps> = ({
    isCurrentPoll,
    livePoll,
    onEditPoll,
    onPollButtonClick,
    poll,
}) => {
    const timerId = useRef<number | undefined>(undefined);

    const getTimerText = (secondsElapsed: number) => {
        if (secondsElapsed < 10) {
            return `00:0${secondsElapsed}`;
        }
        if (secondsElapsed < 60) {
            return `00:${secondsElapsed}`;
        }
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed - minutes * 60;
        if (secondsElapsed < 600) {
            return `0${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getInitialTimerText = () => {
        if (!livePoll || !livePoll.createdAt) {
            return undefined;
        }
        const secondsElapsed = secondsBetween(
            new Date(parseFloat(livePoll.createdAt) * 1000), 
            new Date(),
        );
        return getTimerText(secondsElapsed);
    };

    const [timerText, setTimerText] = useState<string | undefined>(getInitialTimerText());

    const updateTimer = () => {
        if (!livePoll || !livePoll.createdAt || !isCurrentPoll) {
            return;
        }
        const secondsElapsed = secondsBetween(
            new Date(parseFloat(livePoll.createdAt) * 1000), 
            new Date(),
        );
        console.log(getTimerText(secondsElapsed));
        setTimerText(getTimerText(secondsElapsed));
    };

    useEffect(() => {
        if (!timerId.current) {
            timerId.current = window.setInterval(updateTimer, 1000);
        }
        const clearTimer = () => {
            if (timerId.current) {
                window.clearInterval(timerId.current);
                timerId.current = undefined;
            }
        };
        return clearTimer;
    }, [poll]);

    const renderResponses = (responseCount: number) => {
        const isShared = poll.state === 'shared';
        return poll.answerChoices.map((answerChoice: PollAnswerChoice) => {
            const count = answerChoice.count ? answerChoice.count : 0;
            const isCorrectAnswer = poll.correctAnswer && poll.correctAnswer === answerChoice.letter;
            const responsePercentage = responseCount > 0 ? Math.floor((count / responseCount) * 100) : 0;
            return isShared ? (
                <div className="poll-card-view-result-container">
                    <div
                        className={cx(
                            'poll-card-view-result-text-container',
                            isCorrectAnswer && 'correct-answer',
                        )}
                    >
                        {responsePercentage > 0 && (
                            <div
                                className={cx(
                                    'poll-card-view-result-bar',
                                    isCorrectAnswer && 'correct-answer',
                                )}
                                style={{
                                    right: `calc(${100 - responsePercentage}% - 1.5px)`,
                                }}
                            />
                        )}
                        <div className="poll-card-view-result-text">
                            {answerChoice.text}
                        </div>
                    </div>
                    <div className="poll-card-view-result-info">
                        <div className="poll-card-view-result-count">
                            {count}
                        </div>
                        <div className="poll-card-view-result-percentage">
                            {`(${responsePercentage}%)`}
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    className={cx(
                        'poll-card-view-response-container',
                        isCorrectAnswer && 'correct-answer',
                    )}
                >
                    <div className="poll-card-view-response-text">
                        {answerChoice.text}
                    </div>
                    <div className="poll-card-view-response-percentage">
                        {`${responsePercentage}%`}
                    </div>
                </div>
            );
        });
    };
    
    let responseCount = 0;
    poll.answerChoices.forEach((answerChoice: PollAnswerChoice) => {
        const { count } = answerChoice;
        responseCount += count ? count : 0;
    });

    return (
        <div className="poll-card-view-container">
            <div className="poll-card-view-card-container">
                <div className="poll-card-view-header-container">
                    <div className="poll-card-view-question-container">
                        <div className="poll-card-view-question-text">
                            {poll.text === '' ? 'Untitled' : poll.text}
                        </div>
                        <button
                            className="poll-card-view-edit-button"
                            onClick={() => onEditPoll(poll)}
                        >
                            <IconView type="ellipsis" />
                        </button>
                    </div>
                    <div className="poll-card-view-header-info-container">
                        <div className="poll-card-view-header-prompt-container">
                            <div className="poll-card-view-header-prompt-icon">
                                {/* <img 
                                    width="41.2px"
                                    height="41.2px"
                                    src={require('../../images/eye.png')} 
                                /> */}
                                <IconView type="eye" />
                            </div>
                            <div className="poll-card-view-header-prompt-text">
                                {poll.state === 'shared' ? 'Shared with group' : 'Only you can see results'}
                            </div>
                        </div>
                        <div className="poll-card-view-response-count-text">
                            {`${responseCount} ${responseCount === 1 ? 'Response' : 'Responses'}`}
                        </div>
                    </div>
                </div>
                <div className="poll-card-view-divider" />
                <div
                    className={cx(
                        'poll-card-view-responses-container',
                        poll.answerChoices.length >= 3 && 'scrollable',
                    )}
                >
                    {renderResponses(responseCount)}
                </div>
            </div>
            <div className="poll-card-view-button-container">
                {poll.state === 'shared' ? (
                    <div className="poll-card-view-poll-label">
                        Results Shared
                    </div>
                ) : (
                    <button 
                        className={cx('poll-card-view-poll-button', poll.state)}
                        onClick={() => onPollButtonClick(poll)}
                    >
                        {poll.state === 'live' ? 'End Question' : 'Share Results'}
                    </button>
                )}
                {poll.state === 'live' && timerText && (
                    <div className="poll-card-view-timer-label">
                        {timerText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PollCardView;
