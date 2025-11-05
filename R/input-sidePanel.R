#' @title Side Panel Widget
#'
#' @description
#' A side panel widget with a button toggle, sidebar menu with icons, and
#' dynamic content area. The panel can be positioned on the left or right side,
#' and the main content shifts accordingly when the panel is open or closed.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
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
#'   observeEvent(input$side_panel, {
#'     cat("Panel is:", ifelse(input$side_panel, "open", "closed"), "\n")
#'   })
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
  
  # Validate inputs
  if (is.null(inputId)) {
    inputId <- paste0("side_panel_", sample.int(1e9, 1))
  }
  
  position <- match.arg(position)
  
  # Validate menuItems structure
  if (!is.list(menuItems) || length(menuItems) == 0) {
    menuItems <- list(
      list(
        id = "default",
        icon = "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor'><rect x='3' y='3' width='18' height='18' rx='2'></rect></svg>",
        title = "Default",
        tooltip = "Default menu item"
      )
    )
  }
  
  # Validate each menu item has required fields and convert body to HTML string
  menuItems <- purrr::map(menuItems, function(item) {
    if (is.null(item$id)) item$id <- paste0("item_", sample.int(1e9, 1))
    if (is.null(item$icon)) item$icon <- ""
    if (is.null(item$title)) item$title <- "Item"
    if (is.null(item$tooltip)) item$tooltip <- item$title
    
    # Convert body (if provided) to HTML string
    if (!is.null(item$body)) {
      # Use htmltools to render the body to HTML string
      # htmltools is a dependency of shiny, so it should always be available
      item$body_html <- as.character(htmltools::renderTags(item$body)$html)
      # Remove body from the item (we only need body_html for JSON)
      item$body <- NULL
    }
    
    item
  })
  
  # Add resource path
  addResourcePath(
    prefix = 'libSidePanel',
    directoryPath = system.file('lib', 'side-panel', package = 'shinyinvoer')
  )
  
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
      class = paste0('side-panel-widget side-panel-', position),
      `data-menu-items` = jsonlite::toJSON(menuItems, auto_unbox = TRUE),
      `data-position` = position,
      `data-panel-width` = panelWidth,
      `data-initial-open` = tolower(as.character(initialOpen)),
      `data-main-content-id` = mainContentId,
      `data-container-id` = if (!is.null(containerId)) containerId else NULL,
      style = if (!is.null(width)) paste0("width: ", width, ";")
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
  
  message <- list()
  
  if (!is.null(open)) {
    message$open <- open
  }
  
  if (!is.null(selectedItem)) {
    message$selectedItem <- selectedItem
  }
  
  if (length(message) > 0) {
    session$sendInputMessage(inputId, message)
  }
}

