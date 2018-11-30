const LOAD = 'userState/LOAD';
const CLEAR = 'userState/CLEAR';

export type UserInfoState = {
  id: string,
  name: string, 
  netId: string,
  givenName: ?string,
  familyName: ?string,
  email: ?string,
  accessToken: string,
  refreshToken: string,
  sessionExpiration: number,
  isActive: boolean
}

export type SessionState = {
  id: number,
  name: string,
  code: string,
  description: string,
  isLive: ?boolean
}

export type UserState = {
  userInfo: UserInfoState,
  adminSessions: SessionState[],
  memberSessions: SessionState[]
}

const initialState: UserState = {
  userInfo: null,
  adminSessions: [],
  memberSessions: []
}

export default function reducer(
  state: UserState = initialState,
  action: Object
) {
  switch (action.type) {
  	case LOAD:
  	  return { ...state, ...action.payload }
  	case CLEAR:
  	  return initialState;
  	default:
  	  return state;
  }
}

export function loadUser(payload: Object) {
  return { type: LOAD, payload }
}

export function clearUser() {
  return { type: CLEAR }
}







