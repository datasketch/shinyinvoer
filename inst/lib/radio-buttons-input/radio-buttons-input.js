const radioButtonsInputBinding = new Shiny.InputBinding()

Object.assign(radioButtonsInputBinding, {
  find (scope) {
    const matches = scope.querySelectorAll('.shinyinvoer-radio-buttons-input')
    return matches
  },
  initialize (el) {
    let choices = []
    const selected = el.dataset.selected
    try {
      choices = JSON.parse(el.dataset.choices)
      this._renderChoices(el, choices, selected)
      return choices
    } catch (error) {
      return choices
    }
  },
  getValue (el) {
    const checkedInput = Array.from(el.querySelectorAll('input')).find(input => input.checked)
    return checkedInput.id
  },
  subscribe (el, callback) {
    el.addEventListener('change', () => {
      callback()
    })
  },
  receiveMessage (el, message) {
    const { choices, selected } = message
    if (choices) {
      el.dataset.choices = JSON.stringify(choices)
      const container = el.querySelector('.shinyinvoer-radio-buttons-choices')
      container.innerHTML = ''
      this._renderChoices(el, choices, selected)

      const event = new Event('change')
      el.dispatchEvent(event)
    }


    if (selected !== undefined) {
      const selectedInput = el.querySelector(`#${selected}`)
      if (selectedInput) {
        selectedInput.checked = true
        const event = new Event('change')
        el.dispatchEvent(event)
      }
    }
  },
  _renderChoices (el, choices, selected) {
    const name = el.id
    const container = el.querySelector('.shinyinvoer-radio-buttons-choices')
    const choicesElements = Object.entries(choices).map(([id, content], index) => {
      const label = document.createElement('label')
      label.className = 'shinyinvoer-radio-buttons-choice'
      label.htmlFor = id
      /**
       * @typedef HTMLInputElement
       */
      const input = document.createElement('input')
      input.type = 'radio'
      input.name = name
      input.id = id

      if ((!selected && index === 0) || (selected && id === selected)) {
        input.setAttribute('checked', 'true')
      }

      const html = Array.isArray(content) ? content.shift() : content

      label.appendChild(input)
      label.innerHTML += html

      return label
    })
    container.append(...choicesElements)
  }
})

Shiny.inputBindings.register(radioButtonsInputBinding)
