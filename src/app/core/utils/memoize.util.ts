/**
 * This function is a memoization utility that caches the results of a function based on its arguments.
 * TODO: Improve this.
 */
export function memoize<T, U extends any[]>(fn: (...args: U) => T): (...args: U) => T {
  const cache = new Map<string, T>();

  return (...args: U): T => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

export function Memo<T>(
  _target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  const memoizedResults = new WeakMap<any, Map<string, any>>();

  descriptor.value = function (...args: any[]): any {
    let instanceCache = memoizedResults.get(this);
    if (!instanceCache) {
      instanceCache = new Map<string, any>();
      memoizedResults.set(this, instanceCache);
    }

    const key = JSON.stringify(args);

    if (instanceCache.has(key)) {
      return instanceCache.get(key);
    }

    const result = originalMethod.apply(this, args);
    instanceCache.set(key, result);
    return result;
  };

  return descriptor;
}
