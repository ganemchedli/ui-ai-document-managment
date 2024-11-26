// @utility: general app config
const AppConfig = {
	// @utility: App name (Displayed in header)
	appName: 'Ai Docs',

	// @utility: naming of the tokens that's stored
	accessTokenName: 'access_token',
	profileTokenName: 'auth_user',

	// @utility: for controlling the routing
	defaultHomeRoute: '/chat',
	defaultSignInRoute: '/sign-in',

	// @utility: static path for certain reusable assets
	appLogo: '',
	usFlagPath: '/assets/images/flags/20/us.svg',

	// @utlility: related to controlling the upload file
	acceptedFormats: ['.pdf', '.doc', '.docx', '.ppt', '.pptx'],
	maxFileSize: 50 * 1024 * 1024 // 50 MB in bytes
};
export default AppConfig;
