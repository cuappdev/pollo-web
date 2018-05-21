import axios from 'axios';
import { hostURL } from './constants';
import { getDeviceId } from './functions';

/*******************************
            General
*******************************/

const api = axios.create({
  baseURL: hostURL + '/api/v2'
});

const get = async (url, params) => {
  const res = await api.get(url, params);
  const { success, data } = res.data;
  if (success) return data;
  throw Error(data.errors[0]);
};

const post = async (url, body) => {
  const res = await api.post(url, body);
  const { success, data } = res.data;
  if (success) return data;
  throw Error(data.errors[0]);
};

const del = async (url) => {
  const res = await api.delete(url);
  const { success, data } = res.data;
  if (success) return data;
  throw Error(data.errors[0]);
};

/*******************************
            Session
*******************************/

export const generateUserSession = async (user) => {
  const body = {
    userId: user.googleId,
    givenName: user.w3.ofa,
    familyName: user.w3.wea,
    email: user.w3.U3
  };
  const data = await post('/auth/mobile/', body);

  // Once user is logged in, set authorization header for all api calls
  api.defaults.headers.common['Authorization'] = data.accessToken;

  return data;
};

export const generateNewCode = async () => {
  const data = await get('/generate/code/');
  return data.code;
};

export const createNewSession = async (code) => {
  const data = await post('/sessions/', { name: 'Untitled', code: code });
  return data;
};

// Role: admin or member
export const getAllSessions = async (role) => {
  const data = await get(`/sessions/all/${role}`);
  return data;
};

export const deleteSession = async (sessionId) => {
  const data = await del(`/sessions/${sessionId}`);
  return data;
};

/*******************************
             Poll
*******************************/

export const joinPoll = async (codes) => {
  const edges = await post('/polls/live/', { codes: codes });
  if (edges.length === 0) throw Error('Invalid session code');

  const session = edges[0].node;
  session.userType = 'user';
  return session;
};

export const createPoll = async (name, code) => {
  const data = await post('/polls/', { name: name, code: code, deviceId: getDeviceId() });
  return data.node;
};

export const startPoll = async (poll) => {
  const data = await post('/start/poll/', poll);
  const session = data.node;
  session.userType = 'admin';
  return session;
};
