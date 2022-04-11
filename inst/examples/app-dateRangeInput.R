library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  uiOutput("the_input"),
  verbatimTextOutput("the_output")
)

server <- function(input, output, session) {
  output$the_input <- renderUI({
    shinyinvoer::dateRangeInput(
      inputId = "date_range",
      label = 'Seleccione el rango de fechas',
      start = '2022-04-11',
      end = '2022-04-18',
      min = '2022-01-01',
      max = '2022-12-31',
      startLabel = 'Fecha inicial',
      endLabel = 'Fecha final',
      resetLabel = 'Restablecer fechas',
      locale = 'es'
    )
  })

  output$the_output <- renderPrint({
    input$date_range
  })
}

shinyApp(ui, server)
