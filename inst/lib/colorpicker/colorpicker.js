var colorPicker = new Shiny.InputBinding();
var palette = []

function changeBg(element, color) {
  const [r, g, b] = CP.HEX2RGB(color);
  const contrast = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  element.style.backgroundColor = '#' + color;
  element.style.color = contrast > 130 ? 'black' : 'white';
}

function initColorPicker(input, color) {
  // Registrar el botón de cerrar
  const dismiss = input.querySelector('.dismiss-input');
  dismiss.addEventListener('click', function () {
    input.remove()
  });
  // Inicializa ColorPickerJS
  const picker = new CP(input);
  color ? picker.set('#' + color) : picker.set('#f0f0f0');
  picker.on('change', function (color) {
    // Set bg and text color
    this.source.querySelector('.color-value').textContent = '#' + color;
    changeBg(this.source, color);
  });
}

function registerColorPicker(input) {
  input.addEventListener('click', function (event) {
    console.log(event.currentTarget)
  })
}

$.extend(colorPicker, {
  find: function(scope) {
    return $(scope).find('.input-colors');
  },
  initialize: function(el) {
    var button = el.querySelector('.color');
    if (button) {
      var color = el.dataset.color;
      initColorPicker(button, color);
    }
  },
  getValue: function(el) {
    console.log('GETVALUE CALLED')
    return 0;
  },
  subscribe: function(el, callback) {
    var addColor = $(el).find('#add-color');
    var colors = $(el).find('.colors');
    var spanInitialColor = $(el).find('.color-value')

    spanInitialColor && console.log(spanInitialColor.text())

    /*addColor.on('click', function (event) {
      var button = document.createElement('button');
      var value = document.createElement('span');
      var dismiss = document.createElement('span');

      value.classList.add('color-value');
      dismiss.classList.add('dismiss-input');
      button.classList.add('color');

      dismiss.textContent = 'x';

      button.appendChild(value);
      button.appendChild(dismiss);
      colors.appendChild(button);
      initColorPicker(button);
      registerColorPicker(button);
      callback();
    });*/
  }
});

Shiny.inputBindings.register(colorPicker);
