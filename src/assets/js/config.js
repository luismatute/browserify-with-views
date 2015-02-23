// Dependencies =================================
		var env = {
			"development": {
				"name": "src",
				"host": "localhost"
			},
			"production": {
				"name": "dist",
				"host": "localhost"
			}
		};

// Exposing Settings ============================
	module.exports = {
		env: env[process.env.NODE_ENV || 'development']
	};