// step i
var binding = new Shiny.InputBinding();

// step ii
$.extend(binding, {

  find: function(scope) {
      return $(scope).find('.input-autosuggest');
  },

  initialize: function(el){
      var data = el.dataset.top;
      var placeholder = el.dataset.placeholder
      new Autosuggest(el, JSON.parse(data), placeholder);
  },

  getValue: function(el) {
    var input = el.querySelector('input');
    document.querySelector('.results-list').innerHTML = "";
    return input.value;
  },

  subscribe: function(el, callback) {
      el.addEventListener('keyup', function(event){
        var target = event.target;
        console.log('holiiii', event);
       if (event.keyCode === 13) {
         callback();
       }
      });

      el.addEventListener('click', function (event) {
        var target = event.target;
        if (!target.matches('.results-item')) {
          return
        }
        el.querySelector('input').value = target.textContent;
        callback();
      });
  }

});

// step iii
Shiny.inputBindings.register(binding);
