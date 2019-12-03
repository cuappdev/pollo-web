import React from 'react';

import {
    Poll,
    PollDate,
    Session,
} from '../../types';

export type GroupsViewType =
    | { type: 'group-list'; sessions: Session[] }
    | { type: 'single-group'; session: Session }
    | { type: 'single-date'; pollDate: PollDate }

export interface GroupsViewProps {
    onCreateGroup(): void;
    onCreatePoll(): void;
    onEditSession(session: Session): void;
    onSelectPoll(poll: Poll): void;
    onSelectSession(session: Session): void;
    type: GroupsViewType;
}

const GroupsView: React.FunctionComponent<GroupsViewProps> = ({
    onCreateGroup,
    onCreatePoll,
    onEditSession,
    onSelectPoll,
    onSelectSession,
    type,
}) => {
    return <div />;
};

export default GroupsView;
