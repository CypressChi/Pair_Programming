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
  
  export function greedy_snake_step(
    n: i32, // 棋盘大小
    selfSnake: Int32Array,
    snakeNum: i32,
    otherSnakes: Int32Array,
    foodNum: i32,
    foods: Int32Array,
    round: i32
  ): i32 {
    const head_x = selfSnake[0];
    const head_y = selfSnake[1];
    const second_x = selfSnake[2];
    const second_y = selfSnake[3];
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
  
    // 占用格集合（包括蛇自己和其他蛇）
    let blockSet = new Set<string>();
  
    // 蛇身集合（排除尾部）
    for (let i = 0; i < selfSnake.length - 2; i += 2) {
      blockSet.add(selfSnake[i].toString() + "," + selfSnake[i + 1].toString());
    }
  
    // 其他蛇身（全部都不能碰）
    for (let i = 0; i < snakeNum * 8; i += 2) {
      let x = otherSnakes[i];
      let y = otherSnakes[i + 1];
      blockSet.add(x.toString() + "," + y.toString());
    }
  
    // 果子列表
    const foodTargets: i32[][] = [];
    for (let i = 0; i < foodNum * 2; i += 2) {
      foodTargets.push([foods[i], foods[i + 1]]);
    }
  
    // BFS 寻找离任意果子的最短路径
    let queue: Node[] = [new Node(head_x, head_y, new Array<i32>())];
    let visited = new Set<string>();
    visited.add(head_x.toString() + "," + head_y.toString());
  
    while (queue.length > 0) {
      let node = queue.shift();
      if (!node) {
        continue;
      }

      // 如果当前位置是果子之一
      for (let i = 0; i < foodTargets.length; i++) {
        const f = foodTargets[i];
        if (node.x == f[0] && node.y == f[1]) {
          if (node.path.length > 0) {
            return node.path[0];
          } else {
            return -1;
          }
        }
      }      
  
      for (let d = 0; d < 4; d++) {
        let nx = node.x + directions[d][0];
        let ny = node.y + directions[d][1];

        // 边界碰撞检测
        if (nx < 1 || nx > n || ny < 1 || ny > n) {
          continue;
        }
        // 阻挡检测
        let key = nx.toString() + "," + ny.toString();
        if (visited.has(key) || blockSet.has(key)) {
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
    if (valid_dirs.length > 0) {
      return valid_dirs[0];
    } else {
      return 3;
    }    
  }
  