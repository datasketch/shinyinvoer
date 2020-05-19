let binding = new Shiny.InputBinding();

const typedArray = new Uint32Array(1);
const createRandomIndex = function () {
  return crypto.getRandomValues(typedArray)[0];
};

const createInputColor = (color = 'white') => {
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('value', color);
  input.setAttribute('id', `scp-${createRandomIndex()}`);
  input.classList.add('input-spectrum-color');
  return input;
};

const getState = (attribute) => (el) => JSON.parse(el.dataset[attribute]);
const setState = (attribute) => (el, value) => {
  el.dataset[attribute] = JSON.stringify(value);
};

const getColorsState = getState('colors');
const getIdsState = getState('ids');

const setColorsState = setState('colors');
const setIdsState = setState('ids');

const initAndUpdate = (el, color) => {
  const ids = getIdsState(el);
  const input = createInputColor(color);
  el.appendChild(input);
  ids.push(input.id);
  setIdsState(el, ids);
  $(input).spectrum({
    showInput: true,
    showInitial: true,
    preferredFormat: 'hex',
  });
};

$.extend(binding, {
  find: function (scope) {
    return $(scope).find('.input-spectrum-color-picker');
  },
  initialize: function (el) {
    // Initialize ids state
    setIdsState(el, []);
    // Create and initialize color inputs
    const colors = getColorsState(el);
    colors.forEach((color) => initAndUpdate(el, color));
    // Create color input
    $('#add-color').on('click', () => {
      initAndUpdate(el);
      $(el).trigger('click'); // force subscribe call
    });
  },
  getValue: function (el) {
    const ids = getIdsState(el);
    return ids.map((id) => {
      const color = $(`#${id}`).spectrum('get');
      return color.toHex();
    });
  },
  subscribe: function (el, callback) {
    $(el).on('click', () => callback());
    $(el).on('change', () => callback());
  },
});

Shiny.inputBindings.register(binding);
