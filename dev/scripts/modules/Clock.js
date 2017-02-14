(function (Clock, $) {

  var Clocks = {};

  var getPeoplesTimeEntries = function () {
    return $.get('https://time-is-a-flat-circle.herokuapp.com/api/time');
  };

  var constructRows = function (data) {
    var items = data.data;
    $('[data-clocks]').html('');
    items.forEach(function (item) {
      var $name = $('<div />', {'class': 'name', text: item.name});
      var $totalClock = $('<div />', {'class': 'clock total-clock', 'data-clock': 'total'});
      var $billableClock = $('<div />', {'class': 'clock billable-clock', 'data-clock': 'billable'});
      var $clockWrapper = $('<div />', {'class': 'clock-wrapper'}).append($totalClock).append($billableClock);
      var $entry = $('<div />', {'class': 'entry', 'data-clocks-for': item.name}).append($name).append($clockWrapper);
      $('[data-clocks]').append($entry);
    });
    return items;
  };

  var initClocks = function (items) {
    items.forEach(function (item) {
      var totalClock = $('[data-clocks-for="' + item.name + '"] [data-clock="total"]').FlipClock({
        autoStart: item.active.is_active
      });
      var billableClock = $('[data-clocks-for="' + item.name + '"] [data-clock="billable"]').FlipClock({
        autoStart: item.active.is_active && item.active.is_billable
      });
      totalClock.setTime(item.hours.totalTime * 3600);
      billableClock.setTime(item.hours.billableTime * 3600);
      Clocks[item.name] = {
        total: totalClock,
        billable: billableClock,
      };
    });
  };

  var updateClocks = function (data) {
    var items = data.data;
    items.forEach(function (item) {
      var totalClock = Clocks[item.name].total;
      var billableClock = Clocks[item.name].billable;

      totalClock.setTime(item.hours.totalTime * 3600);
      billableClock.setTime(item.hours.billableTime * 3600);

      totalClock.stop();
      billableClock.stop();
      if (item.active.is_active) {
        totalClock.start();
        if (item.active.is_billable) {
          billableClock.start();
        }
      }
    });
  };

  var initView = function () {
    getPeoplesTimeEntries()
      .then(constructRows)
      .done(initClocks);
  };

  var updateView = function() {
    getPeoplesTimeEntries()
      .done(updateClocks);
  };

  Clock.init = function () {
    initView();
    setInterval(function () {
      updateView();
    }, 1000*60);
  };

}(window.Clock = window.Clock || {}, jQuery));
