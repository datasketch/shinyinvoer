
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
choices <- c('Belgium' = 'be', 'Colombia' = 'co', 'Brazil' = 'br',
             'Germany' = 'de', 'Jamaica' = 'jm')
# choices <- c('be', 'co', 'br', 'de', 'jm')
named_choices <- c("Ahh!" = "a", "Buu!" = "b", "Cool"="c")

ui <- fluidPage(
  #suppressDependencies('bootstrap'),
  selectImageInput("dropdown_list", "Select Image", choices = choices,
                   images = images, width = 300),
  verbatimTextOutput('dropdown_result'),
  hr(),
  selectInput('updater', "Choose a country",
              c('be', 'co', 'br', 'de', 'jm'),
              selected = 'co'),
  selectImageInput("will_update", "Watch the result", choices = choices,
                   images = images, width = 200),
  hr(),
  p('Watch. Check. Watch again'),
  checkboxInput('checkbox_updater', 'Add options'),
  selectImageInput('checkbox_will_update',
                   'New options added',
                   choices = c('France' = 'fr'),
                   images = c('https://www.countryflags.io/fr/flat/32.png'),
                   width = 200),
  hr(),
  p('Create empty, then update'),
  checkboxInput('checkbox_updater2', 'Add more options'),
  selectImageInput('empty_then_update',
                   'Empty, then update',
                   choices = NULL,
                   images = NULL,
                   width = 200),
  hr(),
  verbatimTextOutput('checkbox_dropdown_result'),
  # No named options
  # selectImageInput('checkbox_will_update',
  #                  'New options added',
  #                  choices = c('fr'),
  #                  images = c('https://www.countryflags.io/fr/flat/32.png'),
  #                  width = 200)

)

server <- function(input, output, session) {
  output$dropdown_result <- renderPrint({
    input$dropdown_list
  })
  output$checkbox_dropdown_result <- renderPrint({
    input$checkbox_updater2
  })
  observe({
    updateSelectImageInput(session, inputId = "will_update", selected = input$updater)
    if (input$checkbox_updater) {
      updateSelectImageInput(session, inputId = "checkbox_will_update",
                             choices = choices, images = images)
      # No named options
      # updateSelectImageInput(session, inputId = "checkbox_will_update",
      # choices = c('be', 'co', 'br', 'de', 'jm'), images = images)
    }
    if (input$checkbox_updater2) {
      updateSelectImageInput(session, inputId = "empty_then_update",
                             # choices = sample(1:8,2), -> ids cannot begin with a number
                             choices = c('choice-1', 'choice-2'),
                             images = sample(images,2)
      )
    }
    else{
      updateSelectImageInput(session, inputId = "empty_then_update",
                             choices = NULL,
                             images = NULL
      )
    }

  })
}

shinyApp(ui, server)
