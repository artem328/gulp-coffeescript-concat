var array = require('stream-array');
var gutil = require('gulp-util');
var File = gutil.File;
var PluginError = gutil.PluginError;
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var PLUGIN_NAME = require('../plugin-name');

module.exports = function () {
    var args = Array.prototype.slice.call(arguments);

    var i = 0;

    function create(contents) {
        var file = new File({
            cwd: __dirname + '/tmp',
            base: __dirname + '/tmp/streams',
            path: __dirname + '/tmp/streams/file' + (i++).toString() + '.coffee',
            contents: new Buffer(contents),
            stat: {mode: 0666}
        });

        mkdirp(path.dirname(file.path), function (error) {
            if (error)
                throw new PluginError(PLUGIN_NAME, error);

            fs.writeFileSync(file.path, file.contents, file.stat);
        });

        return file;
    }

    return array(args.map(create))
};