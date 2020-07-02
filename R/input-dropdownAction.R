#' @export
dropdownActionInput <- function(inputId, label, choices, images = NA, width = 150, downloadable = FALSE) {

  images <- images[seq_along(choices)]
  img <- ""
  images[is.na(images)] <- img

  shiny::addResourcePath(prefix = 'dropdownAction', directoryPath = system.file("lib/dropdownAction", package = "shinyinvoer"))

  l <- shiny::tagList(shiny::singleton(shiny::tags$head(shiny::tags$link(rel = 'stylesheet',
                                                                         type = 'text/css',
                                                                         href = 'dropdownAction/dropdown-action-binding.css'),
                                                        shiny::tags$script(src = 'dropdownAction/dropdown-action-binding.js'))))

  choices_list <- lapply(seq_along(choices), function(x) {
    list(id = choices[x], image = images[x], label = ifelse(is.null(names(choices[x])), choices[x], names(choices[x])))
  })

  input <- jsonlite::toJSON(choices_list, auto_unbox = TRUE)
  shiny::div(l,
             `data-options` = htmltools::HTML(input),
             `data-label` = label,
             `data-downloadable` = downloadable,
             id = inputId,
             class = "dropdown-action-container",
             style = paste0('width:', width, 'px;'))

}
