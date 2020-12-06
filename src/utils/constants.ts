const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '';
const googleRedirectUri = process.env.REACT_APP_BACKEND_CALLBACK_URI || '';
const hostUrl = process.env.REACT_APP_BACKEND_HOST_URL || '';

const cornellSSOUrl = `${hostUrl}/api/v2/auth/saml/cornell`

export {
    cornellSSOUrl,
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
    hostUrl,
};
