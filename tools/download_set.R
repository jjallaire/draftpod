

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
      image_uris <- card$image_uris$normal
    } else if (!is.null(card$card_faces)) {
      image_uris <- lapply(card$card_faces, function(face) face$image_uris$normal)
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
      id = card$multiverse_ids[[1]],
      name = card$name,
      image_uris = I(image_uris),
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
        curl::curl_download(card$image_uris[[1]], card_image)
        if (length(card$image_uris) > 1)
          curl::curl_download(card$image_uris[[2]], 
                              file.path(set_dir, paste0(card$id, "-back.png")))
      }
    }
  }
  
  # download set icon
  set_info <- jsonlite::fromJSON(paste0("https://api.scryfall.com/sets/", set))
  set_icon <- file.path(set_dir, "icon.svg")
  curl::curl_download(set_info$icon_svg_uri, set_icon)
  
}

download_set("m19", sets_dir = "~/projects/draftpod/public/sets", images = TRUE)
