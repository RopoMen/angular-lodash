(function() {
  'use strict';

  var gulp = require('gulp');
  var KarmaServer = require('karma').Server;
  var jshint = require('gulp-jshint');

  gulp.task('jshint', function() {
    gulp.src(['gulpfile.js', 'karma.config.js', './test/**/*.js'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
  });

  gulp.task('test', ['jshint'], function() {
	new KarmaServer({
	    configFile: __dirname + '/karma.config.js',
	    singleRun: true
	  }).start();
  });

  gulp.task('default', ['jshint']);
})();