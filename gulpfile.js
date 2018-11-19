var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

gulp.task('jss', function(){
    return gulp.src('./js/*.js')
        .pipe(gp_concat('main.js'))
        .pipe(gulp.dest('./js/'))
        .pipe(gp_rename('main.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./js/'));
});
