library(shiny)
library(shinyinvoer)


ui <-
  fluidPage(
    suppressDependencies('bootstrap'),
    uiOutput('colorWidget'),
    uiOutput('colorWidget_'),
    verbatimTextOutput('test'),
    verbatimTextOutput('test_')
  )

server <-
  function(input, output, session) {

    output$colorWidget <- renderUI({
      colorPalette('id_colors', colors = c('#FFDAAC', '#AACDFF', '#FFADCA'))
    })

    output$colorWidget_ <- renderUI({
      colorPalette('id_colors_', colors = c('#FFDAAC', '#AACDFF', '#FFADCA'))
    })

    output$test <- renderPrint({
      input$id_colors
    })

    output$test_ <- renderPrint({
      input$id_colors_
    })
  }

shinyApp(ui, server)
