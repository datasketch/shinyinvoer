#' @export

colorPaletteInput <- function(inputId, label, colors) {

  addResourcePath(
    prefix = 'colorPaletteInput',
    directoryPath = system.file('lib/colorPicker', package='shinyinvoer')
  )



  l <- shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(rel = 'stylesheet',
                         type = 'text/css',
                         href = 'colorPaletteInput/colorPaletteInput-bindings.css'),
        shiny::tags$script(src = 'colorPaletteInput/colorPaletteInput-bindings.js')
      ))
  )

  shiny::div(
    l,
    id = inputId,
    class = 'input-color-palette',
    shiny::tags$label(shiny::tags$span(label)),
    purrr::imap(colors, function(color, i) {
      idx <- i - 1
      shiny::div(
        shiny::tags$input(type = "color",  value = color),
        if (idx != 0) {
          shiny::tags$button("x")
        } else {
          NULL
        }, class = "input-color-container"
      )
    }),
    shiny::tags$button(id="add-color", '+')
  )





}
