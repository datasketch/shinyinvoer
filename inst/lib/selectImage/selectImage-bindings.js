const selectImageBinding = new Shiny.InputBinding();

$.extend(selectImageBinding, {
  find: function(scope) {
    return $(scope).find('.dropdown');
  },
  initialize: function(el) {
    const container = document.createElement('div');
    container.setAttribute('class', 'dropdown-container');
    el.appendChild(container);

    createDropdownSelector(container);
    createDropdownOptions(el, container);
  },
  getValue: function(el) {
    return el.dataset.selected;
  },
  subscribe: function(el, callback) {
    const placeholder = el.querySelector('.dropdown-placeholder');

    el.addEventListener('click', function(event) {
      const target = event.target;
      if (target === this) {
        return;
      }
      if (
        target.matches('.dropdown-option') ||
        target.parentNode.matches('.dropdown-option')
      ) {
        const node = target.matches('.dropdown-option')
          ? target
          : target.parentNode;
        const html = node.innerHTML;
        placeholder.innerHTML = html;
        el.dataset.selected = node.dataset.option;
      }
      this.classList.toggle('opened');
      callback();
    });
  }
});

function createDropdownSelector(el) {
  const select = document.createElement('div');
  const placeholder = document.createElement('div');
  const chevron =
    '<svg fill="none" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>';

  select.setAttribute('class', 'dropdown-select');
  placeholder.setAttribute('class', 'dropdown-placeholder');

  select.appendChild(placeholder);
  select.innerHTML = select.innerHTML + chevron;

  el.appendChild(select);
}

function createDropdownOptions(el, container) {
  let optionsData;
  const placeholder = el.querySelector('.dropdown-placeholder');
  try {
    optionsData = JSON.parse(el.dataset.options);
  } catch (error) {
    optionsData = [];
  }
  const optionsListContainer = document.createElement('ul');

  for (const option of optionsData) {
    const li = document.createElement('li');
    const image = document.createElement('img');
    const span = document.createElement('span');

    image.setAttribute('src', option.image);
    span.textContent = option.label;

    li.appendChild(image);
    option.label && li.appendChild(span);

    li.dataset.option = option.id;
    li.setAttribute('class', 'dropdown-option');

    if (el.dataset.selected && el.dataset.selected === option.id) {
      placeholder.innerHTML = li.innerHTML;
    }

    optionsListContainer.appendChild(li);
  }

  optionsListContainer.setAttribute('class', 'dropdown-options');
  container.appendChild(optionsListContainer);
}


Shiny.inputBindings.register(selectImageBinding, 'shiny.selectImageInput');
