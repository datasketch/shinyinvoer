// Simple Colored Selectize Widget
(function() {
  'use strict';

  function ColoredSelectize(container, options) {
    this.container = container;
    this.choices = options.choices || {};
    this.selected = Array.isArray(options.selected) ? options.selected : [];
    this.colors = options.colors || {};
    this.placeholder = options.placeholder || 'Select options...';
    this.placeholderText = options.placeholderText || '';
    this.multiple = options.multiple !== false;
    this.reorder = options.reorder === true;
    this.maxItems = options.maxItems || null;
    this.minItems = options.minItems || null;
    this.isOpen = false;
    this.hasInteracted = false; // Track if user has interacted
    this.initialSelectedLength = this.selected.length; // Store initial selected count
    this.uniqueId = 'paint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); // Unique ID for gradients
    
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
    
    var uniqueId = this.uniqueId;
    
    this.container.innerHTML = 
      '<div class="colored-selectize-wrapper">' +
        '<div class="colored-selectize-input-container">' +
          '<div class="colored-selectize-selected-container">' +
            '<button type="button" class="colored-selectize-add-button">' +
              '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M3.63086 8.71387H13.7974" stroke="#212C35" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>' +
                '<path d="M8.71387 3.63086V13.7974" stroke="#212C35" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
          '<div class="colored-selectize-placeholder-icon-wrapper">' +
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="colored-selectize-placeholder-icon">' +
              '<path d="M7.35975 11.928L6.75 14.0625L6.14025 11.928C5.98265 11.3766 5.68717 10.8745 5.28169 10.4691C4.87621 10.0636 4.37411 9.7681 3.82275 9.6105L1.6875 9L3.822 8.39025C4.37336 8.23265 4.87546 7.93717 5.28094 7.53169C5.68642 7.12621 5.9819 6.6241 6.1395 6.07275L6.75 3.9375L7.35975 6.072C7.51735 6.62335 7.81283 7.12546 8.21831 7.53094C8.62379 7.93642 9.1259 8.2319 9.67725 8.3895L11.8125 9L9.678 9.60975C9.12665 9.76735 8.62454 10.0628 8.21906 10.4683C7.81358 10.8738 7.5181 11.3759 7.3605 11.9272L7.35975 11.928ZM13.6943 6.53625L13.5 7.3125L13.3057 6.53625C13.1946 6.09119 12.9645 5.68472 12.6402 5.36027C12.3159 5.03583 11.9095 4.80562 11.4645 4.69425L10.6875 4.5L11.4645 4.30575C11.9095 4.19438 12.3159 3.96417 12.6402 3.63973C12.9645 3.31528 13.1946 2.90881 13.3057 2.46375L13.5 1.6875L13.6943 2.46375C13.8055 2.9089 14.0357 3.31544 14.3601 3.63989C14.6846 3.96434 15.0911 4.1945 15.5363 4.30575L16.3125 4.5L15.5363 4.69425C15.0911 4.8055 14.6846 5.03566 14.3601 5.36011C14.0357 5.68456 13.8055 6.0911 13.6943 6.53625ZM12.6705 15.4252L12.375 16.3125L12.0795 15.4252C11.9967 15.1767 11.8571 14.9509 11.6718 14.7657C11.4866 14.5804 11.2608 14.4408 11.0122 14.358L10.125 14.0625L11.0122 13.767C11.2608 13.6842 11.4866 13.5446 11.6718 13.3593C11.8571 13.1741 11.9967 12.9483 12.0795 12.6998L12.375 11.8125L12.6705 12.6998C12.7533 12.9483 12.8929 13.1741 13.0782 13.3593C13.2634 13.5446 13.4892 13.6842 13.7377 13.767L14.625 14.0625L13.7377 14.358C13.4892 14.4408 13.2634 14.5804 13.0782 14.7657C12.8929 14.9509 12.7533 15.1767 12.6705 15.4252Z" fill="url(#' + uniqueId + ')"/>' +
              '<defs>' +
                '<linearGradient id="' + uniqueId + '" x1="5.5" y1="5.5" x2="16" y2="16" gradientUnits="userSpaceOnUse">' +
                  '<stop stop-color="#DA1C95"/>' +
                  '<stop offset="1" stop-color="#5141FB"/>' +
                '</linearGradient>' +
              '</defs>' +
            '</svg>' +
            '<span class="colored-selectize-placeholder-text"></span>' +
          '</div>' +
          '<div class="colored-selectize-empty-placeholder"></div>' +
        '</div>' +
        '<div class="colored-selectize-dropdown">' +
          '<ul class="colored-selectize-options-list"></ul>' +
        '</div>' +
      '</div>';
    
    this.placeholderIconWrapper = this.container.querySelector('.colored-selectize-placeholder-icon-wrapper');
    this.placeholderText = this.container.querySelector('.colored-selectize-placeholder-text');
    this.emptyPlaceholder = this.container.querySelector('.colored-selectize-empty-placeholder');
    
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
      
      // Check if we've reached maxItems
      var canAddMore = true;
      if (self.maxItems !== null && self.maxItems !== undefined) {
        var maxItems = parseInt(self.maxItems, 10);
        if (!isNaN(maxItems) && self.selected.length >= maxItems) {
          canAddMore = false;
        }
      }
      
      if (!isSelected) {
        var li = document.createElement('li');
        li.className = 'colored-selectize-option';
        li.dataset.value = key;
        
        var color = self.colors[key] || '#3498db';
        
        // Disable option if maxItems reached
        if (!canAddMore) {
          li.classList.add('disabled');
        }
        
        li.innerHTML = `
          <span class="colored-selectize-color-preview" style="background-color: ${color}"></span>
          <span class="colored-selectize-option-text">${value}</span>
        `;
        
        if (canAddMore) {
          li.addEventListener('click', function(e) {
            e.stopPropagation();
            self.selectOption(key);
          });
        }
        
        self.optionsList.appendChild(li);
      }
    });
  };

  ColoredSelectize.prototype.selectOption = function(key) {
    console.log('Selecting option:', key);
    this.hasInteracted = true; // Mark that user has interacted
    
    // Check maxItems constraint
    if (this.maxItems !== null && this.maxItems !== undefined) {
      var maxItems = parseInt(this.maxItems, 10);
      if (!isNaN(maxItems) && this.selected.length >= maxItems) {
        console.log('Maximum items reached:', maxItems);
        return; // Don't allow more selections
      }
    }
    
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
    this.renderOptions();
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
    
    // Add button after items (will be positioned at the end by CSS)
    if (this.addButton && !this.selectedContainer.contains(this.addButton)) {
      this.selectedContainer.appendChild(this.addButton);
    }
    
    // Show/hide icon placeholder (placeholderText - when there are initial selections)
    if (self.placeholderIconWrapper && self.placeholderText) {
      // Show icon placeholder only if:
      // 1. There are selected items AND
      // 2. User hasn't interacted yet AND
      // 3. Current selected count matches initial count
      var showIconPlaceholder = this.selected.length > 0 && 
                                !this.hasInteracted && 
                                this.selected.length === this.initialSelectedLength;
      
      if (showIconPlaceholder) {
        self.placeholderIconWrapper.style.display = 'flex';
      } else {
        self.placeholderIconWrapper.style.display = 'none';
      }
    }
    
    // Show/hide empty placeholder (placeholder - when no selections)
    if (self.emptyPlaceholder) {
      if (this.selected.length === 0) {
        self.emptyPlaceholder.style.display = 'block';
      } else {
        self.emptyPlaceholder.style.display = 'none';
      }
    }
    
    this.addButton.style.display = this.selected.length < Object.keys(this.choices).length ? 'flex' : 'none';
    
    // Re-initialize sortable if reorder is enabled
    // But only if this.reorder is true (will be false temporarily during drag-and-drop)
    if (this.reorder) {
      this.makeSortable();
    }
  };

  ColoredSelectize.prototype.removeOption = function(key) {
    this.hasInteracted = true; // Mark that user has interacted
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
        // Get current order (only items, not the button)
        var items = self.selectedContainer.querySelectorAll('.colored-selectize-item');
        var currentOrder = Array.from(items).map(function(child) {
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
      var placeholderText = el.dataset.placeholderText || '';
      var multiple = el.dataset.multiple === 'true';
      var reorder = el.dataset.reorder === 'true';
      var maxItems = el.dataset.maxItems || null;
      var minItems = el.dataset.minItems || null;
      
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
        placeholderText: placeholderText,
        multiple: multiple,
        reorder: reorder,
        maxItems: maxItems,
        minItems: minItems
      });
      
      // Set placeholder text for icon placeholder
      if (this.widget.placeholderText && this.widget.placeholderText.textContent !== undefined) {
        this.widget.placeholderText.textContent = placeholderText;
      }
      
      // Set placeholder text for empty placeholder
      if (this.widget.emptyPlaceholder) {
        this.widget.emptyPlaceholder.textContent = placeholder;
      }
      
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
