library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  uiOutput("the_input"),
  verbatimTextOutput("the_output"),
  checkboxInput('the_update', 'Reset with some fruits')
)

server <- function(input, output, session) {
  output$the_input <- renderUI({
    chipsInput(inputId = "tags", label = "Fruits", placeholder = "New fruit")
  })

  output$the_output <- renderPrint({
    input$tags
  })

  observe({
    if (input$the_update) {
      updateChipsInput(session, inputId="tags", chips=c("Apple", "Banana"))
    }
  })
}

shinyApp(ui, server)
