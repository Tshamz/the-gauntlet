(function (Clock, $) {

  var Clocks = {};

  var getPeoplesTimeEntries = function () {
    return $.get('https://time-is-a-flat-circle.herokuapp.com/api/time');
  };

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
    $('[data-clocks]').html('');
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
      var clock = $('[data-clock-for="' + item.name + '"] .clock').FlipClock({
        autoStart: item.active
      });
      clock.setTime(item.hours * 3600);
      Clocks[item.name] = clock;
    });
  };

  var updateClocks = function (items) {
    console.log('clocks updated.');
    items.forEach(function (item) {
      var clock = Clocks[item.name];
      clock.setTime(item.hours * 3600);
    });
  };

  var initView = function () {
    getPeoplesTimeEntries()
      .then(calculatePeoplesTotalTime)
      .then(constructRows)
      .done(initClocks);
  };

  var updateView = function() {
    getPeoplesTimeEntries()
      .then(calculatePeoplesTotalTime)
      .done(updateClocks);
  };

  Clock.init = function () {
    initView();
    setInterval(function () {
      console.log('ding');
      updateView();
    }, 1000*60);
  };

}(window.Clock = window.Clock || {}, jQuery));
