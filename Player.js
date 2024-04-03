class Player {
  static get VERSION() {
    return "0.8";
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

    const rank = Player.getRank(gameState);

    if (rank > 3) {
      return bet(
        gameState.current_buy_in - ourPlayer.bet + gameState.minimum_raise * 2
      );
    }

    if (gameState.current_buy_in - ourPlayer.bet > ourPlayer.stack) {
      return bet(0);
    }

    return bet(gameState.current_buy_in - ourPlayer.bet);
  }

  static getRank(gameState) {
    const cards = [
      ...gameState.community_cards,
      ...Player.getOurPlayer(gameState).hole_cards,
    ];

    if (cards.length < 5) {
      return -1;
    }

    const params = new URLSearchParams({
      cards: JSON.stringify(cards),
    });

    fetch(`https://rainman.leanpoker.org/rank?${params}`).then((response) => {
      const res = response.json();
      return res.rank;
    });
  }

  static getOurPlayer(gameState) {
    return gameState.players[gameState.in_action];
  }

  static showdown(gameState) {
    console.log(`Showdown game state: ${JSON.stringify(gameState)}`);
  }
}

module.exports = Player;
