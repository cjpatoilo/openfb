[![Facebook integration in JavaScript apps running in the browser and in Cordova.](https://repository-images.githubusercontent.com/95079283/9f5a5680-0331-11ea-8e74-3ad837a646a2)](https://github.com/cjpatoilo/openfb)

> Facebook integration in JavaScript apps running in the browser and in Cordova.

[![Travis Status](https://travis-ci.org/cjpatoilo/openfb.svg?branch=master)](https://travis-ci.org/cjpatoilo/openfb?branch=master)
[![AppVeyor Status](https://ci.appveyor.com/api/projects/status/12iw9j8dflj56h6n?svg=true)](https://ci.appveyor.com/project/cjpatoilo/openfb)
[![Codacy Status](https://img.shields.io/codacy/grade/37430abefbc14c488ae768cd4e8f55fe/master.svg)](https://www.codacy.com/app/cjpatoilo/openfb/dashboard)
[![Dependencies Status](https://david-dm.org/cjpatoilo/angular-openfb.svg)](https://david-dm.org/cjpatoilo/angular-openfb)
[![Version Status](https://badge.fury.io/js/angular-openfb.svg)](https://www.npmjs.com/package/angular-openfb)
[![Download Status](https://img.shields.io/npm/dt/angular-openfb.svg)](https://www.npmjs.com/package/angular-openfb)
[![Gitter Chat](https://img.shields.io/badge/gitter-join_the_chat-4cc61e.svg)](https://gitter.im/cjpatoilo/openfb)

## Why it's awesome

OpenFB is an easy way for Facebook integration in JavaScript apps. No dependency. No Facebook plugin. No Facebook SDK. OpenFB allows you to login to Facebook and executes any Facebook Graph API request.

## Getting Started

**Install with npm**

```
$ npm install angular-openfb
```

**Install with Yarn**

```
$ npm add angular-openfb
```

**Install with Bower**

```
$ bower install angular-openfb
```

## Usage

First step, create a Facebook App:

1. Access https://developers.facebook.com/apps, and in "My Apps" Tab click `Create App`
1. Define a unique name for your app and click `Create App ID`

Second step, create Facebook Login:

1. Click `Set Up` of the "Facebook Login" section
1. Now click on the "Settings" of the "Facebook Login" tab in the sidebar navigation
1. On the "Client OAuth Settings", add the following URLs in the "Valid OAuth Redirect URIs" field:

 - http://localhost:8100/oauthcallback.html (for access using ionic serve)
 - https://www.facebook.com/connect/login_success.html (for access from Cordova)

1. Click Save Changes
1. Now, the `App ID` is available

## Features

- Integrate your JavaScript application with Facebook.
- Works for both BROWSER-BASED apps and CORDOVA apps.
- Login to Facebook.
- Run any Facebook Graph API request.
- No dependency.
- No Facebook SDK.
- No Facebook Cordova plugin.
- No jQuery.

## Packages

- [Vanilla JavaScript](https://github.com/cjpatoilo/openfb)
- [Angular.js](https://github.com/cjpatoilo/openfb/tree/master/packages/angular-openfb)

## Contributing

Want to contribute? Follow these [recommendations](https://github.com/cjpatoilo/openfb/contribute).

## License

Designed with ♥ by [CJ Patoilo](https://twitter.com/cjpatoilo). Licensed under the [MIT License](https://cjpatoilo.com/license).
