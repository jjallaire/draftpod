

download_set <- function(set, sets_dir = ".") {
 
  # download cards
  cards <- list()
  next_page_url <- sprintf("https://api.scryfall.com/cards/search?q=set:%s", set)
  while(TRUE) {
    result <- jsonlite::fromJSON(next_page_url, simplifyVector = FALSE)
    cards <- append(cards, result$data)
    if (result$has_more)
      next_page_url <- result$next_page
    else
      break
  }
  
  # download images
  set_dir <- file.path(sets_dir, set)
  dir.create(set_dir, showWarnings = FALSE, recursive = TRUE)
  for (card in cards) {
    card_image <- file.path(set_dir, paste0(card$id, ".png"))
    if (!file.exists(card_image))
      curl::curl_download(card$image_uris$normal, card_image)
  }
  
  # narrow to the fields we care about
  cards <- lapply(grn, function(card) {
    list(
      id = card$id,
      name = card$name,
      type_line = card$type_line,
      mana_cost = card$mana_cost,
      cmd = card$cmc,
      power = card$power,
      toughness = card$toughness,
      colors = card$colors,
      rarity = card$rarity
    )
  })
  
  # write as json
  set_dir <- file.path(sets_dir, set)
  dir.create(set_dir, showWarnings = FALSE, recursive = TRUE)
  set_json <- file.path(set_dir, "cards.json")
  jsonlite::write_json(cards, set_json)
  
  
}

download_set("grn", sets_dir = "~/projects/mtgdrafter/public/sets")
