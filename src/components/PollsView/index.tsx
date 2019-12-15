import React from 'react';

import LogoView from '../LogoView';
import {
    Poll,
    PollDate,
    Session,
} from '../../types';

import { getDateString } from '../../utils/functions';

import './styles.scss';

export interface PollsViewProps {
    currentPoll?: Poll;
    onEndPoll(poll: Poll): void;
    onStartPoll(poll: Poll): void;
    pollDate?: PollDate;
    session?: Session;
}

const PollsView: React.FunctionComponent<PollsViewProps> = ({
    currentPoll,
    onEndPoll,
    onStartPoll,
    pollDate,
    session,
}) => {
    const getPollIndexLabel = () => {
        if (!pollDate || !currentPoll) {
            return '';
        }
        const currentPollIndex = pollDate.polls.findIndex((poll: Poll) => {
            return poll.id === currentPoll.id;
        }) as number;
        return `${currentPollIndex + 1}/${pollDate.polls.length}`;
    };

    if (!currentPoll) {
        return (
            <div className="logo-container">
                <LogoView type="no-background" />
            </div>
        );
    }
    return (
        <div className="polls-view-container">
            <div className="polls-view-title">
                {session && session.name} - {pollDate && getDateString(pollDate)}
            </div>
            <div className="polls-view-code-text">
                Code: {session && session.code}
            </div>
            <div className="polls-view-poll-index-label">
                {getPollIndexLabel()}
            </div>
        </div>
    );
};

export default PollsView;
