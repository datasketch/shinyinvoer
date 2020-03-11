const selectImageBinding = new Shiny.InputBinding();
// Si siempre hay un boton activo
let selectClicked;

$.extend(selectImageBinding, {
  find: function(scope) {
    return $(scope).find('.btn-group');
  },
  initialize: function(el) {
    //this.setValue(el, $el.attr('data-init-value'));
    var $el = $(el);
    el.dataset.selected = $el.attr('data-init-value');
  },
  getValue: function(el) {
    return el.dataset.selected;
  },
  setValue: function(el, value) {
    //$(el).colourpicker('value', value);
    el.dataset.selected = value;
  },
  subscribe: function(el, callback) {
    // Enlaza eventos al elemento que se creo
    $(el).on('click.selectImageBinding', function(event) {
      let target = event.target;
      console.log(target);
      if (target.matches('a.selectImage')) {
        el.dataset.selected = target.id;
      } else if (target.matches('a.selectImage img')) {
        target = target.parentNode;
        el.dataset.selected = target.id;
      } else if (target.matches('li.selectImage')) {
        target = target.querySelector('a.selectImage');
        el.dataset.selected = target.id;
      }
      const button = el.querySelector('.buttonInner.selectImage');
      if (target.matches('a')) {
        button.innerHTML = target.innerHTML;
      }
      callback();
    });
  },
  receiveMessage: function(el, data) {
    var $el = $(el);
    if(data.selected){
      var elId = "#" + data.selected;
      var selected = el.querySelector(elId);
      el.dataset.selected = data.selected;
      const button = el.querySelector('.buttonInner.selectImage');
      button.innerHTML = selected.innerHTML;
    }
    $el.trigger("click");
  }
});

Shiny.inputBindings.register(selectImageBinding, 'shiny.selectImageInput');
