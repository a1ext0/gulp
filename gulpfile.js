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

gulp.task('scss', ()=> {
  return gulp
  .src('dev/scss/**/*.scss', {since: gulp.lastRun('scss')})
  .pipe(cached('scss'))
  .pipe(remember('scss'))
  .pipe(sass())
  .pipe(
    autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    })
  )
  .pipe(cssnano())
  .pipe(debug({title: 'scss'}))
  .pipe(concat('all.css'))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('serve', ()=> {
  bs.init({
    server: 'dist'
  });
  bs.watch('dist/**/*.*').on('change', bs.reload);
});

gulp.task('watch', ()=> {
  gulp.watch('dev/scss/**/*.scss', gulp.series('scss')).on('unlink',
  (filepath)=> {
    remember.forget('scss', path.resolve(filepath));
    delete cached.caches.scss[path.resolve(filepath)];
  });
});

gulp.task('dev', gulp.parallel('scss', gulp.parallel('serve', 'watch')));
