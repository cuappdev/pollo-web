import axios from 'axios';
import { hostUrl } from './constants';
import { ExportType } from '../types';

/*******************************
            General
*******************************/

const api = axios.create({
  baseURL: 'http://' + hostUrl + '/api/v2',
});

const get = async (url: string, params?: any) => {
  const res = await api.get(url, params);
  const { success, data } = res.data;
  if (success) return data;
  throw Error(data);
};

const post = async (url: string, headers: any, body?: any) => {
  const res = await api.post(url, body, headers);
  const { success, data } = res.data;
  if (success) return data;
  throw Error(data.errors[0]);
};

const put = async (url: string, body?: any) => {
  const res = await api.put(url, body);
  const { success, data } = res.data;
  if (success) return data;
  throw Error(data.errors[0]);
};

const del = async (url: string) => {
  const res = await api.delete(url);
  const { success, data } = res.data;
  if (success) return data;
  throw Error(data.errors[0]);
};

/*******************************
            User
*******************************/

export const generateUserSession = async (idToken: string) => {
  const data = await post('/auth/mobile/', {
      headers: {
          Authorization: axios.defaults.headers.common['Authorization'],
      },
  }, { idToken });
  console.log(data);
  localStorage.setItem('accessToken', data.accessToken);

  // Post-login, set auth header
  setAuthHeader(data.accessToken);
  return data;
};

export const setAuthHeader = (token: string | null) => {
  const header = `Bearer ${token ? token : localStorage.getItem('accessToken')}`;
  console.log(header);
  axios.defaults.headers.common['Authorization'] = header;
};

export const getCurrentUser = async () => {
  const data = await get('/users/');
  return data;
};

/*******************************
            Roles
*******************************/

export const getMembers = async (sessionId: string) => {
  const data = await get(`/sessions/${sessionId}/members/`);
  return data;
};

export const getAdmins = async (sessionId: string) => {
  const data = await get(`/sessions/${sessionId}/admins/`);
  return data;
};

export const addMembers = async (sessionId: string, memberIds: string[]) => {
  const data = await post(`/sessions/${sessionId}/members/`, { memberIds });
  return data;
};

export const removeMembers = async (sessionId: string, memberIds: string[]) => {
  const data = await put(`/sessions/${sessionId}/members/`, { memberIds });
  return data;
};

export const addAdmins = async (sessionId: string, adminIds: string[]) => {
  const data = await post(`/sessions/${sessionId}/admins/`, { adminIds });
  return data;
};

export const removeAdmins = async (sessionId: string, adminIds: string[]) => {
  const data = await put(`/sessions/${sessionId}/admins/`, { adminIds });
  return data;
};

/*******************************
            Session
*******************************/

export const createSession = async (code: string, name: string) => {
    const data = await post('/start/session', {
        headers: {
            Authorization: axios.defaults.headers.common['Authorization'],
        },
    }, {
        code,
        isGroup: false,
        name,
    });
    return data;
};

export const createNewSession = async (code: string) => {
  const data = await post('/sessions/', { name: null, code: code });
  return data.node;
};

export const getSession = async (code: string) => {
  const data = await get(`/sessions/${code}`);
  return data.node;
};

export const getAllSessions = async () => {
  const adminSessions = await get('/sessions/all/admin');
  const memberSessions = await get('/sessions/all/member');
  return {
    'adminSessions': adminSessions.map((session: any) => session.node),
    'memberSessions': memberSessions.map((session: any) => session.node),
  };
};

export const generateCode = async () => {
    const data = await get('/generate/code', {
        headers: {
            Authorization: axios.defaults.headers.common['Authorization'],
        },
    });
    return data;
};

export const getAdminSessions = async () => {
    const data = await get('/sessions/all/admin', {
        headers: {
            Authorization: axios.defaults.headers.common['Authorization'],
        },
    });
    return data;
};

export const exportCsv = async (sessionId: string, type: ExportType, dates: any[]) => {
    const response = await api.get(`/sessions/${sessionId}/csv/`, {
        headers: {
            Authorization: axios.defaults.headers.common['Authorization'],
        },
        params: { 
            dates,
            format: type === 'Canvas' ? 'canvas' : 'cmsx', 
        },
    });
    if (!response.data.success) {
        return response;
    }
    throw Error(response.data.error);
};

export const deleteSession = async (sessionId: string) => {
  const data = await del(`/sessions/${sessionId}`);
  return data;
};

export const leaveSession = async (sessionId: string) => {
  const data = await del(`/sessions/${sessionId}/members`);
  return data;
};

export const updateSession = async (sessionId: string, name: string, code: string) => {
  const data = await put(`/sessions/${sessionId}`, { id: sessionId, name: name, code: code });
  return data.node;
};

// TODO: Throw error if session code is invalid
export const joinSession = async (code: string) => {
  // const group= await get(`/groups/${code}`);
  const data = await post('/join/session/', { code: code });
  return data.node;
};

export const endSession = async (sessionId: string, shouldSave: boolean) => {
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

export const getPollsForSession = async (sessionId: string) => {
    const data = await get(`/sessions/${sessionId}/polls`, {
        headers: {
            Authorization: axios.defaults.headers.common['Authorization'],
        },
    });
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
