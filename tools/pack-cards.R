
library(dplyr)


cards <- readLines("tools/pack-cards.txt")
cards <- strsplit(cards, "\\n", fixed=TRUE)[[1]]
writeLines(cards, con = "tools/pack-cards.csv")

cards <- read.csv("tools/pack-cards.csv", header = FALSE, col.names = c("number", "rarity"))

common <- subset(cards, rarity == "common")
uncommon <- subset(cards, rarity == "uncommon")
rare <- subset(cards, rarity == "rare")
mythic <- subset(cards, rarity == "mythic")

common_counts <- common %>% 
  count(number) %>%
  rename(count = n)

uncommon_counts <- uncommon %>% 
  count(number) %>%
  rename(count = n)


rare_counts <- rare %>% 
  count(number) %>%
  rename(count = n)


mythic_counts <- mythic %>% 
  count(number) %>%
  rename(count = n)

hist(common$number)
hist(uncommon$number)
hist(rare$number)
