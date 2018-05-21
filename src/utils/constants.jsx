const hostURL = process.env.REACT_APP_HOST_URL || '';
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '';
const googleRedirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI || '';

export {
  hostURL,
  googleClientId,
  googleClientSecret,
  googleRedirectUri
};
