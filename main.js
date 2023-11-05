const MAZE_WIDTH = 800;
const MAZE_HEIGHT = 600;

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
  width: MAZE_WIDTH,
  height: MAZE_HEIGHT,
  scene: {
    preload: preload,
    create: create,
  },
};

const game = new Phaser.Game(config);

function preload() {
  for (const terrain in terrainToImage) {
    this.load.image(terrainToImage[terrain], `assets/${terrain}.png`);
  }
}

function generateRandomMaze(width, height) {
  // Defina os tipos de terrenos e suas probabilidades
  const terrainTypes = [
    { type: 'grass', probability: 0.70 },
    { type: 'sand', probability: 0.15 },
    { type: 'rocky', probability: 0.05 },
    { type: 'swamp', probability: 0.05 },
    { type: 'wall', probability: 0.05 },
  ];

  // Inicialize o labirinto com 'grama' em todas as células
  const maze = new Array(width).fill(null).map(() => new Array(height).fill('grass'));

  // Mantenha o controle de quantos tesouros você já colocou
  let placedTreasure = 0;

  while (placedTreasure < 1) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    if (maze[x][y] !== 'treasure') {
      // Coloque o tesouro aleatoriamente
      maze[x][y] = 'treasure';
      placedTreasure++;
    }
  }

  // Preencha o restante do labirinto com terrenos aleatórios
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (maze[x][y] !== 'treasure') {
        // Escolha um terreno aleatório com base em probabilidades
        const terrain = selectRandomTerrain(terrainTypes);
        maze[x][y] = terrain;
      }
    }
  }

  return maze;
}

// Função para selecionar um terreno aleatório com base em probabilidades
function selectRandomTerrain(terrainTypes) {
  const rand = Math.random();
  let cumulativeProbability = 0;

  for (const terrain of terrainTypes) {
    cumulativeProbability += terrain.probability;
    if (rand < cumulativeProbability) {
      return terrain.type;
    }
  }

  // Caso inesperado, retorne 'grama' como valor padrão
  return 'grass';
}



function create() {
  const maze = generateRandomMaze(MAZE_WIDTH, MAZE_HEIGHT);
  const tileSize = 40;

  const playerStart = findPlayerStart(maze);

  if (playerStart) {
    console.log(`Player Start: x=${playerStart.x}, y=${playerStart.y}`);
    const playerPath = breadthFirstSearch(maze, playerStart);

    for (let x = VISIBLE_AREA.x; x < VISIBLE_AREA.x + VISIBLE_AREA.width; x++) {
      for (let y = VISIBLE_AREA.y; y < VISIBLE_AREA.y + VISIBLE_AREA.height; y++) {
        if (isInsideVisibleArea(x, y)) {
          const terrainName = maze[x][y];
          const imageName = terrainToImage[terrainName];

          if (imageName) {
            const tile = this.add.image((x - VISIBLE_AREA.x) * tileSize, (y - VISIBLE_AREA.y) * tileSize, imageName);

            if (terrainName === 'treasure') {
              const treasure = this.add.image((x - VISIBLE_AREA.x) * tileSize, (y - VISIBLE_AREA.y) * tileSize, 'treasure');
              treasure.setScale(tileSize / treasure.width); // Adjust scale to match the tile size
              console.log(`Treasure at X: ${x}, Y: ${y}`);
            }

            // Mark the player's path on the first visible grass tile
            if (playerPath && playerPath.length > 0 && terrainName === 'grass' && playerPath.includes(`${x}:${y}`)) {
              const player = this.add.text((x - VISIBLE_AREA.x) * tileSize, (y - VISIBLE_AREA.y) * tileSize, 'P', {
                font: 'bold 24px Arial',
                fill: 'white',
              });
            }
          }
        }
      }
    }
  } else {
    console.error("Player start not found!");
  }
}


function isInsideVisibleArea(x, y) {
  return x >= VISIBLE_AREA.x && x < VISIBLE_AREA.x + VISIBLE_AREA.width && y >= VISIBLE_AREA.y && y < VISIBLE_AREA.y + VISIBLE_AREA.height;
}

function findPlayerStart(maze) {
  for (let x = VISIBLE_AREA.x; x < Math.min(VISIBLE_AREA.x + VISIBLE_AREA.width, maze.length); x++) {
    if (maze[x]) {
      for (let y = VISIBLE_AREA.y; y < Math.min(VISIBLE_AREA.y + VISIBLE_AREA.height, maze[x].length); y++) {
        if (maze[x][y] === 'grass') {
          return { x, y };
        }
      }
    }
  }
  return null;
}



function breadthFirstSearch(maze, start) {
  if (!start) return null;

  const queue = [start];
  const visited = new Set();
  const path = {};

  while (queue.length > 0) {
    const current = queue.shift();
    const currentX = current.x;
    const currentY = current.y;

    const key = `${currentX}:${currentY}`;

    if (!visited.has(key)) {
      visited.add(key);

      const neighbors = getNeighbors(currentX, currentY);

      for (const neighbor of neighbors) {
        const nx = neighbor.x;
        const ny = neighbor.y;
        const neighborKey = `${nx}:${ny}`;

        if (!visited.has(neighborKey) && maze[nx][ny] !== 'wall') {
          queue.push({ x: nx, y: ny });
          path[neighborKey] = key;
        }
      }
    }
  }

  // Reconstruct path
  const playerPath = [`${start.x}:${start.y}`];
  let current = start;
  while (path[`${current.x}:${current.y}`]) {
    current = path[`${current.x}:${current.y}`];
    playerPath.push(current);
  }

  return playerPath.reverse();
}


function getNeighbors(x, y) {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
}
