/* global flatpickr */
const dateRangeInputBinding = new Shiny.InputBinding()
window.dateRangeInputBinding = {}

Object.assign(dateRangeInputBinding, {
  find (scope) {
    const matches = scope.querySelectorAll('.shinyinvoer-date-range-input')
    return matches
  },
  initialize (el) {
    const id = el.id
    const dateRangeStart = el.querySelector('.shinyinvoer-date-range-start')
    const dateRangeEnd = el.querySelector('.shinyinvoer-date-range-end')
    const dateRangeReset = el.querySelector('.shinyinvoer-date-range-reset')
    const minDate = el.dataset.min
    const maxDate = el.dataset.max
    const startDate = el.dataset.start
    const endDate = el.dataset.end
    const startLabel = el.dataset.startLabel
    const endLabel = el.dataset.endLabel
    const resetLabel = el.dataset.resetLabel
    const locale = el.dataset.locale

    if (startLabel) {
      dateRangeStart.previousElementSibling.textContent = startLabel
    }

    if (endLabel) {
      dateRangeEnd.previousElementSibling.textContent = endLabel
    }

    if (!resetLabel) {
      dateRangeReset.classList.add('is-unused')
    }

    window.dateRangeInputBinding[id] = {
      flatpickrRangeStart: flatpickr(dateRangeStart, {
        minDate,
        maxDate,
        defaultDate: startDate,
        locale: locale || 'en'
      }),
      flatpickrRangeEnd: flatpickr(dateRangeEnd, {
        minDate,
        maxDate,
        defaultDate: endDate,
        locale: locale || 'en'
      })
    }
  },
  getValue (el) {
    const id = el.id
    const { flatpickrRangeStart, flatpickrRangeEnd } = window.dateRangeInputBinding[id]
    const start = flatpickrRangeStart.input.value
    const end = flatpickrRangeEnd.input.value
    return [start, end]
  },
  subscribe (el, callback) {
    const id = el.id
    const dateRangeReset = el.querySelector('.shinyinvoer-date-range-reset')
    const startDate = el.dataset.start
    const endDate = el.dataset.end
    const resetLabel = el.dataset.resetLabel
    const { flatpickrRangeStart, flatpickrRangeEnd } = window.dateRangeInputBinding[id]

    flatpickrRangeStart.config.onChange.push(function () {
      callback()
    })

    flatpickrRangeEnd.config.onChange.push(function () {
      callback()
    })

    if (!resetLabel) return

    dateRangeReset.addEventListener('click', () => {
      flatpickrRangeStart.clear()
      flatpickrRangeEnd.clear()
      if (startDate) flatpickrRangeStart.setDate(startDate, true)
      if (endDate) flatpickrRangeEnd.setDate(endDate, true)
      callback()
    })
  },
  receiveMessage (el, message) {
    const id = el.id
    const { flatpickrRangeStart, flatpickrRangeEnd } = window.dateRangeInputBinding[id]
    const { start: startDate, end: endDate, minDate, maxDate } = message
    if (minDate) {
      flatpickrRangeStart.config.minDate = minDate
      flatpickrRangeEnd.config.minDate = minDate
    }
    if (maxDate) {
      flatpickrRangeStart.config.maxDate = maxDate
      flatpickrRangeEnd.config.maxDate = maxDate
    }
    if (startDate) flatpickrRangeStart.setDate(startDate, true)
    if (endDate) flatpickrRangeEnd.setDate(endDate, true)
  }
})

Shiny.inputBindings.register(dateRangeInputBinding)
