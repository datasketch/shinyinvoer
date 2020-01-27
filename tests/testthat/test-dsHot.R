context("dsHot")

test_that("inputId Control", {

  tagTable <- dsHot(inputId = "id_tabla", data = mtcars)
  expect_equal(tagTable$attribs$id, "id_tabla")

})


test_that("Number of rows and columns present in data", {

  tagTable <- dsHot(inputId = "id_tabla", data = mtcars)
  expect_equal(tagTable$attribs$nrow, nrow(mtcars))
  expect_equal(tagTable$attribs$ncol, ncol(mtcars))

})


test_that("Dictionary", {

  endemic_data <- data.frame(endemic = c("Niceforonia", "Pseudohaetera mimica", "Psittacanthus gigas", "Atelopus simulatus",
                                         "Allomaieta", "Blue Anole", "Yellow-eared Parrot"),
                             type = c("Amphibians", "Insects", "Plants", "Amphibians", "Plants", "Reptiles", "Birds"),
                             random_sample = round(runif(7, 150, 10000)))
  endemic_dic <- data.frame(id = names(endemic_data), label = c('Endemic species', 'Type', 'Random Sample'))
  tagTable <- dsHot(inputId = "id_tabla", data = endemic_data, dic = endemic_dic)

  labels_dic <- strsplit(as.character(tagTable$attribs$`data-dic`), ",")[[1]]
  expect_equal(sum(grepl(paste0(endemic_dic$label, collapse = "|"), labels_dic)), ncol(endemic_data)  )

})



test_that("Options", {
  opts_list <- list(height = 300, width = 700, color = "red")
  tagTable <- dsHot(inputId = "id_tabla", data = mtcars, options = opts_list)
  opts_tagTable <- jsonlite::fromJSON(tagTable$attribs$`data-hotOpts`)
  modify_list_tag <- opts_tagTable[names(opts_tagTable) %in% names(opts_list)]
  expect_equal(modify_list_tag, opts_list)
})
