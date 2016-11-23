const gulp = require("gulp"),
	babel = require("gulp-babel"),
	jshint = require("gulp-jshint"),
	uglify = require("gulp-uglify"),
	browserSync = require("browser-sync"),
	browserify = require('gulp-browserify'),
	filePath = ["./src/js/**/*.js"],
	tasks = ["js"];

gulp.task("es2015", () => {
	return gulp.src(filePath[0])
						 .pipe(babel({
						 		presets: ['es2015'],
						 		plugins: ['transform-runtime']
						 }))
						 .pipe(gulp.dest("./build/js"));
});

gulp.task("js", ["es2015"], () => {
	return gulp.src("./build/js/mvvm.js")
						 .pipe(browserify({
			          insertGlobals : true,
			          debug : !gulp.env.production
			       }))
			     	 .pipe(jshint())
						 // .pipe(uglify())    // 上线后打开
			       .pipe(gulp.dest("./build/js"))
			       .pipe(browserSync.reload({stream: true}));
});

gulp.task("server", tasks, () => {
	browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task("watch", () => {
	gulp.watch(filePath, tasks);
});

gulp.task("default", ["server", "watch"]);