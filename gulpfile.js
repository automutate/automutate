var gulp = require("gulp");
var runSequence = require("run-sequence");

gulp.task("clean", () => {
    var del = require("del");

    return del([
        "lib/*",
        "src/**/*.js"
    ]);
});

gulp.task("src:tslint", () => {
    var gulpTslint = require("gulp-tslint");
    var tslint = require("tslint");

    var program = tslint.Linter.createProgram("./tsconfig.json");

    return gulp
        .src(["src/**/*.ts", "!src/**/*.d.ts"])
        .pipe(gulpTslint({
            formatter: "stylish",
            program
        }))
        .pipe(gulpTslint.report());
});

gulp.task("src:tsc", () => {
    var sourcemaps = require("gulp-sourcemaps");
    var ts = require("gulp-typescript");
    var merge = require("merge2");

    var tsProject = ts.createProject("tsconfig.json");
    var tsResult = tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("lib")),
        tsResult.dts.pipe(gulp.dest("lib"))
    ]);
});

gulp.task("src", callback => {
    runSequence(["src:tsc", "src:tslint"], callback);
});

gulp.task("test:tsc", () => {
    var ts = require("gulp-typescript");

    var tsProject = ts.createProject("test/tsconfig.json");

    return tsProject
        .src()
        .pipe(tsProject())
            .js.pipe(gulp.dest("test"));
});

gulp.task("test:tslint", () => {
    var gulpTslint = require("gulp-tslint");
    var tslint = require("tslint");

    var program = tslint.Linter.createProgram("./tsconfig.json");

    return gulp
        .src(["test/**/*.ts"])
        .pipe(gulpTslint({
            formatter: "stylish",
            program
        }))
        .pipe(gulpTslint.report());
});

gulp.task("test:unit", () => {
    var mocha = require("gulp-mocha");

    return gulp.src("test/unit/**/*.js")
        .pipe(mocha({
            reporter: "spec",
        }));
});

gulp.task("test:mutators", () => {
    var mocha = require("gulp-mocha");

    return gulp.src("test/mutators/runTests.js")
        .pipe(mocha({
            delay: true,
            reporter: "spec",
        }));
});

gulp.task("test", callback => {
    runSequence(
        ["test:tsc", "test:tslint"],
        "test:unit",
        "test:mutators",
        callback);
});

gulp.task("watch", ["default"], () => {
    gulp.watch("src/**/*.ts", ["default"]);
});

gulp.task("default", callback => {
    runSequence("clean", "src", "test", callback);
});
