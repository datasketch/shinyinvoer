#' @export

spectrumColorPicker <- function(inputId, label, colors = list(), palette = list(), alpha = F, max_colors = 1000) {

  addResourcePath(
    prefix = 'spectrumColorPicker',
    directoryPath = system.file('lib/spectrumColorPicker', package='shinyinvoer')
  )

  l <- shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(rel = 'stylesheet',
                        type = 'text/css',
                        href = 'spectrumColorPicker/spectrum.css'),
        shiny::tags$link(rel = 'stylesheet',
                         type = 'text/css',
                         href = 'spectrumColorPicker/spectrumColorPicker-binding.css'),
        shiny::tags$script(src = 'spectrumColorPicker/spectrum.js'),
        shiny::tags$script(src = 'spectrumColorPicker/spectrumColorPicker-binding.js')
      ))
  )

  shiny::div(
    shiny::tags$label(shiny::tags$span(label)),
    shiny::div(
      l,
      id = inputId,
      class = 'input-spectrum-color-picker',
      `data-colors` = jsonlite::toJSON(colors),
      `data-palette` = jsonlite::toJSON(palette),
      alpha = alpha,
      `max-colors` = max_colors,
      shiny::tags$button(class="input-spectrum-add-color", '+')
    )
  )
}
