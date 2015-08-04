var path = require('path'),
    fs   = require('fs');


function FileUrlMapper(options) {
  this.base = options.directory;
  this.spa  = options.spa;
}

FileUrlMapper.prototype.hasTrailingSlash = function(url) {
  return url[url.length - 1] === '/';
 };

FileUrlMapper.prototype.implicitIndexConversion = function(url) {
  return url + 'index.html';
};

FileUrlMapper.prototype.relativeFilePath = function(url) {
  return this.hasTrailingSlash(url) ? this.implicitIndexConversion(url) : url;
};

FileUrlMapper.prototype.pathFromUrl = function(url) {
  if(this.spa) return path.join(this.base, this.relativeFilePath('index.html'));

  return path.join(this.base, this.relativeFilePath(url));
};

FileUrlMapper.prototype.urlFromPath = function(filePath) {
  return path.relative(this.base, filePath);
};

module.exports = FileUrlMapper;
