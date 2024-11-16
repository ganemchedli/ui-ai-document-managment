// Imports
import AppConfig from '../config/theme';

// Toast
import { showErrorToast } from './toasts-helpers';

// Navigation
import { goto } from '$app/navigation';

// Translation
import { t } from 'svelte-i18n';
import { get } from 'svelte/store';

// @ utility set the data for when user sign in
export const setDataForSignInUser = (accessToken, profileData) => {
	if (typeof window !== 'undefined') {
		// ** set user access token
		localStorage.setItem(AppConfig.accessTokenName, accessToken);

		// ** save user data
		localStorage.setItem(AppConfig.profileTokenName, profileData);
	}
};

// @ remove the user data when performing log out
export const emptyUserDataAfterLogOut = () => {
	if (typeof window !== 'undefined') {
		// ** set user access token
		localStorage.removeItem(AppConfig.accessTokenName);

		// ** save user data
		localStorage.removeItem(AppConfig.profileTokenName);
	}
};

// @ full log out
export const handleLogOut = () => {
	emptyUserDataAfterLogOut();
	goto(AppConfig.defaultSignInRoute);
};

// @ check if the user is authed
export const checkUserIsAuthenticated = () => {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem(AppConfig.accessTokenName);
		return token !== null;
	}
	return false;
};

// @ extract the access token from local storage
export const extractAccessToken = () => {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem(AppConfig.accessTokenName);
		return token;
	}
	return null;
};

// @ extract the access token from local storage
export const extractUserProfileData = () => {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem(AppConfig.profileTokenName);
		try {
			return JSON.parse(token);
		} catch (error) {
			return null;
		}
	}
	return null;
};

// @ the header will be used in each request
export const headerWithMainToken = () => {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem(AppConfig.accessTokenName);
		try {
			return {
				authorization: `Bearer ${token}`
			};
		} catch (error) {
			return null;
		}
	}
	return null;
};

// @ triggered when session expired
export const logOutWhenSessionExpires = () => {
	// empty user data
	emptyUserDataAfterLogOut();

	// display toast
	const sessionExpiredMessage = get(t)('sessionExpired');
	showErrorToast('Ops!', sessionExpiredMessage);

	// redictect to login screen
	goto(AppConfig.defaultSignInRoute);
};