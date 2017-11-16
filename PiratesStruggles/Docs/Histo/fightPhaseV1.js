var myCaptain;
var myPirate1;
var myPirate2;
var enemyCaptain;
var enemyPirate1;
var enemyPirate2;

var myCaptainObj = { hp: 100, alreadyAttacked: false };
var myPirate1Obj = { hp: 100, alreadyAttacked: false };
var myPirate2Obj = { hp: 100, alreadyAttacked: false };
var enemyCaptainObj = { hp: 100, alreadyAttacked: false };
var enemyPirate1Obj = { hp: 100, alreadyAttacked: false };
var enemyPirate2Obj = { hp: 100, alreadyAttacked: false };

var hpMyCaptainTxt;
var hpMyPirate1Txt;
var hpMyPirate2Txt;
var hpEnemyCaptainTxt;
var hpEnemyPirate1Txt;
var hpEnemyPirate2Txt;

var allyPirateContour;
var enemyPirateContour;

var bmd;
var bigRectangle;
var selectPirateTxt;
var selectPirateCaptainTxt;
var selectPirate1Txt;
var selectPirate2Txt;
var selectedEnemy = "Pirate1";
var cursor;
var keyAlreadyPressed = false;

var attacking = false;
var blackScreen;
var whiteScreen;
var doingAction = false;

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

        PlaceCharactersAndHp();

        game.physics.enable([myCaptain, myPirate1, myPirate2, enemyCaptain, enemyPirate1, enemyPirate2], Phaser.Physics.ARCADE);

        PlayerActions();

        allyPirateContour = game.add.graphics(0, 0);
        DrawContours(allyPirateContour, 365, 325, 65, 110, 0x0000ff);

        enemyPirateContour = game.add.graphics(0, 0);
        SelectAction();
        keyAlreadyPressed = false;

        cursor = game.input.keyboard.createCursorKeys();

        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        keyEnter.onDown.add(Attack, this);

        whiteScreen = game.add.image(0, 0, "whiteScreen");
        whiteScreen.alpha = 0;
    },

    update: function () {
        if (cursor.right.isDown || cursor.left.isDown)
            SelectAction();

        AttackAnimation(myPirate1, 800, true);

        ReturnedToPosition();

        if (!doingAction)
            EnemyPirateAttacks();

        AttackAnimation(limit, true);
    }
};

function EnemyPirateAttacks() {
    doingAction = true;

    var tabOfPotentialVictims = [];
    enemyPirateContour.destroy();

    if (myPirate1Obj.hp > 0)
        tabOfPotentialVictims.push(1);
    if (myCaptainObj.hp > 0)
        tabOfPotentialVictims.push(2);
    if (myPirate2Obj.hp > 0)
        tabOfPotentialVictims.push(3);

    var attackedPirate = tabOfPotentialVictims[Math.floor(Math.random() * tabOfPotentialVictims.length)];

    EnemyPirateAttacksAnimation(attackedPirate);
}

function EnemyPirateAttacksAnimation(attackedPirate) {
    attacking = true;

    if (enemyPirate1Obj.hp > 0 && !enemyPirate1Obj.alreadyAttacked)
        enemyPirate1.body.velocity.x = -150;
    else if (enemyPirate2Obj.hp > 0 && !enemyPirate2Obj.alreadyAttacked)
        enemyPirate2.body.velocity.x = -150;
    else if (enemyCaptainObj.hp > 0 && !enemyCaptainObj.alreadyAttacked)
        enemyCaptain.body.velocity.x = -150;
    else {
        doingAction = false;
        if (enemyPirate1Obj.hp == 0 && enemyPirate2Obj.hp == 0 && enemyCaptainObj.hp == 0)
            game.state.start("topDown");
        else {
            enemyPirate1Obj.alreadyAttacked = false;
            enemyPirate2Obj.alreadyAttacked = false;
            enemyCaptainObj.alreadyAttacked = false;
        }
    }
}

