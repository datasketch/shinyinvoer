library(shiny)
library(shinyinvoer)
library(shinypanels)

choices <- c('Obtener enlace' = 'get_link', 'Archivo HTML'  = 'get_html', 'MODAL' = 'get_png',
             'separator' = 'get_jpg', 'Documento PDF' = 'get_pdf')

ui <- panelsPage(
  panel(title = "Tests",
        body = div(modal(id = 'md-get_png', title = 'Hello from', p('Modal ipsum')),
                   dropdownActionInput(inputId = 'dropdown_downloadable', label = 'Publicar (descargable)', choices = choices[5], images = "img/fox.png"),
                   br(),
                   br(),
                   dropdownActionInput(inputId = 'dropdown', label = icon("bar-chart-o"), choices = choices, images = c("", "img/cat.png", "img/dog.png", "img/fox.png")),
                   br(),
                   dropdownActionInput(inputId = 'dropdown_1', label = 'Opciones con modal shinypanels', choices = choices[1:3], choicesType = c("download", "button", "modalShinypanels")),
                   br(),
                   dropdownActionInput(inputId = 'dropdown_0', label = 'Opciones 2', choices = c("Da", "Er", "separator", "T"), images = "img/fox.png"),
                   br(),
                   verbatimTextOutput('dropdown_action_output_0'),
                   br(),
                   verbatimTextOutput('dropdown_action_output_1'),
                   br(),
                   verbatimTextOutput('dropdown_action_output_2'))))

server <- function(input, output, session) {
  output$dropdown_action_output_0 <- renderPrint({
    input$dropdown_downloadable
  })

  output$dropdown_action_output_1 <- renderPrint({
    input$dropdown
  })

  output$dropdown_action_output_2 <- renderPrint({
    paste0("action button count:", input$get_html)
  })

  output$get_link <- downloadHandler(filename = "cars.csv",
                                     content = function(file) {
                                       write.csv(cars, file)
                                     })

}

shinyApp(ui, server)
