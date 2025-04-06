// 全局 Node 类定义
class Node {
  x: i32;
  y: i32;
  path: i32[];

  constructor(x: i32, y: i32, path: i32[]) {
    this.x = x;
    this.y = y;
    this.path = path;
  }
}

export function greedy_snake_move_barriers(snake: Int32Array, food: Int32Array, barriers: Int32Array): i32 {
  const head_x = snake[0];
  const head_y = snake[1];
  const food_x = food[0];
  const food_y = food[1];
  const second_x = snake[2];
  const second_y = snake[3];
  const dx = head_x - second_x;
  const dy = head_y - second_y;

  // directions: 上(0), 左(1), 下(2), 右(3)
  const directions: i32[][] = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0]
  ];

  // 确定当前运动方向
  let current_dir: i32;
  if (dx == 1) {
    current_dir = 3; // 右
  } else if (dx == -1) {
    current_dir = 1; // 左
  } else if (dy == -1) {
    current_dir = 2; // 下
  } else if (dy == 1) {
    current_dir = 0; // 上
  } else {
    current_dir = 3; // 默认右
  }

  // 避免回头
  const opposite_dir: i32[] = [2, 3, 0, 1];
   const valid_dirs: i32[] = [];
  for (let d = 0; d < 4; d++) {
    if (d != opposite_dir[current_dir]) {
      valid_dirs.push(d);
    }
  }

  // 障碍物集合
  let barrierSet = new Set<string>();
  for (let i = 0; i < barriers.length; i += 2) {
    barrierSet.add(barriers[i].toString() + "," + barriers[i + 1].toString());
  }

  // 蛇身集合（排除尾部）
  let bodySet = new Set<string>();
  for (let i = 0; i < snake.length - 2; i += 2) {
    bodySet.add(snake[i].toString() + "," + snake[i + 1].toString());
  }

  // BFS 寻找通往果子的路径（用Node记录下路径上所有点的坐标）
  let queue: Node[] = [new Node(head_x, head_y, new Array<i32>())];
  let visited = new Set<string>();
  visited.add(head_x.toString() + "," + head_y.toString());

  while (queue.length > 0) {
    let node = queue.shift();
    if (!node){
      continue;
    } 

    if (node.x == food_x && node.y == food_y) {
      // 返回第一步的方向
      if (node.path.length > 0) {
        return node.path[0];
      } else {
        return -1;
      }
    }

    for (let d = 0; d < 4; d++) {
      let nx = node.x + directions[d][0];
      let ny = node.y + directions[d][1];

      // 边界碰撞检测
      if (nx < 1 || nx > 8 || ny < 1 || ny > 8) {
        continue;
      }

      // 障碍物检测
      let key = nx.toString() + "," + ny.toString();
      if (visited.has(key) || bodySet.has(key) || barrierSet.has(key)) {
        continue;
      }
      visited.add(key);

      let newPath: i32[] = [];
      for (let j = 0; j < node.path.length; j++) {
        newPath.push(node.path[j]);
      }
      newPath.push(d);
      queue.push(new Node(nx, ny, newPath));
    }
  }
// 没有可达路径
  return -1; 
}
