global.__base = process.cwd() + '/src/';

var AssetServer = require(__base + 'assets_server'),
    assert      = require('assert'),
    fs          = require('fs'),
    nodefn      = require('when/node'),
    read        = nodefn.lift(fs.readFile),
    request     = require('request-promise');
    when        = require('when');

var templatePath  = process.cwd() + '/test/fixtures/index_injected.html',
    template      = read(templatePath, 'utf8');

var config = {
  port: 8000,
  directory: process.cwd() + '/test/fixtures',
  livereloadPort: 35729,
  silent: true
};

describe('Asset Server', function() {

  var assets;
  beforeEach(function() {
    assets = new AssetServer(config);
  });

  afterEach(function() {
    assets.stop();
  });


  describe('Serving files', function() {

    it('should serve a file from the especified directory matching the url', function(next) {
      var file = 'http://localhost:' + config.port + '/a.css';

      assets.start();
      assets.server.on('listening', function() {

        request({
          url: file,
          resolveWithFullResponse: true,
          headers: {
            'Accept': 'text/css'
          }})
          .then(function(response) {
              assert.equal(response.headers['content-type'], 'text/css; charset=UTF-8');
              assert.equal(response.statusCode, 200);
              assert.equal(response.body, 'body { background-color: red; }\n')
              next()
            });
      });
    });


    it('should serve a file from the especified nested directory matching the url', function(next) {
      var file = 'http://localhost:' + config.port + '/nested/b.css';

      assets.start();
      assets.server.on('listening', function() {

        request({
          url: file,
          resolveWithFullResponse: true,
          headers: {
            'Accept': 'text/css'
          }})
          .then(function(response) {
              assert.equal(response.headers['content-type'], 'text/css; charset=UTF-8');
              assert.equal(response.statusCode, 200);
              assert.equal(response.body, 'body { background-color: blue; }\n')
              next()
            });
      });
    });


    it('should return a 404 if the file does not exist in the directory', function(next) {
      var file = 'http://localhost:' + config.port + '/c.css';

      assets.start();
      assets.server.on('listening', function() {

        request({
          url: file,
          resolveWithFullResponse: true,
          headers: {
            'Accept': 'text/css'
          }})
          .catch(function(response) {
              assert.equal(response.statusCode, 404);
              next()
            });
      });
    });
  });


  describe('Injecting livereload script', function() {

    it('should inject the script when serving html', function(next) {
      var requestOptions = {
        url: 'http://localhost:' + config.port,
        resolveWithFullResponse: true,
        headers: {
          'Accept': 'text/html'
        }
      };

      assets.start();
      assets.server.on('listening', function() {
        var responseHtml;

        when.join(request(requestOptions), template)
          .then(function(args){
            var response = args[0],
                contents = args[1];

            assert.equal(response.headers['content-type'], 'text/html');
            assert.equal(response.statusCode, 200);
            assert.equal(response.body, contents);
            next();
          })
      });
    });
  });
});