function AttackAnimation(sprite, limit, isSuperior) {
    if (attacking) {
        allyPirateContour.destroy();
        enemyPirateContour.destroy();
        if ((myPirate1.world.x > limit && isSuperior) || (myPirate1.world.x < limit && !isSuperior)) {
            attacking = false;
            myPirate1.body.velocity.x = 0;
            myPirate1.animations.stop();
            myPirate1.frame = 9;

            game.add.tween(blackScreen).to({ alpha: 1 }, 500, "Linear", true, 0, 0, true);
            game.add.tween(whiteScreen).to({ alpha: 1 }, 50, "Linear", true, 1000, 0, true);

            game.time.events.add(Phaser.Timer.SECOND, UpdateHp, this);
            game.time.events.add(Phaser.Timer.SECOND, ReturnToPosition, this);
        }
    }
}

function Attack() {
    if (!doingAction) {
        doingAction = true;
        myPirate1.body.velocity.x = 150;
        myPirate1.animations.play("right");
        attacking = true;
    }
}

function UpdateHp() {
    if (selectedEnemy == "Pirate1") {
        enemyPirate1Obj.hp = enemyPirate1Obj.hp - 34
        if (enemyPirate1Obj.hp < 0)
            hpEnemyPirate1 = 0;
        hpEnemyPirate1Txt.text = "hp:" + enemyPirate1Obj.hp + "/100";
    }
    else if (selectedEnemy == "Pirate2") {
        enemyPirate2Obj.hp = enemyPirate2Obj.hp - 34
        if (enemyPirate2Obj.hp < 0)
            enemyPirate2Obj.hp = 0;
        hpEnemyPirate2Txt.text = "hp:" + enemyPirate2Obj.hp + "/100";
    }
    else {
        enemyCaptainObj.hp = enemyCaptainObj.hp - 34
        if (enemyCaptainObj.hp < 0)
            enemyCaptainObj.hp = 0;
        hpEnemyCaptainTxt.text = "hp:" + enemyCaptainObj.hp + "/100";
    }
}

function ReturnToPosition() {
    myPirate1.body.velocity.x = -150;
    myPirate1.animations.play("left");
}

function ReturnedToPosition() {
    if (myPirate1.world.x < 400) {
        myPirate1.body.velocity.x = 0;
        myPirate1.animations.stop();
        myPirate1.frame = 9;
        doingAction = false;
        myPirate1Obj.alreadyAttacked = true;
    }
}

function SelectAction() {
    if (!keyAlreadyPressed) {
        keyAlreadyPressed = true;
        game.time.events.add(Phaser.Timer.SECOND * 0.25, KeyAlreadyPressedReset, this);

        if (cursor.right.isDown && selectedEnemy == "Pirate1")
            selectedEnemy = "Captain";
        else if (cursor.right.isDown && selectedEnemy == "Captain")
            selectedEnemy = "Pirate2";
        else if (cursor.left.isDown && selectedEnemy == "Pirate2")
            selectedEnemy = "Captain";
        else if (cursor.left.isDown && selectedEnemy == "Captain")
            selectedEnemy = "Pirate1";


        enemyPirateContour.destroy();
        enemyPirateContour = game.add.graphics(0, 0);

        if (selectedEnemy == "Pirate1")
            DrawContours(enemyPirateContour, 830, 330, 65, 110, 0xff0000, 195, 595, selectPirate1Txt.width + 10, selectPirate1Txt.height + 10);

        else if (selectedEnemy == "Pirate2")
            DrawContours(enemyPirateContour, 860, 395, 65, 110, 0xff0000, 945, 595, selectPirate2Txt.width + 10, selectPirate2Txt.height + 10);

        else
            DrawContours(enemyPirateContour, 950, 364, 65, 110, 0xff0000, 595, 595, selectPirateCaptainTxt.width + 10, selectPirateCaptainTxt.height + 10);
    }
}

function DrawContours(graphicsObj, x, y, width, height, color, nameX, nameY, nameWidth, nameHeight) {
    graphicsObj.lineStyle(2, color);
    graphicsObj.drawRect(x, y, width, height);

    graphicsObj.lineStyle(2, 0xffffff);
    graphicsObj.drawRect(nameX, nameY, nameWidth, nameHeight);
}

function KeyAlreadyPressedReset() {
    keyAlreadyPressed = false;
}

