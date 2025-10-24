// Simple Colored Selectize Widget
(function() {
  'use strict';

  function ColoredSelectize(container, options) {
    this.container = container;
    this.choices = options.choices || {};
    this.selected = Array.isArray(options.selected) ? options.selected : [];
    this.colors = options.colors || {};
    this.placeholder = options.placeholder || 'Select options...';
    this.multiple = options.multiple !== false;
    this.isOpen = false;
    
    this.init();
  }

  ColoredSelectize.prototype.init = function() {
    this.createHTML();
    this.bindEvents();
    this.updateDisplay();
    this.renderOptions();
    console.log('Widget initialized with selected:', this.selected);
  };

  ColoredSelectize.prototype.hexToRgb = function(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex color
    var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }
    
    // Handle 3-digit hex colors
    result = /^([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1] + result[1], 16),
        g: parseInt(result[2] + result[2], 16),
        b: parseInt(result[3] + result[3], 16)
      };
    }
    
    return null;
  };

  ColoredSelectize.prototype.createHTML = function() {
    var self = this;
    
    this.container.innerHTML = `
      <div class="colored-selectize-wrapper">
        <div class="colored-selectize-input-container">
          <div class="colored-selectize-selected-container"></div>
          <button type="button" class="colored-selectize-add-button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.63086 8.71387H13.7974" stroke="#212C35" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.71387 3.63086V13.7974" stroke="#212C35" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="colored-selectize-dropdown">
          <ul class="colored-selectize-options-list"></ul>
        </div>
      </div>
    `;
    
    this.wrapper = this.container.querySelector('.colored-selectize-wrapper');
    this.inputContainer = this.container.querySelector('.colored-selectize-input-container');
    this.selectedContainer = this.container.querySelector('.colored-selectize-selected-container');
    this.addButton = this.container.querySelector('.colored-selectize-add-button');
    this.dropdown = this.container.querySelector('.colored-selectize-dropdown');
    this.optionsList = this.container.querySelector('.colored-selectize-options-list');
  };

  ColoredSelectize.prototype.bindEvents = function() {
    var self = this;
    
    this.addButton.addEventListener('click', function(e) {
      e.stopPropagation();
      self.toggleDropdown();
    });
    
    this.inputContainer.addEventListener('click', function(e) {
      e.stopPropagation();
      self.toggleDropdown();
    });
    
    document.addEventListener('click', function(e) {
      if (!self.wrapper.contains(e.target)) {
        self.closeDropdown();
      }
    });
  };

  ColoredSelectize.prototype.toggleDropdown = function() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  };

  ColoredSelectize.prototype.openDropdown = function() {
    this.isOpen = true;
    this.wrapper.classList.add('open');
    this.addButton.classList.add('open');
    this.renderOptions();
  };

  ColoredSelectize.prototype.closeDropdown = function() {
    this.isOpen = false;
    this.wrapper.classList.remove('open');
    this.addButton.classList.remove('open');
  };

  ColoredSelectize.prototype.renderOptions = function() {
    var self = this;
    this.optionsList.innerHTML = '';
    
    // Ensure selected is an array
    if (!Array.isArray(this.selected)) {
      this.selected = [];
    }
    
    Object.keys(this.choices).forEach(function(key) {
      var value = self.choices[key];
      var isSelected = self.selected.includes(key);
      
      if (!isSelected) {
        var li = document.createElement('li');
        li.className = 'colored-selectize-option';
        li.dataset.value = key;
        
        var color = self.colors[key] || '#3498db';
        
        li.innerHTML = `
          <span class="colored-selectize-color-preview" style="background-color: ${color}"></span>
          <span class="colored-selectize-option-text">${value}</span>
        `;
        
        li.addEventListener('click', function(e) {
          e.stopPropagation();
          self.selectOption(key);
        });
        
        self.optionsList.appendChild(li);
      }
    });
  };

  ColoredSelectize.prototype.selectOption = function(key) {
    console.log('Selecting option:', key);
    if (this.multiple) {
      // Check if option is already selected
      if (!this.selected.includes(key)) {
        this.selected.push(key);
      }
    } else {
      this.selected = [key];
      this.closeDropdown();
    }
    console.log('Selected options:', this.selected);
    this.updateDisplay();
    this.triggerChange();
  };

  ColoredSelectize.prototype.updateDisplay = function() {
    var self = this;
    this.selectedContainer.innerHTML = '';
    
    // Ensure selected is an array
    if (!Array.isArray(this.selected)) {
      this.selected = [];
    }
    
    this.selected.forEach(function(key) {
      var value = self.choices[key];
      var color = self.colors[key] || '#3498db';
      
      console.log('Updating display for:', key, 'value:', value, 'color:', color);
      
      var item = document.createElement('div');
      item.className = 'colored-selectize-item';
      
      // Convert hex color to rgba for background
      var rgb = self.hexToRgb(color);
      if (rgb) {
        item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.10)`;
      } else {
        item.style.backgroundColor = 'rgba(52, 152, 219, 0.10)'; // fallback
      }
      
      item.style.borderColor = color;
      item.style.borderRadius = '5px';
      item.style.border = `1px solid ${color}`;
      
      item.innerHTML = `
        <span>${value}</span>
        <button type="button" class="colored-selectize-remove">×</button>
      `;
      
      item.querySelector('.colored-selectize-remove').addEventListener('click', function(e) {
        e.stopPropagation();
        self.removeOption(key);
      });
      
      self.selectedContainer.appendChild(item);
    });
    
    this.addButton.style.display = this.selected.length < Object.keys(this.choices).length ? 'flex' : 'none';
  };

  ColoredSelectize.prototype.removeOption = function(key) {
    var index = this.selected.indexOf(key);
    if (index > -1) {
      this.selected.splice(index, 1);
      this.updateDisplay();
      this.renderOptions();
      this.triggerChange();
    }
  };

  ColoredSelectize.prototype.getValue = function() {
    return this.multiple ? this.selected : (this.selected[0] || null);
  };

  ColoredSelectize.prototype.triggerChange = function() {
    // Trigger Shiny input change
    console.log('Triggering change event, current value:', this.getValue());
    var event = new CustomEvent('change', {
      bubbles: true,
      cancelable: true
    });
    this.container.dispatchEvent(event);
  };

  // Shiny binding
  var coloredSelectizeBinding = new Shiny.InputBinding();
  
  $.extend(coloredSelectizeBinding, {
    find: function(scope) {
      return $(scope).find('.colored-selectize-widget');
    },
    
    initialize: function(el) {
      var choices = JSON.parse(el.dataset.choices || '{}');
      var selected = JSON.parse(el.dataset.selected || '[]');
      var colors = JSON.parse(el.dataset.colors || '{}');
      var placeholder = el.dataset.placeholder || 'Select options...';
      var multiple = el.dataset.multiple === 'true';
      
      console.log('Initializing with data:', {
        choices: choices,
        selected: selected,
        selectedType: typeof selected,
        selectedIsArray: Array.isArray(selected),
        colors: colors,
        placeholder: placeholder,
        multiple: multiple
      });
      
      // Ensure selected is always an array
      if (!Array.isArray(selected)) {
        if (selected && typeof selected === 'object') {
          // If it's an object, convert to array of values
          selected = Object.values(selected);
        } else if (selected !== null && selected !== undefined && selected !== '') {
          // If it's a single value, convert to array
          selected = [selected];
        } else {
          selected = [];
        }
      }
      
      console.log('After conversion, selected:', selected);
      
      // Convert colors array to object if needed
      var colorMapping = {};
      if (Array.isArray(colors)) {
        var choiceKeys = Object.keys(choices);
        choiceKeys.forEach(function(key, index) {
          colorMapping[key] = colors[index] || '#3498db';
        });
      } else {
        colorMapping = colors;
      }
      
      console.log('Color mapping:', colorMapping);
      
      this.widget = new ColoredSelectize(el, {
        choices: choices,
        selected: selected,
        colors: colorMapping,
        placeholder: placeholder,
        multiple: multiple
      });
      
      el.coloredSelectizeWidget = this.widget;
    },
    
    getValue: function(el) {
      var value = el.coloredSelectizeWidget ? el.coloredSelectizeWidget.getValue() : null;
      console.log('Getting value:', value);
      return value;
    },
    
    setValue: function(el, value) {
      if (el.coloredSelectizeWidget) {
        if (value === null || value === undefined) {
          el.coloredSelectizeWidget.selected = [];
        } else {
          el.coloredSelectizeWidget.selected = Array.isArray(value) ? value : [value];
        }
        el.coloredSelectizeWidget.updateDisplay();
        el.coloredSelectizeWidget.renderOptions();
      }
    },
    
    subscribe: function(el, callback) {
      console.log('Subscribing to change events');
      if (el.coloredSelectizeWidget) {
        el.addEventListener('change', function(event) {
          console.log('Change event received, calling callback');
          callback();
        });
      }
    },
    
    unsubscribe: function(el) {
      if (el.coloredSelectizeWidget) {
        el.removeEventListener('change', function() {});
      }
    }
  });
  
  Shiny.inputBindings.register(coloredSelectizeBinding);
  
})();
