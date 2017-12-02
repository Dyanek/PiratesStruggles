var myCaptain;
var myPirate1;
var myPirate2;
var enemyCaptain;
var enemyPirate1;
var enemyPirate2;

var hpMyCaptainTxt;
var hpMyPirate1Txt;
var hpMyPirate2Txt;
var hpEnemyCaptainTxt;
var hpEnemyPirate1Txt;
var hpEnemyPirate2Txt;

var textArea;
var textAreaBeatMap;
var textInstruction;

var selectEnemyCaptainTxt;
var selectEnemyPirate1Txt;
var selectEnemyPirate2Txt;

var blackScreen;
var whiteScreen;

var selectEnemyContours;

var actualPirate;
var playerTurn = true;
var doingAction = false;
var pirateSelected = false;
var hit = false;

var selectEnemyCursor;
var arrowAlreadyPressed = false;
var selectedEnemyPirate;

var fightState = {
    preload: function () {
        game.load.image("shipDeck", "./Assets/Images/shipDeck.jpg");
        game.load.spritesheet("myCaptain", "./Assets/Sprites/Pirates/myCaptain.png", 32, 48, 16);
        game.load.spritesheet("myPirate1", "./Assets/Sprites/Pirates/myPirate1.png", 32, 48, 16);
        game.load.spritesheet("myPirate2", "./Assets/Sprites/Pirates/myPirate2.png", 32, 48, 16);
        game.load.spritesheet("enemyCaptain", "./Assets/Sprites/Pirates/enemyCaptain.png", 33, 48, 16);
        game.load.spritesheet("enemyPirate1", "./Assets/Sprites/Pirates/enemyPirate1.png", 32, 48, 16);
        game.load.spritesheet("enemyPirate2", "./Assets/Sprites/Pirates/enemyPirate2.png", 32, 48, 16);
        game.load.bitmapFont("carrier_command", "./Assets/Fonts/carrier_command/carrier_command.png", "./Assets/Fonts/carrier_command/carrier_command.xml");
        game.load.image("blackScreen", "./Assets/Images/blackScreen.jpg");
        game.load.image("whiteScreen", "./Assets/Images/whiteScreen.jpg");
    },

    create: function () {
        var background = game.add.image(0, 0, "shipDeck");
        background.scale.setTo(1.835, 1.7);

        blackScreen = game.add.image(0, 0, "blackScreen");
        blackScreen.alpha = 0;

        CreatePirates();

        CreateTextArea();

        selectedEnemyPirate = enemyPirate1;
        selectEnemyContours = game.add.graphics(0, 0);
        CreateInstructions();

        actualPirate = myPirate1;

        selectEnemyCursor = game.input.keyboard.createCursorKeys();

        var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.add(function () { pirateSelected = true; }, this);

        whiteScreen = game.add.image(0, 0, "whiteScreen");
        whiteScreen.alpha = 0;
    },

    update: function () {
        if (!doingAction) {
            if (myPirate1.hp + myPirate2.hp + myCaptain.hp > 0 && enemyPirate1.hp + enemyPirate2.hp + enemyCaptain.hp > 0) {
                DetermineTurn(myPirate1, myPirate2, myCaptain)

                if (selectEnemyCursor.left.isDown || selectEnemyCursor.right.isDown)
                    SelectEnemyPirate();

                if (pirateSelected)
                    Attack();
            }
            else
                game.state.start("topDown");
        }
        else {
            if (playerTurn) {
                if (actualPirate.sprite.x > 740) {
                    actualPirate.sprite.body.velocity.x = 0;
                    actualPirate.sprite.animations.stop();
                    actualPirate.sprite.frame = 9;
                    actualPirate.sprite.x = 740;
                    if (!hit)
                        Hit(actualPirate, selectedEnemyPirate);
                }
                else if (actualPirate.sprite.x < actualPirate.initialXPos) {
                    actualPirate.sprite.body.velocity.x = 0;
                    actualPirate.sprite.animations.stop();
                    actualPirate.sprite.frame = 9;
                    actualPirate.sprite.x = actualPirate.initialXPos + 5;
                    selectEnemyContours.destroy();
                    hit = false;
                    doingAction = false;
                    pirateSelected = false;
                    playerTurn = false;
                    actualPirate.hasPlayed = true;
                    UpdateInstructions();

                    DetermineTurn(enemyPirate1, enemyPirate2, enemyCaptain);

                    Attack();
                }
            }
            else {
                if (actualPirate.sprite.x < 450) {
                    actualPirate.sprite.body.velocity.x = 0;
                    actualPirate.sprite.animations.stop();
                    actualPirate.sprite.frame = 5;
                    actualPirate.sprite.x = 450;
                    if (!hit)
                        Hit(actualPirate, RandomPirate())
                }
                else if (actualPirate.sprite.x > actualPirate.initialXPos) {
                    actualPirate.sprite.body.velocity.x = 0;
                    actualPirate.sprite.animations.stop();
                    actualPirate.sprite.frame = 5;
                    actualPirate.sprite.x = actualPirate.initialXPos - 5;
                    hit = false;
                    doingAction = false;
                    playerTurn = true;
                    actualPirate.hasPlayed = true;
                    UpdateInstructions();
                }
            }
        }
    }
}

