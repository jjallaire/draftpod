

download_set <- function(set, sets_dir = ".", images = FALSE) {
 
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
  
  # narrow to the fields we care about
  cards <- lapply(cards, function(card) {
    
    # get image uri
    if (!is.null(card$image_uris)) {
      image_uri <- card$image_uris$png
    } else if (!is.null(card$card_faces)) {
      image_uri <- card$card_faces[[1]]$image_uris$png
    } else {
      str(card)
      stop("Unable to find image_uri for card")
    }
    
    # get mana_cost
    if (!is.null(card$mana_cost)) {
      mana_cost <- card$mana_cost
    } else if (!is.null(card$card_faces)) {
      mana_cost <- card$card_faces[[1]]$mana_cost
    } else {
      str(card)
      stop("Unable to find mana_cost for card")
    }
    
    list(
      id = card$id,
      name = card$name,
      image_uri = image_uri,
      type_line = card$type_line,
      mana_cost = mana_cost,
      cmc = card$cmc,
      colors = I(card$color_identity),
      rarity = card$rarity
    )
  })
  
  # write as json
  set_dir <- file.path(sets_dir, set)
  dir.create(set_dir, showWarnings = FALSE, recursive = TRUE)
  set_json <- file.path(set_dir, "cards.json")
  jsonlite::write_json(cards, set_json, auto_unbox = TRUE)
  
  # download images
  if (images) {
    for (card in cards) {
      card_image <- file.path(set_dir, paste0(card$id, ".png"))
      if (!file.exists(card_image)) {
        curl::curl_download(card$image_uri, card_image)
      }
    }
  }
  
}

download_set("grn", sets_dir = "~/projects/mtgdrafter/public/sets", images = TRUE)
