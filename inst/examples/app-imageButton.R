library(shiny)
library(dsAppWidgets)

# devtools::load_all()
# devtools::document()
# devtools::install()

ui <- fluidPage(
  uiOutput('texto'),
  verbatimTextOutput('salida')
)

server <- function(input, output) {
  output$texto <- renderUI({
    buttonImage('cosa', c("gato", "perro", "zorro"), c('uno', 'dos', 'tres'), file = "img/")
  })

  output$salida <- renderPrint({
    input$cosa
  })
}

shinyApp(ui, server)
