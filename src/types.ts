export interface Draft {
    id: number;
    options: string[];
    text: string;
}

export type ExportType = 'Canvas' | 'CMS';

export type QuestionType = 'multiple-choice' | 'free-response';

export interface PollChoice {
    letter?: string;
    text: string;
}

export interface PollFilter {
    success: boolean;
    text?: string;
    filter?: string[];
}

export interface PollResult {
    count?: number;
    letter?: string;
    text: string;
}

export interface PollDate {
    date: string;
    polls: Poll[];
}

export type PollState = 'ended' | 'live' | 'shared';

export interface Poll {
    answerChoices: PollResult[];
    correctAnswer?: string;
    createdAt?: string;
    id?: number;
    pollFilter?: PollFilter;
    state: PollState;
    text: string;
    type: QuestionType;
    updatedAt?: string;
    userAnswers: { [googleId: string]: PollChoice };
}

export interface Session {
    code: string;
    dates?: PollDate[];
    description?: string;
    id: string;
    isFilterActivated?: boolean;
    isLive?: boolean;
    name: string;
    updatedAt?: string;
}

export interface User {
    email?: string;
    familyName?: string;
    givenName?: string;
    id: string;
    name: string;
    netId: string;
}

export interface UserSession {
    accessToken: string;
    isActive: boolean;
    refreshToken: string;
    sessionExpiration: string;
}
