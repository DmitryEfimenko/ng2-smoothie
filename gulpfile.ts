import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as del from 'del';

gulp.task('clean', function (cb) {
    del(['lib/']).then(path => { cb(); });
});

gulp.task('compile', () => {
  let proj = ts.createProject(<any>{
    declaration: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    lib: ['es6', 'dom'],
    module: 'commonjs',
    removeComments: true,
    target: 'es5',
    typeRoots: [
      './node_modules/@types'
    ]
  });

  let tsResult = gulp.src([
    './src/ng2-smoothie/**/*.ts',
    '!./src/ng2-smoothie/**/*.spec.ts'
  ]).pipe(proj());

  tsResult.dts
    .pipe(gulp.dest('./lib/typings'));

  return tsResult.js
    .pipe(gulp.dest('./lib/src'));
});

gulp.task('build', ['clean', 'compile']);
