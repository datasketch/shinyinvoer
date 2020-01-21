#' @title Search bar
#'
#' @description
#' Searching bar where shiny can search the content of interest after a click or enter.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param data Vector of values entered in the searching bar .
#' @param placeholder Character, word, or string of characters that temporarily takes the place of the final data.
#' @return A searching bar
#'
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' ui <- fluidPage(
#'    suppressDependencies('bootstrap'),
#'    uiOutput('search'),
#'    verbatimTextOutput('test')
#' )
#' server <- function(input, output) {
#'
#'output$search <- renderUI({
#'  searchInput('id_searching',
#'              data = c('Anaconda', 'African darter', 'Fox', 'Wolf', 'Spider', 'Toad', 'Agouti'),
#'              placeholder = 'Type a letter')
#'})
#'
#'output$test <- renderPrint({
#'  input$id_searching
#'})
#' }
#' shinyApp(ui, server)
#' }
#' }
#'
#'
#' @export

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
