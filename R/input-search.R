#' searchInput
#' @importFrom shiny restoreInput
#' @importFrom htmltools tags HTML validateCssUnit
#'@export

searchInput <- function(inputId, data, placeholder) {

  addResourcePath(
    prefix = 'libAutoSuggest',
    directoryPath = system.file('lib', package='dsAppWidgets')
  )


 l <-
    tagList(
      singleton(tags$head(
        tags$link(rel = 'stylesheet',
                  type = 'text/css',
                  href = 'libAutoSuggest/search/searchBinding.css'),
        tags$script(src = 'libAutoSuggest/search/search.js'),
        tags$script(src = 'libAutoSuggest/search/searchBinding.js')
      )),
      tags$div(
        id = inputId,
        class = 'input-autosuggest',
        "data-top"= jsonlite::toJSON(data),
        "data-placeholder" = placeholder
      )
    )

  shiny::div(
    `data-shiny-input-type` = "searchInput",
    l
  )


}
