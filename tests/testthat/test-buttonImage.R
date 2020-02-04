context("buttonImageInput")

test_that("Default shiny input", {
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

