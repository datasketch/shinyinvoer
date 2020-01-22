var colorInputBinding = new Shiny.InputBinding();
var state = []
var handleInputColorChange = function (event) {
  var index = this.dataset.index;
  var color = event.target.value;
  this.value = color;
  var inputIndex = state.findIndex(function (item) {
    return item.id === Number(index)
  });
  // Actualiza el estado
  state.splice(inputIndex, 1, Object.assign(state[inputIndex], { color: color }));
}

$.extend(colorInputBinding, {
  find: function(scope) {
		// Encuentra el elemento que se ha creado

	return $(scope).find(".input-color-palette");
  },
  initialize: function(el){
    $(el).find('input').each(function (index, input) {
      // Guardar referencia al id en el elemento
      input.dataset.index = index;
      // Guardar en el estado global
     state.push({
       id: index,
       input: input,
       color: input.value
     });
     // Enlazar evento a input
      $(input).on('change', handleInputColorChange);
    });

    // Enlazar boton para agregar color
    $(el).find('#add-color').click(function () {
      var input = document.createElement('input');
      input.setAttribute('type', 'color');
      input.value = '#FFFFFF';
      el.insertBefore(input, this)
    });
  },
  getValue: function(el) {

    return state.map(item => item.color);
  },
   setValue: function(el, value) {
   //console.log(el)
  },
  subscribe: function(el, callback) {
   // Enlaza evento a contenedor padre
   $(el).on('change', function (event) {
     $(this).find("input").each(function (index, input) {
       if (input.dataset.index) {
         return; // early return
       }
       // Agregar data-index
       input.dataset.index = index;
       // Guardar en el estado global
      state.push({
        id: index,
        input: input,
        color: input.value
      });
      $(input).on('change', handleInputColorChange);
     });
     callback();
   })
  },
  unsubscribe: function(el) {
  }
});

Shiny.inputBindings.register(colorInputBinding, 'shiny.colorInputBinding')
