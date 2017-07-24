var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var webserver = require('gulp-webserver');
var gutil = require('gulp-util');
var minify = require('gulp-minify');

gulp.task('scripts', function() {
  gulp.src('src/engine.js')
      .pipe(browserify())
      .on('error', gutil.log)
      .pipe(minify())
      .pipe(gulp.dest('./'));
});

gulp.task('jade', function () {
  gulp.src('docs/jade/*.jade')
      .pipe(jade())
      .on('error', gutil.log)
      .pipe(gulp.dest('docs/'));
});

gulp.task('scss', function () {
  gulp.src('docs/scss/*.scss')
      .pipe(sass())
      .on('error', gutil.log)
      .pipe(gulp.dest('docs/'));
});

gulp.task('js', function () {
  gulp.src('docs/js/*.js')
      .pipe(minify())
      .pipe(gulp.dest('docs/'));
});

gulp.task('webserver', function () {
  gulp.src('./')
      .pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: true
      }));
});

gulp.task('watch', function () {
  gulp.watch(['docs/jade/*.jade','docs/jade/**/*.jade'],['jade']);
  gulp.watch('docs/scss/*.scss',['scss']);
  gulp.watch('docs/js/*.js',['js']);
  gulp.watch('src/*.js',['scripts']);
});

gulp.task('default', ['scripts','js','scss','jade','webserver','watch']);