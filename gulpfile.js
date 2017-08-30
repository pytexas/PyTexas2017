var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require("gulp-concat");
var less = require('gulp-less');
var rollup = require('rollup').rollup;
var buble = require('rollup-plugin-buble');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');

var build_tasks = ['build-js', 'build-css'];

gulp.task('build-js', function () {
  return rollup({
    entry: './static/nac/nac.js',
    plugins: [
      resolve({ jsnext: true }),
      commonjs(),
      buble()
    ],
    external: ['vue', 'vue-router', 'vue-material']
  }).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      dest: './static/dist/nac.js',
      globals: {
        "vue": 'Vue',
        "vue-router": 'VueRouter',
        "vue-material": 'VueMaterial'
      },
    });
  });
});

gulp.task('build-css', function () {
  return gulp.src("static/nac/**/*.less")
    .pipe(plumber())
    .pipe(less({paths: ['static/less']}))
    .pipe(concat('nac.css'))
    .pipe(gulp.dest("static/dist"));
});

gulp.task('watch', build_tasks, function () {
  gulp.watch("static/nac/**/*.js", ['build-js']);
  gulp.watch("static/**/*.less", ['build-css']);
});

gulp.task('default', build_tasks);
