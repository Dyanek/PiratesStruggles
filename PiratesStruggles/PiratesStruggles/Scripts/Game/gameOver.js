var gameOverState = {
    create: function () {
        var title = game.add.text(0, 250, "Game Over",
            { font: "65px UnifrakturMaguntia", fill: "#ffffff", boundsAlignH: "center" });
        title.setTextBounds(0, 0, 1280, 720);

        var pressAnyKey = game.add.text(0, 350, "Press any key to restart",
            { font: "40px Calibri", fill: "#ffffff", boundsAlignH: "center" });
        pressAnyKey.setTextBounds(0, 0, 1280, 720);
    },

    update: function () {
        game.input.keyboard.onPressCallback = function () {
            game.state.start("topDown");
        };
    }
};