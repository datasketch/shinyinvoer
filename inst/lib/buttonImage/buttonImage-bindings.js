var buttonImageBinding = new Shiny.InputBinding();
var buttonClicked = undefined;

$.extend(buttonImageBinding, {
  find: function(scope) {
		// Encuentra el elemento que se ha creado
		return $(scope).find('.buttons-group')
  },
  getValue: function(el) {
		// El manejador del evento
		// Devuelve valor a R
 //return
  if (!buttonClicked) {
    return null
  }
  var id = buttonClicked.getAttribute('id')
  return id
  },
   setValue: function(el, value) {
   //console.log(value)
  },
  subscribe: function(el, callback) {
		// Enlaza eventos al elemento que se creo
		$(el).on('click.buttonImageBinding', function (event) {
		  var target = event.target
		  if (target.matches('button')) {
		    // Si es boton
		    buttonClicked = target
		  } else if (target.matches('button img')) {
		    // Si es imagen
		    buttonClicked = target.parentNode
		  } else if (!target.matches('button') && !target.matches('button img')) {
		    // Ni boton, ni imagen
		    return
		  }
		  callback();
		})
  },
  unsubscribe: function(el) {
  }
});

Shiny.inputBindings.register(buttonImageBinding, 'shiny.buttonImageInput')
