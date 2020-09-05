const routes = require('next-routes')();

routes
  .add('/stories/new', '/stories/new')
  .add('/stories/:address', '/stories/show');

module.exports = routes;
