angular
  .module('ngOpenFB', [])

  .factory('ngFB', ($q, $window) => {
    function init (params) {
      return $window.openFB.init(params)
    }

    function login (options) {
      const deferred = $q.defer()
      $window.openFB.login(result => {
        result.status === 'connected'
          ? deferred.resolve(result)
          : deferred.reject(result)
      }, options)

      return deferred.promise
    }

    function logout () {
      const deferred = $q.defer()
      $window.openFB.logout(() => deferred.resolve())

      return deferred.promise
    }

    function api (options) {
      const deferred = $q.defer()
      options.success = result => deferred.resolve(result)
      options.error = error => deferred.reject(error)
      $window.openFB.api(options)

      return deferred.promise
    }

    function revokePermissions () {
      const deferred = $q.defer()
      $window.openFB.revokePermissions(
        () => deferred.resolve(),
        () => deferred.reject(),
      )

      return deferred.promise
    }

    function getLoginStatus () {
      const deferred = $q.defer()
      $window.openFB.getLoginStatus(result => deferred.resolve(result))

      return deferred.promise
    }

    return {
      init,
      login,
      logout,
      revokePermissions,
      api,
      getLoginStatus,
    }
  })
