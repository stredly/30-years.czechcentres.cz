const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

require('laravel-mix-imagemin');
require('imagemin-mozjpeg');

mix.browserSync({
  proxy: 'https://30-years.czechcentres.cz.test/',
  port: 3000,
  host: '30-years.czechcentres.cz',
  injectChanges: true,
  files: [
    'public/css/styles.css',
    'public/js/site.js',
    'resources/views/**/*.html',
    'resources/views/*.html',
  ],
});

mix
  .js('resources/js/site.js', 'public/js')
  .sass('resources/sass/styles.scss', 'public/css/styles.css')
  .imagemin(
    [
      {
        from: 'img/**.*',
      },
    ],
    {
      context: 'resources',
    },
    {
      optipng: {
        optimizationLevel: 2,
      },
      jpegtran: null,
      plugins: [
        require('imagemin-mozjpeg')({
          quality: 85,
          progressive: false,
        }),
      ],
    }
  )
  .sourceMaps();

if (mix.inProduction()) {
  mix.version();
}

/*
 |--------------------------------------------------------------------------
 | Statamic Control Panel
 |--------------------------------------------------------------------------
 |
 | Feel free to add your own JS or CSS to the Statamic Control Panel.
 | https://statamic.dev/extending/control-panel#adding-css-and-js-assets
 |
 */

// mix.js('resources/js/cp.js', 'public/vendor/app/js')
//    .postCss('resources/css/cp.css', 'public/vendor/app/css', [
//     require('postcss-import'),
//     require('tailwindcss/nesting'),
//     require('tailwindcss'),
// ])
