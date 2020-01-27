
#' @title Grouped buttons with image
#'
#' @description
#' Create grouped buttons with image to choose a single button and get its id.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param labels List of images´ names saved in a folder into www.
#' @param values List of id inputs when pressing each button.
#' @param active Initial button selected.
#' @param file Folder where the images are stored.
#' @param class Name of the class which contains the button´s style
#' @param classImg class Name of the class which contains the images´ style.
#' @return A group of buttons which can be controlled from the UI.
#'
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' ui <- fluidPage(
#'     uiOutput('button'),
#'     verbatimTextOutput('input_button')
#' )
#' server <- function(input, output) {
#'  # you must crate a file in www for saving images (www/img/...)
#'  output$button <- renderUI({
#'                   buttonImageInput(inputId = 'chosen_button',
#'                   labels = c("cat", "dog", "fox"),
#'                   values = c("cat", "dog", "fox"),
#'                   active = 'dog',
#'                   file = "img/")
#'                   })
#' # print input id when clicking
#' output$input_button <- renderPrint({
#'                    input$chosen_button
#'                   })
#' }
#' shinyApp(ui, server)
#' }
#' }
#'
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
    shiny::tags$button(
      id = values[index],
      class = class,
      shiny::tags$img(src = paste0(file, labels[index], '.', format), class = classImg)
    )
  })
  if (is.null(active)) active <- values[1]
  active <- which(values == active)
  l[[active]] <- purrr::map(active, function(a) {
    htmltools::HTML(gsub('"buttonStyle"', '"buttonStyle active_btn"', l[[a]]))
  })


  shiny::div(
    `data-shiny-input-type` = "buttonImage",
    shiny::tagList(
      shiny::singleton(
        shiny::tags$head(
          shiny::tags$link(rel = 'stylesheet',
                           type = 'text/css',
                           href = 'buttonImage/buttonImage.css'),
          shiny::tags$script(src = 'buttonImage/buttonImage-bindings.js')
        ))
    ),
      class = 'buttons-group',
      id = inputId,
      l
  )


}
