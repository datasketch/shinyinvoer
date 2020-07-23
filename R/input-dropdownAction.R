#' Dropdown, choices with images and type: text, download link or action link
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param label Display label for the dropdown, \code{NULL} for no label.
#' @param choices Vector of values to select from. If named, then that name is displayed to the user and the value is the id of the input (in clase is not plain text but an action or download link). For dividing lines use "separator" in the choices' vector as name or value.
#' @param choicesType Vector indicating what HTML objects the choices are: download for download link; button for action link; text for plain text.
#' @param images Vector of paths for images that are going to be placed at the begining of each choice.
#' @param width Width in pixels of the dropdown.
#'
#' @examples
#' \dontrun{
#' ## Only run examples in interactive R sessions
#' if (interactive()) {
#'
#' choices <- c('Obtener enlace' = 'get_link', 'separator' = NA, 'Archivo HTML' = 'get_html')
#' ui <- fluidPage(
#'     dropdownActionInput(inputId = 'dropdown', label = 'Options', choices = choices, choicesType = c('button', NA, 'download'))
#'     verbatimTextOutput('count')
#' )
#' server <- function(input, output) {
#'
#' output$count <- renderPrint({
#'                    HTML(paste0(input$dropdown, '</br>', input$get_link))
#'                 })
#' }
#' shinyApp(ui, server)
#' }
#' }
#'
#' @export
dropdownActionInput <- function(inputId, label, choices, choicesType = "text", images = NA, width = 150) {

  if (all(choicesType %in% c(NA, "", "text", "download", "button", "modalShinypanels"))) {
    if (length(choicesType) == 1) {
      choicesType[seq_along(choices)] <- choicesType
    } else if (length(choicesType) >= length(choices)) {
      choicesType <- choicesType[seq_along(choices)]
    } else {
      choicesType[seq_along(choices)] <- choicesType
      choicesType[is.na(choicesType)] <- "text"
    }
  } else {
    stop("Elements of choicesType must be either text, download, button, modalShinypanels or NA")
  }

  if (sum(is.na(images)) | sum(is.null(images))) {
    images <- unlist(lapply(choicesType, function(w) {
      if (!is.na(w)) {
        if (w == "download") {
          "dropdownAction/images/download.svg"
        } else if (w %in% c("button", "modalShinypanels")) {
          "dropdownAction/images/share_link.svg"
        } else {
          ""
        }
      } else {
        ""
      }
    }))
  } else {
    if (length(images) == 1) {
      images[seq_along(choices)] <- images
    } else {
      images <- images[seq_along(choices)]
    }
  }
  images[is.na(images)] <- ""

  shiny::addResourcePath(prefix = "dropdownAction", directoryPath = system.file("lib/dropdownAction", package = "shinyinvoer"))

  l <- shiny::tagList(shiny::singleton(shiny::tags$head(shiny::tags$link(rel = "stylesheet",
                                                                         type = "text/css",
                                                                         href = "dropdownAction/dropdown-action-binding.css"),
                                                        shiny::tags$script(src = "dropdownAction/dropdown-action-binding.js"))))

  choices_list <- lapply(seq_along(choices), function(x) {
    list(id = choices[x],
         image = images[x],
         label = ifelse(is.null(names(choices[x])), choices[x], names(choices[x])),
         type = choicesType[x])
  })

  input <- jsonlite::toJSON(choices_list, auto_unbox = TRUE)
  shiny::div(l,
             `data-options` = htmltools::HTML(input),
             `data-label` = label,
             id = inputId,
             class = "dropdown-action-container",
             style = paste0('width:', width, 'px;'))

}
