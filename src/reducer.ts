import { 
    Poll,
    PollDate,
    Session,
    User,
    UserSession, 
} from './types';

export interface AppState {
    currentPoll?: Poll;
    selectedPollDate?: PollDate;
    selectedPollDates: PollDate[];
    selectedSession?: Session;
    user?: User;
    userSession?: UserSession;
    sessions: Session[];
}

export type AppAction =
    | { type: 'reset' }
    | { type: 'select-date'; date: PollDate }
    | { type: 'set-current-poll'; currentPoll?: Poll }
    | { type: 'set-selected-poll-date'; selectedPollDate?: PollDate }
    | { type: 'set-selected-session'; currentPoll?: Poll; fullUpdate?: boolean; justCreatedSession?: boolean; selectedPollDate?: PollDate; selectedSession?: Session }
    | { type: 'set-sessions'; sessions: Session[] }
    | { type: 'set-user'; user: User }
    | { type: 'set-user-session'; userSession: UserSession }
    | { type: 'unselect-date'; date: PollDate };

export const initialState: AppState = {
    currentPoll: undefined,
    selectedPollDate: undefined,
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
            return { ...state, currentPoll: action.currentPoll };
        case 'set-selected-poll-date':
            const { selectedPollDate } = action;
            const firstPoll = 
                selectedPollDate && selectedPollDate.polls.length > 0 ?
                selectedPollDate.polls[0] : undefined;
            return {
                ...state,
                currentPoll: firstPoll,
                selectedPollDate,
            }
        case 'set-selected-session':
            const { selectedSession } = action;
            if (action.fullUpdate && selectedSession) {
                const sessionIndex = state.sessions.findIndex((session: Session) => {
                    return session.id === selectedSession.id;
                });
                state.sessions[sessionIndex] = selectedSession;
            }
            if (action.justCreatedSession && selectedSession) {
                state.sessions.unshift(selectedSession);
            }
            return { 
                ...state, 
                currentPoll: undefined,
                selectedSession,
                ...(action.fullUpdate && { 
                    currentPoll: action.currentPoll,
                    selectedPollDate: action.selectedPollDate,
                    sessions: state.sessions, 
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
