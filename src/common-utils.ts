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
export const isEmptyStr = (str: unknown): str is string =>
  typeof str === "string" && str.length === 0;

/**
 * 인자가 비어있지 않은 문자열인지 검증하는 함수.
 * @example
 *  isNonEmptyStr("");    // false
 *  isNonEmptyStr("foo"); // true
 * */
export const isNonEmptyStr = (str: unknown): str is string =>
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

type Curry<F> = F extends (...args: infer Args) => infer R
  ? Args extends [infer A, ...infer Rest]
    ? (arg: A) => Curry<(...args: Rest) => R>
    : R
  : never;

function curry<F extends (...args: any[]) => any>(fn: F): Curry<F> {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...next: any[]) => curried(...args, ...next);
  } as Curry<F>;
}

/**
 * 무한 제네레이터
 * @example infinity(); // 0, 1, 2, 3...
 *  */
export function* infinity(start = 0) {
  while (true) yield start++;
}

/**
 * 반복자에서 "n개의 요소를 취하는 반복자"를 얻는 제네레이터
 * @example take(10, infinity()); // 0, 1, 2, ..., 9
 *  */
export function* take<T = unknown>(count: number, iter: Iterable<T>) {
  let _count = 0;

  for (const e of iter) {
    if (_count === count) return;

    yield e;
    _count += 1;
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
 * n번째 요소를 얻는 함수. 만약 범위를 벗어난 요소를 얻고자 한다면 undefined 를 반환한다.
 * @example nth(2, [1, 2, 3]); // 3
 * */
export function nth<T = unknown>(index: number, iterable: Iterable<T>) {
  if (!isNumber(index)) throw new Error("index must be number");

  let i = 0;
  for (const e of iterable) {
    if (i === index) {
      return e;
    }
    i += 1;
  }
}

/**
 * 첫번째 요소를 얻는 함수. 만약 첫번째가 비어있다면 undefined 를 반환한다.
 * @example first([1, 2, 3]); // 1
 * */
export function first<T = unknown>(iterable: Iterable<T>) {
  return nth(0, iterable);
}

/** 앞쪽의 n 개의 요소를 제거한 반복자를 얻는 함수.
 * @example drop(2, "abcde"); // c, d, e
 * */
export function* drop<T = unknown>(count = 1, iterable: Iterable<T>) {
  let _count = count;

  for (const e of iterable) {
    if (_count <= 0) {
      yield e;
    }
    _count -= 1;
  }
}

/** 뒤쪽의 n 개의 요소를 제거한 반복자를 얻는 함수. 길이가 유한한 반복자여야 함에 주의!
 * @example dropRight(2, "abcde"); // a, b, c
 * */
export function dropRight<T = unknown>(count = 1, iterable: Iterable<T>) {
  return reverse(drop(count, reverse(iterable)));
}

/** 반복자들을 하나로 이어주는 함수. 모든 인자가 반복자여야 함에 유의!
 * @example cat([1, 2], [3, 4], [5, 6]); // 1, 2, 3, 4, 5, 6
 * */
export function* cat<T = unknown>(...iterables: Array<Iterable<T>>) {
  for (const e of iterables) {
    for (const _e of e) {
      yield _e;
    }
  }
}

/** 반복자의 맨 앞에 요소를 추가하는 함수. 첫번째 인자가 반복자가 아님에 주의!
 * @example construct(0, [1, 2, 3]); // 0, 1, 2, 3
 * */
export function construct<T = unknown>(head: T, tails: Iterable<T>) {
  return cat([head], tails);
}

/**
 * 반복자의 각 요소에 대해 매퍼 함수를 적용한 반복자를 얻는 함수.
 * @example map((c) => c.toUpperCase(), "abcde"); // A, B, C, D, E
 * */
export function* map<T, S>(mapper: (item: T) => S, iterable: Iterable<T>) {
  for (const e of iterable) {
    yield mapper(e);
  }
}

/** 반복자의 각 요소에 특정 함수를 취하고 평탄화하는 함수. 매퍼 함수는 반복자를 반환해야 함에 주의!
 * @example
 *  flatMap((n) => [n, -n], [1, 2, 3]); // 1, -1, 2, -2, 3, -3
 * */
export function flatMap<T, S>(
  mapper: (e: T) => Iterable<S>,
  iterable: Iterable<T>,
) {
  return cat(...map(mapper, iterable));
}

/** 반복자의 각 요소 사이에 특정 요소를 집어넣는 함수.
 * @example
 *  interpose((n) => -n, [1, 2, 3]); // 1, -1, 2, -2, 3
 * */
export function interpose<T, S>(
  inserter: (item: T) => T | S,
  iterable: Iterable<T>,
) {
  return dropRight(
    1,
    flatMap((e) => construct(e, [inserter(e)]), iterable),
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
export function filter<T, S extends T>(
  filterFn: (e: T) => e is S,
  iter: Iterable<T>,
): Iterable<S>;
export function filter<T>(
  filterFn: (e: T) => boolean,
  iter: Iterable<T>,
): Iterable<T>;
export function* filter<T>(
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
 * @example toArray(take(5, infinity())); // [0, 1, 2, 3, 4]
 * */
export function toArray<T = unknown>(iter: Iterable<T>) {
  return Array.from(iter);
}

/**
 * 인자로 받은 반복자의 역순으로한 반복자를 얻는 함수. 길이가 유한해야 함에 주의!
 * @example reverse("abcde"); // e, d, c, b, a
 * */
export function* reverse<T = unknown>(iterable: Iterable<T>) {
  const reversedArr = toArray(iterable).reverse();

  for (const e of reversedArr) {
    yield e;
  }
}

/**
 * 반복자를 순휘하며 값을 만들어나가는 함수.
 * @example reduce((acc, item, index) => acc + item, [1, 2, 3, 4]); // 10
 *
 * */
export function reduce<T>(
  reducer: (acc: T, item: T, index: number) => T,
  iterable: Iterable<T>,
): T;
export function reduce<T, S>(
  reducer: (acc: S, item: T, index: number) => S,
  initial: S,
  iterable: Iterable<T>,
): S;
export function reduce<T>(
  reducer: (acc: T, item: T, index: number) => T,
  iterable: Iterable<T>,
): T;
export function reduce<T, S>(
  reducer: (acc: S, item: T, index: number) => S,
  initial: S,
  iterable: Iterable<T>,
): S;
export function reduce<T, S>(
  reducer: (acc: S, item: T, index: number) => S,
  initialOrIterable: S | Iterable<T>,
  maybeIterable?: Iterable<T>,
): S {
  let index = 0;
  let accumulator: S;
  let iterable: Iterable<T>;

  if (maybeIterable === undefined) {
    iterable = initialOrIterable as Iterable<T>;
    const iterator = iterable[Symbol.iterator]();
    const first = iterator.next();
    if (first.done) {
      throw new TypeError(
        "You are trying to reduce of empty iterable with no initial value.",
      );
    }
    accumulator = first.value as unknown as S;

    let result = iterator.next();
    while (!result.done) {
      accumulator = reducer(accumulator, result.value, ++index);
      result = iterator.next();
    }
  } else {
    accumulator = initialOrIterable as S;
    iterable = maybeIterable;
    for (const item of iterable) {
      accumulator = reducer(accumulator, item, index++);
    }
  }

  return accumulator;
}

// TODO: forEach 구현하기
// TODO: some 구현하기
// TODO: every 구현하기
// TODO: find 구현하기
