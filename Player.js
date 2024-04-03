class Player {
  static get VERSION() {
    return "0.2";
  }

  static betRequest(gameState, bet) {
    bet(gameState.current_buy_in);
  }

  static showdown(gameState) {}
}

module.exports = Player;
