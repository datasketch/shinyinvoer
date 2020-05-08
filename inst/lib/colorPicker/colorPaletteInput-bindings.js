let colorPaletteInputBinding = new Shiny.InputBinding();

const typedArray = new Uint32Array(1);
const createRandomIndex = function() {
  return crypto.getRandomValues(typedArray)[0];
};

const getColorsState = function(el) {
  return JSON.parse(el.dataset.colors);
};

const setColorsState = function(el, state) {
  el.dataset.colors = JSON.stringify(state);
};

const handleInputColorChange = function(event, el) {
  const input = event.target;
  const index = parseInt(input.dataset.index, 10);
  // Get state
  const colors = getColorsState(el);
  const inputIndex = colors.findIndex(item => item.id === Number(index));
  // Update state
  colors.splice(
    inputIndex,
    1,
    Object.assign(colors[inputIndex], { color: input.value })
  );
  // Set state
  setColorsState(el, colors);
};

const removeColor = function(event, el) {
  const parent = event.target.parentNode;
  const input = parent.querySelector('input');
  const index = parseInt(input.dataset.index, 10);
  // Get state
  let colors = getColorsState(el);
  // Update/remove from state
  colors = colors.filter(color => color.id !== index);
  // Set state
  setColorsState(el, colors);
  // Remove from DOM
  const div = event.target.parentNode;
  div.remove();
};

$.extend(colorPaletteInputBinding, {
  find: function(scope) {
    return $(scope).find('.input-color-palette');
  },
  initialize: function(el) {
    setColorsState(el, []);
    const self = this;
    $(el)
      .find('input')
      .each(function(index, input) {
        const idx = createRandomIndex();
        // Save reference to idx in the element
        input.dataset.index = idx;
        // Get state
        const colors = getColorsState(el);
        // Update state
        colors.push({
          id: idx,
          color: input.value
        });
        // Set state
        setColorsState(el, colors);
        // Bind event to input element
        $(input).on('change', e => handleInputColorChange.call(self, e, el));
      });

    // Bind event to add color button
    $(el)
      .find('#add-color')
      .click(function() {
        const index = createRandomIndex();
        const div = document.createElement('div');
        div.setAttribute('class', 'input-color-container');

        // Create color picker
        const input = document.createElement('input');
        input.setAttribute('type', 'color');
        input.value = '#FFFFFF';
        input.dataset.index = index;

        // Bind event to new input
        $(input).on('change', e => handleInputColorChange.call(self, e, el));

        // create remove color button
        const button = document.createElement('button');
        button.textContent = 'x';
        button.addEventListener('click', e => removeColor.call(self, e, el));

        div.appendChild(input);
        div.appendChild(button);
        el.insertBefore(div, this);

        // Get state
        const colors = getColorsState(el);
        // Update state
        colors.push({
          id: index,
          color: input.value
        });
        // Set state
        setColorsState(el, colors);
      });

    // Bind removeColor event to buttons inside .input-color-container divs
    $(el)
      .find('.input-color-container button')
      .each(function(index, button) {
        button.addEventListener('click', e => removeColor.call(self, e, el));
      });
  },
  getValue: function(el) {
    return getColorsState(el).map(item => item.color);
  },
  subscribe: function(el, callback) {
    // Bind events to parent container
    $(el).on('click', function(event) {
      callback();
    });
    $(el).on('change', function(event) {
      callback();
    });
  },
  unsubscribe: function(el) {}
});

Shiny.inputBindings.register(colorPaletteInputBinding, 'shiny.colorPaletteInputBinding');
