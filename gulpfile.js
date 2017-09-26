const gulp = require('gulp');
/*
  -- 常用的方法 --
  gulp.task - Define tasks
  gulp.src - Point to files to use
  gulp.dest - Points to folder to output
  gulp.watch - Watch files and folders for changes
*/

// 调用方法打印
gulp.task('message', function () {
    return console.log('Gulp is running...');
});

// 拷贝所有的html文件
const htmlmin = require('gulp-htmlmin');

gulp.task('copyHtml', function () {
    gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true, // 去掉空格
            removeComments: true, // 去掉注释
            removeAttributeQuotes: true // 去掉属性引号
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true })); // 每次执行完毕,刷新一下浏览器(实现同步);
});

// 压缩图片
const imagemin = require('gulp-imagemin');

gulp.task('imageMin', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({ stream: true })) // 每次执行完毕,刷新一下浏览器(实现同步)
);

// 合并scss
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');

gulp.task('sass', function () {
    gulp.src('src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({ stream: true })); // 每次执行完毕,刷新一下浏览器(实现同步);
});

// Scripts
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
// require('babel-core');
// require('babel-preset-es2015');

gulp.task('scripts', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(babel({
            "presets": [
                "es2015"
            ]
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({ stream: true })); // 每次执行完毕,刷新一下浏览器(实现同步);
});

gulp.task('default', ['message', 'copyHtml', 'imageMin', 'sass', 'scripts']);

// serve
const browserSync = require('browser-sync');

gulp.task('watch', function () {
    browserSync({
        server: { baseDir: ['dist'] }
    }, function (err, bs) {
        console.log(bs.options.getIn(["urls", "local"]));
    });

    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/images/*', ['imageMin']);
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/*.html', ['copyHtml']);
});
