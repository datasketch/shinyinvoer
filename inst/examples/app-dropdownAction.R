library(shiny)
library(shinyinvoer)

choices <- c('Obtener enlace' = 'get_link', 'Archivo HTML'  = 'get_html', 'Imagen PNG' = 'get_png',
             'Imagen JPG' = 'get_jpg', 'Documento PDF' = 'get_pdf')

ui <- fluidPage(
  dropdownActionInput(inputId = 'dropdown_downloadable', label = 'Publicar (descargable)', choices = choices[5], images = "img/fox.png", downloadable = TRUE),
  br(),
  br(),
  dropdownActionInput(inputId = 'dropdown', label = 'Opciones', choices = choices, images = c("", "img/cat.png", "img/dog.png", "img/fox.png")),
  br(),
  verbatimTextOutput('dropdown_action_output_0'),
  br(),
  verbatimTextOutput('dropdown_action_output_1')
)

server <- function(input, output, session) {
  output$dropdown_action_output_0 <- renderPrint({
    input$dropdown_downloadable
  })

  output$dropdown_action_output_1 <- renderPrint({
    input$dropdown
  })

  output$get_pdf <- downloadHandler(filename = "cars.csv",
                                    content = function(file) {
                                      write.csv(cars, file)
                                    })

}

shinyApp(ui, server)
