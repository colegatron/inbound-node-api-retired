var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var config = require('../config').markup;

gulp.task('compress', function() {
  gulp.src(config.dest + '/app.js')
  	.pipe(rename({
  			basename: "hc",
            suffix: '.min'
        }))
    .pipe(uglify())
    .pipe(gulp.dest(config.dest))
});