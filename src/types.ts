export interface Draft {
    id: number;
    options: string[];
    text: string;
}

export type ExportType = 'Canvas' | 'CMS';

export interface PollAnswerChoice {
    count?: number;
    index: number;
    text: string;
}

export interface PollChoice {
    letter?: string;
    text: string;
}

export interface PollDate {
    date: string;
    polls: Poll[];
}

export type PollState = 'ended' | 'live' | 'shared';

export interface Poll {
    answerChoices: PollAnswerChoice[];
    correctAnswer?: number;
    createdAt?: string;
    id?: string;
    isDraft?: boolean;
    state: PollState;
    text: string;
    updatedAt?: string;
    userAnswers: { [googleId: string]: number[] };
}

export interface Session {
    code: string;
    dates?: PollDate[];
    description?: string;
    id: string;
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
