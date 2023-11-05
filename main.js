const MAZE_WIDTH = 80;
const MAZE_HEIGHT = 60;

const VISIBLE_AREA = {
  x: 0,
  y: 0,
  width: MAZE_WIDTH,
  height: MAZE_HEIGHT,
};

const terrainToImage = {
  grass: 'grass',
  sand: 'sand',
  rocky: 'rocky',
  wall: 'wall',
  swamp: 'swamp',
  treasure: 'treasure',
};

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
  for (const terrain in terrainToImage) {
    this.load.image(terrain, `assets/${terrain}.png`);
  }
}

function generateRandomMaze(width, height) {
  const maze = new Array(width);

  const percentages = {
    grass: 0.70,
    sand: 0.15,
    rocky: 0.05,
    swamp: 0.05,
    wall: 0.05,
  };

  for (let x = 0; x < width; x++) {
    maze[x] = new Array(height).fill('sand');
  }

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

  let treasureX, treasureY;
  do {
    treasureX = VISIBLE_AREA.x + Math.floor(Math.random() * VISIBLE_AREA.width);
    treasureY = VISIBLE_AREA.y + Math.floor(Math.random() * VISIBLE_AREA.height);
  } while (maze[treasureX][treasureY] === 'wall');

  maze[treasureX][treasureY] = 'treasure';

  return maze;
}

function create() {
  const maze = generateRandomMaze(MAZE_WIDTH, MAZE_HEIGHT);
  const tileSize = 40;

  for (let x = VISIBLE_AREA.x; x < VISIBLE_AREA.x + VISIBLE_AREA.width; x++) {
    for (let y = VISIBLE_AREA.y; y < VISIBLE_AREA.y + VISIBLE_AREA.height; y++) {
      if (isInsideVisibleArea(x, y)) {
        const terrainName = maze[x][y];
        const imageName = terrainToImage[terrainName];
        
        if (imageName) {
          const tile = this.add.image((x - VISIBLE_AREA.x) * tileSize, (y - VISIBLE_AREA.y) * tileSize, imageName);
          
          if (terrainName === 'treasure') {
            const treasure = this.add.image((x - VISIBLE_AREA.x) * tileSize, (y - VISIBLE_AREA.y) * tileSize, 'treasure');
            treasure.setScale(tileSize / treasure.width); // Ajuste a escala para corresponder ao tamanho do tile
            console.log(`Tesouro em X: ${x}, Y: ${y}`);
          }
        }
      }
    }
  }
}

function isInsideVisibleArea(x, y) {
  return x >= VISIBLE_AREA.x && x < VISIBLE_AREA.x + VISIBLE_AREA.width && y >= VISIBLE_AREA.y && y < VISIBLE_AREA.y + VISIBLE_AREA.height;
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

  return 'sand';
}
