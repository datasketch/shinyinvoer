#' @title Handsontable wrapper
#'
#' @description
#' Handsontable wrapper for database editing,  controlling configuration and merging data
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param data A data frame object.
#' @param dic  A data frame with labels of data names.
#' @param options A list of initialization options.
#' @return Editable data
#'
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' ui <- fluidPage(
#'    uiOutput('dstable'),
#'    verbatimTextOutput('test')
#' )
#' server <- function(input, output) {
#'
#'output$dstable <- renderUI({
#'  dsHot("indata1", data = mtcars, options = list(height = 300))
#'})
#'
#'output$test <- renderPrint({
#'  input$indata1
#'})
#' }
#' shinyApp(ui, server)
#' }
#' }
#'
#'
#' @export
dsHot <- function(inputId, data = NULL, dic = NULL,
                  options = NULL){
  if(is.null(data)) return()
  if(is.reactive(data))
    data <- data()
  defaultOpts <- list(
    maxRows = NULL %||% nrow(data),
    height = 450,
    width = NULL,
    manualRowMove = TRUE,
    manualColumnMove = TRUE
  )
  if(is.reactive(data))
    data <- data()
  f <- datafringe::fringe(data)

  options <- modifyList(defaultOpts, options %||% list())

  addResourcePath(
    prefix='handsontable',
    directoryPath=system.file("lib/handsontable",
                              package='dsAppWidgets'))
  addResourcePath(
    prefix='dsHot',
    directoryPath=system.file("lib/dsHot",
                              package='dsAppWidgets'))
  #js <- system.file("lib/dsHot/dsHot.js", package = "dsAppWidgets")
  #css <- system.file("lib/dsHot/dsHot.css", package = "dsAppWidgets")
  #js <- "../lib/dsHot/dsHot.js"
  #css <- "../lib/dsHot/dsHot.css"

  id <- inputId

  data <- f$d
  dic <- dic %||% f$dic_$d
  dic$id <- letters[1:ncol(data)]

  json_opts <- jsonlite::toJSON(options, auto_unbox = TRUE)
  json_table <- jsonlite::toJSON(data, auto_unbox = TRUE)
  json_dic <- jsonlite::toJSON(dic, auto_unbox = TRUE)
  l <- tagList(
    singleton(tags$head(
      tags$link(rel = 'stylesheet',
                type = 'text/css',
                href = 'handsontable/handsontable.full.min.css'),
      tags$script(src = 'handsontable/handsontable.full.min.js')
    )),
    tags$link(rel = 'stylesheet',
              type = 'text/css',
              href = 'dsHot/dsHot.css'),
    tags$script(src = 'dsHot/dsHotHelpers.js'),
    tags$script(src = 'dsHot/dsHot.js')
  )

  shiny::div(l,
             id = id,
             class = "hot",
             `data-hotOpts` = HTML(json_opts),
             `data-table` = HTML(json_table),
             `data-dic` = HTML(json_dic))
}

