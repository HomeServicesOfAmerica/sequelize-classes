import gulp from 'gulp';
import eslint from 'gulp-eslint';

/**
 * Eslint our code base and fail on error
 **/
function lint () {
  return gulp.src( ['src/*.js'] ).pipe( eslint() ).pipe( eslint.failOnError() );
}

gulp.task( 'build', gulp.series( lint ) );