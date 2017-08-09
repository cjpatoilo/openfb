/*!
 * ngOpenFB v0.0.4
 * http://cjpatoilo.com/angular-openfb
 *
 * Copyright (c) 2017 CJ Patoilo
 * Licensed under the MIT license
 */

'use strict';

angular.module('ngOpenFB', []).factory('ngFB', function ($q, $window) {
	function init(params) {
		return $window.openFB.init(params);
	}

	function login(options) {
		var deferred = $q.defer();
		$window.openFB.login(function (result) {
			if (result.status === 'connected') deferred.resolve(result);else deferred.reject(result);
		}, options);

		return deferred.promise;
	}

	function logout() {
		var deferred = $q.defer();
		$window.openFB.logout(function () {
			return deferred.resolve();
		});

		return deferred.promise;
	}

	function api(options) {
		var deferred = $q.defer();
		options.success = function (result) {
			return deferred.resolve(result);
		};
		options.error = function (error) {
			return deferred.reject(error);
		};
		$window.openFB.api(options);

		return deferred.promise;
	}

	function revokePermissions() {
		var deferred = $q.defer();
		$window.openFB.revokePermissions(function () {
			return deferred.resolve();
		}, function () {
			return deferred.reject();
		});

		return deferred.promise;
	}

	function getLoginStatus() {
		var deferred = $q.defer();
		$window.openFB.getLoginStatus(function (result) {
			return deferred.resolve(result);
		});

		return deferred.promise;
	}

	return {
		init: init,
		login: login,
		logout: logout,
		revokePermissions: revokePermissions,
		api: api,
		getLoginStatus: getLoginStatus
	};
});
