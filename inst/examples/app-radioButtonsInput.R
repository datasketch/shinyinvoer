library(shiny)
library(shinyinvoer)

palette_a <- div(
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #17BEBB;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #2E282A;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #CD5334;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #EDB88B;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #FAD8D6;"),
)

palette_b <- div(
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #515A47;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #D7BE82;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #7a4419;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #755C1B;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #400406;"),
)

palette_c <- div(
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #FDFFFF;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #B10F2E;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #570000;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #280000;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #de7c5a;"),
)

palette_d <- div(
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #00916e;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #feefe5;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #ffcf00;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #ee6123;"),
  div(style="width: 20px; height: 20px; display: inline-block; background-color: #fa003f;"),
)

ui <- fluidPage(
  uiOutput("the_input"),
  verbatimTextOutput("the_output"),
  checkboxInput('the_update', 'Reset with new palettes')
)

server <- function(input, output, session) {
  output$the_input <- renderUI({
    radioButtonsInput(
      inputId = "choices",
      label = "Colores",
      choices = list(palette_a = as.character(palette_a), palette_b = as.character(palette_b)))
  })

  output$the_output <- renderPrint({
    input$choices
  })

  observe({
    if (input$the_update) {
      updateRadioButtonsInput(session, inputId="choices", choices = list(palette_c = as.character(palette_c), palette_d = as.character(palette_d)))
    }
  })
}

shinyApp(ui, server)
