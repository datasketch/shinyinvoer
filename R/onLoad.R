
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

}
