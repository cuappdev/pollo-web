import { PollDate } from '../types';

export const condenseDates = (pollDates: PollDate[]) => {
    let condensedDates: PollDate[] = [];
    pollDates.forEach((pollDate: PollDate) => {
        const condensedDateIndex = condensedDates.findIndex((condensedDate: PollDate) => {
            const condensed = parseFloat(condensedDate.date) * 1000;
            const date = parseFloat(pollDate.date) * 1000;
            return isSameDay(new Date(condensed), new Date(date));
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

export const isSameDay = (one: Date, two: Date) => {
    return one.getMonth() === two.getMonth() &&
        one.getDate() === two.getDate() &&
        one.getFullYear() === two.getFullYear();
};
