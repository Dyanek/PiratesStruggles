var introductionState = {
    preload: function () {
        game.load.image("cover", "./Assets/Images/cover.png");
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        var cover = game.add.image(0, 0, "cover");
        cover.scale.setTo(0.7, 0.7);

        var title = game.add.text(0, 100, "Pirates' struggles",
            { font: "65px UnifrakturMaguntia", fill: "#000000", boundsAlignH: "center", backgroundColor: "#ffa64d" });
        title.setTextBounds(0, 0, 1280, 720);

        var pressAnyKey = game.add.text(0, 600, "Press any key",
            { font: "40px Calibri", fill: "#000000", boundsAlignH: "center", backgroundColor: "#ffa64d" });
        pressAnyKey.setTextBounds(0, 0, 1280, 720);
    },

    update: function () {
        game.input.keyboard.onPressCallback = function () {
            game.state.start("topDown");
        };
    }
};