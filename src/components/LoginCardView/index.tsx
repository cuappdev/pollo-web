import React from 'react';
import GoogleLogin from 'react-google-login';

import { googleClientId } from '../../utils/constants';
import LogoView from '../LogoView';

import './styles.scss';

export interface LoginCardViewProps {
    isLoading: boolean;
    onCornellLogin(): void;
    onLogin(response: any): void;
}

const LoginCardView: React.FunctionComponent<LoginCardViewProps> = ({
    isLoading,
    onCornellLogin,
    onLogin,
}) => {

    return (
        <div className="login-card-view-container">
            <div className="login-card-view-logo-container">
                <LogoView type="large-background" />
            </div>
            <div className="login-card-view-header-text">Welcome to</div>
            <div className="login-card-view-name-text">Pollo</div>
            <div className="login-card-view-pronunciation-text">"Poh-loh"</div>
            <div className="login-card-view-border" />
            <div className="login-card-view-login-button-container-section">
                <div className="login-card-view-login-button-container">
                    <img 
                        className="login-card-view-cornell-sso-button"
                        width="206px"
                        height="58px"
                        src={require('../../images/cornellsso.png')}
                        onClick={onCornellLogin}
                    />
                </div>
                <div className="login-card-view-login-button-container">
                    <GoogleLogin
                        buttonText="Sign In with Google"
                        className="login-card-view-login-button"
                        clientId={googleClientId}
                        disabled={isLoading}
                        onFailure={onLogin}
                        onSuccess={onLogin}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginCardView;
