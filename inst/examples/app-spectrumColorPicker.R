library(shiny)
library(shinyinvoer)


ui <- fluidPage(
  suppressDependencies('bootstrap'),
  uiOutput('colorWidget'),
  verbatimTextOutput('test'),
  uiOutput('colorWidget_'),
  verbatimTextOutput('test_'),
  uiOutput('colorWidget__'),
  verbatimTextOutput('test__'),
  checkboxInput('colorsWidget__update', 'Change colors'),
)

server <- function(input, output, session) {

  output$colorWidget <- renderUI({
    spectrumColorPicker('id_colors', "New palette. Limited to 3 colors",
                      colors = c('#FFDAAC', '#AACDFF', '#FFADCA'), alpha = T, max_colors = 3)
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

  output$colorWidget__ <- renderUI({
    spectrumColorPicker('id_colors__', "Will be updated", colors = c('#264653', '#2a9d8f', '#e9c46a'))
  })

  output$test__ <- renderPrint({
    input$id_colors__
  })
  observe({
    if (input$colorsWidget__update) {
      updateSpectrumColorPicker(session, inputId = 'id_colors__', colors = c('#e63946', '#e5989b'))
      # If you want a fresh start you can update without any colors
      # updateSpectrumColorPicker(session, inputId = 'id_colors__')
    }
  })
}

shinyApp(ui, server)
