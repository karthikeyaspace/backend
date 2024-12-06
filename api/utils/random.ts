const randomString = (n: number) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < n; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));

  return result;
};

export { randomString };
