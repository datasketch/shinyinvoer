var buttonImageInputBinding = new Shiny.InputBinding();

$.extend(buttonImageInputBinding, {
  find: function(scope) {
    return $(scope).find(".button-image-input");
  },
  getValue: function(el) {
    return $(el).data("value");
  },
  setValue: function(el, value) {
    $(el).data("value", value);
  },
  subscribe: function(el, callback) {

    // Need setTimeout for inputs created dynamically with uiOutput
    setTimeout(function() {
      // Set initial value from the active button when the input binding is initialized
      var initialActiveButton = $(el).find('.active-btn');
      if (initialActiveButton.length) {
        var initialValue = initialActiveButton.attr("id").split('_').pop();
        $(el).data("value", initialValue);
        callback(true);
      }
    }, 0);

    $(el).on("click.buttonImageInput", function(event) {
    
      const target = event.target;
      let buttonElement;

      if (target.matches('div img')) {
        buttonElement = target.parentNode;
      } else if (target.matches('.button-style')) {
        buttonElement = target;
      } else if (target.matches('.button-container')){
        buttonElement = target.querySelector('.button-style');
      } else {
        return; // If the target is not a div or div img, do nothing
      }

      // Prevent action if the button is disabled
      if ($(buttonElement).hasClass('disabled-btn')) {
        return;
      }

      // Get the ID and split to get the image ID
      var value = $(buttonElement).attr("id").split('_');
      const image_id = value[value.length - 1];
      console.log(image_id);

      // Update the value
      $(el).data("value", image_id);

      // Remove active-btn class from all buttons
      $(el).find('.button-style').removeClass('active-btn');

      // Add active-btn class to the clicked button
      $(buttonElement).addClass('active-btn');

      // Notify Shiny of the change
      callback(true);
    });
  },
  receiveMessage: function(el, data) {
    // Update the active button based on the data from Shiny
        console.log("active", data.active);

    var newActiveButton = $(el).find('#' + $(el).attr("id") + "_" + data.active);
    console.log("newActive", newActiveButton);

    if (newActiveButton.length) {
      // Remove active-btn class from all buttons
      $(el).find('.button-style').removeClass('active-btn');

      // Add active-btn class to the new active button
      newActiveButton.addClass('active-btn');

      // Update the value
      this.setValue(el, data.active);

      // Notify Shiny of the change
      $(el).trigger("change");
    }
  },
  unsubscribe: function(el) {
    $(el).off(".buttonImageInput");
  }
});

Shiny.inputBindings.register(buttonImageInputBinding, "shiny.buttonImageInput");




