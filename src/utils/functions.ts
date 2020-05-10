import { 
    getAdminSessions,
    getPollsForSession,
} from '../utils/requests';
import { Poll, PollDate, Session, User } from '../types';

export const condenseAdminSessions = async () => {
    const adminSessions = await getAdminSessions() as Session[];
    console.log(adminSessions);
    const pollDatesArray = await Promise.all(adminSessions.map((session: Session) => {
        return getPollsForSession(session.id);
    }));
    pollDatesArray.forEach((pollDates: any, sessionIndex: number) => {
        adminSessions[sessionIndex].dates = condenseDates(pollDates as PollDate[]);
    });
    adminSessions.sort((one: Session, two: Session) => {
        if (!one.updatedAt && !two.updatedAt) {
            return 0;
        }
        if (!one.updatedAt) {
            return 1;
        }
        if (!two.updatedAt) {
            return -1;
        }
        const updatedOne = new Date(parseFloat(one.updatedAt) * 1000);
        const updatedTwo = new Date(parseFloat(two.updatedAt) * 1000);
        return updatedOne.getTime() > updatedTwo.getTime() ? -1 : 1;
    });
    return adminSessions;
};

export const condenseDates = (pollDates: PollDate[]) => {
    let condensedDates: PollDate[] = [];
    pollDates.forEach((pollDate: PollDate) => {
        const condensedDateIndex = condensedDates.findIndex((condensedDate: PollDate) => {
            return isSameDay(condensedDate.date, pollDate.date);
        });
        pollDate.polls = pollDate.polls.filter((poll: Poll) => {
            const correctAnswer = poll.correctAnswer as any;
            if (correctAnswer !== undefined && correctAnswer === '') {
                return { ...poll, correctAnswer: -1 };
            }
            return poll;
        });
        if (condensedDateIndex >= 0) {
            condensedDates[condensedDateIndex].polls.push(...pollDate.polls);
        } else {
            condensedDates.unshift(pollDate);
        }
    });
    return condensedDates;
};

export const currentUserExists = () => {
    return localStorage.getItem('googleId') !== null;
};

export const forgetCurrentUser = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('familyName');
    localStorage.removeItem('givenName');
    localStorage.removeItem('googleId');
    localStorage.removeItem('name');
};

export const getCurrentUser = () => {
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
    return currentUser;
};

export const getCurrentPoll = (
    currentPollIndex?: number,
    selectedPollDateIndex?: number,
    selectedSession?: Session,
) => {
    const selectedPollDate = getSelectedPollDate(selectedPollDateIndex, selectedSession) as PollDate | undefined;
    return currentPollIndex !== undefined && selectedPollDate ? selectedPollDate.polls[currentPollIndex] : undefined;
};

export const getDateString = (timestamp: string, isShort?: boolean) => {
    const date = new Date(parseFloat(timestamp) * 1000);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return isShort ? `${month.slice(0, 3)} ${day}` : `${month} ${day}, ${year}`;
};

export const getSelectedPollDate = (
    selectedPollDateIndex?: number,
    selectedSession?: Session,
) => {
    if (!selectedSession || !selectedSession.dates) {
        return undefined;
    }
    return selectedPollDateIndex !== undefined ? selectedSession.dates[selectedPollDateIndex] : undefined;
};

export const isSameDay = (timestampOne: string, timestampTwo: string) => {
    const one = new Date(parseFloat(timestampOne) * 1000);
    const two = new Date(parseFloat(timestampTwo) * 1000);
    return one.getMonth() === two.getMonth() &&
        one.getDate() === two.getDate() &&
        one.getFullYear() === two.getFullYear();
};

export const rememberCurrentUser = (currentUser: User) => {
    localStorage.setItem('email', currentUser.email as string);
    localStorage.setItem('familyName', currentUser.familyName as string);
    localStorage.setItem('givenName', currentUser.givenName as string);
    localStorage.setItem('googleId', currentUser.id);
    localStorage.setItem('name', currentUser.name);
};

export const secondsBetween = (one: Date, two: Date) => {
    const difference = two.getTime() - one.getTime();
    return Math.floor(Math.abs(difference / 1000));
};
