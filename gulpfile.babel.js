import gulp from 'gulp';
import eslint from 'gulp-eslint';

/**
 * Eslint our code base and fail on error
 **/
function lint() {
  return gulp.src(['src/*.js']).pipe(eslint()).pipe(eslint.formatEach()).pipe(eslint.failAfterError());
}

gulp.task('lint', gulp.series(lint));
