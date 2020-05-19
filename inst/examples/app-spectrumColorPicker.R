library(shiny)
library(shinyinvoer)


ui <- fluidPage(
  suppressDependencies('bootstrap'),
  uiOutput('colorWidget'),
  verbatimTextOutput('test'),
  uiOutput('colorWidget_'),
  verbatimTextOutput('test_')
)

server <- function(input, output, session) {

  output$colorWidget <- renderUI({
    spectrumColorPicker('id_colors', "New palette",
                      colors = c('#FFDAAC', '#AACDFF', '#FFADCA'), alpha = T)
  })

  output$test <- renderPrint({
    input$id_colors
  })

  output$colorWidget_ <- renderUI({
    spectrumColorPicker('id_colors_', "Predefined palette",
                      colors = c('#dd6e42', '#e8dab2'),
                      palette = c('#dd6e42', '#e8dab2', '#4f6d7a', '#c0d6df', '#eaeaea', '#2d3047'))
  })

  output$test_ <- renderPrint({
    input$id_colors_
  })
}

shinyApp(ui, server)
