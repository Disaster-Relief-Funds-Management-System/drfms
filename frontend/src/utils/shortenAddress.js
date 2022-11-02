export const hash = (address) => {
  if (window.innerWidth <= 550) {
    return `${address.slice(0, 8)}...${address.slice(address.length - 4)}`;
  }
  return address;
};
