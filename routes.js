"use strict";

const Accounts = require("./app/controllers/accounts");
const Donations = require("./app/controllers/donations");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: "GET", path: "/home", config: Donations.home },
  { method: "GET", path: "/evil", config: Donations.evil },

  {
    method: 'GET',
    path: '/dodgy/{user}',
    handler: function (request, reply) {
      return 'You have been hacked, ' + request.params.user;
    },
    config: {auth: false}
  },

  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false },
  },
];