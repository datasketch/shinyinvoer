library(shiny)
library(shinyinvoer)
library(datafringe)

ui <- fluidPage(
  column(4,
         verbatimTextOutput("debug")
  ),
  column(4,
        uiOutput('dstable')
  ),
  column(4,
         dsHot("indata2", data = cars, options = list(height = 200))
  )
)
server <- function(input,output,session){

  output$dstable <- renderUI({
    dsHot("indata1", data = mtcars, options = list(height = 300))
  })

  output$debug <- renderPrint({
    str(input$indata1)
  })
}
shinyApp(ui,server)


