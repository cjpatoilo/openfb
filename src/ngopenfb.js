angular
	.module('ngOpenFB', [])

	.factory('ngFB', ($q, $window) => {
		function init (params) {
			return $window.openFB.init(params)
		}

		function login (options) {
			var deferred = $q.defer()
			$window.openFB.login(result => {
				if (result.status === 'connected') deferred.resolve(result)
				else deferred.reject(result)
			}, options)

			return deferred.promise
		}

		function logout () {
			var deferred = $q.defer()
			$window.openFB.logout(() => deferred.resolve())

			return deferred.promise
		}

		function api (options) {
			var deferred = $q.defer()
			options.success = result => deferred.resolve(result)
			options.error = error => deferred.reject(error)
			$window.openFB.api(options)

			return deferred.promise
		}

		function revokePermissions () {
			var deferred = $q.defer()
			$window.openFB.revokePermissions(() => deferred.resolve(), () => deferred.reject())

			return deferred.promise
		}

		function getLoginStatus () {
			var deferred = $q.defer()
			$window.openFB.getLoginStatus(result => deferred.resolve(result))

			return deferred.promise
		}

		return {
			init: init,
			login: login,
			logout: logout,
			revokePermissions: revokePermissions,
			api: api,
			getLoginStatus: getLoginStatus
		}
	})
