// Simple Colored Selectize Widget
(function() {
  'use strict';

  // Helper functions
  function normalizeSelectedToArray(selected) {
    if (Array.isArray(selected)) {
      return selected;
    }
    if (selected && typeof selected === 'object') {
      return Object.values(selected);
    }
    if (selected !== null && selected !== undefined && selected !== '') {
      return [selected];
    }
    return [];
  }

  function convertColorsToObject(colors, choices) {
    if (Array.isArray(colors)) {
      var colorMapping = {};
      var choiceKeys = Object.keys(choices);
      choiceKeys.forEach(function(key, index) {
        colorMapping[key] = colors[index] || '#3498db';
      });
      return colorMapping;
    }
    return colors || {};
  }

  function mapSelectedToKeys(selected, choices) {
    return selected.map(function(item) {
      if (choices.hasOwnProperty(item)) {
        return item;
      }
      var foundKey = Object.keys(choices).find(function(key) {
        return choices[key] === item;
      });
      return foundKey !== undefined ? foundKey : item;
    });
  }

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
    this.hasInteracted = options.hasInteracted === true;
    this.initialSelectedLength = this.selected.length;
    this.uniqueId = 'paint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    this.init();
  }

  ColoredSelectize.prototype.init = function() {
    this.createHTML();
    this.bindEvents();
    this.updateDisplay();
    this.renderOptions();
    this.applyWidthFromContainer();
    
    if (this.reorder) {
      this.makeSortable();
    }
  };
  
  ColoredSelectize.prototype.applyWidthFromContainer = function() {
    if (!this.wrapper || this.wrapper.style.width) {
      return;
    }
    
    var containerStyle = this.container.getAttribute('style') || '';
    var widthMatch = containerStyle.match(/width:\s*([^;]+)/);
    
    if (widthMatch) {
      this.wrapper.style.width = widthMatch[1].trim();
    } else {
      this.wrapper.style.width = '100%';
    }
  };

  ColoredSelectize.prototype.hexToRgb = function(hex) {
    hex = hex.replace('#', '');
    var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }
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
    var uniqueId = this.uniqueId;
    var containerStyle = this.container.getAttribute('style') || '';
    var widthMatch = containerStyle.match(/width:\s*([^;]+)/);
    var widthStyle = widthMatch ? ' style="width: ' + widthMatch[1].trim() + ';"' : ' style="width: 100%;"';
    
    if (widthMatch) {
      var newStyle = containerStyle.replace(/width:\s*[^;]+;?\s*/g, '').trim();
      if (newStyle) {
        this.container.setAttribute('style', newStyle);
      } else {
        this.container.removeAttribute('style');
      }
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

  ColoredSelectize.prototype.handleInteraction = function() {
    this.hasInteracted = true;
    this.persistHasInteractedState();
    this.updateDisplay();
  };

  ColoredSelectize.prototype.bindEvents = function() {
    var self = this;
    
    if (!this.addButton || !this.inputContainer || !this.wrapper) {
      return;
    }
    
    this.addButton.addEventListener('click', function(e) {
      e.stopPropagation();
      self.handleInteraction();
      self.toggleDropdown();
    });
    
    this.inputContainer.addEventListener('click', function(e) {
      e.stopPropagation();
      self.handleInteraction();
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
    if (!this.wrapper || !this.addButton || !this.optionsList || !this.dropdown) {
      return;
    }
    
    this.handleInteraction();
    this.isOpen = true;
    this.wrapper.classList.add('open');
    this.addButton.classList.add('open');
    this.renderOptions();
    
    var parent = this.wrapper.parentElement;
    var hasOverflowIssue = false;
    while (parent && parent !== document.body) {
      var parentOverflow = window.getComputedStyle(parent).overflow;
      if (parentOverflow === 'hidden' || parentOverflow === 'auto' || parentOverflow === 'scroll') {
        hasOverflowIssue = true;
        break;
      }
      parent = parent.parentElement;
    }
    
    if (hasOverflowIssue) {
      this.updateFixedPosition();
      this.dropdown.setAttribute('data-use-fixed', 'true');
      
      if (!this._fixedPositionListeners) {
        var self = this;
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
              }, 16);
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
    
    if (this._updateFixedPositionTimeout) {
      clearTimeout(this._updateFixedPositionTimeout);
    }
    
    var self = this;
    this._updateFixedPositionTimeout = setTimeout(function() {
      if (!self.dropdown || !self.inputContainer || !self.isOpen) {
        return;
      }
      
      var rect = self.inputContainer.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        self.dropdown.style.position = 'fixed';
        self.dropdown.style.top = rect.bottom + 'px';
        self.dropdown.style.left = rect.left + 'px';
        self.dropdown.style.width = rect.width + 'px';
        self.dropdown.style.right = 'auto';
        self.dropdown.style.display = 'block';
        self.dropdown.style.zIndex = '10002';
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
    
    if (this._updateFixedPositionTimeout) {
      clearTimeout(this._updateFixedPositionTimeout);
      this._updateFixedPositionTimeout = null;
    }
    
    if (this.dropdown && this.dropdown.getAttribute('data-use-fixed') === 'true') {
      this.dropdown.style.position = '';
      this.dropdown.style.top = '';
      this.dropdown.style.left = '';
      this.dropdown.style.width = '';
      this.dropdown.style.right = '';
      this.dropdown.style.zIndex = '';
      this.dropdown.removeAttribute('data-use-fixed');
    }
    
    if (this._fixedPositionListeners) {
      window.removeEventListener('scroll', this._fixedPositionListeners.scroll, true);
      window.removeEventListener('resize', this._fixedPositionListeners.resize);
      this._fixedPositionListeners = null;
    }
  };

  ColoredSelectize.prototype.renderOptions = function() {
    if (!this.optionsList) {
      return;
    }
    
    this.optionsList.innerHTML = '';
    
    if (!Array.isArray(this.selected)) {
      this.selected = [];
    }
    
    var maxItems = this.maxItems !== null && this.maxItems !== undefined ? parseInt(this.maxItems, 10) : null;
    var canAddMore = !maxItems || isNaN(maxItems) || this.selected.length < maxItems;
    var self = this;
    
    function createOptionElement(key, value, color) {
      var li = document.createElement('li');
      li.className = 'colored-selectize-option';
      li.dataset.value = key;
      
      if (!canAddMore) {
        li.classList.add('disabled');
      }
      
      li.innerHTML = '<span class="colored-selectize-color-preview" style="background-color: ' + color + '"></span>' +
                     '<span class="colored-selectize-option-text">' + key + '</span>';
      
      if (canAddMore) {
        li.addEventListener('click', function(e) {
          e.stopPropagation();
          self.selectOption(key);
        });
      }
      
      return li;
    }
    
    if (this.grouped && this.groups && this.groupOrder) {
      this.groupOrder.forEach(function(groupName) {
        var groupHeader = document.createElement('li');
        groupHeader.className = 'colored-selectize-group-header';
        groupHeader.textContent = groupName + ':';
        self.optionsList.appendChild(groupHeader);
        
        Object.keys(self.groups).forEach(function(key) {
          if (self.groups[key] === groupName && !self.selected.includes(key)) {
            var value = self.choices[key];
            var color = self.colors[key] || '#3498db';
            self.optionsList.appendChild(createOptionElement(key, value, color));
          }
        });
      });
    } else {
      Object.keys(this.choices).forEach(function(key) {
        if (!self.selected.includes(key)) {
          var value = self.choices[key];
          var color = self.colors[key] || '#3498db';
          self.optionsList.appendChild(createOptionElement(key, value, color));
        }
      });
    }
  };

  ColoredSelectize.prototype.selectOption = function(key) {
    this.hasInteracted = true;
    this.persistHasInteractedState();
    
    var maxItems = this.maxItems !== null && this.maxItems !== undefined ? parseInt(this.maxItems, 10) : null;
    if (maxItems && !isNaN(maxItems) && this.selected.length >= maxItems) {
      return;
    }
    
    if (this.multiple) {
      if (!this.selected.includes(key)) {
        this.selected.push(key);
      }
    } else {
      this.selected = [key];
      this.closeDropdown();
    }
    
    this.updateDisplay();
    this.renderOptions();
    this.triggerChange();
  };

  ColoredSelectize.prototype.updateDisplay = function() {
    if (!Array.isArray(this.selected)) {
      this.selected = [];
    }
    
    this.selectedContainer.innerHTML = '';
    var self = this;
    
    this.selected.forEach(function(key) {
      var value = self.choices[key];
      var color = self.colors[key] || '#3498db';
      var rgb = self.hexToRgb(color);
      var bgColor = rgb ? 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.10)' : 'rgba(52, 152, 219, 0.10)';
      
      var item = document.createElement('div');
      item.className = 'colored-selectize-item';
      item.dataset.value = key;
      item.style.backgroundColor = bgColor;
      item.style.borderColor = color;
      item.style.borderRadius = '5px';
      item.style.border = '1px solid ' + color;
      item.innerHTML = '<span>' + key + '</span>' +
                       '<button type="button" class="colored-selectize-remove">×</button>';
      
      item.querySelector('.colored-selectize-remove').addEventListener('click', function(e) {
        e.stopPropagation();
        self.removeOption(key);
      });
      
      self.selectedContainer.appendChild(item);
    });
    
    if (this.addButton && !this.selectedContainer.contains(this.addButton)) {
      this.selectedContainer.appendChild(this.addButton);
    }
    
    var placeholderIconWrapper = this.container.querySelector('.colored-selectize-placeholder-icon-wrapper');
    var placeholderTextEl = this.container.querySelector('.colored-selectize-placeholder-text');
    
    if (placeholderIconWrapper && placeholderTextEl) {
      this.placeholderIconWrapper = placeholderIconWrapper;
      this.placeholderText = placeholderTextEl;
      var showIconPlaceholder = this.selected.length > 0 && 
                                !this.hasInteracted && 
                                this.selected.length === this.initialSelectedLength;
      placeholderIconWrapper.style.display = showIconPlaceholder ? 'flex' : 'none';
    }
    
    var emptyPlaceholder = this.container.querySelector('.colored-selectize-empty-placeholder');
    if (emptyPlaceholder) {
      this.emptyPlaceholder = emptyPlaceholder;
      emptyPlaceholder.style.display = this.selected.length === 0 ? 'block' : 'none';
    }
    
    this.addButton.style.display = this.selected.length < Object.keys(this.choices).length ? 'flex' : 'none';
    
    if (this.reorder) {
      this.makeSortable();
    }
  };

  ColoredSelectize.prototype.removeOption = function(key) {
    this.hasInteracted = true;
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
    var self = this;
    var values = this.selected.map(function(key) {
      return self.choices[key] || key;
    });
    return this.multiple ? values : (values[0] || null);
  };

  ColoredSelectize.prototype.triggerChange = function() {
    var event = new CustomEvent('change', {
      bubbles: true,
      cancelable: true
    });
    this.container.dispatchEvent(event);
  };

  ColoredSelectize.prototype.makeSortable = function() {
    var self = this;
    
    if (self._sortableHandlers) {
      self.removeSortable();
    }
    
    var draggedElement = null;
    
    function handleDragStart(e) {
      draggedElement = this;
      this.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragEnd(e) {
      if (draggedElement) {
        draggedElement.style.opacity = '1';
      }
      var items = self.selectedContainer.querySelectorAll('.colored-selectize-item');
      items.forEach(function(item) {
        item.style.removeProperty('opacity');
        item.classList.remove('dragover');
      });
      draggedElement = null;
    }
    
    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    }
    
    function handleDragEnter(e) {
      this.classList.add('dragover');
    }
    
    function handleDragLeave(e) {
      this.classList.remove('dragover');
    }
    
    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      
      if (!draggedElement) {
        return;
      }
      
      var draggedValue = draggedElement.dataset.value;
      var droppedOnValue = this.dataset.value;
      
      if (draggedValue && droppedOnValue && draggedValue !== droppedOnValue) {
        var items = self.selectedContainer.querySelectorAll('.colored-selectize-item');
        var currentOrder = Array.from(items).map(function(child) {
          return child.dataset.value;
        });
        
        var draggedIndex = currentOrder.indexOf(draggedValue);
        var droppedIndex = currentOrder.indexOf(droppedOnValue);
        
        var newOrder = currentOrder.slice();
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(droppedIndex, 0, draggedValue);
        
        self.selected = newOrder;
        var wasReorderEnabled = self.reorder;
        self.reorder = false;
        self.updateDisplay();
        self.reorder = wasReorderEnabled;
        
        if (self.reorder) {
          self.makeSortable();
        }
        
        self.triggerChange();
      }
      
      this.classList.remove('dragover');
      return false;
    }
    
    self._sortableHandlers = {
      start: handleDragStart,
      end: handleDragEnd,
      over: handleDragOver,
      enter: handleDragEnter,
      leave: handleDragLeave,
      drop: handleDrop
    };
    
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
    if (!this._sortableHandlers) {
      return;
    }
    
    var items = this.selectedContainer.querySelectorAll('.colored-selectize-item');
    var handlers = this._sortableHandlers;
    items.forEach(function(item) {
      item.removeAttribute('draggable');
      item.removeEventListener('dragstart', handlers.start);
      item.removeEventListener('dragend', handlers.end);
      item.removeEventListener('dragover', handlers.over);
      item.removeEventListener('dragenter', handlers.enter);
      item.removeEventListener('dragleave', handlers.leave);
      item.removeEventListener('drop', handlers.drop);
      item.classList.remove('dragover');
    });
    
    this._sortableHandlers = null;
  };
  
  ColoredSelectize.prototype.persistHasInteractedState = function() {
    if (!this.container) {
      return;
    }
    
    this.container.dataset.hasInteracted = 'true';
    
    try {
      var widgetId = this.container.id || 'colored-selectize-default';
      var storageKey = 'colored-selectize-has-interacted-' + widgetId;
      sessionStorage.setItem(storageKey, 'true');
    } catch (e) {
      // sessionStorage might not be available
    }
  };

  // Shiny binding
  var coloredSelectizeBinding = new Shiny.InputBinding();
  
  $.extend(coloredSelectizeBinding, {
    find: function(scope) {
      return $(scope).find('.colored-selectize-widget');
    },
    
    initialize: function(el) {
      if (el.coloredSelectizeWidget) {
        var existingWidget = el.coloredSelectizeWidget;
        var newChoices = JSON.parse(el.dataset.choices || '{}');
        var newSelected = normalizeSelectedToArray(JSON.parse(el.dataset.selected || '[]'));
        
        var choicesChanged = JSON.stringify(existingWidget.choices) !== JSON.stringify(newChoices);
        var selectedChanged = JSON.stringify(existingWidget.selected) !== JSON.stringify(newSelected);
        
        if (!choicesChanged && selectedChanged) {
          existingWidget.selected = newSelected;
          existingWidget.updateDisplay();
          existingWidget.renderOptions();
          return;
        }
        
        if (!choicesChanged && !selectedChanged) {
          return;
        }
        
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
      
      selected = normalizeSelectedToArray(selected);
      selected = mapSelectedToKeys(selected, choices);
      
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
        persistedHasInteracted = el.dataset.hasInteracted === 'true';
      }
      
      if (storedInitialLength === null && selected.length >= 0) {
        try {
          sessionStorage.setItem(initialLengthKey, selected.length.toString());
          storedInitialLength = selected.length;
        } catch (e) {
          // sessionStorage might not be available
        }
      }
      
      var hasInteractedValue = persistedHasInteracted || 
                               (storedInitialLength !== null && selected.length !== storedInitialLength) ||
                               (el.dataset.hasInteracted === 'true');
      
      var colorMapping = convertColorsToObject(colors, choices);
      
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
        hasInteracted: hasInteractedValue
      });
      
      if (hasInteractedValue && !persistedHasInteracted) {
        this.widget.persistHasInteractedState();
      }
      
      if (this.widget.placeholderText && this.widget.placeholderText.textContent !== undefined) {
        this.widget.placeholderText.textContent = placeholderText;
      }
      
      if (this.widget.emptyPlaceholder) {
        this.widget.emptyPlaceholder.textContent = placeholder;
      }
      
      el.coloredSelectizeWidget = this.widget;
    },
    
    getValue: function(el) {
      return el.coloredSelectizeWidget ? el.coloredSelectizeWidget.getValue() : null;
    },
    
    setValue: function(el, value) {
      if (el.coloredSelectizeWidget) {
        var widget = el.coloredSelectizeWidget;
        var wasInteracted = widget.hasInteracted;
        
        if (value === null || value === undefined) {
          widget.selected = [];
        } else {
          var values = Array.isArray(value) ? value : [value];
          widget.selected = mapSelectedToKeys(values, widget.choices);
        }
        
        widget.hasInteracted = wasInteracted;
        widget.updateDisplay();
        widget.renderOptions();
      }
    },
    
    receiveMessage: function(el, data) {
      if (!el.coloredSelectizeWidget) {
        return;
      }
      
      var widget = el.coloredSelectizeWidget;
      var wasInteracted = widget.hasInteracted;
      
      if (data.choices) {
        if (data.colors) {
          widget.colors = convertColorsToObject(data.colors, data.choices);
        }
        
        widget.choices = data.choices;
        
        if (data.groups) {
          widget.groups = data.groups;
          widget.grouped = true;
        }
        if (data.groupOrder) {
          widget.groupOrder = data.groupOrder;
        }
        
        var hadSelections = widget.selected.length > 0;
        widget.selected = widget.selected.filter(function(key) {
          return widget.choices.hasOwnProperty(key);
        });
        
        if (hadSelections || widget.selected.length > 0) {
          widget.hasInteracted = true;
          widget.persistHasInteractedState();
        }
        
        widget.renderOptions();
        widget.updateDisplay();
      }
      
      if (data.colors && !data.choices) {
        widget.colors = convertColorsToObject(data.colors, widget.choices);
        widget.updateDisplay();
        widget.renderOptions();
      }
      
      if (data.selected !== undefined) {
        var selected = normalizeSelectedToArray(data.selected);
        selected = mapSelectedToKeys(selected, widget.choices);
        widget.selected = selected;
        
        widget.hasInteracted = selected.length > 0 ? true : wasInteracted;
        if (selected.length > 0) {
          widget.persistHasInteractedState();
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
      
      if (widget.selected.length > 0) {
        widget.hasInteracted = true;
        widget.persistHasInteractedState();
      } else {
        widget.hasInteracted = wasInteracted;
      }
    },
    
    subscribe: function(el, callback) {
      var self = this;
      var changeHandler = function(event) {
        callback();
      };
      
      if (!el._coloredSelectizeChangeHandler) {
        el._coloredSelectizeChangeHandler = changeHandler;
      }
      
      if (!el.coloredSelectizeWidget) {
        var initWidget = function() {
          self.initialize(el);
          if (el.coloredSelectizeWidget && el._coloredSelectizeChangeHandler) {
            el.addEventListener('change', el._coloredSelectizeChangeHandler);
          }
        };
        
        if (window.requestAnimationFrame) {
          requestAnimationFrame(function() {
            setTimeout(initWidget, 10);
          });
        } else {
          setTimeout(initWidget, 10);
        }
      } else {
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
