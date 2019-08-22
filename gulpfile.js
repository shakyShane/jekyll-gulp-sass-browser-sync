const { src, dest, series, watch, task, parallel } = require('gulp'),
  browserSync = require('browser-sync'),
  sass        = require('gulp-sass'),
  prefix      = require('gulp-autoprefixer'),
  cp          = require('child_process'),
  sourcemaps  = require('gulp-sourcemaps'),
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


function jekyll_scss() {
  return src('_scss/main.scss')
    .pipe(sass({
      includePaths: ['scss'],
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
  watch('_scss/*.scss', jekyll_scss)
  watch(['*.html', '_layouts/*.html', '_posts/*'], series(jekyll_build, browserSyncReload));
}


task("browser_sync", browser_sync);
task("jekyll_scss", jekyll_scss);
task("jekyll_build", jekyll_build);
task("default", parallel(browser_sync));
