#' @export

colorPalette <- function(inputId, colors) {

  addResourcePath(
    prefix = 'colorInput',
    directoryPath = system.file('lib/colorPicker', package='dsAppWidgets')
  )



  tagList(
    singleton(tags$head(
      # tags$link(rel = 'stylesheet',
      #           type = 'text/css',
      #           href = 'libAutoSuggest/search/searchBinding.css'),
      # tags$script(src = 'libAutoSuggest/search/search.js'),
      tags$script(src = 'colorInput/colorInput-bindings.js')
    )),
    tags$div( id = inputId, class = 'input-color-palette',
              map(colors, function(color) {
                tags$input(type = "color", `data-color` = color, value = color)
              }),
              tags$button(id="add-color", '+')
    )
  )

    #l





}
