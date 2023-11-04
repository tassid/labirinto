const config = {
  type: Phaser.AUTO,
  width: 1900,
  height: 1000,
  scene: {
    preload: preload,
    create: create,
  },
};

const game = new Phaser.Game(config);

// Defina a área visível (por exemplo, dentro do retângulo 400x400 no centro)
const visibleArea = {
  x: 200, // Largura do retângulo visível
  y: 100, // Altura do retângulo visível
  width: 400, // Largura do retângulo visível
  height: 400, // Altura do retângulo visível
};

function preload() {
  // Carregue as imagens do seu conjunto de azulejos (ex: parede, areia, rochosa, grama, pântano, tesouro)
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
    grass: 0.70,  // Aumente a porcentagem de grama
    sand: 0.15,   // Reduza a porcentagem de areia
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

  // Encontre uma localização aleatória para o tesouro dentro da área visível
  let treasureX, treasureY;
  do {
    treasureX = visibleArea.x + Math.floor(Math.random() * visibleArea.width);
    treasureY = visibleArea.y + Math.floor(Math.random() * visibleArea.height);
  } while (maze[treasureX][treasureY] === 'wall');

  // Marque a localização do tesouro
  maze[treasureX][treasureY] = 'treasure';

  return maze;
}

function create() {
  // Gere um labirinto aleatório com diferentes terrenos e um tesouro
  const maze = generateRandomMaze(80, 60);

  // Defina o tamanho de cada azulejo
  const tileSize = 10;

  // Renderize o labirinto com base nos dados de terreno
  for (let x = visibleArea.x; x < visibleArea.x + visibleArea.width; x++) {
    for (let y = visibleArea.y; y < visibleArea.y + visibleArea.height; y++) {
      const terrain = maze[x][y];
      let tile;

      switch (terrain) {
        case 'grass':
          tile = this.add.image((x - visibleArea.x) * tileSize, (y - visibleArea.y) * tileSize, 'grass');
          break;
        case 'sand':
          tile = this.add.image((x - visibleArea.x) * tileSize, (y - visibleArea.y) * tileSize, 'sand');
          break;
        case 'rocky':
          tile = this.add.image((x - visibleArea.x) * tileSize, (y - visibleArea.y) * tileSize, 'rocky');
          break;
        case 'wall':
          tile = this.add.image((x - visibleArea.x) * tileSize, (y - visibleArea.y) * tileSize, 'wall');
          break;
        case 'swamp':
          tile = this.add.image((x - visibleArea.x) * tileSize, (y - visibleArea.y) * tileSize, 'swamp');
          break;
        case 'treasure':
          tile = this.add.image((x - visibleArea.x) * tileSize, (y - visibleArea.y) * tileSize, 'treasure');
          // Imprima as coordenadas do tesouro
          const treasureCoords = this.add.text((x - visibleArea.x) * tileSize, (y - visibleArea.y) * tileSize, `X: ${x}, Y: ${y}`, { fontSize: '16px', fill: '#FF0000' });
          break;
        default:
          // Lidar com qualquer outro tipo de terreno, conforme necessário
          break;
      }
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

  // Recorra a 'sand' se houver problemas com as porcentagens
  return 'sand';
}
