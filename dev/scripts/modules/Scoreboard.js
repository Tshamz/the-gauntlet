(function(Scoreboard, $) {

  var toggleHeadingAndClocks = function () {
    var $heading = $('h1');
    var currentText = $heading.text();
    var updatedText = (currentText === 'Billable Time.') ? 'Total Time' : 'Billable Time';
    $heading.html(updatedText + '<a href="#">.</a>');
    $('[data-clocks]').attr('data-active-clocks', updatedText);
  };

  var bindUIActions = function() {
    $(document).on('click', 'h1 a', function (event) {
      event.preventDefault();
      toggleHeadingAndClocks();
    });
  };

  Scoreboard.init = function() {
    bindUIActions();
  };

}(window.Scoreboard = window.Scoreboard || {}, jQuery));
