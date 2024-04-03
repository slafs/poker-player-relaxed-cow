class Player {
  static get VERSION() {
    return "0.2";
  }

  static betRequest(gameState, bet) {
    bet(0);
  }

  static showdown(gameState) {}
}

module.exports = Player;
