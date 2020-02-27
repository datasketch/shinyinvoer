
#' @title Grouped buttons with image
#'
#' @description
#' Create grouped buttons with image to choose a single button and get its id.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param images List of images´ names saved in a folder into www.
#' @param images List of id inputs when pressing each button.
#' @param active Initial button selected.
#' @param path Folder where the images are stored.
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
#'  # you must crate a path in www for saving images (www/img/...)
#'  output$button <- renderUI({
#'                   buttonImageInput(inputId = 'chosen_button',
#'                   images = c("cat", "dog", "fox"),
#'                   images = c("cat", "dog", "fox"),
#'                   active = 'dog',
#'                   path = "img/")
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
                              label = NULL,
                              images = NULL,
                              active = NULL,
                              tooltips = NULL,
                              path = NULL,
                              format = NULL,
                              class = "buttonStyle",
                              classImg = "imageStyle") {


  format <- format %||% "png"
  path <- path %||% "img/btn/"
  label <- label %||% " "

  if (is.null(tooltips)) tooltips <- images

  addResourcePath(
    prefix='buttonImage',
    directoryPath=system.file("lib/buttonImage",
                              package='shinyinvoer'))


  l <- purrr::map(seq_along(images), function (index) {
    shiny::tags$button(
      id = images[index],
      class = class,
      type="submit",
      title= tooltips[index],
      shiny::tags$img(src = paste0(path, images[index], '.', format), class = classImg)
    )
  })
  if (is.null(active)) active <- images[1]
  active <- which(images == active)

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
      div(label ,l)
  )


}
