var buttonImageInput0Binding = new Shiny.InputBinding();

$.extend(buttonImageInput0Binding, {
  find: function(scope) {
    return $(scope).find(".button-image-input0");
  },
  getValue: function(el) {
    return $(el).data("value");
  },
  setValue: function(el, value) {
    $(el).data("value", value);
  },
  subscribe: function(el, callback) {
    $(el).on("click.buttonImageInput", "img", function(event) {
      var value = $(event.target).attr("id");
      $(el).data("value", value);
      callback(true);
    });
  },
  unsubscribe: function(el) {
    $(el).off(".buttonImageInput");
  }
});

Shiny.inputBindings.register(buttonImageInput0Binding, "shiny.buttonImageInput");

