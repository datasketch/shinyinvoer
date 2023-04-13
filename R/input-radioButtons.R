#' @export
radioButtonsInput <-
  function(inputId,
           label = NULL,
           choices = list(),
           selected = '',
           class_label = NULL,
           class_choices = NULL) {
    addResourcePath(
      prefix = "radio-buttons-input",
      directoryPath = system.file("lib/radio-buttons-input", package = "shinyinvoer")
    )

    tagList(
      singleton(tags$head(
        tags$script(src = "radio-buttons-input/radio-buttons-input.js"),
        tags$link(rel = "stylesheet", type = "text/css", href = "radio-buttons-input/radio-buttons-input.css")
      )),
      tags$div(
        class = "shinyinvoer-radio-buttons-input",
        id = inputId,
        `data-choices` = jsonlite::toJSON(choices),
        `data-selected` = selected,
        div(id = class_label, tags$label(label)),
        tags$div(class = paste("shinyinvoer-radio-buttons-choices", class_choices)),
      )
    )
  }

#' @export
updateRadioButtonsInput <- function(session, inputId, choices) {
  message <- dropNulls(list(choices = choices))
  session$sendInputMessage(inputId, message)
}

# copied from shiny since it's not exported
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE = logical(1))]
}
