
library(shiny)
library(shinyinvoer)
library(purrr)


images <- c(
  'https://www.countryflags.io/be/flat/32.png',
  'https://www.countryflags.io/co/flat/32.png',
  'https://www.countryflags.io/br/flat/32.png',
  'https://www.countryflags.io/de/flat/32.png',
  'https://www.countryflags.io/jm/flat/32.png'
)
choices <- c('Belgium' = 'be', 'Colombia' = 'co', 'Brazil' = 'br', 'Germany' = 'de', 'Jamaica' = 'jm')
# choices <- c('be', 'co', 'br', 'de', 'jm')
named_choices <- c("Ahh!" = "a", "Buu!" = "b", "Cool"="c")

ui <- fluidPage(
  #suppressDependencies('bootstrap'),
  selectImageInput("dropdown_list", "Select Image", choices = choices,
                   images = images, width = 200),
  verbatimTextOutput('dropdown_result'),
  hr(),
  selectInput('updater', "Choose a country", c('be', 'co', 'br', 'de', 'jm')),
  selectImageInput("will_update", "Watch the result", choices = choices,
                   images = images, width = 200),
  hr()
  # selectImageInput("dropdown2", "Named choices", choices = named_choices,
  #                  selected = "b",
  #                  images = images, width = 50),
  # verbatimTextOutput('test2'),
  # hr(),
  # selectImageInput("dropdown3", "With custom placeholder", choices = choices,
  #                  placeholder = img(src = "https://via.placeholder.com/150x50/FF0000"),
  #                  images = images, width = 50),
  # verbatimTextOutput('test3'),
  # hr(),
  # selectImageInput("dropdown4", "With update", choices = choices,
  #                  placeholder = img(src = "https://via.placeholder.com/150x50/FF0000"),
  #                  images = images, width = 50),
  # verbatimTextOutput('test4')
)

server <- function(input, output, session) {
  output$dropdown_result <- renderPrint({
    input$dropdown_list
  })
  # output$test2 <- renderPrint({
  #   input$dropdown2
  # })
  # output$test3 <- renderPrint({
  #   input$dropdown3
  # })
  # output$test4 <- renderPrint({
  #   input$dropdown4
  # })

  observe({
    updateSelectImageInput(session, inputId = "will_update", selected = input$updater)
  })
}

shinyApp(ui, server)
