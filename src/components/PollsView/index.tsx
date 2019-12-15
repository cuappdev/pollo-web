import React from 'react';

import LogoView from '../LogoView';
import {
    Poll,
    PollDate,
} from '../../types';

export interface PollsViewProps {
    currentPoll?: Poll;
    onEndPoll(poll: Poll): void;
    onStartPoll(poll: Poll): void;
    pollDate?: PollDate;
}

const PollsView: React.FunctionComponent<PollsViewProps> = ({
    currentPoll,
    onEndPoll,
    onStartPoll,
    pollDate,
}) => {
    if (!pollDate) {
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
