var openFB = (() => {
	var loginURL = 'https://www.facebook.com/dialog/oauth'
	var logoutURL = 'https://www.facebook.com/logout.php'

	// By default we store fbtoken in sessionStorage. This can be overridden in init()
	var tokenStore = window.sessionStorage

	// The Facebook App Id. Required. Set using init().
	var fbAppId

	var context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))

	var baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + context

	// Default OAuth redirect URL. Can be overriden in init()
	var oauthRedirectURL = baseURL + '/oauthcallback.html'

	// Default Cordova OAuth redirect URL. Can be overriden in init()
	var cordovaOAuthRedirectURL = 'https://www.facebook.com/connect/login_success.html'

	// Default Logout redirect URL. Can be overriden in init()
	var logoutRedirectURL = baseURL + '/logoutcallback.html'

	// Because the OAuth login spans multiple processes, we need to keep the login callback function as a variable
	// inside the module instead of keeping it local within the login function.
	var loginCallback

	// Indicates if the app is running inside Cordova
	var runningInCordova

	// Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
	var loginProcessed

	// MAKE SURE YOU INCLUDE <script src="cordova.js"></script> IN YOUR index.html, OTHERWISE runningInCordova will always by false.
	// You don't need to (and should not) add the actual cordova.js file to your file system: it will be added automatically
	// by the Cordova build process
	document.addEventListener('deviceready', () => { runningInCordova = true }, false)

	/**
	* Initialize the OpenFB module. You must use this function and initialize the module with an appId before you can
	* use any other function.
	* @param params - init paramters
	*  appId: (Required) The id of the Facebook app,
	*  tokenStore: (optional) The store used to save the Facebook token. If not provided, we use sessionStorage.
	*  loginURL: (optional) The OAuth login URL. Defaults to https://www.facebook.com/dialog/oauth.
	*  logoutURL: (optional) The logout URL. Defaults to https://www.facebook.com/logout.php.
	*  oauthRedirectURL: (optional) The OAuth redirect URL. Defaults to [baseURL]/oauthcallback.html.
	*  cordovaOAuthRedirectURL: (optional) The OAuth redirect URL. Defaults to https://www.facebook.com/connect/login_success.html.
	*  logoutRedirectURL: (optional) The logout redirect URL. Defaults to [baseURL]/logoutcallback.html.
	*  accessToken: (optional) An already authenticated access token.
	*/
	function init (params) {
		if (params.appId) fbAppId = params.appId
		else throw new Error('appId parameter not set in init()')

		if (params.tokenStore) tokenStore = params.tokenStore

		if (params.accessToken) tokenStore.fbAccessToken = params.accessToken

		loginURL = params.loginURL || loginURL
		logoutURL = params.logoutURL || logoutURL
		oauthRedirectURL = params.oauthRedirectURL || oauthRedirectURL
		cordovaOAuthRedirectURL = params.cordovaOAuthRedirectURL || cordovaOAuthRedirectURL
		logoutRedirectURL = params.logoutRedirectURL || logoutRedirectURL
	}

	/**
	* Checks if the user has logged in with openFB and currently has a session api token.
	* @param callback the function that receives the loginstatus
	*/
	function getLoginStatus (callback) {
		var token = tokenStore.fbAccessToken
		var loginStatus = {}

		if (token) {
			loginStatus.status = 'connected'
			loginStatus.authResponse = { accessToken: token }
		} else loginStatus.status = 'unknown'

		if (callback) callback(loginStatus)
	}

	/**
	* Login to Facebook using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
	* If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
	* plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
	*
	* @param callback - Callback function to invoke when the login process succeeds
	* @param options - options.scope: The set of Facebook permissions requested
	* @returns {*}
	*/
	function login (callback, options) {
		var loginWindow
		var startTime
		var scope = ''
		var redirectURL = runningInCordova ? cordovaOAuthRedirectURL : oauthRedirectURL

		if (!fbAppId) return callback({status: 'unknown', error: 'Facebook App Id not set.'})

		// Inappbrowser load start handler: Used when running in Cordova only
		function loginWindowLoadStartHandler (event) {
			var url = event.url
			if (url.indexOf('access_token=') > 0 || url.indexOf('error=') > 0) {
				// When we get the access token fast, the login window (inappbrowser) is still opening with animation
				// in the Cordova app, and trying to close it while it's animating generates an exception. Wait a little...
				var timeout = 600 - (new Date().getTime() - startTime)
				setTimeout(() => loginWindow.close(), timeout > 0 ? timeout : 0)
				oauthCallback(url)
			}
		}

		function loginWindowLoadStopHandler () {
			console.log('stop listeners')
		}

		// Inappbrowser exit handler: Used when running in Cordova only
		function loginWindowExitHandler () {
			console.log('exit and remove listeners')
			// Handle the situation where the user closes the login window manually before completing the login process
			if (loginCallback && !loginProcessed) loginCallback({status: 'user_cancelled'})
			loginWindow.removeEventListener('loadstop', loginWindowLoadStopHandler)
			loginWindow.removeEventListener('exit', loginWindowExitHandler)
			loginWindow = null
			console.log('done removing listeners')
		}

		if (options && options.scope) scope = options.scope

		loginCallback = callback
		loginProcessed = false

		startTime = new Date().getTime()
		loginWindow = window.open(loginURL + '?client_id=' + fbAppId + '&redirect_uri=' + redirectURL +
		'&response_type=token&scope=' + scope, '_blank', 'location=no,clearcache=yes')

		// If the app is running in Cordova, listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
		if (runningInCordova) {
			loginWindow.addEventListener('loadstart', loginWindowLoadStartHandler)
			loginWindow.addEventListener('exit', loginWindowExitHandler)
		}
		// Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
		// oauthCallback() function. See oauthcallback.html for details.
	}

	/**
	* Called either by oauthcallback.html (when the app is running the browser) or by the loginWindow loadstart event
	* handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
	* @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
	* OAuth workflow.
	*/
	function oauthCallback (url) {
		// Parse the OAuth data received from Facebook
		var queryString
		var options

		loginProcessed = true
		if (url.indexOf('access_token=') > 0) {
			queryString = url.substr(url.indexOf('#') + 1)
			options = parseQueryString(queryString)
			tokenStore.fbAccessToken = options['access_token']
			if (loginCallback) loginCallback({status: 'connected', authResponse: {accessToken: options['access_token']}})
		} else if (url.indexOf('error=') > 0) {
			queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'))
			options = parseQueryString(queryString)
			if (loginCallback) loginCallback({status: 'not_authorized', error: options.error})
		} else {
			if (loginCallback) loginCallback({status: 'not_authorized'})
		}
	}

	/**
	* Logout from Facebook, and remove the token.
	* IMPORTANT: For the Facebook logout to work, the logoutRedirectURL must be on the domain specified in "Site URL" in your Facebook App Settings
	*
	*/
	function logout (callback) {
		var logoutWindow
		var token = tokenStore.fbAccessToken

		/* Remove token. Will fail silently if does not exist */
		tokenStore.removeItem('fbtoken')

		if (token) {
			logoutWindow = window.open(logoutURL + '?access_token=' + token + '&next=' + logoutRedirectURL, '_blank', 'location=no,clearcache=yes')
			if (runningInCordova) setTimeout(() => logoutWindow.close(), 700)
		}

		if (callback) callback()
	}

	/**
	* Lets you make any Facebook Graph API request.
	* @param options - Request configuration object. Can include:
	*  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
	*  path:    path in the Facebook graph: /me, /me.friends, etc. - Required
	*  params:  queryString parameters as a map - Optional
	*  success: callback function when operation succeeds - Optional
	*  error:   callback function when operation fails - Optional
	*/
	function api (options) {
		var method = options.method || 'GET'
		var params = options.params || {}
		var xhr = new window.XMLHttpRequest()
		var url

		params['access_token'] = tokenStore.fbAccessToken

		url = 'https://graph.facebook.com' + options.path + '?' + toQueryString(params)

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					if (options.success) options.success(JSON.parse(xhr.responseText))
				} else {
					var error = xhr.responseText ? JSON.parse(xhr.responseText).error : { message: 'An error has occurred' }
					if (options.error) options.error(error)
				}
			}
		}

		xhr.open(method, url, true)
		xhr.send()
	}

	/**
	* Helper function to de-authorize the app
	* @param success
	* @param error
	* @returns {*}
	*/
	function revokePermissions (success, error) {
		var options = {
			method: 'DELETE',
			path: '/me/permissions',
			success: success,
			error: error
		}

		return api(options)
	}

	function parseQueryString (queryString) {
		var qs = decodeURIComponent(queryString)
		var options = {}
		var params = qs.split('&')

		params
			.forEach(param => {
				var splitter = param.split('=')
				options[splitter[0]] = splitter[1]
			})

		return options
	}

	function toQueryString (options) {
		var parts = []
		for (var i in options) {
			if (options.hasOwnProperty(i)) parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(options[i]))
		}

		return parts.join('&')
	}

	return {
		init: init,
		login: login,
		logout: logout,
		revokePermissions: revokePermissions,
		api: api,
		oauthCallback: oauthCallback,
		getLoginStatus: getLoginStatus
	}
})()
