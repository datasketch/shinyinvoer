library(shiny)
library(shinyinvoer)


ui <- fluidPage(
  uiOutput('input_1'),
  verbatimTextOutput('output_1'),
  hr(),
  uiOutput('input_2'),
  verbatimTextOutput('output_2'),
  hr(),
  uiOutput('input_3'),
  verbatimTextOutput('output_3'),
  checkboxInput('input_3_update', 'Change colors'),
  hr(),
  uiOutput('input_4'),
  verbatimTextOutput('output_4'),
  checkboxInput('input_4_update', 'Change palette'),
)

server <- function(input, output, session) {

  output$input_1 <- renderUI({
    colorPaletteInput('input_id_1', "New palette. Limited to 3 colors",
                      colors = c('#FFDAAC', '#AACDFF', '#FFADCA'), alpha = T, max_colors = 3)
  })

  output$output_1 <- renderPrint({
    input$input_id_1
  })

  output$input_2 <- renderUI({
    colorPaletteInput('input_id_2', "Predefined palette",
                      colors = c('#dd6e42', '#e8dab2'),
                      palette = c('#dd6e42', '#e8dab2', '#4f6d7a', '#c0d6df', '#eaeaea', '#2d3047'))
  })

  output$output_2 <- renderPrint({
    input$input_id_2
  })

  output$input_3 <- renderUI({
    colorPaletteInput('input_id_3', "Will be updated", colors = c('#264653', '#2a9d8f', '#e9c46a'))
  })

  output$output_3 <- renderPrint({
    input$input_id_3
  })

  output$input_4 <- renderUI({
    colorPaletteInput('input_id_4', "Palette update", palette = c('#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'))
  })

  output$output_4 <- renderPrint({
    input$input_id_4
  })

  observe({
    if (input$input_3_update) {
      updateColorPaletteInput(session, inputId = 'input_id_3', colors = c('#e63946', '#e5989b'))
      # If you want a fresh start you can update without any colors
      # updateColorPaletteInput(session, inputId = 'input_id_3')
    }
    if (input$input_4_update) {
      updateColorPaletteInput(session, inputId = 'input_id_4',
                                palette = c('#011627', '#fdfffc', '#2ec4b6', '#e71d36', '#ff9f1c'))
    }
  })
}

shinyApp(ui, server)
