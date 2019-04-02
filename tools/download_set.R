
library(urltools)



download_set <- function(set, 
                         sets_dir = "public/sets", 
                         ratings_dir = "tools/ratings", 
                         download_images = TRUE) {
  # get cards
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
  
  # download cards
  download_cards(cards, set, sets_dir, ratings_dir, download_images)
}
  
download_cards <- function(cards,
                           set,
                           sets_dir = "public/sets",
                           ratings_dir = "tools/ratings",
                           download_images = TRUE) {    
 
  # if cards are a vector of integers then download their json from scryfall
  if (is.integer(cards)) {
    cards <- lapply(cards, function(id) {
      jsonlite::fromJSON(sprintf(
        "https://api.scryfall.com/cards/multiverse/%s", id
      ))
    })
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

    # if there is no multiverse id then use a baseline for the set + collector number
    if (length(multiverse_ids) == 0) {
      baseline <- switch(set,
        rna = 500000,
      )
      multiverse_ids <- list(baseline + collector_number)
    }
    
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
      layout=card$layout,
      type_line = card$type_line,
      mana_cost = mana_cost,
      cmc = cmc,
      colors = I(card$color_identity),
      rarity = card$rarity,
      rating = rating,
      set = card$set
    )
  })
  
  # if this is a cube then we need to fixup the collector numbers
  if (startsWith(set, "cube_"))
    cards <- fix_collector_numbers(cards)
  
  # filter out collector number > threshold
  max_collector_number <- switch(set,
                                 rna = 264,
                                 grn = 264,
                                 m19 = 280,
                                 dom = 269,
                                 xln = 279,
                                 rix = 196,
                                 
                                 # NOTE: need to reconfirm that these have the
                                 # right numbers for inclusion of basics
                                 # (kld does, aer appears to have no basics!)
                                 kld = 264,
                                 aer = 184, 
                                 akh = 269,
                                 hou = 199,
                                 `cube_gnt` = 1000)
  
  cards <- Filter(function(card) card$collector_number <= max_collector_number, cards)
  
  
  # write as json
  set_dir <- file.path(sets_dir, set)
  dir.create(set_dir, showWarnings = FALSE, recursive = TRUE)
  set_json <- file.path(set_dir, "cards.json")
  jsonlite::write_json(cards, set_json, auto_unbox = TRUE, pretty = TRUE)
  
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
  
}

fix_collector_numbers <- function(cube) {
  
  # function to extract colors from mana cost
  card_colors <- function(mana_cost) {
    color_chars <- gsub('[^WUBGR]', '', mana_cost)
    unique(strsplit(color_chars, NULL, fixed = TRUE)[[1]])
  }
  
  # first tag each card with it's color_bin
  cube <- lapply(cube, function(card) {
    
    # determine rarity bin
    rarity_bin <- NULL
    if (card$rarity == "common")
      rarity_bin <- 1
    else if (card$rarity == "uncommon")
      rarity_bin <- 2
    else if (card$rarity == "rare")
      rarity_bin <- 3
    else if (card$rarity == "mythic")
      rarity_bin <- 4
    else
      stop("Unexpected rarity: ", card$rarity)
    card$rarity_bin <- rarity_bin
    
    # determine color bin
    color_bin <- NULL
    colors <- card_colors(card$mana_cost)
    if (length(colors) == 0)
      color_bin <- 6
    else if (length(colors) > 1)
      color_bin <- 7
    else if (colors == 'W')
      color_bin <- 1
    else if (colors == 'U')
      color_bin <- 2
    else if (colors == 'B')
      color_bin <- 3
    else if (colors == 'R')
      color_bin <- 4
    else if (colors == 'G')
      color_bin <- 5
    else
      stop("Unexpected colors: ", colors)
    card$color_bin <- color_bin
    
    # return card
    card
  })
  
  # now sort by rarity, color, name
  cube_order <- order(sapply(cube, function(card) card$rarity_bin), 
                      sapply(cube, function(card) card$color_bin),
                      sapply(cube, function(card) card$name),
                      decreasing = c(FALSE, FALSE, FALSE),
                      method = "radix")
  
  # re-order the cube
  cube <- cube[cube_order]
  
  # fixup collector_number and remove temporary fields
  for (i in 1:length(cube)) {
    cube[[i]]$collector_number <- i
    cube[[i]]$rarity_bin <- NULL
    cube[[i]]$color_bin <- NULL
  }
  
  
  # return the cube
  cube
  
}


