import React from 'react';

import LinksView from '../LinksView';
import LoginCardView from '../LoginCardView';

import './styles.scss';

export interface LoginViewProps {
    isLoading: boolean;
    onLogin(response: any): void;
    showLoginError: boolean;
}

const LoginView: React.FunctionComponent<LoginViewProps> = ({
    isLoading,
    onLogin,
    showLoginError,
}) => {
    return (
        <div className="login-view-background">
            <div className="login-view-card-container">
                <LoginCardView
                    isLoading={isLoading}
                    onLogin={onLogin} 
                />
            </div>
            <LinksView />
            {showLoginError && <div />}
        </div>
    );
};

export default LoginView;
