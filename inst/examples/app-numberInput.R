library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  uiOutput("the_input"),
  verbatimTextOutput("the_output"),
  checkboxInput('the_update', 'Change value to 10')
)

server <- function(input, output, session) {
  output$the_input <- renderUI({
    numberInput(inputId="numeric", label="Choose font size (px)", min=0, max=15, value=7)
  })

  output$the_output <- renderPrint({
    input$numeric
  })

  observe({
    if (input$the_update) {
      updateNumberInput(session, inputId="numeric", value=10)
    }
  })
}

shinyApp(ui, server)
