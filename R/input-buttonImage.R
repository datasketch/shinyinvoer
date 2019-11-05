
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

buttonImageInput <- function (inputId,
                              labels = NULL,
                              values = NULL,
                              active = NULL,
                              file = NULL,
                              format = NULL,
                              class = "buttonStyle",
                              classImg = "imageStyle") {


  format <- format %||% "png"
  file <- file %||% "img/btn/"

  addResourcePath(
    prefix='buttonImage',
    directoryPath=system.file("lib/buttonImage",
                              package='dsAppWidgets'))


  l <- purrr::map(seq_along(labels), function (index) {
    tags$button(
      id = values[index],
      class = class,
      tags$img(src = paste0(file, labels[index], '.', format), class = classImg)
    )
  })
  if (is.null(active)) active <- values[1]
  active <- which(values == active)
  l[[active]] <- purrr::map(active, function(a) {
    HTML(gsub('"buttonStyle"', '"buttonStyle active_btn"', l[[a]]))
  })

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
        id = inputId,
        l
      )
    )

    shiny::div(
      class = "form-group shiny-input-container",
      `data-shiny-input-type` = "buttonImage",
      buttonImageTag
    )


}

#' @export
updateButtonImageInput <- function(session,
                                   inputId,
                                   labels = NULL,
                                   values = NULL,
                                   active = NULL,
                                   file = NULL,
                                   format = NULL,
                                   class = NULL,
                                   classImg = NULL) {
  message <- dropNulls(list(
    labels = labels,
    values = values,
    active = active,
    file = file,
    format = format,
    class = class,
    classImg = classImg
  ))
  session$sendInputMessage(inputId, message)
}

# copied from shiny since it's not exported
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE=logical(1))]
}
