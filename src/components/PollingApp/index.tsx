import cx from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import CreateGroupView from '../CreateGroupView';
import CreatePollView from '../CreatePollView';
import LoginView from '../LoginView';
import PollsView from '../PollsView';
import SidebarView from '../SidebarView';

import { AppAction, AppState } from '../../reducer';
import {
    Poll,
    PollAnswerChoice,
    PollDate,
    Session,
} from '../../types';
import {
    condenseAdminSessions,
    currentUserExists,
    forgetCurrentUser,
    getCurrentPoll,
    getCurrentUser as getCurrentLocalUser,
    getSelectedPollDate,
    isSameDay,
    rememberCurrentUser,
} from '../../utils/functions';
import {
    createSession,
    generateCode,
    generateUserSession,
    setAuthHeader,
    getCurrentUser as getCurrentUserRequest,
    logoutCurrentUser,
} from '../../utils/requests';
import {
    adminPollEnded,
    adminPollStart,
    adminPollUpdates,
    connectSocket,
    deletePoll,
    disconnectSocket,
    endPoll,
    shareResults,
    startPoll,
} from '../../utils/sockets';

import './styles.scss';
import { cornellSSOUrl } from '../../utils/constants';

export interface PollingAppState {
    isComposingGroup: boolean;
    isCreatingGroup: boolean;
    isComposingPoll: boolean;
    isStartingPoll: boolean;
    isLoading: boolean;
    shouldGetUser: boolean,
    shouldRedirect: boolean;
    showLoginError: boolean;
}

