var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');

gulp.task('html', function(){
  gulp.src(['src/html/**/*.jade'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('output'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('css', function(){
  gulp.src(['src/css/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('output/css/'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('sass', function(){
  gulp.src(['src/css/**/*.sass'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass({ indentedSyntax: true }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('output/css/'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('js', function(){
  return gulp.src('src/js/**/*.coffee')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('output/js/'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('publish', function(){
  gulp.src(['index.html'], { base: '.' })
    .pipe(gulp.dest('./output'));
  gulp.src(['css/**/*.css'], { base: 'css' })
    .pipe(gulp.dest('./output/css'));
  gulp.src(['js/**/*.js'], { base: 'js' })
    .pipe(gulp.dest('./output/js'));
  gulp.src(['bower_components/**/*'], { base: 'bower_components' })
    .pipe(gulp.dest('./output/bower_components'));
});

gulp.task('build', ['html', 'sass', 'css', 'js']);

gulp.task('serve', function() {
  connect.server({
    root: 'output',
    port: 3000,
    livereload: argv.live
  });
});

gulp.task('default', ['build', 'serve'], function(){
  gulp.watch("src/html/**/*.jade", ['html']);
  gulp.watch("src/css/**/*.sass", ['sass']);
  gulp.watch("src/css/**/*.scss", ['css']);
  gulp.watch("src/js/**/*.coffee", ['js']);
});
