angular.module('SGTravelBuddy.webSocket', [
    'btford.socket-io'
]).
    factory('socket', function (socketFactory) {
        return socketFactory({
            ioSocket: io.connect()
        });
    });