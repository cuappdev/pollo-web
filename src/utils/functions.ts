import { PollDate } from '../types';

export const condenseDates = (pollDates: PollDate[]) => {
    let condensedDates: PollDate[] = [];
    pollDates.forEach((pollDate: PollDate) => {
        const condensedDateIndex = condensedDates.findIndex((condensedDate: PollDate) => {
            return isSameDay(condensedDate.date, pollDate.date);
        });
        if (condensedDateIndex >= 0) {
            condensedDates[condensedDateIndex].polls.push(...pollDate.polls);
        } else {
            condensedDates.unshift(pollDate);
        }
    });
    return condensedDates;
};

export const getDateString = (pollDate: PollDate) => {
    const date = new Date(parseFloat(pollDate.date) * 1000);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
};

export const isSameDay = (timestampOne: string, timestampTwo: string) => {
    const one = new Date(parseFloat(timestampOne) * 1000);
    const two = new Date(parseFloat(timestampTwo) * 1000);
    return one.getMonth() === two.getMonth() &&
        one.getDate() === two.getDate() &&
        one.getFullYear() === two.getFullYear();
};
