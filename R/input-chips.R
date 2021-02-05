#' @export
chipsInput <- function(inputId, label=NULL, placeholder=NULL, chips=list()) {
  addResourcePath(
    prefix="chip-input", directoryPath=system.file("lib/chip-input", package="shinyinvoer")
  )

  tagList(
    singleton(tags$head(
      tags$script(src="chip-input/chip-input.js"),
      tags$link(rel="stylesheet", type="text/css", href="chip-input/chip-input.css")
    )),
    tags$div(class="shinyinvoer-chips-input",
             id=inputId,
             `data-chips`=jsonlite::toJSON(chips),
             tags$label(class = "control-label", label),
             tags$div(class="chip-container",
                      tags$div(class="chip-list",
                               tags$div(class="chip-input-container",
                                        tags$input(type="text",
                                                   class="chip-input",
                                                   placeholder=placeholder))))),
  )
}

#' Update chip input
#' @export
updateChipsInput <- function (session, inputId, chips) {
  message <- dropNulls(list(chips = chips))
  session$sendInputMessage(inputId, message)
}

# copied from shiny since it's not exported
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE=logical(1))]
}
