
#' @title Get url parameters into a list
#' @export
url_params <- function(params, session){
  query <- parseQueryString2(session$clientData$url_search)
  #inputs <- query["__inputs"]
  data <- query["__data"]
  s <- parseStateQueryString(query[["__s"]])
  l <- modifyList(params, query, keep.null = FALSE)
  query_inputs <- l[names(params)]
  l <- list(inputs = query_inputs,
            data = data)
  modifyList(l, s %||% list())
}


#' @title Update url encoded parameters
#' @export
update_url_params <- function(input, session){
  observe({
    inputs <- reactiveValuesToList(input) # on input change
    s <- buildQueryString(inputs)
    updateQueryString(s, session = session)
  })
}

buildQueryString <- function(inputs, data = NULL, key = "key"){
  query <- list(
    inputs = inputs,
    data = data
  )
  json_params <- jsonlite::toJSON(query)
  paste0("?__s=",safer::encrypt_string(json_params, key = key))
}

parseStateQueryString <- function(x){
  if(is.null(x)) return(list())
  x <- safer::decrypt_string(x, key = "key")
  jsonlite::fromJSON(x)
}



parseQueryString2 <- function (str, nested = FALSE){
  if (is.null(str) || nchar(str) == 0)
    return(list())
  if (substr(str, 1, 1) == "?")
    str <- substr(str, 2, nchar(str))
  pairs <- strsplit(str, "&", fixed = TRUE)[[1]]
  pairs <- pairs[pairs != ""]
  #pairs <- strsplit(pairs, "=", fixed = TRUE)
  pairs <- regmatches(pairs, regexpr("=", pairs), invert = TRUE)
  keys <- vapply(pairs, function(x) x[1], FUN.VALUE = character(1))
  values <- vapply(pairs, function(x) x[2], FUN.VALUE = character(1))
  values[is.na(values)] <- ""
  # keys <- gsub("+", " ", keys, fixed = TRUE)
  # values <- gsub("+", " ", values, fixed = TRUE)
  keys <- unlist(lapply(keys,URLdecode))
  values <- unlist(lapply(values,URLdecode))
  res <- stats::setNames(as.list(values), keys)
  res
}

