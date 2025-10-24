#' @title Colored Select Input
#'
#' @description
#' A custom select input widget similar to selectizeInput but with the ability to
#' display colored backgrounds for selected options. Supports both single and multiple
#' selection modes.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param label Display label for the control, or \code{NULL} for no label.
#' @param choices List of options. Each option should be a list with 'value', 'label', and 'color' fields.
#'   If a simple vector is provided, it will be converted to the proper format.
#' @param selected The initially selected value(s). For multiple selection, provide a vector.
#' @param multiple Is multiple selection allowed?
#' @param placeholder Character string giving the user a hint as to what can be typed into the control.
#' @param width The width of the input, e.g. '400px', or '100\%'.
#'
#' @return A colored select input control that can be added to a UI definition.
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' # Single selection with colors
#' ui <- fluidPage(
#'   coloredSelectInput(
#'     "color1",
#'     "Choose a color:",
#'     choices = list(
#'       list(value = "red", label = "Red", color = "#ff0000"),
#'       list(value = "green", label = "Green", color = "#00ff00"),
#'       list(value = "blue", label = "Blue", color = "#0000ff")
#'     )
#'   ),
#'   verbatimTextOutput("result1")
#' )
#'
#' # Multiple selection
#' ui <- fluidPage(
#'   coloredSelectInput(
#'     "color2",
#'     "Choose multiple colors:",
#'     choices = list(
#'       list(value = "red", label = "Red", color = "#ff0000"),
#'       list(value = "green", label = "Green", color = "#00ff00"),
#'       list(value = "blue", label = "Blue", color = "#0000ff"),
#'       list(value = "yellow", label = "Yellow", color = "#ffff00")
#'     ),
#'     multiple = TRUE,
#'     selected = c("red", "blue")
#'   ),
#'   verbatimTextOutput("result2")
#' )
#'
#' server <- function(input, output, session) {
#'   output$result1 <- renderPrint({ input$color1 })
#'   output$result2 <- renderPrint({ input$color2 })
#' }
#'
#' shinyApp(ui, server)
#' }
#' }
#'
#' @export
coloredSelectInput <- function(inputId, label = NULL, choices = NULL, selected = NULL, 
                              multiple = FALSE, placeholder = "Select an option...", 
                              width = NULL) {
  
  # Validate inputs
  if (is.null(inputId)) {
    inputId <- paste0("colored_select_", sample.int(1e9, 1))
  }
  
  if (is.null(choices)) {
    choices <- list()
  }
  
  # Convert simple vector to proper format if needed
  if (is.vector(choices) && !is.list(choices)) {
    choices <- lapply(choices, function(x) {
      list(value = x, label = x, color = "#e0e0e0")
    })
  }
  
  # Ensure all choices have required fields
  choices <- lapply(choices, function(choice) {
    if (is.character(choice) && length(choice) == 1) {
      # Handle simple string
      list(value = choice, label = choice, color = "#e0e0e0")
    } else if (is.list(choice)) {
      # Ensure all required fields exist
      list(
        value = choice$value %||% choice[[1]] %||% "",
        label = choice$label %||% choice$value %||% choice[[1]] %||% "",
        color = choice$color %||% "#e0e0e0"
      )
    } else {
      # Fallback
      list(value = as.character(choice), label = as.character(choice), color = "#e0e0e0")
    }
  })
  
  # Add resource path
  addResourcePath(
    prefix = 'libColoredSelect',
    directoryPath = system.file('lib', 'colored-select', package = 'shinyinvoer')
  )
  
  # Create dependencies
  dependencies <- shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(
          rel = 'stylesheet',
          type = 'text/css',
          href = 'libColoredSelect/colored-select.css'
        ),
        shiny::tags$script(src = 'libColoredSelect/colored-select.js'),
        shiny::tags$script(src = 'libColoredSelect/colored-select-binding.js')
      )
    )
  )
  
  # Create the widget
  widget <- shiny::div(
    dependencies,
    shiny::div(
      `data-shiny-input-type` = "coloredSelectInput",
      id = inputId,
      class = 'colored-select-widget',
      `data-options` = jsonlite::toJSON(choices, auto_unbox = TRUE),
      `data-placeholder` = placeholder,
      `data-multiple` = tolower(as.character(multiple)),
      `data-selected` = jsonlite::toJSON(selected, auto_unbox = TRUE),
      style = if (!is.null(width)) paste0("width: ", width, ";")
    )
  )
  
  # Add label if provided
  if (!is.null(label)) {
    shiny::div(
      shiny::tags$label(label, `for` = inputId),
      widget
    )
  } else {
    widget
  }
}

#' @title Update Colored Select Input
#'
#' @description
#' Change the value of a colored select input on the client.
#'
#' @param session The \code{session} object passed to function given to \code{shinyServer}.
#' @param inputId The id of the input object.
#' @param label The label to set for the input.
#' @param choices The new choices for the input.
#' @param selected The new selected value(s).
#' @param placeholder The new placeholder text.
#'
#' @export
updateColoredSelectInput <- function(session, inputId, label = NULL, choices = NULL, 
                                    selected = NULL, placeholder = NULL) {
  
  message <- list()
  
  if (!is.null(label)) {
    message$label <- label
  }
  
  if (!is.null(choices)) {
    # Convert choices to proper format if needed
    if (is.vector(choices) && !is.list(choices)) {
      choices <- lapply(choices, function(x) {
        list(value = x, label = x, color = "#e0e0e0")
      })
    }
    
    # Ensure all choices have required fields
    choices <- lapply(choices, function(choice) {
      if (is.character(choice) && length(choice) == 1) {
        list(value = choice, label = choice, color = "#e0e0e0")
      } else if (is.list(choice)) {
        list(
          value = choice$value %||% choice[[1]] %||% "",
          label = choice$label %||% choice$value %||% choice[[1]] %||% "",
          color = choice$color %||% "#e0e0e0"
        )
      } else {
        list(value = as.character(choice), label = as.character(choice), color = "#e0e0e0")
      }
    })
    
    message$options <- choices
  }
  
  if (!is.null(selected)) {
    message$value <- selected
  }
  
  if (!is.null(placeholder)) {
    message$placeholder <- placeholder
  }
  
  session$sendInputMessage(inputId, message)
}

# Helper function for null coalescing
`%||%` <- function(x, y) {
  if (is.null(x)) y else x
}
