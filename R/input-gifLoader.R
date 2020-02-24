#' Add a image that shows when an output is recalculating
#'
#' Based on [shinycssloaders](https://github.com/daattali/shinycssloaders/blob/master/R/withSpinner.R)
#'
#' @export
#' @param ui_element A UI element that should be wrapped with a spinner when the corresponding output is being calculated.
#' @param file_location The file location of the image file (can be gif or png)
#' @param size The size of the gif, relative to its default size.
#' @examples
#' \dontrun{withImage(plotOutput("my_plot"))}
withImage <- function(ui_element,
                      file_location = "https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif",
                      size = 1)
{

  addResourcePath(
    prefix = 'gifLoader',
    directoryPath = system.file('lib/gifLoader', package='shinyinvoer')
  )

  # each gif will have a unique id, to allow seperate sizing - based on hashing the UI element code
  id <- paste0("image-", digest::digest(ui_element))

  shiny::tagList(
    shiny::singleton(
      shiny::tags$head(
        shiny::tags$link(rel="stylesheet", href="gifLoader/gifLoader.css"),
        shiny::tags$script(src = 'gifLoader/gifLoader.js')
      )
    ),
    shiny::div(
      class="shiny-spinner-output-container",
      shiny::div(
        class="load-container shiny-spinner-hidden",
        shiny::img(
          id = id, class = "loader", src = file_location,
          alt = "Loading..."
        )
      ),
      ui_element
    )
  )
}

