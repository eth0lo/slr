var FileUrlMapper = require(__base + 'file_url_mapper'),
    fs            = require('fs'),
    mime          = require('mime'),
    urlParser     = require('url'),
    fileUrlMapper;


function prepareHeaders(res, filePath) {
  return function() {
    res.statusCode = 200;
    res.setHeader('Content-Type', mime.lookup(filePath));
  }
}

function notFound(next) {
  return function() {
    next();
  }
}

function assets(req, res, next) {
  var url = urlParser.parse(req.url, true);
  var filePath = fileUrlMapper.pathFromUrl(url.pathname);
  var file = fs.createReadStream(filePath)

  file
      .on('error', notFound(next))
      .on('open', prepareHeaders(res, filePath))
    .pipe(res)
}

function serveAssets(options) {
  var directory = options.directory;
  fileUrlMapper = new FileUrlMapper({directory: directory});

  return assets;
}

module.exports = serveAssets;
