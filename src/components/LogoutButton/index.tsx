import React from 'react';
import { GoogleLogout } from 'react-google-login';

import { googleClientId } from '../../utils/constants';

import './styles.scss';

export interface LogoutButtonProps {
    onClick(): void;
}

const LogoutButton: React.FunctionComponent<LogoutButtonProps> = ({
    onClick,
}) => {
    return (
        <GoogleLogout
            className="logout-button"
            clientId={googleClientId}
            buttonText=""
            onLogoutSuccess={onClick}
            render={renderProps => {
                return (
                    <button
                        className="logout-button"
                        onClick={renderProps.onClick}
                    >
                        Log Out
                    </button>
                );
            }}
        />
    );
};

export default LogoutButton;
