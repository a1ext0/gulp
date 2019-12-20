const gulp = require('gulp');
const sass = require('gulp-sass'); //Компиляция sass и scss
const gulpif = require('gulp-if'); //Условное ветвление прямо в задачах
const newer = require('gulp-newer'); //Пропускает только обновлённые файлы
const autoprefixer = require('gulp-autoprefixer'); //Префиксы для старых браузеров
const cssnano = require('gulp-cssnano'); //Сжатие кода
const bs = require('browser-sync').create(); //css без перезагрузки и многое другое
const debug = require('gulp-debug'); //Вывод дебага в консоль
const concat = require('gulp-concat'); //Соединение нескольких файлов в один
const remember = require('gulp-remember'); //Кэширует файлы прошедшие через него и дополняет поток своим кэшем
const cached = require('gulp-cached'); //Запоминает файлы которые прошли через него и не пропускает дальше
const path = require('path'); //Абсолютные пути
const img = require('gulp-image'); //Абсолютные пути

gulp.task('scss', ()=> {
  return gulp
  .src('dev/scss/**/*.scss')
  .pipe(sass())
  .pipe(
    autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    })
  )
  .pipe(cssnano())
  .pipe(concat('main.css'))
  .pipe(gulp.dest('dist/css'))
  .pipe(bs.stream());
});

gulp.task('appJS', ()=> {
  return gulp
  .src('dev/js/**/*.js')
  //.pipe(concat('main.js'))
  .pipe(gulp.dest('dist/js'))
  .pipe(bs.stream());
});

gulp.task('html', ()=> {
  return gulp
  .src('dev/html/*.html')
  .pipe(gulp.dest('dist/'))
  .pipe(bs.stream());
});

gulp.task('img', ()=> {
  return gulp
  .src('dev/img/*.*')
  // .pipe(img({
  //     pngquant: true,
  //     optipng: true,
  //     zopflipng: true,
  //     jpegRecompress: false,
  //     mozjpeg: true,
  //     guetzli: false,
  //     gifsicle: true,
  //     svgo: true,
  //     concurrent: 10,
  //     quiet: true // defaults to false
  //   }))
  .pipe(gulp.dest('dist/img/'))
  .pipe(bs.stream());
});

gulp.task('serve', ()=> {
  bs.init({
    server: 'dist',
    port: 80,
  });
  bs.watch('dist/**/*.*').on('change', bs.reload);
});

gulp.task('watch', ()=> {
  gulp.watch('dev/scss/**/*.scss', gulp.series('scss'));
  gulp.watch('dev/js/**/*.js', gulp.series('appJS'));
  gulp.watch('dev/html/*.html', gulp.series('html'));
  gulp.watch('dev/img/*.*', gulp.series('img'));
});

gulp.task('dev', gulp.parallel('scss', 'appJS', 'html', 'img',
gulp.parallel('serve', 'watch')));
