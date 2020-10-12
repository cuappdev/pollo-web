import React from 'react';

import LinksView from '../LinksView';
import LoginCardView from '../LoginCardView';

import './styles.scss';

export interface LoginViewProps {
    isLoading: boolean;
    onCornellLogin(): void;
    onLogin(response: any): void;
    showLoginError: boolean;
}

const LoginView: React.FunctionComponent<LoginViewProps> = ({
    isLoading,
    onCornellLogin,
    onLogin,
    showLoginError,
}) => {
    return (
        <div className="login-view-background">
            <div className="login-view-card-container">
                <LoginCardView
                    isLoading={isLoading}
                    onCornellLogin={onCornellLogin}
                    onLogin={onLogin} 
                />
            </div>
            <div className="login-view-links-view-container">
                <LinksView />
            </div>
            {showLoginError && <div />}
        </div>
    );
};

export default LoginView;
