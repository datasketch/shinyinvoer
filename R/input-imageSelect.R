#' Add images to the dropdown options
#'
#' This function will overwrite any render function defined in the options list.
#'
#' @param inputId The input slot that will be used to access the value.
#' @param choices List of values to select from.
#' @param images List of image location that can be put in a src attribute.
#' @param ... Arguments that are passed to `selectizeInput()`
#'
#' @export
selectizeInputWithImage <- function(inputId, label, choices, images, ...) {

  dots <- list(...)

  dots$options <- dots$options %||% list()

  render_string <- paste0(
    "{option: function(item, escape) {
    switch(item.label) {",
    paste0(map2_chr(
      choices, images, ~sprintf(
        "case '%s':
        return '<div><div><img src=\"%s\" width=20 />  ' + escape(item.label) +
          '</div></div>';
        break;", .x, .y)
    ), collapse = ' '),
    "}}}"
  )

  dots$options$render <- I(render_string)
  dots$inputId <- inputId
  dots$label <- label
  dots$choices <- choices

  do.call(selectizeInput, dots)
}
