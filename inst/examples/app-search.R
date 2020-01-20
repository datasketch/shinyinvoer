library(shiny)
library(dsAppWidgets)


ui <-
  fluidPage(
   suppressDependencies('bootstrap'),
   uiOutput('buscador'),
   verbatimTextOutput('test')
  )

server <-
  function(input, output, session) {

    output$buscador <- renderUI({
      searchInput('id_searching', data = c('ardilla', 'Zorro', 'Elefante', 'araña'), placeholder = 'This is a placeholder')
    })

    output$test <- renderPrint({
      input$id_searching
    })

  }

shinyApp(ui, server)
