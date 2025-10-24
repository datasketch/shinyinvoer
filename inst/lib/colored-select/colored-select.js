function ColoredSelect(container, options, placeholder, multiple = false, selectedValues = []) {
  this.container = container;
  this.options = options;
  this.placeholder = placeholder;
  this.multiple = multiple;
  this.selectedValues = selectedValues || [];
  this.selectedItems = [];
  this.isOpen = false;
  
  this.handleInputClick = this.handleInputClick.bind(this);
  this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
  this.handleOptionClick = this.handleOptionClick.bind(this);
  this.handleDocumentClick = this.handleDocumentClick.bind(this);
  this.handleItemRemove = this.handleItemRemove.bind(this);
  
  this.createDOM();
  this.registerListeners();
  this.initializeSelected();
}

ColoredSelect.prototype.createDOM = function() {
  // Create main container
  this.wrapper = document.createElement('div');
  this.wrapper.className = 'colored-select-wrapper';
  
  // Create input container
  this.inputContainer = document.createElement('div');
  this.inputContainer.className = 'colored-select-input-container';
  
  // Create selected items container (for multiple selection)
  this.selectedContainer = document.createElement('div');
  this.selectedContainer.className = 'colored-select-selected-container';
  
  // Create input field
  this.input = document.createElement('input');
  this.input.type = 'text';
  this.input.placeholder = this.placeholder;
  this.input.className = 'colored-select-input';
  this.input.readOnly = true;
  
  // Create dropdown arrow
  this.arrow = document.createElement('span');
  this.arrow.className = 'colored-select-arrow';
  this.arrow.innerHTML = '▼';
  
  // Create dropdown list
  this.dropdown = document.createElement('ul');
  this.dropdown.className = 'colored-select-dropdown';
  
  // Assemble the structure
  this.inputContainer.appendChild(this.selectedContainer);
  this.inputContainer.appendChild(this.input);
  this.inputContainer.appendChild(this.arrow);
  
  this.wrapper.appendChild(this.inputContainer);
  this.wrapper.appendChild(this.dropdown);
  
  this.container.appendChild(this.wrapper);
  
  this.renderOptions();
}

ColoredSelect.prototype.initializeSelected = function() {
  if (this.selectedValues.length > 0) {
    this.selectedItems = this.selectedValues.map(value => 
      this.options.find(option => option.value === value)
    ).filter(Boolean);
    this.updateDisplay();
  }
}

ColoredSelect.prototype.renderOptions = function() {
  this.dropdown.innerHTML = '';
  
  if (!this.options || this.options.length === 0) {
    return;
  }
  
  this.options.forEach((option, index) => {
    const li = document.createElement('li');
    li.className = 'colored-select-option';
    li.dataset.value = option.value;
    li.dataset.index = index;
    
    // Create option content with color preview
    const colorPreview = document.createElement('span');
    colorPreview.className = 'colored-select-color-preview';
    colorPreview.style.backgroundColor = option.color || '#e0e0e0';
    
    const text = document.createElement('span');
    text.className = 'colored-select-option-text';
    text.textContent = option.label || option.value;
    
    li.appendChild(colorPreview);
    li.appendChild(text);
    
    // Add click handler
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleOptionClick(option, index);
    });
    
    this.dropdown.appendChild(li);
  });
}

ColoredSelect.prototype.handleOptionClick = function(option, index) {
  if (this.multiple) {
    this.toggleSelection(option);
  } else {
    this.selectOption(option);
    this.closeDropdown();
  }
  this.updateDisplay();
  this.triggerChange();
}

ColoredSelect.prototype.toggleSelection = function(option) {
  const index = this.selectedValues.indexOf(option.value);
  if (index > -1) {
    this.selectedValues.splice(index, 1);
    this.selectedItems.splice(index, 1);
  } else {
    this.selectedValues.push(option.value);
    this.selectedItems.push(option);
  }
}

ColoredSelect.prototype.selectOption = function(option) {
  this.selectedValues = [option.value];
  this.selectedItems = [option];
}

