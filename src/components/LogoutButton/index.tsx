import React from 'react';
import { GoogleLogout } from 'react-google-login';

import { googleClientId } from '../../utils/constants';

import './styles.scss';

export interface LogoutButtonProps {
    isSSO: boolean;
    onClick(): void;
}

const LogoutButton: React.FunctionComponent<LogoutButtonProps> = ({
    isSSO,
    onClick,
}) => {
    if (isSSO) {
        console.log("using sso")
        return(
            <button className="logout-button" onClick={onClick}>
                Log Out
            </button>
        )
    } else {
        console.log(googleClientId)
        console.log("using google")
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
    }
};

export default LogoutButton;
