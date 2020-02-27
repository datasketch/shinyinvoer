library(shiny)
library(shinyinvoer)
library(purrr)

images <- c(
  'https://d9np3dj86nsu2.cloudfront.net/image/eaf97ff8dcbc7514d1c1cf055f2582ad',
  'https://www.color-hex.com/palettes/33187.png',
  'https://www.color-hex.com/palettes/16042.png'
)
choices <- c('a', 'b', 'c')

ui <- fluidPage(
  suppressDependencies('bootstrap'),
  selectizeInputWithImage("dropdown", "Pick:", choices = choices,
                          images = images, options = list(render = 'a'),
                          width = "100px"),
  verbatimTextOutput('test')
)

server <- function(input, output, session) {

  output$test <- renderPrint({
    input$dropdown
  })

}

shinyApp(ui, server)
