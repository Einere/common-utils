type NonEmptyArray<T> = [T, ...T[]];
type EmptyArray = [];
type EmptyObject = Record<PropertyKey, never>;

/**
 * 아무것도 하지 않는 함수.
 * @example
 *  noop(e); // do nothing
 * */
export const noop = () => undefined;

/**
 * 역을 취하는 함수.
 * @example
 *  negate(true); // false
 *  negate(false); // true
 * */
export const negate = (bool: boolean) => !bool;

/**
 * 이자를 그대로 반환하는 함수.
 * @example identity("foo"); // "foo"
 * */
export const identity = <T = unknown>(value: T) => value;

/**
 * 인자가 존재하는지 검증하는 함수.
 * @example
 *  isExist(undefined); // false
 *  isExist(null);      // false
 *  isExist(true);      // true
 *  isExist(false);     // true
 *  isExist("");        // true
 *  isExist([]);        // true
 * */
export const isExist = <T = unknown>(
  value: T,
): value is Exclude<T, undefined | null> =>
  value !== null && value !== undefined;

/**
 * 인자가 참 같은 값인지 검증하는 함수.
 * @example
 *  isTruthy(undefined); // false
 *  isTruthy(null);      // false
 *  isTruthy(true);      // true
 *  isTruthy(false);     // false
 *  isTruthy("");        // true
 *  isTruthy([]);        // true
 * */
export const isTruthy = <T = unknown>(
  value: T,
): value is Exclude<T, undefined | null | false> =>
  isExist(value) && (typeof value === "boolean" ? value : true);

/**
 * 인자가 거짓 같은 값인지 검증하는 함수.
 * @example
 *  isFalsy(undefined); // true
 *  isFalsy(null);      // true
 *  isFalsy(true);      // false
 *  isFalsy(false);     // true
 *  isFalsy("");        // false
 *  isFalsy([]);        // false
 * */
export const isFalsy = (value: unknown) => negate(isTruthy(value));

/**
 * 인자가 비어있는 문자열인지 검증하는 함수.
 * @example
 *  isEmptyStr("");    // true
 *  isEmptyStr("foo"); // false
 * */
export const isEmptyStr = (str: unknown) =>
  typeof str === "string" && str.length === 0;

/**
 * 인자가 비어있지 않은 문자열인지 검증하는 함수.
 * @example
 *  isNonEmptyStr("");    // false
 *  isNonEmptyStr("foo"); // true
 * */
export const isNonEmptyStr = (str: unknown) =>
  typeof str === "string" && str.length > 0;

/**
 * 인자가 비어있는 배열인지 검증하는 함수.
 * @example
 *  isEmptyArray([]);        // true
 *  isEmptyArray([1, 2, 3]); // false
 * */
export const isEmptyArray = <T = unknown>(target: T[]): target is EmptyArray =>
  Array.isArray(target) && target.length === 0;

/**
 * 인자가 비어있지 않은 배열인지 검증하는 함수.
 * @example
 *  isNonEmptyArray([]);        // false
 *  isNonEmptyArray([1, 2, 3]); // true
 * */
export const isNonEmptyArray = <T = unknown>(
  target: T[],
): target is NonEmptyArray<T> => Array.isArray(target) && target.length > 0;

/**
 * 인자가 비어있는 객체인지 검증하는 함수.
 * @example
 *  isEmptyObj({});             // true
 *  isEmptyObj({ foo: "foo" }); // false
 * */
export const isEmptyObj = <T extends Record<PropertyKey, unknown>>(
  target: T,
): target is EmptyObject =>
  target instanceof Object &&
  !(target instanceof Array) &&
  Object.keys(target).length === 0;

/**
 * 인자가 비어있지 않은 객체인지 검증하는 함수.
 * @example
 *  isNonEmptyObj({});             // false
 *  isNonEmptyObj({ foo: "foo" }); // true
 * */
export const isNonEmptyObj = (
  target: unknown,
): target is Record<PropertyKey, unknown> =>
  target instanceof Object &&
  !(target instanceof Array) &&
  Object.keys(target).length > 0;

/**
 * 인자가 함수인지 검증하는 함수.
 * @example
 *  isFunction(noop); // true
 * */
export function isFunction(
  func: unknown,
): func is (...args: unknown[]) => unknown {
  return typeof func === "function";
}

/**
 * 인자가 유효한 숫자인지 검증하는 함수.
 * @example
 *  isNumber(0);   // true
 *  isNumber(NaN); // false
 * */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && !isNaN(value);

/**
 * 기본값을 이용해 안전하게 값을 가져오는 함수.
 * @example getValue(user?.gender, "male");
 * */
export const getValue = <T = unknown>(
  value: T,
  defaultValue: Exclude<T, undefined | null>,
) => (isExist(value) ? value : defaultValue);

