const buttonImageBinding = new Shiny.InputBinding();

$.extend(buttonImageBinding, {
  find: function (scope) {
    return $(scope).find('.button-image-input');
  },
  getValue: function (el) {

    console.log("getValue: ", $(el).data('value'))
    return $(el).data('value');
    //return $(el).attr('data-value');
    /*
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
    */

  },
  setValue: function (el, value) {
    //buttonClicked = button;
    //$(button).trigger('click');
    $(el).data('value', value);
    $(el).attr('data-value', value);
  },
  subscribe: function (el, callback) {
    // Enlaza eventos al elemento que se creo

    //let buttonClicked = $(el).data('value');
    //let buttonClicked = $(el).attr('data-value');
    $(el).on('click.buttonImageBinding', function (event) {
      let buttonClicked;
      const target = event.target;
      console.log(target)
      console.log(buttonClicked)
      console.log("button",target.matches("button"))
      console.log("img",target.matches("img"))
      console.log("button img", target.matches("button img"))

      if (target.matches('button')) {
        buttonClicked = target;
      } else if (target.matches('button img')) {
        buttonClicked = target.parentNode;
      } else {
        return; // If the target is not a button or button img, do nothing
      }

      const buttonClickedId = buttonClicked.getAttribute('id');
      console.log("buttonClickedId", buttonClickedId);

      const parts = buttonClickedId.split('_');
      const image_id = parts[parts.length - 1];
      $(el).data('value', image_id);
      callback(true);
      $(el).attr('data-value', image_id);
      console.log("image_id", image_id);
      console.log($(el));

      // Notify Shiny of the change
    });

  },
  // Method to unsubscribe from changes
  unsubscribe: function(el) {
    $(el).off('.buttonImageInput');
  },
  receiveMessage: function (el, data) {

    /*
    if (data.hasOwnProperty('value')) {
      this.setValue(el, data.value);
    }
    */
    $(el).trigger('change');

    /*
    let currentlyActive = document.querySelector('.active-btn');

    if (data.active === currentlyActive.id) {
      return;
    }
    currentlyActive.classList.remove('active-btn');

    const updatedButton = el.querySelector('#' + data.active);
    updatedButton.classList.add('active_btn');
    this.setValue(updatedButton, data.active);
    */

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

  }
});

Shiny.inputBindings.register(buttonImageBinding, 'shiny.buttonImageInput');
