import React, {useContext} from "react";
import { LifeContext } from "../../../contexts/LifeContext";

export default function Formula() {
  const {currentGrid, relativeNumbers} = useContext(LifeContext);
  if (!relativeNumbers) {
    return null;
  }

  const formulaString = relativeNumbers.reduce((string, cell, i) => {
    if (currentGrid[i] === true) {
      // const text = `grid[i + (${cell[0]} * c) + ${cell[1]}] = true;`
      const text = `[${cell[0]}, ${cell[1]}]`;
      const comma = string === '' ? '' : ',';
      return `${string}${comma}${text}`
    }
    return string;
  }, '')

  return (
    <textarea>{formulaString}</textarea>
  )
}