/**
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

/**
 * 무한 제네레이터
 * @example infinity(); // 0, 1, 2, 3...
 *  */
export function* infinity(start = 0) {
  while (true) yield start++;
}

/**
 * 유한 제네레이터
 * @example limit(10, infinity()); // 0, 1, 2, ..., 9
 *  */
export function* limit<T = unknown>(limit: number, iter: Iterable<T>) {
  let count = 0;

  for (const e of iter) {
    if (count === limit) return;

    yield e;
    count += 1;
  }
}

/**
 * 반복자의 시작 지점과 끝 지점까지의 요소를 얻는 제네레이터
 * @example slice(2, 3, "abcde"); // c, d
 * */
export function* slice<T = unknown>(
  start: number,
  end: number,
  iter: Iterable<T>,
) {
  let index = 0;
  for (const e of iter) {
    if (start <= index && index <= end) {
      yield e;
    }
    index += 1;
  }
}

/**
 * n번째 요소를 얻는 함수
 * @example nth(2, [1, 2, 3]); // 3
 * */
export function nth<T = unknown>(index: number, list: T[]) {
  if (!isNumber(index)) throw new Error("index must be number");
  if (!Array.isArray(list)) throw new Error("list must be indexed");
  if (index < 0 || index > list.length - 1)
    throw new Error("index is out of bound");

  return list[index];
}

/**
 * 첫번째 요소를 얻는 함수
 * @example first([1, 2, 3]); // 1
 * */
export function first<T = unknown>(list: T[]) {
  return nth(0, list);
}

/** 앞쪽의 n 개의 요소를 제거한 배열을 얻는 함수.
 * @example drop(2, [1, 2, 3, 4]); // [3, 4]
 * */
export function drop<T = unknown>(length = 1, iterable: Iterable<T>) {
  const arr = Array.from(iterable);
  const maxLength = arr.length;

  return arr.slice(length, maxLength);
}

/** 배열을 하나로 이어주는 함수. 첫번째 인자가 배열임에 주의!
 * @example cat([1, 2], [3, 4], [5, 6]); // [1, 2, 3, 4, 5, 6]
 * */
export function cat<T = unknown>(...lists: T[][]) {
  const head = first(lists);

  if (isExist(head)) {
    return head.concat(...drop(1, lists));
  }

  return [];
}

/** 배열의 맨 앞에 요소를 추가하는 함수. 첫번째 인자가 배열이 아님에 주의!
 * @example construct(0, [1, 2, 3]); // [0, 1, 2, 3]
 * */
export function construct<T = unknown>(head: T, tails: T[]) {
  return cat([head], Array.from(tails));
}

/** 열거 가능한 값의 각 요소마다 함수를 적용 후, 하나의 배열로 이어붙여주는 함수. 첫번째 인자가 배열을 반환해야 함에 주의!
 * @example mapCat((n) => [n, n * 3], [0, 1, 2]); // [0, 0, 1, 3, 2, 6]
 * */
export function mapCat<T = unknown>(f: (e: T) => T[], iterable: Iterable<T>) {
  return cat(...Array.from(iterable).map(f));
}

/** 뒤쪽의 n 개의 요소를 제거한 배열을 얻는 함수.
 * @example dropRight(2, [1, 2, 3, 4]); // [1, 2]
 * */
export function dropRight<T = unknown>(length = 1, iterable: Iterable<T>) {
  const arr = Array.from(iterable);
  const maxLength = arr.length;

  return arr.slice(0, maxLength - length);
}

/** 각 요소의 사이에 요소를 집어넣는 함수.
 * @example interpose<number | string>(() => ',', [1, 2, 3]); // [1, ",", 2, ",", 3]
 * */
export function interpose<T = unknown>(
  inserter: (item: T) => T,
  collection: Iterable<T>,
) {
  return dropRight(
    1,
    mapCat((e) => construct(e, [inserter(e)]), collection),
  );
}

/** 객체에서 특정 키들만 골라 새 객체를 만드는 함수.
 * @example pick(['foo'], {foo: 'a', bar: 1, baz: false}); // { foo: 'a'}
 * */
export function pick<T extends Record<PropertyKey, any>, K extends PropertyKey>(
  keys: readonly K[], // 'readonly'를 사용하여 튜플 타입 추론을 돕습니다.
  obj: T,
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
 * @example filter((n) => n % 2 === 0, [0, 1, 2, 3, 4, 5]) // 0, 2, 4
 * */
function filter<T, S extends T>(
  filterFn: (e: T) => e is S,
  iter: Iterable<T>,
): Iterable<S>;
function filter<T>(filterFn: (e: T) => boolean, iter: Iterable<T>): Iterable<T>;
function* filter<T>(
  filterFn: (e: T) => boolean,
  iter: Iterable<T>,
): Iterable<T> {
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
