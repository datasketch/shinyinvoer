
context("SearchInput")

test_that("inputId", {

  tagSearch <- searchInput(
    inputId = "id_searching",
    data = c('Anaconda', 'African darter', 'Fox', 'Wolf', 'Spider', 'Toad', 'Agouti'),
    placeholder = "Type a letter"
  )
  expect_identical(tagSearch$attribs$id, "id_searching")
})


test_that("Vector of values", {

  searching_data <- c('Anaconda', 'African darter', 'Fox', 'Wolf', 'Spider', 'Toad', 'Agouti')
  tagSearch <- searchInput(
    inputId = "id_searching",
    data = searching_data,
    placeholder = "Type a letter"
  )

  data_search <- unlist(strsplit(gsub('\\[|\\]|\\"', "",tagSearch$attribs$`data-top`), ","))
  expect_identical(data_search, searching_data)
})

