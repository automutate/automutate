const del = require("del");
const gulp = require("gulp");
const merge = require("merge2");
const mocha = require("gulp-mocha");
const runSequence = require("run-sequence");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");

gulp.task("clean", () => {
    return del([
        "lib/*",
        "src/**/*.js"
    ]);
});

gulp.task("src:tslint", () => {
    return gulp
        .src(["src/**/*.ts", "!src/**/*.d.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});

gulp.task("src:tsc", () => {
    const tsProject = ts.createProject("tsconfig.json");
    const tsResult = tsProject
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
    const tsProject = ts.createProject("test/tsconfig.json");

    return tsProject
        .src()
        .pipe(tsProject())
            .js.pipe(gulp.dest("test"));
});

gulp.task("test:tslint", () => {
    return gulp
        .src(["test/**/*.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});

gulp.task("test:unit", () => {
    return gulp.src("test/unit/**/*.js")
        .pipe(mocha({
            reporter: "spec",
        }));
});

gulp.task("test:mutators", () => {
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
