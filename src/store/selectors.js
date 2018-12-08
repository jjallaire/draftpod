

export function countCardpoolCards(cardpool_cards) {
  return cardpool_cards.reduce((total, card) => total + card.quantity, 0);
}
