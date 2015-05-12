
var gulp = require('gulp'),
    karma = require('gulp-karma'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    copy = require('gulp-copy'),
    markdox = require("gulp-markdox"),
    gulpIgnore = require('gulp-ignore'),
    exec = require('exec'),
    nodemon = require('gulp-nodemon');



/**
 * Loads node server
 */
gulp.task('startServer', function () {
    nodemon({
        script: 'server.js'
        , ext: 'js html'
        , env: { 'NODE_ENV': 'development' }

    })
});