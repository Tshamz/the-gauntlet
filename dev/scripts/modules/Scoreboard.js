(function(Scoreboard, $, undefined) {

  var getScoreboardData = function() {
    $.get('http://its-harvest-time.herokuapp.com/api/time', function(response) {
      console.log(response);
    });
  };

  var bindUIActions = function() {

  };

  Scoreboard.init = function() {
    bindUIActions();
    getScoreboardData();
  };

}(window.Scoreboard = window.Scoreboard || {}, jQuery));
