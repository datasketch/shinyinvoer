const selectImageBinding = new Shiny.InputBinding();

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
  receiveMessage(el, selected) {
    const target = el.querySelector('#' +  selected);
    if (target) {
      $(target).trigger('click');
    } else {
      const button = el.querySelector('.buttonInner.selectImage');
      button.innerHTML = '';
      el.dataset.selected = '';
      $(el).trigger('click');
    }
  }
});

Shiny.inputBindings.register(selectImageBinding, 'shiny.selectImageInput');
