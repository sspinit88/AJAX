/*-----------------------------------------*/
/*                Packages                 */
/*-----------------------------------------*/
const
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    gcmq = require('gulp-group-css-media-queries'),
    smartgrid = require('smart-grid'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin');

/*-----------------------------------------*/
/*               Directories               */
/*-----------------------------------------*/

const config = {
    root: './src/',
    html: {
        src: '*.html'
    },
    css: {
        watch: 'pre/**/*.scss',
        src: 'pre/**/styles.scss',
        dest: 'css'
    },
    js: {
        watch: 'pre/**/*.js',
        src: 'pre/**/script.js',
        dest: 'js'
    },
    smartgrid: {
        src: 'smartgrid.js',
        dest: 'pre'
    },
    spritePng: {
        src: './src/pre/preimg/png/*.png',
        distImg: './src/pre/preimg/minification',
        imgLocation: '../img/sprite.png',
        distFile: './src/pre'
    },
    spriteSvg:{
        src: './src/pre/preimg/svg/*.svg',
        distSvg: '../img/sprite.svg',
        distFile: './src/pre/_spriteSvg.scss',
        template: './src/pre/template/_sprite_template.scss',
    },
    minImg: {
        src: 'pre/preimg/minification/*.{jpg,jpeg,png,gif}',
        dest: 'img',
    },
};

/*-----------------------------------------*/
/*          Вспомогательные пути           */
/*-----------------------------------------*/

let scripts = [
    config.root + config.js.src
    // './src/pre/es6/script.js',
    // './src/pre/es6/menuHeader.js',
    // './src/pre/es6/subList.js',
    // './src/pre/es6/menuFix.js'
];

let copyScripts = [
    './src/pre/libs/jquery/dist/jquery.min.js',
    // './src/pre/libs/slick-carousel/slick/slick.min.js',
    // './src/pre/libs/fancybox/dist/jquery.fancybox.min.js',
    // './src/pre/libs/nouislider/distribute/nouislider.js',
    // './src/pre/libs/jquery.form-styler/dist/jquery.formstyler.min.js',
    // './src/pre/libs/jquery-validation/dist/jquery.validate.js',
    // './src/pre/libs/svg4everybody/dist/svg4everybody.js',
];

let copyCss = [
    './src/pre/libs/normalize.css/normalize.css',
    // './src/pre/libs/slick-carousel/slick/slick.css',
    // './src/pre/libs/fancybox/dist/jquery.fancybox.min.css',
    // './src/pre/libs/nouislider/distribute/nouislider.min.css',
    // './src/pre/libs/jquery.form-styler/dist/jquery.formstyler.css',
];

/*-----------------------------------------*/
/*           Работа с CSS и JS             */
/*-----------------------------------------*/

gulp.task('buildCss', function () {
    gulp.src(config.root + config.css.src)
        .pipe(sourcemaps.init())
        .on('error', console.error.bind(console))
        .pipe(sass().on('error', sass.logError))
        .pipe(gcmq())
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.root + config.css.dest))
        .pipe(browserSync.reload({
                stream: true
            })
        );
});

gulp.task('buildJs', function () {
    gulp.src(scripts)
        .pipe(sourcemaps.init())
        .on('error', console.error.bind(console))
        .pipe(concat('scripts.min.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify({
            toplevel: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.root + config.js.dest))
        .pipe(browserSync.stream());
});

/*-----------------------------------------*/
/*    Спрайты и минификация изображений    */
/*-----------------------------------------*/

// создание png-sprite
gulp.task('png', function () {
    let spriteData = gulp.src(
        config.spritePng.src
    ).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_spritePng.scss',
        cssFormat: 'css',
        imgPath: config.spritePng.imgLocation,
        padding: 100,
    }));
    spriteData.img.pipe(gulp.dest(config.spritePng.distImg));
    spriteData.css.pipe(gulp.dest(config.spritePng.distFile));
});

// минификация img, исключая svg
gulp.task('minImg', function () {
    return gulp.src(config.root + config.minImg.src)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(config.root + config.minImg.dest));
});

/*-----------------------------------------*/
/*  Генерация стилей сетки smartgrid.scss  */
/*  (только при наличии smartgrid.js)      */
/*-----------------------------------------*/

gulp.task('grid', function () {
    delete require.cache[require.resolve('./' + config.smartgrid.src)];
    let options = require('./' + config.smartgrid.src);
    smartgrid(config.root + config.smartgrid.dest, options);
});

/*-----------------------------------------*/
/*                                         */
/*-----------------------------------------*/

// копирование js-файлов из bower
/*
gulp.task('copyJs', function(){
    gulp.src(copyScripts)
        .pipe(gulp.dest('./src/js'))
});

// копирование css-файлов из bower
gulp.task('copyCss', function(){
    gulp.src(copyCss)
        .pipe(gulp.dest('./src/css'))
});
*/

/*-----------------------------------------*/
/*   Генерация продакшен версии проекта    */
/*-----------------------------------------*/

gulp.task('public', function () {
    gulp.src([
        './src/**',
        '!./src/pre/**'
    ])
        .pipe(gulp.dest('./public'))
});

/*-----------------------------------------*/
/*объединяем buildCss и buildJs в один таск*/
/*-----------------------------------------*/

gulp.task('build', ['buildCss', 'buildJs']);

/*-----------------------------------------*/
/*                 watch                   */
/*-----------------------------------------*/

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.root + config.css.watch, ['buildCss']);
    gulp.watch(config.root + config.js.watch, ['buildJs']);
    gulp.watch(config.root + config.html.src, browserSync.reload);
    gulp.watch('./' + config.smartgrid.src, ['grid']);
});

/*-----------------------------------------*/
/*               browserSync               */
/*-----------------------------------------*/

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: config.root
        },
        // proxy: "first",
        // tunnel: true
    });
});

/*-----------------------------------------*/
/*                 The End                 */
/*-----------------------------------------*/