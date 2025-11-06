#' @title Side Panel Widget
#'
#' @description
#' A side panel widget with a button toggle, sidebar menu with icons, and
#' dynamic content area. The panel can be positioned on the left or right side,
#' and the main content shifts accordingly when the panel is open or closed.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#'   The widget creates two input values:
#'   \itemize{
#'     \item{\code{input$<inputId>}}{Standard binding value (legacy)}
#'     \item{\code{input$<inputId>_state}}{Explicit state notifications with
#'       \code{isOpen}, \code{selectedItem}, \code{renderOnly}, and
#'       \code{renderItemId} fields. Recommended for new code.}
#'   }
#' @param menuItems List of menu items. Each item should have:
#'   \describe{
#'     \item{id}{Unique identifier for the menu item}
#'     \item{icon}{SVG icon code or icon name}
#'     \item{title}{Title to display in the header when selected}
#'     \item{tooltip}{Tooltip text shown on hover}
#'     \item{body}{HTML content to display in the panel body when selected.
#'       Can be a \code{tagList}, \code{div}, or any Shiny HTML tag. Supports
#'       \code{uiOutput} and other Shiny outputs. The content will be rendered
#'       and displayed in the panel when the menu item is selected. (optional)}
#'   }
#' @param position Position of the panel: \code{"left"} or \code{"right"}.
#'   Default is \code{"left"}.
#' @param panelWidth Width of the side panel. Default is \code{"300px"}.
#' @param initialOpen Should the panel be open initially? Default is \code{TRUE}.
#' @param mainContentId The \code{id} of the main content container that should
#'   shift when the panel opens/closes.
#' @param containerId The \code{id} of the container where the panel should be
#'   positioned. If \code{NULL}, the panel will be positioned relative to the
#'   document body. Default is \code{NULL}.
#' @param buttonText Text to display next to the toggle button. Default is
#'   \code{"Edit"}.
#' @param width The width of the button container, e.g. '400px', or '100\%'.
#'
#' @return A side panel widget that can be added to a UI definition.
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' # Example with menu items
#' ui <- fluidPage(
#'   tags$head(
#'     tags$style(HTML("
#'       #main-content {
#'         padding: 20px;
#'         transition: margin-left 0.3s ease;
#'       }
#'     "))
#'   ),
#'   sidePanelInput(
#'     "side_panel",
#'     menuItems = list(
#'       list(
#'         id = "home",
#'         icon = "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path></svg>",
#'         title = "Home",
#'         tooltip = "Go to home"
#'       ),
#'       list(
#'         id = "settings",
#'         icon = "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor'><circle cx='12' cy='12' r='3'></circle><path d='M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24'></path></svg>",
#'         title = "Settings",
#'         tooltip = "Settings"
#'       )
#'     ),
#'     mainContentId = "main-content",
#'     buttonText = "Edit",
#'     initialOpen = TRUE
#'   ),
#'   div(id = "main-content",
#'     h2("Main Content"),
#'     p("This content shifts when the panel opens/closes")
#'   )
#' )
#'
#' server <- function(input, output, session) {
#'   # Using explicit state input (recommended)
#'   observeEvent(input$side_panel_state, {
#'     state <- input$side_panel_state
#'     cat("Panel is:", ifelse(state$isOpen, "open", "closed"), "\n")
#'     cat("Selected item:", state$selectedItem, "\n")
#'   })
#'   
#'   # Legacy binding (still works)
#'   # observeEvent(input$side_panel, {
#'   #   cat("Panel is:", ifelse(input$side_panel$isOpen, "open", "closed"), "\n")
#'   # })
#' }
#'
#' shinyApp(ui, server)
#' }
#' }
#'
#' @export
sidePanelInput <- function(inputId, label = NULL, menuItems = list(),
                          position = c("left", "right"), panelWidth = "300px",
                          initialOpen = TRUE, mainContentId = "main-content",
                          containerId = NULL, buttonText = "Edit", width = NULL) {
  
  # Validate inputId - must be provided
  if (is.null(inputId) || !is.character(inputId) || length(inputId) != 1 || nchar(inputId) == 0) {
    stop("inputId must be a non-empty character string", call. = FALSE)
  }
  
  # Validate position
  position <- match.arg(position)
  
  # Validate panelWidth
  if (!is.character(panelWidth) || length(panelWidth) != 1) {
    stop("panelWidth must be a character string (e.g., '300px')", call. = FALSE)
  }
  
  # Validate initialOpen
  if (!is.logical(initialOpen) || length(initialOpen) != 1) {
    stop("initialOpen must be a single logical value", call. = FALSE)
  }
  
  # Validate mainContentId
  if (!is.character(mainContentId) || length(mainContentId) != 1) {
    stop("mainContentId must be a character string", call. = FALSE)
  }
  
  # Validate containerId if provided
  if (!is.null(containerId) && (!is.character(containerId) || length(containerId) != 1)) {
    stop("containerId must be NULL or a character string", call. = FALSE)
  }
  
  # Validate buttonText
  if (!is.character(buttonText) || length(buttonText) != 1) {
    stop("buttonText must be a character string", call. = FALSE)
  }
  
  # Validate width if provided
  if (!is.null(width) && (!is.character(width) || length(width) != 1)) {
    stop("width must be NULL or a character string", call. = FALSE)
  }
  
  # Validate menuItems structure
  if (!is.list(menuItems)) {
    stop("menuItems must be a list", call. = FALSE)
  }
  
  if (length(menuItems) == 0) {
    menuItems <- list(
      list(
        id = "default",
        icon = "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor'><rect x='3' y='3' width='18' height='18' rx='2'></rect></svg>",
        title = "Default",
        tooltip = "Default menu item"
      )
    )
  }
  
  # Helper function to convert logical/character to lowercase string
  to_lower_char <- function(x) {
    tolower(as.character(x))
  }
  
  # Validate each menu item has required fields and convert body to HTML string
  menuItems <- purrr::map(menuItems, function(item) {
    # Validate item is a list
    if (!is.list(item)) {
      stop("Each menu item must be a list", call. = FALSE)
    }
    
    # Validate and set id (required)
    if (is.null(item$id) || !is.character(item$id) || length(item$id) != 1 || nchar(item$id) == 0) {
      stop("Each menu item must have a non-empty character 'id' field", call. = FALSE)
    }
    
    # Validate and set title (required)
    if (is.null(item$title) || !is.character(item$title) || length(item$title) != 1) {
      stop(glue::glue("Menu item '{item$id}' must have a character 'title' field"), call. = FALSE)
    }
    
    # Set defaults for optional fields
    if (is.null(item$icon)) item$icon <- ""
    if (is.null(item$tooltip)) item$tooltip <- item$title
    
    # Validate icon if provided
    if (!is.character(item$icon) || length(item$icon) != 1) {
      warning(glue::glue("Menu item '{item$id}' has invalid icon, using empty string"), call. = FALSE)
      item$icon <- ""
    }
    
    # Validate tooltip if provided
    if (!is.character(item$tooltip) || length(item$tooltip) != 1) {
      warning(glue::glue("Menu item '{item$id}' has invalid tooltip, using title"), call. = FALSE)
      item$tooltip <- item$title
    }
    
    # Convert body (if provided) to HTML string
    if (!is.null(item$body)) {
      tryCatch({
        # Use htmltools to render the body to HTML string
        # htmltools is a dependency of shiny, so it should always be available
        rendered <- htmltools::renderTags(item$body)
        item$body_html <- as.character(rendered$html)
        # Remove body from the item (we only need body_html for JSON)
        item$body <- NULL
      }, error = function(e) {
        stop(glue::glue("Error rendering body for menu item '{item$id}': {e$message}"), call. = FALSE)
      })
    }
    
    item
  })
  
  # Resource path is added in .onLoad() - no need to add it here
  
  # Create dependencies
  dependencies <- shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(
          rel = 'stylesheet',
          type = 'text/css',
          href = 'libSidePanel/side-panel.css'
        ),
        shiny::tags$script(src = 'libSidePanel/side-panel.js'),
        shiny::tags$script(src = 'libSidePanel/side-panel-binding.js')
      )
    )
  )
  
  # Create the widget container
  widget <- shiny::div(
    dependencies,
    shiny::div(
      `data-shiny-input-type` = "sidePanelInput",
      id = inputId,
      class = glue::glue('side-panel-widget side-panel-{position}'),
      `data-menu-items` = jsonlite::toJSON(menuItems, auto_unbox = TRUE, 
                                            escape = TRUE),
      `data-position` = position,
      `data-panel-width` = panelWidth,
      `data-initial-open` = to_lower_char(initialOpen),
      `data-main-content-id` = mainContentId,
      `data-container-id` = containerId,
      style = if (!is.null(width)) glue::glue("width: {width};") else NULL
    )
  )
  
  # Add label if provided
  if (!is.null(label)) {
    shiny::div(
      class = "side-panel-button-container",
      style = "display: flex; align-items: center;",
      shiny::tags$label(label, `for` = inputId, style = "margin-right: 10px;"),
      widget
    )
  } else {
    widget
  }
}

