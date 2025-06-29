# Common Utils

This is collection of my common utility package based on functional paradigm.

# Warning

This is my personal package. So it not safe.
If you want reliable functional utility package, use [@fxts/core](https://fxts.dev).
Thank you. 😄

## Methods

| method          | description                                                  |
|-----------------|--------------------------------------------------------------|
| noop            | do nothing                                                   |
| negate          | negate boolean                                               |
| identity        | return parameter                                             |
| isExist         | check parameter is not `undefined` or `null`                 |
| isTruthy        | check parameter is truthy                                    |
| isFalsy         | check parameter is falsy                                     |
| isEmptyStr      | check parameter is empty string                              |
| isNonEmptyStr   | check parameter is not empty string                          |
| isEmptyArray    | check parameter is empty array                               |
| isNonEmptyArray | check parameter is not empty array                           |
| isEmptyObj      | check parameter is empty object                              |
| isNonEmptyObj   | check parameter is not empty object                          |
| isFunction      | check parameter is function                                  |
| isNumber        | check parameter is valid number                              |
| getValue        | get value from parameter with default value                  |
| converter       | convert function to apply `Array.sort`                       |
| infinity        | get infinite iterator                                        |
| take            | get n items from iterator                                    |
| slice           | get items from `start` to `end` from iterator                |
| nth             | get nth item from iterator                                   |
| first           | get first item from iterator                                 |
| drop            | remove n items from front in iterator                        |
| dropRight       | remove n items from back in iterator                         |
| cat             | concat iterators                                             |
| construct       | construct new iterator with head item                        |
| map             | apply `mapper` function to each item in iterator             |
| flatMap         | apply `mapper` function to each item in iterator and flatten |
| interpose       | insert specific value between each item in iterator          |
| pick            | get object only include specific keys                        |
| filter          | filter items from iterator                                   |
| toArray         | convert iterator into array                                  |
| reverse         | reverse iterator                                             |
| reduce          | make one value by iterating iterable                         |
| forEach         | apply function to each item in iterator                      |
| some            | check if any item satisfies `checker` condition in iterator  |
| every           | check if all items satisfies `checker` condition in iterator |
| find            | find first item in iterator satisfies `finder` function      |