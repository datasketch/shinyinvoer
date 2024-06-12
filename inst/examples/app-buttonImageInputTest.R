library(shiny)

ui <- fluidPage(
  tags$head(
    # Include the custom JavaScript file
    # tags$script(src = "buttonImageInput0.js")
    tags$link(rel="stylesheet", type="text/css", href="buttonImageInput.css"),
    tags$script(src = "buttonImageInput.js")
  ),
  buttonImageInputTest("imageInput",
                    images = c("www/img_png/cat.png", "www/img_png/dog.png", "www/img_png/fox.png"),
                    active = "cat"),
  verbatimTextOutput("clickedImageId"),
  actionButton("updateToDog", "To Dog"),
  hr(),
  buttonImageInputTest("imageInput2",
                    images = c("www/img/bubble.svg", "www/img/dog.png", "www/img/fox.png"),
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
}

shinyApp(ui = ui, server = server)
