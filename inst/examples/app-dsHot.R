library(shiny)
library(dsAppWidgets)
library(datafringe)

ui <- fluidPage(
  column(4,
         verbatimTextOutput("debug")
  ),
  column(4,
         dsHot("indata1", data = mtcars, options = list(height = 300))
  ),
  column(4,
         dsHot("indata2", data = cars, options = list(height = 200))
  )
)
server <- function(input,output,session){
  output$debug <- renderPrint({
    str(input$indata1)
  })
}
shinyApp(ui,server)


