const buttonImageBinding = new Shiny.InputBinding();
// Si siempre hay un boton activo
let buttonClicked = undefined;

$.extend(buttonImageBinding, {
  find: function (scope) {
    return $(scope).find('.buttons-group');
  },
  getValue: function (el) {
    if (!buttonClicked) {
      buttonClicked = document.querySelector('.button-style.active-btn');
    }
    const id = buttonClicked.getAttribute('id');
    console.log(id)
    //console.log(el.id)
    var parts = id.split('_');
    var image_id = parts[parts.length - 1];
    console.log(image_id)
    //console.log(image_id)
    return image_id

  },
  setValue: function (button, value) {
    buttonClicked = button;
    $(button).trigger('click');
  },
  subscribe: function (el, callback) {
    // Enlaza eventos al elemento que se creo

    $(el).on('click.buttonImageBinding', function (event) {
      const target = event.target;
      console.log(target)
      if (target.matches('button')) {
        buttonClicked.classList.remove('active-btn');
        buttonClicked = target;
        buttonClicked.classList.add('active-btn');
      } else if (target.matches('button img')) {
        buttonClicked.classList.remove('active-btn');
        buttonClicked = target.parentNode;
        buttonClicked.classList.add('active-btn');
      } else if (!target.matches('button') && !target.matches('button img')) {
        return;
      }
      console.log(buttonClicked)
      callback();
    });

  },
  receiveMessage: function (el, data) {

    let currentlyActive = document.querySelector('.active-btn');

    if (data.active === currentlyActive.id) {
      return;
    }
    currentlyActive.classList.remove('active-btn');

    const updatedButton = el.querySelector('#' + data.active);
    updatedButton.classList.add('active_btn');
    this.setValue(updatedButton, data.active);

    /*
    let currentlyDisabled = document.querySelector('.active-btn');

    if (data.active === currentlyActive.id) {
      return;
    }
    currentlyActive.classList.remove('active-btn');

    const updatedButton = el.querySelector('#' + data.active);
    updatedButton.classList.add('active_btn');
    this.setValue(updatedButton, data.active);
    */

  },
});

Shiny.inputBindings.register(buttonImageBinding, 'shiny.buttonImageInput');
