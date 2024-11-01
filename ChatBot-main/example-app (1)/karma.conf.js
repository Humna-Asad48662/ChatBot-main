module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      'src/**/*.js',
      'test/**/*.js'
    ],
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher'
    ],
    browsers: ['Chrome'],
    reporters: ['progress'],
    singleRun: true
  });
};