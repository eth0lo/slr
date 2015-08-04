#!/usr/bin/env node

global.__base = __dirname + '/src/';

// Commands
var cli = require('commander');

cli
  .version('0.0.1')
  .option('-p, --port <port>'            , 'Change static server port [8000]', 8000)
  .option('-P, --livereload-port <port>' , 'Change livereload port [35729]', 35729)
  .option('-d, --directory <path>'       , 'Change the default directory for serving files [.]', process.cwd())
  .option('-s, --spa'                    , 'Return index.html when HTML request is not found', false)
  .parse(process.argv);



// Start Asset server
var AssetServer = require(__base + 'assets_server');
var assetServer = new AssetServer({
  port: cli.port,
  directory: cli.directory,
  livereloadPort: cli.livereloadPort,
  spa: cli.spa
});

assetServer.start();


// Start Livereload server
var LivereloadServer = require(__base + 'livereload_server');
var livereloadServer = new LivereloadServer({
  port: cli.livereloadPort
});

livereloadServer.start();


// Start Monitor
var Monitor = require(__base + 'monitor');
var monitor = new Monitor({
  directory: cli.directory,
  livereloadPort: cli.livereloadPort
})

monitor.start();
