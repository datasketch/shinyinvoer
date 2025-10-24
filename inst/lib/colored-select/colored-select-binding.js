// Shiny input binding for colored select widget
var coloredSelectBinding = new Shiny.InputBinding();

$.extend(coloredSelectBinding, {
  
  find: function(scope) {
    return $(scope).find('.colored-select-widget');
  },
  
  initialize: function(el) {
    var options = el.dataset.options;
    var placeholder = el.dataset.placeholder || 'Select an option...';
    var multiple = el.dataset.multiple === 'true';
    var selected = el.dataset.selected;
    
    // Parse options from JSON
    var parsedOptions = JSON.parse(options || '[]');
    
    // Parse selected values
    var selectedValues = [];
    if (selected) {
      try {
        selectedValues = JSON.parse(selected);
        if (!Array.isArray(selectedValues)) {
          selectedValues = [selectedValues];
        }
      } catch (e) {
        selectedValues = [];
      }
    }
    
    // Initialize the widget
    this.widget = new ColoredSelect(el, parsedOptions, placeholder, multiple, selectedValues);
    
    // Store reference for later use
    el.coloredSelectWidget = this.widget;
  },
  
  getValue: function(el) {
    if (el.coloredSelectWidget) {
      return el.coloredSelectWidget.getValue();
    }
    return null;
  },
  
  setValue: function(el, value) {
    if (el.coloredSelectWidget) {
      el.coloredSelectWidget.setValue(value);
    }
  },
  
  receiveMessage: function(el, data) {
    if (el.coloredSelectWidget) {
      if (data.options) {
        // Update options
        el.coloredSelectWidget.options = data.options;
        el.coloredSelectWidget.renderOptions();
      }
      if (data.value !== undefined) {
        // Update value
        el.coloredSelectWidget.setValue(data.value);
      }
      if (data.placeholder !== undefined) {
        // Update placeholder
        el.input.placeholder = data.placeholder;
      }
    }
  },
  
  subscribe: function(el, callback) {
    if (el.coloredSelectWidget) {
      el.addEventListener('change', function(event) {
        callback();
      });
    }
  },
  
  unsubscribe: function(el) {
    if (el.coloredSelectWidget) {
      el.removeEventListener('change', function(event) {
        // Remove event listener
      });
    }
  },
  
  getState: function(el) {
    return {
      value: this.getValue(el),
      options: el.coloredSelectWidget ? el.coloredSelectWidget.options : []
    };
  }
});

// Register the binding
Shiny.inputBindings.register(coloredSelectBinding);
