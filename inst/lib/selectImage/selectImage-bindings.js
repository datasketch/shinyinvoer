const selectImageBinding = new Shiny.InputBinding();
// Si siempre hay un boton activo
let selectClicked;

$.extend(selectImageBinding, {
  find: function(scope) {
    return $(scope).find('.btn-group');
  },
  initialize: function(el) {
    el.dataset.selected = '';
  },
  getValue: function(el) {
    return el.dataset.selected;
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
  }
});

Shiny.inputBindings.register(selectImageBinding, 'shiny.selectImageInput');
