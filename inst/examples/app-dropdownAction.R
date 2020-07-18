library(shiny)
library(shinyinvoer)

choices <- c('Obtener enlace' = 'get_link', 'Archivo HTML'  = 'get_html', 'Imagen PNG' = 'get_png',
             'separator' = 'get_jpg', 'Documento PDF' = 'get_pdf')

ui <- fluidPage(
  dropdownActionInput(inputId = 'dropdown_downloadable', label = 'Publicar (descargable)', choices = choices[5], images = "img/fox.png"),
  br(),
  br(),
  dropdownActionInput(inputId = 'dropdown', label = 'Opciones', choices = choices, images = c("", "img/cat.png", "img/dog.png", "img/fox.png")),
  br(),
  dropdownActionInput(inputId = 'dropdown_1', label = 'Opciones 1', choices = choices[1:2], choicesType = c("download", "button")),
  br(),
  dropdownActionInput(inputId = 'dropdown_0', label = 'Opciones 2', choices = c("Da", "Er", "separator", "T"), images = "img/fox.png"),
  br(),
  verbatimTextOutput('dropdown_action_output_0'),
  br(),
  verbatimTextOutput('dropdown_action_output_1'),
  br(),
  verbatimTextOutput('dropdown_action_output_2')
)

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
