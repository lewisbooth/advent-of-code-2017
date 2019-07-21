var gulp = require("gulp")
var plumber = require("gulp-plumber")
var ts = require("gulp-typescript")
var tsProject = ts.createProject("tsconfig.json")

gulp.task("typescript", function () {
    return gulp
        .src("src/**/*.ts")
        .pipe(plumber())
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"))
})

gulp.task("default", gulp.series("typescript", function () {
    gulp.watch("src/*.ts", gulp.parallel("typescript"))
}))
