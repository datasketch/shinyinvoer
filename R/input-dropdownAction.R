#' @export
dropdownActionInput <- function(inputId, label, choices, images = NULL, width = 150) {

  shiny::addResourcePath(
    prefix='dropdownAction',
    directoryPath=system.file("lib/dropdownAction",
                              package='shinyinvoer')
  )

  l <- shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(rel = 'stylesheet',
                         type = 'text/css',
                         href = 'dropdownAction/dropdown-action-binding.css'),
        shiny::tags$script(src = 'dropdownAction/dropdown-action-binding.js')
      ))
  )

  choices_list <- lapply(seq_along(choices), function(x){
    list(id = choices[x],
         image = images[x],
         label = ifelse(is.null(names(choices[x])), 0, names(choices[x]))
    )
  })

  input <- jsonlite::toJSON(choices_list, auto_unbox = TRUE)

  shiny::div(
    l,
    `data-options` = htmltools::HTML(input),
    `data-label` = label,
    id = inputId,
    class = "dropdown-action-container",
    style = paste0('width:', width, 'px;')
  )
}
