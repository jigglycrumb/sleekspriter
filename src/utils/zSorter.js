const zSorter = function(a, b) {
  if (a.z > b.z) return -1;
  if (a.z < b.z) return 1;
  return 0;
};

export default zSorter;
