module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/app/app.component.spec.ts'
        ],
        preprocessors: {
            'src/app/app.component.spec.ts': ['webpack']
        },
        reporters: ['progress'],
        browsers: ['Chrome'],
        singleRun: true
    });
};