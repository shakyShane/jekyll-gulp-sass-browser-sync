const { src, dest, series, watch, task, parallel } = require('gulp'),
  browserSync = require('browser-sync'),
  sass        = require('gulp-sass'),
  prefix       = require('gulp-autoprefixer'),
  cp          = require('child_process'),
  sourcemaps  = require('gulp-sourcemaps'),
  plumber     = require('gulp-plumber'),
  uglify      = require('gulp-uglify'),
  concat      = require('gulp-concat'),
  jekyll      = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

function jekyll_build() {
  return cp.spawn(
    jekyll , ['build', 'exec'], {stdio: 'inherit'}
  );
};

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function jekyll_js() {
  return src('_javascript/*')
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(dest('javascript'))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); });
}

function jekyll_scss() {
  return src('_scss/main.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'compressed',
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(sourcemaps.write())
    .pipe(dest('_site/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(dest('css'));
}

function browser_sync() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
  watch('_scss/*.scss', series(jekyll_scss, jekyll_build));
  watch('_javascript/*', series(jekyll_js, jekyll_build));
  watch(['*.html', '_layouts/*.html', '_includes/*.html', '_posts/*'], series(jekyll_build, browserSyncReload));
}

task("browser_sync", browser_sync);
task("jekyll_scss", jekyll_scss);
task("jekyll_js", jekyll_js);
task("jekyll_build", jekyll_build);
task("default", parallel(browser_sync));
