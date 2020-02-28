var buttonImageBinding = new Shiny.InputBinding();
// Si siempre hay un boton activo
var buttonClicked = undefined;

$.extend(buttonImageBinding, {
	find: function(scope) {
		// Encuentra el elemento que se ha creado
		return $(scope).find('.buttons-group');
	},
	getValue: function(el) {
		// El manejador del evento
		// Devuelve valor a R
		//return
		if (!buttonClicked) {
			buttonClicked = document.querySelector('.buttonStyle.active_btn');
			console.log(buttonClicked);
		}
		var id = buttonClicked.getAttribute('id');
		return id;
	},
	setValue: function(button, value) {
	  buttonClicked = button;
	  $(button).trigger('click');
	},
	subscribe: function(el, callback) {
		// Enlaza eventos al elemento que se creo
		$(el).on('click.buttonImageBinding', function(event) {
			var target = event.target;
			if (target.matches('button')) {
				// Si es boton
				buttonClicked.classList.remove('active_btn');
				buttonClicked = target;
				buttonClicked.classList.add('active_btn');
			} else if (target.matches('button img')) {
				// Si es imagen
				buttonClicked.classList.remove('active_btn');
				buttonClicked = target.parentNode;
				buttonClicked.classList.add('active_btn');
			} else if (!target.matches('button') && !target.matches('button img')) {
				// Ni boton, ni imagen
				return;
			}
			callback();
		});
	},
	unsubscribe: function(el) {},
	// update the button image
	receiveMessage: function(el, data) {
		let active_now = document.querySelector('.active_btn');

		if (data.active === active_now.id) {
			return;
		}
		active_now.classList.remove('active_btn');

		const button_update = el.querySelector('#' + data.active);
		button_update.classList.add('active_btn');
		// update reference
		this.setValue(button_update, data.active);
	}
});

Shiny.inputBindings.register(buttonImageBinding, 'shiny.buttonImageInput');
