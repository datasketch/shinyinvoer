#' @title Switch state button
#' @export

toggleSwitchInput <- function(inputId, on_label = "ON", off_label = "OFF") {

  addResourcePath(
    prefix = 'toggleSwitch',
    directoryPath = system.file('lib/toggleSwitch', package = 'shinyinvoer')
  )

  l <- shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(rel = 'stylesheet',
                         type = 'text/css',
                         href = 'toggleSwitch/toggle-switch-binding.css'),
        shiny::tags$script(src = 'toggleSwitch/toggle-switch-binding.js')
      ))
  )

  shiny::div(
    shiny::div(
      l,
      class = 'switch-container',
      shiny::tags$input(id = inputId, type = "checkbox", class = "switch-state"),
      shiny::tags$label(
        `for` = inputId,
        class = 'switch-display',
        shiny::tags$span(on_label, class = "switch-on"),
        shiny::tags$span(off_label, class = "switch-off"),
        shiny::tags$span(class = "switch-indicator")
      )
    )
  )
}
