# this is copied from shiny since it's not exported

is.reactive <- function(obj){
  all(class(obj) %in% c("reactiveExpr","reactive"))
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
