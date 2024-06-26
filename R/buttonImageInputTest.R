
#' @export
buttonImageInputTest <- function(inputId,
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
                             button_width = NULL
) {

  button_width <- button_width %||% 60
  image_list <- buttonImageOptions(images = images,
                                   tooltips = tooltips,
                                   path = path,
                                   format = format,
                                   active = active,
                                   disabled = disabled
  )

  image_list <- lapply(image_list, function(img) {
    button_image(img$id, img$path, img$tooltip, inputId,
                 checkmark = checkmark,
                 button_width = button_width,
                 highlightColor = highlightColor,
                 active = img$id %in% active,
                 disabled = img$id %in% disabled)
  })

  div(
    id = inputId,
    class = "button-image-input",
    # shiny::tagList(
    #   shiny::singleton(
    #     shiny::tags$head(
    #       shiny::tags$link(rel = 'stylesheet',
    #                        type = 'text/css',
    #                        href = 'buttonImage/buttonImage.css'),
    #       shiny::tags$script(src = 'buttonImage/buttonImage-bindings.js'))
    #   )
    # ),
    image_list
  )
}


button_image <- function(id, path, tooltip, inputId,
                         buttonClass = NULL,
                         imageStyle = "",
                         checkmark = checkmark,
                         button_width = NULL,
                         highlightColor = NULL,
                         active = FALSE,
                         disabled = FALSE){

  max_width <- paste0(button_width,"px")
  active_btn <- ifelse(active, "active-btn", "")
  disabled_btn <- ifelse(disabled, "disabled-btn", "")
  overlay_style <- ifelse(disabled, "background:transparent;",
                          glue::glue("background-color: {highlightColor};"))

  shiny::tags$div(style = glue::glue("cursor: pointer; margin: 5px;max-width:{max_width}"),
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

#' @export
updateButtonImageInputTest <- function(session, inputId,
                                       active = NULL) {
  session$sendInputMessage(inputId,
                           list(active = active))
}

