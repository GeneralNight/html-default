// Load modules
const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// SASS

function compliaSass() {
  return gulp
    .src("css/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("css/"))
    .pipe(browserSync.stream());
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// JS Main

function gulpJS() {
  return gulp
    .src(["js/main/*.js"])
    .pipe(concat("main.js"))
    .pipe(
      babel({
        presets: ["env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("js/"))
    .pipe(browserSync.stream());
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// SASS Plugins

function pluginsJs() {
  return gulp
    .src(["node_modules/jquery/dist/jquery.min.js"])
    .pipe(concat("plugins.js"))
    .pipe(gulp.dest("js/"))
    .pipe(browserSync.stream());
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Live Browser

function browser() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Minify images
function imageMin() {
  return gulp
    .src("img/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 30, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(gulp.dest("img/compact"));
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Watch

function watch() {
  gulp.watch("css/scss/**/*.scss", compliaSass);
  gulp.watch(["js/main/**/*.js"], gulpJS);
  gulp.watch(["js/plugins/**/*.js"], pluginsJs);
  gulp.watch(["*.html"]).on("change", browserSync.reload);
}

exports.compliaSass = compliaSass;
exports.gulpJS = gulpJS;
exports.pluginsJs = pluginsJs;
exports.browser = browser;
exports.watch = watch;
exports.imageMin = imageMin;

exports.default = gulp.parallel(watch, browser, compliaSass, gulpJS, pluginsJs);
