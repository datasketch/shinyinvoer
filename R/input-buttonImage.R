
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

buttonImageInputOld <- function (inputId,
                              label = NULL,
                              images = NULL,
                              active = NULL,
                              disabled = NULL,
                              tooltips = NULL,
                              path = NULL,
                              ncol = NULL,
                              nrow = NULL,
                              format = NULL,
                              highlightColor = NULL,
                              checkmark = FALSE,
                              imageStyle = list(borderColor = "black",
                                                borderSize = "0px",
                                                padding = "0",
                                                shadow = FALSE),
                              class = "button-style",
                              classImg = "image-style") {

  label <- label %||% " "
  highlightColor <- highlightColor %||% "green"
  # backgroundColor <- backgroundColor

  # TODO case when images come from urls
  if(!is.null(path)){
    if(!dir.exists(path)) stop("Path doesn't exist")
    web_path <- gsub("^www", "", path)
  }else{
    web_path <- path %||% "."
  }

  tooltips <- names(images) %||% images

  formats <- dstools::file_ext(images)
  if(is.null(format) && all(formats == "")){
    default_format <- unique(tools::file_ext(list.files(path)))
    if(length(default_format) > 1)
      stop("All images in path should have the same format extension")
    format <- default_format
  }
  if(all(formats == "")){
    if(is.null(format))
      stop("Need image formats. As images.png or as images=c(image1,image2) with format = png")
    formats <- rep(format, length(images))
  }


  images <- dstools::sans_ext(images)
  if(any(duplicated(images)))
    stop("Provide unique images ids. image.png and image.svg not allowed")
  images <- unname(images)

  addResourcePath(prefix='buttonImage', directoryPath=system.file("lib/buttonImage", package='shinyinvoer'))

  imageStyle$highlightColor <- highlightColor
  imgStyle <- paste0("border: ",
                     imageStyle$borderSize,
                     " solid ",
                     imageStyle$borderColor,
                     " !important; box-shadow: ",
                     ifelse(imageStyle$shadow, "-3px 3px 7px 2px rgba(0, 0, 0, 0.06)", "none"),
                     " !important; padding: ",
                     imageStyle$padding,";")


  l <- purrr::map(seq_along(images), function (index) {
    # index <- 1
    element_id <- paste0(inputId,"_",images[index])
    # element_id <- images[index]
    image_id <- images[index]
    title <- tooltips[index]
    message("formats", toString(formats))
    format <- formats[index]
    message("Format:", format)
    image_path <- file.path(web_path, paste0(image_id, '.', format))
    checkmark_html <- shiny::HTML('<svg class="button-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.66 12.66"><circle fill="currentColor" cx="6.33" cy="6.33" r="6.33"/><path fill="#ffffff" d="M5.38,9.56a.49.49,0,0,1-.27-.13L3.24,7.49a.44.44,0,0,1,0-.63.45.45,0,0,1,.63,0L5.39,8.43,8.77,3.94a.44.44,0,0,1,.71.53L5.79,9.39a.47.47,0,0,1-.33.17Z"/></svg>')
    if(!checkmark){
      checkmark_html <- NULL
    }

    out <- NULL
    if (format == "svg") {
      svg_highlight_css <- paste0(
        ".buttons-group .button-style.active-btn {
          background-color:", highlightColor,
        ";}",
        ".buttons-group .button-style.active-btn:hover {
          background-color:", highlightColor,
        ";}")
      out <- shiny::tags$div(style = paste0(imgStyle, "color: ", highlightColor),
                      class = "button-container",
                      tags$style(HTML(svg_highlight_css)),
                      shiny::tags$button(id = element_id,
                                         class = class,
                                         style = paste0("mask: url(",
                                                        image_path,
                                                        "); -webkit-mask: url(",
                                                        image_path,
                                                        "); mask-position: center; mask-repeat: no-repeat; mask-size: contain; -webkit-mask-position: center; -webkit-mask-repeat: no-repeat; -webkit-mask-size: contain;"),
                                         type = "submit",
                                         title = tooltips[index]),
                      checkmark_html
      )
    }
    if(format == "png"){
      out <- shiny::tags$button(id = element_id,
                         class = class,
                         style = paste0(imgStyle, "color: ", highlightColor, "; background: transparent !important;"),
                         type = "submit",
                         title= title,
                         checkmark_html,
                         shiny::tags$img(src = image_path, class = classImg))
    }
    out
  })

  if (is.null(active)){
    active <- images[1]
  }else{
    if(!active %in% images){
      warning("buttonImageInput with id: ", inputId,". active: '", active, "' not in images.",
              "Defaulting to first image")
      active <- images[1]
    }
  }

  active_idx <- which(images == active)
  l[[active_idx]] <- purrr::map(active_idx, function(a) {
    htmltools::HTML(gsub('"button-style"', '"button-style active-btn"', l[[a]]))
  })

  disabled_idx <- which(images %in% disabled)
  l[disabled_idx] <- purrr::map(disabled, function(a) {
    htmltools::HTML(gsub('"button-style"', '"button-style disabled-btn"', l[[a]]))
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
                        `data-value` = active,
                        shiny::tagList(shiny::singleton(shiny::tags$head(shiny::tags$link(rel = 'stylesheet',
                                                                                          type = 'text/css',
                                                                                          href = 'buttonImage/buttonImage.css'),
                                                                         shiny::tags$script(src = 'buttonImage/buttonImage-bindings.js')))),
                        class = 'button-image-input',
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
                                   disabled = NULL,
                                   tooltips = NULL,
                                   path = NULL,
                                   format = NULL) {

  message <- dropNulls(list(active = active))
  session$sendInputMessage(inputId, message)

}
