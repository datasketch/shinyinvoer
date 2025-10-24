// Colored Selectize Widget - Custom implementation
function ColoredSelectize(container, options) {
  this.container = container;
  this.choices = options.choices || {};
  this.selected = options.selected || [];
  this.colors = options.colors || {};
  this.placeholder = options.placeholder || 'Select options...';
  this.multiple = options.multiple !== false;
  this.isOpen = false;
  
  this.handleContainerClick = this.handleContainerClick.bind(this);
  this.handleOptionClick = this.handleOptionClick.bind(this);
  this.handleItemRemove = this.handleItemRemove.bind(this);
  this.handleDocumentClick = this.handleDocumentClick.bind(this);
  this.handleKeyDown = this.handleKeyDown.bind(this);
  
  this.createDOM();
  this.initializeSelected();
  this.registerListeners();
  
  console.log('ColoredSelectize initialized with:', {
    choices: this.choices,
    selected: this.selected,
    colors: this.colors
  });
}

ColoredSelectize.prototype.createDOM = function() {
  // Create main wrapper
  this.wrapper = document.createElement('div');
  this.wrapper.className = 'colored-selectize-wrapper';
  
  // Create input container
  this.inputContainer = document.createElement('div');
  this.inputContainer.className = 'colored-selectize-input-container';
  
  // Create selected items container
  this.selectedContainer = document.createElement('div');
  this.selectedContainer.className = 'colored-selectize-selected-container';
  
  // Create add button
  this.addButton = document.createElement('button');
  this.addButton.type = 'button';
  this.addButton.className = 'colored-selectize-add-button';
  this.addButton.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.63086 8.71387H13.7974" stroke="#212C35" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8.71387 3.63086V13.7974" stroke="#212C35" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  
  // Create dropdown
  this.dropdown = document.createElement('div');
  this.dropdown.className = 'colored-selectize-dropdown';
  
  // Create options list
  this.optionsList = document.createElement('ul');
  this.optionsList.className = 'colored-selectize-options-list';
  
  // Assemble structure
  this.inputContainer.appendChild(this.selectedContainer);
  this.inputContainer.appendChild(this.addButton);
  
  this.wrapper.appendChild(this.inputContainer);
  this.wrapper.appendChild(this.dropdown);
  this.dropdown.appendChild(this.optionsList);
  
  this.container.appendChild(this.wrapper);
  
  this.renderOptions();
}

ColoredSelectize.prototype.renderOptions = function() {
  console.log('Rendering options, choices:', this.choices, 'selected:', this.selected);
  this.optionsList.innerHTML = '';
  
  Object.keys(this.choices).forEach(key => {
    const value = this.choices[key];
    const isSelected = this.selected.includes(key);
    
    console.log('Processing option:', key, 'value:', value, 'isSelected:', isSelected);
    
    if (!isSelected) {
      const li = document.createElement('li');
      li.className = 'colored-selectize-option';
      li.dataset.value = key;
      
      const color = this.colors[key] || '#3498db';
      
      // Create option content
      const colorPreview = document.createElement('span');
      colorPreview.className = 'colored-selectize-color-preview';
      colorPreview.style.backgroundColor = color;
      
      const text = document.createElement('span');
      text.className = 'colored-selectize-option-text';
      text.textContent = value;
      
      li.appendChild(colorPreview);
      li.appendChild(text);
      
      // Add click handler
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleOptionClick(key);
      });
      
      this.optionsList.appendChild(li);
      console.log('Added option to list:', key);
    }
  });
  
  console.log('Options rendered, total children:', this.optionsList.children.length);
}

ColoredSelectize.prototype.handleOptionClick = function(value) {
  if (this.multiple) {
    this.addSelection(value);
  } else {
    this.setSelection(value);
    this.closeDropdown();
  }
  this.updateDisplay();
  this.triggerChange();
}

