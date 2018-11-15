const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '';
const googleRedirectUri = process.env.REACT_APP_BACKEND_CALLBACK_URI || '';
const hostURL = process.env.REACT_APP_BACKEND_HOST_URL || '';

export {
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
  hostURL,
};
