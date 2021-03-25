const generateFileName = () => Math.random().toString(36).substring(7);

export const generateFileNameList = (total) => {
  const fileNames = [];

  for (let index = 0; index < total; index++) {
    fileNames.push(`${index}-${generateFileName()}`);
  }

  return fileNames;
};
