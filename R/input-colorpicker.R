#' @export
colorPicker <- function(id, label = NULL, initialColor = NULL) {
  if (!is.null(label)) {
    print(label)
  } else {
    print('No label muaja')
  }
  addResourcePath(
    prefix = "colorpicker",
    directoryPath = system.file("lib/colorpicker", package = 'dsAppWidgets')
  )
  addResourcePath(
    prefix = "colorpickerjs",
    directoryPath = system.file("lib/colorpickerjs", package = 'dsAppWidgets')
  )

  # Add button
  addButton <- tags$button(
    id="add-color",
    HTML('+')
  )

  color_init <- tags$button(
    class="color",
    tags$span(class="color-value"),
    tags$span(class="dismiss-input", HTML('x'))
  )


  colorsList <- div(
    class="colors",
   if (!is.null(initialColor)) {
     color_init
   } else {
     ''
   }
  )

  # Parent
  colorPickerTag <- tagList(
    singleton(tags$head(
      tags$link(rel="stylesheet", type="text/css", href="colorpickerjs/color-picker.min.css"),
      tags$script(src="colorpickerjs/color-picker.min.js")
    )),
    tags$div(
      class="input-colors",
      id=id,
      `data-color`=initialColor,
      colorsList,
      addButton
    ),
    tags$link(rel="stylesheet", type="text/css", href="colorpicker/colorpicker.css"),
    tags$script(src="colorpicker/colorpicker.js")
  )
  colorPickerTag
}
