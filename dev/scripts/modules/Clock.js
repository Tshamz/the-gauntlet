(function (Clock, $) {

  var Clocks = {};

  var getPeoplesTimeEntries = function () {
    var queryString = window.location.search.match(/department=(.*)/);
    var queryStringHasDepartment = (queryString !== null) && (queryString[0].indexOf('department=') !== -1);
    var department = (queryStringHasDepartment && queryString[1] !== '') ? queryString[1] : 'Development';
    return $.get('https://time-is-a-flat-circle.herokuapp.com/api/week?department=' + department);
  };

  var constructRows = function (response) {
    console.log(response);
    $('[data-clocks]').html('');
    response.entries.forEach(function (person) {
      var $name = $('<div />', {'class': 'name', text: person.name});
      var $totalClock = $('<div />', {'class': 'clock total-clock', 'data-clock': 'total'});
      var $billableClock = $('<div />', {'class': 'clock billable-clock', 'data-clock': 'billable'});
      var $clockWrapper = $('<div />', {'class': 'clock-wrapper'}).append($totalClock).append($billableClock);
      var $entry = $('<div />', {'class': 'entry', 'data-clocks-for': person.name}).append($name).append($clockWrapper);
      $('[data-clocks]').append($entry);
    });
    return response;
  };

  var initClocks = function (response) {
    response.entries.forEach(function (person) {
      var totalClock = $('[data-clocks-for="' + person.name + '"] [data-clock="total"]').FlipClock({
        autoStart: person.isActive
      });
      var billableClock = $('[data-clocks-for="' + person.name + '"] [data-clock="billable"]').FlipClock({
        autoStart: person.isActive && person.isBillable
      });
      totalClock.setTime(person.hours.total * 3600);
      billableClock.setTime(person.hours.billable * 3600);
      Clocks[person.name] = {
        total: totalClock,
        billable: billableClock,
      };
    });
  };

  var updateClocks = function (response) {
    response.entries.forEach(function (person) {
      var totalClock = Clocks[person.name].total;
      var billableClock = Clocks[person.name].billable;

      totalClock.setTime(person.hours.total * 3600);
      billableClock.setTime(person.hours.billable * 3600);

      totalClock.stop();
      billableClock.stop();
      if (person.isActive) {
        totalClock.start();
        if (person.isBillable) {
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
