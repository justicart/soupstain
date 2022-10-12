import React, {useContext, useEffect, useState} from "react";
import { LifeContext } from "../../../contexts/LifeContext";

export default function Formula() {
  const [formulaString, setFormulaString] = useState('');
  const {currentGrid, relativeNumbers} = useContext(LifeContext);
  
  useEffect(() => {
    if (relativeNumbers) {
      getString();
    }
  }, [currentGrid, relativeNumbers]);

  function getString() {
    const workingFormulaString = relativeNumbers.reduce((string, cell, i) => {
      if (currentGrid[i] === true) {
        // const text = `grid[i + (${cell[0]} * c) + ${cell[1]}] = true;`
        const text = `[${cell[0]}, ${cell[1]}]`;
        const comma = string === '' ? '' : ',';
        return `${string}${comma}${text}`
      }
      return string;
    }, '')
    setFormulaString(workingFormulaString);
  }

  return !relativeNumbers ? null : (
    <textarea style={{width: '100%'}} value={formulaString} readOnly></textarea>
  )
}