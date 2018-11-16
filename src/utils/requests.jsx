import axios from 'axios';
import { hostURL } from './constants';

/*******************************
            General
*******************************/

const api = axios.create({
  baseURL: 'http://' + hostURL + '/api/v2',
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

const put = async (url, body) => {
  const res = await api.put(url, body);
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
            User
*******************************/

export const generateUserSession = async (response) => {
  const body = { idToken: response.tokenId };
  const data = await post('/auth/mobile/', body);
  console.log(data);
  localStorage.setItem('accessToken', data.accessToken);

  // Post-login, set auth header
  setAuthHeader(data.accessToken);
  return data;
};

export const setAuthHeader = (token) => {
  if (!token) {
    token = localStorage.getItem('accessToken');
  }
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getCurrentUser = async () => {
  const data = await get('/users/');
  return data;
};

/*******************************
            Roles
*******************************/

export const getMembers = async (sessionId) => {
  const data = await get(`/sessions/${sessionId}/members/`);
  return data;
};

export const getAdmins = async (sessionId) => {
  const data = await get(`/sessions/${sessionId}/admins/`);
  return data;
};

export const addMembers = async (sessionId, memberIds) => {
  const data = await post(`/sessions/${sessionId}/members/`, { memberIds : memberIds });
  return data;
};

export const removeMembers = async (sessionId, memberIds) => {
  const data = await put(`/sessions/${sessionId}/members/`, { memberIds : memberIds });
  return data;
};

export const addAdmins = async (sessionId, adminIds) => {
  const data = await post(`/sessions/${sessionId}/admins/`, { adminIds : adminIds });
  return data;
};

export const removeAdmins = async (sessionId, adminIds) => {
  const data = await put(`/sessions/${sessionId}/admins/`, { adminIds : adminIds });
  return data;
};

/*******************************
            Session
*******************************/

export const generateNewCode = async () => {
  const data = await get('/generate/code/');
  return data.code;
};

export const createNewSession = async (code) => {
  const data = await post('/sessions/', { name: null, code: code });
  return data.node;
};

export const getSession = async (code) => {
  const data = await get(`/sessions/${code}`);
  return data.node;
};

export const getAllSessions = async () => {
  const adminSessions = await get('/sessions/all/admin');
  const memberSessions = await get('/sessions/all/member');
  return {
    'adminSessions': adminSessions.map(session => session.node),
    'memberSessions': memberSessions.map(session => session.node),
  };
};

export const deleteSession = async (sessionId) => {
  const data = await del(`/sessions/${sessionId}`);
  return data;
};

export const leaveSession = async (sessionId) => {
  const data = await del(`/sessions/${sessionId}/members`);
  return data;
};

export const updateSession = async (sessionId, name, code) => {
  const data = await put(`/sessions/${sessionId}`, { id: sessionId, name: name, code: code });
  return data.node;
};

// TODO: Throw error if session code is invalid
export const joinSession = async (code) => {
  // const group= await get(`/groups/${code}`);
  const data = await post('/join/session/', { code: code });
  return data.node;
};

export const endSession = async (sessionId, shouldSave) => {
  const data = await post(`/session/${sessionId}/end/`, { save: shouldSave });
  return data;
};

/*******************************
             Polls
*******************************/

export const createPoll = async (sessionID, text, results, type, shared) => {
  const body = {
    text: text,
    results: results,
    type: type,
    shared: shared
  };

  const data = await post(`/sessions/${sessionID}/polls/`, body);
  return data;
};

export const getPoll = async (pollId) => {
  const data = await get(`/polls/${pollId}/`);
  return data;
};

export const getPollsForSession = async (sessionId) => {
  const data = await get(`/sessions/${sessionId}/polls/`);
  return data;
};

export const updatePoll = async (pollId, text, results, shared) => {
  const data = await put(`/polls/${pollId}/`);
  return data;
};

export const deletePoll = async (pollId) => {
  const data = await del(`/polls/${pollId}/`);
  return data;
};

/*******************************
            Drafts
*******************************/

export const getDrafts = async () => {
  const data = await get('/drafts/');
  return data.edges.map(edge => edge.node);
};

export const createDraft = async (text, options) => {
  const data = await post('/drafts/', { text: text, options: options });
  return data.node;
};

export const updateDraft = async (draftId, text, options) => {
  const data = await put(`/drafts/${draftId}`, { text: text, options: options });
  return data.node;
};

export const deleteDraft = async (draftId) => {
  const data = await del(`/drafts/${draftId}`);
  return data;
};
