import io from 'socket.io-client';
import { hostURL } from './constants';

let socket;

export const connect = (sessionID, googleID, userType) => {
    socket = io(
        `${hostURL}/${sessionID}`,
        {
            query: {
                googleID,
                userType,
            },
        },
    );
};

export const disconnect = () => {
    socket.disconnect();
};

/** *****************************
            Server
****************************** */

export const startPoll = (poll) => {
    socket.emit('server/poll/start', poll);
};

export const endPoll = () => {
    socket.emit('server/poll/end');
};

export const shareResults = () => {
    socket.emit('server/poll/results');
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

export const adminPollEnded = (callback) => {
    socket.on('admin/poll/ended', poll => callback(poll));
};
