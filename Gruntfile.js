/*
 * grunt-bower-linker
 * https://github.com/mark/grunt-bower-linker
 *
 * Copyright (c) 2013 Mark Schad
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run.
    'bower-linker': {
      default: {
        options: {
          root: 'linker',
          map: {
            '*.js': '/js',
            '*.css': '/css',
            '*': '/', 
          }
        }
      }
    }
  });

  // Actually load this plugin's task.
  grunt.loadTasks('tasks');

  // By default, run bower_linker.
  grunt.registerTask('default', [ 'bower-linker' ]);

};
