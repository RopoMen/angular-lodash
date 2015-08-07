(function() {
  'use strict';

  var gulp = require('gulp');
  var jshint = require('gulp-jshint');

  gulp.task('jshint', function() {
    gulp.src(['gulpfile.js', './test/**/*'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
  });

  gulp.task('default', ['jshint']);
})();