#!/usr/bin/env node

/**
 * Module dependencies.
 */
var fs = require('fs');
var async = require('async');
var sloth = require('commander');
var chalk = require('chalk');


/**
 * JS common functions
 */
function sortNumber (a, b) {
  return a - b;
}

/**
 * sloth.js: Util functions
 */
function getDirObj (path) {
  let obj = {};
  try {
    path = path.match(/\/$/) ? path : path + '/';
    let _pstats = fs.statSync(path);
    if (_pstats.isDirectory()) {
      let _files = fs.readdirSync(path);
      for (let i = 0; i < _files.length; i++) {
        if (_files[i].match(/.?json$/))
          obj[_files[i].split(/(.?)json$/)[0]] = require(path + _files[i]);
      }
    }
  } catch (e) {}
  return obj;
}

function getDirFiles (path) {
  var files = [];
  try {
    path = path.match(/\/$/) ? path : path + '/';
    var _pstats = fs.statSync(path);
    if (_pstats.isDirectory()) {
      var _files = fs.readdirSync(path);
      for (var i = 0; i < _files.length; i++) {
        if (_files[i].match(/.?\.(js|json|sql|sh)$/))
          files.push(_files[i]);
      }
    }
  } catch (e) {}
  return files;
}


/**
 * sloth.js: Prepare CLI information
 */
function helpMsg (msg, type) {
  var color = {
    'i': 'cyan',
    'w': 'yellow',
    'e': 'red'
  };
  var prefix = {
    'i': 'Info: ',
    'w': 'Warn: ',
    'e': 'Error: '
  };

  if (msg) {
    console.log('');
    console.log(chalk.bold(chalk[color[type]]('  ' + prefix[type] + msg)));
  }
  return sloth.help();
}

function range (val) {
  return val.split('..').map(Number);
}

function list (val) {
  return val.split(',');
}


sloth.version('0.0.1')
  .option('-p, --path <folder>', 'apply update jobs from <folder>')
  .option('-u, --update <a>..<b>', 'apply serial update jobs from <begin> to <end>', range)
  .option('-i, --init', 'apply init script after update')
  .option('-t, --target <name>', 'specify effect target, default: null');
  // .option('-s, --step', 'step by step interactive mode')
  // .option('-f, --force', 'force finish all task, ignore error occurs');

sloth.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    $ ./sloth.js -p 160327 -t mirror');
  console.log('    $ node sloth.js -u 160327..160430 --init -t master');
  console.log('');
});

sloth.parse(process.argv);


/**
 * Main flow
 * - Generate source folder list
 * - Create config & target info for each source folder
 * - Generate job list with mapped config, target
 * - Execute & log each job
 */
var config = {};
var target = {};

var src_queue = [];
var job_queue = [];
var log_queue = [];


// 1. Generate source folder list
//    - check and parse argumants
//    - check path exists
//    - add to source folder list
if (sloth.path) {
  var _path = sloth.path.match(/update_(\d*)/) ? sloth.path : 'update_' + sloth.path;
  try {
    var _pstats = fs.statSync(_path);
    if (_pstats.isDirectory()) {
      src_queue.push(_path);
    } else {
      helpMsg('Path is not a folder', 'e');
    }
  } catch (e) {
    helpMsg('Path not exist.', 'e');
  }
} else if (sloth.update) {
  var _files = fs.readdirSync('.');
  var _dirs = [];
  for (var i = 0; i < _files.length; i++) {
    if (_files[i].match(/update_(\d*)/)) {
      var _num = parseInt(_files[i].split(/update_(\d*)/)[1]);
      if ((_num >= sloth.update[0]) && (_num <= sloth.update[1]))
        src_queue.push('update_' + _num);
    }
  }
}

if (!src_queue.length)
  helpMsg('Please spicify the source folder', 'i');


// 2. Create config & target inf
//    - Create global config info
//    - Create global target info
//    - Override config with <TARGET>
//    - Override config with source/config
//    - Override config with source/<TARGET>/config
//    - Override target with source/<TARGET>

config = getDirObj('./config/');

if (sloth.target) {
  target = getDirObj('./' + sloth.target);
  var _tconfig = getDirObj('./' + sloth.target + '/config');
  for (key in _tconfig)
    config[key] = _tconfig[key];
}

for (var i = 0; i < src_queue.length; i++) {
  var _src_config = getDirObj('./' + src_queue[i] + '/config');
  var _src_target = getDirObj('./' + src_queue[i] + '/' + sloth.target);
  var _src_tconfig = getDirObj('./' + src_queue[i] + '/' + sloth.target + '/config');

  var _src_obj = {
    'path': '' + src_queue[i],
    'config': {},
    'target': {}
  };

  for (key in config)
    _src_obj.config[key] = config[key];
  for (key in _src_config)
    _src_obj.config[key] = _src_config[key];
  for (key in _src_tconfig)
    _src_obj.config[key] = _src_tconfig[key];

  for (key in target)
    _src_obj.target[key] = target[key];
  for (key in _src_target)
    _src_obj.target[key] = _src_target[key];

  src_queue[i] = _src_obj;
}


// 3. Generate job list with mapped config, target
//    - read supported files from source folder
//    - if --init, read init script under source folder
for (var i = 0; i < src_queue.length; i++) {
  var _src_files;

  _src_files = getDirFiles(src_queue[i].path);
  for (var j = 0; j < _src_files.length; j++)
    job_queue.push({'job': _src_files[j], 'config': src_queue[i].config, 'target': src_queue[i].target});

  if (sloth.init) {
    _src_files = getDirFiles(src_queue[i].path + '/init');
    for (var j = 0; j < _src_files.length; j++)
      job_queue.push({'job': _src_files[j], 'config': src_queue[i].config, 'target': src_queue[i].target});
  }
}

console.log(job_queue);


// 4.
