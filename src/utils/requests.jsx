import axios from 'axios';
import { hostURL } from './constants';
import { getDeviceId } from './functions';

const api = axios.create({
  baseURL: hostURL + '/api/v1'
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

export const generateNewCode = async () => {
  const data = await get('/generate/code/');
  return data.code;
};

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