class PollingApp extends React.Component<any, PollingAppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isComposingGroup: false,
            isCreatingGroup: false,
            isComposingPoll: false,
            isStartingPoll: false,
            isLoading: currentUserExists(),
            shouldGetUser: true,
            shouldRedirect: false,
            showLoginError: false,
        };
    }

    public async componentDidMount() {
        if (currentUserExists()) {
            setAuthHeader(null);
            try {
                const adminSessions = await condenseAdminSessions();
                this.props.dispatch({ type: 'set-sessions', sessions: adminSessions });
                this.props.dispatch({ type: 'set-user', user: getCurrentLocalUser() });
                this.setState({ isLoading: false });
            } catch {
                this.setState({ isLoading: false, showLoginError: true });
            }
        }
    }

    public handleSocketConnectionError = (error?: any) => {
        // Perhaps display a banner that asks user to check their internet connection
        // and maybe prompts them with a button that when clicked tries to reconnect to
        // the socket (talk to design).
        console.log(error);
    };

    public getCurrentUser = async () => {
        if (!currentUserExists()) {
            try {
                const user = await getCurrentUserRequest();
                const currentUser = {
                    id: user.id,
                    name: user.name,
                    netId: user.netID,
                };
                rememberCurrentUser(currentUser);
                this.props.dispatch({ type: 'set-user', user: currentUser, shouldGetUser: true });
                const adminSessions = await condenseAdminSessions();
                this.props.dispatch({ type: 'set-sessions', sessions: adminSessions });
                this.setState({ isLoading: false });
            } catch (error) {
                console.log(error);
                forgetCurrentUser();
                this.setState({ isLoading: false, showLoginError: true, shouldGetUser: false });
            }
        }
    }

    public logOut = async () => {
        try {
            const response = await logoutCurrentUser();
            forgetCurrentUser();
            this.props.dispatch({ type: 'reset' });
        } catch(error) {
            console.log(error);
        }
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
            const session: Session = await createSession(code, name);
            this.onSelectSession(session);
        } catch (error) {
            console.log(error);
            this.setState({ isComposingGroup: true, isCreatingGroup: false });
        }
    };

    public onCreateGroupViewDismiss = () => {
        this.setState({ isComposingGroup: false, isCreatingGroup: false });
    };

    public onCreatePollViewDismiss = () => {
        this.setState({ isComposingPoll: false, isStartingPoll: false });
    };

    public onComposePoll = () => {
        this.setState({ isComposingPoll: true });
    };

    public onDeletePoll = (poll: Poll) => {
        const { currentPollIndex, dispatch, selectedPollDateIndex, selectedSession } = this.props;
        let session = selectedSession as Session;
        if (selectedPollDateIndex === undefined || !session || !session.dates) {
            return;
        }
        let currentPoll = undefined as number | undefined;
        const updatedPolls = session.dates[selectedPollDateIndex].polls.filter((otherPoll: Poll) => {
            if (poll.state === 'live') {
                return otherPoll.state !== 'live';
            }
            return otherPoll.id !== poll.id;
        });
        if (updatedPolls.length === 0) {
            session = {
                ...session,
                dates: session.dates.filter((_, index: number) => {
                    return index !== selectedPollDateIndex;
                }),
            };
        } else {
            currentPoll = currentPollIndex === updatedPolls.length ?
                currentPollIndex - 1 : currentPollIndex;
            session.dates[selectedPollDateIndex] = {
                ...session.dates[selectedPollDateIndex],
                polls: updatedPolls,
            };
        }
        deletePoll(poll);
        dispatch({
            type: 'set-selected-session',
            currentPollIndex: currentPoll,
            ...(updatedPolls.length === 0 && { selectedPollDateIndex }),
            selectedSession: session,
        });
        if (updatedPolls.length === 0) {
            dispatch({ type: 'set-selected-poll-date', selectedPollDateIndex: undefined });
        }
        this.forceUpdate();
    };

    public onEditPoll = (poll: Poll) => {
    
    };

    public onCornellLogin = () => {
        this.setState({ shouldRedirect: true });
    }

    public onPollButtonClick = (poll: Poll) => {
        if (poll.isDraft) {
            this.onStartPoll(poll.answerChoices, poll.correctAnswer, poll.text);
            return;
        }
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

    public onSelectPoll = (currentPollIndex: number) => {
        this.props.dispatch({ type: 'set-current-poll', currentPollIndex });
        if (this.state.isComposingPoll || this.state.isStartingPoll) {
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        }
    };

    public onSelectPollDate = (selectedPollDateIndex: number) => {
        this.props.dispatch({ type: 'set-selected-poll-date', selectedPollDateIndex });
        if (this.state.isComposingPoll || this.state.isStartingPoll) {
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        }
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
        this.props.dispatch({ 
            type: 'set-selected-session', 
            selectedSession, 
        });
        this.setState({ isComposingGroup: false, isCreatingGroup: false });
    };

    public onSetCurrentPoll = (currentPollIndex: number) => {
        this.props.dispatch({ type: 'set-current-poll', currentPollIndex });
        if (this.state.isComposingPoll || this.state.isStartingPoll) {
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        }
    };

    public onSidebarViewBackButtonClick = () => {
        const { dispatch, selectedPollDateIndex } = this.props;
        if (selectedPollDateIndex !== undefined) {
            dispatch({ type: 'set-selected-poll-date', selectedPollDateIndex: undefined });
        } else {
            dispatch({ type: 'set-selected-session', selectedSession: undefined });
        }
        if (this.state.isComposingPoll || this.state.isStartingPoll) {
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        }
    };

    public onStartPoll = async (answerChoices: PollAnswerChoice[], correctAnswer?: number, question?: string) => {
        this.setState({ isComposingPoll: false, isStartingPoll: true });
        try {
            startPoll({
                text: question ? question : '',
                answerChoices,
                state: 'live',
                correctAnswer: correctAnswer !== undefined ? correctAnswer : -1,
                userAnswers: {},
            });
            const createdAt = `${(new Date()).getTime() / 1000}`;
            const poll: Poll = {
                answerChoices,
                correctAnswer: correctAnswer !== undefined ? correctAnswer : -1,
                createdAt,
                state: 'live',
                text: question ? question : '',
                updatedAt: createdAt,
                userAnswers: {},
            };
            this.updatePoll(poll, true);
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        } catch (error) {
            console.log(error);
            this.setState({ isComposingPoll: true, isStartingPoll: false });
        }
    };

    public updatePoll = (poll: Poll, shouldFocusOnPoll?: boolean) => {
        const correctAnswer = poll.correctAnswer as any;
        if (correctAnswer !== undefined && correctAnswer === '') {
            poll.correctAnswer = undefined;
        }
        const { dispatch, selectedSession } = this.props;
        const session = selectedSession as Session;
        let pollDateIndex = -1;
        if (session.dates) {
            pollDateIndex = session.dates.findIndex((date: PollDate) => {
                return isSameDay(date.date, poll.createdAt ? poll.createdAt : '0');
            });
        }
        if (pollDateIndex >= 0 && session.dates) {
            let pollIndex = session.dates[pollDateIndex].polls.findIndex((otherPoll: Poll) => {
                if (poll.state === 'live' || poll.state === 'ended') {
                    return otherPoll.state === 'live';
                }
                return poll.id === otherPoll.id;
            });
            if (pollIndex >= 0) {
                session.dates[pollDateIndex].polls[pollIndex] = poll;
            } else {
                session.dates[pollDateIndex].polls.push(poll);
                pollIndex = session.dates[pollDateIndex].polls.length - 1;
            }
            dispatch({
                type: 'set-selected-session',
                ...(shouldFocusOnPoll && { 
                    currentPollIndex: pollIndex, 
                    selectedPollDateIndex: pollDateIndex, 
                }),
                selectedSession,
            });
        } else {
            let didEndPollCreatedOnDifferentDay = false;
            if (poll.state === 'ended') {
                // If the poll exists, then remove it from other poll date bc it will
                // become a new poll date with the unshift below. Don't want duplicates.
                let dateIndex = -1;
                if (session.dates) {
                    dateIndex = session.dates.findIndex((date: PollDate) => {
                        return date.polls.find((otherPoll: Poll) => {
                            return otherPoll.state === 'live';
                        }) !== undefined;
                    });
                    if (dateIndex >= 0) {
                        didEndPollCreatedOnDifferentDay = true;
                        const polls = session.dates[dateIndex].polls;
                        const updatedPolls = polls.filter((otherPoll: Poll) => otherPoll.state !== 'live');
                        session.dates[dateIndex].polls = updatedPolls;
                    }
                }
            }
            const date: PollDate = {
                date: poll.createdAt ? poll.createdAt : '',
                polls: [poll],
            };
            if (session.dates) {
                session.dates.unshift(date);
            } else {
                session.dates = [date];
            }
            dispatch({ 
                type: 'set-selected-session', 
                ...((didEndPollCreatedOnDifferentDay || shouldFocusOnPoll) && {
                    currentPollIndex: 0,
                    selectedPollDateIndex: 0,
                }),
                selectedSession,
            });
        }
        this.forceUpdate();
    };

    public render() {
        if (this.state.shouldGetUser) {
            this.getCurrentUser();
        }
        if (this.state.shouldRedirect) {
            this.setState({ shouldRedirect: false });
            window.location.href = cornellSSOUrl;
        }
        if (!this.props.user) {
            return (
                <LoginView
                    isLoading={this.state.isLoading}
                    onCornellLogin={this.onCornellLogin}
                    showLoginError={this.state.showLoginError}
                />
            );
        }
        const { currentPollIndex, selectedPollDateIndex, selectedSession, sessions } = this.props;
        const { isComposingGroup, isCreatingGroup, isComposingPoll, isStartingPoll } = this.state;
        const currentPoll = getCurrentPoll(currentPollIndex, selectedPollDateIndex, selectedSession);
        const selectedPollDate = getSelectedPollDate(selectedPollDateIndex, selectedSession);
        
        return (
            <div className="polling-app-container">
                <div className="polling-app-sidebar-view-container">
                    <SidebarView
                        onBackButtonClick={this.onSidebarViewBackButtonClick}
                        onComposeGroup={this.onComposeGroup}
                        onComposePoll={this.onComposePoll}
                        onSelectPoll={this.onSelectPoll}
                        onSelectPollDate={this.onSelectPollDate}
                        onSelectSession={this.onSelectSession}
                        pollDate={selectedPollDate}
                        session={selectedSession}
                        sessions={sessions}
                        showOverlay={isComposingGroup || isCreatingGroup || isComposingPoll || isStartingPoll}
                    />
                </div>
                <div
                    className={cx(
                        'polling-app-content-view-container',
                        (isComposingGroup || isCreatingGroup || isComposingPoll || isStartingPoll) && 'centered',
                    )}
                >
                    <>
                        {(isComposingGroup || isCreatingGroup) && (
                            <div className="polling-app-create-group-view-container">
                                <CreateGroupView
                                    isCreatingGroup={isCreatingGroup}
                                    onCreateButtonClick={this.onCreateGroupViewCreateButtonClick}
                                    onDismiss={this.onCreateGroupViewDismiss}
                                />
                            </div>
                        )}
                        {(isComposingPoll || isStartingPoll) && (
                            <div className="polling-app-create-poll-view-container">
                                <CreatePollView
                                    isStartingPoll={isStartingPoll}
                                    onDismiss={this.onCreatePollViewDismiss}
                                    onStartButtonClick={this.onStartPoll}
                                    session={selectedSession}
                                />
                            </div>
                        )}
                        {!isComposingGroup && !isCreatingGroup && !isComposingPoll && !isStartingPoll && (
                            <PollsView
                                currentPoll={currentPoll}
                                isStartingPoll={isStartingPoll}
                                onDeletePoll={this.onDeletePoll}
                                onEditPoll={this.onEditPoll}
                                onLogoutButtonClick={this.logOut}
                                onPollButtonClick={this.onPollButtonClick}
                                onSetCurrentPoll={this.onSetCurrentPoll}
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
