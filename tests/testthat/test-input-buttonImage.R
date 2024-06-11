test_that("multiplication works", {

  path <- "xxx"
  expect_error(buttonImageInput(inputId = 'chosen_button', label = "Elige un animal",
                   images = c("Gato" = "cat"), path = path),
               "Path doesn't exist")


  buttonImageInput(inputId = 'chosen_button0',
                   label = "Elige un animal",
                   images = c("Gato" = "cat.png","Perro" = "dog.png",
                              "Zorro" = "fox.png",
                              "Bubble" = "bubble.svg"),
                   disabled = 'bubble',
                   path = "inst/examples/www/img")



  path <- "inst/examples/www/img_png"
  buttonImageInput(inputId = 'chosen_button',
                   label = "Elige un animal",
                   images = c("Gato" = "cat","Perro" = "dog", "Zorro" = "fox",
                              "Bubble" = "bubble"),
                   nrow = 2,
                   disabled = 'bubble',
                   highlightColor = "red",
                   checkmark = TRUE,
                   path = path)

  buttonImageInput(inputId = 'chosen_button',
                   label = "Elige un animal",
                   images = c("Gato" = "cat","Perro" = "dog", "Zorro" = "fox",
                              "Bubble" = "bubble"),
                   nrow = 2,
                   # tooltips = c("Gato", "Perro", "Zorro"),
                   active = 'dogss',
                   disabled = 'bubble',
                   # highlightColor = "blue",
                   highlightColor = "red",
                   checkmark = TRUE,
                   path = "inst/examples/www/img_svg")

})
