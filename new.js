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
    this load.image('grass', 'assets/grass.png');
    this.load.image('swamp', 'assets/swamp.png');
  }
  
  function create() {
    // Generate a random maze with different terrains
    const maze = generateRandomMaze(50, 50);
  
    // Render the maze based on terrain data
    for (let x = 0; x < maze.length; x++) {
      for (let y = 0; y < maze[x].length; y++) {
        const terrain = maze[x][y];
  
        // Create a sprite based on the terrain type
        let tile;
        switch (terrain) {
          case 'wall':
            tile = this.add.image(x * 32, y * 32, 'wall');
            break;
          case 'sand':
            tile = this.add.image(x * 32, y * 32, 'sand');
            break;
          case 'rocky':
            tile = this.add.image(x * 32, y * 32, 'rocky');
            break;
          case 'grass':
            tile = this.add.image(x * 32, y * 32, 'grass');
            break;
          case 'swamp':
            tile = this.add.image(x * 32, y * 32, 'swamp');
            break;
          default:
            // Handle any other terrain type as needed
            break;
        }
      }
    }
  }
  
  function generateRandomMaze(width, height) {
    const maze = new Array(width);
  
    const totalCells = width * height;
  
    // Define the percentages for each terrain type
    const percentages = {
      grass: 0.40,
      sand: 0.20,
      rocky: 0.20,
      swamp: 0.15,
      wall: 0.05,
    };
  
    // Calculate the number of cells for each terrain type based on percentages
    const cellCounts = {};
    for (const terrain in percentages) {
      cellCounts[terrain] = Math.floor(totalCells * percentages[terrain]);
    }
  
    // Initialize the maze with sand
    for (let x = 0; x < width; x++) {
      maze[x] = new Array(height).fill('sand');
    }
  
    // Start carving the maze
    carveMaze(width, height, maze);
  
    // Distribute the terrain types based on the calculated counts
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (cellCounts.wall > 0) {
          maze[x][y] = 'wall';
          cellCounts.wall--;
        } else {
          // Randomly select one of the remaining terrain types
          const randomTerrain = getRandomTerrain(percentages);
          maze[x][y] = randomTerrain;
          cellCounts[randomTerrain]--;
        }
      }
    }
  
    return maze;
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
  