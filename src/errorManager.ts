type ErrorFunction = (param: string | number) => string;

const errors: { [key: number]: ErrorFunction } = {
  101: (id: string | number) => {
    return `Can't create collection with name \`${id}\`, Another collection exists with the same name.`;
  },
  102: (id: string | number) => {
    return `Can't delete collection with name \`${id}\`, There are no collections with such name.`;
  },
  104: (id: string | number) => {
    return `Collection with name \`${id}\` not found.`;
  },
  201: (id: string | number) => {
    return `Can't set property with key \`${id}\`, it's reserved for the system.`;
  },
  203: (id: string | number) => {
    return `Can't set property with key \`${id}\`, it's automatically set by the system.`;
  },
  204: (id: string | number) => {
    return `Property with key \`${id}\` not found.`;
  },
  301: (id: string | number) => {
    return `Document with key \`${id}\` not found.`;
  },
};

export const throwError = (number: number, id: string | number): never => {
  const errorFunc = errors[number];

  if (!errorFunc) {
    throw new Error(`Error ${number}: Unknown error code.`);
  }

  throw new Error(`Error ${number}: ${errorFunc(id)}`);
};
