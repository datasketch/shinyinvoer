#' @export

colorPaletteInput <- function(inputId, label, colors = list(), palette = list(),
                              alpha = FALSE, max_colors = 1000) {

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

#' Update spectrum color picker input
#' @export
updateColorPaletteInput <- function (session, inputId, colors = list(), palette = list()) {
  message <- dropNulls(list(colors = colors, palette = palette))
  session$sendInputMessage(inputId, message)
}

# copied from shiny since it's not exported
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE=logical(1))]
}
