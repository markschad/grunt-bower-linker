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
      async = require('async'),
      bower = require('bower'),
      fs = require('fs'),
      glob = require('glob'),
      minimatch = require('minimatch'),
      path = require('path'),

      done = this.async(),

      options = this.options({
        cwd: '.',                 // Current working directory.
        offline: true,            // Run bower commands in offline mode. (faster)
        copy: false,              // Copy the sources instead of creating a symbolic link.
        vendor: false,            // Place components in a vendor folder between the root and the dest.
        root: 'linker',           // The root folder to place the components in.
        force: false,             // Overwrite files if they exist.
        map: {                    // Where to map sources.
          '*': '/', 
        }
      }),

      // The function used to link the files, either copy or symlink.
      linkFn = function(src, dest) {

        src = path.resolve(src);
        dest = path.resolve(dest);

        try {

          if (options.force && fs.existsSync(dest)) {
            grunt.log.writeln('Removing file: %s', dest);
            fs.unlinkSync(dest);
          }

        }
        catch (err) {
          console.log('Could not unlink \'%s\'\n%s\nContinuing...', dest, err);
        }
        finally {
          try {
            options.copy ? grunt.file.copy(src, dest): fs.symlinkSync(src, dest, 'file');
            grunt.log.writeln('Linked file:\n%s\ ===> %s', src, dest);
          }
          catch (err) {
            grunt.log.writeln('Could not create link \n\'%s\'\ ===> \'%s\'\n%s\nContinuing...', dest, src, err);
          }
        }

      },

      // Create a directory and all intermediate directories.
      mkdirp = function(target, cwd) {

        var a = target.split(path.sep);
        var d = path.join(cwd === undefined ? '.' : cwd, a.shift());

        try {

          if (!fs.existsSync(d))
            fs.mkdirSync(d);

        }
        catch (err) {

          grunt.log.writeln('Error creating directory: %s\n%s\nContinuing...', d, err);

        }
        finally {

          if (a.length > 0)
            mkdirp(path.join.apply(this, a), d);

        }

      },

      // Link a main file.
      link = function(source, vendor) {

        vendor = vendor === undefined ? '/' : vendor;
        var filename = path.basename(source);
        grunt.log.writeln('Linking [%s]...', filename);

        for (var key in options.map) {

          // If this is a matching mapping then link the source to the
          // mapped directory.
          if (minimatch(filename, key)) {
            var target = path.join(options.root, vendor, options.map[key], filename);
            mkdirp(path.dirname(target));
            return linkFn(source, target);
          }

        }

        // Link the source to the root linker directory if no specific
        // mapping was found.
        var target = path.join(options.root, vendor, filename);
        mkdirp(path.dirname(target));
        return linkFn(source, target);

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
                  link(source, options.vendor ? pkg.pkgMeta.name : undefined);
                  next(null);

                }, function() { next(null) });

              });

            }

          });

        }
        
      };

    // Get the list of bower packages and link them.
    bower.commands.list({ map: false }, { cwd: options.cwd, offline: options.offline })
      .on('end', function(data) { 

        parse(data);  // Parse the base package.
        done();

      });

  });

};
