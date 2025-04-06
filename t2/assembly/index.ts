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

// 主函数
export function greedy_snake_move_barriers(
  snake: Int32Array, food: Int32Array, barriers: Int32Array
): i32 {
  const head_x = snake[0];
  const head_y = snake[1];
  const food_x = food[0];
  const food_y = food[1];

  // 上、左、下、右
  const dxs = [0, -1, 0, 1];
  const dys = [1, 0, -1, 0];

  // 推断当前方向（头 - 第二节）
  const second_x = snake[2];
  const second_y = snake[3];
  let dx = head_x - second_x;
  let dy = head_y - second_y;

  let current_dir = 3;
  if (dx == 1) current_dir = 3;
  else if (dx == -1) current_dir = 1;
  else if (dy == -1) current_dir = 2;
  else if (dy == 1) current_dir = 0;

  const opposite_dir = [2, 3, 0, 1];
  let valid_dirs: i32[] = [];
  for (let d = 0; d < 4; d++) {
    if (d != opposite_dir[current_dir]) valid_dirs.push(d);
  }

  // 构建障碍物集合
  let barrierSet = new Set<string>();
  for (let i = 0; i < barriers.length; i += 2) {
    barrierSet.add(barriers[i].toString() + "," + barriers[i + 1].toString());
  }

  // 构建蛇身集合（排除尾部）
  let bodySet = new Set<string>();
  for (let i = 0; i < snake.length - 2; i += 2) {
    bodySet.add(snake[i].toString() + "," + snake[i + 1].toString());
  }

  // BFS 寻路找出路径
  let queue: Node[] = [new Node(head_x, head_y, new Array<i32>())];
  let visited = new Set<string>();
  visited.add(head_x.toString() + "," + head_y.toString());

  while (queue.length > 0) {
    let node = queue.shift();
    if (!node) continue;

    if (node.x == food_x && node.y == food_y) {
      // 返回第一步的方向
      return node.path.length > 0 ? node.path[0] : -1;
    }

    for (let d = 0; d < 4; d++) {
      let nx = node.x + dxs[d];
      let ny = node.y + dys[d];

      if (nx < 1 || nx > 8 || ny < 1 || ny > 8) continue;
      let key = nx.toString() + "," + ny.toString();
      if (visited.has(key) || bodySet.has(key) || barrierSet.has(key)) continue;

      visited.add(key);
      let newPath = new Array<i32>();
      for (let j = 0; j < node.path.length; j++) {
        newPath.push(node.path[j]);
      }
      newPath.push(d);
      queue.push(new Node(nx, ny, newPath));
    }
  }

  return -1; // 不可达
}