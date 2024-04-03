class Player {
  static get VERSION() {
    return "0.5";
  }

  static betRequest(gameState, bet) {
    if (
      gameState.bet_index === 0 &&
      (gameState.dealer + 1) % 5 === gameState.in_action
    ) {
      return bet(gameState.small_blind);
    }

    if (
      gameState.bet_index === 0 &&
      (gameState.dealer + 2) % 5 === gameState.in_action
    ) {
      return bet(gameState.small_blind * 2);
    }

    return bet(gameState.current_buy_in - gameState.players[gameState.in_action].bet);
  }

  static showdown(gameState) {
    console.log(`Showdown game state: ${JSON.stringify(gameState)}`);
  }
}

module.exports = Player;
