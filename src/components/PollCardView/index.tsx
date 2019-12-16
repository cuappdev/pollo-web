import cx from 'classnames';
import React from 'react';

import IconView from '../IconView';

import { Poll } from '../../types';

import './styles.scss';

export interface PollCardViewProps {
    onEditPoll(poll: Poll): void;
    poll: Poll;
}

const PollCardView: React.FunctionComponent<PollCardViewProps> = ({
    onEditPoll,
    poll,
}) => {

    const renderResponses = (responseCount: number, resultLetters: string[]) => {
        return resultLetters.map((resultLetter: string) => {
            const result = poll.results[resultLetter];
            const count = result.count ? result.count : 0;
            const isCorrectAnswer = poll.correctAnswer && poll.correctAnswer === resultLetter;
            return (
                <div 
                    className={cx(
                        'poll-card-view-response-container',
                        isCorrectAnswer && 'correct-answer',
                    )}
                >
                    <div className="poll-card-view-response-text">
                        {result.text}
                    </div>
                    <div className="poll-card-view-response-percentage">
                        {`${responseCount > 0 ? Math.floor(count / responseCount) : 0}%`}
                    </div>
                </div>
            );
        });
    };
    
    let responseCount = 0;
    const resultLetters = Object.keys(poll.results);
    resultLetters.forEach((resultLetter: string) => {
        const { count } = poll.results[resultLetter];
        responseCount += count ? count : 0;
    });

    return (
        <div className="poll-card-view-container">
            <div className="poll-card-view-header-container">
                <div className="poll-card-view-question-container">
                    <div className="poll-card-view-question-text">
                        {poll.text}
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
                    resultLetters.length >= 3 && 'scrollable',
                )}
            >
                {renderResponses(responseCount, resultLetters)}
            </div>
        </div>
    );
};

export default PollCardView;
