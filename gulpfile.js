var gulp        = require('gulp'),
	sass        = require('gulp-sass'),
    pug         = require('gulp-pug'),
	connect     = require('gulp-connect'),
    del         = require('del'),
    livereload  = require('gulp-livereload'),
    runSequence = require('run-sequence'),
    ghPages     = require('gulp-gh-pages');

gulp.task('default', ['connect', 'build', 'watch']);

gulp.task('connect', function() {
	connect.server({
    	root: ['./build'],
        port: 3700,
        livereload: true,
        directoryListing: true
  	});
});


gulp.task('sass', function() {
    gulp.src('./dev/assets/css/**/*.sass')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/assets/css/'));
});

gulp.task('html', function() {
    return gulp.src('./dev/**/*.pug')
        .pipe(pug({}))
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    return gulp.src('./dev/assets/js/**/*.js')
        .pipe(gulp.dest('./build/assets/js'))
        .pipe(connect.reload());
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./dev/**/*.js', ['js']);
    gulp.watch('./dev/**/*.pug', ['html']);
    gulp.watch('./dev/**/*.sass', ['sass']);

});


/**
 *  Build
 */
gulp.task('build', function(cb) {
    runSequence('clean', ['move'], ['sass'], ['js'], ['html'], cb);

});

/**
 *  Clean
 */
gulp.task('clean', function() {
    return del.sync(['build']);
});

/**
 *  MOVE
 */
var filesToMove = [
    './dev/**/*.svg'
];

gulp.task('move', function() {
    gulp.src(filesToMove, { base: './dev' })
        .pipe(gulp.dest('./build/'))
});

/* Deploy GH-Pages*/
gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});
