// @flow
'use strict';

/*::
type Print = mixed => string;
type Indent = string => string;

type Colors = {
  comment: {close: string, open: string},
  content: {close: string, open: string},
  prop: {close: string, open: string},
  tag: {close: string, open: string},
  value: {close: string, open: string},
};

export type Options = {
  edgeSpacing: string,
  highlight: boolean,
  indent: number,
  min: boolean,
  spacing: string,
};

type Position = {
  line: number,
  column: number,
};

type Location = {
  start: Position,
  end: Position,
};

type Node = {
  type: string,
  loc: Location,
  [key: string]: mixed,
};

type Path = {
  type: string,
  node: Node,
  [key: string]: mixed,
};
*/

function isNumber(val) {
  return typeof val === 'number';
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function isNodeLike(obj) {
  return typeof obj.type === 'string';
}

function isPathLike(obj) {
  return isNodeLike(obj) && obj.hasOwnProperty('node');
}

function printPositionValue(val) {
  return typeof val === 'number' ? String(val) : '';
}

function printPosition(position /*: Position */) {
  let res = '';
  let hasLine = isNumber(position.line);
  let hasColumn = isNumber(position.column);

  if (hasLine) res += position.line;
  if (hasLine && hasColumn) res += ':';
  if (hasColumn) res += position.column;

  return res;
}

function printLocation(location /*: Location */, colors /*: Colors */) {
  let res = '';
  let hasStart = isObject(location.start);
  let hasEnd = isObject(location.end);

  res += colors.comment.open;
  res += '(';
  if (hasStart) res += printPosition(location.start);
  if (hasStart && hasEnd) res += ', ';
  if (hasEnd) res += printPosition(location.end);
  res += colors.comment.close;
  res += ')';

  return res;
}

let DROP_KEYS = {
  type: true,
  start: true,
  end: true,
  loc: true,
};

function printPath(path /*: Path */, print, indent, opts, colors) {
  return printNode(path.node, print, indent, opts, colors);
}

function printNode(node /*: Node */, print, indent, opts, colors) {
  let res = '';

  res += colors.tag.open;
  res += '"' + node.type + '"';
  res += colors.tag.close;

  if (node.loc) {
    res += ' ' + printLocation(node.loc, colors);
  }

  let keys = Object.keys(node).filter(key => !DROP_KEYS[key]).sort();

  if (keys.length) {
    res += opts.edgeSpacing;

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let line = '';

      line += key;
      line += ': ';
      line += print(node[key]);

      res += indent(line);

      if (i < keys.length - 1) {
        res += opts.spacing;
      }
    }
  }

  return res;
}

module.exports = {
  test(val /*: any */) {
    return isObject(val) && typeof val.type === 'string';
  },

  print(
    val /*: Object */,
    print /*: Print */,
    indent /*: Indent */,
    opts /*: Options */,
    colors /*: Colors */
  ) {
    let res = '';

    if (isPathLike(val)) {
      if (!opts.min) res += 'Path ';
      val = val.node;
    } else {
      if (!opts.min) res += 'Node ';
    }

    res += printNode(val, print, indent, opts, colors);

    return res;
  },
};
