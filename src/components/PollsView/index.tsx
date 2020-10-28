import cx from 'classnames';
import React, { useEffect, useState } from 'react';

import GroupHeaderView from '../GroupHeaderView';
import GroupSettingsView from '../GroupSettingsView';
import IconView from '../IconView';
import LinksView from '../LinksView';
import LogoutButton from '../LogoutButton';
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
    isStartingPoll: boolean;
    isSSO: boolean,
    onDeletePoll(poll: Poll): void;
    onEditPoll(poll: Poll): void;
    onLogoutButtonClick(): void;
    onPollButtonClick(poll: Poll): void;
    onSetCurrentPoll(pollIndex: number): void;
    pollDate?: PollDate;
    session?: Session;
}

export type PollsViewTransition = 'back' | 'forward';

const PollsView: React.FunctionComponent<PollsViewProps> = ({
    currentPoll,
    isStartingPoll,
    isSSO,
    onDeletePoll,
    onEditPoll,
    onLogoutButtonClick,
    onPollButtonClick,
    onSetCurrentPoll,
    pollDate,
    session,
}) => {
    const [transition, setTransition] = useState<PollsViewTransition | undefined>(undefined);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

    useEffect(() => {
        if (isDropdownVisible) {
            setIsDropdownVisible(false);
        }
    }, [currentPoll]);

    const onPollCardViewDropdownButtonClick = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const onPollCardViewPollButtonClick = (poll: Poll) => {
        setIsDropdownVisible(false);
        onPollButtonClick(poll);
    };

    const onTransitionEnd = (event: React.TransitionEvent) => {
        if (!pollDate || !currentPoll || event.propertyName !== 'right') {
            return;
        }
        setTransition(undefined);
        const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => poll.id === currentPoll.id);
        onSetCurrentPoll(transition === 'back' ? currentPollIndex - 1 : currentPollIndex + 1);
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
        setIsDropdownVisible(false);
        setTransition('forward');
    };

    const showPreviousPoll = () => {
        setIsDropdownVisible(false);
        setTransition('back');
    };

    if (!session) {
        return (
            <div 
                className={cx('polls-view-logo-container', 'spaced')}
            >
                <div className="polls-view-logout-button-container">
                    <LogoutButton onClick={onLogoutButtonClick} isSSO={isSSO}/>
                </div>
                <LogoView type="no-background" />
                <div className="polls-view-links-view-container">
                    <LinksView />
                </div>
            </div>
        );
    }

    if (!pollDate) {
        return (
            <GroupSettingsView
                isSSO={isSSO}
                onLogoutButtonClick={onLogoutButtonClick}
                session={session}
            />
        );
    }

    if (!currentPoll) {
        return (
            <div className="polls-view-logo-container">
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
            <GroupHeaderView
                isSSO={isSSO}
                type={{ 
                    type: 'polls', 
                    code: session.code, 
                    currentPollIndex,
                    pollCount: pollDate.polls.length,
                    title: `${session.name} - ${getDateString(pollDate.date)}`, 
                }}
            />
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
                            onDeletePoll={() => {}}
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
                            onDeletePoll={() => {}}
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
                        isDropdownVisible={isDropdownVisible}
                        isStartingPoll={isStartingPoll}
                        livePoll={livePoll}
                        poll={currentPoll}
                        onDeletePoll={() => onDeletePoll(currentPoll)}
                        onDropdownButtonClick={onPollCardViewDropdownButtonClick}
                        onEditPoll={() => onEditPoll(currentPoll)}
                        onPollButtonClick={onPollCardViewPollButtonClick}
                    />
                </div>
                {showLeftPoll && (
                    <button
                        className="previous-poll-button"
                        disabled={isStartingPoll}
                        onClick={showPreviousPoll}
                    >
                        <IconView type="previous-poll-arrow" />
                    </button>
                )}
                {showRightPoll && (
                    <button
                        className="next-poll-button"
                        disabled={isStartingPoll}
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
                            onDeletePoll={() => {}}
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
                            onDeletePoll={() => {}}
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
