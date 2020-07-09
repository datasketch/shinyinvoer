let toggleSwitchBinding = new Shiny.InputBinding();

$.extend(toggleSwitchBinding, {
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

Shiny.inputBindings.register(toggleSwitchBinding);
