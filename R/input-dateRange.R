#' @export
dateRangeInput <- function(inputId,
                           label = NULL,
                           start,
                           end,
                           min,
                           max,
                           startLabel = '&nbsp;',
                           endLabel = '&nbsp;',
                           resetLabel = NULL,
                           locale = NULL) {
  addResourcePath(
    prefix = "date-range-input",
    directoryPath = system.file("lib/date-range-input", package = "shinyinvoer")
  )
  tagList(
    singleton(
      tags$head(
        tags$link(rel = "stylesheet", type = "text/css", href = "date-range-input/flatpickr.min.css"),
        tags$link(rel = "stylesheet", type = "text/css", href = "date-range-input/date-range-input.css"),
        tags$script(src = "date-range-input/flatpickr.min.js"),
        tags$script(src = "date-range-input/flatpickr-es.locale.js"),
        tags$script(src = "date-range-input/date-range-input.js"),
      )
    ),
    tags$div(
      class = "shinyinvoer-date-range-input",
      id = inputId,
      `data-start` = start,
      `data-end` = end,
      `data-min` = min,
      `data-max` = max,
      `data-start-label` = startLabel,
      `data-end-label` = endLabel,
      `data-reset-label` = resetLabel,
      `data-locale` = locale,
      tags$label(label),
      tags$div(
        class = "shinyinvoer-date-range-container",
        tags$div(
          class = "shinyinvoer-date-range-select",
          tags$p(startLabel),
          tags$input(class = "shinyinvoer-date-range-start"),
        ),
        tags$div(
          class = "shinyinvoer-date-range-select",
          tags$p(endLabel),
          tags$input(class = "shinyinvoer-date-range-end"),
        ),
      ),
      tags$button(class = "shinyinvoer-date-range-reset", resetLabel)
    )
  )
}
