var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jade = require('gulp-jade');
var webserver = require('gulp-webserver');
var gutil = require('gulp-util');
var minify = require('gulp-minify');

gulp.task('scripts', function() {
    gulp.src('src/engine.js')
        .pipe(browserify())
        .on('error', gutil.log)
        .pipe(gulp.dest('./'))
        .pipe(minify())
        .pipe(gulp.dest('./'));
});

gulp.task('templates', function() {
  gulp.src('docs/index.jade')
    .pipe(jade())
    .on('error', gutil.log)
    .pipe(gulp.dest('docs/'));
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('watch', function () {
  gulp.watch(['docs/index.jade','docs/sections/*.jade'],['templates']);
  gulp.watch('src/*.js',['scripts']);
});

gulp.task('default', ['scripts','templates','webserver','watch']);