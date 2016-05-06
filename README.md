# gulp-coffeescript-concat

## Overview

Gulp plugin based on [coffeescript-concat](https://github.com/fairfieldt/coffeescript-concat)

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-coffeescript-concat`

## Usage

```js
var coffeeConcat = require('gulp-coffeescript-concat');

gulp.task('coffee', function() {
    return gulp.src(['coffee/*.coffee', 'coffee/**/*.coffee'])
        .pipe(coffeeConcat('all.coffee'))
        .pipe(gulp.dest('dist'));
});
```

This will concat coffeescript files in right order for resolving class dependencies. For more information about dependency resolving you can get at [coffeescript-concat page](https://github.com/fairfieldt/coffeescript-concat##coffeescript-concat-performs-4-operations).

## Licence

MIT, see [LICENCE](https://github.com/artem328/gulp-coffeescript-concat/blob/master/LICENSE) file