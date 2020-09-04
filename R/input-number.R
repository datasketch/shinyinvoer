#' @export
numberInput <- function(inputId, label=NULL, value=0, min=NULL, max=NULL, step=1) {
  addResourcePath(
    prefix="number-input", directoryPath=system.file("lib/number-input", package="shinyinvoer")
  )

  tagList(
    singleton(tags$head(
      tags$script(src="number-input/number-input.js"),
      tags$link(rel="stylesheet", type="text/css", href="number-input/number-input.css")
    )),
    tags$div(class="number-input",
             id=inputId,
             tags$label(label),
             tags$div(class="number-input-controls",
               tags$button(id="step-down", "-"),
               tags$input(type="number", min=min, max=max, value=value, step=step),
               tags$button(id="step-up", "+")
             )),
  )
}

#' Update number input
#' @export
updateNumberInput <- function (session, inputId, value) {
  message <- dropNulls(list(value = value))
  session$sendInputMessage(inputId, message)
}

# copied from shiny since it's not exported
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE=logical(1))]
}
