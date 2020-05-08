context("colorPaletteInput")

test_that("inputId", {

  tagColors <- colorPaletteInput(inputId = "id_colors", "New palette",
                                 colors = c("red", "blue", "orange"))

  expect_equal(tagColors$children[[2]]$attribs$id, "id_colors")

})


test_that("Initial colors", {

  initial_colors <- c("#bf3100", "#684a52", "#9eefe5", "#8d3b72", "44633f")
  tagColors <- colorPaletteInput(inputId = "id_colors",
                                 "More colors",
                                 colors = initial_colors)


  all_colors <- sum(purrr::map(1:length(initial_colors), function(i) {
    grepl(initial_colors[i], tagColors$children[[2]]$children[[2]][i])
  }) %>% unlist())
  expect_equal(all_colors, length(initial_colors))

})
