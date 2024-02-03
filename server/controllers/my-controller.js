'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('photo-plus')
      .service('myService')
      .getWelcomeMessage();
  },
});
