/*global module:false*/

module.exports = function(grunt) {
  // Project configuration.
	//grunt.loadNpmTasks('grunt-html-prettyprinter');    // It can be used for making our HTML more pretty.(for future use.)
	// grunt.loadNpmTasks('grunt-htmlcompressor');   // It can be used for HTML compression.(for future use.)
	//grunt.loadNpmTasks('fs');
	grunt.task.loadTasks('tasks'); // It is used for loading task from our tasks folder.
	grunt.loadNpmTasks('grunt-css'); // It is used for CSS compression.
	grunt.loadNpmTasks('grunt-contrib'); // It is used for copy files or directory.
	grunt.loadNpmTasks('grunt-clean'); // It is used for cleaning our code such as deleting temporary files or folders.
	grunt.loadNpmTasks('grunt-contrib-compress'); // It is used for zipping folders.
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	
	grunt.initConfig({
				/**
				 * load our config JSON file.
				 */
				pkg : '<json:galileo.jquery.json>',
				config : '<json:config.json>',

				meta : {
					banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - '
							+ '<%= grunt.template.today("yyyy-mm-dd") %>\n'
							+ '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>'
							+ '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;'
							+ ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
				},

				/**
				 * This task is grunt default task. It can be used for concat
				 * javascript and css(if required).
				 */
				concat : {
					js : {
						src : '<%= config.data.src %>.js',
						dest : '<%= config.data.temp %>/core.js'
					}
				},

				/**
				 * This task is grunt default task. It can be used for minimize
				 * javascript files. js minify for prod server.
				 */
				min : {
					prod : {

						src : '<%= config.data.temp %>/core.js',
						dest : '<%= config.data.dest %>/lib/core.min.js'
					}
				},

				/**
				 * This task is a part of grunt-css.It compress our CSS. There
				 * is also a another way in tasks folder by using YUI
				 * compressor. css minify for prod server.
				 */
				cssmin : {
					files : {
						src : '<%= config.data.src %>*.css',
						dest : '<%= config.data.dest %>/themes/default/css/main.min.css'
					}
				},

				/**
				 * This task is a part of grunt-contrib. It can copies our HTML
				 * files from src to dest.
				 * copy file for prod an dev server.
				 */
				copy : {
					prod : {
						files : {
							"<%= config.data.dest %>/themes/default/html/" : "<%= config.data.src %>.html",
						}
					},
					dev : {
						files : {
							"<%= config.data.dest %>/themes/default/html/" : "<%= config.data.src %>.html",
							"<%= config.data.dest %>/lib/" : '<%= config.data.temp %>/core.js',
							"<%= config.data.dest%>/themes/default/css/" : "<%= config.data.src %>*.css"
						}
					}
				},

				/**
				 * This task is a part of grunt-clean. It can deletes our
				 * temporary files or folders.
				 * clean file in both server prod and dev.
				 */
				clean : {
					folder : "target/galileo-component-logger/",
					file : "temp/"
				},
				


				/**
				 * This task is a part of grunt-contrib-compress. It can zip our
				 * folder or files.
				 * compress folder in both server.
				 */
				compress : {
					zip : {
						files : {
							'<%= config.data.compress %>.zip' : '<%= config.data.compress %>/**'
						}
					}
				},

				/**
				 * This task is grunt default task. It uses fhantomJS for unit
				 * testing.
				 */
				qunit : {
					files : [ '<%= config.data.src %>.js' ]
				},

				/**
				 *   This task is grunt default task.
				 *   It uses jshint for javascript code verification.
				 */
				lint : {
					files : [ 'grunt.js', 'src/**/*.js', 'test/**/*.js' ]
				},

				watch : {
					files : '<config:lint.files>',
					tasks : 'lint qunit'
				},
				
				/* nodeunit: {
					    all: ['<%= config.data.src %>.js' ]
					  },*/

				/*Temporary comment because giving- mixed tab and space error.(resolved by using smarttabs: true)
				 jshint : {
					options : {
						smarttabs : true
					},
					globals : {
						jQuery : true
					}
				},*/

				uglify : {}

			});

	// on the dev server.
	grunt.registerTask('dev',
			'quint clean:folder concat copy:dev clean:file compress');

	// on the prod server.
	grunt.registerTask('prod',
					'qunit clean:folder concat min:prod cssmin copy:prod clean:file compress nodeunit');

};
