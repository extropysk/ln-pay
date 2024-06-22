export const lnFallback = (request: string): void => {
  const src = `lightning:${request}`;
  const link = document.createElement("a");
  link.href = src;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
