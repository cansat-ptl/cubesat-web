let gulp = require('gulp');
    posthtml = require('gulp-posthtml');
    inline = require('gulp-inline-source');
    sass = require('gulp-sass');
    del = require('del');
    htmlmin = require('gulp-htmlmin');
    serve = require('gulp-serve');

let minify_config = {
  collapseWhitespace: true,
  minifyJS: true,
  minifyCSS: true
}

gulp.task('sass', () => {
  return gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js', () => {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('icons', () => {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
      .pipe(gulp.dest('dist/webfonts/'));
});

gulp.task('img', () => {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'));
})

gulp.task('html', () => {
  return gulp.src('src/pages/*.html')
    .pipe(posthtml())
    .pipe(gulp.dest('dist'));
})

gulp.task('minimize', () => {
  return gulp.src('dist/*.html')
    .pipe(inline())
    .pipe(htmlmin(minify_config))
    .pipe(gulp.dest('dist'));
})

gulp.task('clean', () => {
     return del(['dist/css', 'dist/js'], {force:true});
});

gulp.task('default', gulp.series('sass', 'js', 'icons', 'img', 'html', 'minimize', 'clean'));

gulp.task('server', serve({
  root: 'dist',
  port: 8080
}));
gulp.task('serve', gulp.series('default', 'server'));