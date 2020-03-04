import cx from 'classnames';
import React from 'react';

import './styles.scss';

export type GroupHeaderViewType =
    | { type: 'plain'; code: string; title: string }
    | { type: 'polls'; code: string; currentPollIndex: number; pollCount: number; title: string };

export interface GroupHeaderViewProps {
    type: GroupHeaderViewType;
}

const GroupHeaderView: React.FunctionComponent<GroupHeaderViewProps> = ({
    type,
}) => {
    return (
        <div className="group-header-view-container">
            <div className="group-header-view-title-text">
                {type.title}
            </div>
            <div
                className={cx(
                    'group-header-view-code-text',
                    type.type === 'plain' && 'plain',
                )}
            >
                Code: {type.code}
            </div>
            {type.type === 'polls' && (
                <div className="group-header-view-poll-index-label">
                    {`${type.currentPollIndex + 1}/${type.pollCount}`}
                </div>
            )}
        </div>
    );
};

export default GroupHeaderView;
