library(shiny)
library(shinyinvoer)

# devtools::load_all()
# devtools::document()
# devtools::install()

ui <- fluidPage(
  h2("MIXED FORMATS"),
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



}

shinyApp(ui, server)
