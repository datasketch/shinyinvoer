context("buttonImageInput")

test_that("ButtonImageOptions work", {

  #
  images <- c('dog', 'cat', 'fox')
  path <- "inst/examples/www/img_png"
  img_opts <- buttonImageOptions(images = images,path = path)
  expect_equal(img_opts[[1]]$id, "dog")
  expect_equal(img_opts[[1]]$path, "inst/examples/img_png/dog.png")
  expect_equal(img_opts[[1]]$format, "png")

  images <- c('dog', 'cat', 'fox')
  path <- "xxxx"
  expect_error(buttonImageOptions(images = images,path = path))

  # Images with full path
  images <- c('dog.png', 'cat.png', 'fox.png')
  images <- file.path("inst/examples/www/img_png", images)
  img_opts <- buttonImageOptions(images = images)
  expect_equal(img_opts[[1]]$id, "dog")
  expect_equal(img_opts[[1]]$path, "inst/examples/img_png/dog.png")
  expect_equal(img_opts[[1]]$format, "png")

  # Make sure the images that start with www, the www is removed
  images <- c('dog.png', 'cat.png', 'fox.png')
  images <- file.path("www/img_png", images)
  img_opts <- buttonImageOptions(images = images)
  expect_false(all(grepl("^www",img_opts)))

  # SVG Images
  images <- c('Table'='table', 'Bubble' = 'bubble')
  path <- "inst/examples/www/img_svg"
  img_opts <- buttonImageOptions(images = images, path = path)
  expect_true(img_opts[[1]]$format == "svg")

  # images <- c('Table'='table', 'Bubble' = 'bubble')
  # path <- "www/img_svg"
  # img_opts <- buttonImageOptions(images = images, path = path)
  # expect_true(img_opts[[1]]$format == "svg")

  # Mixed PNG and SVG
  images <- c('Dog'='dog.png', 'Cat'='cat.png', 'Fox'='fox.png', 'Bubble' = 'bubble.svg')
  path <- "inst/examples/www/img"
  buttonImageOptions(images = images, path = path)



  images <- c('dog', 'cat', 'fox')
  path <- "inst/examples/www/img_png"
  img_opts <- buttonImageInput0("image0",images = images,path = path, active = "dog")



  buttonImageInput0(inputId = 'chosen_button0',
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




  tagButton <- buttonImageInput(
    inputId = "myButton",
    labels = c('dog', 'cat', 'fox'),
    values = c('Dog', 'Cat', 'Fox')
  )

  expect_identical(tagButton$attribs$`data-shiny-input-type`, "buttonImage")
})



test_that("active button", {

  active_button <- 'Fox'
  tagButton <- buttonImageInput(
    inputId = "myButton",
    labels = c('dog', 'cat', 'fox'),
    values = c('Dog', 'Cat', 'Fox'),
    active = active_button
  )
  info__active_button <- tagButton$children[[2]][grep("active_btn", tagButton$children[[2]])][[1]]
  active_expected <- as.character(regmatches(info__active_button, gregexpr(active_button, info__active_button))[[1]])
  expect_identical(active_expected, active_button)
})

