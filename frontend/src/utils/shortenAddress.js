export const hash = (address) => {
  return `${address.slice(0, 8)}...${address.slice(address.length - 4)}`;
  return address;
};
