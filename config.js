module.exports = function (config) {

    // Output directory
    config.dest = 'public';

    // Inject cordova script into html
    config.cordova = false;

    // Images minification
    config.minify_images = true;

    // Development web server

    config.server.host = '0.0.0.0';
    config.server.port = '8000';

    // Set to false to disable it:
    // config.server = false;

    // Weinre Remote debug server

    config.weinre.httpPort = 8001;
    config.weinre.boundHost = 'localhost';

    // Set to false to disable it:
    config.weinre = false;

    // 3rd party components
    config.vendor.js.push('./bower_components/angular-translate/angular-translate.js');
    config.vendor.js.push('./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js');
    config.vendor.js.push('./bower_components/angular-translate-handler-log/angular-translate-handler-log.js');
    config.vendor.js.push('./bower_components/socket.io-client/socket.io.js');
    config.vendor.js.push('./bower_components/angular-socket-io/socket.js');
    // config.vendor.js.push('.bower_components/lib/dist/lib.js');
    // config.vendor.fonts.push('.bower_components/font/dist/*');

    config.languages = 'en_US';
};