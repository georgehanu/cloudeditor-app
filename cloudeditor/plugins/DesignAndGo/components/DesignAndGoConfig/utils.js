export const MergeClassName = (defaultClass, newClass) => {
  if (newClass === null || newClass === undefined) {
    return defaultClass;
  }
  if (defaultClass === null) {
    return newClass;
  }

  if (typeof newClass === "string") {
    if (typeof defaultClass === "string") {
      return [defaultClass, newClass].join(" ");
    } else {
      return [...defaultClass, newClass].join(" ");
    }
  } else {
    if (typeof defaultClass === "string") {
      return [defaultClass, ...newClass].join(" ");
    } else {
      return [...defaultClass, ...newClass].join(" ");
    }
  }
};
