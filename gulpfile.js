const gulp = require("gulp");
posthtml = require("gulp-posthtml");
inline = require("gulp-inline-source");
sass = require("gulp-sass");
del = require("del");
htmlmin = require("gulp-htmlmin");
connect = require("gulp-connect");
webpack = require('webpack');
webpackStream = require("webpack-stream");
webpack_conf = require('./webpack.config.js');

let minify_config = {
  collapseWhitespace: true,
  minifyJS: true,
  minifyCSS: true
};

gulp.task("sass", () => {
  return gulp
    .src("src/css/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("webpack", () => {
  return webpackStream(webpack_conf,webpack).pipe(gulp.dest('./dist/js'));
});
gulp.task("copy_js", () => {
    return gulp.src('./src/js/widgets.js')
    .pipe(gulp.dest('dist/js'));
})

gulp.task("icons", () => {
  return gulp
    .src("node_modules/@fortawesome/fontawesome-free/webfonts/*")
    .pipe(gulp.dest("dist/webfonts/"));
});

gulp.task("img", () => {
  return gulp.src("src/images/*").pipe(gulp.dest("dist/images"));
});

gulp.task("html", () => {
  return gulp
    .src("src/pages/*.html")
    .pipe(posthtml())
    .pipe(gulp.dest("dist"));
});

gulp.task("minimize", () => {
  return gulp
    .src("dist/*.html")
    .pipe(inline())
    .pipe(htmlmin(minify_config))
    .pipe(gulp.dest("dist"));
});

gulp.task("clean", () => {
  return del(["dist/css", "dist/js"], { force: true });
});

gulp.task(
  "default",
  gulp.series("sass", "webpack", "copy_js", "icons", "img", "html", "minimize", "clean")
);

gulp.task("serve", async function() {
  connect.server({
    root: "./dist",
    port: 8080,
    livereload: true
  });
  gulp.watch("./src/**/*", gulp.series("default"));
});
