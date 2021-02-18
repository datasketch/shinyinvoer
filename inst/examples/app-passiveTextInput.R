library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  uiOutput("the_input"),
  verbatimTextOutput("the_output"),
  checkboxInput('the_update', 'Reset input value')
)

server <- function(input, output, session) {
  output$the_input <- renderUI({
    passiveTextInput(inputId = "passive", label = "Title", showButton = T, buttonLabel = "Update")
  })

  output$the_output <- renderPrint({
    input$passive
  })

  observe({
    if (input$the_update) {
      updatePassiveTextInput(session, inputId="passive", value="")
    }
  })
}

shinyApp(ui, server)
