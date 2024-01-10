import bcrypt from "bcrypt";

export const hashAmount = async (tokenValue) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(tokenValue, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const compareAmount = async (tokenValue, hashedTokenValue) => {
  return bcrypt.compare(tokenValue, hashedTokenValue);
};
