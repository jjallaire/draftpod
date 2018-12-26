
library(urltools)

download_set <- function(set, 
                         sets_dir = "public/sets", 
                         ratings_dir = "tools/ratings", 
                         download_images = TRUE) {
  
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
  
  # read ratings
  if (!is.null(ratings_dir))
    ratings <- read.csv(file.path(ratings_dir, paste0(set, ".csv")))
  else
    ratings <- NULL
  
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
    
    # get id
    multiverse_ids <- card$multiverse_ids
    
    # convert collector_number to integer
    collector_number <- as.integer(gsub("[A-Za-z]+", "", card$collector_number))
    
    # get rating
    if (!is.null(ratings)) {
      ratings_for_id <- subset(ratings, id == multiverse_ids[[1]])
      if (nrow(ratings_for_id) > 0) {
        rating <- ratings_for_id$rating
      } else {
        rating <- 0
      }
    } else {
      rating <- NULL
    }
    
    # see if we need to extract the cmc from the oracle_text
    # for Unstable
    cmc <- card$cmc
    if (set == "ust") {
      if (identical(as.integer(cmc), 0L)) {
        m <- regexpr("Augment [{}0-9A-Z]+", card$oracle_text)
        augment <- regmatches(card$oracle_text, m)
        if (length(augment) > 0) {
          augment <- sub("Augment ", "", augment)
          mana_cost <- augment
          augment <- gsub("[{}]", "", augment)
          number <- gsub("[A-Z]", "", augment)
          if (nzchar(number))
            number <- as.integer(number)
          else
            number <- 0L
          letters <- nchar(gsub("[0-9]", "", augment))
          cmc <- number + letters
        }
      }
    }
    
    list(
      id = multiverse_ids[[1]],
      name = card$name,
      collector_number = collector_number,
      multiverse_ids = I(multiverse_ids),
      image_uris = I(image_uris),
      type_line = card$type_line,
      mana_cost = mana_cost,
      cmc = cmc,
      colors = I(card$color_identity),
      rarity = card$rarity,
      rating = rating
    )
  })
  
  # filter out collector number > threshold
  max_collector_number <- switch(set,
                                 grn = 259,
                                 m19 = 280,
                                 dom = 269,
                                 ust = 216,
                                 mma = 229,
                                 isd = 249
  )
  cards <- Filter(function(card) card$collector_number <= max_collector_number, cards)
  
  
  # write as json
  set_dir <- file.path(sets_dir, set)
  dir.create(set_dir, showWarnings = FALSE, recursive = TRUE)
  set_json <- file.path(set_dir, "cards.json")
  jsonlite::write_json(cards, set_json, auto_unbox = TRUE)
  
  # download images
  if (download_images) {
    card_image_dir <- normalizePath(file.path(sets_dir, "..", "images", "cards"), mustWork = FALSE)
    if (!dir.exists(card_image_dir))
      dir.create(card_image_dir, recursive = TRUE)
    for (card in cards) {
      for (i in 1:length(card$image_uris)) {
        image_uri <- card$image_uris[[i]]
        file_ext <- tools::file_ext(url_parse(image_uri)$path)
        image_path <- file.path(card_image_dir, paste0(card$multiverse_ids[[i]], ".", file_ext))
        if (!file.exists(image_path)) {
          curl::curl_download(card$image_uris[[i]], image_path)
        }
      }  
    }
  }
  
  # download set icon
  set_info <- jsonlite::fromJSON(paste0("https://api.scryfall.com/sets/", set))
  set_icon <- file.path(set_dir, "icon.svg")
  curl::curl_download(set_info$icon_svg_uri, set_icon)
  
}


