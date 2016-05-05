var gulp = require('gulp');
var should = require('should');
var fs = require('fs');
var path = require('path');
var test = require('./test-stream');
var assert = require('stream-assert');
var File = require('gulp-util').File;
var rmdir = require('rmdir');
var coffeeConcat = require('../');

var partials = function (glob) { return path.join(__dirname, 'partials', glob); };
var clearTemp = function (done) {
    var tmpPath = path.join(__dirname, 'tmp');
    if (fs.existsSync(tmpPath))
        rmdir(tmpPath, done);
    else
        done();
};

var PLUGIN_NAME = require('../plugin-name');

describe(PLUGIN_NAME, function () {

    beforeEach(function(done) {
        clearTemp(done);
    });
    afterEach(function(done) {
        clearTemp(done);
    });

    describe('coffeeConcat()', function() {

        it('should throw error, when arguments is missing', function () {
            (function () {
                coffeeConcat();
            }).should.throw('Missing file option for ' + PLUGIN_NAME);
        });

        it('should ignore null files', function (done) {
            var stream = coffeeConcat('test.js');
            stream
                .pipe(assert.length(0))
                .pipe(assert.end(done));
            stream.write(new File());
            stream.end();
        });

        it('should emit error on streamed file', function (done) {
            gulp.src([partials('*'), partials('**/*')], { buffer: false })
                .pipe(coffeeConcat('test.js'))
                .on('error', function (err) {
                    err.message.should.eql('Streaming not supported');
                    done();
                });
        });

        it('should concat one file', function (done) {
            test('"test"')
                .pipe(coffeeConcat('test.coffee'))
                .pipe(assert.length(1))
                .pipe(assert.first(function (d) { d.contents.toString().should.eql('"test"\n\n'); }))
                .pipe(assert.end(done));
        });

        it('should preserve mode from files', function (done) {
            test('test = true')
                .pipe(coffeeConcat('test.coffee'))
                .pipe(assert.length(1))
                .pipe(assert.first(function (d) { d.stat.mode.should.eql(0666); }))
                .pipe(assert.end(done));

        });

        it ('should sort files according class and manual dependencies', function (done) {
            gulp.src([partials('*'), partials('**/*')])
                .pipe(coffeeConcat('test.coffee'))
                .pipe(assert.length(1))
                .pipe(assert.first(function (d) {
                    d.contents.toString().should.eql('class MegaClass\n  constructor: ->\n    console.log "Mega Class instance created"\nclass ParentClass extends MegaClass\n  constructor: ->\n    console.log \'Parent Class instance created\'\nclass ChildClass extends ParentClass\n  constructor: ->\n    console.log "Child Class instance created"\n\nmegaClass = new MegaClass\nparentClass = new ParentClass\nchildClass = new ChildClass\n\n');
                }))
                .pipe(assert.end(done));
        });

        describe('should not fail if no files were input', function () {
            it('when argument is a string', function(done) {
                var stream = coffeeConcat('test.coffee');
                stream.end();
                done();
            });

            it('when argument is an object', function(done) {
                var stream = coffeeConcat({path: 'new.coffee'});
                stream.end();
                done();
            });
        });

    });
});