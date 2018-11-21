"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const gulpcli = require("gulp-cli");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require('gulp-uglify-es').default;
const webpack = require("webpack");
const webpackconfig = require("./webpack.config.js");
const webpackstream = require("webpack-stream");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./_site/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del(["./_site/js/", "./_site/stylesheets/"]);
}

// CSS task
function css() {
  return gulp
    .src("./stylesheets/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("./_site/stylesheets/css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./_site/stylesheets/css/"))
    .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
  return gulp
    .src(["./js/**/*", "./gulpfile.js"])
    .pipe(plumber())
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src(["./js/"])
      .pipe(plumber())
      //.pipe(webpackstream(webpackconfig), webpack)
      .pipe(uglify())
      // folder only, filename is specified in webpack config
      .pipe(gulp.dest("./_site/js/"))
      .pipe(browsersync.stream())
  );
}

// Jekyll
function jekyll() {
  return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
}

// Watch files
function watchFiles() {
  gulp.watch("./stylesheets/scss/**/*", css);
  gulp.watch("./js/**/*", gulp.series(scriptsLint, scripts));
  gulp.watch(
    [
      "./_includes/**/*",
      "./_layouts/**/*"
    ],
    gulp.series(jekyll, browserSyncReload)
  );
}

// Tasks
gulp.task("css", css);
gulp.task("js", gulp.series(scriptsLint, scripts));
gulp.task("jekyll", jekyll);
gulp.task("clean", clean);

// build
gulp.task(
  "build",
  gulp.series(clean, gulp.parallel(css, jekyll, "js"))
);

// watch
gulp.task("watch", gulp.parallel(watchFiles, browserSync));