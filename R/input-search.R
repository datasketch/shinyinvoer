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


  if (is.null(inputId)) inputId <- paste0("search_", sample.int(1e9, 1))

  addResourcePath(
    prefix = 'libAutoSuggest',
    directoryPath = system.file('lib', package='dsAppWidgets')
  )


  l <-
    shiny::tagList(
      shiny::singleton(
        shiny::tags$head(
          shiny::tags$link(rel = 'stylesheet',
                           type = 'text/css',
                           href = 'libAutoSuggest/search/searchBinding.css'),
          shiny::tags$script(src = 'libAutoSuggest/search/search.js'),
          shiny::tags$script(src = 'libAutoSuggest/search/searchBinding.js')
        ))
    )

  shiny::div(
    l,
    `data-shiny-input-type` = "searchInput",
    id = inputId,
    class = 'input-autosuggest',
    "data-top"= jsonlite::toJSON(data),
    "data-placeholder" = placeholder
  )


}
