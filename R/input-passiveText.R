#' @export
passiveTextInput <-
  function(inputId,
           label = NULL,
           value = ,
           placeholder = NULL,
           showButton = F,
           buttonLabel = NULL) {
    addResourcePath(
      prefix = "passive-text-input",
      directoryPath = system.file("lib/passive-text-input", package = "shinyinvoer")
    )

    buttonEl <- tags$button(buttonLabel)

    tagList(
      singleton(tags$head(
        tags$script(src = "passive-text-input/passive-text-input.js"),
        tags$link(rel = "stylesheet", type = "text/css", href = "passive-text-input/passive-text-input.css")
      )),
      tags$div(
        class = "shinyinvoer-passive-text-input",
        `data-value`=value,
        id = inputId,
        tags$label(class = "control-label", label),
        tags$div(
          class = "shinyinvoer-passive-text-input-controls",
          tags$input(
            type = "text",
            placeholder = placeholder,
            class = "form-control"
          ),
          if (showButton) buttonEl
        )
      )
    )
  }

#' Update passive text input
#' @export
updatePassiveTextInput <- function (session, inputId, value = "") {
  message <- list(value = value)
  session$sendInputMessage(inputId, message)
}

