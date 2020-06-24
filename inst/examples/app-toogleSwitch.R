library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  uiOutput('toggle_switch_sample'),
  verbatimTextOutput('toggle_switch_output')
)

server <- function(input, output, session) {
  output$toggle_switch_sample <- renderUI({
    toggleSwitchInput(inputId = 'the_switch')
  })
  output$toggle_switch_output <- renderPrint({
    input$the_switch
  })
}

shinyApp(ui, server)
