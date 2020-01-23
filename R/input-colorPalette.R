#' @export

colorPalette <- function(inputId, colors) {

  addResourcePath(
    prefix = 'colorInput',
    directoryPath = system.file('lib/colorPicker', package='dsAppWidgets')
  )



  l <- shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(rel = 'stylesheet',
                         type = 'text/css',
                         href = 'colorInput/colorInput-bindings.css'),
        shiny::tags$script(src = 'colorInput/colorInput-bindings.js')
      ))
  )

  shiny::div(
    l,
    id = inputId,
    class = 'input-color-palette',
    purrr::map(colors, function(color) {
      shiny::tags$input(type = "color",  value = color)
    }),
    shiny::tags$button(id="add-color", '+')
  )





}
