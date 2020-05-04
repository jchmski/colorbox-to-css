var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	postcss = require('gulp-postcss'),
	minify = require('gulp-clean-css'),
	autoprefixer = require('autoprefixer'),
	postcssPresetEnv = require('postcss-preset-env'),
	babel = require('gulp-babel'),
	eslint = require('gulp-eslint'),
	uglify = require('gulp-uglify'),
	inject = require('gulp-inject-code'),
	htmlmin = require('gulp-htmlmin');

gulp.task('dev', function () {
	const files = [
		'./dist/**/*'
	];

	browserSync.init({
		server: {
			baseDir: './dist'
		},
		files: files,
		open: false
	});

	gulp.watch('./src/index.html', gulp.series('copy', 'bundle'));
	gulp.watch('./src/css/styles.css', gulp.series('copy', 'css', 'bundle'));
	gulp.watch('./src/js/main.js', gulp.series('copy', 'js', 'bundle'));
});

gulp.task('copy', function () {
	return gulp.src('./src/index.html')
	.pipe(gulp.dest('./bundled/'))
});

gulp.task('css', function () {
  	return gulp.src('./src/css/styles.css', { allowEmpty: true })
	.pipe(postcss([postcssPresetEnv({ stage: 1 })]))
	.pipe(minify())
	.pipe(gulp.dest('./bundled/'))
	.pipe(browserSync.stream());
});

gulp.task('inject-css', function () {
	return gulp.src('./bundled/index.html')
	.pipe(inject({
		type: 'css',
		path: './bundled/styles.css'
	}))
	.pipe(gulp.dest('./bundled/'))
	.pipe(browserSync.stream());
});

gulp.task('js', function () {
	return gulp.src('./src/js/main.js', { allowEmpty: true })
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.on('error', function (e) {
		console.log(e)
		this.emit('end')
	})
	.pipe(eslint({baseConfig: {extends: 'eslint:recommended'}}))
	.pipe(eslint.format())
	.on('error', function (e) {
		console.log(e)
		this.emit('end')
	})
	.pipe(uglify())
	.pipe(gulp.dest('./bundled/'))
	.pipe(browserSync.stream());
});

gulp.task('inject-js', function () {
	return gulp.src('./bundled/index.html')
		.pipe(inject({
			type: 'js',
			path: './bundled/main.js'
		}))
		.pipe(gulp.dest('./bundled/'))
		.pipe(browserSync.stream());
});

gulp.task('htmlmin', function () {
	return gulp.src('./bundled/index.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});

gulp.task('default', gulp.series('dev'));
gulp.task('bundle', gulp.series('inject-css', 'inject-js', 'htmlmin'));
gulp.task('deploy', gulp.series('css', 'js', 'copy', 'inject-css', 'inject-js', 'htmlmin'));