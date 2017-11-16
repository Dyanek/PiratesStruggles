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

        game.physics.enable([myShip, enemyShip], Phaser.Physics.ARCADE);
    },

    update: function () {
        MyShipZoneChanging();
        MyShipMovements();
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
    if (myShip.world.x < 0)
        myShip.position.x = 1280;
    else if (myShip.world.x > 1280)
        myShip.position.x = 0;
    else if (myShip.world.y < 0)
        myShip.position.y = 720;
    else if (myShip.world.y > 720)
        myShip.position.y = 0;
}

function CollideMyShipEnemyShip() {
    game.state.start("fight");
}