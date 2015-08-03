angular.module('SGTravelBuddy.websocket', [
  'btford.socket-io'
]).
factory('socket', function (socketFactory) {
  return socketFactory({
    ioSocket: io.connect()
  });
})