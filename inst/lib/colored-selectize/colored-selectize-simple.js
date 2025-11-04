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
    this.grouped = options.grouped === true;
    this.groups = options.groups || null;
    this.groupOrder = options.groupOrder || null;
    this.isOpen = false;
    // Restore hasInteracted state from options if provided (set during initialization)
    this.hasInteracted = options.hasInteracted === true;
    this.initialSelectedLength = this.selected.length; // Store initial selected count
    this.uniqueId = 'paint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); // Unique ID for gradients
    
    this.init();
  }

  ColoredSelectize.prototype.init = function() {
    this.createHTML();
    this.bindEvents();
    this.updateDisplay();
    this.renderOptions();
    
    // Apply width after DOM is ready (for dynamic widgets)
    this.applyWidthFromContainer();
    
    if (this.reorder) {
      this.makeSortable();
    }
    console.log('Widget initialized with selected:', this.selected);
  };
  
  ColoredSelectize.prototype.applyWidthFromContainer = function() {
    // Only apply width if wrapper doesn't have inline style
    // If width was already set in createHTML, don't override it
    if (this.wrapper && !this.wrapper.style.width) {
      // Get width from container's inline style if present
      var containerStyle = this.container.getAttribute('style') || '';
      if (containerStyle.includes('width:')) {
        var widthMatch = containerStyle.match(/width:\s*([^;]+)/);
        if (widthMatch) {
          var widthValue = widthMatch[1].trim();
          this.wrapper.style.width = widthValue;
          console.log('Applied width from container style:', widthValue);
        }
      } else {
        // No width specified, ensure it uses 100%
        this.wrapper.style.width = '100%';
        console.log('Applied default width: 100%');
      }
    }
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
    
    // Get width from container style if specified (handle both inline style and computed style)
    var containerStyle = this.container.getAttribute('style') || '';
    var widthStyle = '';
    var widthValue = null;
    
    // Try to get width from inline style first
    if (containerStyle.includes('width:')) {
      var widthMatch = containerStyle.match(/width:\s*([^;]+)/);
      if (widthMatch) {
        widthValue = widthMatch[1].trim();
      }
    }
    
    // Apply width to wrapper if found
    // If width is specified, use it; otherwise default to 100% (which is already in CSS)
    if (widthValue) {
      widthStyle = ' style="width: ' + widthValue + ';"';
      // Remove width from container style (it's now on the wrapper) only if it was inline
      if (containerStyle.includes('width:')) {
        var newStyle = containerStyle.replace(/width:\s*[^;]+;?\s*/g, '').trim();
        if (newStyle) {
          this.container.setAttribute('style', newStyle);
        } else {
          this.container.removeAttribute('style');
        }
      }
    } else {
      // No width specified, ensure it uses 100% from CSS
      widthStyle = ' style="width: 100%;"';
    }
    
    this.container.innerHTML = 
      '<div class="colored-selectize-wrapper"' + widthStyle + '>' +
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
    
    // Ensure elements exist before binding events
    if (!this.addButton || !this.inputContainer || !this.wrapper) {
      console.error('Cannot bind events: required DOM elements not found');
      return;
    }
    
    this.addButton.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('Add button clicked, toggling dropdown');
      self.hasInteracted = true; // Mark interaction
      self.persistHasInteractedState();
      self.updateDisplay(); // Update display to hide placeholder
      self.toggleDropdown();
    });
    
    this.inputContainer.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('Input container clicked, toggling dropdown');
      self.hasInteracted = true; // Mark interaction
      self.persistHasInteractedState();
      self.updateDisplay(); // Update display to hide placeholder
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
    console.log('Opening dropdown, isOpen:', this.isOpen);
    if (!this.wrapper || !this.addButton || !this.optionsList || !this.dropdown) {
      console.error('Cannot open dropdown: required elements not found', {
        wrapper: !!this.wrapper,
        addButton: !!this.addButton,
        optionsList: !!this.optionsList,
        dropdown: !!this.dropdown
      });
      return;
    }
    this.hasInteracted = true; // Mark interaction when opening dropdown
    this.persistHasInteractedState();
    this.isOpen = true;
    this.wrapper.classList.add('open');
    this.addButton.classList.add('open');
    console.log('Rendering options for dropdown');
    this.renderOptions();
    this.updateDisplay(); // Update display to hide placeholder if needed
    
    // Force display and check computed styles
    var computedStyle = window.getComputedStyle(this.dropdown);
    console.log('Dropdown should be open now, wrapper classes:', this.wrapper.className);
    console.log('Dropdown computed display:', computedStyle.display);
    console.log('Dropdown computed z-index:', computedStyle.zIndex);
    console.log('Dropdown computed position:', computedStyle.position);
    console.log('Wrapper computed overflow:', window.getComputedStyle(this.wrapper).overflow);
    console.log('Container computed overflow:', window.getComputedStyle(this.container).overflow);
    
    // Check if parent has overflow hidden that might clip the dropdown
    var parent = this.wrapper.parentElement;
    var hasOverflowIssue = false;
    while (parent && parent !== document.body) {
      var parentOverflow = window.getComputedStyle(parent).overflow;
      if (parentOverflow === 'hidden' || parentOverflow === 'auto' || parentOverflow === 'scroll') {
        console.warn('Parent element has overflow:', parentOverflow, parent);
        hasOverflowIssue = true;
        break; // Found one, no need to check further
      }
      parent = parent.parentElement;
    }
    
    // If there's an overflow issue, always use fixed positioning to avoid clipping
    if (hasOverflowIssue) {
      console.log('Detected overflow issue, using fixed positioning');
      this.updateFixedPosition();
      this.dropdown.setAttribute('data-use-fixed', 'true');
      
      // Add listeners to update position on scroll/resize (with debouncing)
      var self = this;
      if (!this._fixedPositionListeners) {
        var scrollTimeout;
        var resizeTimeout;
        
        this._fixedPositionListeners = {
          scroll: function() {
            if (self.isOpen && self.dropdown && self.dropdown.getAttribute('data-use-fixed') === 'true') {
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(function() {
                if (self.isOpen && self.dropdown && self.dropdown.getAttribute('data-use-fixed') === 'true') {
                  self.updateFixedPosition();
                }
              }, 16); // ~60fps
            }
          },
          resize: function() {
            if (self.isOpen && self.dropdown && self.dropdown.getAttribute('data-use-fixed') === 'true') {
              clearTimeout(resizeTimeout);
              resizeTimeout = setTimeout(function() {
                if (self.isOpen && self.dropdown && self.dropdown.getAttribute('data-use-fixed') === 'true') {
                  self.updateFixedPosition();
                }
              }, 100);
            }
          }
        };
        window.addEventListener('scroll', this._fixedPositionListeners.scroll, true);
        window.addEventListener('resize', this._fixedPositionListeners.resize);
      }
    } else {
      // No overflow issue, use normal absolute positioning
      this.dropdown.removeAttribute('data-use-fixed');
      this.dropdown.style.position = '';
      this.dropdown.style.top = '';
      this.dropdown.style.left = '';
      this.dropdown.style.width = '';
    }
  };

  ColoredSelectize.prototype.updateFixedPosition = function() {
    if (!this.dropdown || !this.inputContainer || !this.isOpen) {
      return;
    }
    
    // Debounce to prevent infinite loops
    if (this._updateFixedPositionTimeout) {
      clearTimeout(this._updateFixedPositionTimeout);
    }
    
    var self = this;
    this._updateFixedPositionTimeout = setTimeout(function() {
      if (!self.dropdown || !self.inputContainer || !self.isOpen) {
        return;
      }
      
      // position: fixed is relative to viewport, not document, so don't add scroll offsets
      var rect = self.inputContainer.getBoundingClientRect();
      
      // Only update if rect has valid dimensions
      if (rect.width > 0 && rect.height > 0) {
        self.dropdown.style.position = 'fixed';
        self.dropdown.style.top = rect.bottom + 'px';
        self.dropdown.style.left = rect.left + 'px';
        self.dropdown.style.width = rect.width + 'px';
        self.dropdown.style.right = 'auto';
        self.dropdown.style.display = 'block';
        self.dropdown.style.zIndex = '10002'; // Ensure it's above everything
      }
    }, 10);
  };

  ColoredSelectize.prototype.closeDropdown = function() {
    this.isOpen = false;
    if (this.wrapper) {
      this.wrapper.classList.remove('open');
    }
    if (this.addButton) {
      this.addButton.classList.remove('open');
    }
    
    // Clear any pending position updates
    if (this._updateFixedPositionTimeout) {
      clearTimeout(this._updateFixedPositionTimeout);
      this._updateFixedPositionTimeout = null;
    }
    
    // Clean up any inline styles from fixed positioning fallback
    if (this.dropdown && this.dropdown.getAttribute('data-use-fixed') === 'true') {
      this.dropdown.style.position = '';
      this.dropdown.style.top = '';
      this.dropdown.style.left = '';
      this.dropdown.style.width = '';
      this.dropdown.style.right = '';
      this.dropdown.style.zIndex = '';
      this.dropdown.removeAttribute('data-use-fixed');
    }
    
    // Remove listeners if they exist
    if (this._fixedPositionListeners) {
      window.removeEventListener('scroll', this._fixedPositionListeners.scroll, true);
      window.removeEventListener('resize', this._fixedPositionListeners.resize);
      this._fixedPositionListeners = null;
    }
  };

  ColoredSelectize.prototype.renderOptions = function() {
    var self = this;
    
    if (!this.optionsList) {
      console.error('Cannot render options: optionsList not found');
      return;
    }
    
    console.log('Rendering options, selected:', this.selected, 'choices:', Object.keys(this.choices));
    this.optionsList.innerHTML = '';
    
    // Ensure selected is an array
    if (!Array.isArray(this.selected)) {
      this.selected = [];
    }
    
    // Check if we've reached maxItems
    var canAddMore = true;
    if (this.maxItems !== null && this.maxItems !== undefined) {
      var maxItems = parseInt(this.maxItems, 10);
      if (!isNaN(maxItems) && this.selected.length >= maxItems) {
        canAddMore = false;
      }
    }
    
    // Helper function to create an option element
    var createOptionElement = function(key, value, color) {
      var li = document.createElement('li');
      li.className = 'colored-selectize-option';
      li.dataset.value = key;
      
      // Disable option if maxItems reached
      if (!canAddMore) {
        li.classList.add('disabled');
      }
      
      li.innerHTML = `
        <span class="colored-selectize-color-preview" style="background-color: ${color}"></span>
        <span class="colored-selectize-option-text">${key}</span>
      `;
      
      if (canAddMore) {
        li.addEventListener('click', function(e) {
          e.stopPropagation();
          self.selectOption(key);
        });
      }
      
      return li;
    };
    
    // If grouped, render by groups
    if (this.grouped && this.groups && this.groupOrder) {
      // Iterate through groups in order
      this.groupOrder.forEach(function(groupName) {
        // Create group header
        var groupHeader = document.createElement('li');
        groupHeader.className = 'colored-selectize-group-header';
        groupHeader.textContent = groupName + ':';
        self.optionsList.appendChild(groupHeader);
        
        // Get all keys that belong to this group
        var groupKeys = [];
        Object.keys(self.groups).forEach(function(key) {
          if (self.groups[key] === groupName) {
            groupKeys.push(key);
          }
        });
        
        // Render options for this group
        groupKeys.forEach(function(key) {
          var isSelected = self.selected.includes(key);
          
          if (!isSelected) {
            var value = self.choices[key];
            var color = self.colors[key] || '#3498db';
            var li = createOptionElement(key, value, color);
            self.optionsList.appendChild(li);
          }
        });
      });
    } else {
      // Non-grouped: render all options normally
      var optionsCount = 0;
      Object.keys(this.choices).forEach(function(key) {
        var isSelected = self.selected.includes(key);
        
        if (!isSelected) {
          var value = self.choices[key];
          var color = self.colors[key] || '#3498db';
          var li = createOptionElement(key, value, color);
          self.optionsList.appendChild(li);
          optionsCount++;
        }
      });
      console.log('Rendered', optionsCount, 'options in dropdown');
    }
  };

  ColoredSelectize.prototype.selectOption = function(key) {
    console.log('Selecting option:', key);
    this.hasInteracted = true; // Mark that user has interacted
    this.persistHasInteractedState();
    
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
        <span>${key}</span>
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
    // Re-query elements in case DOM was recreated (for dynamic widgets)
    var placeholderIconWrapper = this.container.querySelector('.colored-selectize-placeholder-icon-wrapper');
    var placeholderTextEl = this.container.querySelector('.colored-selectize-placeholder-text');
    
    if (placeholderIconWrapper && placeholderTextEl) {
      // Update references
      this.placeholderIconWrapper = placeholderIconWrapper;
      this.placeholderText = placeholderTextEl;
      
      // Show icon placeholder only if:
      // 1. There are selected items AND
      // 2. User hasn't interacted yet AND
      // 3. Current selected count matches initial count
      var showIconPlaceholder = this.selected.length > 0 && 
                                !this.hasInteracted && 
                                this.selected.length === this.initialSelectedLength;
      
      if (showIconPlaceholder) {
        placeholderIconWrapper.style.display = 'flex';
      } else {
        placeholderIconWrapper.style.display = 'none';
      }
    }
    
    // Show/hide empty placeholder (placeholder - when no selections)
    // Re-query element in case DOM was recreated (for dynamic widgets)
    var emptyPlaceholder = this.container.querySelector('.colored-selectize-empty-placeholder');
    if (emptyPlaceholder) {
      this.emptyPlaceholder = emptyPlaceholder;
      if (this.selected.length === 0) {
        emptyPlaceholder.style.display = 'block';
      } else {
        emptyPlaceholder.style.display = 'none';
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
    this.persistHasInteractedState();
    var index = this.selected.indexOf(key);
    if (index > -1) {
      this.selected.splice(index, 1);
      this.updateDisplay();
      this.renderOptions();
      this.triggerChange();
    }
  };

  ColoredSelectize.prototype.getValue = function() {
    // Map keys to their corresponding values
    var values = this.selected.map(function(key) {
      return this.choices[key] || key;
    }, this);
    return this.multiple ? values : (values[0] || null);
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
  
  ColoredSelectize.prototype.persistHasInteractedState = function() {
    if (!this.container) {
      return;
    }
    
    // Store in dataset as backup
    this.container.dataset.hasInteracted = 'true';
    
    // Store in sessionStorage for persistence across widget recreations
    try {
      var widgetId = this.container.id || 'colored-selectize-default';
      var storageKey = 'colored-selectize-has-interacted-' + widgetId;
      sessionStorage.setItem(storageKey, 'true');
      console.log('Persisted hasInteracted state to sessionStorage for widget:', widgetId);
    } catch (e) {
      // sessionStorage might not be available, that's okay
    }
  };

  // Shiny binding
  var coloredSelectizeBinding = new Shiny.InputBinding();
  
  $.extend(coloredSelectizeBinding, {
    find: function(scope) {
      return $(scope).find('.colored-selectize-widget');
    },
    
    initialize: function(el) {
      // Prevent double initialization
      // Check both the element property and if widget instance exists in DOM
      if (el.coloredSelectizeWidget) {
        // Widget already exists, check if we need to update it instead of reinitializing
        var existingWidget = el.coloredSelectizeWidget;
        var newChoices = JSON.parse(el.dataset.choices || '{}');
        var newSelected = JSON.parse(el.dataset.selected || '[]');
        
        // Convert newSelected to array if needed
        if (!Array.isArray(newSelected)) {
          if (newSelected && typeof newSelected === 'object') {
            newSelected = Object.values(newSelected);
          } else if (newSelected !== null && newSelected !== undefined && newSelected !== '') {
            newSelected = [newSelected];
          } else {
            newSelected = [];
          }
        }
        
        // Check if choices have actually changed
        var choicesChanged = JSON.stringify(existingWidget.choices) !== JSON.stringify(newChoices);
        var selectedChanged = JSON.stringify(existingWidget.selected) !== JSON.stringify(newSelected);
        
        // If only selected changed (not choices), update without reinitializing
        if (!choicesChanged && selectedChanged) {
          console.log('Widget exists, updating selected values only (avoiding reinitialization)');
          existingWidget.selected = newSelected;
          existingWidget.updateDisplay();
          existingWidget.renderOptions();
          return;
        }
        
        // If nothing changed, don't do anything
        if (!choicesChanged && !selectedChanged) {
          console.log('Widget already initialized with same data, skipping');
          return;
        }
        
        // If choices changed, we need to reinitialize, but preserve hasInteracted state
        console.log('Widget exists but choices changed, reinitializing while preserving state');
        var wasInteracted = existingWidget.hasInteracted;
        // Clean up old widget
        if (existingWidget.removeSortable) {
          existingWidget.removeSortable();
        }
      }
      
      var choices = JSON.parse(el.dataset.choices || '{}');
      var selected = JSON.parse(el.dataset.selected || '[]');
      var colors = JSON.parse(el.dataset.colors || '{}');
      var placeholder = el.dataset.placeholder || 'Select options...';
      var placeholderText = el.dataset.placeholderText || '';
      var multiple = el.dataset.multiple === 'true';
      var reorder = el.dataset.reorder === 'true';
      var maxItems = el.dataset.maxItems || null;
      var minItems = el.dataset.minItems || null;
      var grouped = el.dataset.grouped === 'true';
      var groups = grouped ? JSON.parse(el.dataset.groups || '{}') : null;
      var groupOrder = grouped ? JSON.parse(el.dataset.groupOrder || '[]') : null;
      
      console.log('Initializing with data:', {
        choices: choices,
        selected: selected,
        selectedType: typeof selected,
        selectedIsArray: Array.isArray(selected),
        colors: colors,
        placeholder: placeholder,
        multiple: multiple,
        grouped: grouped,
        groups: groups,
        groupOrder: groupOrder
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
      
      // Map selected values to keys if needed (in case user passes values instead of keys)
      selected = selected.map(function(item) {
        // If item is already a key in choices, return it
        if (choices.hasOwnProperty(item)) {
          return item;
        }
        // Otherwise, try to find the key that has this value
        var foundKey = Object.keys(choices).find(function(key) {
          return choices[key] === item;
        });
        // If found, return the key; otherwise return item as-is (backward compatibility)
        return foundKey !== undefined ? foundKey : item;
      });
      
      console.log('After conversion, selected:', selected);
      
      // Check if there's a persisted hasInteracted state from previous widget instance
      // Use sessionStorage to persist across widget recreations
      // IMPORTANT: Do this BEFORE creating the widget so hasInteracted is set correctly
      var widgetId = el.id || 'colored-selectize-default';
      var storageKey = 'colored-selectize-has-interacted-' + widgetId;
      var initialLengthKey = 'colored-selectize-initial-length-' + widgetId;
      var persistedHasInteracted = false;
      var storedInitialLength = null;
      
      try {
        var storedValue = sessionStorage.getItem(storageKey);
        persistedHasInteracted = storedValue === 'true';
        var storedLength = sessionStorage.getItem(initialLengthKey);
        if (storedLength !== null) {
          storedInitialLength = parseInt(storedLength, 10);
        }
      } catch (e) {
        // sessionStorage might not be available, fall back to dataset
        persistedHasInteracted = el.dataset.hasInteracted === 'true';
      }
      
      // Store initial length if not stored yet
      if (storedInitialLength === null && selected.length >= 0) {
        try {
          sessionStorage.setItem(initialLengthKey, selected.length.toString());
          storedInitialLength = selected.length;
        } catch (e) {
          // sessionStorage might not be available
        }
      }
      
      // Determine if user has interacted
      var hasInteractedValue = false;
      if (persistedHasInteracted) {
        hasInteractedValue = true;
        console.log('Will restore hasInteracted state from sessionStorage for widget:', widgetId);
      } else if (storedInitialLength !== null && selected.length !== storedInitialLength) {
        // If selected count is different from stored initial length, user likely interacted
        hasInteractedValue = true;
        console.log('Detected interaction: selected count changed from initial', storedInitialLength, 'to', selected.length);
      }
      
      // Also check dataset as fallback
      if (el.dataset.hasInteracted === 'true') {
        hasInteractedValue = true;
      }
      
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
        minItems: minItems,
        grouped: grouped,
        groups: groups,
        groupOrder: groupOrder,
        hasInteracted: hasInteractedValue // Pass hasInteracted state to constructor
      });
      
      // If hasInteracted was set, persist it immediately
      if (hasInteractedValue && !persistedHasInteracted) {
        this.widget.persistHasInteractedState();
      }
      
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
        var widget = el.coloredSelectizeWidget;
        // Preserve hasInteracted state when updating value programmatically
        var wasInteracted = widget.hasInteracted;
        
        if (value === null || value === undefined) {
          widget.selected = [];
        } else {
          var values = Array.isArray(value) ? value : [value];
          // Map values to keys (find key for each value)
          widget.selected = values.map(function(val) {
            // Find the key that has this value
            var foundKey = Object.keys(widget.choices).find(function(key) {
              return widget.choices[key] === val;
            });
            // If found, return the key; otherwise assume the value itself is the key (backward compatibility)
            return foundKey !== undefined ? foundKey : val;
          });
        }
        
        // Restore hasInteracted state
        widget.hasInteracted = wasInteracted;
        widget.updateDisplay();
        widget.renderOptions();
      }
    },
    
    receiveMessage: function(el, data) {
      if (el.coloredSelectizeWidget) {
        var widget = el.coloredSelectizeWidget;
        // Preserve hasInteracted state when updating dynamically
        var wasInteracted = widget.hasInteracted;
        
        if (data.choices) {
          // Convert colors array to object if needed
          var colorMapping = {};
          if (data.colors) {
            if (Array.isArray(data.colors)) {
              var choiceKeys = Object.keys(data.choices);
              choiceKeys.forEach(function(key, index) {
                colorMapping[key] = data.colors[index] || '#3498db';
              });
            } else {
              colorMapping = data.colors;
            }
            widget.colors = colorMapping;
          }
          
          // Update choices
          widget.choices = data.choices;
          
          // If grouped data is provided, update groups
          if (data.groups) {
            widget.groups = data.groups;
            widget.grouped = true;
          }
          if (data.groupOrder) {
            widget.groupOrder = data.groupOrder;
          }
          
          // Filter out selected items that are no longer in choices
          var hadSelections = widget.selected.length > 0;
          widget.selected = widget.selected.filter(function(key) {
            return widget.choices.hasOwnProperty(key);
          });
          
          // If user had selections before or still has selections, they've interacted
          if (hadSelections || widget.selected.length > 0) {
            widget.hasInteracted = true;
            widget.persistHasInteractedState();
          }
          
          widget.renderOptions();
          widget.updateDisplay();
        }
        
        if (data.colors && !data.choices) {
          // Update colors only if choices weren't updated
          var colorMapping = {};
          if (Array.isArray(data.colors)) {
            var choiceKeys = Object.keys(widget.choices);
            choiceKeys.forEach(function(key, index) {
              colorMapping[key] = data.colors[index] || '#3498db';
            });
          } else {
            colorMapping = data.colors;
          }
          widget.colors = colorMapping;
          widget.updateDisplay();
          widget.renderOptions();
        }
        
        if (data.selected !== undefined) {
          // Update selected value
          var selected = data.selected;
          if (!Array.isArray(selected)) {
            if (selected && typeof selected === 'object') {
              selected = Object.values(selected);
            } else if (selected !== null && selected !== undefined && selected !== '') {
              selected = [selected];
            } else {
              selected = [];
            }
          }
          
          // Map selected values to keys if needed
          selected = selected.map(function(item) {
            if (widget.choices.hasOwnProperty(item)) {
              return item;
            }
            var foundKey = Object.keys(widget.choices).find(function(key) {
              return widget.choices[key] === item;
            });
            return foundKey !== undefined ? foundKey : item;
          });
          
          widget.selected = selected;
          
          // If there are selected items, assume user has interacted
          if (selected.length > 0) {
            widget.hasInteracted = true;
            widget.persistHasInteractedState();
          } else {
            widget.hasInteracted = wasInteracted;
          }
          
          widget.updateDisplay();
          widget.renderOptions();
        }
        
        if (data.placeholder !== undefined) {
          widget.placeholder = data.placeholder;
          if (widget.emptyPlaceholder) {
            widget.emptyPlaceholder.textContent = data.placeholder;
          }
        }
        
        if (data.placeholderText !== undefined) {
          widget.placeholderText = data.placeholderText;
          if (widget.placeholderTextEl) {
            widget.placeholderTextEl.textContent = data.placeholderText;
          }
        }
        
        // If user has selections, they've interacted - preserve that state
        if (widget.selected.length > 0) {
          widget.hasInteracted = true;
          widget.persistHasInteractedState();
        } else {
          // Otherwise, preserve the previous state
          widget.hasInteracted = wasInteracted;
        }
      }
    },
    
    subscribe: function(el, callback) {
      console.log('Subscribing to change events');
      
      // Ensure widget is initialized (for dynamically created widgets)
      var self = this;
      var changeHandler = function(event) {
        console.log('Change event received, calling callback');
        callback();
      };
      
      // Store handler for later removal
      if (!el._coloredSelectizeChangeHandler) {
        el._coloredSelectizeChangeHandler = changeHandler;
      }
      
      if (!el.coloredSelectizeWidget) {
        // If widget doesn't exist, initialize it (for dynamic widgets)
        // Use requestAnimationFrame to ensure DOM is ready
        if (window.requestAnimationFrame) {
          requestAnimationFrame(function() {
            setTimeout(function() {
              console.log('Initializing widget in subscribe (dynamic)');
              self.initialize(el);
              if (el.coloredSelectizeWidget && el._coloredSelectizeChangeHandler) {
                el.addEventListener('change', el._coloredSelectizeChangeHandler);
              }
            }, 10);
          });
        } else {
          setTimeout(function() {
            console.log('Initializing widget in subscribe (dynamic, fallback)');
            self.initialize(el);
            if (el.coloredSelectizeWidget && el._coloredSelectizeChangeHandler) {
              el.addEventListener('change', el._coloredSelectizeChangeHandler);
            }
          }, 10);
        }
      } else {
        // Widget already exists, just add listener
        console.log('Widget already exists, adding change listener');
        el.addEventListener('change', el._coloredSelectizeChangeHandler);
      }
    },
    
    unsubscribe: function(el) {
      if (el._coloredSelectizeChangeHandler) {
        el.removeEventListener('change', el._coloredSelectizeChangeHandler);
        el._coloredSelectizeChangeHandler = null;
      }
    }
  });
  
  Shiny.inputBindings.register(coloredSelectizeBinding);
  
})();
