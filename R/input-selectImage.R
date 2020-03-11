

#' Add images to dropdown options
#'
#' This function works only with bootstrap for now
#'
#' @param inputId The input slot that will be used to access the value.
#' @param choices List of values to select from, when named the names are
#'   appended to the right of the image.
#' @param images List of image location that can be put in a src attribute.
#' @param selected Selected image, defaults to first one.
#' @param placeholder HTML to render as placeholder, overrides selected param.
#' @param width width in of input.
#'
#' @export
selectImageInput <- function(inputId, label, choices, images = NULL,
                             selected = 1,
                             placeholder = NULL,
                             width = 120) {

  addResourcePath(
    prefix='selectImage',
    directoryPath=system.file("lib/selectImage",
                              package='shinyinvoer')
  )

  choices_list <- lapply(seq_along(choices), function(x){
    list(id = choices[x],
         image = images[x],
         label = names(choices[x])
    )
  })
  names(choices_list) <- choices

  l <- lapply(choices_list, function(x){
    tags$li(class = "selectImage",
            tags$a(href="#", title = "Select", class = "selectImage", id = x$id,
                   img(src=x$image), x$label
            )
    )
  })

  if(is.numeric(selected))
    selected <- choices[selected]
  if(is.null(placeholder)){
    # placeholder <- div(style = paste0("width:",width,";"))
    x <- choices_list[[selected]]
    placeholder <- div(class = "selectImage", img(src=x$image), x$label)
  }

  shiny::div(
    label,
    shiny::div(
      `data-shiny-input-type` = "selectImage",
      shiny::tagList(
        shiny::singleton(
          shiny::tags$head(
            shiny::tags$link(rel = 'stylesheet',
                             type = 'text/css',
                             href = 'selectImage/selectImage.css'),
            shiny::tags$script(src = 'selectImage/selectImage-bindings.js')
          ))
      ),
      div(class = "btn-group", id = inputId, `data-init-value` = selected,
          tags$button(type = "button", class = "btn btn-default dropdown-toggle selectImage",
                      style = "display: flex;align-items: center;",
                      `data-toggle`="dropdown", `aria-haspopup`="true",  `aria-expanded`="false",
                      div(class = "buttonInner selectImage",
                          placeholder
                      ),
                      span(class="glyphicon glyphicon-chevron-down", style = "padding-left: 10px;")
          ),
          tags$ul( class="dropdown-menu",
                   l
          )
      )
    )
  )
}


#' Update select image input
#'
#' @param session Shiny session
#' @param inputId The input slot that will be used to access the value.
#' @param choices List of values to select from, when named the names are
#'   appended to the right of the image.
#' @param images List of image location that can be put in a src attribute.
#' @param selected Selected image, defaults to first one.
#' @param placeholder HTML to render as placeholder, overrides selected param.
#' @param width width in of input.
#'
#' @export
updateSelectImageInput <- function (session, inputId, label = NULL, choices = NULL, selected = NULL) {
  message <- dropNulls(
    list(
      label = label,
      choices = choices,
      selected = selected)
  )
  session$sendInputMessage(inputId, message)
}


# copied from shiny since it's not exported
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE=logical(1))]
}



