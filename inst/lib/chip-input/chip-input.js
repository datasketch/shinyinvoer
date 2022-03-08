const chipsInputBinding = new Shiny.InputBinding()

$.extend(chipsInputBinding, {
  find (scope) {
    return $(scope).find('.shinyinvoer-chips-input')
  },
  initialize (el) {
    const chipList = el.querySelector('.chip-list')
    const chipInput = el.querySelector('.chip-input')
    let chips

    try {
      chips = JSON.parse(el.dataset.chips)
      chips.forEach((chip) => {
        const chipEl = this.createChip(chip)
        chipList.insertBefore(chipEl, chipInput.parentNode)
      })
    } catch (e) {
      console.log('Something went wrong #initialize')
      chips = []
    }
  },
  getValue (el) {
    let chips
    try {
      chips = JSON.parse(el.dataset.chips)
    } catch (error) {
      console.log('Something went wrong #getValue')
      chips = []
    } finally {
      return chips
    }
  },
  subscribe (el, callback) {
    const chipContainer = el.querySelector('.chip-container')
    const chipInput = el.querySelector('.chip-input')
    const chipList = el.querySelector('.chip-list')

    chipInput.addEventListener('focus', () => {
      chipContainer.classList.add('focused')
    })

    chipInput.addEventListener('blur', () => {
      chipContainer.classList.remove('focused')
    })

    chipInput.addEventListener('keyup', (e) => {
      if (e.keyCode !== 13) return

      const value = e.target.value.trim()
      if (value === '') return

      const chips = JSON.parse(el.dataset.chips)
      const chip = this.createChip(value)
      chipList.insertBefore(chip, chipInput.parentNode)

      chips.push(value)
      el.dataset.chips = JSON.stringify(chips)
      e.target.value = ''

      callback()
    })

    chipList.addEventListener('click', function (e) {
      let chip
      if (e.target.matches('button')) {
        chip = e.target.parentNode
      } else {
        let current = e.target
        while (current !== chipList) {
          current = current.parentNode
          if (current.matches('button')) {
            chip = current.parentNode
            break
          }
        }
      }

      if (!chip) {
        callback()
        return
      }

      const chips = JSON.parse(el.dataset.chips)
      let index = 0
      let previousSibling = chip.previousElementSibling

      while (previousSibling) {
        index++
        previousSibling = previousSibling.previousElementSibling
      }

      chip.remove()
      chips.splice(index, 1)
      el.dataset.chips = JSON.stringify(chips)

      callback()
    })
  },
  receiveMessage (el, message) {
    const chipList = el.querySelector('.chip-list')
    const chipInput = el.querySelector('.chip-input')
    const chipsElement = el.querySelectorAll('.chip')
    const chips = message.chips || []

    chipsElement.forEach((chip) => chip.remove())
    el.dataset.chips = JSON.stringify(chips)

    chips.forEach((chip) => {
      const chipEl = this.createChip(chip)
      chipList.insertBefore(chipEl, chipInput.parentNode)
    })

    $(chipList).trigger('click')
  },
  createChip (title) {
    const chip = document.createElement('div')
    chip.classList.add('chip')

    const chipTitle = document.createElement('span')
    chipTitle.textContent = title

    chip.appendChild(chipTitle)
    chip.innerHTML += '<button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>'

    return chip
  }
})

Shiny.inputBindings.register(chipsInputBinding)
