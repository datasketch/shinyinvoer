# Example app for coloredSelectInput widget
library(shiny)
library(shinyinvoer)

# Define UI
ui <- fluidPage(
  titlePanel("Colored Select Input Widget Demo"),

  sidebarLayout(
    sidebarPanel(
      h3("Single Selection"),
      coloredSelectInput(
        "single_color",
        "Choose a color:",
        choices = list(
          list(value = "red", label = "Red", color = "#ff0000"),
          list(value = "green", label = "Green", color = "#00ff00"),
          list(value = "blue", label = "Blue", color = "#0000ff"),
          list(value = "yellow", label = "Yellow", color = "#ffff00"),
          list(value = "purple", label = "Purple", color = "#800080"),
          list(value = "orange", label = "Orange", color = "#ffa500")
        ),
        placeholder = "Select a color...",
        width = "100%"
      ),

      br(),

      h3("Multiple Selection"),
      coloredSelectInput(
        "multiple_colors",
        "Choose multiple colors:",
        choices = list(
          list(value = "#ff0000", label = "Red", color = "#ff0000"),
          list(value = "#00ff00", label = "Green", color = "#00ff00"),
          list(value = "blue", label = "Blue", color = "#0000ff"),
          list(value = "yellow", label = "Yellow", color = "#ffff00"),
          list(value = "purple", label = "Purple", color = "#800080"),
          list(value = "orange", label = "Orange", color = "#ffa500"),
          list(value = "pink", label = "Pink", color = "#ffc0cb"),
          list(value = "cyan", label = "Cyan", color = "#00ffff")
        ),
        multiple = TRUE,
        selected = c("red", "blue"),
        placeholder = "Select multiple colors...",
        width = "100%"
      )
    ),

    mainPanel(
      h3("Selected Values"),

      h4("Single Selection Result:"),
      verbatimTextOutput("single_result"),

      h4("Multiple Selection Result:"),
      verbatimTextOutput("multiple_result"),

      h4("Raw Input Values:"),
      verbatimTextOutput("raw_values"),

      br(),

      h3("Features Demonstrated:"),
      tags$ul(
        tags$li("Single and multiple selection modes"),
        tags$li("Colored backgrounds for selected items"),
        tags$li("Custom placeholder text"),
        tags$li("Responsive design"),
        tags$li("Keyboard navigation (arrow keys, enter, escape)"),
        tags$li("Click to select/deselect"),
        tags$li("Dynamic updates via updateColoredSelectInput()"),
        tags$li("Dark mode support"),
        tags$li("Mobile-friendly interface")
      )
    )
  )
)

# Define server logic
server <- function(input, output, session) {

  # Display single selection result
  output$single_result <- renderPrint({
    input$single_color
  })

  # Display multiple selection result
  output$multiple_result <- renderPrint({
    input$multiple_colors
  })

  # Display raw input values
  output$raw_values <- renderPrint({
    list(
      single = input$single_color,
      multiple = input$multiple_colors
    )
  })



}

# Run the application
shinyApp(ui = ui, server = server)
