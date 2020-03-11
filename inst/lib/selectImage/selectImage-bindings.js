const selectImageBinding = new Shiny.InputBinding();

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
    if (data.selected) {
      const target = el.querySelector('#' +  data.selected);
      $(target).trigger('click');
      return;
    }
    const button = el.querySelector('.buttonInner.selectImage');
    button.innerHTML = '';
    el.dataset.selected = '';
    $(el).trigger('click');
    return;
  }
});

Shiny.inputBindings.register(selectImageBinding, 'shiny.selectImageInput');
