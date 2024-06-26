class Player {
  static get VERSION() {
    return "0.30";
  }

  static async betRequest(gameState, bet) {
    const ourPlayer = Player.getOurPlayer(gameState);

    if (
      gameState.bet_index === 0 &&
      (gameState.dealer + 1) % 5 === gameState.in_action
    ) {
      console.log(
        `[Game: ${gameState.game_id}], round: ${gameState.round}, result: Small blind`
      );
      return bet(gameState.small_blind);
    }

    if (
      gameState.bet_index === 0 &&
      (gameState.dealer + 2) % 5 === gameState.in_action
    ) {
      console.log(
        `[Game: ${gameState.game_id}], round: ${gameState.round}, result: Big blind`
      );
      return bet(gameState.small_blind * 2);
    }

    const rank = await Player.getRank(gameState);

    console.log(
      `[Game: ${gameState.game_id}], round: ${gameState.round}, rank: ${rank}`
    );

    if (rank > 3) {
      console.log(
        `[Game: ${gameState.game_id}], round: ${gameState.round}, result: Raise X2`
      );
      return bet(
        gameState.current_buy_in - ourPlayer.bet + gameState.minimum_raise * 2
      );
    }

    const handRank = Player.getHandRank(ourPlayer);

    if (gameState.current_buy_in - ourPlayer.bet >= ourPlayer.stack / 2) {
      if (handRank === 0 || (rank > -1 && rank < 2)) {
        console.log(
          `[Game: ${gameState.game_id}], round: ${gameState.round}, result: Fold because of stack size`
        );
        return bet(0);
      }
    }

    if (rank === -1 && handRank === 1) {
      console.log(
        `[Game: ${gameState.game_id}], round: ${gameState.round}, result: Raise X2`
      );

      const highestStack = Player.getHighestStack(gameState);

      if (ourPlayer.stack > highestStack * 4) {
        console.log(
          `[Game: ${gameState.game_id}], round: ${gameState.round}, result: intimidation`
        );
        return bet(highestStack);
      }

      return bet(
        gameState.current_buy_in - ourPlayer.bet + gameState.minimum_raise * 2
      );
    }

    console.log(
      `[Game: ${gameState.game_id}], round: ${gameState.round}, result: Check/call`
    );
    return bet(gameState.current_buy_in - ourPlayer.bet);
  }

  static getHandRank(ourPlayer) {
    const cards = ourPlayer.hole_cards;
    const dealtPair = cards.map((card) => card.rank);

    const bigPocketPairs = [
      ["A", "A"],
      ["K", "K"],
      ["Q", "Q"],
      ["J", "J"],
      ["10", "10"],
    ];

    if (bigPocketPairs.includes(dealtPair)) {
      return 1;
    } else {
      return 0;
    }
  }

  static getHighestStack(gameState) {
    return gameState.players.reduce((acc, player) => {
      if (typeof player.stack === "number") {
        return Math.max(acc, player.stack);
      }

      return acc;
    }, 0);
  }

  static async getRank(gameState) {
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

    const rank = await fetch(`https://rainman.leanpoker.org/rank?${params}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(`Rank service: ${result.rank}`);
        return result.rank;
      });

    return rank;
  }

  static getOurPlayer(gameState) {
    return gameState.players[gameState.in_action];
  }

  static showdown(gameState) {
    console.log(`Showdown game state: ${JSON.stringify(gameState)}`);
  }
}

module.exports = Player;
