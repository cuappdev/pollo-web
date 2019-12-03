import React from 'react';

import LogoView from '../LogoView';
import {
    Poll,
    PollDate,
    Session,
} from '../../types';

export interface PollsViewProps {
    currentPoll?: Poll;
    onEndPoll(poll: Poll): void;
    onStartPoll(poll: Poll): void;
    session?: Session;
}

const PollsView: React.FunctionComponent<PollsViewProps> = ({
    currentPoll,
    onEndPoll,
    onStartPoll,
    session,
}) => {
    if (!session) {
        return (
            <div className="logo-container">
                <LogoView type="no-background" />
            </div>
        );
    }
    return (
        <div />
    );
};

export default PollsView;
