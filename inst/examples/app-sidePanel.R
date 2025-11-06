# Side Panel Example
# This example demonstrates the sidePanelInput widget with dynamic content
# using body parameter with uiOutput for server-side rendering

library(shiny)
library(dsshiny)
library(shinyinvoer)

# UI
ui <- dsBoardPage(
  # First board - Controls
  dsBoard(
    id = "control_panel",
    title = "Control Panel",
    body = tagList(
      "Panel de datos"
    ),
    width = "30%"
  ),
  dsBoard(
    id = "data_panel",
    title = "Graph",
    body = div(
      # Botón del panel lateral
      sidePanelInput(
        inputId = "side_panel",
        menuItems = list(
          list(
            id = "home",
            icon = "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path><polyline points='9 22 9 12 15 12 15 22'></polyline></svg>",
            title = "Home",
            tooltip = "Go to home",
            # Contenido estático directamente en body
            body = div(
              h3("Home Content"),
              uiOutput("panel_home")
            )
          ),
          list(
            id = "settings",
            icon = "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='3'></circle><path d='M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24'></path></svg>",
            title = "Settings",
            tooltip = "Settings",
            # Contenido dinámico desde el servidor usando uiOutput
            body = uiOutput("panel_content")
          ),
          list(
            id = "data",
            icon = "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><ellipse cx='12' cy='6' rx='8' ry='2'></ellipse><path d='M4 6v12c0 1.1 3.6 2 8 2s8-.9 8-2V6'></path><path d='M4 10v8c0 1.1 3.6 2 8 2s8-.9 8-2v-8'></path></svg>",
            title = "Data",
            tooltip = "Data",
            body = div(
              uiOutput("panel_data")
            )
          )
        ),
        containerId = "loading_controls",  # Panel aparecerá dentro de este div
        mainContentId = "graph_content",   # Contenido que se desplazará cuando el panel se abra
        position = "left",
        panelWidth = "300px",
        initialOpen = TRUE,
        buttonText = "Edit"
      ),
      div(
        style = "display:flex;border: 1px solid #DDDDDD;margin-top: 12px;",
        div(
          id = "loading_controls",
          style = "position: relative; min-height: 400px; height: 100%;"  # Necesario para posicionamiento absoluto del panel y altura
        ),
        div(
          id = "graph_content",
          h4("Main Content Area"),
          p("This content will shift when the panel opens/closes."),
          verbatimTextOutput("selected_item_display"),
          p("inputs in panel"),
          verbatimTextOutput("test_inputs")
        )
      )
    ),
    width = "70%"
  )
)

# Server
server <- function(input, output, session) {

  output$panel_home <- renderUI({
    # Obtener el item seleccionado del panel
    selected_item <- input$side_panel$selectedItem

    if (is.null(selected_item)) {
      return()
    }

    # Render contenido según el item seleccionado
    # Solo renderizamos cuando "settings" está seleccionado
    if (selected_item == "home") {
      tagList(
        dsinputs::multiple_select("var_mul", "Select multiple options",
                                  c("JS", "R", "RUBY", "JULIA"), selected = "JULIA")
      )
    } else {
      return()
    }
  })

  output$panel_content <- renderUI({
    # Obtener el item seleccionado del panel
    selected_item <- input$side_panel$selectedItem

    if (is.null(selected_item)) {
      return()
    }

    # Render contenido según el item seleccionado
    # Solo renderizamos cuando "settings" está seleccionado
    if (selected_item == "settings") {
      tagList(
        h3("Settings"),
        p("Select a variable:"),
        selectizeInput("id_var", "Select a var", c("A", "B", "C")),
        br(),
        p("Current selection:"),
        verbatimTextOutput("var_output")
      )
    } else {
      return()
    }
  })


  output$panel_data <- renderUI({
    # Obtener el item seleccionado del panel
    selected_item <- input$side_panel$selectedItem

    if (is.null(selected_item)) {
      return()
    }

    # Render contenido según el item seleccionado
    # Solo renderizamos cuando "settings" está seleccionado
    if (selected_item == "data") {
      tagList(
        shinyinvoer::coloredSelectizeInput("var_cat",
                                           "Select a var",
                                           c("Z", "Y", "X"),
                                           colors = c("#35C4B9", "#FCBD0B", "#DA1C95")),
        dsinputs::checkbox("id_check", label = "Yes/No", value = TRUE)
      )
    } else {
      return()
    }
  })

  # Mostrar el valor seleccionado del selectizeInput
  output$var_output <- renderText({
    if (!is.null(input$id_var)) {
      paste("Selected:", input$id_var)
    } else {
      "No selection yet"
    }
  })

  # Mostrar el item seleccionado del panel en el contenido principal
  output$selected_item_display <- renderText({
    panel_state <- input$side_panel
    if (!is.null(panel_state)) {
      paste(
        "Panel is:", ifelse(panel_state$isOpen, "OPEN", "CLOSED"),
        "\nSelected item:", ifelse(is.null(panel_state$selectedItem), "None", panel_state$selectedItem)

      )
    } else {
      "Panel state not available"
    }
  })

  output$test_inputs <- renderPrint({
    list(
      input$var_mul,
      input$id_var,
      input$var_cat,
      input$id_check
    )
  })

}

# Run the application
shinyApp(ui = ui, server = server)
