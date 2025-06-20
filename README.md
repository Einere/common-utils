# Common Utils

This is collection of my common utility package based on functional paradigm.

# Warning

This is my personal package. So it not safe.
If you want reliable functional utility package, use [@fxts/core](https://fxts.dev).
Thank you. 😄

## Methods

| method          | description                                              |
|-----------------|----------------------------------------------------------|
| noop            | do nothing                                               |
| negate          | negate boolean                                           |
| identity        | return parameter                                         |
| isExist         | check parameter is not `undefined` or `null`             |
| isTruthy        | check parameter is truthy                                |
| isFalsy         | check parameter is falsy                                 |
| isEmptyStr      | check parameter is empty string                          |
| isNotEmptyStr   | check parameter is not empty string                      |
| isEmptyArray    | check parameter is empty array                           |
| isNotEmptyArray | check parameter is not empty array                       |
| isEmptyObj      | check parameter is empty object                          |
| isNotEmptyObj   | check parameter is not empty object                      |
| isFunction      | check parameter is function                              |
| isNumber        | check parameter is valid number                          |
| getValue        | get value from parameter with default value              |
| converter       | convert function to apply Array.sort                     |
| infinity        | get infinite iterator                                    |
| limit           | get nth iterator from another iterator                   |
| slice           | get iterator from `start` to `end` from another iterator |
| nth             | get nth item in array                                    |
| first           | get first item in array                                  |
| drop            | remove n items from head in array                        |
| cat             | concat arrays                                            |
| construct       | construct array with head item                           |
| mapCat          | concat arrays with map function                          |
| dropRight       | remove n items from tail in array                        |
| interpose       | insert returned value at each item in array              |
| pick            | get object only include specific keys                    |
| filter          | filter items from iterator                               |
| toArray         | convert iterator into array                              |
