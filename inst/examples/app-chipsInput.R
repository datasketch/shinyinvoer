library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  uiOutput("the_input"),
  verbatimTextOutput("the_output")
)

server <- function(input, output, session) {
  output$the_input <- renderUI({
    chipsInput(inputId = "tags", label = "Fruits", placeholder = "New fruit")
  })

  output$the_output <- renderPrint({
    input$tags
  })
}

shinyApp(ui, server)
