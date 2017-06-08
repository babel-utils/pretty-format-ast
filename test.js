// @flow
'use strict';

const prettyFormat = require('pretty-format');
const prettyFormatAST = require('./');

function testCase(val) {
  expect(
    prettyFormat(val, {
      plugins: [prettyFormatAST],
    })
  ).toMatchSnapshot();
}

function pos(line, column) {
  return {line, column};
}

function loc(start, end) {
  return {start, end};
}

function node(type, loc, props) {
  let start = loc.start ? loc.start.column : null;
  let end = loc.end ? loc.end.column : null;
  return Object.assign({}, {type, loc, start, end}, props);
}

function path(node) {
  return {type: node.type, node};
}

let plainLoc = loc(pos(1, 1), pos(1, 1));

test('print node', () => {
  testCase(
    node('Test', plainLoc, {
      a: true,
      b: 'hi',
      c: {
        x: 'hi',
      },
      d: [1],
    })
  );
});

test('print path', () => {
  testCase(
    path(
      node('FunctionDeclaration', plainLoc, {
        id: node('Identifier', plainLoc, {
          name: 'foo',
        }),
      })
    )
  );
});

test('loc zeroes', () => {
  testCase(node('Test', loc(pos(0, 0), pos(0, 0)), {}));
});

const REAL_AST = {
  type: 'FunctionDeclaration',
  start: 0,
  end: 31,
  loc: {
    start: {
      line: 1,
      column: 0,
    },
    end: {
      line: 1,
      column: 31,
    },
    lines: {},
    indent: 0,
  },
  id: {
    type: 'Identifier',
    start: 9,
    end: 10,
    loc: {
      start: {
        line: 1,
        column: 9,
      },
      end: {
        line: 1,
        column: 10,
      },
      identifierName: 'a',
      lines: {},
      indent: 0,
    },
    name: 'a',
  },
  generator: false,
  expression: false,
  async: false,
  params: [
    {
      type: 'Identifier',
      start: 11,
      end: 18,
      loc: {
        start: {
          line: 1,
          column: 11,
        },
        end: {
          line: 1,
          column: 18,
        },
        identifierName: 'b',
        lines: {},
        indent: 0,
      },
      name: 'b',
      typeAnnotation: {
        type: 'TypeAnnotation',
        start: 12,
        end: 18,
        loc: {
          start: {
            line: 1,
            column: 12,
          },
          end: {
            line: 1,
            column: 18,
          },
          lines: {},
          indent: 0,
        },
        typeAnnotation: {
          type: 'StringLiteralTypeAnnotation',
          start: 14,
          end: 18,
          loc: {
            start: {
              line: 1,
              column: 14,
            },
            end: {
              line: 1,
              column: 18,
            },
            lines: {},
            indent: 0,
          },
          extra: {
            rawValue: 'hi',
            raw: '"hi"',
          },
          value: 'hi',
        },
      },
    },
    {
      type: 'Identifier',
      start: 20,
      end: 21,
      loc: {
        start: {
          line: 1,
          column: 20,
        },
        end: {
          line: 1,
          column: 21,
        },
        identifierName: 'c',
        lines: {},
        indent: 0,
      },
      name: 'c',
    },
    {
      type: 'RestElement',
      start: 23,
      end: 27,
      loc: {
        start: {
          line: 1,
          column: 23,
        },
        end: {
          line: 1,
          column: 27,
        },
        lines: {},
        indent: 0,
      },
      argument: {
        type: 'Identifier',
        start: 26,
        end: 27,
        loc: {
          start: {
            line: 1,
            column: 26,
          },
          end: {
            line: 1,
            column: 27,
          },
          identifierName: 'd',
          lines: {},
          indent: 0,
        },
        name: 'd',
      },
    },
  ],
  body: {
    type: 'BlockStatement',
    start: 29,
    end: 31,
    loc: {
      start: {
        line: 1,
        column: 29,
      },
      end: {
        line: 1,
        column: 31,
      },
      lines: {},
      indent: 0,
    },
    body: [],
    directives: [],
  },
  __clone: () => true,
};

test('print real ast', () => {
  testCase(REAL_AST);
});
