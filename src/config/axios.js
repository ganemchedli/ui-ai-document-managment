import axios from 'axios';

const deploymentMode = {
	production: false
};
// -------------------------------------------------------------------------------
// ** BASE path end point
export const BASE_URL_PATH = deploymentMode?.production ? '' : 'http://localhost:8000';

// ** =>
export default axios.create({
	baseURL: `${BASE_URL_PATH}/api/v1`
});

// -------------------------------------------------------------------------------
// ** Oauth links
export const OAuthLinks = {
	googleLink: `${BASE_URL_PATH}/client/sign-in/google`,
	outlookLink: `${BASE_URL_PATH}/client/sign-in/outlook`
};
