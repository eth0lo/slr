var connect  = require('connect'),
    assets   = require('serve-static'),
    injector = require(__base + 'middlewares/injector');


function StaticServer (options) {
  this._server        = connect();
  this.port           = options.port;
  this.directory      = options.directory;
  this.livereloadPort = options.livereloadPort;
  this.spa            = options.spa;
  this.silent         = false || options.silent;
  this.server;

  this.initServer();
}

StaticServer.prototype.initServer = function() {
  this._server
    .use(injector({
      directory: this.directory,
      livereloadPort: this.livereloadPort,
      spa: this.spa
    }))
    .use(assets(this.directory));
};

StaticServer.prototype.start = function() {
  var self = this;

  this.server = this._server.listen(this.port, function() {
    if(!self.silent) {
      console.log('Static server on %s', self.port);
    }
  });
};

StaticServer.prototype.stop = function() {
  this.server.close();
};

module.exports = StaticServer;
