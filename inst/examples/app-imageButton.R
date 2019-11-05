library(shiny)
library(dsAppWidgets)

# devtools::load_all()
# devtools::document()
# devtools::install()

ui <- fluidPage(
  uiOutput('texto'),
  verbatimTextOutput('salida'),
  uiOutput('test'),
  verbatimTextOutput('vista')
)

server <- function(input, output, session) {
  output$texto <- renderUI({
    buttonImageInput('cosa', label = 'hola', c("gato", "perro", "zorro"), c('uno', 'dos', 'tres'), file = "img/")
  })

  output$salida <- renderPrint({
    input$cosa
  })

  output$test <- renderUI({
    #session$sendInputMessage
   radioButtons('test_uno', 'ELige', c('Colombia', 'India', 'Pakistan'))
  })


  output$vista <- renderPrint({
    session$sendInputMessage
  })

observe({
  x <-  input$test_uno
  if (is.null(x)) return()
  if (x == 'India')
    updateButtonImageInput(session, inputId = 'cosa', active = 'tres')
})


}

shinyApp(ui, server)
