
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
#' @param ncol Number of images per row.
#' @param nrow Number of images per column.
#' @param imageStyles Styles for the images (border, shadow, padding, background).
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
#'                   ncol = 2,
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
                              ncol = NULL,
                              nrow = NULL,
                              imageStyle = list(backgroundColor = "transparent",
                                                borderColor = "black",
                                                borderSize = "0px",
                                                padding = "none",
                                                shadow = FALSE),
                              class = "buttonStyle",
                              classImg = "imageStyle") {

  format <- format %||% "png"
  path <- path %||% "img/btn/"
  label <- label %||% " "
  # backgroundColor <- backgroundColor

  if (is.null(tooltips)) tooltips <- images

  addResourcePath(prefix='buttonImage', directoryPath=system.file("lib/buttonImage", package='shinyinvoer'))

  imgStyle <- paste0("background-color: ",
                     imageStyle$backgroundColor,
                     " !important; border: ",
                     imageStyle$borderSize,
                     " solid ",
                     imageStyle$borderColor,
                     " !important; box-shadow: ",
                     ifelse(imageStyle$shadow, "-3px 3px 7px 2px rgba(0, 0, 0, 0.06)", "none"),
                     " !important; padding: ",
                     imageStyle$padding)

  l <- purrr::map(seq_along(images), function (index) {
    shiny::tags$button(
      id = images[index],
      class = class,
      style = imgStyle,
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

  if (is.null(nrow) & is.null(ncol)) {
    grid <- ""
  } else {
    if (is.null(ncol)) {
      n0 <- ceiling(length(images) / nrow)
      grid <- paste0("grid-template-columns: repeat(", n0, ", 1fr) !important;")
    } else {
      grid <- paste0("grid-template-columns: repeat(", ncol, ", 1fr) !important;")
    }
  }
  shiny::div(label,
             shiny::div(`data-shiny-input-type` = "buttonImage",
                        shiny::tagList(shiny::singleton(shiny::tags$head(shiny::tags$link(rel = 'stylesheet',
                                                                                          type = 'text/css',
                                                                                          href = 'buttonImage/buttonImage.css'),
                                                                         shiny::tags$script(src = 'buttonImage/buttonImage-bindings.js')))),
                        class = 'buttons-group',
                        style = grid,
                        id = inputId,
                        l))


}



#' @export
updateButtonImageInput <- function(session,
                                   inputId,
                                   label = NULL,
                                   images = NULL,
                                   active = NULL,
                                   tooltips = NULL,
                                   path = NULL,
                                   format = NULL) {

  message <- dropNulls(list(active = active))
  session$sendInputMessage(inputId, message)

}
