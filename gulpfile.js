const { src, dest, series, watch } = require('gulp'),
  browserSync = require('browser-sync'),
  sass        = require('gulp-sass'),
  prefix      = require('gulp-autoprefixer'),
  sourcemaps  = require('gulp-sourcemaps');

const config = {
  src: '_scss/',
  build: 'css/',
};

function jekyll() {
  return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
}

/**
 * Rebuild Jekyll & do page reload
 */
function jekyllReload(done) {
  browserSync.reload();
  watch(config.src, jekyllSass)
  done();
}
// gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
//   browserSync.reload();
// });

/**
 * Wait for jekyll-build, then launch the Server
 */

function jekyllSass() {
  return src(config.src)
    // .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compact',
      includePaths: [
        'node_modules',
      ]
    }))

    .pipe(prefix({
      browsers: ['last 3 versions']}))
    .pipe(sourcemaps.write())
    .pipe(dest(config.build))
    .pipe(browserSync.stream())
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: config.pugout
    },
    port: 4000
  });
  watch(config.src, jekyllSass)
  watch(config.build, jekyllReload)
  done();
}
// gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
//   browserSync({
//     server: {
//       baseDir: '_site'
//     }
//   });
// });

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
// gulp.task('sass', function () {
//   return gulp.src('_scss/main.scss')
//   .pipe(sass({
//     includePaths: ['scss'],
//     onError: browserSync.notify
//   }))
//   .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//   .pipe(gulp.dest('_site/css'))
//   .pipe(browserSync.reload({stream:true}))
//   .pipe(gulp.dest('css'));
// });

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
// gulp.task('watch', function () {
//   gulp.watch('_scss/*.scss', ['sass']);
//   gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
// });

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
// gulp.task('default', ['browser-sync', 'watch']);

const build = series(jekyllSass, jekyll);
exports.build = build;

exports.default = series(serve);
