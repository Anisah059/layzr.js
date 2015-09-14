import packageJSON from './package.json'

import gulp from 'gulp'
import babel from 'gulp-babel'
import connect from 'gulp-connect'
import header from 'gulp-header'
import plumber from 'gulp-plumber'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'
import notifier from 'node-notifier'

const onError = (error) => {
  notifier.notify({ 'title': 'Error', 'message': 'Compilation failed.' })
  console.log(error)
}

const attribution = [
  '/*!',
  ' * Layzr.js <%= pkg.version %> - <%= pkg.description %>',
  ' * Copyright (c) 2015 <%= pkg.author %> - http://callmecavs.github.io/layzr.js/',
  ' * License: <%= pkg.license %>',
  ' */',
  '',
  ''
].join('\n')

gulp.task('js', () => {
  return gulp.src('src/layzr.js')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({ moduleId: 'Layzr', modules: 'umd' }))
    .pipe(header(attribution, { pkg: packageJSON }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename('layzr.min.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('server', () => {
  return connect.server({
    root: './dist',
    port: 3000
  })
})

gulp.watch('src/layzr.js', ['js'])
gulp.task('default', ['js', 'server'])