ColoredSelectize.prototype.addSelection = function(value) {
  if (!this.selected.includes(value)) {
    this.selected.push(value);
  }
}

ColoredSelectize.prototype.setSelection = function(value) {
  this.selected = [value];
}

ColoredSelectize.prototype.removeSelection = function(value) {
  const index = this.selected.indexOf(value);
  if (index > -1) {
    this.selected.splice(index, 1);
  }
}

ColoredSelectize.prototype.updateDisplay = function() {
  this.selectedContainer.innerHTML = '';
  
  this.selected.forEach(value => {
    const choice = this.choices[value];
    const color = this.colors[value] || '#3498db';
    
    const item = document.createElement('div');
    item.className = 'colored-selectize-item';
    item.style.backgroundColor = color;
    item.style.borderColor = color;
    
    const text = document.createElement('span');
    text.textContent = choice;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'colored-selectize-remove';
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleItemRemove(value);
    });
    
    item.appendChild(text);
    item.appendChild(removeBtn);
    this.selectedContainer.appendChild(item);
  });
  
  // Show/hide add button
  this.addButton.style.display = this.selected.length < Object.keys(this.choices).length ? 'flex' : 'none';
}

ColoredSelectize.prototype.handleItemRemove = function(value) {
  this.removeSelection(value);
  this.updateDisplay();
  this.renderOptions();
  this.triggerChange();
}

ColoredSelectize.prototype.handleContainerClick = function(e) {
  e.stopPropagation();
  console.log('Container clicked, toggling dropdown');
  this.toggleDropdown();
}

ColoredSelectize.prototype.handleDocumentClick = function(e) {
  if (!this.wrapper.contains(e.target)) {
    this.closeDropdown();
  }
}

ColoredSelectize.prototype.handleKeyDown = function(e) {
  if (e.key === 'Escape') {
    this.closeDropdown();
  }
}

ColoredSelectize.prototype.toggleDropdown = function() {
  console.log('Toggle dropdown, current state:', this.isOpen);
  if (this.isOpen) {
    this.closeDropdown();
  } else {
    this.openDropdown();
  }
}

ColoredSelectize.prototype.openDropdown = function() {
  console.log('Opening dropdown');
  this.isOpen = true;
  this.wrapper.classList.add('open');
  this.addButton.classList.add('open');
  console.log('Dropdown opened, classes:', this.wrapper.className);
}

ColoredSelectize.prototype.closeDropdown = function() {
  this.isOpen = false;
  this.wrapper.classList.remove('open');
  this.addButton.classList.remove('open');
}

ColoredSelectize.prototype.initializeSelected = function() {
  this.updateDisplay();
  this.renderOptions();
}

ColoredSelectize.prototype.registerListeners = function() {
  console.log('Registering listeners');
  this.inputContainer.addEventListener('click', this.handleContainerClick);
  this.addButton.addEventListener('click', this.handleContainerClick);
  document.addEventListener('click', this.handleDocumentClick);
  document.addEventListener('keydown', this.handleKeyDown);
  console.log('Listeners registered');
}

ColoredSelectize.prototype.getValue = function() {
  return this.multiple ? this.selected : (this.selected[0] || null);
}

ColoredSelectize.prototype.setValue = function(value) {
  if (this.multiple) {
    this.selected = Array.isArray(value) ? value : [];
  } else {
    this.selected = value ? [value] : [];
  }
  this.updateDisplay();
  this.renderOptions();
}

ColoredSelectize.prototype.triggerChange = function() {
  const event = new CustomEvent('change', {
    detail: {
      value: this.getValue(),
      selected: this.selected
    }
  });
  this.container.dispatchEvent(event);
}

ColoredSelectize.prototype.destroy = function() {
  this.inputContainer.removeEventListener('click', this.handleContainerClick);
  document.removeEventListener('click', this.handleDocumentClick);
  document.removeEventListener('keydown', this.handleKeyDown);
  this.container.innerHTML = '';
}