function Attack() {
    doingAction = true;

    if (playerTurn) {
        actualPirate.sprite.body.velocity.x = 150;
        actualPirate.sprite.animations.play("right");
    }
    else {
        actualPirate.sprite.body.velocity.x = -150;
        actualPirate.sprite.animations.play("left");
    }
}

function Hit(attacker, attackedPirate) {
    selectedEnemyPirate = attackedPirate;
    ScreenEffects();
    game.time.events.add(Phaser.Timer.SECOND, AttackFinished, this);
    hit = true;
}

function ScreenEffects() {
    game.add.tween(blackScreen).to({ alpha: 1 }, 500, "Linear", true, 0, 0, true);
    game.add.tween(whiteScreen).to({ alpha: 1 }, 50, "Linear", true, 1000, 0, true);
}

function RandomPirate() {
    var tabOfPotentialVictims = [];

    if (myPirate1.hp > 0)
        tabOfPotentialVictims.push(myPirate1);
    if (myCaptain.hp > 0)
        tabOfPotentialVictims.push(myPirate2);
    if (myPirate2.hp > 0)
        tabOfPotentialVictims.push(myCaptain);

    return tabOfPotentialVictims[Math.floor(Math.random() * tabOfPotentialVictims.length)];
}

function AttackFinished() {
    if (playerTurn) {
        actualPirate.sprite.body.velocity.x = -150;
        actualPirate.sprite.animations.play("left");
    }
    else {
        actualPirate.sprite.body.velocity.x = 150;
        actualPirate.sprite.animations.play("right");
    }

    UpdateHp();
}

function UpdateHp() {
    selectedEnemyPirate.hp = selectedEnemyPirate.hp - 34;
    if (selectedEnemyPirate.hp <= 0) {
        selectedEnemyPirate.hp = 0;
        selectedEnemyPirate.sprite.destroy();
        selectedEnemyPirate.hpText.destroy();
    }
    else
        selectedEnemyPirate.hpText.text = "hp: " + selectedEnemyPirate.hp + "/100";
}

function DetermineTurn(pirate1, pirate2, pirate3) {
    if (!pirate1.hasPlayed && pirate1.hp > 0)
        actualPirate = pirate1;
    else if (!pirate2.hasPlayed && pirate2.hp > 0)
        actualPirate = pirate2;
    else if (!pirate3.hasPlayed && pirate3.hp > 0)
        actualPirate = pirate3;
    else {
        pirate1.hasPlayed = false;
        pirate2.hasPlayed = false;
        pirate3.hasPlayed = false;

        if (pirate1.hp > 0)
            actualPirate = pirate1;
        else if (pirate2.hp > 0)
            actualPirate = pirate2;
        else
            actualPirate = pirate3;
    }
}

