let binding = new Shiny.InputBinding();
const SPECTRUM_DEFAULT_COLOR = '#ffffff';

const typedArray = new Uint32Array(1);
const createRandomIndex = function () {
  return crypto.getRandomValues(typedArray)[0];
};

const createInputColor = (color) => {
  const container = document.createElement('div');
  const input = document.createElement('input');
  const remove = document.createElement('button');

  container.classList.add('input-spectrum-container');
  input.classList.add('input-spectrum-color');
  remove.classList.add('input-spectrum-remove');

  input.setAttribute('type', 'text');
  input.setAttribute('value', color || SPECTRUM_DEFAULT_COLOR);
  input.setAttribute('id', `scp-${createRandomIndex()}`);

  remove.textContent = 'Borrar';

  container.appendChild(input);
  container.appendChild(remove);

  return { container, input, remove };
};

const removeInputColor = (el, container, input) => {
  const ids = getIdsState(el);
  const index = ids.findIndex((id) => id === input.id);
  ids.splice(index, 1);
  setIdsState(el, ids);
  container.remove();
  $(el).trigger('click'); // force update
};

const getState = (attribute) => (el) => JSON.parse(el.dataset[attribute]);
const setState = (attribute) => (el, value) => {
  el.dataset[attribute] = JSON.stringify(value);
};

const getColorsState = getState('colors');
const getIdsState = getState('ids');

const setColorsState = setState('colors');
const setIdsState = setState('ids');

const initAndUpdate = (el, color, palette) => {
  const ids = getIdsState(el);
  const { container, input, remove } = createInputColor(color || palette[0]);
  el.appendChild(container);
  ids.push(input.id);
  setIdsState(el, ids);
  $(remove).on('click', () => removeInputColor(el, container, input));
  // Init Spectrum lib
  const showAlpha = el.getAttribute('alpha') === 'TRUE';
  const baseConfig = { showAlpha, preferredFormat: 'hex'};
  const config = palette.length
    ? Object.assign({}, baseConfig, {
        showPalette: true,
        showPaletteOnly: true,
        hideAfterPaletteSelect: true,
        palette: [palette]
      })
    : Object.assign({}, baseConfig, { showInput: true, showInitial: true });
  $(input).spectrum(config);
};

$.extend(binding, {
  find: function (scope) {
    return $(scope).find('.input-spectrum-color-picker');
  },
  initialize: function (el) {
    // Initialize ids state
    setIdsState(el, []);
    // Get palette
    const palette = JSON.parse(el.dataset.palette);
    // Create and initialize color inputs
    const colors = getColorsState(el);
    colors.forEach((color) => initAndUpdate(el, color, palette));
    // Create color input
    $(el)
      .find('.input-spectrum-add-color')
      .on('click', () => {
        initAndUpdate(el, null, palette);
        $(el).trigger('click'); // force update
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
