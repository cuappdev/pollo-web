import cx from 'classnames';
import React from 'react';

import './styles.scss';

const LinksView: React.FunctionComponent = () => {
    return (
        <div className="links-view-links-container">
            <a 
                className="links-view-link" 
                href="https://apps.apple.com/us/app/pollo-polling-made-easy/id1355507891"
            >
                Download Pollo
            </a>
            <a 
                className="links-view-link"
                href="https://www.cornellappdev.com"
            >
                Cornell AppDev
            </a>
            <a 
                className="links-view-link" 
                href="https://forms.gle/HvT5srEt7ZXbdieaA"
            >
                Feedback
            </a>
            <a 
                className={cx('links-view-link', 'rightmost')}
                href="https://www.cornellappdev.com/privacy/policies/pollo/"
            >
                Privacy Policy
            </a>
        </div>
    );
};

export default LinksView;
