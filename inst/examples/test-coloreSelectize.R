library(dsshiny)
library(dsmods)
ui <- dsBoardPage(
  # First board - Controls
  dsBoard(
    id = "data_panel",
    title = "Data",
    body = div(
      selectDataUI("data_selector")
    ),
    expand_full = FALSE#,
    #width = "30%"
  ),
  dsBoard(
    id = "viz_panel",
    title = uiOutput("chart_selected"),
    body = tagList(
      div(

        verbatimTextOutput("output")
      )
    ),
    elevated_style = FALSE#,  # Start with normal style
    #width = "70%"
  )
)

# Server
server <- function(input, output, session) {

  r <- reactiveValues(
    # config_username = Sys.getenv("DS_AUTH_USERNAME"),
    # config_token = Sys.getenv("DS_AUTH_TOKEN"),
    # config_organization = Sys.getenv("DS_AUTH_SCOPE"),
    config_lang = "en",
    confViz = NULL,
    placeholderText = "Sugeridas"
  )

  # Update language when user changes selection
  observe({
    r$config_lang <- input$language
  })

  selectDataServer(
    "data_selector",
    r,
    options = list(
      multiple = FALSE,
      options_opts = list(
        first_row_headers_value = TRUE
      )
    )
  )




  output$chart_selected <- renderUI({

    if (is.null(r$data_hdtbs)) {
      "Chart"
    } else {
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
        selected = "Species", maxItems = 3,
        multiple = TRUE,
        placeholder = "Choose variables...",
        placeholderText = "Suggested",
        reorder = TRUE,
        width = "100%"
      )
    }
  })

  selectVarServer(
    id = "varModule",
    r = r
  )


  data_loaded <- reactiveVal(FALSE)


  # Elevar panel
  observeEvent(r$data_hdtbs, {
    data_loaded(TRUE)
    dsshiny:::updateBoardElevation("viz_panel", TRUE)
  })
  #
  # output$output <- renderPrint({
  #   print(r$hdtbs_select)
  #   # if (!is.null(r$data_edit)) {
  #   #   cat("Current edited tables:\n")
  #   #   str(r$data_edit)
  #   # } else {
  #   #   cat("No edits yet.\n")
  #   # }
  # })

}

# Run the application
shinyApp(ui = ui, server = server)
