const gulp = require('gulp')
const connect = require('gulp-connect')
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const stylus = require('gulp-stylus')
const nib = require('nib')
const koutoSwiss = require('kouto-swiss')
const shell = require('gulp-shell')
const standard = require('gulp-standard')
const surge = require('gulp-surge')

const paths = {
  html: './src/pug/**/*',
  css: './src/stylus/**/*',
  js: './src/js/**/*'
}

gulp.task('connect', () => {
  connect.server({
    root: './docs',
    port: 5001,
    livereload: true
  })
})

gulp.task('standard', () => {
  gulp.src(paths.js)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: false,
      quiet: true
    }))
    .pipe(connect.reload())
})

gulp.task('js', () => {
  gulp.src('./src/js/*.js', {read: false})
    .pipe(plumber())
    .pipe(shell([
      './node_modules/parcel-bundler/bin/cli.js build ./src/js/*.js --out-dir ./docs/assets/js'
    ]))
    .pipe(connect.reload())
})

gulp.task('stylus', () => {
  gulp.src('./src/stylus/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      compress: false,
      use: [nib(), koutoSwiss()],
      import: ['nib', 'kouto-swiss']
    }))
    .pipe(gulp.dest('./docs/assets/css'))
    .pipe(connect.reload())
})

gulp.task('pug', () => {
  gulp.src('./src/pug/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('./docs'))
    .pipe(connect.reload())
})

gulp.task('deploy', [], () => {
  return surge({
    project: './docs',
    domain: 'eleicoes2018.surge.sh'
  })
})

gulp.task('watch', () => {
  gulp.watch(paths.css, ['stylus'])
  gulp.watch(paths.html, ['pug'])
  gulp.watch(paths.js, ['js'])
})

gulp.task('build', ['pug', 'stylus', 'standard', 'js'])
gulp.task('server', ['build', 'connect', 'watch'])
