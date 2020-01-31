import cx from 'classnames';
import React from 'react';

import IconView from '../IconView';

import { Poll, PollAnswerChoice } from '../../types';

import './styles.scss';

export interface PollCardViewProps {
    onEditPoll(poll: Poll): void;
    poll: Poll;
}

const PollCardView: React.FunctionComponent<PollCardViewProps> = ({
    onEditPoll,
    poll,
}) => {
    const renderResponses = (responseCount: number) => {
        return poll.answerChoices.map((answerChoice: PollAnswerChoice) => {
            const count = answerChoice.count ? answerChoice.count : 0;
            const isCorrectAnswer = poll.correctAnswer && poll.correctAnswer === answerChoice.letter;
            return (
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
                        {`${responseCount > 0 ? Math.floor(count / responseCount) * 100 : 0}%`}
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
                        </div>
                        <div className="poll-card-view-header-prompt-text">
                            Only you can see results
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
    );
};

export default PollCardView;
