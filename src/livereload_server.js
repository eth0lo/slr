var livereload = require('tiny-lr');


function LivereloadServer (options) {
  this.server         = livereload();
  this.port           = options.port;
}

LivereloadServer.prototype.start = function() {
  var self = this;
  this.server.listen(this.port, function() {
    console.log('Livereload server on %s', self.port);
  });
};

module.exports = LivereloadServer;
