#' @export
dropdownActionInput <- function(inputId, label, choices, images = NA, width = 150, downloadable = FALSE, loader = FALSE) {

  loadGif <- ""
  if (loader) {
    loadGif <- "data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA"
  }
  # shiny::icon("circle")
  images <- images[seq_along(choices)]
  img <- ""
#   if (downloadable) {
#     # img <- paste0(system.file("examples/www/img/", package = "shinyinvoer"), "/download.png")
# #      img <- "img/download.png"
#   }
  images[is.na(images)] <- img
  # htmlDependency("font-awesome",
  #                "5.13.0", "www/shared/fontawesome", package = "shiny",
  #                stylesheet = c("css/all.min.css", "css/v4-shims.min.css"))

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
             `data-loader` = loadGif,
             id = inputId,
             class = "dropdown-action-container",
             style = paste0('width:', width, 'px;'))

}
