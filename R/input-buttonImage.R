
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
                              ncol = NULL,
                              nrow = NULL,
                              checkmarkColor = NULL,
                              imageStyle = list(borderColor = "black",
                                                borderSize = "0px",
                                                padding = "0",
                                                shadow = FALSE),
                              class = "button-style",
                              classImg = "image-style") {

  format <- format %||% "png"
  path <- path %||% "img/btn/"
  label <- label %||% " "
  checkmarkColor <- checkmarkColor %||% "#da1c95"
  # backgroundColor <- backgroundColor

  if (is.null(tooltips)) tooltips <- images

  addResourcePath(prefix='buttonImage', directoryPath=system.file("lib/buttonImage", package='shinyinvoer'))

  imgStyle <- paste0("border: ",
                     imageStyle$borderSize,
                     " solid ",
                     imageStyle$borderColor,
                     " !important; box-shadow: ",
                     ifelse(imageStyle$shadow, "-3px 3px 7px 2px rgba(0, 0, 0, 0.06)", "none"),
                     " !important; padding: ",
                     imageStyle$padding,
                     "; ")


  l <- purrr::map(seq_along(images), function (index) {
    print(images[index])
    print(list.files(path))
    format <- unique(tools::file_ext(list.files(paste0("www/", path), pattern = images[index])))
    if (length(format) != 1) stop("All images have to be of the same type (png, jpeg, svg)")
    file_path <- file.path(path, paste0(images[index], '.', format))
    if (format == "svg") {
      shiny::tags$div(style = paste0(imgStyle, "color: ", checkmarkColor),
                      class = "button-container",
                      shiny::tags$button(id = images[index],
                                         class = class,
                                         style = paste0("mask: url(",
                                                        file_path,
                                                        "); -webkit-mask: url(",
                                                        file_path,
                                                        "); mask-position: center; mask-repeat: no-repeat; mask-size: contain; -webkit-mask-position: center; -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain;"),
                                         type = "submit",
                                         title = tooltips[index]),
                      shiny::HTML('<svg class="button-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.66 12.66"><circle fill="currentColor" cx="6.33" cy="6.33" r="6.33"/><path fill="#ffffff" d="M5.38,9.56a.49.49,0,0,1-.27-.13L3.24,7.49a.44.44,0,0,1,0-.63.45.45,0,0,1,.63,0L5.39,8.43,8.77,3.94a.44.44,0,0,1,.71.53L5.79,9.39a.47.47,0,0,1-.33.17Z"/></svg>'))
    } else {
      shiny::tags$button(id = images[index],
                         class = class,
                         style = paste0(imgStyle, "color: ", checkmarkColor, "; background: transparent !important;"),
                         type = "submit",
                         title= tooltips[index],
                         shiny::HTML('<svg class="button-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.66 12.66"><circle fill="currentColor" cx="6.33" cy="6.33" r="6.33"/><path fill="#ffffff" d="M5.38,9.56a.49.49,0,0,1-.27-.13L3.24,7.49a.44.44,0,0,1,0-.63.45.45,0,0,1,.63,0L5.39,8.43,8.77,3.94a.44.44,0,0,1,.71.53L5.79,9.39a.47.47,0,0,1-.33.17Z"/></svg>'),
                         shiny::tags$img(src = file_path, class = classImg))
    }
  })




  if (is.null(active)) active <- images[1]
  active <- which(images == active)

  l[[active]] <- purrr::map(active, function(a) {
    htmltools::HTML(gsub('"button-style"', '"button-style active-btn"', l[[a]]))
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
