var gutil = require('gulp-util');
var File = gutil.File;
var PluginError = gutil.PluginError;
var through = require('through2');
var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs');
var coffeeScriptConcatPath = require.resolve('coffeescript-concat');

var PLUGIN_NAME = require('./plugin-name');

function coffeeScriptConcat(file) {
    
    var files = [];

    if (!file || (typeof file !== 'string' && typeof file.path !== 'string'))
        throw new PluginError(PLUGIN_NAME, 'Missing file option for ' + PLUGIN_NAME);

    function bufferContents(file, encoding, callback) {

        // Skipping empty files
        if (file.isNull())
            return callback();

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }

        // adding file to list of files that will be concatenated
        // if it has no added yet
        if (files.indexOf(file.path) === -1)
            files.push(file.path);

        callback();
    }

    function endStream(callback) {
        var that = this;

        exec('node ' + coffeeScriptConcatPath + ' ' + files.join(' '), {}, function (error, stdout) {

            if (files.length < 1)
                return callback();

            if (error)
                return callback(new PluginError(PLUGIN_NAME, error));

            var concatFile;

            if (typeof file === 'string') {
                concatFile = new File();
                concatFile.stat = {mode: 0666};
                concatFile.path = file;
            } else {
                concatFile = new File(file);
            }

            concatFile.contents = new Buffer(stdout);

            that.push(concatFile);
            
            callback();
        });
    }

    return through.obj(bufferContents, endStream);

}

module.exports = coffeeScriptConcat;
