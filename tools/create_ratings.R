
library(plyr)



ratings_vector <- function(num_cards) {
  
  ratings_buckets <- c(
    0.40,
    3.04,
    5.65,
    15.63,
    21.28,
    9.17,
    11.05,
    13.83,
    12.67,
    4.17,
    3.11
  )
  
  ratings <- numeric()
  
  for (i in 1:length(ratings_buckets)) {
    bucket_percent <- ratings_buckets[[i]]
    bucket_cards <- (bucket_percent/100) * num_cards
    bucket_rating <- 5.0 - ((i-1) * 0.5)
    ratings <- c(ratings, rep(bucket_rating, bucket_cards))
  }
  
  if (length(ratings) < num_cards) {
    ratings <- c(ratings, rep(0, num_cards - length(ratings)))
  }
  
  ratings
}


create_ratings <- function(set) {
  
  # read cards
  cards <- jsonlite::read_json(paste0("public/sets/", set, "/cards.json"))
  
  # read ordered names
  card_order <- read.csv("tools/ordered-grn.csv", header = TRUE, stringsAsFactors = FALSE)$name
  
  # get ratings vector for this # of cards
  ratings <- ratings_vector(length(card_order))
  
  # build ratings
  card_ratings <- lapply(seq_along(1:length(card_order)), function(i) {
    card_name <- card_order[[i]]
    card <- Filter(cards, f = function(x) x$name == card_name)
    if (length(card) > 0) {
      id <- card[[1]]$id
    } else {
      stop("Card not found: ", name)
    }
    list(
      id = id,
      name = card_name,
      rating = ratings[[i]]
    )
  })
  
  ldply(card_ratings, data.frame, stringsAsFactors = FALSE)
  
}

rat <- create_ratings("grn")
