var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var connect = require('gulp-connect');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task('html', function(){
  gulp.src(['src/html/**/*.pug'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('output'))
    .pipe(gulpif(argv.live, connect.reload()))
});

gulp.task('css', ['scss', 'sass']);

gulp.task('scss', function(){
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

gulp.task("js", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("output/js/"));
});

//gulp.task('js', function(){
  //return tsProject().src()
    //.pipe(tsProject())
    //.js
    //.pipe(gulp.dest('output/js/'))
    //.pipe(gulpif(argv.live, connect.reload()))
//});

gulp.task('publish', ['build'], function(){
  gulp.src(['index.html'], { base: '.' })
    .pipe(gulp.dest('./output'));
  gulp.src(['css/**/*.css'], { base: 'css' })
    .pipe(gulp.dest('./output/css'));
  gulp.src(['js/**/*.js'], { base: 'js' })
    .pipe(gulp.dest('./output/js'));
  gulp.src(['bower_components/**/*'], { base: 'bower_components' })
    .pipe(gulp.dest('./output/bower_components'));
});

gulp.task('build', ['html', 'css', 'js']);

gulp.task('serve', function() {
  connect.server({
    root: 'output',
    port: 3000,
    livereload: argv.live
  });
});

gulp.task('default', ['build', 'serve'], function(){
  gulp.watch("src/html/**/*.pug", ['html']);
  gulp.watch("src/css/**/*.sass", ['css']);
  gulp.watch("src/css/**/*.scss", ['css']);
  gulp.watch("src/js/**/*.ts", ['js']);
});
