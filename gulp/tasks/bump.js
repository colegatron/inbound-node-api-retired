/**
 * Version bump tasks
 */
var gulp = require('gulp'),
bump = require('gulp-bump');

function getBumpTask(type) {
	return function() {
		//return gulp.src(['./package.json', './bower.json'])
		return gulp.src(['./package.json'])
			.pipe(bump({ type: type }))
			.pipe(gulp.dest('./'));
	};
}

gulp.task('bump', getBumpTask('patch'));
gulp.task('bump:minor', getBumpTask('minor'));
gulp.task('bump:major', getBumpTask('major'));