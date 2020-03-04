import cx from 'classnames';
import React, { useState } from 'react';

import GroupHeaderView from '../GroupHeaderView';
import IconView from '../IconView';
import LogoView from '../LogoView';
import PollCardView from '../PollCardView';

import {
    Poll,
    PollDate,
    Session,
} from '../../types';
import { getDateString } from '../../utils/functions';

import './styles.scss';

export interface PollsViewProps {
    currentPoll?: Poll;
    onEditPoll(poll: Poll): void;
    onEndPoll(poll: Poll): void;
    onPollButtonClick(poll: Poll): void;
    onSetCurrentPoll(poll: Poll): void;
    onShareResults(poll: Poll): void;
    pollDate?: PollDate;
    session?: Session;
}

export type PollsViewTransition = 'back' | 'forward';

const PollsView: React.FunctionComponent<PollsViewProps> = ({
    currentPoll,
    onEditPoll,
    onEndPoll,
    onPollButtonClick,
    onSetCurrentPoll,
    onShareResults,
    pollDate,
    session,
}) => {
    const [transition, setTransition] = useState<PollsViewTransition | undefined>(undefined);

    const getPollIndexLabel = () => {
        if (!pollDate || !currentPoll) {
            return '';
        }
        const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => {
            return poll.id === currentPoll.id;
        }) as number;
        return `${currentPollIndex + 1}/${pollDate.polls.length}`;
    };

    const onTransitionEnd = (event: React.TransitionEvent) => {
        if (!pollDate || !currentPoll || event.propertyName !== 'right') {
            return;
        }
        setTransition(undefined);
        const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => poll.id === currentPoll.id);
        onSetCurrentPoll(pollDate.polls[
            transition === 'back' ? currentPollIndex - 1 : currentPollIndex + 1
        ]);
    };

    const shouldShowHiddenLeftPoll = () => {
        if (!pollDate || !currentPoll) {
            return false;
        }
        const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => poll.id === currentPoll.id);
        return currentPollIndex - 2 >= 0;
    };

    const shouldShowLeftPoll = () => {
        if (!pollDate || !currentPoll) {
            return false;
        }
        const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => poll.id === currentPoll.id);
        return currentPollIndex - 1 >= 0;
    };

    const shouldShowRightPoll = () => {
        if (!pollDate || !currentPoll) {
            return false;
        }
        const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => poll.id === currentPoll.id);
        return currentPollIndex + 1 <= pollDate.polls.length - 1;
    };

    const shouldShowHiddenRightPoll = () => {
        if (!pollDate || !currentPoll) {
            return false;
        }
        const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => poll.id === currentPoll.id);
        return currentPollIndex + 2 <= pollDate.polls.length - 1;
    };

    const showNextPoll = () => {
        setTransition('forward');
    };

    const showPreviousPoll = () => {
        setTransition('back');
    };

    if (!currentPoll || !pollDate) {
        return (
            <div className="logo-container">
                <LogoView type="no-background" />
            </div>
        );
    }
    
    const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => {
        return currentPoll.state === 'live' ? poll.state === 'live' : currentPoll.id === poll.id;
    });
    const showLeftPoll = shouldShowLeftPoll();
    const showRightPoll = shouldShowRightPoll();
    const livePoll = pollDate.polls.find((poll: Poll) => poll.state === 'live');

    return (
        <div className="polls-view-container">
            {session && (
                <GroupHeaderView
                    type={{ 
                        type: 'polls', 
                        code: session.code, 
                        currentPollIndex,
                        pollCount: pollDate.polls.length,
                        title: `${session.name} - ${getDateString(pollDate)}`, 
                    }}
                />
            )}
            <div className="polls-view-polls-container">
                {shouldShowHiddenLeftPoll() && (
                    <div
                        className={cx(
                            'hidden-left-card',
                            transition === 'back' && 'forward',
                            transition === 'forward' && 'back',
                        )}
                    >
                        <PollCardView
                            isCurrentPoll={false}
                            livePoll={livePoll}
                            poll={pollDate.polls[currentPollIndex - 2]}
                            onEditPoll={() => {}}
                            onPollButtonClick={() => {}}
                        />
                    </div>
                )}
                {showLeftPoll && (
                    <div
                        className={cx(
                            'left-card',
                            transition === 'back' && 'forward',
                            transition === 'forward' && 'back',
                        )}
                    >
                        <PollCardView
                            isCurrentPoll={false}
                            livePoll={livePoll}
                            poll={pollDate.polls[currentPollIndex - 1]}
                            onEditPoll={() => {}}
                            onPollButtonClick={() => {}}
                        />
                    </div>
                )}
                <div 
                    className={cx(
                        'middle-card',
                        transition === 'back' && 'forward',
                        transition === 'forward' && 'back',
                    )}
                    onTransitionEnd={onTransitionEnd}
                >
                    <PollCardView
                        isCurrentPoll={true}
                        livePoll={livePoll}
                        poll={currentPoll}
                        onEditPoll={() => onEditPoll(currentPoll)}
                        onPollButtonClick={onPollButtonClick}
                    />
                </div>
                {showLeftPoll && (
                    <button
                        className="previous-poll-button"
                        onClick={showPreviousPoll}
                    >
                        <IconView type="previous-poll-arrow" />
                    </button>
                )}
                {showRightPoll && (
                    <button
                        className="next-poll-button"
                        onClick={showNextPoll}
                    >
                        <IconView type="next-poll-arrow" />
                    </button>
                )}
                {showRightPoll && (
                    <div
                        className={cx(
                            'right-card',
                            transition === 'back' && 'forward',
                            transition === 'forward' && 'back',
                        )}
                    >
                        <PollCardView
                            isCurrentPoll={false}
                            livePoll={livePoll}
                            poll={pollDate.polls[currentPollIndex + 1]}
                            onEditPoll={() => {}}
                            onPollButtonClick={() => {}}
                        />
                    </div>
                )}
                {shouldShowHiddenRightPoll() && (
                    <div
                        className={cx(
                            'hidden-right-card',
                            transition === 'back' && 'forward',
                            transition === 'forward' && 'back',
                        )}
                    >
                        <PollCardView
                            isCurrentPoll={false}
                            livePoll={livePoll}
                            poll={pollDate.polls[currentPollIndex + 2]}
                            onEditPoll={() => {}}
                            onPollButtonClick={() => {}}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PollsView;
