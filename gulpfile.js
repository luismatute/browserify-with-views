// gulpfile.js
// Luis Matute
// Feb-15

"use strict";

// Dependencies =================================
	var gulp = require('gulp'),
		connect = require('gulp-connect'),
		watch = require('gulp-watch'),
		sass = require('gulp-ruby-sass'),
		jshint = require('gulp-jshint'),
		uglify = require('gulp-uglify'),
		notify = require('gulp-notify'),
		minifyHTML = require('gulp-minify-html'),
		pngquant = require('imagemin-pngquant'),
		imagemin = require('gulp-imagemin'),
		browserify = require('gulp-browserify'),
		concat = require('gulp-concat'),
		fs = require('fs');

// Webserver Tasks ==============================
	gulp.task('webserver', function () {
		var opt = {
			root: 'dist',
			livereload: true,
			port: 1234,
			host: 'localhost'
		};
		connect.server(opt);
	});

// LiveReload Task ==============================
	gulp.task('livereload', function() {
		var files = ['./dist/assets/css/**/*.css','./dist/assets/js/**/*.js','./dist/**/*.html'];
		return gulp
			.src(files)
			.pipe(watch(files))
			.pipe(connect.reload());
	});

// Views Task ===================================
	gulp.task('views', function() {
		var opts = {};
		gulp
			.src('./src/index.html')
			.pipe(minifyHTML(opts))
			.pipe(gulp.dest('./dist/'));
		return gulp
			.src('./src/views/**/*')
			.pipe(minifyHTML(opts))
			.pipe(gulp.dest('./dist/views/'))
			.pipe(connect.reload());
	});

// Images Task ==================================
	gulp.task('imagemin', function() {
		return gulp.src('./src/assets/img/**/*')
				.pipe(imagemin({
					progressive: true,
					svgoPlugins: [{removeViewBox: false}],
					use: [pngquant()]
				}))
				.pipe(gulp.dest('./dist/assets/img/'));
	});

// SASS Task ====================================
	gulp.task('sass', function() {
		var opt = { style: 'compressed', trace: true };
		// gulp
		// 	.src('src/assets/sass/master.scss')
		// 	.pipe(sass())
		// 	.pipe(gulp.dest('dist/assets/css/'))
		// 	.pipe(notify('Styles Task Completed'))
		return sass('./src/assets/sass/master.scss', opt)
			.pipe(gulp.dest('dist/assets/css/'))
			.pipe(notify('Styles Task Completed'))
	});

// JS Task ======================================
	gulp.task('lint', function() {
		return gulp
			.src('./src/assets/**/*.js')
			.pipe(jshint())
			.pipe(jshint.reporter('default'));
	});
	gulp.task('js' ,function() {
		return gulp
			.src()
			.pipe(jshint())
			.pipe(jshint.reporter('default'))
			.pipe(uglify())
			.pipe(gulp.dest())
			.pipe(notify('JS Task Completed'));
	});

// Browserify Task ==============================
	gulp.task('browserify', function() {
		// Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
		gulp
			.src(['./src/assets/js/main.js'])
			.pipe(browserify({
				insertGlobals: true,
				debug: false
			}))
			// Bundle to a single file
			.pipe(uglify())
			.pipe(concat('main.js'))
			// Output it to our dist folder
			.pipe(gulp.dest('./dist/assets/js/'));

		// Views
		var views_path = './src/assets/js/views/',
			views = fs.readdirSync(views_path),
			views_len = views.length;
		for (var i = 0; i < views_len; i++) {
			gulp
				.src([views_path+views[i]])
				.pipe(browserify({
					insertGlobals: true,
					debug: false
				}))
				.pipe(uglify())
				.pipe(gulp.dest('./dist/assets/js/views/'));
		};

		return true;
	});

// Watch Task ===================================
	gulp.task('watch', function() {
		gulp.watch(['./src/assets/js/**/*.js'],['lint','browserify']);
		gulp.watch('./src/assets/sass/**/*.scss',['sass']);
		gulp.watch('./src/assets/img/**/*',['imagemin']);
		gulp.watch('./src/**/*.html',['views']);
	});

// Main Tasks ===================================
	gulp.task('default', ['dev','watch']);
	gulp.task('dev', ['views', 'imagemin', 'sass', 'lint', 'browserify', 'livereload', 'webserver']);