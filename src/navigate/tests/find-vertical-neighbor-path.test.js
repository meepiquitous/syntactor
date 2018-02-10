import {List} from 'immutable';
import * as matchers from 'jest-immutable-matchers';

import parse from '../../utils/parse';
import findVerticalNeighborPath from '../find-vertical-neighbor-path';

const expectPath = (obj, direction, pathIn, pathOut) => {
  expect(findVerticalNeighborPath(direction, parse(obj), new List(pathIn)))
    .toEqualImmutable(new List(pathOut));
};

beforeEach(() => {
  jest.addMatchers(matchers);
});

const simpleObj = {
  mr: 'Meeseeks',
  outOfBox: true,
};

it('goes to next prop', () => {
  expectPath(simpleObj, 'DOWN', ['properties', 0, 'key'], ['properties', 1]);
});

it('goes to previous prop', () => {
  expectPath(simpleObj, 'UP', ['properties', 1, 'key'], ['properties', 0]);
});

it('goes to previous prop from value', () => {
  expectPath(simpleObj, 'UP', ['properties', 1, 'value'], ['properties', 0]);
});


const withArray = {
  lookAt: [
    'me'
  ],
  nextProp: 'hai'
};

test('goes from key to array value', () => {
  expectPath(withArray, 'DOWN', ['properties', 0, 'key'], ['properties', 0, 'value']);
});

test('goes down to end of array', () => {
  expectPath(
    withArray, 'DOWN',
    ['properties', 0, 'value', 'elements', 0, 'value'],
    ['properties', 0, 'value', 'elements', 'end']
  );
});

test('goes from end of array to last element', () => {
  expectPath(
    withArray, 'UP',
    ['properties', 0, 'value', 'elements', 'end'],
    ['properties', 0, 'value', 'elements', 0]
  );
});

test('goes to property after end of array', () => {
  expectPath(
    withArray, 'DOWN',
    ['properties', 0, 'value', 'elements', 'end'],
    ['properties', 1]
  );
});

test('stays the same for array value', () => {
  expectPath(withArray, 'DOWN', ['properties', 0, 'value'], ['properties', 0, 'value'])
});


const deepObj = {
  spawnedBy: {
    a: 'Jerry'
  }
};

test('stays the same for object value', () => {
  expectPath(deepObj, 'DOWN', ['properties', 0, 'value'], ['properties', 0, 'value'])
});

test('goes an object layer up', () => {
  expectPath(deepObj, 'UP', ['properties', 0, 'value', 'properties', 0, 'key'], ['properties', 0, 'key'])
});


test('goes an array layer up', () => {
  expectPath({
    arr: [
      'suchelement'
    ]
  }, 'UP', ['properties', 0, 'value', 'elements', 0, 'value'], ['properties', 0, 'key']);
});

test('goes to next prop, if current is empty array', () => {
  expectPath({
    empty: [],
    nextProp: 'oh hey'
  }, 'DOWN', ['properties', 0, 'key'], ['properties', 1]);
});

test('goes to next element', () => {
  expectPath([
    1,
    2
  ], 'DOWN', ['elements', 0], ['elements', 1]);
});

test('goes to obj element', () => {
  expectPath([
    1,
    {
      key: 'value'
    }
  ], 'DOWN', ['elements', 0], ['elements', 1]);
});