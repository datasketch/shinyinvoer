library(shiny)
library(shinyinvoer)


ui <-
  fluidPage(
   suppressDependencies('bootstrap'),
   uiOutput('search'),
   verbatimTextOutput('test')
  )

server <-
  function(input, output, session) {

    output$search <- renderUI({
      searchInput('id_searching',
                  data = c('Anaconda', 'African darter', 'Fox', 'Wolf', 'Spider', 'Toad', 'Agouti'),
                  placeholder = 'Type a letter')
    })

    output$test <- renderPrint({
      input$id_searching
    })

  }

shinyApp(ui, server)
