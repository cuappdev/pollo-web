import cx from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import CreateGroupView from '../CreateGroupView';
import LoginView from '../LoginView';
import PollsView from '../PollsView';
import SidebarView from '../SidebarView';

import { AppAction, AppState } from '../../reducer';
import {
    Poll,
    PollDate,
    Session,
} from '../../types';
import {
    condenseAdminSessions,
    currentUserExists,
    forgetCurrentUser,
    getCurrentUser,
    isSameDay,
    rememberCurrentUser,
} from '../../utils/functions';
import {
    createSession,
    generateCode,
    generateUserSession,
    setAuthHeader,
} from '../../utils/requests';
import {
    adminPollEnded,
    adminPollStart,
    adminPollUpdates,
    connectSocket,
    disconnectSocket,
    endPoll,
    shareResults,
} from '../../utils/sockets';

import './styles.scss';

export interface PollingAppState {
    isComposingGroup: boolean;
    isCreatingGroup: boolean;
    isLoading: boolean;
    showLoginError: boolean;
}

class PollingApp extends React.Component<any, PollingAppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isComposingGroup: false,
            isCreatingGroup: false,
            isLoading: currentUserExists(),
            showLoginError: false,
        };
    }

    public async componentDidMount() {
        if (currentUserExists()) {
            setAuthHeader(null);
            try {
                const adminSessions = await condenseAdminSessions();
                this.props.dispatch({ 
                    type: 'set-sessions', 
                    sidebarViewType: { type: 'group-list', sessions: adminSessions },
                    sessions: adminSessions,
                });
                this.props.dispatch({ type: 'set-user', user: getCurrentUser() });
                this.setState({ isLoading: false });
            } catch {
                this.setState({ isLoading: false, showLoginError: true });
            }
        }
    }

    public handleSocketConnectionError = () => {
        // Perhaps display a banner that asks user to check their internet connection
        // and maybe prompts them with a button that when clicked tries to reconnect to
        // the socket (talk to design).
    };

    public onComposeGroup = () => {
        this.setState({ isComposingGroup: true });
    };

    public onCreateGroupViewCreateButtonClick = async (name?: string) => {
        if (!name || name === '') {
            return;
        }
        this.setState({ isComposingGroup: false, isCreatingGroup: true });
        try {
            const { code } = await generateCode();
            const response = await createSession(code, name);
            console.log(response);
        } catch (error) {
            console.log(error);
            this.setState({ isComposingGroup: true, isCreatingGroup: false });
        }
    };

    public onCreatePoll = () => {

    };

    public onEditPoll = (poll: Poll) => {

    };

    public onEditPollDate = (pollDate: PollDate) => {

    };

    public onEditSession = (session: Session) => {

    };

    public onEndPoll = (poll: Poll) => {
        
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
                this.props.dispatch({ 
                    type: 'set-sessions', 
                    sidebarViewType: { type: 'group-list', sessions: adminSessions },
                    sessions: adminSessions,
                });
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

    public onPollButtonClick = (poll: Poll) => {
        if (poll.state === 'live') {
            endPoll();
            return;
        }
        try {
            shareResults(poll.id ? poll.id : '');
            this.updatePoll({ ...poll, state: 'shared' });
        } catch (error) {
            console.log(error);
            // Show some banner or alert here to notify that it didn't work
        }
    };

    public onSelectPoll = (currentPoll: Poll) => {
        this.props.dispatch({ type: 'set-current-poll', currentPoll });
    };

    public onSelectPollDate = (selectedPollDate: PollDate) => {
        this.props.dispatch({ type: 'set-selected-poll-date', selectedPollDate });
    };

    public onSelectSession = (selectedSession: Session) => {
        const accessToken = localStorage.getItem('accessToken');
        disconnectSocket();
        connectSocket(
            selectedSession.id, 
            accessToken ? accessToken : '',
            this.handleSocketConnectionError,
        );
        adminPollEnded(this.updatePoll);
        adminPollStart(this.updatePoll);
        adminPollUpdates(this.updatePoll);
        this.props.dispatch({ type: 'set-selected-session', selectedSession });
        this.setState({ isComposingGroup: false, isCreatingGroup: false });
    };

    public onSetCurrentPoll = (currentPoll: Poll) => {
        this.props.dispatch({ type: 'set-current-poll', currentPoll });
    };

    public onShareResults = (poll: Poll) => {
        try {
            shareResults(poll.id ? poll.id : '');
        } catch (error) {
            console.log(error);
        }
    };

    public onSidebarViewBackButtonClick = () => {
        const { dispatch, selectedSession, sessions, sidebarViewType } = this.props;
        dispatch({
            type: 'set-sidebar-view-type',
            sidebarViewType: {
                type: sidebarViewType.type === 'single-group' ? 'group-list' : 'single-group',
                ...(sidebarViewType.type === 'single-group' ? { sessions } : { session: selectedSession }),
            },
        });
    };

    public onStartPoll = (poll: Poll) => {

    };

    public shouldUpdateCurrentPoll = (updatedPoll: Poll, currentPoll?: Poll) => {
        if (!currentPoll) {
            return false;
        }
        return updatedPoll.state === 'shared' ? currentPoll.id === updatedPoll.id : currentPoll.state === 'live';
    };

    public shouldUpdateSelectedPollDate = (updatedPoll: Poll, selectedPollDate?: PollDate) => {
        if (!selectedPollDate) {
            return false;
        }
        if (!updatedPoll.createdAt) {
            return false;
        }
        return isSameDay(updatedPoll.createdAt, selectedPollDate.date);
    };

    public updatePoll = (poll: Poll) => {
        console.log(poll);
        const { currentPoll, dispatch, selectedPollDate, selectedSession } = this.props;
        console.log(selectedSession);
        const pollDateIndex = (selectedSession.dates as PollDate[]).findIndex((date: PollDate) => {
            return isSameDay(date.date, poll.createdAt ? poll.createdAt : '0');
        });
        if (pollDateIndex >= 0) {
            const polls: Poll[] = selectedSession.dates[pollDateIndex].polls;
            const pollIndex = polls.findIndex((otherPoll: Poll) => {
                if (poll.state === 'live' || poll.state === 'ended') {
                    return otherPoll.state === 'live';
                }
                return poll.id === otherPoll.id;
            });
            if (pollIndex >= 0) {
                selectedSession.dates[pollDateIndex].polls[pollIndex] = poll;
            } else {
                selectedSession.dates[pollDateIndex].polls.push(poll);
            }
            dispatch({
                type: 'set-selected-session',
                currentPoll: this.shouldUpdateCurrentPoll(poll, currentPoll) ? poll : currentPoll,
                fullUpdate: true,
                selectedPollDate: this.shouldUpdateSelectedPollDate(poll, selectedPollDate) ?
                    selectedSession.dates[pollDateIndex] : selectedPollDate,
                selectedSession,
            });
        } else {
            if (poll.state === 'ended') {
                // If the poll exists, then remove it from other poll date bc it will
                // become a new poll date with the unshift below. Don't want duplicates.
                const dateIndex = (selectedSession.dates as PollDate[]).findIndex((date: PollDate) => {
                    return date.polls.find((otherPoll: Poll) => {
                        return otherPoll.state === 'live';
                    }) !== undefined;
                });
                if (dateIndex >= 0) {
                    const polls = (selectedSession.dates as PollDate[])[dateIndex].polls;
                    const updatedPolls = polls.filter((otherPoll: Poll) => otherPoll.state !== 'live');
                    (selectedSession.dates as PollDate[])[dateIndex].polls = updatedPolls;
                }
            }
            selectedSession.dates.unshift({
                date: poll.createdAt ? poll.createdAt : '',
                polls: [poll],
            });
            dispatch({ 
                type: 'set-selected-session', 
                currentPoll,
                fullUpdate: true, 
                selectedPollDate,
                selectedSession,
            });
        }
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
        const { currentPoll, sidebarViewType, selectedPollDate, selectedSession } = this.props;
        if (!sidebarViewType) {
            return null;
        }
        const { isComposingGroup, isCreatingGroup } = this.state;
        return (
            <div className="polling-app-container">
                <div className="polling-app-sidebar-view-container">
                    <SidebarView
                        onBackButtonClick={this.onSidebarViewBackButtonClick}
                        onComposeGroup={this.onComposeGroup}
                        onCreatePoll={this.onCreatePoll}
                        onEditPollDate={this.onEditPollDate}
                        onEditSession={this.onEditSession}
                        onSelectPoll={this.onSelectPoll}
                        onSelectPollDate={this.onSelectPollDate}
                        onSelectSession={this.onSelectSession}
                        type={sidebarViewType}
                    />
                </div>
                <div
                    className={cx(
                        'polling-app-content-view-container',
                        (isComposingGroup || isCreatingGroup) && 'centered',
                    )}
                >
                    <>
                        {(isComposingGroup || isCreatingGroup) && (
                            <div className="polling-app-create-group-view-container">
                                <CreateGroupView
                                    isCreatingGroup={isCreatingGroup}
                                    onCreateButtonClick={this.onCreateGroupViewCreateButtonClick}
                                />
                            </div>
                        )}
                        {!isComposingGroup && !isCreatingGroup && (
                            <PollsView
                                currentPoll={currentPoll}
                                onEditPoll={this.onEditPoll}
                                onEndPoll={this.onEndPoll}
                                onPollButtonClick={this.onPollButtonClick}
                                onSetCurrentPoll={this.onSetCurrentPoll}
                                onShareResults={this.onShareResults}
                                onStartPoll={this.onStartPoll}
                                pollDate={selectedPollDate}
                                session={selectedSession}
                            />
                        )}
                    </>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PollingApp);
