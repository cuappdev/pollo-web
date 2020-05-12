import React from 'react';
import GoogleLogin from 'react-google-login';

import { googleClientId } from '../../utils/constants';
import LogoView from '../LogoView';

import './styles.scss';

export interface LoginCardViewProps {
    isLoading: boolean;
    onLogin(response: any): void;
}

const LoginCardView: React.FunctionComponent<LoginCardViewProps> = ({
    isLoading,
    onLogin,
}) => {
    console.log(googleClientId);
    return (
        <div className="card">
            <div className="logo-container">
                <LogoView type="large-background" />
            </div>
            <div className="header-text">Welcome to</div>
            <div className="name-text">Pollo</div>
            <div className="pronunciation-text">"Poh-loh"</div>
            <div className="border" />
            <div className="login-button-container">
                <GoogleLogin
                    buttonText="Sign In with Google"
                    className="login-button"
                    clientId={googleClientId}
                    disabled={isLoading}
                    onFailure={onLogin}
                    onSuccess={onLogin}
                />
            </div>
        </div>
    );
};

export default LoginCardView;
