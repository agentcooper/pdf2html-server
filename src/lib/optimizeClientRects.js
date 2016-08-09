const sort = (rects) => rects.sort((A, B) => {
  const top = A.top - B.top;

  if (top === 0) {
    return A.left - B.left;
  }

  return top;
});

const addMargin = (xMargin, yMargin) => rect => {
  const { top, left, width, height } = rect;

  return {
    top: top - yMargin,
    left: left - xMargin,
    width: width + yMargin,
    height: height + xMargin,
  };
};

const overlaps = (A, B) => A.left <= B.left && B.left <= (A.left + A.width);

const sameLine = (A, B) => Math.abs(A.top - B.top) < 5 && Math.abs(A.height - B.height) < 5;

// const equals = (A, B) =>
//   A.top === B.top &&
//   A.left === B.left &&
//   A.width === B.width &&
//   A.height === B.height;

const inside = (A, B) =>
  A.top > B.top &&
  A.left > B.left &&
  A.top + A.height < B.top + B.height &&
  A.left + A.width < B.left + B.width;

window.overlaps = overlaps;
window.sameLine = sameLine;

const optimizeClientRects = (clientRects) => {
  const rects = sort(
    clientRects.map(
      addMargin(2, 3)
    )
  );

  const firstPass = rects.filter(rect => {
    return rects.every(otherRect => {
      return !inside(rect, otherRect);
    });
  });

  // let didMove = false;
  let passCount = 0;

  while (passCount <= 2) {
    firstPass.forEach(A => {
      firstPass.forEach(B => {
        if (A === B || A.toRemove || B.toRemove) {
          return;
        }

        if (!sameLine(A, B)) {
          return;
        }

        if (overlaps(A, B)) {
          A.width = Math.max(B.width - A.left + B.left, A.width);
          A.height = Math.max(A.height, B.height);

          B.toRemove = true;
        }
      });
    });
    passCount += 1;
  }

  return firstPass.filter(rect => !rect.toRemove);
};

export default optimizeClientRects;
