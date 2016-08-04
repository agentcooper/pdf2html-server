const sort = (rects) => rects.sort((A, B) => {
  const top = A.top - B.top;

  if (top === 0) {
    return A.left - B.left;
  }

  return top;
});

const optimizeClientRects = (rects) => {
  sort(rects);

  rects.forEach(A => {
    rects.forEach(B => {
      if (A.toRemove || B.toRemove) {
        return;
      }

      const sameLine = Math.abs(A.top - B.top) < 5;

      if (!sameLine) {
        return;
      }

      const AoverlapsB = A.left <= B.left && (B.left + B.width) < (A.left + A.width)

      if (AoverlapsB || B.width === 0 || B.height === 0) {
        B.toRemove = true;
      }
    });
  });

  return rects.filter(rect => !rect.toRemove);
};

export default optimizeClientRects;