ColoredSelect.prototype.updateDisplay = function() {
  if (this.multiple) {
    this.updateMultipleDisplay();
  } else {
    this.updateSingleDisplay();
  }
}

ColoredSelect.prototype.updateMultipleDisplay = function() {
  this.selectedContainer.innerHTML = '';
  this.input.style.display = this.selectedItems.length > 0 ? 'none' : 'block';
  
  this.selectedItems.forEach((item, index) => {
    const selectedItem = document.createElement('div');
    selectedItem.className = 'colored-select-selected-item';
    selectedItem.style.backgroundColor = item.color || '#e0e0e0';
    
    const text = document.createElement('span');
    text.textContent = item.label || item.value;
    
    const removeBtn = document.createElement('span');
    removeBtn.className = 'colored-select-remove';
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleItemRemove(index);
    });
    
    selectedItem.appendChild(text);
    selectedItem.appendChild(removeBtn);
    this.selectedContainer.appendChild(selectedItem);
  });
}

ColoredSelect.prototype.updateSingleDisplay = function() {
  if (this.selectedItems.length > 0) {
    const item = this.selectedItems[0];
    this.input.value = item.label || item.value;
    this.input.style.backgroundColor = item.color || '#ffffff';
  } else {
    this.input.value = '';
    this.input.style.backgroundColor = '#ffffff';
  }
}

ColoredSelect.prototype.handleItemRemove = function(index) {
  this.selectedValues.splice(index, 1);
  this.selectedItems.splice(index, 1);
  this.updateDisplay();
  this.triggerChange();
}

ColoredSelect.prototype.handleInputClick = function(e) {
  e.stopPropagation();
  this.toggleDropdown();
}

ColoredSelect.prototype.handleInputKeyDown = function(e) {
  if (e.key === 'Escape') {
    this.closeDropdown();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    this.toggleDropdown();
  }
}

ColoredSelect.prototype.handleDocumentClick = function(e) {
  if (!this.wrapper.contains(e.target)) {
    this.closeDropdown();
  }
}

ColoredSelect.prototype.toggleDropdown = function() {
  if (this.isOpen) {
    this.closeDropdown();
  } else {
    this.openDropdown();
  }
}

ColoredSelect.prototype.openDropdown = function() {
  this.isOpen = true;
  this.wrapper.classList.add('open');
  this.arrow.classList.add('open');
}

ColoredSelect.prototype.closeDropdown = function() {
  this.isOpen = false;
  this.wrapper.classList.remove('open');
  this.arrow.classList.remove('open');
}

ColoredSelect.prototype.registerListeners = function() {
  this.inputContainer.addEventListener('click', this.handleInputClick);
  this.input.addEventListener('keydown', this.handleInputKeyDown);
  document.addEventListener('click', this.handleDocumentClick);
}

ColoredSelect.prototype.getValue = function() {
  return this.multiple ? this.selectedValues : (this.selectedValues[0] || null);
}

ColoredSelect.prototype.setValue = function(value) {
  if (this.multiple) {
    this.selectedValues = Array.isArray(value) ? value : [];
    this.selectedItems = this.selectedValues.map(val => 
      this.options.find(opt => opt.value === val)
    ).filter(Boolean);
  } else {
    this.selectedValues = value ? [value] : [];
    this.selectedItems = this.selectedValues.map(val => 
      this.options.find(opt => opt.value === val)
    ).filter(Boolean);
  }
  this.updateDisplay();
}

ColoredSelect.prototype.triggerChange = function() {
  const event = new CustomEvent('change', {
    detail: {
      value: this.getValue(),
      selectedItems: this.selectedItems
    }
  });
  this.container.dispatchEvent(event);
}

ColoredSelect.prototype.destroy = function() {
  this.input.removeEventListener('click', this.handleInputClick);
  this.input.removeEventListener('keydown', this.handleInputKeyDown);
  document.removeEventListener('click', this.handleDocumentClick);
  this.container.innerHTML = '';
}
