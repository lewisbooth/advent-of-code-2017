var gulp = require("gulp")
var watch = require("gulp-watch")
var plumber = require("gulp-plumber")
var ts = require("gulp-typescript")
var tsProject = ts.createProject("tsconfig.json")

gulp.task("default", ["typescript"], function () {
    gulp.watch("src/*.ts", ['typescript'])
})

gulp.task("typescript", function () {
    return gulp
        .src("src/**/*.ts")
        .pipe(plumber())
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"))
}) 