context("buttonImageInput")

test_that("Default", {
    tagButton <- buttonImageInput(
    inputId = "myButton",
    labels = c('dog', 'cat', 'fox'),
    values = c('Dog', 'Cat', 'Fox')
  )

    expect_identical(tagButton$attribs$`data-shiny-input-type`, "buttonImage")
})


