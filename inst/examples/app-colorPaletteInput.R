library(shiny)
library(shinyinvoer)


ui <- fluidPage(
    suppressDependencies('bootstrap'),
    uiOutput('colorWidget'),
    uiOutput('colorWidget_'),
    verbatimTextOutput('test'),
    verbatimTextOutput('test_')
  )

server <- function(input, output, session) {

    output$colorWidget <- renderUI({
      colorPaletteInput('id_colors', "New palette",
                        colors = c('#FFDAAC', '#AACDFF', '#FFADCA'))
    })

    output$colorWidget_ <- renderUI({
      colorPaletteInput('id_colors_', "More colors",
                        colors = c('#FFDAAC', '#AACDFF', '#FFADCA'))
    })

    output$test <- renderPrint({
      input$id_colors
    })

    output$test_ <- renderPrint({
      input$id_colors_
    })
  }

shinyApp(ui, server)
