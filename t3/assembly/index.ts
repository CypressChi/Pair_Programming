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
  
  const directions: i32[][] = [
    [0, 1],   // 上
    [-1, 0],  // 左
    [0, -1],  // 下
    [1, 0]    // 右
  ];
  
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
  
    // 当前方向
    const dx = head_x - second_x;
    const dy = head_y - second_y;
    let current_dir = 3;
    if (dx == 1) current_dir = 3;
    else if (dx == -1) current_dir = 1;
    else if (dy == -1) current_dir = 2;
    else if (dy == 1) current_dir = 0;
  
    const opposite_dir = [2, 3, 0, 1];
    const valid_dirs: i32[] = [];
    for (let d = 0; d < 4; d++) {
      if (d != opposite_dir[current_dir]) {
        valid_dirs.push(d);
      }
    }
  
    // 构建占用格集合（不能走的）
    let blockSet = new Set<string>();
  
    // 自己身体（排除尾部）
    for (let i = 0; i < selfSnake.length - 2; i += 2) {
      blockSet.add(selfSnake[i].toString() + "," + selfSnake[i + 1].toString());
    }
  
    // 其他蛇身体（全部都不能碰）
    for (let i = 0; i < snakeNum * 8; i += 2) {
      let x = otherSnakes[i];
      let y = otherSnakes[i + 1];
      blockSet.add(x.toString() + "," + y.toString());
    }
  
    // 构建目标食物列表
    const foodTargets: i32[][] = [];
    for (let i = 0; i < foodNum * 2; i += 2) {
      foodTargets.push([foods[i], foods[i + 1]]);
    }
  
    // BFS：找离任意果子最近的路径
    let visited = new Set<string>();
    let queue: Node[] = [new Node(head_x, head_y, new Array<i32>())];
    visited.add(head_x.toString() + "," + head_y.toString());
  
    while (queue.length > 0) {
      let node = queue.shift();
      if (!node) continue;
  
      // 如果当前位置是食物之一
      for (let i = 0; i < foodTargets.length; i++) {
        const f = foodTargets[i];
        if (node.x == f[0] && node.y == f[1]) {
          return node.path.length > 0 ? node.path[0] : -1;
        }
      }
  
      for (let d = 0; d < 4; d++) {
        let nx = node.x + directions[d][0];
        let ny = node.y + directions[d][1];
        if (nx < 1 || nx > n || ny < 1 || ny > n) continue;
  
        let key = nx.toString() + "," + ny.toString();
        if (visited.has(key) || blockSet.has(key)) continue;
  
        visited.add(key);
        let newPath = new Array<i32>();
        for (let j = 0; j < node.path.length; j++) {
          newPath.push(node.path[j]);
        }
        newPath.push(d);
        queue.push(new Node(nx, ny, newPath));
      }
    }
  
    // 如果没有可达路径
    return valid_dirs.length > 0 ? valid_dirs[0] : 3;
  }
  