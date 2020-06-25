library(shiny)
library(shinyinvoer)

choices <- c('Obtener enlace' = 'get_link', 'Archivo HTML' = 'get_html', 'Imagen PNG' = 'get_png',
             'Imagen JPG' = 'get_jpg', 'Documento PDF' = 'get_pdf')

ui <- fluidPage(
  uiOutput('dropdown_action_sample'),
  verbatimTextOutput('dropdown_action_output')
)

server <- function(input, output, session) {
  output$dropdown_action_sample <- renderUI({
    dropdownActionInput(inputId = 'the_dropdown', label = 'Publicar', choices = choices)
  })
  output$dropdown_action_output <- renderPrint({
    input$the_dropdown
  })
}

shinyApp(ui, server)
