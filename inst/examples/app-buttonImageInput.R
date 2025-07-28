library(shiny)
library(shinyinvoer)

# devtools::load_all()
# devtools::document()
# devtools::install()

ui <- fluidPage(
  h2("MIXED FORMATS"),
  # Basic example with mixed PNG and SVG images
  buttonImageInput(inputId = 'button_img0',
                   label = "Elige un animal",
                   images = c("Gato" = "cat.png","Perro" = "dog.png",
                              "Zorro" = "fox.png",
                              "Bubble" = "bubble.svg"),
                   path = "www/img",
                   active = "fox",
                   disabled = c("cat", "dog")
                   ),
  verbatimTextOutput('debug0'),
  hr(),
  h2("PNG"),
  uiOutput('button'),
  uiOutput("test_update"),
  actionButton("update_images", "Update to fox perro"),
  verbatimTextOutput('input_button'),
  hr(),
  h3("SVG"),
  selectInput("svg_images", "Select images",
              c("area_line", "pie_donut")
  ),
  uiOutput('ui_button_svg'),
  verbatimTextOutput('debug_svg'),
  hr(),
  
  # ===== LAYOUT EXAMPLES =====
  h2("TEST: Single Row Layout (nrow=1, ncol=6)"),
  # Grid layout forces all 6 buttons into exactly 1 row with 6 columns
  # Buttons stretch to fill the available width
  buttonImageInput(
    inputId = 'test_single_row',
    images = c("Mapa" = "map", "Torta" = "pie", "Dona" = "donut",
               "Treemap" = "treemap", "Barras" = "bar", "Tabla" = "table"),
    highlightColor = "#09A274",
    button_width = 22,
    path = 'www/img_svg',
    active = "map",
    nrow = 1,        # Force exactly 1 row
    ncol = 6,        # Force exactly 6 columns
    disabled = c("pie", "donut", "treemap", "bar"),
    layout = "grid"  # Required for nrow/ncol to work
  ),
  verbatimTextOutput('test_single_row_output'),
  hr(),
  
  h2("TEST: Square Buttons (button_width=30, button_height=30)"),
  # Grid layout with 4 columns - buttons stretch to fill available space
  buttonImageInput(
    inputId = 'test_square_buttons',
    images = c("Mapa" = "map", "Torta" = "pie", "Dona" = "donut",
               "Treemap" = "treemap", "Barras" = "bar", "Tabla" = "table"),
    highlightColor = "#09A274",
    button_width = 30,    # Width of each button
    button_height = 30,   # Height of each button (square)
    path = 'www/img_svg',
    active = "map",
    ncol = 4,            # 4 columns in grid
    layout = "grid"      # Grid layout required for ncol
  ),
  verbatimTextOutput('test_square_output'),
  hr(),
  
  h2("TEST: Rectangular Buttons (button_width=40, button_height=20)"),
  # Grid layout with rectangular buttons - buttons stretch to fill grid cells
  buttonImageInput(
    inputId = 'test_rectangular_buttons',
    images = c("Mapa" = "map", "Torta" = "pie", "Dona" = "donut",
               "Treemap" = "treemap", "Barras" = "bar", "Tabla" = "table"),
    highlightColor = "#09A274",
    button_width = 40,    # Width of each button
    button_height = 20,   # Height of each button (rectangular)
    path = 'www/img_svg',
    active = "map",
    ncol = 4,            # 4 columns in grid
    layout = "grid"      # Grid layout required for ncol
  ),
  verbatimTextOutput('test_rectangular_output'),
  hr(),
  
  h2("TEST: Aspect Ratio (button_width=35, button_ar=1.5)"),
  # Grid layout with custom aspect ratio - height calculated as width/1.5
  buttonImageInput(
    inputId = 'test_aspect_ratio',
    images = c("Mapa" = "map", "Torta" = "pie", "Dona" = "donut",
               "Treemap" = "treemap", "Barras" = "bar", "Tabla" = "table"),
    highlightColor = "#09A274",
    button_width = 35,    # Width of each button
    button_ar = 1.5,      # Aspect ratio (width/height) - height = 35/1.5 = 23.33px
    path = 'www/img_svg',
    active = "map",
    ncol = 4,            # 4 columns in grid
    layout = "grid"      # Grid layout required for ncol
  ),
  verbatimTextOutput('test_aspect_ratio_output'),
  hr(),
  
  h2("TEST: Flow Layout (layout='flex')"),
  # Flex layout - buttons maintain their size and flow to next line naturally
  # No nrow/ncol parameters needed
  buttonImageInput(
    inputId = 'test_flow_layout',
    images = c("Mapa" = "map", "Torta" = "pie", "Dona" = "donut",
               "Treemap" = "treemap", "Barras" = "bar", "Tabla" = "table"),
    highlightColor = "#09A274",
    button_width = 35,    # Fixed width of each button
    button_height = 25,   # Fixed height of each button
    path = 'www/img_svg',
    active = "map",
    layout = "flex"       # Flex layout - buttons flow naturally
  ),
  verbatimTextOutput('test_flow_layout_output'),
  hr(),
  
  h2("TEST: Container Width (container_width='300px')"),
  # Flex layout with constrained container width - buttons wrap when they hit the limit
  buttonImageInput(
    inputId = 'test_container_width',
    images = c("Mapa" = "map", "Torta" = "pie", "Dona" = "donut",
               "Treemap" = "treemap", "Barras" = "bar", "Tabla" = "table"),
    highlightColor = "#09A274",
    button_width = 35,           # Fixed width of each button
    button_height = 25,          # Fixed height of each button
    path = 'www/img_svg',
    active = "map",
    container_width = "300px"    # Constrain container width (default is 100%)
  ),
  verbatimTextOutput('test_container_width_output'),
  hr(),
  
  h2("TEST: Two Row Layout (nrow=2, ncol=3)"),
  # Grid layout with 2 rows and 3 columns - buttons stretch to fill grid
  buttonImageInput(
    inputId = 'test_two_rows',
    images = c("Mapa" = "map", "Torta" = "pie", "Dona" = "donut",
               "Treemap" = "treemap", "Barras" = "bar", "Tabla" = "table"),
    highlightColor = "#09A274",
    button_width = 22,    # Width of each button
    path = 'www/img_svg',
    active = "map",
    nrow = 2,            # 2 rows
    ncol = 3,            # 3 columns per row
    layout = "grid"      # Grid layout required for nrow/ncol
  ),
  verbatimTextOutput('test_two_rows_output'),
  br()
)

