library(shiny)
library(shinyinvoer)

# devtools::load_all()
# devtools::document()
# devtools::install()

ui <- fluidPage(
  uiOutput('button'),
  verbatimTextOutput('input_button')
)

server <- function(input, output, session) {

  # you must crate a file in www for save images (www/img/...)
  output$button <- renderUI({
    buttonImageInput(inputId = 'chosen_button',
                     label = "Elige un animal",
                     images = c("cat", "dog", "fox"),
                     tooltips = c("Gato", "Perro", "Zorro"),
                     active = 'dog',
                     path = "img/")
  })

  # print input id of your click
  output$input_button <- renderPrint({
    input$chosen_button
  })



}

shinyApp(ui, server)
