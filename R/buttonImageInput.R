
#' Button Image Input
#'
#' Create a group of buttons with images that can be selected individually.
#' Each button displays an image and can be configured with various styling options.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param label Optional label for the input group.
#' @param images Named vector of image files. Names become tooltips, values are image filenames.
#' @param active Initial active button (image ID without extension).
#' @param disabled Vector of disabled button IDs.
#' @param tooltips Optional custom tooltips for each button.
#' @param path Directory path where images are stored.
#' @param ncol Number of columns in the grid layout.
#' @param nrow Number of rows in the grid layout.
#' @param format Image format (png, svg, etc.). Auto-detected if not specified.
#' @param highlightColor Color for highlighting active buttons.
#' @param checkmark Whether to show checkmark on active buttons.
#' @param button_width Width of buttons in pixels. Default: 60.
#' @param button_height Height of buttons in pixels. If NULL, uses button_width for square buttons.
#' @param button_ar Aspect ratio (width/height). If NULL, uses button_width and button_height.
#' @param layout Layout type: "flex" (default) or "grid". Use "grid" for nrow/ncol control, "flex" for natural flow.
#' @param container_width Width of the container. Can be CSS values like "300px", "50%", "auto", etc. Default: "100%".
#'
#' @details
#' Button sizing can be controlled using 2 of 3 parameters:
#' \itemize{
#'   \item \code{button_width} and \code{button_height}: Explicit dimensions
#'   \item \code{button_width} and \code{button_ar}: Width with aspect ratio
#'   \item \code{button_height} and \code{button_ar}: Height with aspect ratio
#'   \item \code{button_width} only: Square buttons
#'   \item \code{button_height} only: Square buttons
#'   \item \code{button_ar} only: Uses default max width (100px)
#' }
#'
#' Layout options:
#' \itemize{
#'   \item \code{layout = "flex"} (default): Buttons flow naturally to the next line when they run out of space. 
#'         Container width is 100\% by default but can be controlled with \code{container_width}.
#'   \item \code{layout = "grid"}: Uses CSS Grid layout. \code{nrow} and \code{ncol} parameters are required for this layout.
#'         Buttons stretch to fill the available space in the specified grid structure.
#' }
#'
#' @return A Shiny input element that can be used in UI.
#'
#' @examples
#' \dontrun{
#' # Basic usage with square buttons
#' buttonImageInput(
#'   inputId = "chart_type",
#'   images = c("Map" = "map", "Pie" = "pie", "Bar" = "bar"),
#'   path = "www/icons",
#'   active = "map"
#' )
#'
#' # Single row layout with custom sizing
#' buttonImageInput(
#'   inputId = "chart_type",
#'   images = c("Map" = "map", "Pie" = "pie", "Bar" = "bar"),
#'   path = "www/icons",
#'   button_width = 30,
#'   button_height = 30,
#'   nrow = 1,
#'   ncol = 3
#' )
#'
#' # Rectangular buttons with aspect ratio
#' buttonImageInput(
#'   inputId = "chart_type",
#'   images = c("Map" = "map", "Pie" = "pie", "Bar" = "bar"),
#'   path = "www/icons",
#'   button_width = 40,
#'   button_ar = 1.5
#' )
#' }
#'
#' @export
buttonImageInput <- function(inputId,
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
                                 button_width = NULL,
                                 button_height = NULL,
                                 button_ar = NULL,
                                 layout = "flex",
                                 container_width = "100%"
) {

  # Set default button_width if not provided
  button_width <- button_width %||% 60
  
  # Calculate button dimensions based on provided parameters
  button_dims <- calculateButtonDimensions(button_width, button_height, button_ar)
  
  image_list <- buttonImageOptions(images = images,
                                   tooltips = tooltips,
                                   path = path,
                                   format = format,
                                   active = active,
                                   disabled = disabled
  )

  image_list <- lapply(image_list, function(img) {
    button_image(id = img$id, 
                 path = img$path, 
                 tooltip = img$tooltip, 
                 inputId = inputId,
                 checkmark = checkmark,
                 button_width = button_dims$width,
                 button_height = button_dims$height,
                 highlightColor = highlightColor,
                 active = img$id %in% active,
                 disabled = img$id %in% disabled)
  })

  addResourcePath(prefix='buttonImage',
                  directoryPath=system.file("lib/buttonImage",
                                            package='shinyinvoer'))

  # Calculate layout style based on layout parameter
  if (layout == "flex") {
    # Use flexbox flow layout
    layout_style <- "display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-start; align-items: center;"
  } else if (layout == "grid") {
    # Use grid layout
    if (is.null(nrow) & is.null(ncol)) {
      layout_style <- ""
    } else {
      if (is.null(ncol)) {
        n0 <- ceiling(length(images) / nrow)
        layout_style <- paste0("grid-template-columns: repeat(", n0, ", 1fr) !important;")
      } else {
        layout_style <- paste0("grid-template-columns: repeat(", ncol, ", 1fr) !important;")
      }
    }
  } else {
    stop('layout must be either "flex" or "grid"')
  }

  div(
    id = inputId,
    class = "button-image-input",
    style = glue::glue("width: {container_width}; {layout_style}"),
    shiny::tagList(
      shiny::singleton(
        shiny::tags$head(
          shiny::tags$link(rel = 'stylesheet',
                           type = 'text/css',
                           href = 'buttonImage/buttonImage.css'),
          shiny::tags$script(src = 'buttonImage/buttonImage-bindings.js'))
      )
    ),
    image_list
  )
}