#' @title Update Side Panel Input
#'
#' @description
#' Change the state or content of a side panel input on the client.
#'
#' @param session The \code{session} object passed to function given to
#'   \code{shinyServer}.
#' @param inputId The id of the input object.
#' @param open Should the panel be open? If \code{NULL}, the state is not
#'   changed.
#' @param selectedItem The id of the menu item to select. If \code{NULL}, no
#'   change is made.
#'
#' @export
updateSidePanelInput <- function(session, inputId, open = NULL,
                                selectedItem = NULL) {
  
  # Validate inputId
  if (is.null(inputId) || !is.character(inputId) || length(inputId) != 1 || nchar(inputId) == 0) {
    stop("inputId must be a non-empty character string", call. = FALSE)
  }
  
  # Validate open if provided
  if (!is.null(open) && (!is.logical(open) || length(open) != 1)) {
    stop("open must be NULL or a single logical value", call. = FALSE)
  }
  
  # Validate selectedItem if provided
  if (!is.null(selectedItem) && (!is.character(selectedItem) || length(selectedItem) != 1)) {
    stop("selectedItem must be NULL or a character string", call. = FALSE)
  }
  
  # Use dropNulls to remove NULL values (consistent with other widgets)
  message <- dropNulls(list(open = open, selectedItem = selectedItem))
  
  if (length(message) > 0) {
    session$sendInputMessage(inputId, message)
  }
}

