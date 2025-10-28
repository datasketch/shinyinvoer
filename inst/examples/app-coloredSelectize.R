# Example app for coloredSelectizeInput widget with iris dataset
library(shiny)
library(shinyinvoer)

# Define UI
ui <- fluidPage(
  titlePanel("Colored Selectize Input Widget Demo - Iris Dataset"),

  sidebarLayout(
    sidebarPanel(
      h3("Iris Dataset Variables"),
      p("Select variables from the iris dataset. Each variable has its own color:"),

      # Example 1: Different colors for each variable
      h4("Different Colors"),
      coloredSelectizeInput(
        "iris_vars",
        "Select variables:",
        choices = c(
          "Sepal.Length" = "Sepal.Length",
          "Sepal.Width" = "Sepal.Width",
          "Petal.Length" = "Petal.Length",
          "Petal.Width" = "Petal.Width",
          "Species" = "Species"
        ),
        colors = c("#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"),
        selected = "Species",
        multiple = TRUE,
        placeholder = "Choose variables...",
        placeholderText = "Suggested",
        reorder = TRUE,
        width = "100%"
      ),

      br(),

      # Example 2: Single color for all
      h4("Single Color"),
      coloredSelectizeInput(
        "iris_vars_single",
        "Select variables (single color):",
        choices = c(
          "Sepal.Length" = "esto es una palabra muy larga",
          "Sepal.Width" = "Sepal.Width",
          "Petal.Length" = "Petal.Length",
          "Petal.Width" = "Petal.Width",
          "Species" = "Species"
        ),
        colors = "#e74c3c",
        multiple = TRUE,
        placeholder = "Choose variables...",
        width = "100%"
      ),

      br(),

      # Example 3: Single selection
      h4("Single Selection"),
      coloredSelectizeInput(
        "iris_var_single",
        "Select one variable:",
        choices = c(
          "Sepal.Length" = "Sepal.Length",
          "Sepal.Width" = "Sepal.Width",
          "Petal.Length" = "Petal.Length",
          "Petal.Width" = "Petal.Width",
          "Species" = "Species"
        ),
        colors = c("#9b59b6", "#e67e22", "#1abc9c", "#34495e", "#e74c3c"),
        multiple = FALSE,
        placeholder = "Choose one variable...", placeholderText = "hola",
        width = "100%"
      )
    ),

    mainPanel(
      h3("Selected Values"),

      h4("Different Colors Result:"),
      verbatimTextOutput("iris_vars_result"),

      h4("Single Color Result:"),
      verbatimTextOutput("iris_vars_single_result"),

      h4("Single Selection Result:"),
      verbatimTextOutput("iris_var_single_result"),

      br(),

      h3("Color Mapping:"),
      tags$ul(
        tags$li(tags$span(style = "color: #ff6b6b; font-weight: bold;", "Sepal.Length"), " - Red"),
        tags$li(tags$span(style = "color: #4ecdc4; font-weight: bold;", "Sepal.Width"), " - Teal"),
        tags$li(tags$span(style = "color: #45b7d1; font-weight: bold;", "Petal.Length"), " - Blue"),
        tags$li(tags$span(style = "color: #96ceb4; font-weight: bold;", "Petal.Width"), " - Green"),
        tags$li(tags$span(style = "color: #feca57; font-weight: bold;", "Species"), " - Yellow")
      )
    )
  )
)

# Define server logic
server <- function(input, output, session) {

  # Display results
  output$iris_vars_result <- renderPrint({
    input$iris_vars
  })

  output$iris_vars_single_result <- renderPrint({
    input$iris_vars_single
  })

  output$iris_var_single_result <- renderPrint({
    input$iris_var_single
  })

}

# Run the application
shinyApp(ui = ui, server = server)
