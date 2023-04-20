
library(urltools)



download_set <- function(set, 
                         sets_dir = "public/sets", 
                         ratings_dir = "tools/ratings", 
                         download_images = TRUE) {
  # get cards
  cards <- download_set_cards(set)

  # download cards
  download_cards(cards, set[[1]], sets_dir, ratings_dir, download_images)
}

download_set_cards <- function(set) {
  cards <- list()
  for (s in set) {
    next_page_url <- sprintf("https://api.scryfall.com/cards/search?q=set:%s", s)
    while(TRUE) {
      result <- jsonlite::fromJSON(next_page_url, simplifyVector = FALSE)
      cards <- append(cards, result$data)
      if (result$has_more)
        next_page_url <- result$next_page
      else
        break
    }
  }
  cards
}

save_set_json <- function(set, file = "cards.json") {
  cards <- download_set_cards(set)
  jsonlite::write_json(cards, file)
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
  
  # read ratings and latent colors
  if (!is.null(ratings_dir)) {
    ratings <- read.csv(file.path(ratings_dir, paste0(set, ".csv")))
    latent_csv <- file.path(ratings_dir, paste0(set, "-latent.csv"))
    if (file.exists(latent_csv))
      latent_colors <- readr::read_csv(latent_csv)
    else
      latent_colors <- NULL
  } else {
    ratings <- NULL
    latent_colors <- NULL
  }
 

  # narrow to the fields we care about
  cards <- lapply(cards, function(card) {
    
    # get mana_cost
    if (!is.null(card$mana_cost)) {
      mana_cost <- card$mana_cost
    } else if (!is.null(card$card_faces)) {
      if (is.data.frame(card$card_faces)) {
        mana_cost <- card$card_faces[1,]$mana_cost
      } else {
        mana_cost <- card$card_faces[[1]]$mana_cost
      }
    } else {
      str(card)
      stop("Unable to find mana_cost for card")
    }
    
    # get id
    if (set == "znr" || set == "afr" || set == "mid" || set == "vow" || set == "neo" || set == "dmu" || set == "one" || set == "bro" || set == "mom") {
      multiverse_ids <- list(card$tcgplayer_id + 1000000)
    } else if (set == "khm") {
      if (is.null(card$tcgplayer_id)) {
        if (identical(card$name, "Warhorn Blast")) {
          card$tcgplayer_id <- 230884
        }
        else if (identical(card$name, "Immersturm Raider")) {
          card$tcgplayer_id <- 230866
        } else {
          cat("No ID for ", card$name, "\n")
        }
      }
      multiverse_ids <- list(card$tcgplayer_id + 1000000)
    } else if (set != "stx" && set != "sta" && set != "snc") {
      multiverse_ids <- card$multiverse_ids
    } else {
      multiverse_ids <- list()
    }
    
    # convert collector_number to integer
    collector_number <- as.integer(gsub("[A-Za-z]+", "", card$collector_number))
    
    # fix collector numbers for znr lands (map higher collector numbers
    # to ones within the valid range)
    if (set == "znr") {
      # plains
      if (collector_number == 380) {
        collector_number <- 266
      # island
      } else if (collector_number == 381) {
        collector_number <- 269
      # swamp
      } else if (collector_number == 382) {
        collector_number <- 272
      # mountain
      } else if (collector_number == 383) {
        collector_number <- 275
      # forest
      } else if (collector_number == 384) {
        collector_number <- 278
      }
    }
    
    # if there is no multiverse id then use a baseline for the set + collector number
    if (length(multiverse_ids) == 0) {
      
      if (!is.null(card$arena_id)) {
        multiverse_ids <- list(card$arena_id)
      } else {
        baseline <- switch(card$set,
                           rna = 500000,
                           war = 460927,
                           mh1 = 463949,
                           eld = 700000,
                           thb = 476251,
                           iko = 800000,
                           m21 = 485323,
                           `2xm` = 489673,
                           khm = 900000,
                           stx = 910000,
                           sta = 920000,
                           mid = 930000,
                           vow = 940000,
                           snc = 950000,
        )
        multiverse_ids <- list(baseline + collector_number)
      }
    }
    
    # get image uri
    alt_image_uris <- list(
      # AKR split cards don't show oracle text, so use the original print images
      `74009` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/2/c/2c25b8ef-6331-49df-9457-b8b4e44da2c9.jpg?1562793920",
      `74013` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/5/15b0f214-8668-4921-88ba-7ccf38c9f770.jpg?1562790415",
      `74016` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/c/1c1ead90-10d8-4217-80e4-6f40320c5569.jpg?1562791309",
      `74019` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/c/6/c6f61e2b-e93b-4dda-95cf-9d0ff198c0a6.jpg?1549941949",
      `74022` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/5/c/5cf5c549-1e2a-4c47-baf7-e608661b3088.jpg?1549941724",
      `74025` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/7/7/7713ba59-dd4c-4b49-93a7-292728df86b8.jpg?1562803886",
      `74029` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/b/9/b9623c8c-01b4-4e8f-a5b9-eeea408ec027.jpg?1549941877",
      `74032` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/d/9/d998db65-8785-4ee9-940e-fa9ab62e180f.jpg?1562816967",
      `74035` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/0/3/0383401f-d453-4e8f-82d2-5c016acc2591.jpg?1562787667",
      `74039` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/f/e/fe1a4032-efbb-4f72-9181-994b2b35f598.jpg?1549941957",
      `74044` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/f/9/f928e8e8-aa20-402c-85bd-59106e9b9cc7.jpg?1562820622",
      `74054` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/5/1/517b32e4-4b34-431f-8f3b-98a6cffc245a.jpg?1549941725",
      `74057` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/f/5/f59ea6f6-2dff-4e58-9166-57cac03f1d0a.jpg?15499418759",
      `74060` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/1/11d84618-aca9-47dc-ae73-36a2c29f584c.jpg?1549941948",
      `74063` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/1/c/1ca644e3-4fb3-4d38-b714-e3d7459bd8b9.jpg?1562791344",
      `74066` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722",
      `74069` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/0/5/054b07d8-99ae-430b-8e54-f9601fa572e7.jpg?1562787788",
      `74079` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/6/4/6431d464-1f2b-42c4-ad38-67b7d0984080.jpg?15499418688",
      `74082` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/9/c/9c6f5433-57cc-4cb3-8621-2575fcbff392.jpg?1549941629",
      `74085` = "https://c1.scryfall.com/file/scryfall-cards/normal/front/7/6/76f21f0b-aaa5-4677-8398-cef98c6fac2a.jpg?1562803878"
    )
    alt_image_uri <- unname(unlist(alt_image_uris[as.character(multiverse_ids[[1]])]))
    
    if (!is.null(alt_image_uri)) {
      cat("Using alt image URI for ", card$name, "\n", sep = "")
      image_uris <- alt_image_uri
      highres_image_uris <- alt_image_uri
      card$layout <- "normal"
    } else if (!is.null(card$image_uris)) {
      image_uris <- card$image_uris$normal
      highres_image_uris <- card$image_uris$png
    } else if (!is.null(card$card_faces)) {
      if (is.data.frame(card$card_faces) && is.data.frame(card$card_faces$image_uris)) {
        image_uris <- card$card_faces$image_uris$normal
        highres_image_uris <- card$card_faces$image_uris$png
      } else {
        image_uris <- lapply(card$card_faces, function(face) face$image_uris$normal)
        highres_image_uris <- lapply(card$card_faces, function(face) face$image_uris$png)
      }
    } else {
      str(card)
      stop("Unable to find image_uri for card")
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
    
    # get latent color
    if (!is.null(latent_colors)) {
      latent_colors_for_id <- subset(latent_colors, id == multiverse_ids[[1]])
      if (nrow(latent_colors_for_id) > 0) {
        latent_color <- latent_colors_for_id$latent_color
      } else {
        latent_color <- ""
      }
    } else {
      latent_color <- ""
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
    
    # throw in an extra mutliverse id for gatherer khm & stx modal double faced cards 
    if ((set == "khm" || set == "stx" || set == "mid" || set == "vow" || set == "neo" || set == "snc" || set == "mom") && length(image_uris) == 2) {
      multiverse_ids[[2]] <- multiverse_ids[[1]] + 1000
    }
    
    list(
      id = multiverse_ids[[1]],
      name = card$name,
      collector_number = collector_number,
      multiverse_ids = I(multiverse_ids),
      image_uris = I(image_uris),
      highres_image_uris = I(highres_image_uris),
      layout=card$layout,
      type_line = card$type_line,
      oracle_text = card$oracle_text,
      mana_cost = mana_cost,
      cmc = cmc,
      colors = I(card$color_identity),
      latent_color = latent_color,
      rarity = card$rarity,
      rating = rating,
      set = card$set
    )
  })
  
  # if this is a cube then we need to fixup the collector numbers
  if (startsWith(set, "cube_"))
    cards <- fix_collector_numbers(cards)
  
  
  # filter out collector number > threshold
  max_collector_numbers <- list(
    rna = 264,
    grn = 264,
    m19 = 280,
    dom = 269,
    xln = 279,
    rix = 196,
    war = 264,
    m20 = 280,
    mh1 = 254,
    ust = 216,
    kld = 264,
    aer = 184, 
    akh = 269,
    hou = 199,
    ktk = 269,
    isd = 249,
    eld = 269,
    thb = 254,
    iko = 274,
    m21 = 274,
    `2xm` = 332,
    akr = 339,
    znr = 280,
    klr = 301,
    khm = 398,
    stx = 375,
    sta = 63,
    afr = 281,
    mid = 277,
    vow = 402,
    neo = 302,
    dmu = 281,
    bro = 287,
    snc = 281,
    one = 276,
    mom = 281,
    `cube_gnt` = 1000,
    `cube_vintage_2019` = 1000,
    `cube_vintage_2020` = 1000
  )
  
  # uses many sets we don't cover here
  if (!startsWith(set, "cube_vintage"))
    cards <- Filter(function(card)  {
      include <- card$collector_number <= max_collector_numbers[[card$set]]
      include
    }, cards)
  
  # filter out special cards from khm and stx
  if (set == "khm") {
    cards <- Filter(function(card) {
      card$collector_number <= 285 || card$collector_number >= 394
    }, cards)
  }
  
  if (set == "sta") {
    cards <- Filter(function(card) {
      card$collector_number <= 275 || card$collector_number >= 366
    }, cards)
  }
  
  # filter out cards with no ids
  cards <- Filter(function(card) length(card$id) > 0, cards)
  
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
      images <- length(card$image_uris)
      if (set == "znr")
        images <- 1
      for (i in 1:images) {
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
    
    is_land <- grepl("Land", card$type_line, fixed = TRUE) && 
               !grepl("//", card$type_line, fixed = TRUE)
    
    is_artifact <-grepl("Artifact", card$type_line, fixed = TRUE)
    
    # determine color bin
    color_bin <- NULL
    colors <- card_colors(card$mana_cost)
    if ((length(colors) == 0) && !is_artifact) { # ensure that e.g. Mox aren't
                                                 # treated as if they have color
      colors <- card$colors
    }
    
    if (is_land)
      color_bin <- 8
    else if (length(colors) == 0)
      color_bin <- 7
    else if (length(colors) > 1)
      color_bin <- 6
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
  cube_order <- order(
    # sapply(cube, function(card) card$rarity_bin), 
    sapply(cube, function(card) card$color_bin),
    sapply(cube, function(card) card$name),
    decreasing = c(FALSE, FALSE),
    method = "radix"
  )
  
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


