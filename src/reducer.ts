import { 
    Poll,
    PollDate,
    Session,
    User,
    UserSession, 
} from './types';

export interface AppState {
    currentPollIndex?: number;
    selectedPollDateIndex?: number;
    selectedPollDates: PollDate[];
    selectedSession?: Session;
    user?: User;
    userSession?: UserSession;
    sessions: Session[];
}

export type AppAction =
    | { type: 'reset' }
    | { type: 'select-date'; date: PollDate }
    | { type: 'set-current-poll'; currentPollIndex?: number }
    | { type: 'set-selected-poll-date'; selectedPollDateIndex?: number }
    | { type: 'set-selected-session'; currentPollIndex?: number; selectedPollDateIndex?: number; selectedSession?: Session }
    | { type: 'set-sessions'; sessions: Session[] }
    | { type: 'set-user'; user: User }
    | { type: 'set-user-session'; userSession: UserSession }
    | { type: 'unselect-date'; date: PollDate };

export const initialState: AppState = {
    currentPollIndex: undefined,
    selectedPollDateIndex: undefined,
    selectedPollDates: [],
    selectedSession: undefined,
    user: undefined,
    userSession: undefined,
    sessions: [],
};

export default function reducer(state: AppState = initialState, action: AppAction) {
    switch (action.type) {
        case 'reset':
            return initialState;
        case 'select-date':
            return { 
                ...state, 
                selectedPollDates: [...state.selectedPollDates, action.date],
            };
        case 'set-current-poll':
            return { ...state, currentPollIndex: action.currentPollIndex };
        case 'set-selected-poll-date':
            if (!state.selectedSession || !state.selectedSession.dates) {
                return state;
            }
            const selectedPollDate = action.selectedPollDateIndex !== undefined ?
                state.selectedSession.dates[action.selectedPollDateIndex] : undefined;
            const firstPollIndex = selectedPollDate && selectedPollDate.polls.length > 0 ? 0 : undefined;
            return {
                ...state,
                currentPollIndex: firstPollIndex,
                selectedPollDateIndex: action.selectedPollDateIndex,
            }
        case 'set-selected-session':
            const { currentPollIndex, selectedPollDateIndex, selectedSession } = action;
            let shouldUpdateSessions = false;
            if (selectedSession) {
                const sessionIndex = state.sessions.findIndex((session: Session) => {
                    return session.id === selectedSession.id;
                });
                if (sessionIndex >= 0) {
                    state.sessions[sessionIndex] = selectedSession;
                } else {
                    state.sessions.unshift(selectedSession);
                }
                shouldUpdateSessions = true;
            }
            /* Set the indices to undefined in the case where shouldUpdateSessions
               is false below because in this case the user has unselected a session. */
            return { 
                ...state, 
                ...(currentPollIndex !== undefined && { currentPollIndex }),
                ...(selectedPollDateIndex !== undefined && { selectedPollDateIndex }),
                selectedSession,
                ...(shouldUpdateSessions ? { 
                    sessions: state.sessions 
                } : {
                    currentPollIndex: undefined,
                    selectedPollDateIndex: undefined,
                }),
            };
        case 'set-sessions':
            return { ...state, sessions: action.sessions };
        case 'set-user':
            return { ...state, user: action.user };
        case 'set-user-session':
            return { ...state, userSession: action.userSession };
        case 'unselect-date':
            const selectedPollDates = state.selectedPollDates.filter(pollDate => {
                return pollDate.date !== action.date.date;
            });
            return { ...state, selectedPollDates };
        default:
            return initialState;
    }
};
