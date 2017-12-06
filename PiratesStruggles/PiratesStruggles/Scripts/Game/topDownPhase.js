var myShip;
var enemyShip;
var cursor;
var facing;

var topDownState = {
    preload: function () {
        game.load.image("waterBackground", "./Assets/Images/waterBackground.jpg");
        game.load.spritesheet("myShip", "./Assets/Sprites/Ships/myShip.jpg", 208, 192, 16);
        game.load.spritesheet("enemyShip", "./Assets/Sprites/Ships/enemyShip.png", 80, 96, 16);
    },

    create: function () {
        game.add.image(0, 0, "waterBackground");

        cursor = game.input.keyboard.createCursorKeys(); 

        myShip = game.add.sprite(640, 360, "myShip"); 
        myShip.anchor.setTo(0.5, 0.5);
        myShip.scale.set(0.5);
        myShip.frame = 13;

        enemyShip = game.add.sprite(400, 400, "enemyShip");
        enemyShip.anchor.setTo(0.5, 0.5);
        enemyShip.frame = 1;

        RandomPositionShip(enemyShip);

        game.physics.enable([myShip, enemyShip], Phaser.Physics.ARCADE);

        RandomDirection();
    },

    update: function () {
        MyShipZoneChanging();
        MyShipMovements();
        EnemyShipZoneEdge();
        game.physics.arcade.collide(myShip, enemyShip, CollideMyShipEnemyShip);
    }
};

function MyShipMovements() {
    myShip.body.velocity.x = 0;
    myShip.body.velocity.y = 0;   

    if (cursor.left.isDown) {
        myShip.body.velocity.x = -300;

        if (facing != "left") {
            facing = "left";
            myShip.frame = 5;
        }
    }
    else if (cursor.right.isDown) {
        myShip.body.velocity.x = 300;

        if (facing != "right") {
            facing = "right";
            myShip.frame = 9;
        }
    }
    else if (cursor.up.isDown) {
        myShip.body.velocity.y = -300;

        if (facing != "up") {
            facing = "up";
            myShip.frame = 13;
        }
    }
    else if (cursor.down.isDown) {
        myShip.body.velocity.y = 300;

        if (facing != "down") {
            facing = "down";
            myShip.frame = 1;
        }
    }
}

function MyShipZoneChanging()
{
    if (myShip.world.x < 0) {
        myShip.x = 1280;
        enemyShip.frame = 1;
        RandomPositionShip(enemyShip);
    }
    else if (myShip.world.x > 1280) {
        myShip.x = 0;
        RandomPositionShip(enemyShip);
    }
    else if (myShip.world.y < 0) {
        myShip.y = 720;
        RandomPositionShip(enemyShip);
    }
    else if (myShip.world.y > 720) {
        myShip.y = 0;
        RandomPositionShip(enemyShip);
    }
}

function CollideMyShipEnemyShip() {
    game.state.start("fight");
}

function RandomPositionShip(ship) {
    ship.x = game.rnd.integerInRange(1, 1280);
    ship.y = game.rnd.integerInRange(1, 720);
}

function RandomDirection() {
    var direction = game.rnd.integerInRange(0, 3);

    switch (direction) {
        case 0:
            enemyShip.body.velocity.x = -200;
            enemyShip.body.velocity.y = 0;
            enemyShip.frame = 5;
            break;

        case 1:
            enemyShip.body.velocity.x = 0;
            enemyShip.body.velocity.y = -200;
            enemyShip.frame = 13;
            break;

        case 2:
            enemyShip.body.velocity.x = 0;
            enemyShip.body.velocity.y = 200;
            enemyShip.frame = 1;
            break;

        case 3:
            enemyShip.body.velocity.x = 200;
            enemyShip.body.velocity.y = 0;
            enemyShip.frame = 9;
            break;
    }

    game.time.events.add(Phaser.Timer.SECOND * 2, RandomDirection, this);
}

function EnemyShipZoneEdge() {
    if (enemyShip.x < 0) {
        enemyShip.body.velocity.x = 200;
        enemyShip.frame = 9;
    }
    else if (enemyShip.x > 1280) {
        enemyShip.body.velocity.x = -200;
        enemyShip.frame = 5;
    }
    else if (enemyShip.y < 0) {
        enemyShip.body.velocity.y = 200;
        enemyShip.frame = 1;
    }
    else if (enemyShip.y > 720) {
        enemyShip.body.velocity.y = -200;
        enemyShip.frame = 13;
    }
}