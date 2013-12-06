# grunt-bower-linker

> Collect main sources from bower packages and link them in the desired directories.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bower-linker --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bower-linker');
```

## The "bower_linker" task

### Overview
In your project's Gruntfile, add a section named `bower_linker` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'bower-linker': {
    default: {
      options: {
        root: 'linker',     // The root directory to place linked sources.
        map: {
          '*.js': '/js',    // Sub directories to link specific source types.
          '*.css': '/css',
          '*': '/', 
        }
      }
    }
  },
});
```

### Options

#### copy

Type `Boolean` 
Default: `false`

If set to true the main files from each package will be copied instead of linked.

#### cwd

Type: `String` 
Default: `'.'`

The path to the current working directory which houses either a _bower_components_ directory or a _.bowerrc_ file.

#### force

Type: `Boolean` 
Default: `false`

Whether or not to force linking main files, overwriting existing files at the destination.

#### map

Type: `Object` 
Default: `{ '*': '/' }`

An object containing key/value pairs describing how files should be linked in the root directory.  The following example shows a map object which places `.css` files and `.js` files in separate directories and all other files in the root directory.

```javascript
{
  '*.js': '/js',
  '*.css': '/styles'
  '*': '/'
}
```

*Note*: grunt-bower-link uses minimatch to parse the map object.

#### offline

Type: `Boolean` 
Default: `true`

Whether or not to run bower commands in offline mode.  Offline mode is much faster.

*Node*: There is no benefit to running this task in online mode.  This option is kept for potential use in the future.

#### root

Type: `String` 
Default: `linker`

The directory to place linked files in.

#### vendor

Type: `Boolean` 
Default: `false`

If this option is set to true, main files will be disseminated through an intermediate directory named after their package.  For example, if you have installed twitter bootstrap through bower it will place the sources in the follow manner:

```text
+ root
  + bootstrap
      bootstrap.css
      bootstrap.js
      fonts.otf
      ...
  + jquery
      jquery.js
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
