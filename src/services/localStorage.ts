export const get = (name: string): any => {
  return JSON.parse(localStorage.getItem(name) || 'not found');
};

export const set = (name: string, value: any): void => {
  localStorage.setItem(name, JSON.stringify(value));
};
