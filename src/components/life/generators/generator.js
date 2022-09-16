export default function generator (i, c, shape, grid = []) {
  const workingGrid = [...grid];
  for (const coord of shape) {
    // get relative index from i
    const ri = i + (coord[0] * c) + coord[1];
    // set that index to true
    workingGrid[ri] = true;
  }

  return workingGrid;
}
