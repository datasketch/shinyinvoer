// Shiny input binding for colored selectize widget
var coloredSelectizeBinding = new Shiny.InputBinding();

$.extend(coloredSelectizeBinding, {
  
  find: function(scope) {
    return $(scope).find('.colored-selectize-widget');
  },
  
  initialize: function(el) {
    console.log('Initializing colored selectize widget');
    var choices = el.dataset.choices;
    var selected = el.dataset.selected;
    var colors = el.dataset.colors;
    var placeholder = el.dataset.placeholder || 'Select options...';
    var multiple = el.dataset.multiple === 'true';
    
    console.log('Raw data:', {choices, selected, colors, placeholder, multiple});
    
    // Parse data from JSON
    var parsedChoices = JSON.parse(choices || '{}');
    var parsedSelected = JSON.parse(selected || '[]');
    var parsedColors = JSON.parse(colors || '{}');
    
    console.log('Parsed data:', {parsedChoices, parsedSelected, parsedColors});
    
    // Initialize the widget
    this.widget = new ColoredSelectize(el, {
      choices: parsedChoices,
      selected: parsedSelected,
      colors: parsedColors,
      placeholder: placeholder,
      multiple: multiple
    });
    
    // Store reference for later use
    el.coloredSelectizeWidget = this.widget;
    console.log('Widget initialized');
  },
  
  getValue: function(el) {
    if (el.coloredSelectizeWidget) {
      return el.coloredSelectizeWidget.getValue();
    }
    return null;
  },
  
  setValue: function(el, value) {
    if (el.coloredSelectizeWidget) {
      el.coloredSelectizeWidget.setValue(value);
    }
  },
  
  receiveMessage: function(el, data) {
    if (el.coloredSelectizeWidget) {
      if (data.choices) {
        // Update choices
        el.coloredSelectizeWidget.choices = data.choices;
        el.coloredSelectizeWidget.renderOptions();
        el.coloredSelectizeWidget.updateDisplay();
      }
      if (data.colors) {
        // Update colors
        el.coloredSelectizeWidget.colors = data.colors;
        el.coloredSelectizeWidget.updateDisplay();
        el.coloredSelectizeWidget.renderOptions();
      }
      if (data.value !== undefined) {
        // Update value
        el.coloredSelectizeWidget.setValue(data.value);
      }
      if (data.placeholder !== undefined) {
        // Update placeholder
        el.coloredSelectizeWidget.placeholder = data.placeholder;
      }
    }
  },
  
  subscribe: function(el, callback) {
    if (el.coloredSelectizeWidget) {
      el.addEventListener('change', function(event) {
        callback();
      });
    }
  },
  
  unsubscribe: function(el) {
    if (el.coloredSelectizeWidget) {
      el.removeEventListener('change', function(event) {
        // Remove event listener
      });
    }
  },
  
  getState: function(el) {
    return {
      value: this.getValue(el),
      choices: el.coloredSelectizeWidget ? el.coloredSelectizeWidget.choices : {},
      colors: el.coloredSelectizeWidget ? el.coloredSelectizeWidget.colors : {}
    };
  }
});

// Register the binding
Shiny.inputBindings.register(coloredSelectizeBinding);
