var game = new Phaser.Game(1280, 720, Phaser.Auto, 'piratesStruggleGame');

game.state.add("introduction", introductionState);
game.state.add("topDown", topDownState);
game.state.add("fight", fightState);
game.state.add("gameOver", gameOverState);

game.state.start("gameOver");