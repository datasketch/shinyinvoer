#' @title Switch state button
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param label Display label for the toggle switch, \code{NULL} for no label.
#' @param on_label Display label when toggle switch is on.
#' @param off_label Display label when toggle switch is off.
#' @param value Initial value of the toggle TRUE on, FALSE off.
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' ui <- fluidPage(
#'     toggleSwitchInput(inputId = 'toggle', label = 'The toggle switch', value = TRUE)
#'     verbatimTextOutput('toggle_state')
#' )
#' server <- function(input, output) {
#'
#' output$toggle_state <- renderPrint({
#'                    input$toggle
#'                 })
#' }
#' shinyApp(ui, server)
#' }
#' }
#'
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
