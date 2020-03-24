let gulp = require('gulp');
    posthtml = require('gulp-posthtml');
    inline = require('gulp-inline-source');
 
gulp.task('html', () => {
  return gulp.src('src/pages/*.html')
    .pipe(posthtml())
    .pipe(inline())
    .pipe(gulp.dest('dist'));
})