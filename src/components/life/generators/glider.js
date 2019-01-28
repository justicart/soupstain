export default function generateGlider (index, columns, grid = []) {
  const i = index;
  const c = columns;
  grid[i + (-1 * c) + 1] = true;
  grid[i + (0 * c) + -1] = true;
  grid[i + (0 * c) + 1] = true;
  grid[i + (1 * c) + 0] = true;
  grid[i + (1 * c) + 1] = true;

  return grid;
}
