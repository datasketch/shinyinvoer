var colorInputBinding = new Shiny.InputBinding();
var state = [];
var handleInputColorChange = function (event) {
  var input = event.target;
  var index = parseInt(input.dataset.index);

  // Remove old value from state
  state = state.filter(function(color) {
    return color.id != index;
  });

  // Add new value to state
  state.push({
    id: index,
    input: input,
    color: input.value
  });
  state.sort(function(a, b){return a.id - b.id});
};

var remove_color = function(event) {
  var index = parseInt(event.target.getAttribute("index"));

  // Remove from state
  state = state.filter(function(color) {
    return color.id != index;
  });

  // Remove from DOM
  var div = event.target.parentNode;
  div.remove();
};

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
      state.sort(function(a, b){return a.id - b.id});

      $(input).on('change', handleInputColorChange);
    });

    // Enlazar boton para agregar color
    $(el).find('#add-color').click(function () {
      var div = document.createElement('div');
      div.setAttribute('class', "input-color-container");
      var index = state[state.length-1].id + 1;

      //create color picker
      var input = document.createElement('input');
      input.setAttribute('type', 'color');
      input.value = '#FFFFFF';
      input.dataset.index = index;

      // call handleInputColorChange to update state
      handleInputColorChange({'target': input});
      $(input).on('change', handleInputColorChange);

      // create remove color button
      var button = document.createElement('button');
      button.setAttribute('index', index);
      button.innerHTML = "x";
      button.onclick = remove_color;
      div.appendChild(input);
      div.appendChild(button);
      el.insertBefore(div, this);
    });

    // Add remove_color onclick top all except the add-color button
    $(el).find('button').each(function(index, button) {
      if (button.id !== "add-color") {
        button.onclick = remove_color;
      }
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
       $(input).on('change', handleInputColorChange);
     });
     callback();
   });
  },
  unsubscribe: function(el) {
  }
});

Shiny.inputBindings.register(colorInputBinding, 'shiny.colorInputBinding');
