class Player {
  static get VERSION() {
    return "0.7";
  }

  static betRequest(gameState, bet) {
    const ourPlayer = Player.getOurPlayer(gameState);

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

    if (gameState.current_buy_in - ourPlayer.bet > ourPlayer.stack) {
      return bet(0);
    }

    return bet(gameState.current_buy_in - ourPlayer.bet);
  }

  static getOurPlayer(gameState) {
    return gameState.players[gameState.in_action];
  }

  static showdown(gameState) {
    console.log(`Showdown game state: ${JSON.stringify(gameState)}`);
  }
}

module.exports = Player;
