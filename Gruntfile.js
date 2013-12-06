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
      testCopy: {
        options: {
          cwd: 'tests',
          root: 'tests/linker',
          copy: true,
          map: {
            '*.js': '/js',
            '*.css': '/css',
            '*': '/', 
          }
        }
      },
      testLink: {
        options: {
          cwd: 'tests',
          root: 'tests/linker',
          map: {
            '*.js': '/js',
            '*.css': '/css',
            '*': '/', 
          },
          force: true
        }
      },
      testVendorCopy: {
        options: {
          cwd: 'tests',
          root: 'tests/linker',
          copy: true,
          vendor: true,
          map: {
            '*.js': '/js',
            '*.css': '/css',
            '*': '/', 
          }
        }
      },
      testVendorLink: {
        options: {
          cwd: 'tests',
          root: 'tests/linker',
          vendor: true,
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
  grunt.registerTask('default', [ 'bower-linker:test' ]);

};