function UpdateInstructions() {
    if (playerTurn) {
        textInstruction.destroy();
        textInstruction = game.add.bitmapText(400, 525, "carrier_command", "Select the pirate to attack", 15);

        if (enemyPirate1.hp > 0) {
            selectEnemyPirate1Txt = game.add.bitmapText(200, 600, "carrier_command", enemyPirate1.name, 15);
            selectedEnemyPirate = enemyPirate1;
        }
        if (enemyCaptain.hp > 0) {
            selectEnemyCaptainTxt = game.add.bitmapText(600, 600, "carrier_command", enemyCaptain.name, 15);
            selectedEnemyPirate = enemyCaptain;
        }
        if (enemyPirate2.hp > 0) {
            selectEnemyPirate2Txt = game.add.bitmapText(950, 600, "carrier_command", enemyPirate2.name, 15);
            selectedEnemyPirate = enemyPirate2;
        }
    }
    else {
        textInstruction.destroy();
        textInstruction = game.add.bitmapText(475, 575, "carrier_command", "The enemy is playing", 15);

        selectEnemyPirate1Txt.destroy();
        selectEnemyCaptainTxt.destroy();
        selectEnemyPirate2Txt.destroy();
    }
}

function SelectEnemyPirate() {
    if (!arrowAlreadyPressed) {
        arrowAlreadyPressed = true;
        game.time.events.add(Phaser.Timer.SECOND * 0.25, function () { arrowAlreadyPressed = false; }, this);

        if (enemyPirate1.hp > 0 && enemyCaptain.hp > 0 && enemyPirate2.hp > 0) {
            if (selectEnemyCursor.right.isDown && selectedEnemyPirate == enemyPirate1)
                selectedEnemyPirate = enemyCaptain;
            else if (selectEnemyCursor.right.isDown && selectedEnemyPirate == enemyCaptain)
                selectedEnemyPirate = enemyPirate2;
            else if (selectEnemyCursor.left.isDown && selectedEnemyPirate == enemyPirate2)
                selectedEnemyPirate = enemyCaptain;
            else if (selectEnemyCursor.left.isDown && selectedEnemyPirate == enemyCaptain)
                selectedEnemyPirate = enemyPirate1;
        }
        else if (enemyPirate1.hp > 0 && enemyCaptain.hp > 0) {
            if (selectEnemyCursor.right.isDown && selectedEnemyPirate == enemyPirate1)
                selectedEnemyPirate = enemyCaptain;
            else if (selectEnemyCursor.left.isDown && selectedEnemyPirate == enemyCaptain)
                selectedEnemyPirate = enemyPirate1;
        }
        else if (enemyPirate1.hp > 0 && enemyPirate2.hp > 0) {
            if (selectEnemyCursor.right.isDown && selectedEnemyPirate == enemyPirate1)
                selectedEnemyPirate = enemyPirate2;
            else if (selectEnemyCursor.left.isDown && selectedEnemyPirate == enemyPirate2)
                selectedEnemyPirate = enemyPirate1;
        }
        else if (enemyCaptain.hp > 0 && enemyPirate2.hp > 0) {
            if (selectEnemyCursor.right.isDown && selectedEnemyPirate == enemyCaptain)
                selectedEnemyPirate = enemyPirate2;
            else if (selectEnemyCursor.left.isDown && selectedEnemyPirate == enemyPirate2)
                selectedEnemyPirate = enemyCaptain;
        }

        selectEnemyContours.destroy();
        selectEnemyContours = game.add.graphics(0, 0);
        SelectEnemyPirateContours();
    }
}

function SelectEnemyPirateContours() {
    if (selectedEnemyPirate == enemyPirate1)
        DrawContours(selectEnemyContours, 830, 330, 65, 110, 0xff0000, 195, 595, selectEnemyPirate1Txt);
    else if (selectedEnemyPirate == enemyCaptain)
        DrawContours(selectEnemyContours, 950, 364, 65, 110, 0xff0000, 595, 595, selectEnemyCaptainTxt);
    else
        DrawContours(selectEnemyContours, 860, 395, 65, 110, 0xff0000, 945, 595, selectEnemyPirate2Txt);
}

