"use strict";

const Donations = {
  home: {
    handler: async function (request, h) {
      return h.view("home", { title: "Secure & Safe"});
    },
  },

  evil: {
    handler: async function (request, h) {
      return h.view("evil", { title: "YOU'VE BEEN HACKED"});
    },
  },

};

module.exports = Donations;
