context("colorPalette")

test_that("inputId", {

  tagColors <- colorPalette(inputId = "id_colors",
                           colors = c("red", "blue", "orange"))

  expect_equal(tagColors$attribs$id, "id_colors")

})

