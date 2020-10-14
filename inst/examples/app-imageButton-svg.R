library(shiny)
library(shinyinvoer)

# devtools::load_all()
# devtools::document()
# devtools::install()

ui <- fluidPage(
  uiOutput('button'),
  verbatimTextOutput('input_button'),
  uiOutput("test")
)

server <- function(input, output, session) {

  # you must crate a file in www for save images (www/img/...)
  output$button <- renderUI({
    buttonImageInput(inputId = 'chosen_button',
                     label = "Elige un animal",
                     images = c("areas", "bubbles", "donut"),
                     nrow = 2,
                     tooltips = c("Areas", "Bubbles", "Donut"),
                     active = 'areas',

                     imageStyle = list(borderColor = "#eee",
                                       borderSize = "1px",
                                       padding = "10px",
                                       shadow = TRUE),


                     path = "img/")
  })

  # print input id of your click
  output$input_button <- renderPrint({
    input$chosen_button
  })

  output$test <- renderUI({
    selectInput("country_id", "Elige un país", c("colombia", "mexico", "la india"))
  })


  observe({
    req(input$country_id)

    if (input$country_id == "mexico") {
      updateButtonImageInput(session, "chosen_button", active = "donut")
    }
  })

}

shinyApp(ui, server)
