context("colorPalette")

test_that("inputId", {

  tagColors <- colorPalette(inputId = "id_colors",
                            colors = c("red", "blue", "orange"))

  expect_equal(tagColors$attribs$id, "id_colors")

})


test_that("Initial colors", {

  initial_colors <- c("#bf3100", "#684a52", "#9eefe5", "#8d3b72", "44633f")
  tagColors <- colorPalette(inputId = "id_colors",
                            colors = initial_colors)


  all_colors <- sum(purrr::map(1:length(initial_colors), function(i) {
                    grepl(initial_colors[i], tagColors$children[[2]][i])
                   }) %>% unlist())
  expect_equal(all_colors, length(initial_colors))

})
