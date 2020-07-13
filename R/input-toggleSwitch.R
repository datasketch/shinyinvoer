#' @title Switch state button
#' @export

toggleSwitchInput <- function(inputId, label = NULL, on_label = "ON", off_label = "OFF", value = FALSE) {

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

  inp <- shiny::tags$input(id = inputId, type = "checkbox", class = "switch-state")
  if (value) {
    inp$attribs$checked <- "checked"
  }

  shiny::div(
    label,
    shiny::div(
      l,
      class = 'switch-container',
      inp,
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
