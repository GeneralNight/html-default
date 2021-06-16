// Load modules
const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// SASS

function compliaSass() {
  return gulp
    .src("assets/css/scss/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("assets/css/"))
    .pipe(browserSync.stream());
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// JS Main

function gulpJS() {
  return gulp
    .src(["assets/js/main/*.js"])
    .pipe(concat("main.js"))
    .pipe(
      babel({
        presets: ["env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("assets/js/"))
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
    .pipe(gulp.dest("assets/js/"))
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
    .src(["assets/img/*", "!assets/img/compact/", "!assets/img/webp/"])
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 20, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest("assets/img/compact/"));
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Images WEBP

function webP() {
  return gulp
    .src(["assets/img/*", "!assets/img/webp/", "!assets/img/compact/"])
    .pipe(webp())
    .pipe(gulp.dest("assets/img/webp/"));
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Watch

function watch() {
  gulp.watch("assets/css/scss/**/*.scss", compliaSass);
  gulp.watch(["assets/js/main/**/*.js"], gulpJS);
  gulp.watch(["assets/js/plugins/**/*.js"], pluginsJs);
  gulp.watch(["*.html"]).on("change", browserSync.reload);
}

exports.compliaSass = compliaSass;
exports.gulpJS = gulpJS;
exports.pluginsJs = pluginsJs;
exports.browser = browser;
exports.watch = watch;
exports.imageMin = imageMin;
exports.webP = webP;

exports.default = gulp.parallel(watch, browser, compliaSass, gulpJS, pluginsJs);
