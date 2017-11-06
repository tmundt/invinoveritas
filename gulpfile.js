var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var notify = require('gulp-notify');
var bower = require('gulp-bower');
var nodemon = require('gulp-nodemon');
//var livereload = require('gulp-livereload');

var paths = {
    sass: ['./public/assets/scss/**/*.scss'],
    css: ['./public/assets/css/**/*.css'],
    javascript: ['./public/assets/js/**/*.js'],
    bowerDir: './public/lib'
}

gulp.task('sass', function() {
   gulp.src(paths.sass)
       .pipe(sass().on('error', sass.logError))
       .pipe(gulp.dest('./public/assets/css/'));
});

gulp.task('icons', function() {
    return gulp.src(paths.bowerDir + '/font-awesome/fonts/**/*.*')
        .pipe(gulp.dest('./public/assets/fonts'));
});

gulp.task('nodemon', function() {
    nodemon({
        script: 'server.js',
        ext: 'js scss html css'
    })
        .on('start', ['index', 'watch'])
        .on('change', ['watch'])
        .on('restart', function() {
            console.log('restarted');
        })

})

// Inject all necessary files into index.html
gulp.task('index', function() {
    var target = gulp.src('./public/index.html');
    var files = bowerFiles();
    return target
        .pipe(inject(
            gulp.src(paths.javascript,
                {
                    read: false,
                    ignorePath: 'public',
                    addRootSlash: false
                }), {
                relative: true,
                name: 'scripts'
            }
        ))
        .pipe(gulp.dest('./public'))
        .pipe(inject(
            gulp.src(paths.css,
                {
                    read: false
                }),
            {
                relative: true,
                name: 'styles'
            }
        ))
        .pipe(notify('GULP: injected CSS'))
        .pipe(gulp.dest('./public'))
        .pipe(inject(
            gulp.src(files, {
                read: false
            }),
            {
                ignorePath: '/public',
                addRootSlash: false
            }
        ))
        .pipe(gulp.dest('./public'));
        //.pipe(notify('GULP: injected bower_components'))
        //.pipe(livereload());
});


// Task for watching changes of js and css-files
gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    //livereload.listen();
    gulp.watch([
        paths.javascript,
        paths.css
    ], ['index']);

});

//gulp.task('default', ['sass', 'index']);
gulp.task('default', ['sass','index', 'icons','watch']);
//gulp.task('default', ['icons', 'nodemon']);