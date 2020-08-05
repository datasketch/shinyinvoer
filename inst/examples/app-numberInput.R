library(shiny)

ui <- fluidPage(
  uiOutput("the_input"),
  verbatimTextOutput("the_output")
)

server <- function(input, output, session) {
  output$the_input <- renderUI({
    numberInput(inputId="numeric", label="Choose font size (px)", min=0, max=15, value=7)
  })

  output$the_output <- renderPrint({
    input$numeric
  })
}

shinyApp(ui, server)
