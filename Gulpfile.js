var gulp               = require('gulp');
var sass               = require('gulp-sass');
var react              = require('gulp-react');
var concat             = require('gulp-concat');
var cssmin             = require('gulp-cssmin');
var uglify             = require('gulp-uglify');
var notify             = require('gulp-notify');
var rename             = require('gulp-rename');
var filter             = require('gulp-filter');
var flatten            = require('gulp-flatten');
var changed            = require('gulp-changed');
var plumber            = require('gulp-plumber');
var imagemin           = require('gulp-imagemin');
var sourcemaps         = require('gulp-sourcemaps');
var autoprefixer       = require('gulp-autoprefixer');

var del                = require('del');
var argv               = require('yargs').argv;
var runsequence        = require('run-sequence');
var browserSync        = require('browser-sync');
var reload             = browserSync.reload;

var plumberErrorHandler = {
  errorHandler: notify.onError({
    title: 'Gulp',
    message: "Error: <%= error.message %>"
  })
};

var browserSyncOptions = {
  server: {
    baseDir: './deploy'
  },
  files: ['deploy/**/*.*'],
  port: 1337,
  browser: ['google chrome']
};

gulp.task('styles', function() {
  return gulp.src(['dev/styles/*.scss'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 10', 'Android >= 4.3'] }))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('deploy/styles'));
});

gulp.task('react', function () {
  return gulp.src(['dev/scripts/jsx/*.jsx'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(react())
    .pipe(gulp.dest('dev/scripts/modules'));
});

gulp.task('scripts', function() {
  return gulp.src(['dev/scripts/modules/*.js', 'dev/scripts/init.js'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('deploy/scripts'));
});

gulp.task('vendor', function() {
  var styles = filter(['styles/**/*.scss'], {restore: true});
  var scripts = filter(['scripts/**/*.js'], {restore: true});
  return gulp.src(['dev/vendor/**'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(styles)
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(styles.restore)
    .pipe(scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(scripts.restore)
    .pipe(flatten())
    .pipe(gulp.dest('deploy/vendor'));
});

gulp.task('images', function() {
  return gulp.src(['dev/images/*'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(changed('deploy/images', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest('deploy/images/'));
});

gulp.task('copy', function() {
  return gulp.src(['dev/markup/*.html'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(changed('deploy/', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest('deploy/'));
});

gulp.task('browser-sync', ['build'], function () {
  browserSync.init(browserSyncOptions);
});

gulp.task('clean', function () {
  del(['deploy/**/*']);
});

gulp.task('build', ['clean'], function(cb) {
  runsequence(['copy', 'images', 'styles', 'scripts', 'vendor'], cb);
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['dev/styles/**/*.scss'], ['styles']);
  gulp.watch(['dev/scripts/**/*.js'], ['scripts']);
  gulp.watch(['dev/vendor/**/*.{js,scss}'], ['vendor']);
  gulp.watch(['dev/markup/**'], ['copy']);
});

gulp.task('default', ['clean', 'build', 'watch', 'browser-sync']);
