export function getTypedObjectKeys<T extends object>(object: T): Array<keyof T> {
  const keys = Object.keys(object);
  if (keysMatchObject(keys, object)) {
    return keys;
  }
  throw new Error(`Object with keys ${keys.join(', ')} does not match the expected type`);
}

function keysMatchObject<T extends object>(keys: Array<string | number | symbol>, object: T): keys is Array<keyof T> {
  return keys.every((key) => key in object);
}
