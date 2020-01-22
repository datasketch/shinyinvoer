#' @export

colorPalette <- function(inputId, colors) {

  addResourcePath(
    prefix = 'colorInput',
    directoryPath = system.file('lib/colorPicker', package='dsAppWidgets')
  )



  tagList(
    singleton(tags$head(
      tags$link(rel = 'stylesheet',
                type = 'text/css',
                href = 'colorInput/colorInput-bindings.css'),
      tags$script(src = 'colorInput/colorInput-bindings.js')
    )),
    tags$div( id = inputId, class = 'input-color-palette',
              map(colors, function(color) {
                tags$input(type = "color",  value = color)
              }),
              tags$button(id="add-color", '+')
    )
  )

    #l





}
