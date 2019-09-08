function selectionIsActive(selection) {
  return selection.start !== null && selection.end !== null;
}

export default selectionIsActive;
