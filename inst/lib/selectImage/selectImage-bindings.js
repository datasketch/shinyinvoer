var selectImageBinding = new Shiny.InputBinding();
// Si siempre hay un boton activo
var selectClicked = undefined

$.extend(selectImageBinding, {
  find: function(scope) {
		// Encuentra el elemento que se ha creado
		return $(scope).find('.btn-group')
  },
  getValue: function(el) {
		// El manejador del evento
		// Devuelve valor a R
 //return
  if (!selectClicked) {
    selectClicked = document.querySelector('.selectImage');
    console.log(selectClicked)
  }
  var id = selectClicked.getAttribute('id')
  return id
  },
   setValue: function(el, value) {
   //console.log(value)
  },
  subscribe: function(el, callback) {
		// Enlaza eventos al elemento que se creo
		$(el).on('click.selectImageBinding', function (event) {
		  var target = event.target
		  if (target.matches('a.selectImage')) {
		    console.log(target)
		    // Si es li
		    selectClicked.classList.remove('active_btn')
		    selectClicked = target
		    selectClicked.classList.add('active_btn')
		  } else if (target.matches('a.selectImage > img')) {
		    console.log(target)
		    // Si es a
		    selectClicked.classList.remove('active_btn')
		    selectClicked = target.parentNode
		    selectClicked.classList.add('active_btn')
		  } else if (!target.matches('select') && !target.matches('select img')) {
		    // Ni boton, ni imagen
		    return
		  }
		  var inner = selectClicked.innerHTML;
		  console.log(inner)
		  var button = document.querySelector('.buttonInner.selectImage');
		  button.innerHTML = inner;
		  var img_src = selectClicked.querySelector('img').getAttribute('src');
		  console.log(img_src)
		  callback();
		})
  },
  unsubscribe: function(el) {
  }
});

Shiny.inputBindings.register(selectImageBinding, 'shiny.selectImageInput')
