var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (cb) {
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on("close", function () {
            cb();
        });
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
    browserSync.init(null, {
        server: {
            baseDir: "_site"
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    gulp.src('_scss/main.scss')
        .pipe(sass({includePaths: ['scss']}))
        .pipe(prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch("_scss/*.scss", ['sass']);
    gulp.watch(["_layouts/*.html", "_posts/*.md"], ['jekyll-build', browserSync.reload]);
});

/**
 * Default task, running just `gulp` will compile the sass, compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['sass', 'browser-sync', 'watch']);
