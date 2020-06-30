test_that("url_params", {

  inputs <- list(
    user = "Encoded USERNAME",
    values = c("ENC VALS", LETTERS[1:3])
  )
  s <- buildQueryString(inputs)
  s
  expect_equal(parseStateQueryString(s)$inputs, inputs)
  str <- "?a=1&x=usser&__s=1ZL0xEd9J3YQ4qcebSgDnB++6TZGr+gYPoDhLUXJhIJHoTu9gSdGNavfjg94Pb4E3AdXnxT9xejgr7boIW02mmlMUMnJfn29SUyohvsHsUXAurEkh1pzJnS8LEgRORQxRfsErA=="
  expect_equal(parseQueryString2(str)[["__s"]], gsub("\\?__s=","",s))



})
