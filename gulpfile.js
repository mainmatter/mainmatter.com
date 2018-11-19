var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');
    watch = require('gulp-watch');

gulp.task('js', function(){
    return gulp.src('./js/*.js')
        .pipe(gp_concat('main.js'))
        .pipe(gulp.dest('./js/'))
        .pipe(gp_rename('main.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./js/'));
});

gulp.task('watch:js', function () {
    gulp.watch('./js/*.js', ['js']);
});

gulp.task('watch:css', function () {
    gulp.watch('./stylesheets/css/*.css', ['css']);
});

gulp.task('tasks', gulp.series('js', 'watch:js', 'watch:css'))