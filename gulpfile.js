'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var ftp = require('gulp-ftp');
//var ftp = require( 'vinyl-ftp' );

gulp.task('runSass', function() {
    return gulp.src('develop/scss/**/*.scss')
        .pipe(sass())
        .pipe(plumber())
        .pipe(gulp.dest('website/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'website'
        }
    })
});

gulp.task('watch', function (){
    gulp.watch('develop/scss/**/*.scss', ['runSass']);
    gulp.watch('website/*.html', browserSync.reload);
    gulp.watch('website/js/**/*.js', browserSync.reload);
});

gulp.task('default', function (callback) {
    runSequence(['runSass','browserSync', 'watch'], callback)
});

gulp.task('ftp', function () {
    return gulp.src('website/**/*')
        .pipe(ftp({
            host: 'user50713.vs.easily.co.uk',
            user: 'user50713',
            pass: 'GKEC5FhV2788Gz',
            remotePath: '/website/pp/campus'
        }))
        .pipe(gutil.noop());
});



//
///** Configuration **/
//var user = process.env.FTP_USER;
//var password = process.env.FTP_PWD;
//var host = 'your hostname or ip address';
//var port = 21;
//var localFilesGlob = ['website/**/*'];
//var remoteFolder = '/website/pp/campus';
//
//
//// helper function to build an FTP connection based on our configuration
//function getFtpConnection() {
//    return ftp.create({
//        host: 'user50713.vs.easily.co.uk',
//        user: 'user50713',
//        port: port,
//        pass: 'GKEC5FhV2788Gz',
//        password: password,
//        parallel: 5,
//        log: gutil.log
//    });
//}
//
///**
// * Deploy task.
// * Copies the new files to the server
// *
// * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
// */
//gulp.task('ftp-deploy', function(){
//    var conn = getFtpConnection();
//    return gulp.src(localFilesGlob, { base: '.', buffer: false })
//        .pipe(conn.newer(remoteFolder)) // only upload newer files
//        .pipe(conn.dest(remoteFolder));
//});
//
///**
// * Watch deploy task.
// * Watches the local copy for changes and copies the new files to the server whenever an update is detected
// *
// * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
// */
//gulp.task('ftp-deploy-watch', function(){
//    var conn = getFtpConnection();
//    gulp.watch(localFilesGlob)
//            .on('change', function(event) {
//                console.log('Changes detected! Uploading file "' + event.path + '", ' + event.type);
//                return gulp.src( [event.path], { base: '.', buffer: false } )
//                        .pipe(conn.newer(remoteFolder)) // only upload newer files
//                        .pipe(conn.dest(remoteFolder));
//            });
//});




