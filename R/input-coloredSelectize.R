#' @title Colored Selectize Input
#'
#' @description
#' A custom selectize input widget that allows custom background colors for selected options.
#' Similar to selectizeInput but with colored "chips" or "tags" for selected items.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param label Display label for the control, or \code{NULL} for no label.
#' @param choices List of options. Can be a vector or named list.
#' @param selected The initially selected value(s).
#' @param colors Vector of colors for the selected items. If length 1, all items use the same color.
#'   If length equals number of choices, each item gets its own color.
#' @param placeholder Character string giving the user a hint as to what can be typed into the control.
#' @param multiple Is multiple selection allowed?
#' @param reorder Allow drag-and-drop reordering of selected items? (Only works when multiple=TRUE)
#' @param width The width of the input, e.g. '400px', or '100\%'.
#'
#' @return A colored selectize input control that can be added to a UI definition.
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' # Example with iris dataset
#' ui <- fluidPage(
#'   coloredSelectizeInput(
#'     "iris_vars",
#'     "Select variables:",
#'     choices = c("Sepal.Length", "Sepal.Width", "Petal.Length", "Petal.Width", "Species"),
#'     colors = c("#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"),
#'     multiple = TRUE,
#'     placeholder = "Choose variables..."
#'   ),
#'   verbatimTextOutput("selected_vars")
#' )
#'
#' server <- function(input, output, session) {
#'   output$selected_vars <- renderPrint({
#'     input$iris_vars
#'   })
#' }
#'
#' shinyApp(ui, server)
#' }
#' }
#'
#' @export
coloredSelectizeInput <- function(inputId, label = NULL, choices = NULL, selected = NULL, 
                                 colors = NULL, placeholder = "Select options...", 
                                 multiple = TRUE, reorder = FALSE, width = NULL) {
  
  # Validate inputs
  if (is.null(inputId)) {
    inputId <- paste0("colored_selectize_", sample.int(1e9, 1))
  }
  
  if (is.null(choices)) {
    choices <- list()
  }
  
  # Convert choices to proper format
  if (is.vector(choices) && !is.list(choices)) {
    if (is.null(names(choices))) {
      choices <- as.list(setNames(choices, choices))
    } else {
      choices <- as.list(choices)
    }
  }
  
  # Handle colors
  if (is.null(colors)) {
    colors <- "#3498db"  # Default blue color
  }
  
  # Ensure colors is a vector
  if (!is.vector(colors)) {
    colors <- as.vector(colors)
  }
  
  # If only one color provided, use it for all choices
  if (length(colors) == 1) {
    colors <- rep(colors, length(choices))
  }
  
  # If more colors than choices, truncate
  if (length(colors) > length(choices)) {
    colors <- colors[1:length(choices)]
  }
  
  # If fewer colors than choices, repeat the last color
  if (length(colors) < length(choices)) {
    colors <- c(colors, rep(colors[length(colors)], length(choices) - length(colors)))
  }
  
  # Create color mapping - use the same keys as choices
  color_mapping <- setNames(colors, names(choices))
  
  # Add resource path
  addResourcePath(
    prefix = 'libColoredSelectize',
    directoryPath = system.file('lib', 'colored-selectize', package = 'shinyinvoer')
  )
  
  # Create dependencies
  dependencies <- shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(
          rel = 'stylesheet',
          type = 'text/css',
          href = 'libColoredSelectize/colored-selectize.css'
        ),
        shiny::tags$script(src = 'libColoredSelectize/colored-selectize-simple.js')
      )
    )
  )
  
  # Create the widget
  widget <- shiny::div(
    dependencies,
    shiny::div(
      `data-shiny-input-type` = "coloredSelectizeInput",
      id = inputId,
      class = 'colored-selectize-widget',
      `data-choices` = jsonlite::toJSON(choices, auto_unbox = TRUE),
      `data-selected` = jsonlite::toJSON(selected, auto_unbox = TRUE),
      `data-colors` = jsonlite::toJSON(color_mapping, auto_unbox = TRUE),
      `data-placeholder` = placeholder,
      `data-multiple` = tolower(as.character(multiple)),
      `data-reorder` = tolower(as.character(reorder)),
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

#' @title Update Colored Selectize Input
#'
#' @description
#' Change the value of a colored selectize input on the client.
#'
#' @param session The \code{session} object passed to function given to \code{shinyServer}.
#' @param inputId The id of the input object.
#' @param label The label to set for the input.
#' @param choices The new choices for the input.
#' @param selected The new selected value(s).
#' @param colors The new colors for the selected items.
#' @param placeholder The new placeholder text.
#' @param options The new options for the selectize input.
#'
#' @export
updateColoredSelectizeInput <- function(session, inputId, label = NULL, choices = NULL, 
                                       selected = NULL, colors = NULL, placeholder = NULL, 
                                       options = NULL) {
  
  message <- list()
  
  if (!is.null(label)) {
    message$label <- label
  }
  
  if (!is.null(choices)) {
    # Convert choices to proper format
    if (is.vector(choices) && !is.list(choices)) {
      if (is.null(names(choices))) {
        choices <- as.list(setNames(choices, choices))
      } else {
        choices <- as.list(choices)
      }
    }
    message$choices <- choices
  }
  
  if (!is.null(selected)) {
    message$selected <- selected
  }
  
  if (!is.null(colors)) {
    # Handle colors the same way as in the main function
    if (length(colors) == 1) {
      colors <- rep(colors, length(choices %||% session$input[[inputId]]))
    }
    message$colors <- colors
  }
  
  if (!is.null(placeholder)) {
    message$placeholder <- placeholder
  }
  
  if (!is.null(options)) {
    message$options <- options
  }
  
  session$sendInputMessage(inputId, message)
}

# Helper function for null coalescing
`%||%` <- function(x, y) {
  if (is.null(x)) y else x
}
