
library(rvest)

set_path <- function(set_code) {
  switch(set_code,
    grn = "guilds-of-ravnica",
    m19 = "core-set-2019",
    dom = "dominaria",
    rix = "rivals-of-ixalan",
    xln = "ixalan"
  )
}

channel_fireball_ratings <- function(set_code) {
  

  # download set ratings
  set_url <- sprintf("https://www.mtgranks.com/set/%s/", set_path(set_code))
  set_html <- read_html(set_url)
  
  # extract card nodes
  cards_html <- set_html %>% 
    html_nodes("#set_container .col-2 .hidden_card")
  
  # parse ratings
  cards <- lapply(cards_html, function(card_html) {
    card_text <- html_text(card_html, trim = TRUE)
    fields <- strsplit(card_text, "\\n")[[1]]
    fields <- lapply(fields, trimws)
    fields <- fields[nzchar(fields)]
    card <- list(
      rating = as.numeric(strsplit(fields[[1]], "[ /-]+")[[1]][[1]]),
      name = fields[[2]],
      comment = ""
    )
    if (length(fields) > 2)
      card$comment = fields[[3]]
    card
  })
  
  # convert to data frame
  cards <- as.data.frame(do.call(rbind, cards))
  
  cards
}



