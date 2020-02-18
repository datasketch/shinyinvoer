#' @export

colorPalette <- function(inputId, colors) {

  addResourcePath(
    prefix = 'colorInput',
    directoryPath = system.file('lib/colorPicker', package='shinyinvoer')
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
    purrr::imap(colors, function(color, i) {
      idx <- i - 1
      shiny::div(
        shiny::tags$input(type = "color",  value = color),
        if (idx != 0) {
          shiny::tags$button(index = idx, "x")
        } else {
          NULL
        }, class = "input-color-container"
      )
    }),
    shiny::tags$button(id="add-color", '+')
  )





}
