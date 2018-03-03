const hostURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_HOST_URL : process.env.REACT_APP_DEV_HOST_URL;

export {
  hostURL
};