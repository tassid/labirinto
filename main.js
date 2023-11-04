const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
  },
};

const game = new Phaser.Game(config);

function preload() {
  // Load your tileset images (e.g., wall, sand, rocky, grass, swamp)
  this.load.image('wall', 'assets/wall.png');
  this.load.image('sand', 'assets/sand.png');
  this.load.image('rocky', 'assets/rocky.png');
  this.load.image('grass', 'assets/grass.png');
  this.load.image('swamp', 'assets/swamp.png');
  this.load.image('treasure', 'assets/treasure.png');
}


function generateRandomMaze(width, height) {
  const maze = new Array(width);

  const percentages = {
    grass: 0.70,  // Increase grass percentage
    sand: 0.15,   // Reduce sand percentage
    rocky: 0.05,
    swamp: 0.05,
    wall: 0.05,
  };

  // Initialize the maze with the default terrain (in this case, 'sand')
  for (let x = 0; x < width; x++) {
    maze[x] = new Array(height).fill('sand');
  }

  // Distribute the terrain types based on the specified percentages
  const totalCells = width * height;
  const terrainCounts = {};

  for (const terrain in percentages) {
    terrainCounts[terrain] = Math.floor(totalCells * percentages[terrain]);
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (terrainCounts.wall > 0) {
        maze[x][y] = 'wall';
        terrainCounts.wall--;
      } else {
        const randomTerrain = getRandomTerrain(percentages);
        maze[x][y] = randomTerrain;
        terrainCounts[randomTerrain]--;
      }
    }
  }

// Find a random location for the treasure that is not a wall
let treasureX, treasureY;
do {
  treasureX = Math.floor(Math.random() * width);
  treasureY = Math.floor(Math.random() * height);
} while (maze[treasureX][treasureY] === 'wall');

// Mark the treasure location
maze[treasureX][treasureY] = 'treasure';


  return maze;
}


function create() {
  // Generate a random maze with different terrains and a treasure
  const maze = generateRandomMaze(50, 50);

  // Render the maze based on terrain data
  for (let x = 0; x < maze.length; x++) {
    for (let y = 0; y < maze[x].length; y++) {
      const terrain = maze[x][y];

      // Create a sprite based on the terrain type
      let tile;
      switch (terrain) {
        case 'grass':
          tile = this.add.image(x * 32, y * 32, 'grass');
          break;
        case 'sand':
          tile = this.add.image(x * 32, y * 32, 'sand');
          break;
        case 'rocky':
          tile = this.add.image(x * 32, y * 32, 'rocky');
          break;
        case 'wall':
          tile = this.add.image(x * 32, y * 32, 'wall');
          break;
        case 'swamp':
          tile = this.add.image(x * 32, y * 32, 'swamp');
          break;
        case 'treasure': // Create a sprite for the treasure
          tile = this.add.image(x * 32, y * 32, 'treasure');
          // Print the coordinates of the treasure
          const treasureCoords = this.add.text(x * 32, y * 32, `X: ${x}, Y: ${y}`, { fontSize: '16px', fill: '#FF0000' });
          break;
        default:
          // Handle any other terrain type as needed
          break;
      }
    }
  }
}




function carveMaze(width, height, maze) {
  // Implement your maze generation logic here
  // This can be a depth-first search, recursive division, or any other algorithm.
  // For simplicity, let's fill the maze with 'sand'.
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      maze[x][y] = 'sand';
    }
  }
}

function getRandomTerrain(percentages) {
  const randomValue = Math.random();
  let cumulativePercentage = 0;

  for (const terrain in percentages) {
    cumulativePercentage += percentages[terrain];
    if (randomValue <= cumulativePercentage) {
      return terrain;
    }
  }

  // Fallback to 'sand' if there are issues with the percentages
  return 'sand';
}
