import cx from 'classnames';
import React from 'react';
import { CSVLink } from 'react-csv';
import { GoogleLogout } from 'react-google-login';
import { connect } from 'react-redux';

import IconView from '../IconView';
import LinksView from '../LinksView';
import LoginView from '../LoginView';
import LogoView from '../LogoView';

import { AppAction, AppState } from '../../reducer';
import { ExportType, PollDate, Session } from '../../types';
import { googleClientId } from '../../utils/constants';
import { 
    condenseAdminSessions,
    currentUserExists,
    forgetCurrentUser,
    getCurrentUser,
    getDateString,
    rememberCurrentUser,
} from '../../utils/functions';
import { 
    exportCsv, 
    generateUserSession, 
    setAuthHeader, 
} from '../../utils/requests';

import './styles.scss';

export interface ExportAppState {
    csv?: string;
    isExporting: boolean;
    isLoading: boolean;
    selectedExportType: ExportType;
    showExportDropdown: boolean;
    showLoginError: boolean;
}

class ExportApp extends React.Component<any, ExportAppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            csv: undefined,
            isExporting: false,
            isLoading: currentUserExists(),
            selectedExportType: 'CMS',
            showExportDropdown: false,
            showLoginError: false,
        };
    }

    public async componentDidMount() {
        if (currentUserExists()) {
            setAuthHeader(null);
            try {
                const adminSessions = await condenseAdminSessions();
                this.props.dispatch({ type: 'set-sessions', sessions: adminSessions });
                this.props.dispatch({ type: 'set-user', user: getCurrentUser() });
                this.setState({ isLoading: false });
            } catch {
                this.setState({ isLoading: false, showLoginError: true });
            }
        }
    }

    public onExportButtonClicked = async () => {
        const { selectedPollDates, selectedSession } = this.props;
        const { isExporting, selectedExportType } = this.state;
        if (isExporting || !selectedSession || !selectedPollDates) {
            return;
        }
        this.setState({ isExporting: true });
        try {
            const dates = (selectedPollDates as PollDate[]).map((pollDate: PollDate) => {
                return new Date(parseFloat(pollDate.date) * 1000);
            });
            const { data } = await exportCsv(selectedSession.id, selectedExportType, dates);
            this.setState({ csv: data, isExporting: false });
        } catch (error) {
            this.setState({ isExporting: false });
            console.log(error);
        }
    };

    public isExportButtonDisabled = () => {
        return this.props.selectedPollDates.length === 0 || this.state.isExporting;
    };

    public onLogin = async (response: any) => {
        console.log(response);
        this.setState({ isLoading: true });
        if (response.error) {
            this.setState({ isLoading: false, showLoginError: true });
        } else {
            try {
                await generateUserSession(response.tokenId);
                const adminSessions = await condenseAdminSessions();
                this.props.dispatch({ type: 'set-sessions', sessions: adminSessions });
                const currentUser = getCurrentUser();
                rememberCurrentUser(currentUser);
                this.props.dispatch({ type: 'set-user', user: currentUser });
                this.setState({ isLoading: false });
            } catch (error) {
                console.log(error);
                forgetCurrentUser();
                this.setState({ isLoading: false, showLoginError: true });
            }
        }
    };

    public onLogOut = () => {
        forgetCurrentUser();
        this.props.dispatch({ type: 'reset' });
    };

    public onSelectExportDate = (pollDate: PollDate) => {
        const { dispatch, selectedPollDates } = this.props;
        if (selectedPollDates.includes(pollDate)) {
            dispatch({ type: 'unselect-date', date: pollDate });
        } else {
            dispatch({ type: 'select-date', date: pollDate });
        }
    };

    public onSelectExportType = (exportType: ExportType) => {
        this.setState({
            csv: undefined,
            selectedExportType: exportType,
            showExportDropdown: false,
        });
    };

    public onSelectSession = (selectedSession: Session) => {
        this.props.dispatch({ type: 'set-selected-session', selectedSession });
    };

    public renderExportOptions = () => {
        const { selectedPollDates, selectedSession } = this.props;
        if (!selectedSession.dates) {
            return null;
        }
        return selectedSession.dates.map((pollDate: PollDate) => {
            return (
                <button
                    className="export-app-select-date-button"
                    onClick={() => this.onSelectExportDate(pollDate)}
                >
                    <div className="export-app-date-text">
                        {getDateString(pollDate.date)}
                    </div>
                    <div className="export-app-date-icon-border">
                        {selectedPollDates.includes(pollDate) && (
                            <div className="export-app-selected-date-icon">
                                <IconView type="check" />
                            </div>
                        )}
                    </div>
                </button>
            );
        });
    };

    public renderGroups = (sessions: Session[]) => {
        return sessions.map((session: Session, index: number) => {
            return (
                <button
                    className={cx(
                        'export-app-group-button',
                        index !== sessions.length - 1 && 'bordered',
                    )}
                    onClick={() => this.onSelectSession(session)}
                >
                    <div className="export-app-group-name-text">
                        {session.name}
                    </div>
                    <div className="export-app-group-arrow-container">
                        <IconView type="export-group-arrow" />
                    </div>
                </button>
            );
        });
    };

    public toggleExportDropdown = () => {
        this.setState({ showExportDropdown: !this.state.showExportDropdown });
    };

    public unselectSelectedSession = () => {
        this.props.dispatch({ type: 'set-selected-session', selectedSession: undefined });
    };

    public render() {
        if (!this.props.user) {
            return (
                <LoginView
                    isLoading={this.state.isLoading}
                    onLogin={this.onLogin}
                    showLoginError={this.state.showLoginError}
                />
            );
        }
        const { selectedSession, sessions } = this.props;
        const { csv, selectedExportType, showExportDropdown } = this.state;
        return (
            <div className="export-app-background">
                <div className="export-app-corner-logo-container">
                    <LogoView type="small-background" />
                </div>
                <GoogleLogout
                    className="export-app-log-out-button"
                    clientId={googleClientId}
                    buttonText="Log Out"
                    onLogoutSuccess={this.onLogOut}
                />
                <div className="export-app-card-container">
                    <div className="export-app-card">
                        <div className="export-app-name-text">Pollo</div>
                        <div className="export-app-card-border" />
                        {selectedSession ? (
                            <>
                                <div className="export-app-group-name-header">
                                    <button 
                                        className="export-app-group-back-button"
                                        onClick={this.unselectSelectedSession}
                                    >
                                        <IconView type="export-group-back-arrow" />
                                    </button>
                                    <div className="export-app-group-name-header-text">
                                        {selectedSession.name}
                                    </div>
                                </div>
                                <div className="export-app-card-border" />
                                <div 
                                    className={cx(
                                        'export-app-options-container',
                                        selectedSession.dates && selectedSession.dates.length >= 3 && 'scrollable',
                                    )}
                                >
                                    {this.renderExportOptions()}
                                </div>
                                <div className="export-app-action-container">
                                    <div className="export-app-dropdown-button-label">
                                        Export for
                                    </div>
                                    <div className="export-app-dropdown-button-container">
                                        <button 
                                            className="export-app-dropdown-button"
                                            onClick={this.toggleExportDropdown}
                                        >
                                            <div className="export-app-export-type">
                                                {selectedExportType}
                                            </div>
                                            <div className="export-app-dropdown-arrow-icon">
                                                <IconView type="export-dropdown" />
                                            </div>
                                        </button>
                                    </div>
                                    {showExportDropdown && (
                                        <div className="export-app-dropdown-container">
                                            <button
                                                className="export-app-dropdown-item"
                                                onClick={() => this.onSelectExportType(
                                                    selectedExportType === 'CMS' ? 'Canvas' : 'CMS'
                                                )}
                                            >
                                                {selectedExportType === 'CMS' ? 'Canvas' : 'CMS'}
                                            </button>
                                        </div>
                                    )}
                                    {csv ? (
                                        <CSVLink
                                            className="export-app-export-button"
                                            data={csv}
                                            filename={`${selectedSession.name}.csv`}
                                            target="_blank"
                                        >
                                            <div className="export-app-export-button-text">
                                                Open CSV
                                            </div>
                                        </CSVLink>
                                    ) : (
                                        <button
                                            className="export-app-export-button"
                                            disabled={this.isExportButtonDisabled()}
                                            onClick={this.onExportButtonClicked}
                                        >
                                            <div className="export-app-export-button-text">
                                                Export CSV
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div
                                className={cx(
                                    'export-app-group-list-container',
                                    sessions.length >= 3 && 'scrollable',
                                )}
                            >
                                {this.renderGroups(sessions)}
                            </div>
                        )}
                    </div>
                </div>
                <LinksView />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => state;
const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch: (action: AppAction) => dispatch(action),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportApp);
