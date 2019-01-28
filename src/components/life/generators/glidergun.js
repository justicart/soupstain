export default function generateGlider (index, columns, grid = []) {
  const i = index;
  const c = columns;
  grid[i + (-1 * c) + -19] = true;
  grid[i + (-1 * c) + -18] = true;
  grid[i + (0 * c) + -19] = true;
  grid[i + (0 * c) + -18] = true;

  grid[i + (-4 * c) + -9] = true;
  grid[i + (-3 * c) + -9] = true;
  grid[i + (-3 * c) + -8] = true;
  grid[i + (-3 * c) + -7] = true;
  grid[i + (-3 * c) + -6] = true;
  grid[i + (-2 * c) + -8] = true;
  grid[i + (-2 * c) + -7] = true;
  grid[i + (-2 * c) + -6] = true;
  grid[i + (-2 * c) + -5] = true;
  grid[i + (-1 * c) + -8] = true;
  grid[i + (-1 * c) + -5] = true;
  grid[i + (0 * c) + -8] = true;
  grid[i + (0 * c) + -7] = true;
  grid[i + (0 * c) + -6] = true;
  grid[i + (0 * c) + -5] = true;
  grid[i + (1 * c) + -9] = true;
  grid[i + (1 * c) + -8] = true;
  grid[i + (1 * c) + -7] = true;
  grid[i + (1 * c) + -6] = true;
  grid[i + (2 * c) + -9] = true;

  grid[i + (-2 * c) + 6] = true;
  grid[i + (-2 * c) + 7] = true;
  grid[i + (-1 * c) + 5] = true;
  grid[i + (-1 * c) + 7] = true;
  grid[i + (0 * c) + 4] = true;
  grid[i + (0 * c) + 5] = true;
  grid[i + (0 * c) + 6] = true;
  grid[i + (1 * c) + 3] = true;
  grid[i + (1 * c) + 4] = true;
  grid[i + (1 * c) + 5] = true;
  grid[i + (2 * c) + 4] = true;
  grid[i + (2 * c) + 5] = true;
  grid[i + (2 * c) + 6] = true;
  grid[i + (3 * c) + 5] = true;
  grid[i + (3 * c) + 7] = true;
  grid[i + (4 * c) + 6] = true;
  grid[i + (4 * c) + 7] = true;

  grid[i + (0 * c) + 15] = true;
  grid[i + (0 * c) + 16] = true;
  grid[i + (1 * c) + 15] = true;
  grid[i + (1 * c) + 16] = true;

  return grid;
}
