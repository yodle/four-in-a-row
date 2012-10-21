/*global jake, task, desc*/
(function() {
    "use strict";

    var Mocha = require('mocha');
    var mocha = new Mocha({reporter:'dot', ui:'exports'});

    task("default", ["lint", "test"]);
    
    desc("run jshint on all js files");
    task("lint", [], function() {
        var lint = require("./build/lint/lint_runner.js");
        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");
        lint.validateFileList(files.toArray(), nodeLintOptions(), {});
    });

    function nodeLintOptions() {
        return {
            node: true, es5: true
        };
    }

    desc("run unit tests");
    task("test", [], function() {
        var files = new jake.FileList();
        files.include("test/*.js");
        files.forEach(function(f) {
            mocha.addFile(f);
        });
        mocha.run();
    });
})();
