(function (Clock, $) {

  window.clocks = {};

  var getPeoplesTimeEntries = $.get('https://time-is-a-flat-circle.herokuapp.com/api/time', function(response) {
    return response;
  });

  var calculatePeoplesTotalTime = function (people) {
    var compiledData = [];
    $.each(people.data, function (key, person) {
      var totalTime = 0;
      person.entries.forEach(function (entry) {
        totalTime += entry.hours;
      });
      compiledData.push({
        name: person.name.name,
        hours: totalTime,
        active: person.active
      })
    })
    return compiledData;
  };

  var constructRows = function (items) {
    items.forEach(function (item) {
      var $name = $('<div />', {'class': 'name', text: item.name});
      var $clock = $('<div />', {'class': 'clock'});
      var $clockWrapper = $('<div />', {'class': 'clock-wrapper'}).append($clock);
      var $entry = $('<div />', {'class': 'entry', 'data-clock-for': item.name}).append($name).append($clockWrapper);
      $('[data-clocks]').append($entry);
    });
    return items;
  };

  var initClocks = function (items) {
    items.forEach(function (item) {
      clocks[item.name] = $('[data-clock-for="' + item.name + '"] .clock').FlipClock({
        autoStart: item.active
      }).setTime(item.hours * 3600);
    });
  };

  Clock.init = function () {
    getPeoplesTimeEntries
      .then(calculatePeoplesTotalTime)
      .then(constructRows)
      .then(initClocks);
  };

}(window.Clock = window.Clock || {}, jQuery));
