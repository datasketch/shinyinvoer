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
    this.reorder = options.reorder === true;
    this.isOpen = false;
    
    this.init();
  }

  ColoredSelectize.prototype.init = function() {
    this.createHTML();
    this.bindEvents();
    this.updateDisplay();
    this.renderOptions();
    if (this.reorder) {
      this.makeSortable();
    }
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
      item.dataset.value = key; // Add data-value for drag-and-drop
      
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
    
    // Re-initialize sortable if reorder is enabled
    // But only if this.reorder is true (will be false temporarily during drag-and-drop)
    if (this.reorder) {
      this.makeSortable();
    }
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

  ColoredSelectize.prototype.makeSortable = function() {
    var self = this;
    
    // Clear any existing handlers first
    if (self._sortableHandlers) {
      self.removeSortable();
    }
    
    var draggedElement = null;
    
    var handleDragStart = function(e) {
      draggedElement = this;
      this.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
    };
    
    var handleDragEnd = function(e) {
      if (draggedElement) {
        draggedElement.style.opacity = '1';
      }
      var items = self.selectedContainer.querySelectorAll('.colored-selectize-item');
      items.forEach(function(item) {
        item.style.removeProperty('opacity');
        item.classList.remove('dragover');
      });
      draggedElement = null;
    };
    
    var handleDragOver = function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    };
    
    var handleDragEnter = function(e) {
      this.classList.add('dragover');
    };
    
    var handleDragLeave = function(e) {
      this.classList.remove('dragover');
    };
    
    var handleDrop = function(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      
      if (!draggedElement) {
        return;
      }
      
      var droppedOn = this;
      var draggedValue = draggedElement.dataset.value;
      var droppedOnValue = droppedOn.dataset.value;
      
      if (draggedValue && droppedOnValue && draggedValue !== droppedOnValue) {
        // Get current order
        var currentOrder = Array.from(self.selectedContainer.children).map(function(child) {
          return child.dataset.value;
        });
        
        // Find indices
        var draggedIndex = currentOrder.indexOf(draggedValue);
        var droppedIndex = currentOrder.indexOf(droppedOnValue);
        
        // Reorder array
        var newOrder = currentOrder.slice();
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(droppedIndex, 0, draggedValue);
        
        // Update selected array
        self.selected = newOrder;
        
        // Temporarily disable reorder to prevent infinite loop
        var wasReorderEnabled = self.reorder;
        self.reorder = false;
        
        // Update display (will call makeSortable if reorder is true, but it's false now)
        self.updateDisplay();
        
        // Re-enable reorder
        self.reorder = wasReorderEnabled;
        
        // Make sortable again with fresh handlers
        if (self.reorder) {
          self.makeSortable();
        }
        
        // Trigger change
        self.triggerChange();
      }
      
      this.classList.remove('dragover');
      return false;
    };
    
    // Store handlers for removal later
    self._sortableHandlers = {
      start: handleDragStart,
      end: handleDragEnd,
      over: handleDragOver,
      enter: handleDragEnter,
      leave: handleDragLeave,
      drop: handleDrop
    };
    
    // Attach event handlers to all items
    var items = self.selectedContainer.querySelectorAll('.colored-selectize-item');
    items.forEach(function(item) {
      item.setAttribute('draggable', 'true');
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('dragenter', handleDragEnter);
      item.addEventListener('dragleave', handleDragLeave);
      item.addEventListener('drop', handleDrop);
    });
  };

  ColoredSelectize.prototype.removeSortable = function() {
    var self = this;
    if (!self._sortableHandlers) {
      return;
    }
    
    var items = self.selectedContainer.querySelectorAll('.colored-selectize-item');
    items.forEach(function(item) {
      item.removeAttribute('draggable');
      item.removeEventListener('dragstart', self._sortableHandlers.start);
      item.removeEventListener('dragend', self._sortableHandlers.end);
      item.removeEventListener('dragover', self._sortableHandlers.over);
      item.removeEventListener('dragenter', self._sortableHandlers.enter);
      item.removeEventListener('dragleave', self._sortableHandlers.leave);
      item.removeEventListener('drop', self._sortableHandlers.drop);
      item.classList.remove('dragover');
    });
    
    self._sortableHandlers = null;
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
      var reorder = el.dataset.reorder === 'true';
      
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
        multiple: multiple,
        reorder: reorder
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
