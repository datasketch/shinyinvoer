/* global flatpickr */
const dateRangeInputBinding = new Shiny.InputBinding()

Object.assign(dateRangeInputBinding, {
  find (scope) {
    const matches = scope.querySelectorAll('.shinyinvoer-date-range-input')
    return matches
  },
  initialize (el) {
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

    this.flatpickrRangeStart = flatpickr(dateRangeStart, {
      minDate,
      maxDate,
      defaultDate: startDate,
      locale: locale || 'en'
    })

    this.flatpickrRangeEnd = flatpickr(dateRangeEnd, {
      minDate,
      maxDate,
      defaultDate: endDate,
      locale: locale || 'en'
    })
  },
  getValue (el) {
    const start = this.flatpickrRangeStart.input.value
    const end = this.flatpickrRangeEnd.input.value
    return [start, end]
  },
  subscribe (el, callback) {
    const dateRangeReset = el.querySelector('.shinyinvoer-date-range-reset')
    const startDate = el.dataset.start
    const endDate = el.dataset.end
    const resetLabel = el.dataset.resetLabel

    this.flatpickrRangeStart.config.onChange.push(function () {
      callback()
    })

    this.flatpickrRangeEnd.config.onChange.push(function () {
      callback()
    })

    if (!resetLabel) return

    dateRangeReset.addEventListener('click', () => {
      this.flatpickrRangeStart.clear()
      this.flatpickrRangeEnd.clear()
      if (startDate) this.flatpickrRangeStart.setDate(startDate, true)
      if (endDate) this.flatpickrRangeEnd.setDate(endDate, true)
      callback()
    })
  },
  receiveMessage (el, message) {
    const { start: startDate, end: endDate, minDate, maxDate } = message
    if (minDate) {
      this.flatpickrRangeStart.config.minDate = minDate
      this.flatpickrRangeEnd.config.minDate = minDate
    }
    if (maxDate) {
      this.flatpickrRangeStart.config.maxDate = maxDate
      this.flatpickrRangeEnd.config.maxDate = maxDate
    }
    if (startDate) this.flatpickrRangeStart.setDate(startDate, true)
    if (endDate) this.flatpickrRangeEnd.setDate(endDate, true)
  }
})

Shiny.inputBindings.register(dateRangeInputBinding)
