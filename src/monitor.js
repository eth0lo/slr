// Monitor server
var FileUrlMapper = require(__base + 'file_url_mapper'),
    chokidar      = require('chokidar'),
    request       = require('request-promise');

function Monitor (options) {
  this.directory      = options.directory;
  this.livereloadPort = options.livereloadPort;
  this.fileUrlMapper  = new FileUrlMapper({directory: this.directory});
  this.watcher;

  this.initWatcher();
}

Monitor.prototype.initWatcher = function() {
  this.watcher = chokidar.watch(this.directory, {ignored: /[\/\\]\./, persistent: true});
};

Monitor.prototype.start = function() {
  this.listenForChanges();
};

Monitor.prototype.listenForChanges = function() {
  this.watcher.on('change', this.updateLivereload.bind(this));
};

Monitor.prototype.livereloadUrl = function() {
  return 'http://localhost:'+ this.livereloadPort +'/changed';
};

Monitor.prototype.urlFromPath = function(path) {
  return this.fileUrlMapper.urlFromPath(path);
};

Monitor.prototype.updateLivereload = function(path) {
  request({
      url: this.livereloadUrl(),
      qs:  {files: this.urlFromPath(path)}
    })
    .then(function (response, body) {
      console.log('reloaded', path);
    });
};

Monitor.prototype.stop = function() {
  this.watcher.close();
};

module.exports = Monitor;
