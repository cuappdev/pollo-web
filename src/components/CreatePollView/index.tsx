import cx from 'classnames';
import React, { useState } from 'react';

import GroupHeaderView from '../GroupHeaderView';
import IconView from '../IconView';

import { PollAnswerChoice, PollDate, Session } from '../../types';
import { getDateString } from '../../utils/functions';

import './styles.scss';

export interface CreatePollViewProps {
    isStartingPoll: boolean;
    onDismiss(): void;
    onStartButtonClick(answerChoices: PollAnswerChoice[], correctAnswer?: number, question?: string): void;
    pollDate?: PollDate;
    session?: Session;
}

export interface CreatePollViewState {
    answerChoices: PollAnswerChoice[];
    correctAnswer?: number;
    question?: string;
}

const CreatePollView: React.FunctionComponent<CreatePollViewProps> = ({
    isStartingPoll,
    onDismiss,
    onStartButtonClick,
    pollDate,
    session,
}) => {
    const [state, setState] = useState<CreatePollViewState>({
        answerChoices: [
            {
                count: 0,
                index: 0,
                text: '',
            },
            {
                count: 0,
                index: 1,
                text: '',
            },
        ],
        correctAnswer: undefined,
        question: undefined,
    });

    const isCorrectAnswer = (choiceIndex: number) => {
        const { correctAnswer } = state;
        return correctAnswer !== undefined && correctAnswer === choiceIndex;
    };

    const onAddOptionButtonClick = () => {
        const { answerChoices } = state;
        const lastChoice = answerChoices[answerChoices.length - 1];
        const newChoice: PollAnswerChoice = {
            count: 0,
            index: lastChoice.index + 1,
            text: '',
        };
        setState({
            ...state,
            answerChoices: [...answerChoices, newChoice],
        });
    };

    const onChoiceButtonClick = (choice: PollAnswerChoice) => {
        setState({
            ...state,
            correctAnswer: isCorrectAnswer(choice.index) ? undefined : choice.index,
        });
    };

    const onChoiceInputChange = (event: React.ChangeEvent<HTMLInputElement>, choice: PollAnswerChoice) => {
        const choiceText: string = event.target.value;
        const { answerChoices } = state;
        if (choice.index >= 0) {
            answerChoices[choice.index].text = choiceText;
            setState({ ...state, answerChoices });
        }
    };

    const onQuestionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const question: string = event.target.value;
        setState({ ...state, question: question === '' ? undefined : question });
    };

    const onStartPollButtonClick = () => {
        const { answerChoices } = state;
        for (let index = 0; index < answerChoices.length; index++) {
            const answerChoice = answerChoices[index];
            const letter = String.fromCharCode('A'.charCodeAt(0) + answerChoice.index);
            const { text } = answerChoice;
            answerChoices[index].text = text === '' ? letter : text;
        }
        onStartButtonClick(answerChoices, state.correctAnswer, state.question);
    };

    const renderChoices = () => {
        return state.answerChoices.map((choice: PollAnswerChoice, index: number) => {
            return (
                <div 
                    className={cx(
                        'create-poll-view-choice-container',
                        index === 25 && 'last',
                    )}
                >
                    <button
                        className="create-poll-view-choice-button"
                        onClick={() => onChoiceButtonClick(choice)}
                    >
                        <IconView 
                            type={isCorrectAnswer(index) ? 'option-selected-check' : 'option-unselected-check'}
                        />
                    </button>
                    <input
                        className="create-poll-view-choice-input"
                        onChange={event => onChoiceInputChange(event, choice)}
                        placeholder={`Option ${String.fromCharCode('A'.charCodeAt(0) + choice.index)}`}
                        type="text"
                        value={choice.text}
                    />
                </div>
            );
        });
    };

    return (
        <div className="create-poll-view-container">
            {session && (
                <GroupHeaderView 
                    type={{ 
                        type: 'plain', 
                        code: session.code, 
                        title: pollDate ? `${session.name} - ${getDateString(pollDate.date)}` : session.name,
                    }} 
                />
            )}
            <div className="create-poll-view-spacer">
                <div className="create-poll-view-card">
                    <div className="create-poll-view-card-header">
                        <button
                            className="create-poll-view-dismiss-button"
                            onClick={onDismiss}
                        >
                            <IconView type="black-x" />
                        </button>
                        <div className="create-poll-view-card-header-title">
                            Create Question
                        </div>
                        <div className="create-poll-view-card-header-space" />
                    </div>
                    <div className="create-poll-view-options-container">
                        <input
                            className="create-poll-view-question-input"
                            onChange={onQuestionInputChange}
                            placeholder="Ask a question..."
                            type="text"
                        />
                        <div className="create-poll-view-question-input-border" />
                        {renderChoices()}
                        {state.answerChoices.length < 26 && (
                            <button
                                className="create-poll-view-add-option-button"
                                onClick={onAddOptionButtonClick}
                            >
                                <div className="create-poll-view-add-option-button-icon">
                                    <IconView type="add-option-plus" />
                                </div>
                                <div className="create-poll-view-add-option-button-text">
                                    Add Option
                                </div>
                            </button>
                        )}
                    </div>
                </div>
                <button
                    className="create-poll-view-start-poll-button"
                    disabled={isStartingPoll}
                    onClick={onStartPollButtonClick}
                >
                    <div className="create-poll-view-start-poll-button-text">
                        {isStartingPoll ? 'Starting Poll...' : 'Start Poll'}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default CreatePollView;
