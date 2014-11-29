global.__base = process.cwd() + '/src/';

var Monitor = require(__base + 'monitor'),
    assert  = require('assert')
    fs      = require('fs'),
    when    = require('when'),
    nodefn  = require('when/node'),
    append  = nodefn.lift(fs.appendFile),
    create  = nodefn.lift(fs.writeFile),
    remove  = nodefn.lift(fs.unlink);

var filePath = process.cwd() + '/test/fixtures/d.css'

var config = {
  directory: process.cwd() + '/test/fixtures',
  livereloadPort: 35729,
  silent: false
};

describe('Filesytem Monitor', function() {

  var monitor, file, server;

  function livereloadMock() {
    var http = require('http');
    return http.createServer().listen(config.livereloadPort, 'localhost');
  }

  function removeLivereloadMock() {
    server.close();
  }

  beforeEach(function() {
    monitor = new Monitor(config);
    server  = livereloadMock();
    file    = create(filePath, '');

    monitor.start();
  });

  afterEach(function() {
    remove(filePath);
    removeLivereloadMock();

    monitor.stop();
  });


  it('should request a change when a file have change to the livereload server', function(next) {
    server.on('request', function(request) {
      var url = request.url;

      assert(url, '/changed?files=d.css');
      next();
    });

    // Make a change in the file
    append(filePath, 'body {}');
  });
});
