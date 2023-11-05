# labirinto
Projeto de Labirinto para a disciplina de Fundamentos de Sistemas Inteligentes

![Screenshot](https://github.com/tassid/labirinto/blob/main/print1.png)


## Tecnologias usadas:
- JavaScript
- Phaser.js

## Como executar o projeto?
1. Instalar o Phaser.js
```
npm install phaser@3.60.0
```
Ou pelo site https://phaser.io/download/stable
(baixe o min.js e coloque na pasta phaser conforme o projeto)

## Escopo

### Custo do terreno:
O ambiente é representado por um grafo que consiste em vértices conectados. Os vértices representam áreas onde o agente pode navegar, enquanto as arestas indicam as conexões entre essas áreas. O ambiente inclui diferentes tipos de terrenos, cada um com um custo de movimentação associado:
- Sólido e Plano: Custo +1
- Rochoso: Custo +10
- Arenoso: Custo +4
- Pântano: Custo +20
- Parede: Custo +1000

O agente deve encontrar o caminho mais econômico para chegar ao prêmio final, levando em consideração os custos associados a cada tipo de terreno.

### Recompensas

O agente deve chegar até o prêmio final.

### Funcionalidades

O projeto inclui as seguintes funcionalidades:

- Implementação dos algoritmos de busca em largura, profundidade, gulosa e A*.
- Cálculo da melhor rota para alcançar o prêmio final.
- Coleta de recompensas ao longo do caminho.
- Detecção de situações sem saída, paredes e becos.
- Exibição da movimentação do agente seguindo a rota calculada.
- Comparativo de resultados em relação ao tempo de execução e quantidade de nós expandidos na memória.

### Execução

Execute o programa para ver o agente encontrando a melhor rota e coletando recompensas.

### Resultados

O projeto oferece a oportunidade de comparar os resultados dos diferentes algoritmos em termos de tempo de execução e uso de memória.
