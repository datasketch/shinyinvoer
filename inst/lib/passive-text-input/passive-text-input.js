const passiveTextInputBinding = new Shiny.InputBinding();

$.extend(passiveTextInputBinding, {
  find(scope) {
    return $(scope).find('.shinyinvoer-passive-text-input');
  },
  initialize(el) {
    const initialVal = el.dataset.value;
    const input = el.querySelector('input');
    input.value = initialVal;
  },
  getValue(el) {
    const input = el.querySelector('input');
    return input.value.trim();
  },
  subscribe(el, callback) {
    el.addEventListener('keyup', event => {
      if (event.keyCode !== 13) return;
      callback();
    });

    el.addEventListener('click', event => {
      if (!event.target.matches('button')) return;
      callback();
    });
  },
  receiveMessage(el, message) {
    const input = el.querySelector('input')
    const event = new KeyboardEvent('keyup', {
      keyCode: 13,
    });

    input.value = message.value || ''
    el.dispatchEvent(event);
  },
});

Shiny.inputBindings.register(passiveTextInputBinding);
