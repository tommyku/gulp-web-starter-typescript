var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var jade = require('gulp-jade');

gulp.task('jade', function(){
  gulp.src(['src/jade/**/*.jade'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('.'))
});

gulp.task('styles', function(){
  gulp.src(['src/sass/**/*.sass'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass({ indentedSyntax: true }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('css/'))
});

gulp.task('scripts', function(){
  return gulp.src('src/coffee/**/*.coffee')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('js/'))
});

gulp.task('publish', function(){
  gulp.src(['index.html'], { base: '.' })
    .pipe(gulp.dest('./publish'));
  gulp.src(['css/**/*.css'], { base: 'css' })
    .pipe(gulp.dest('./publish/css'));
  gulp.src(['js/**/*.js'], { base: 'js' })
    .pipe(gulp.dest('./publish/js'));
  gulp.src(['res/**/*'], { base: 'res' })
    .pipe(gulp.dest('./publish/res'));
  gulp.src(['bower_components/**/*'], { base: 'bower_components' })
    .pipe(gulp.dest('./publish/bower_components'));
});

gulp.task('default', function(){
  gulp.watch("src/jade/**/*.jade", ['jade']);
  gulp.watch("src/sass/**/*.sass", ['styles']);
  gulp.watch("src/coffee/**/*.coffee", ['scripts']);
});
