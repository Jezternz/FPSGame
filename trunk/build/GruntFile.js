var path = require("path");

module.exports = function (grunt)
{
    
    var sourceFolder = "../source/";
    var tempFolder = "temp/";
    var destinationOutFolder = "../out/";


    grunt.initConfig({

        "clean":
        {
            "options": { "force": true },
            "temp": [ tempFolder ],
            "dev": [ destinationOutFolder ],
            "es6files": [ tempFolder + '**/**/*.es6.js' ]
        },

        "copy":
        {
            "temp":
            {
                "files": [{ "expand": true, "cwd": sourceFolder, "src": ['**/**/*.*'], "dest": tempFolder }]
            },
            "dev":
            {
                "files": [{ "expand": true, "cwd": tempFolder, "src": ['**/**/*.*'], "dest": destinationOutFolder }]
            },
        },

        "jshint":
        {
            "dev":
            {
                // -W087 : forces JShint to ignore when 'debugger;' is used in javascript
                "options": { "force": true, "-W087": true  },
                "files": { "src": ['Gruntfile.js', destinationOutFolder + "**/**/*.js"] }
            }
        },

        "traceur": 
        {
            "options": { "experimental": true, "blockBinding": true, "deferredFunctions": true, "annotations": true, "debug":true },
            "dev": 
            {
                "files":[{ "expand": true, "cwd": tempFolder, "src": ['**/**/*.es6.js'], "dest": tempFolder, "ext": '.js' }]
            }
        },

        "express":
        {
            "livereloadserver":
            {
                "options": { "port": 8080, "bases": destinationOutFolder, "livereload": true }
            }
        },

        "watch":
        {
            "options": { "livereload": true },
            "webfiles":
            {
                "options": { "atBegin": true, "spawn": true, "interrupt": false, "debounceDelay": 1000 },
                "tasks": ["default"],
                "files": [ sourceFolder + "**/**/*.*" ],
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-traceur-latest');
    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('default', [

        "clean:dev",
        "copy:temp",

        "traceur:dev",
        "jshint:dev",
        "clean:es6files",

        "copy:dev",
        "clean:temp",

    ]);

    grunt.registerTask('devwatch', [
        "express:livereloadserver",
        "watch:webfiles"
    ]);
};