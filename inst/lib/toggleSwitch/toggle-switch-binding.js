let binding = new Shiny.InputBinding();

$.extend(binding, {
  find: function (scope) {
    return $(scope).find('.switch-container');
  },
  getValue: function (el) {
    const input = el.querySelector('input');
    return input.value;
  },
  subscribe: function (el, callback) {
    el.addEventListener('change', function() {
      callback();
    });
  },
});

Shiny.inputBindings.register(binding);
