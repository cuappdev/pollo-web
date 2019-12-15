import { PollDate } from '../types';

export const getDateString = (pollDate: PollDate) => {
    const date = new Date(parseFloat(pollDate.date) * 1000);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
};
