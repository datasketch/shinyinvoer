const numberInputBinding = new Shiny.InputBinding();

$.extend(numberInputBinding, {
  find: function (scope) {
    return $(scope).find('.number-input');
  },
  initialize: function (el) {
    const input = el.querySelector('input');
    const stepDown = el.querySelector('#step-down');
    const stepUp = el.querySelector('#step-up');
    const step = Number(input.step);
    const min = input.min ? Number(input.min) : -Infinity;
    const max = input.max ? Number(input.max) : Infinity;
    const getValue = function setValue(step) {
      const inputValue = Number(input.value);
      const value = inputValue + step;
      if (value < min || value > max) {
        return inputValue;
      }
      return value;
    };

    stepDown.addEventListener('click', function () {
      const value = getValue(step * -1);
      input.value = value;
    });

    stepUp.addEventListener('click', function () {
      const value = getValue(step);
      input.value = value;
    });
  },
  getValue: function (el) {
    const input = el.querySelector('input');
    return parseFloat(input.value);
  },
  subscribe: function (el, callback) {
    const controls = el.querySelector('.number-input-controls');
    controls.addEventListener('click', function () {
      callback();
    });
    controls.addEventListener('change', function () {
      callback();
    });
    controls.addEventListener('input', function () {
      callback();
    });
  },
  receiveMessage: function (el, message) {
    const input = el.querySelector('input');
    const controls = el.querySelector('.number-input-controls');
    input.value = message.value;
    $(controls).trigger('click');
  },
});

Shiny.inputBindings.register(numberInputBinding);
