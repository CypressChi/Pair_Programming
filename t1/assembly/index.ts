export function greedy_snake_move(snake: Int32Array, food: Int32Array): i32 {
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

  const candidates = new Array<i32>();
// 确定可选择的移动方向
  for (let i = 0; i < valid_dirs.length; i++) {
    const d = valid_dirs[i];
    const dx_move = directions[d][0];
    const dy_move = directions[d][1];
    const new_x = head_x + dx_move;
    const new_y = head_y + dy_move;

    // 边界碰撞检测
    if (new_x < 1 || new_x > 8 || new_y < 1 || new_y > 8) {
      continue;
    }

    const tail_x = snake[snake.length - 2];
    const tail_y = snake[snake.length - 1];

    // 身体碰撞检测
    if (new_x != tail_x || new_y != tail_y) {
      let collision = false;
      for (let j = 0; j < snake.length - 2; j += 2) {
        const bx = snake[j];
        const by = snake[j + 1];
        if (bx == new_x && by == new_y) {
          collision = true;
          break;
        }
      }
      if (collision) {
        continue;
      }
    }

    candidates.push(d);
  }

  if (candidates.length == 0) {
    if (valid_dirs.length > 0) {
      return valid_dirs[0];
    } else {
      return 3;
    }
  }
  
  // 确定移动方向
  let min_dist = 10000;
  let best_dir = candidates[0];

  for (let i = 0; i < candidates.length; i++) {
    const d = candidates[i];
    const dx_move = directions[d][0];
    const dy_move = directions[d][1];
    const new_x = head_x + dx_move;
    const new_y = head_y + dy_move;
    const dist = abs(new_x - food_x) + abs(new_y - food_y);

    if (dist < min_dist) {
      min_dist = dist;
      best_dir = d;
    }
  }

  return best_dir;
}