function DrawContours(graphicsObj, x, y, width, height, color, nameX, nameY, name) {
    graphicsObj.lineStyle(2, color);
    graphicsObj.drawRect(x, y, width, height);

    if (nameX != null) {
        graphicsObj.lineStyle(2, 0xffffff);
        graphicsObj.drawRect(nameX, nameY, name.width + 10, name.height + 10);
    }
}

function CreatePirates() {
    myPirate1 = { name: "Pirate 1", hp: 100, hpText: CreateHpText(350, 315), sprite: PlaceCharacter("myPirate1", true, 365, 320), initialXPos: 365, hasPlayed: false };
    myCaptain = { name: "Captain", hp: 100, hpText: CreateHpText(250, 475), sprite: PlaceCharacter("myCaptain", true, 265, 355), initialXPos: 265, hasPlayed: false };
    myPirate2 = { name: "Pirate 2", hp: 100, hpText: CreateHpText(370, 505), sprite: PlaceCharacter("myPirate2", true, 385, 390), initialXPos: 385, hasPlayed: false };

    enemyPirate1 = { name: "Pirate 1", hp: 100, hpText: CreateHpText(820, 315), sprite: PlaceCharacter("enemyPirate1", false, 825, 320), initialXPos: 825, hasPlayed: false };
    enemyCaptain = { name: "Captain", hp: 100, hpText: CreateHpText(940, 475), sprite: PlaceCharacter("enemyCaptain", false, 945, 355), initialXPos: 945, hasPlayed: false };
    enemyPirate2 = { name: "Pirate 2", hp: 100, hpText: CreateHpText(860, 505), sprite: PlaceCharacter("enemyPirate2", false, 855, 390), initialXPos: 855, hasPlayed: false };

    game.physics.enable([myCaptain.sprite, myPirate1.sprite, myPirate2.sprite, enemyCaptain.sprite, enemyPirate1.sprite, enemyPirate2.sprite], Phaser.Physics.ARCADE);

    AddAnimations(myCaptain.sprite);
    AddAnimations(myPirate1.sprite);
    AddAnimations(myPirate2.sprite);

    AddAnimations(enemyCaptain.sprite);
    AddAnimations(enemyPirate1.sprite);
    AddAnimations(enemyPirate2.sprite);
}

function AddAnimations(sprite) {
    sprite.animations.add("right", [8, 9, 10, 11], 10, true);
    sprite.animations.add("left", [4, 5, 6, 7], 10, true);
}

function PlaceCharacter(charName, ally, posX, posY) {
    var charVar = game.add.sprite(posX, posY, charName);
    charVar.scale.set(2.5);

    if (ally)
        charVar.frame = 9;
    else
        charVar.frame = 5;

    return charVar;
}

function CreateHpText(x, y, hp) {
    var text = game.add.bitmapText(x, y, "carrier_command", "hp:" + 100 + "/100", 8);
    text.tint = 0x000000;

    return text;
}

function CreateInstructions() {
    textInstruction = game.add.bitmapText(400, 525, "carrier_command", "Select the pirate to attack", 15);

    selectEnemyPirate1Txt = game.add.bitmapText(200, 600, "carrier_command", enemyPirate1.name, 15);
    selectEnemyCaptainTxt = game.add.bitmapText(600, 600, "carrier_command", enemyCaptain.name, 15);
    selectEnemyPirate2Txt = game.add.bitmapText(950, 600, "carrier_command", enemyPirate2.name, 15);

    SelectEnemyPirateContours();
}

function CreateTextArea() {
    textArea = new Phaser.Rectangle(0, 515, 1280, 205);

    textAreaBeatMap = game.add.bitmapData(1280, 720);
    textAreaBeatMap.rect(textArea.x, textArea.y, textArea.width, textArea.height, "#000000");
    textAreaBeatMap.addToWorld();
}