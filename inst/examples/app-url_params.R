library(shiny)
library(shinyinvoer)

ui <- fluidPage(
  verbatimTextOutput("debug"),
  selectInput("select", "Select", choices = c("Good", "Bad")),
  uiOutput('params')
)

server <- function(input, output, session) {

  # ?a=1&x=usser&__s=1ZL0xEd9J3YQ4qcebSgDnB++6TZGr+gYPoDhLUXJhIJHoTu9gSdGNavfjg94Pb4E3AdXnxT9xejgr7boIW02mmlMUMnJfn29SUyohvsHsUXAurEkh1pzJnS8LEgRORQxRfsErA==
  input_defaults <- list("user" = "USER", value = 1:3)

  output$debug <- renderPrint({
    url_params(input_defaults, session)
  })

  output$params <- renderUI({
    #url_params(list("text", "user" = "USER", value = 1:3), session)
  })

  update_url_params(input, session)

}

shinyApp(ui, server)