server <- function(input, output, session) {


  output$debug0 <- renderPrint({
    input$button_img0
  })


  output$button <- renderUI({
    buttonImageInput(inputId = 'chosen_button',
                     label = "Elige un animal",
                     images = c("Treemap" = "treemap","Area" = "area",
                                "Bar" = "bar",
                                "Map" = "map"),
                     ncol = 3,
                     active = 'dogss',
                     disabled = 'bubble',
                     highlightColor = "red",
                     checkmark = TRUE,
                     path = "www/img_svg")
  })

  output$test_update <- renderUI({
    selectInput("country_id", "Update button image", c("colombia", "fox", "la india"))
  })
  observe({
    req(input$country_id)
    if (input$country_id == "mexico") {
      updateButtonImageInput(session, "chosen_button", active = "fox")
    }
  })

  # print input id of your click
  output$input_button <- renderPrint({
    input$chosen_button
  })



  #### SVG

  selected_images <- reactive({
    imgs <- input$svg_images
    strsplit(imgs, "_")[[1]]
  })


    output$ui_button_svg <- renderUI({
      imgs <- selected_images()
      #imgs <- c("bubble", "area")
      buttonImageInput(inputId = 'button_svg',
                       label = " ",
                       images = imgs,
                       nrow = 2,
                       highlightColor = "blue",
                       checkmark = FALSE,
                       active = imgs[2],
                       path = "www/img_svg")
    })

    # print input id of your click
    output$debug_svg <- renderPrint({
      str(selected_images())
      input$button_svg
    })

    # Test outputs for the new test cases
    output$test_single_row_output <- renderPrint({
      input$test_single_row
    })

    output$test_square_output <- renderPrint({
      input$test_square_buttons
    })

    output$test_rectangular_output <- renderPrint({
      input$test_rectangular_buttons
    })

    output$test_aspect_ratio_output <- renderPrint({
      input$test_aspect_ratio
    })

    output$test_flow_layout_output <- renderPrint({
      input$test_flow_layout
    })

    output$test_container_width_output <- renderPrint({
      input$test_container_width
    })

    output$test_two_rows_output <- renderPrint({
      input$test_two_rows
    })



}

shinyApp(ui, server)
