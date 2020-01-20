function Autosuggest(container, data, placeholder) {
  this.container = container;
  this.data = data;
  this.placeholder = placeholder;
  this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
  this.handleArrowKeyUp = this.handleArrowKeyUp.bind(this);
  this.results = [];
  this.counter = 0;
  this.createDOM();
  this.registerListener();
}

Autosuggest.prototype.createDOM = function () {
  this.input = document.createElement('input');
  this.resultsList = document.createElement('ul');

  this.resultsList.classList.add('results-list');
  this.input.setAttribute('placeholder', this.placeholder);
  this.container.appendChild(this.input);
  this.container.appendChild(this.resultsList);
}

Autosuggest.prototype.registerListener = function () {
  this.container.addEventListener('keyup', this.handleArrowKeyUp);
  this.input.addEventListener('keyup', this.handleInputKeyUp);
}

Autosuggest.prototype.handleInputKeyUp = function (event) {
  const query = event.target.value.trim().toLowerCase();
  if (query) {
    this.results = this.data.filter(function (item) {
      return item.toLowerCase().includes(query);
    });
  } else {
    this.results = [];
  }
  this.renderResults();
}

Autosuggest.prototype.handleArrowKeyUp = function (event) {
  if (this.results.length && (event.keyCode === 40 || event.keyCode === 38)) {
    const isArrowUp = event.keyCode === 38;
    const isArrowDown = event.keyCode === 40;
    const total = this.results.length;
    if (isArrowDown) {
      this.counter++;
      this.counter = this.counter > total ? 1 : this.counter;
    }
    if (isArrowUp) {
      this.counter--;
      this.counter = this.counter < 1 ? total : this.counter;
    }
    this.highlightResult();
  }
}

Autosuggest.prototype.renderResults = function () {
  const self = this;
  this.resultsList.innerHTML = '';
  for (const result of this.results) {
    const li = document.createElement('li');
    li.setAttribute('tabindex', '0');
    li.textContent = result;
    li.classList.add('results-item');
    this.resultsList.append(li);
  }
}

Autosuggest.prototype.highlightResult = function () {
  const listItems = document.querySelectorAll('.results-list li');
  listItems[this.counter - 1].focus();
  this.input.value = listItems[this.counter - 1].textContent;
}
