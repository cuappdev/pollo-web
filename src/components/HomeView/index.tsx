import cx from 'classnames';
import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { connect } from 'react-redux';

import GroupsView from '../GroupsView';
import IconView from '../IconView';
import PollsView from '../PollsView';
import LoginCardView from '../LoginCardView';
import LogoView from '../LogoView';
import {
    AppAction,
    AppState,
} from '../../reducer';
import { googleClientId } from '../../utils/constants';
import { 
    exportCsv,
    generateUserSession,
    getAdminSessions,
    getPollsForSession,
    setAuthHeader, 
} from '../../utils/requests';
import { 
    ExportType,
    Poll,
    PollDate, 
    Session, 
    User,
} from '../../types';

import './styles.scss';

export interface HomeViewState {
    isExporting: boolean;
    isLoading: boolean;
    selectedExportType: ExportType;
    showExportDropdown: boolean;
    showLoginError: boolean;
}

class HomeView extends React.Component<any, HomeViewState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isExporting: false,
            isLoading: this.currentUserExists(),
            selectedExportType: 'CMS',
            showExportDropdown: false,
            showLoginError: false,
        };
    }

    public async componentDidMount() {
        if (this.currentUserExists()) {
            setAuthHeader(null);
            try {
                const adminSessions = await getAdminSessions();
                console.log(adminSessions);
                const pollDatesArray = await Promise.all(adminSessions.map((session: Session) => {
                    return getPollsForSession(session.id);
                }));
                pollDatesArray.forEach((pollDates: any, sessionIndex: number) => {
                    adminSessions[sessionIndex].dates = pollDates as PollDate[];
                });
                console.log(adminSessions);
                this.props.dispatch({ 
                    type: 'set-sessions', 
                    groupsViewType: { type: 'group-list', sessions: adminSessions },
                    sessions: adminSessions,
                });
                const email = localStorage.getItem('email');
                const familyName = localStorage.getItem('familyName');
                const givenName = localStorage.getItem('givenName');
                const id = localStorage.getItem('googleId') as string;
                const name = localStorage.getItem('name') as string;
                const netId = email ? email.split('@')[0] : '';
                const currentUser: User = {
                    email: email ? email : undefined,
                    familyName: familyName ? familyName : undefined,
                    givenName: givenName ? givenName : undefined,
                    id,
                    name,
                    netId,
                };
                this.props.dispatch({ type: 'set-user', user: currentUser });
                this.setState({ isLoading: false });
            } catch {
                this.setState({ isLoading: false, showLoginError: true });
            }
        }
    }

    public onCreateGroup = () => {

    };

    public onCreatePoll = () => {

    };

    public onEditSession = (session: Session) => {

    };

    public currentUserExists = () => {
        return localStorage.getItem('googleId') !== null;
    };

    public forgetCurrentUser = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('familyName');
        localStorage.removeItem('givenName');
        localStorage.removeItem('googleId');
        localStorage.removeItem('name');
    };

    public rememberCurrentUser = (currentUser: User) => {
        localStorage.setItem('email', currentUser.email as string);
        localStorage.setItem('familyName', currentUser.familyName as string);
        localStorage.setItem('givenName', currentUser.givenName as string);
        localStorage.setItem('googleId', currentUser.id);
        localStorage.setItem('name', currentUser.name);
    };

    public onLogin = async (response: any) => {
        console.log(response);
        this.setState({ isLoading: true });
        if (response.error) {
            this.setState({ isLoading: false, showLoginError: true });
        } else {
            try {
                await generateUserSession(response.tokenId);
                const adminSessions = await getAdminSessions();
                console.log(adminSessions);
                const pollDatesArray = await Promise.all(adminSessions.map((session: Session) => {
                    return getPollsForSession(session.id);
                }));
                pollDatesArray.forEach((pollDates: any, sessionIndex: number) => {
                    adminSessions[sessionIndex].dates = pollDates as PollDate[];
                });
                this.props.dispatch({ 
                    type: 'set-sessions', 
                    groupsViewType: { type: 'group-list', sessions: adminSessions },
                    sessions: adminSessions,
                });
                const { email } = response.profileObj;
                const netId = email.split('@')[0];
                const currentUser: User = {
                    email,
                    familyName: response.profileObj.familyName,
                    givenName: response.profileObj.givenName,
                    id: response.profileObj.googleId,
                    name: response.profileObj.name,
                    netId,
                };
                this.rememberCurrentUser(currentUser);
                this.props.dispatch({ type: 'set-user', user: currentUser });
                this.setState({ isLoading: false });
            } catch (error) {
                console.log(error);
                this.forgetCurrentUser();
                this.setState({ isLoading: false, showLoginError: true });
            }
        }
    };

    public onSelectPoll = (poll: Poll) => {

    };

    public onSelectSession = (selectedSession: Session) => {
        this.props.dispatch({ type: 'set-selected-session', selectedSession });
    };

    public onEndPoll = (poll: Poll) => {
        
    };

    public onStartPoll = (poll: Poll) => {

    };

    public renderGroups = (sessions: Session[]) => {
        return sessions.map((session: Session, index: number) => {
            return (
                <button
                    className={cx(
                        'export-group-button',
                        index !== sessions.length - 1 && 'bordered',
                    )}
                    onClick={() => this.onSelectSession(session)}
                >
                    <div className="export-group-name-text">
                        {session.name}
                    </div>
                    <div className="export-group-arrow-container">
                        <IconView type="export-group-arrow" />
                    </div>
                </button>
            );
        });
    };

    public onSelectExportDate = (pollDate: PollDate) => {
        const { dispatch, selectedPollDates } = this.props;
        if (selectedPollDates.includes(pollDate)) {
            dispatch({ type: 'unselect-date', date: pollDate });
        } else {
            dispatch({ type: 'select-date', date: pollDate });
        }
    };

    public renderExportOptions = () => {
        const { selectedPollDates, selectedSession } = this.props;
        if (!selectedSession.dates) {
            return null;
        }
        return selectedSession.dates.map((pollDate: PollDate) => {
            const date = new Date(parseFloat(pollDate.date) * 1000);
            const month = date.toLocaleString('default', { month: 'long' });
            const day = date.getDate();
            const year = date.getFullYear();
            return (
                <button
                    className="select-export-date-button"
                    onClick={() => this.onSelectExportDate(pollDate)}
                >
                    <div className="export-date-text">
                        {`${month} ${day}, ${year}`}
                    </div>
                    <div className="export-date-icon-border">
                        {selectedPollDates.includes(pollDate) && (
                            <div className="selected-export-date-icon-container">
                                <IconView type="check" />
                            </div>
                        )}
                    </div>
                </button>
            );
        });
    };

    public onExportButtonClicked = async () => {
        const { selectedSession } = this.props;
        const { isExporting } = this.state;
        if (isExporting || !selectedSession) {
            return;
        }
        console.log(selectedSession);
        this.setState({ isExporting: true });
        try {
            const { data } = await exportCsv(selectedSession.id);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    public toggleExportDropdown = () => {
        this.setState({ showExportDropdown: !this.state.showExportDropdown });
    };

    public onSelectExportType = (exportType: ExportType) => {
        this.setState({
            selectedExportType: exportType,
            showExportDropdown: false,
        });
    };

    public onLogOut = () => {
        this.forgetCurrentUser();
        this.props.dispatch({ type: 'reset' });
    };

    public unselectSelectedSession = () => {
        this.props.dispatch({ 
            type: 'set-selected-session', 
            selectedSession: undefined,
        });
    };

    public renderExportApp = () => {
        // Clear access token anywhere??
        const { selectedSession, sessions } = this.props;
        const { isExporting, selectedExportType, showExportDropdown } = this.state;
        return (
            <div className="background">
                <div className="corner-logo-container">
                    <LogoView type="small-background" />
                </div>
                <GoogleLogout
                    className="export-log-out-button"
                    clientId={googleClientId}
                    buttonText="Log Out"
                    onLogoutSuccess={this.onLogOut}
                />
                <div className="card-container">
                    <div className="export-card">
                        <div className="name-header-text">Pollo</div>
                        <div className="card-border" />
                        {selectedSession ? (
                            <>
                                <div className="group-name-header-text-container">
                                    <button 
                                        className="group-back-arrow-button"
                                        onClick={this.unselectSelectedSession}
                                    >
                                        <IconView type="export-group-back-arrow" />
                                    </button>
                                    <div className="group-name-header-text">
                                        {selectedSession.name}
                                    </div>
                                </div>
                                <div className="card-border" />
                                <div 
                                    className={cx(
                                        'export-options-container',
                                        selectedSession.dates && selectedSession.dates.length >= 3 && 'scrollable',
                                    )}
                                >
                                    {this.renderExportOptions()}
                                </div>
                                <div className="export-action-container">
                                    <div className="export-dropdown-button-label">
                                        Export for
                                    </div>
                                    <div className="export-dropdown-button-container">
                                        <button 
                                            className="export-dropdown-button"
                                            onClick={this.toggleExportDropdown}
                                        >
                                            <div className="export-type-text">
                                                {selectedExportType}
                                            </div>
                                            <div className="dropdown-arrow-icon-container">
                                                <IconView type="export-dropdown" />
                                            </div>
                                        </button>
                                    </div>
                                    {showExportDropdown && (
                                        <div className="export-dropdown-container">
                                            <button
                                                className="export-dropdown-item"
                                                onClick={() => this.onSelectExportType(
                                                    selectedExportType === 'CMS' ? 'Canvas' : 'CMS'
                                                )}
                                            >
                                                {selectedExportType === 'CMS' ? 'Canvas' : 'CMS'}
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        className="export-button"
                                        disabled={isExporting}
                                        onClick={this.onExportButtonClicked}
                                    >
                                        <div className="export-button-text">
                                            Export CSV
                                        </div>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div
                                className={cx(
                                    'export-group-list-container',
                                    sessions.length >= 3 && 'scrollable',
                                )}
                            >
                                {this.renderGroups(sessions)}
                            </div>
                        )}
                    </div>
                </div>
                {this.renderLinks()}
            </div>
        );
    };

    public renderPollingApp = () => {
        const { currentPoll, groupsViewType, selectedSession } = this.props;
        if (!groupsViewType) {
            return null;
        }
        return (
            <div className="polling-app-container">
                <div className="groups-view-container">
                    <GroupsView
                        onCreateGroup={this.onCreateGroup}
                        onCreatePoll={this.onCreatePoll}
                        onEditSession={this.onEditSession}
                        onSelectPoll={this.onSelectPoll}
                        onSelectSession={this.onSelectSession}
                        type={groupsViewType}
                    />
                </div>
                <div className="polls-view-container">
                    <PollsView
                        currentPoll={currentPoll}
                        onEndPoll={this.onEndPoll}
                        onStartPoll={this.onStartPoll}
                        session={selectedSession}
                    />
                </div>
            </div>
        );
    };

    public renderLinks = () => {
        return (
            <div className="links-container">
                <a className="link" href="https://apps.apple.com/us/app/pollo-polling-made-easy/id1355507891">
                    Download Pollo
                </a>
                <a className="link" href="https://www.cornellappdev.com">
                    Cornell AppDev
                </a>
                <a className="link" href="mailto:cornellappdev@gmail.com">
                    Contact
                </a>
            </div>
        );
    };

    public render() {
        const { location, user } = this.props;
        const { isLoading, showLoginError } = this.state;
        if (!user) {
            return (
                <div className="background">
                    <div className="card-container">
                        <LoginCardView
                            isLoading={isLoading}
                            onLogin={this.onLogin} 
                        />
                    </div>
                    {this.renderLinks()}
                    {showLoginError && <div />}
                </div>
            );
        }
        return location.pathname === '/export' ? (
            this.renderExportApp()
        ) : (
            this.renderPollingApp()
        );
    }
}

const mapStateToProps = (state: AppState) => state;
const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch: (action: AppAction) => dispatch(action),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
