/*
 * grunt-bower-linker
 * https://github.com/mark/grunt-bower-linker
 *
 * Copyright (c) 2013 Mark Schad
 * Licensed under the MIT license.
 */

'use strict';


module.exports = function(grunt) {

  grunt.registerMultiTask('bower-linker', 'Link bower components to specified directory.', function() {

    var 
      bower = require('bower'),
      path = require('path'),
      async = require('async'),
      minimatch = require('minimatch'),
      glob = require('glob'),

      done = this.async(),

      options = this.options({
        cwd: '.',
        offline: true,
        root: 'linker',
        map: {
          '*.js': '/js',
          '*.css': '/css',
          '*': '/', 
        }
      }),

      // Link a main file.
      link = function(source) {

        var filename = path.basename(source);
        grunt.log.writeln('Linking [%s]...', filename);
        for (var key in options.map) {

          // If this is a matching mapping then link the source to the
          // mapped directory.
          if (minimatch(filename, key))
            return grunt.file.copy(source,
              path.join(options.root, options.map[key], filename)
            );

        }

        // Link the source to the root linker directory if no specific
        // mapping was found.
        return grunt.file.copy(source, 
          path.join(options.root, filename)
        );        

      },

      // Parse a bower package and link its main files.
      parse = function(pkg) {

        if (pkg['dependencies']){

          async.each(Object.keys(pkg['dependencies']), function(key, next) {

            parse(pkg.dependencies[key]);
            next(null);

          }, function() {

            // Ensure this package has defined meta data, a list main packages and
            // a reference to the absolute location of these files.
            if (pkg.pkgMeta && pkg.pkgMeta.main && pkg.canonicalDir) {

              // Process each main file.
              async.each([].concat(pkg.pkgMeta.main), function(file, next) {

                // Glob the main file reference.
                var sources = [].concat(glob.sync(path.join(pkg.canonicalDir, file)));
                async.each(sources, function(source, next) {

                  // Link the sources.
                  link(source);
                  next(null);

                }, function() { next(null) });

              });

            }

          });

        }
        
      };

    // Get the list of bower packages and link them.
    bower.commands.list({ map: false, offline: options.offline }, { cwd: options.cwd })
      .on('end', function(data) { 

        parse(data);  // Parse the base package.
        done();

      });

  });

};
