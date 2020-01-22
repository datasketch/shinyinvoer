library(shiny)
library(dsAppWidgets)


ui <-
  fluidPage(
    suppressDependencies('bootstrap'),
    uiOutput('colorWidget'),
    verbatimTextOutput('test')
  )

server <-
  function(input, output, session) {

    output$colorWidget <- renderUI({
      colorPalette('id_colors', colors = c('#FFDAAC', '#AACDFF', '#FFADCA'))
    })

    output$test <- renderPrint({
      input$id_colors
    })

  }

shinyApp(ui, server)
