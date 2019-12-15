import { SidebarViewType } from './components/SidebarView';
import { 
    Poll,
    PollDate,
    Session,
    User,
    UserSession, 
} from './types';

export interface AppState {
    currentPoll?: Poll;
    sidebarViewType?: SidebarViewType;
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
    | { type: 'set-groups-view-type'; sidebarViewType?: SidebarViewType }
    | { type: 'set-selected-poll-date'; selectedPollDate?: PollDate }
    | { type: 'set-selected-session'; selectedSession?: Session }
    | { type: 'set-sessions'; sidebarViewType?: SidebarViewType; sessions: Session[] }
    | { type: 'set-user'; user: User }
    | { type: 'set-user-session'; userSession: UserSession }
    | { type: 'unselect-date'; date: PollDate };

export const initialState: AppState = {
    currentPoll: undefined,
    sidebarViewType: undefined,
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
        case 'set-groups-view-type':
            return { ...state, sidebarViewType: action.sidebarViewType };
        case 'set-selected-poll-date':
            const { selectedPollDate } = action;
            const firstPoll = 
                selectedPollDate && selectedPollDate.polls.length > 0 ?
                selectedPollDate.polls[0] : undefined;
            return {
                ...state,
                currentPoll: firstPoll,
                sidebarViewType: { type: 'single-date', pollDate: selectedPollDate },
                selectedPollDate,
            }
        case 'set-selected-session':
            const { selectedSession } = action;
            return { 
                ...state, 
                sidebarViewType: { type: 'single-group', session: selectedSession },
                selectedSession,
            };
        case 'set-sessions':
            return { 
                ...state, 
                sidebarViewType: action.sidebarViewType,
                sessions: action.sessions, 
            };
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
