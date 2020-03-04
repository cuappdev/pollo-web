import io from 'socket.io-client';
import { hostUrl } from './constants';
import {
    Poll,
} from '../types';

let socket;

export const connectSocket = (
    sessionId: string, 
    accessToken: string, 
    handleConnectionError: (error?: any) => void,
) => {
    try {
        socket = io.connect(
            `${hostUrl}/${sessionId}`,
            {
                query: {
                    accessToken,
                },
                reconnection: true,
            },
        );
        socket.on('connect_error', handleConnectionError);
        socket.on('error', handleConnectionError);
        socket.on('reconnect_failed', handleConnectionError);
        socket.on('reconnect_error', handleConnectionError);
    } catch {
        handleConnectionError();
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

/** *****************************
            Server
****************************** */

export const startPoll = (poll: any) => {
    socket.emit('server/poll/start', poll);
};

export const endPoll = () => {
    socket.emit('server/poll/end');
};

export const shareResults = (pollId: string) => {
    socket.emit('server/poll/results', pollId);
};

export const sendAnswer = (answer) => {
    socket.emit('server/poll/tally', answer);
};

export const sendUpvote = (upvote) => {
    socket.emit('server/poll/upvote', upvote);
};

/** *****************************
            Student
****************************** */

export const pollStarted = (callback) => {
    socket.on('user/poll/start', poll => callback(poll));
};

export const pollEnded = (callback) => {
    socket.on('user/poll/end', poll => callback(poll));
};

export const resultsShared = (callback) => {
    socket.on('user/poll/results/', currentState => callback(currentState));
};

export const liveFR = (callback) => {
    socket.on('user/poll/results/live', currentState => callback(currentState));
};

export const userCount = (callback) => {
    socket.on('user/count', count => callback(count));
};

/** *****************************
            Admin
****************************** */

export const currentPoll = (callback) => {
    socket.on('admin/poll/start', poll => callback(poll));
};

export const updateTally = (callback) => {
    socket.on('admin/poll/updateTally', currentState => callback(currentState));
};

export const adminPollEnded = callback => {
    socket.on('admin/poll/ended', poll => callback(poll as Poll));
};

export const adminPollStart = callback => {
    socket.on('admin/poll/start', poll => callback(poll as Poll));
};

export const adminPollUpdates = callback => {
    socket.on('admin/poll/updates', poll => callback(poll as Poll))
};
