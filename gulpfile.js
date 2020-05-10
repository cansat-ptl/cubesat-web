const gulp = require("gulp");
posthtml = require("gulp-posthtml");
inline = require("gulp-inline-source");
sass = require("gulp-sass");
del = require("del");
htmlmin = require("gulp-htmlmin");
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

gulp.task("fa_icons", () => {
  return gulp
    .src("node_modules/@fortawesome/fontawesome-free/webfonts/*")
    .pipe(gulp.dest("dist/webfonts/"));
});

gulp.task("leaflet_img", () => {
  return gulp
    .src("node_modules/leaflet/dist/images/*")
    .pipe(gulp.dest("dist/images/"));
});
gulp.task("leaflet_fullscreen", () => {
  return gulp
    .src("node_modules/leaflet-fullscreen/dist/*.png")
    .pipe(gulp.dest("dist"));
});

gulp.task("img", () => {
  return gulp.src("src/images/*").pipe(gulp.dest("dist/images"));
})

gulp.task("docs", () => {
  return gulp.src("src/docs/*").pipe(gulp.dest("dist/docs"));
})

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
  return del(["dist/css", "dist/js/docs.js", "dist/js/widgets.js"], { force: true });
});

gulp.task("assets", gulp.series("fa_icons", "leaflet_img", "leaflet_fullscreen"));
gulp.task("modifiable", gulp.series("sass", "webpack", "copy_js", "img", "docs", "html", "minimize", "clean"));

gulp.task(
  "default",
  gulp.series("assets", "modifiable")
);
gulp.task('watch', async () => gulp.watch("./src/**/*", gulp.series("modifiable")));
