library(shiny)
library(shinyinvoer)

choices <- c('Obtener enlace' = 'get_link', 'Archivo HTMLsjakjdajdskjasdjadsjk jdjd'  = 'get_html', 'Imagen PNG' = 'get_png',
             'Imagen JPG' = 'get_jpg', 'Documento PDF' = 'get_pdf')
             # "<a id = 'er' class = 'shiny-download-link dropdown-action-item' data-action = 'sw' style = 'display: block; padding: 0;' href = '' target = '_blank' download>ING</a>" = "EKMSIOL")


#
#
# if (isdownloadable) {
#   choices.forEach(function (choice) {
#     const dropdownActionItem = document.createElement('a');
#     dropdownActionItem.setAttribute('download', '')
#     dropdownActionItem.setAttribute('href', '')
#     dropdownActionItem.setAttribute('target', '_blank')
#     dropdownActionItem.classList.add('dropdown-action-item');
#     dropdownActionItem.dataset.action = choice.id;
#     dropdownActionItem.textContent = choice.label;
#     dropdownActionList.appendChild(dropdownActionItem);
#   });
# } else {
#   choices.forEach(function (choice) {
#     const dropdownActionItem = document.createElement('div');
#     dropdownActionItem.classList.add('dropdown-action-item');
#     dropdownActionItem.dataset.action = choice.id;
#     dropdownActionItem.textContent = choice.label;
#     dropdownActionList.appendChild(dropdownActionItem);
#   });
# }


# ns <- NS(id)
# loadingGif <- "data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA"
#
# shiny::addResourcePath(prefix = 'downloadInfo', directoryPath = system.file("js", package = "dsmodules"))
#
# l <- shiny::div(style = "text-align:center;",
#                 # `data-for-btn` = ns("downloadHtmlwidget"),
#                 `data-for-btn` = "downloadHtmlwidget",
#                 downloadLink("a", "b", class = "dropdown-action-item", `data-action` = "id_returned", style = "display: block;"),
#
#                 # shiny::downloadButton(ns("downloadHtmlwidget"), text, class = class, style = "width: 200px; display: inline-block;"),
#                 #button,
#                 shiny::span(
#                   class = "btn-loading-container",
#                   #shinyjs::hidden(
#                   shiny::img(src = loadingGif, class = "btn-loading-indicator", style = "display: none"),
#                   shiny::HTML("<i class = 'btn-done-indicator fa fa-check' style = 'display: none'> </i>")))
#
# names(choices)[5] <- '<div style = "display: flex; justify-content: space-between;" data-for-btn="downloadHtmlwidget">
#   <a id="a" class="shiny-download-link dropdown-action-item" href="" target="_blank" download data-action="id_returned" style="display: inline-block; padding: 0; width: 100%;">b</a>
#   <span class="btn-loading-container">
#     <img src="data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA" class="btn-loading-indicator" style="display: inherit;"/>
#     <i class = "btn-done-indicator fa fa-check" style="display: none;"> </i>
#   </span>
# </div>'

ui <- fluidPage(
  uiOutput('dropdown_action_sample'),
  downloadLink("dfg", "f"),
  dropdownActionInput(inputId = 'the_d', label = 'P', choices = choices, images = c("", "img/cat.png", "img/dog.png", "img/fox.png")),
  dropdownActionInput(inputId = 'the_', label = 'Pu', choices = choices),
  verbatimTextOutput('dropdown_action_output')
)

server <- function(input, output, session) {
  output$dropdown_action_sample <- renderUI({
      dropdownActionInput(inputId = 'the_dropdown', label = 'Publicar', choices = choices, images = c("img/loading_example.gif", "img/cat.png", "img/dog.png", "img/fox.png"), downloadable = TRUE)
  })
  output$dropdown_action_output <- renderPrint({
    input$the_dropdown
  })

  output$get_pdf <- downloadHandler(filename = "edede.csv",
                               content = function(file) {
                                 write.csv(cars, file)
                               })

  output$dfg <- downloadHandler(filename = "edede.csv",
                                    content = function(file) {
                                      write.csv(cars, file)
                                    })
}

shinyApp(ui, server)
