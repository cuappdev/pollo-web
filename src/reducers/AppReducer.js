const LOAD = 'userState/LOAD';
const CLEAR = 'userState/CLEAR';

export type SessionState = {
  code: string,
  description: string,
  id: number,
  isLive: ?boolean,
  name: string
};

export type UserInfoState = {
  accessToken: string,
  email: ?string,
  familyName: ?string,
  givenName: ?string,
  id: string,
  isActive: boolean,
  name: string, 
  netId: string,
  refreshToken: string,
  sessionExpiration: number
};

export type UserState = {
  adminSessions: SessionState[],
  memberSessions: SessionState[],
  userInfo: UserInfoState
};

const initialState: UserState = {
  adminSessions: [],
  memberSessions: [],
  userInfo: null
};

export default function reducer(
  state: UserState = initialState,
  action: Object
) {
  switch (action.type) {
  	case LOAD:
  	  return { ...state, ...action.payload };
  	case CLEAR:
  	  return initialState;
  	default:
  	  return state;
  }
};

export function loadUser(payload: Object) {
  return { type: LOAD, payload }
};

export function clearUser() {
  return { type: CLEAR }
};