type NonEmptyArray<T> = [T, ...T[]];
type EmptyArray = [];
type EmptyObject = Record<PropertyKey, never>;

export const noop = () => undefined;

export const negate = (bool: boolean) => !bool;

export const identity = <T = unknown>(value: T) => value;

export const isExist = <T = unknown>(value: T): value is Exclude<T, undefined | null> =>
  value !== null && value !== undefined;

export const isTruthy = <T = unknown>(value: T): value is Exclude<T, undefined | null | false> =>
  isExist(value) && (typeof value === 'boolean' ? value : true);

export const isFalsy = (value: unknown) => negate(isTruthy(value));

export const isEmptyStr = (str: unknown) => typeof str === 'string' && str.length === 0;

export const isNotEmptyStr = (str: unknown) => typeof str === 'string' && str.length > 0;

export const isNotEmptyArray = <T = unknown>(target: T[]): target is NonEmptyArray<T> =>
  Array.isArray(target) && target.length > 0;

export const isEmptyArray = <T = unknown>(target: T[]): target is EmptyArray =>
  Array.isArray(target) && target.length === 0;

export const isEmptyObj = <T extends object>(target: T): target is EmptyObject =>
  target instanceof Object && !(target instanceof Array) && Object.keys(target).length === 0;

export const isNotEmptyObj = (target: unknown): target is Record<PropertyKey, unknown> =>
  target instanceof Object && !(target instanceof Array) && Object.keys(target).length > 0;

export function isFunction(func: unknown): func is (...args: unknown[]) => unknown {
  return typeof func === 'function';
}

export const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value);

export const getValue = <T = unknown>(value: T, defaultValue: Exclude<T, undefined | null>) =>
  isExist(value) ? value : defaultValue;

/*
 * boolean 결과를 -1, 0, 1 로 변환해주는 함수. Array.sort 의 콜백으로 사용하기 유용하다.
 * @example someArray.sort(converter(LTE));
 * */
export function converter<T>(predicate: (x: T, b: T) => boolean) {
  return function comparator(x: T, y: T) {
    if (isTruthy(predicate(x, y))) {
      return -1;
    }
    if (isTruthy(predicate(y, x))) {
      return 1;
    }
    return 0;
  };
}

/* 무한 제네레이터 */
export function* infinity(start = 0) {
  while (true) yield start++;
}

/* 유한 제네레이터
 * @example limit(10, infinity()); // [0, 1, 2, ... 9]
 *  */
export function* limit<T = unknown>(limit: number, iter: Iterable<T>) {
  let count = 0;

  for (const e of iter) {
    if(count === limit) return;

    yield e;
    count += 1;
  }
}

/* 이터레이터의 시작 지점과 끝 지점까지의 요소를 얻는 제네레이터
 * @example slice(2, 4, "abcde");
 * */
export function *slice<T = unknown>(start: number, end: number, iter: Iterable<T>) {
  let index = 0;
  for(const e of iter) {
    if(start <= index  && index <= end) {
      yield e;
    }
    index += 1;
  }
}

/* n번째 요소를 얻는 함수
 * @example nth(2, [1, 2, 3]); // 3
 * */
export function nth<T = unknown>(index: number, list: T[]) {
  if (!isNumber(index)) throw new Error('index must be number');
  if (!Array.isArray(list)) throw new Error('list must be indexed');
  if (index < 0 || index > list.length - 1) throw new Error('index is out of bound');

  return list[index];
}

/* 첫번째 요소를 얻는 함수
 * @example first([1, 2, 3]); // 1
 * */
export function first<T = unknown>(list: T[]) {
  return nth(0, list);
}

/* 앞쪽의 n 개의 요소를 제거한 배열을 얻는 함수.
 * @example drop(2, [1, 2, 3, 4]); // [3, 4]
 * */
export function drop<T = unknown>(length = 1, iterable: Iterable<T>) {
  const arr = Array.from(iterable);
  const maxLength = arr.length;

  return arr.slice(length, maxLength);
}

/* 배열을 하나로 이어주는 함수.
 * 첫번째 인자가 배열임에 주의!
 * @example cat([1, 2], [3, 4], [5, 6]); // [1, 2, 3, 4, 5, 6]
 * */
export function cat<T = unknown>(...lists: T[][]) {
  const head = first(lists);

  if (isExist(head)) {
    return head.concat(...drop(1, lists));
  }

  return [];
}

/* 배열의 맨 앞에 요소를 추가하는 함수.
 * 첫번째 인자가 배열이 아님에 주의!
 * @example construct(0, [1, 2, 3]); // [0, 1, 2, 3]
 * */
export function construct<T = unknown>(head: T, tails: T[]) {
  return cat([head], Array.from(tails));
}

/* 열거 가능한 값의 각 요소마다 함수를 적용 후, 하나의 배열로 이어붙여주는 함수.
 * 첫번째 인자가 배열을 반환해야 함에 주의!
 * @example mapCat((n) => [n, n * 3], [0, 1, 2]); // [0, 0, 1, 3, 2, 6]
 * */
export function mapCat<T = unknown>(f: (e: T) => T[], iterable: Iterable<T>) {
  return cat(...Array.from(iterable).map(f));
}

/* 뒤쪽의 n 개의 요소를 제거한 배열을 얻는 함수.
 * @example dropRight(2, [1, 2, 3, 4]); // [1, 2]
 * */
export function dropRight<T = unknown>(length = 1, iterable: Iterable<T>) {
  const arr = Array.from(iterable);
  const maxLength = arr.length;

  return arr.slice(0, maxLength - length);
}

/* 각 요소의 사이에 요소를 집어넣는 함수.
 * @example interpose<number | string>(() => ',', [1, 2, 3]); // [1, ",", 2, ",", 3]
 * */
export function interpose<T = unknown>(inserter: (item: T) => T, collection: Iterable<T>) {
  return dropRight(
    1,
    mapCat((e) => construct(e, [inserter(e)]), collection),
  );
}

/* 객체에서 특정 키들만 골라 새 객체를 만드는 함수.
 * @example pick(['foo'], {foo: 'a', bar: 1, baz: false}); // { foo: 'a'}
 * */
export function pick<T extends Record<PropertyKey, any>, K extends PropertyKey>(
    keys: readonly K[], // 'readonly'를 사용하여 튜플 타입 추론을 돕습니다.
    obj: T
): { [P in K & keyof T]: T[P] } {
  return keys.reduce<Record<PropertyKey, T[keyof T]>>((acc, key) => {
    if (Object.hasOwn(obj, key)) {
      return Object.assign(acc, { [key]: obj[key] });
    }
    return acc;
  }, {}) as { [P in K & keyof T]: T[P] }; // 타입 단언을 통해 최종 반환 타입을 명확히 합니다.
}

/**
 * 빈복자에서 특정 조건을 만족하는 요소만 걸러내는 제네레이터.
 * @example filter((n) => n % 2 === 0, [0, 1, 2, 3, 4, 5]) // [0, 2, 4]
 * */
export function* filter<T = unknown>(filterFn: (e: T) => boolean, iter: Iterable<T>) {
  for (const item of iter) {
    if (filterFn(item)) {
      yield item;
    }
  }
}

/**
 * 반복자를 배열로 변환하는 함수.
 * @example toArray(limit(5, infinity())); // [0, 1, 2, 3, 4]
 * */
export function toArray<T = unknown>(iter: Iterable<T>) {
  return Array.from(iter);
}