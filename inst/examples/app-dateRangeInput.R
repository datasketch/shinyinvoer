library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  uiOutput("the_input"),
  verbatimTextOutput("the_output"),
  checkboxInput('the_update', 'Reset with new dates')
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

  observe({
    if (input$the_update) {
      shinyinvoer::updateDateRangeInput(
        session,
        inputId = "date_range",
        start = '2021-05-07',
        end = '2021-08-23',
        minDate = '2020-01-01',
        maxDate = '2022-01-01'
      )
    }
  })
}

shinyApp(ui, server)
