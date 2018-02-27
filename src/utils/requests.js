import axios from 'axios';
import { hostURL } from './constants';

const api = axios.create({
  baseURL: hostURL + '/api/v1'
});

const get = async (url, params) => {
  const res = await api.get(url, params);
  const data = res.data;
  if (data.success) return data.data;
  throw res.errors[0];
};

const post = async (url, body) => {
  const res = await api.post(url, body);
  const data = res.data;
  if (data.success) return data.data;
  throw res.errors[0];
};

export const generateNewCode = () => get('/generate/code/');

export const startPoll = (id, code, name) => {
  let body = {};
  if (id) body.id = id;
  if (code) body.code = code;
  if (name) body.name = name;
  return post('/start/poll/', body);
};

export const joinPoll = async (codes) => {
  const edges = await post('/polls/live/', { codes: codes });
  if (edges.length === 0) throw 'Invalid session code';

  const session = edges[0].node;
  session.userType = 'user';

  const response = await get(`/polls/${session.id}/ports/`);
  session.ports = response.ports;

  return session;
};
