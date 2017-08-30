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
    input: './frontend/app/pytx.js',
    plugins: [
      resolve({ jsnext: true }),
      commonjs(),
      buble()
    ],
    external: ['vue', 'vue-router', 'vue-material']
  }).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      file: './frontend/2017-dist/pytx.js',
      globals: {
        "vue": 'Vue',
        "vue-router": 'VueRouter',
        "vue-material": 'VueMaterial'
      },
    });
  });
});

gulp.task('build-css', function () {
  return gulp.src("frontend/app/**/*.less")
    .pipe(plumber())
    .pipe(less({paths: ['frontend/less']}))
    .pipe(concat('pytx.css'))
    .pipe(gulp.dest("frontend/2017-dist"));
});

gulp.task('watch', build_tasks, function () {
  gulp.watch("frontend/app/**/*.js", ['build-js']);
  gulp.watch("frontend/**/*.less", ['build-css']);
});

gulp.task('default', build_tasks);
