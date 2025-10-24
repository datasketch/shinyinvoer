# Test file for coloredSelectInput widget

library(testthat)
library(shiny)
library(shinyinvoer)

test_that("coloredSelectInput creates proper HTML structure", {
  # Test basic widget creation
  widget <- coloredSelectInput(
    "test_id",
    "Test Label",
    choices = list(
      list(value = "red", label = "Red", color = "#ff0000"),
      list(value = "blue", label = "Blue", color = "#0000ff")
    )
  )
  
  expect_s3_class(widget, "shiny.tag")
  expect_equal(widget$attribs$id, "test_id")
  expect_equal(widget$attribs$`data-shiny-input-type`, "coloredSelectInput")
})

test_that("coloredSelectInput handles simple vector choices", {
  # Test conversion of simple vector to proper format
  widget <- coloredSelectInput(
    "test_id2",
    choices = c("red", "green", "blue")
  )
  
  expect_s3_class(widget, "shiny.tag")
  expect_true(grepl("data-options", as.character(widget)))
})

test_that("coloredSelectInput handles multiple selection", {
  # Test multiple selection mode
  widget <- coloredSelectInput(
    "test_id3",
    choices = list(
      list(value = "red", label = "Red", color = "#ff0000"),
      list(value = "blue", label = "Blue", color = "#0000ff")
    ),
    multiple = TRUE
  )
  
  expect_s3_class(widget, "shiny.tag")
  expect_equal(widget$attribs$`data-multiple`, "true")
})

test_that("coloredSelectInput handles selected values", {
  # Test pre-selected values
  widget <- coloredSelectInput(
    "test_id4",
    choices = list(
      list(value = "red", label = "Red", color = "#ff0000"),
      list(value = "blue", label = "Blue", color = "#0000ff")
    ),
    selected = "red"
  )
  
  expect_s3_class(widget, "shiny.tag")
})

test_that("coloredSelectInput handles custom placeholder", {
  # Test custom placeholder
  widget <- coloredSelectInput(
    "test_id5",
    choices = list(),
    placeholder = "Custom placeholder"
  )
  
  expect_s3_class(widget, "shiny.tag")
  expect_equal(widget$attribs$`data-placeholder`, "Custom placeholder")
})

test_that("coloredSelectInput handles width parameter", {
  # Test width parameter
  widget <- coloredSelectInput(
    "test_id6",
    choices = list(),
    width = "300px"
  )
  
  expect_s3_class(widget, "shiny.tag")
  expect_true(grepl("width: 300px", as.character(widget)))
})

test_that("coloredSelectInput handles NULL inputId", {
  # Test automatic ID generation
  widget <- coloredSelectInput(
    inputId = NULL,
    choices = list()
  )
  
  expect_s3_class(widget, "shiny.tag")
  expect_true(grepl("colored_select_", widget$attribs$id))
})

test_that("updateColoredSelectInput function exists", {
  # Test that update function exists
  expect_true(exists("updateColoredSelectInput"))
  expect_true(is.function(updateColoredSelectInput))
})

test_that("coloredSelectInput includes required dependencies", {
  # Test that widget includes required CSS and JS files
  widget <- coloredSelectInput("test_id7", choices = list())
  
  widget_html <- as.character(widget)
  expect_true(grepl("colored-select.css", widget_html))
  expect_true(grepl("colored-select.js", widget_html))
  expect_true(grepl("colored-select-binding.js", widget_html))
})

test_that("coloredSelectInput handles empty choices", {
  # Test empty choices list
  widget <- coloredSelectInput(
    "test_id8",
    choices = list()
  )
  
  expect_s3_class(widget, "shiny.tag")
  expect_equal(widget$attribs$`data-options`, "[]")
})

test_that("coloredSelectInput validates choice structure", {
  # Test that choices are properly formatted
  choices <- list(
    list(value = "red", label = "Red", color = "#ff0000"),
    list(value = "green", label = "Green", color = "#00ff00")
  )
  
  widget <- coloredSelectInput("test_id9", choices = choices)
  
  # Check that data-options contains the choices
  options_json <- widget$attribs$`data-options`
  expect_true(grepl("red", options_json))
  expect_true(grepl("green", options_json))
  expect_true(grepl("#ff0000", options_json))
  expect_true(grepl("#00ff00", options_json))
})
