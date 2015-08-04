var FileUrlMapper = require(__base + 'file_url_mapper'),
    cheerio       = require('cheerio'),
    fs            = require('fs'),
    handlebars    = require('handlebars'),
    nodefn        = require('when/node'),
    path          = require('path'),
    read          = nodefn.lift(fs.readFile),
    urlParser     = require('url');

var templatePath  = __base + 'templates/livereload_script.hbs',
    template      = read(templatePath, 'utf8');

var fileUrlMapper, livereloadPort;

function send(res) {
  return function(html) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  }
}

function inject(html) {
  var $ = cheerio.load(html);
  return template.then(function(template){
    var compiledTemplate = handlebars.compile(template);
    var script = compiledTemplate({
      livereloadPort: livereloadPort
    });
    $('body').append(script);
    return $.html();
  });
}

function isHTML(req) {
  var headers = req.headers;
  var accepts = headers.accept;

  return !!~accepts.indexOf('text/html');
}

function injector(req, res, next) {
  if(!isHTML(req)) return next();

  var url = urlParser.parse(req.url, true);
  var filePath = fileUrlMapper.pathFromUrl(url.pathname);

  read(filePath, 'utf8')
    .then(inject)
    .then(send(res));
}

function scriptInjector(options) {
  var directory = options.directory;

  livereloadPort = options.livereloadPort;
  fileUrlMapper = new FileUrlMapper({directory: directory});

  return injector;
}

module.exports = scriptInjector;