# Helper function to calculate button dimensions
calculateButtonDimensions <- function(width, height, aspect_ratio) {
  # Default max width if no dimensions provided
  max_width <- 100
  
  # If no parameters provided, use default max width
  if (is.null(width) && is.null(height) && is.null(aspect_ratio)) {
    return(list(width = max_width, height = max_width))
  }
  
  # If only width provided, assume square (aspect ratio = 1)
  if (!is.null(width) && is.null(height) && is.null(aspect_ratio)) {
    return(list(width = width, height = width))
  }
  
  # If only height provided, assume square (aspect ratio = 1)
  if (is.null(width) && !is.null(height) && is.null(aspect_ratio)) {
    return(list(width = height, height = height))
  }
  
  # If width and height provided, use both
  if (!is.null(width) && !is.null(height)) {
    return(list(width = width, height = height))
  }
  
  # If width and aspect ratio provided, calculate height
  if (!is.null(width) && is.null(height) && !is.null(aspect_ratio)) {
    return(list(width = width, height = width / aspect_ratio))
  }
  
  # If height and aspect ratio provided, calculate width
  if (is.null(width) && !is.null(height) && !is.null(aspect_ratio)) {
    return(list(width = height * aspect_ratio, height = height))
  }
  
  # If only aspect ratio provided, use default max width
  if (is.null(width) && is.null(height) && !is.null(aspect_ratio)) {
    return(list(width = max_width, height = max_width / aspect_ratio))
  }
  
  # Fallback to default
  return(list(width = max_width, height = max_width))
}


button_image <- function(id, path, tooltip, inputId,
                         buttonClass = NULL,
                         imageStyle = "",
                         checkmark = checkmark,
                         button_width = NULL,
                         button_height = NULL,
                         highlightColor = NULL,
                         active = FALSE,
                         disabled = FALSE){

  width <- paste0(button_width,"px")
  height <- paste0(button_height,"px")
  active_btn <- ifelse(active, "active-btn", "")
  disabled_btn <- ifelse(disabled, "disabled-btn", "")
  overlay_style <- ifelse(disabled, "background:transparent;",
                          glue::glue("background-color: {highlightColor};"))

  shiny::tags$div(style = glue::glue("cursor: pointer; width:{width}; height:{height}"),
                  class = "button-container",
                  shiny::tags$div(id = paste0(inputId, "_", id),
                                  class = c("button-style", active_btn, disabled_btn),
                                  #style = paste0(imgStyle, "color: ", highlightColor, "; background: transparent !important;"),
                                  style = imageStyle,
                                  type = "submit",
                                  title= tooltip,
                                  checkmark_html(checkmark),
                                  shiny::tags$img(src = path, class = buttonClass),
                                  shiny::tags$div(class = c("overlay", "disabled-btn-bg"),
                                                  style = overlay_style)
                  )
  )
}



checkmark_html <- function(include){
  if(!include) return()
  shiny::HTML('<svg class="button-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.66 12.66"><circle fill="currentColor" cx="6.33" cy="6.33" r="6.33"/><path fill="#ffffff" d="M5.38,9.56a.49.49,0,0,1-.27-.13L3.24,7.49a.44.44,0,0,1,0-.63.45.45,0,0,1,.63,0L5.39,8.43,8.77,3.94a.44.44,0,0,1,.71.53L5.79,9.39a.47.47,0,0,1-.33.17Z"/></svg>')
}

buttonImageOptions <- function(images = NULL,
                               active = NULL,
                               disabled = NULL,
                               tooltips = NULL,
                               path = NULL,
                               format = NULL){
  # TODO case when images come from urls
  if(!is.null(path)){
    if(!dir.exists(path)) stop("Path doesn't exist")
    web_path <- gsub("^www/", "", path)
  }else{
    web_path <- path %||% ""
  }
  tooltips <- names(images) %||% basename(dstools::sans_ext(images))
  formats <- dstools::file_ext(images)
  without_ext <- all(formats == "")
  if(is.null(format) && without_ext){
    if(is.null(path)) stop("Need path of images with extensions")
    default_format <- unique(tools::file_ext(list.files(path)))
    if(length(default_format) > 1)
      stop("All images in path should have the same format extension")
    format <- default_format
  }
  if(without_ext){
    if(is.null(format))
      stop("Need image formats. As images.png or as images=c(image1,image2) with format = png")
    formats <- rep(format, length(images))
    web_paths <- file.path(web_path, paste0(images, '.', formats))
  }else{
    web_paths <- file.path(web_path, images)
  }
  web_paths <- gsub("^/www", "", web_paths)

  image_ids <- dstools::sans_ext(images)

  image_list <- purrr::transpose(list(
    id = image_ids,
    path = web_paths,
    tooltip = tooltips,
    format = formats
  ))
  image_list

}



updateButtonImageInput <- function(session, inputId,
                                       active = NULL) {
  session$sendInputMessage(inputId,
                           list(active = active))
}

