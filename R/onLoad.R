
#' Adds the content of www to shinyWidgets/
#'
#' @importFrom shiny addResourcePath registerInputHandler
#'
#' @noRd
#'
.onLoad <- function(...) {
  # #shiny::addResourcePath('shinyWidgets', system.file('www', package = 'shinyWidgets'))
  # try({ shiny::removeInputHandler("dsHotBinding") })
  #
  # shiny::registerInputHandler("dsHotBinding", function(x, ...) {
  #   if (is.null(x))
  #     NULL
  #   else{
  #     x <- jsonlite::fromJSON(x)
  #     # Update selected ctype from dic coming from js
  #     # This can be done in js too, make sure dic is updated
  #     # window.userSelectedColumns = filterDict.apply(this, [selected])
  #
  #     selected_ids <- x$selected$id
  #     selected <- x$dic %>% filter(id %in% selected_ids)
  #     list(data = x$data,
  #          dic = x$dic,
  #          selected = selected
  #     )
  #   }
  # }, force = TRUE)
  
  # Register input handler for sidePanelInput
  try({ shiny::removeInputHandler("sidePanelBinding") })
  
  shiny::registerInputHandler("sidePanelBinding", function(x, ...) {
    if (is.null(x)) {
      list(isOpen = FALSE, selectedItem = NULL)
    } else {
      # If x is already a list, return as is
      if (is.list(x)) {
        list(
          isOpen = if (!is.null(x$isOpen)) x$isOpen else FALSE,
          selectedItem = x$selectedItem
        )
      } else {
        # If x is a JSON string, parse it
        parsed <- jsonlite::fromJSON(x)
        list(
          isOpen = if (!is.null(parsed$isOpen)) parsed$isOpen else FALSE,
          selectedItem = parsed$selectedItem
        )
      }
    }
  }, force = TRUE)
  
}
