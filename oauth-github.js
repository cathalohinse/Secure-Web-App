'use strict';

const os = require('os');
os.tmpDir = os.tmpdir;

const Hapi = require('@hapi/hapi');
const Bell = require('@hapi/bell');
const AuthCookie = require('@hapi/cookie');

const main = async () => {

  const server = Hapi.server({ port: 3000 });

  // Register bell and hapi auth cookie with the server
  await server.register([Bell, AuthCookie]);

  server.auth.strategy('cookie-auth', 'cookie', {
    cookie: {
      name: 'demo_auth', // Name of auth cookie to be set
      password: 'password-should-be-32-characters',  // String used to encrypt cookie
      isSecure: false     // Should be 'true' in production software (requires HTTPS)
    },
    redirectTo: '/',
  });

  var bellAuthOptions = {
    provider: 'github',
    password: 'github-encryption-password-secure', // String used to encrypt cookie
    // used during authorisation steps only
    clientId: '0a71c5c6580911ace39a',          // *** Replace with your app Client Id ****
    clientSecret: '4f32e9b80b3546c712d06362ba27ac1ffb6d7a6e',  // *** Replace with your app Client Secret ***
    isSecure: false        // Should be 'true' in production software (requires HTTPS)
  };

  server.auth.strategy('github-oauth', 'bell', bellAuthOptions);

  server.auth.default('cookie-auth');

  //Set up the routes
  server.route([
    {
      method: 'GET',
      path: '/login',
      config: {
        auth: 'github-oauth',
        handler: function (request, h) {
          if (request.auth.isAuthenticated) {
            request.cookieAuth.set(request.auth.credentials);
            return ('Hello ' + request.auth.credentials.profile.displayName);
          }
          return('Not logged in...');
        }
      }
    }, {
      method: 'GET',
      path: '/account',
      config: {
        auth: 'cookie-auth',
        handler: function (request, h) {
          if (request.auth.isAuthenticated) {
            return(request.auth.credentials.profile);
          }
        }
      }
    }, {
      method: 'GET',
      path: '/userinfo',
      config: {
        auth: 'cookie-auth',
        handler: function (request, h) {
          if (request.auth.isAuthenticated) {
            return('<h2>From your GitHub profile</h2>'
              + '<b>User name:</b> ' + request.auth.credentials.profile.username
              + '<br><b>Display name:</b> ' + request.auth.credentials.profile.displayName
              + '<br><b>Email address:</b> ' + request.auth.credentials.profile.email
              + '<br><b>Affiliation:</b> ' + request.auth.credentials.profile.raw.company);
          }
        }
      }
    }, {
      method: 'GET',
      path: '/',
      config: {
        auth: {
          mode: 'optional'
        },
        handler: function (request, h) {
          if (request.auth.isAuthenticated) {
            return ('Hello ' + request.auth.credentials.profile.displayName);
          }
          return('Not logged in...');
        }
      }
    }, {
      method: 'GET',
      path: '/logout',
      config: {
        auth: false,
        handler: function (request, h) {
          request.cookieAuth.clear();
          return('Logged out now! Note you are just logged out of this app and not GitHub. Going to /login will log you back in again.');
        }
      }
    }
  ]);

  // Start the server
  await server.start()

  return server;
};

main()
  .then((server) => console.log(`Server listening on ${server.info.uri}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
