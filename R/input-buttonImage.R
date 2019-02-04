#' @title Buttons Group Input Control with image
#'
#' @description
#' Create buttons grouped with image.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param label Input label.
#' @param width The width of the input, e.g. '400px', or '100\%'.
#' @return A buttons group control that can be added to a UI definition.
#'
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' ui <- fluidPage(
#'   codeButton....,
#'   verbatimTextOutput("value")
#' )
#' server <- function(input, output) {
#'   output$value <- renderText({ input$somevalue })
#' }
#' shinyApp(ui, server)
#' }
#' }
#'
#' @importFrom shiny restoreInput
#' @importFrom htmltools tags HTML validateCssUnit
#'
#' @export

buttonImage <- function (id,
                         labels,
                         values = NULL,
                         file = NULL,
                         format = NULL,
                         width = NULL,
                         height = NULL,
                         class = "buttonStyle",
                         classImg = "imageStyle") {


  format <- format %||% "png"
  file <- file %||% "img/btn/"

  addResourcePath(
    prefix='buttonImage',
    directoryPath=system.file("lib/buttonImage",
                              package='dsAppWidgets'))

  buttonImageTag <-
    tagList(
      singleton(tags$head(
        tags$link(rel = 'stylesheet',
                  type = 'text/css',
                  href = 'buttonImage/buttonImage.css'),
        tags$script(src = 'buttonImage/buttonImage-bindings.js')
      )),
    tags$div(
      class = 'buttons-group',
      id = id,
      purrr::map(seq_along(labels), function (index) {
        tags$button(
          id = values[index],
          class = class,
          #style = paste0("width:30px; height:30px;"),
          tags$img(src = paste0(file, labels[index], '.', format), class = classImg, style = paste0("width:30px; height:30px;"))
        )
      })
    )
  )
  buttonImageTag

}













