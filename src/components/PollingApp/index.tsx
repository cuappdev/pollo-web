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
    deletePoll,
    disconnectSocket,
    endPoll,
    shareResults,
    startPoll,
} from '../../utils/sockets';

import './styles.scss';

export interface PollingAppState {
    isComposingGroup: boolean;
    isCreatingGroup: boolean;
    isComposingPoll: boolean;
    isStartingPoll: boolean;
    isLoading: boolean;
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

    public handleSocketConnectionError = (error?: any) => {
        // Perhaps display a banner that asks user to check their internet connection
        // and maybe prompts them with a button that when clicked tries to reconnect to
        // the socket (talk to design).
        console.log(error);
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
            this.onSelectSession(session, true);
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
        const { dispatch, selectedPollDate, selectedSession } = this.props;
        if (!selectedPollDate || !selectedSession) {
            return;
        }
        let currentPoll = undefined as Poll | undefined;
        let pollDate = selectedPollDate as PollDate;
        let session = selectedSession as Session;
        const currentPollIndex = pollDate.polls.findIndex((otherPoll: Poll) => {
            if (poll.state === 'live') {
                return otherPoll.state === 'live';
            }
            return otherPoll.id === poll.id;
        });
        const updatedPolls = pollDate.polls.filter((otherPoll: Poll) => {
            if (poll.state === 'live') {
                return otherPoll.state !== 'live';
            }
            return otherPoll.id !== poll.id;
        });
        pollDate = {
            ...pollDate,
            polls: updatedPolls,
        };
        if (session.dates) {
            if (pollDate.polls.length === 0) {
                session = {
                    ...session,
                    dates: session.dates.filter((otherDate: PollDate) => {
                        return otherDate.date !== pollDate.date;
                    }),
                };
            } else {
                currentPoll = pollDate.polls[
                    currentPollIndex === updatedPolls.length ? 
                    currentPollIndex - 1 : currentPollIndex
                ];
                const dateIndex = session.dates.findIndex((otherDate: PollDate) => {
                    return otherDate.date === pollDate.date;
                });
                session.dates[dateIndex] = pollDate;
            }
        }
        deletePoll(poll);
        dispatch({
            type: 'set-selected-session',
            currentPoll,
            fullUpdate: true,
            selectedPollDate: pollDate.polls.length === 0 ? undefined : pollDate,
            selectedSession: session,
        });
    };

    public onEditPoll = (poll: Poll) => {
    
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

    public onSelectPoll = (currentPoll: Poll) => {
        this.props.dispatch({ type: 'set-current-poll', currentPoll });
        if (this.state.isComposingPoll || this.state.isStartingPoll) {
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        }
    };

    public onSelectPollDate = (selectedPollDate: PollDate) => {
        this.props.dispatch({ type: 'set-selected-poll-date', selectedPollDate });
        if (this.state.isComposingPoll || this.state.isStartingPoll) {
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        }
    };

    public onSelectSession = (selectedSession: Session, justCreatedSession?: boolean) => {
        const accessToken = localStorage.getItem('accessToken');
        disconnectSocket();
        console.log(selectedSession);
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
            justCreatedSession,
            selectedSession, 
        });
        this.setState({ isComposingGroup: false, isCreatingGroup: false });
    };

    public onSetCurrentPoll = (currentPoll: Poll) => {
        this.props.dispatch({ type: 'set-current-poll', currentPoll });
        if (this.state.isComposingPoll || this.state.isStartingPoll) {
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        }
    };

    public onShareResults = (poll: Poll) => {
        try {
            shareResults(poll.id ? poll.id : '');
        } catch (error) {
            console.log(error);
        }
    };

    public onSidebarViewBackButtonClick = () => {
        const { dispatch, selectedPollDate } = this.props;
        if (selectedPollDate) {
            dispatch({ type: 'set-selected-poll-date', selectedPollDate: undefined });
        } else {
            dispatch({ type: 'set-selected-session', selectedSession: undefined });
        }
        if (this.state.isComposingPoll || this.state.isStartingPoll) {
            this.setState({ isComposingPoll: false, isStartingPoll: false });
        }
    };

    public onStartPoll = async (answerChoices: PollAnswerChoice[], correctAnswer?: string, question?: string) => {
        this.setState({ isComposingPoll: false, isStartingPoll: true });
        try {
            startPoll({
                text: question ? question : '',
                answerChoices,
                state: 'live',
                correctAnswer: correctAnswer ? correctAnswer : '',
                userAnswers: {},
                type: 'multipleChoice',
            });
            const createdAt = `${(new Date()).getTime() / 1000}`;
            const poll: Poll = {
                answerChoices,
                correctAnswer,
                createdAt,
                state: 'live',
                text: question ? question : '',
                type: 'multiple-choice',
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

    public updatePoll = (poll: Poll, setCurrentPoll?: boolean) => {
        console.log(poll);
        const { currentPoll, dispatch, selectedPollDate, selectedSession } = this.props;
        console.log(selectedSession);
        let pollDateIndex = -1;
        if (selectedSession.dates) {
            pollDateIndex = (selectedSession.dates as PollDate[]).findIndex((date: PollDate) => {
                return isSameDay(date.date, poll.createdAt ? poll.createdAt : '0');
            });
        }
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
                currentPoll: this.shouldUpdateCurrentPoll(poll, currentPoll) || setCurrentPoll ? poll : currentPoll,
                fullUpdate: true,
                selectedPollDate: this.shouldUpdateSelectedPollDate(poll, selectedPollDate) ?
                    selectedSession.dates[pollDateIndex] : selectedPollDate,
                selectedSession,
            });
        } else {
            if (poll.state === 'ended') {
                // If the poll exists, then remove it from other poll date bc it will
                // become a new poll date with the unshift below. Don't want duplicates.
                let dateIndex = -1;
                if (selectedSession.dates) {
                    dateIndex = (selectedSession.dates as PollDate[]).findIndex((date: PollDate) => {
                        return date.polls.find((otherPoll: Poll) => {
                            return otherPoll.state === 'live';
                        }) !== undefined;
                    });
                }
                if (dateIndex >= 0) {
                    const polls = (selectedSession.dates as PollDate[])[dateIndex].polls;
                    const updatedPolls = polls.filter((otherPoll: Poll) => otherPoll.state !== 'live');
                    (selectedSession.dates as PollDate[])[dateIndex].polls = updatedPolls;
                }
            }
            const date: PollDate = {
                date: poll.createdAt ? poll.createdAt : '',
                polls: [poll],
            };
            if (selectedSession.dates) {
                selectedSession.dates.unshift(date);
            } else {
                selectedSession.dates = [date];
            }
            dispatch({ 
                type: 'set-selected-session', 
                currentPoll: setCurrentPoll ? poll : currentPoll,
                fullUpdate: true, 
                selectedPollDate,
                selectedSession,
            });
        }
        this.forceUpdate();
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
        const { currentPoll, selectedPollDate, selectedSession, sessions } = this.props;
        const { isComposingGroup, isCreatingGroup, isComposingPoll, isStartingPoll } = this.state;
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
                                onEndPoll={this.onEndPoll}
                                onPollButtonClick={this.onPollButtonClick}
                                onSetCurrentPoll={this.onSetCurrentPoll}
                                onShareResults={this.onShareResults}
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
