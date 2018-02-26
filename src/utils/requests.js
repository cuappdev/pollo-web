import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOST_URL : process.env.REACT_APP_DEV_HOST_URL) + '/api/v1'
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
  const edges = await post('/polls/live', { codes: codes });
  if (edges.length === 0) throw 'Invalid session code';
  return edges[0].node;
};
