var mainState = {
    preload: function() {
        // This function will be executed at the beginning
        // That's where we load the images and sounds
            game.load.image('bird', 'bird.png');
            game.load.image('pipe', 'pipe.png');
            game.load.image('hole', 'hole.png');
            game.load.audio('jump', 'jump.wav');
    },

    create: function() {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.

        this.jumpSound = game.add.audio('jump');
        game.stage.backgroundColor = '#71c5cf';
        game.physics.startSystem(Phaser.Physics.ARCADE);



        this.bird = game.add.sprite(100, 245, 'bird');
        this.pipes = game.add.group();
        this.holes = game.add.group();


        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.timer = game.time.events.loop(3500, this.addRowOfPipes, this);


        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",{ font: "30px Arial", fill: "#ffffff" });


    },
    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addHole: function(x, y) {
        // Create a hole at the position x and y
        var hole = game.add.sprite(x, y, 'hole');

        // Add the pipe to our previously created group
        this.holes.add(hole);

        // Enable physics on the pipe
        game.physics.arcade.enable(hole);

        // Add velocity to the pipe to make it move left
        hole.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        hole.checkWorldBounds = true;
        hole.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {

    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1){
            this.addOnePipe(400, i * 60 + 10);
          } else {
            this.addHole(400, i * 60 + 10);
          }


},
    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        if (this.bird.y < 0 || this.bird.y > 490){
          this.restartGame();
        }
        if (this.bird.angle < 20)
    this.bird.angle += 1;

    game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);

        game.physics.arcade.overlap(
            this.bird, this.holes, this.hitHole, null, this);
    },
    hitPipe: function() {
    // If the bird has already hit a pipe, do nothing
    // It means the bird is already falling off the screen
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
    this.holes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
},
hitHole: function() {

if(this.bird.alive){
this.holes.forEach(function(p){
  p.destroy();
}, this);
this.jumpSound.play();
this.score += 1;
this.labelScore.text = this.score;

}


},
    jump: function() {
      if (this.bird.alive == false)
    return;
    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350;

    game.add.tween(this.bird).to({angle: -20}, 100).start();
    this.bird.anchor.setTo(-0.2, 0.5);
},

// Restart the game
  restartGame: function() {
      // Start the 'main' state, which restarts the game
      game.state.start('main');
  },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
