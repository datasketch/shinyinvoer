library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  actionButton("redraw_plot","Re-draw plot"),
  withImage(
    plotOutput("my_plot"),
    file_location = "img/loading_example.gif"
  )
)

server <- function(input, output, session) {

  output$my_plot <- renderPlot({
    input$redraw_plot
    Sys.sleep(3)
    plot(x = runif(1e4), y = runif(1e4))
  })

}

shinyApp(ui = ui, server = server)
