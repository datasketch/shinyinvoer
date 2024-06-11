library(shiny)
library(shinyinvoer)

# devtools::load_all()
# devtools::document()
# devtools::install()

ui <- fluidPage(
  sidebarLayout(
    sidebarPanel(

      wellPanel(
        h2("MIXED FORMATS"),
        buttonImageInput(inputId = 'button_img0',
                         label = "Elige un animal",
                         images = c("Gato" = "cat.png","Perro" = "dog.png",
                                    "Zorro" = "fox.png",
                                    "Bubble" = "bubble.svg"),
                         path = "www/img"),
        h2("PNG"),
        uiOutput('button'),
        uiOutput("test_update"),
        actionButton("update_images", "Update to fox perro"),
        hr(),
        h3("SVG"),
        selectInput("svg_images", "Select images",
                    c("bubble_line", "line_donut")
                    ),
        uiOutput('ui_button_svg')
      )
    ),
    mainPanel(
      h2("Mixed"),
      verbatimTextOutput('debug0'),
      h2("PNGs"),
      verbatimTextOutput('input_button'),
      h2("SVGs"),
      verbatimTextOutput('debug_svg')
    )
  )
)

server <- function(input, output, session) {


  output$debug0 <- renderPrint({
    input$button_img0
  })


  output$button <- renderUI({
    # buttonImageInput(inputId = 'chosen_button',
    #                  label = "Elige un animal",
    #                  images = c("Gato" = "cat","Perro" = "dog", "Zorro" = "fox",
    #                             "Bubble" = "bubble"),
    #                  ncol = 3,
    #                  # tooltips = c("Gato", "Perro", "Zorro"),
    #                  active = 'dogss',
    #                  disabled = 'bubble',
    #                  # highlightColor = "blue",
    #                  highlightColor = "red",
    #                  checkmark = TRUE,
    #                  path = "www/img_svg")
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

#
#   output$ui_button_svg <- renderUI({
#     imgs <- selected_images()
#     imgs <- c("bubbles", "areas")
#     buttonImageInput(inputId = 'button_svg',
#                      label = " ",
#                      images = imgs,
#                      nrow = 2,
#                      highlightColor = "red",
#                      checkmark = FALSE,
#                      # active = c('dog', "fox"),
#                      path = "www/img_svg")
#   })
#
#   # print input id of your click
#   output$debug_svg <- renderPrint({
#     str(selected_images())
#     input$button_svg
#   })



}

shinyApp(ui, server)
