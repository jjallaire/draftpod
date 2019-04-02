

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

fix_collector_numbers(cube)

