library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  tags$head(
    # Include the custom JavaScript file
    # tags$script(src = "buttonImageInput0.js")
    tags$link(rel="stylesheet", type="text/css", href="buttonImageInputTest.css"),
    tags$script(src = "buttonImageInputTest.js")
  ),
  uiOutput("ui_button_svg"),
  verbatimTextOutput("clickedImageId3"),
  buttonImageInputTest("imageInput",
                    images = c("www/img_png/cat.png", "www/img_png/dog.png", "www/img_png/fox.png"),
                    active = "cat"),
  verbatimTextOutput("clickedImageId"),
  actionButton("updateToDog", "To Dog"),
  hr(),
  buttonImageInputTest("imageInput2",
                    images = c("www/img/bubble.svg", "www/img/dog.png", "www/img/fox.png"),
                    highlightColor = "#5603a0",
                    active = "bubble",
                    disabled = "dog",
                    checkmark = TRUE),
  verbatimTextOutput("clickedImageId2"),
  hr()
)

server <- function(input, output, session) {
  output$clickedImageId <- renderText({
    input$imageInput
  })

  observeEvent(input$updateToDog, {
    updateButtonImageInputTest(session, "imageInput",
                               active = "dog")
  })

  output$clickedImageId2 <- renderText({
    input$imageInput2
  })

  output$ui_button_svg <- renderUI({
    buttonImageInputTest(inputId = 'imageInput3',
                     images = c("pie", "area", "map", "line"),
                     nrow = 2,
                     highlightColor = "#d84570",
                     checkmark = FALSE,
                     active = c("map"),
                     path = "www/img_svg")
  })
  output$clickedImageId3 <- renderText({
    input$imageInput3
  })
}

shinyApp(ui = ui, server = server)
