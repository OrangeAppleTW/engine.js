var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var webserver = require('gulp-webserver');
var gutil = require('gulp-util');
var minify = require('gulp-minify');
var glob = require('glob');

var testcases = {};

function updateTestcases () {
    testcases = {};
    glob('test/**/*.js', function (er, files) {

        files.forEach((f) => {
            var arr = f.split('/');
            if (testcases[arr[1]]) {
                testcases[arr[1]].push({ path: f, name: arr[2] })
            } else {
                testcases[arr[1]] = [
                    { path: f, name: arr[2] }
                ]
            }
        });
    });    
}

updateTestcases();


gulp.task('scripts', function () {
    gulp.src('src/engine.js')
        .pipe(browserify())
        .on('error', gutil.log)
        .pipe(gulp.dest('./'))
        .pipe(minify())
        .pipe(gulp.dest('./'));
});

gulp.task('scss', function () {
    gulp.src('docs/index.scss')
        .pipe(sass())
        .on('error', gutil.log)
        .pipe(gulp.dest('docs/'));
});

gulp.task('indexPage', function () {
    gulp.src('docs/index.jade')
        .pipe(jade())
        .on('error', gutil.log)
        .pipe(gulp.dest('./docs'));
});

gulp.task('testPage', function () {
    updateTestcases();
    gulp.src('docs/test.jade')
        .pipe(jade({
            locals: testcases,
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('./docs'));
});

gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(webserver({
            host: '0.0.0.0',
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('watch', function () {
    gulp.watch(['docs/index.jade', 'docs/sections/*.jade'], ['indexPage']);
    gulp.watch(['docs/test.jade', 'test/**/*.js'], ['testPage']);
    gulp.watch('src/*.js', ['scripts']);
    gulp.watch('docs/index.scss', ['scss']);
});

gulp.task('default', ['scripts', 'scss', 'indexPage', 'webserver', 'watch']);