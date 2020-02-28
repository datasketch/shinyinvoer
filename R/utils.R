# this is copied from shiny since it's not exported

is.reactive <- function(obj){
  all(class(obj) %in% c("reactiveExpr","reactive"))
}


`%||%` <- function (x, y)
{
  if (is.empty(x))
    return(y)
  else if (is.null(x) || is.na(x))
    return(y)
  else if (class(x) == "character" && nchar(x) == 0)
    return(y)
  else x
}

is.empty <- function (x)
{
  !as.logical(length(x))
}


# dropNulls
dropNulls <- function(x) {
  x[!vapply(x, is.null, FUN.VALUE = logical(1))]
}

dropNullsOrNA <- function(x) {
  x[!vapply(x, nullOrNA, FUN.VALUE = logical(1))]
}
nullOrNA <- function(x) {
  is.null(x) || is.na(x)
}