function PlayerActions() {
    bigRectangle = new Phaser.Rectangle(0, 515, 1280, 205);
    bmd = game.add.bitmapData(1280, 720);
    bmd.rect(bigRectangle.x, bigRectangle.y, bigRectangle.width, bigRectangle.height, "#000000");
    bmd.addToWorld();

    selectPirateTxt = game.add.bitmapText(400, 525, "carrier_command", "Select the pirate to attack", 15);

    if (enemyPirate1Obj.hp > 0)
        selectPirate1Txt = game.add.bitmapText(200, 600, "carrier_command", "Pirate 1", 15);
    if (enemyCaptainObj.hp > 0)
        selectPirateCaptainTxt = game.add.bitmapText(600, 600, "carrier_command", "Captain", 15);
    if (enemyPirate2Obj.hp > 0)
        selectPirate2Txt = game.add.bitmapText(950, 600, "carrier_command", "Pirate 2", 15);
}

function PlaceCharactersAndHp() {
    myCaptain = PlaceCharacter("myCaptain", true, 300, 415);
    myPirate1 = PlaceCharacter("myPirate1", true, 400, 380);
    myPirate2 = PlaceCharacter("myPirate2", true, 420, 450);

    enemyCaptain = PlaceCharacter("enemyCaptain", false, 980, 415);
    enemyPirate1 = PlaceCharacter("enemyPirate1", false, 860, 380);
    enemyPirate2 = PlaceCharacter("enemyPirate2", false, 890, 450);

    hpMyCaptainTxt = game.add.bitmapText(250, 475, "carrier_command", "hp:" + myCaptainObj.hp + "/100", 8);
    hpMyPirate1Txt = game.add.bitmapText(350, 315, "carrier_command", "hp:" + myPirate1Obj.hp + "/100", 8);
    hpMyPirate2Txt = game.add.bitmapText(370, 505, "carrier_command", "hp:" + myPirate2Obj.hp + "/100", 8);
    hpEnemyCaptainTxt = game.add.bitmapText(940, 475, "carrier_command", "hp:" + enemyCaptainObj.hp + "/100", 8);
    hpEnemyPirate1Txt = game.add.bitmapText(820, 315, "carrier_command", "hp:" + enemyPirate1Obj.hp + "/100", 8);
    hpEnemyPirate2Txt = game.add.bitmapText(860, 505, "carrier_command", "hp:" + enemyPirate2Obj.hp + "/100", 8);

    hpMyCaptainTxt.tint = 0x000000;
    hpMyPirate1Txt.tint = 0x000000;
    hpMyPirate2Txt.tint = 0x000000;
    hpEnemyCaptainTxt.tint = 0x000000;
    hpEnemyPirate1Txt.tint = 0x000000;
    hpEnemyPirate2Txt.tint = 0x000000;

    myCaptain.animations.add("iddle", 9, false);
    myCaptain.animations.add("right", [8, 9, 10, 11], 10, true);
    myCaptain.animations.add("left", [4, 5, 6, 7], 10, true);
    myPirate1.animations.add("iddle", 9, false);
    myPirate1.animations.add("right", [8, 9, 10, 11], 10, true);
    myPirate1.animations.add("left", [4, 5, 6, 7], 10, true);
    myPirate2.animations.add("iddle", 9, false);
    myPirate2.animations.add("right", [8, 9, 10, 11], 10, true);
    myPirate2.animations.add("left", [4, 5, 6, 7], 10, true);

    enemyCaptain.animations.add("iddle", 9, false);
    enemyCaptain.animations.add("right", [8, 9, 10, 11], 10, true);
    enemyCaptain.animations.add("left", [4, 5, 6, 7], 10, true);
    enemyPirate1.animations.add("iddle", 9, false);
    enemyPirate1.animations.add("right", [8, 9, 10, 11], 10, true);
    enemyPirate1.animations.add("left", [4, 5, 6, 7], 10, true);
    enemyPirate2.animations.add("iddle", 9, false);
    enemyPirate2.animations.add("right", [8, 9, 10, 11], 10, true);
    enemyPirate2.animations.add("left", [4, 5, 6, 7], 10, true);
}

function PlaceCharacter(charName, ally, posX, posY) {
    var charVar = game.add.sprite(posX, posY, charName);
    charVar.anchor.setTo(0.5, 0.5);
    charVar.scale.set(2.5);

    if (ally)
        charVar.frame = 9;
    else
        charVar.frame = 5;

    return charVar;
}