
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
  'use strict';

  // https://github.com/python/cpython/blob/a74eea238f5baba15797e2e8b570d153bc8690a7/Modules/mathmodule.c#L1423
  class Adder {
    constructor() {
      this._partials = new Float64Array(32);
      this._n = 0;
    }
    add(x) {
      const p = this._partials;
      let i = 0;
      for (let j = 0; j < this._n && j < 32; j++) {
        const y = p[j],
          hi = x + y,
          lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
        if (lo) p[i++] = lo;
        x = hi;
      }
      p[i] = x;
      this._n = i + 1;
      return this;
    }
    valueOf() {
      const p = this._partials;
      let n = this._n, x, y, lo, hi = 0;
      if (n > 0) {
        hi = p[--n];
        while (n > 0) {
          x = hi;
          y = p[--n];
          hi = x + y;
          lo = y - (hi - x);
          if (lo) break;
        }
        if (n > 0 && ((lo < 0 && p[n - 1] < 0) || (lo > 0 && p[n - 1] > 0))) {
          y = lo * 2;
          x = hi + y;
          if (y == x - hi) hi = x;
        }
      }
      return hi;
    }
  }

  function* flatten(arrays) {
    for (const array of arrays) {
      yield* array;
    }
  }

  function merge(arrays) {
    return Array.from(flatten(arrays));
  }

  var noop$1 = {value: () => {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames$1(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames$1(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get$1(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set$1(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection$1(subgroups, this._parents);
  }

  function array(x) {
    return typeof x === "object" && "length" in x
      ? x // Array, TypedArray, NodeList, array-like
      : Array.from(x); // Map, Set, iterable, string, or anything else
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function arrayAll(select) {
    return function() {
      var group = select.apply(this, arguments);
      return group == null ? [] : array(group);
    };
  }

  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection$1(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  var find = Array.prototype.find;

  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }

  function childFirst() {
    return this.firstElementChild;
  }

  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  var filter = Array.prototype.filter;

  function children() {
    return this.children;
  }

  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }

  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection$1(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant$1(x) {
    return function() {
      return x;
    };
  }

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }

  function datum(node) {
    return node.__data__;
  }

  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant$1(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = array(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection$1(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit() {
    return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
    if (onupdate != null) update = onupdate(update);
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(selection) {
    if (!(selection instanceof Selection$1)) throw new Error("invalid merge");

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection$1(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection$1(sortgroups, this._parents).order();
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    return Array.from(this);
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove$1(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS$1(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction$1(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS$1(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove$1(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant$1(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction$1(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove$1 : typeof value === "function"
              ? styleFunction$1
              : styleConstant$1)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant$1(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction$1
            : textConstant$1)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }

  function parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, options) {
    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  var root = [null];

  function Selection$1(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection$1([[document.documentElement]], root);
  }

  function selection_selection() {
    return this;
  }

  Selection$1.prototype = selection.prototype = {
    constructor: Selection$1,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
        : new Selection$1([[selector]], root);
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    copy: function(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });

  function color_formatHex() {
    return this.rgb().formatHex();
  }

  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }

  function color_formatRgb() {
    return this.rgb().formatRgb();
  }

  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));

  function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  }

  function rgb_formatRgb() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }

  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "hsl(" : "hsla(")
          + (this.h || 0) + ", "
          + (this.s || 0) * 100 + "%, "
          + (this.l || 0) * 100 + "%"
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var constant = x => () => x;

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb$1(start, end) {
      var r = color((start = rgb(start)).r, (end = rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$1.gamma = rgbGamma;

    return rgb$1;
  })(1);

  function interpolateNumber(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  var degrees$1 = 180 / Math.PI;

  var identity$1 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees$1,
      skewX: Math.atan(skewX) * degrees$1,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var svgNode;

  /* eslint-disable no-undef */
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
  }

  function parseSvg(value) {
    if (value == null) return identity$1;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  var frame = 0, // is an animation frame pending?
      timeout$1 = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout$1 = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout$1) timeout$1 = clearTimeout(timeout$1);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  function timeout(callback, delay, time) {
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(elapsed => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch("start", "end", "cancel", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = get(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set(node, id) {
    var schedule = get(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }

  function get(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }

  function create(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout(start);

        // Interrupt the active transition, if any.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions.
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(node, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule.tween = tween1;
    };
  }

  function transition_tween(name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function() {
      var schedule = set(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });

    return function(node) {
      return get(node, id).value[name];
    };
  }

  function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color ? interpolateRgb
        : (c = color(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrConstantNS(fullname, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function attrFunctionNS(fullname, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
        : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
  }

  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }

  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }

  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }

  function transition_delay(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function() {
      set(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function() {
      set(this, id).duration = value;
    };
  }

  function transition_duration(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set(this, id).ease = value;
    };
  }

  function transition_ease(value) {
    var id = this._id;

    return arguments.length
        ? this.each(easeConstant(id, value))
        : get(this.node(), id).ease;
  }

  function easeVarying(id, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error;
      set(this, id).ease = v;
    };
  }

  function transition_easeVarying(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
  }

  function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;

    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? init : set;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule.on = on1;
    };
  }

  function transition_on(name, listener) {
    var id = this._id;

    return arguments.length < 2
        ? get(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }

  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection = selection.prototype.constructor;

  function transition_selection() {
    return new Selection(this._groups, this._parents);
  }

  function styleNull(name, interpolate) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function styleFunction(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          value1 = value(this),
          string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
      var schedule = set(this, id),
          on = schedule.on,
          listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

      schedule.on = on1;
    };
  }

  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
    return value == null ? this
        .styleTween(name, styleNull(name, i))
        .on("end.style." + name, styleRemove(name))
      : typeof value === "function" ? this
        .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
        .each(styleMaybeRemove(this._id, name))
      : this
        .styleTween(name, styleConstant(name, i, value), priority)
        .on("end.style." + name, null);
  }

  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }

  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction(tweenValue(this, "text", value))
        : textConstant(value == null ? "" : value + ""));
  }

  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }

  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_textTween(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
  }

  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  function transition_end() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = {value: reject},
          end = {value: function() { if (--size === 0) resolve(); }};

      that.each(function() {
        var schedule = set(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }

        schedule.on = on1;
      });

      // The selection was empty, resolve end immediately
      if (size === 0) resolve();
    });
  }

  var id = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function newId() {
    return ++id;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    easeVarying: transition_easeVarying,
    end: transition_end,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id} not found`);
      }
    }
    return timing;
  }

  function selection_transition(name) {
    var id,
        timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  var epsilon = 1e-6;
  var epsilon2 = 1e-12;
  var pi = Math.PI;
  var halfPi = pi / 2;
  var quarterPi = pi / 4;
  var tau = pi * 2;

  var degrees = 180 / pi;
  var radians = pi / 180;

  var abs = Math.abs;
  var atan = Math.atan;
  var atan2 = Math.atan2;
  var cos = Math.cos;
  var sin = Math.sin;
  var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
  var sqrt = Math.sqrt;

  function acos(x) {
    return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
  }

  function asin(x) {
    return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
  }

  function noop() {}

  function streamGeometry(geometry, stream) {
    if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
      streamGeometryType[geometry.type](geometry, stream);
    }
  }

  var streamObjectType = {
    Feature: function(object, stream) {
      streamGeometry(object.geometry, stream);
    },
    FeatureCollection: function(object, stream) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) streamGeometry(features[i].geometry, stream);
    }
  };

  var streamGeometryType = {
    Sphere: function(object, stream) {
      stream.sphere();
    },
    Point: function(object, stream) {
      object = object.coordinates;
      stream.point(object[0], object[1], object[2]);
    },
    MultiPoint: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
    },
    LineString: function(object, stream) {
      streamLine(object.coordinates, stream, 0);
    },
    MultiLineString: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) streamLine(coordinates[i], stream, 0);
    },
    Polygon: function(object, stream) {
      streamPolygon(object.coordinates, stream);
    },
    MultiPolygon: function(object, stream) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) streamPolygon(coordinates[i], stream);
    },
    GeometryCollection: function(object, stream) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) streamGeometry(geometries[i], stream);
    }
  };

  function streamLine(coordinates, stream, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    stream.lineStart();
    while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
    stream.lineEnd();
  }

  function streamPolygon(coordinates, stream) {
    var i = -1, n = coordinates.length;
    stream.polygonStart();
    while (++i < n) streamLine(coordinates[i], stream, 1);
    stream.polygonEnd();
  }

  function geoStream(object, stream) {
    if (object && streamObjectType.hasOwnProperty(object.type)) {
      streamObjectType[object.type](object, stream);
    } else {
      streamGeometry(object, stream);
    }
  }

  function spherical(cartesian) {
    return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
  }

  function cartesian(spherical) {
    var lambda = spherical[0], phi = spherical[1], cosPhi = cos(phi);
    return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
  }

  function cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cartesianCross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  // TODO return a
  function cartesianAddInPlace(a, b) {
    a[0] += b[0], a[1] += b[1], a[2] += b[2];
  }

  function cartesianScale(vector, k) {
    return [vector[0] * k, vector[1] * k, vector[2] * k];
  }

  // TODO return d
  function cartesianNormalizeInPlace(d) {
    var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l, d[1] /= l, d[2] /= l;
  }

  function compose(a, b) {

    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }

    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };

    return compose;
  }

  function rotationIdentity(lambda, phi) {
    return [abs(lambda) > pi ? lambda + Math.round(-lambda / tau) * tau : lambda, phi];
  }

  rotationIdentity.invert = rotationIdentity;

  function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
    return (deltaLambda %= tau) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
      : rotationLambda(deltaLambda))
      : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
      : rotationIdentity);
  }

  function forwardRotationLambda(deltaLambda) {
    return function(lambda, phi) {
      return lambda += deltaLambda, [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
    };
  }

  function rotationLambda(deltaLambda) {
    var rotation = forwardRotationLambda(deltaLambda);
    rotation.invert = forwardRotationLambda(-deltaLambda);
    return rotation;
  }

  function rotationPhiGamma(deltaPhi, deltaGamma) {
    var cosDeltaPhi = cos(deltaPhi),
        sinDeltaPhi = sin(deltaPhi),
        cosDeltaGamma = cos(deltaGamma),
        sinDeltaGamma = sin(deltaGamma);

    function rotation(lambda, phi) {
      var cosPhi = cos(phi),
          x = cos(lambda) * cosPhi,
          y = sin(lambda) * cosPhi,
          z = sin(phi),
          k = z * cosDeltaPhi + x * sinDeltaPhi;
      return [
        atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
        asin(k * cosDeltaGamma + y * sinDeltaGamma)
      ];
    }

    rotation.invert = function(lambda, phi) {
      var cosPhi = cos(phi),
          x = cos(lambda) * cosPhi,
          y = sin(lambda) * cosPhi,
          z = sin(phi),
          k = z * cosDeltaGamma - y * sinDeltaGamma;
      return [
        atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
        asin(k * cosDeltaPhi - x * sinDeltaPhi)
      ];
    };

    return rotation;
  }

  // Generates a circle centered at [0°, 0°], with a given radius and precision.
  function circleStream(stream, radius, delta, direction, t0, t1) {
    if (!delta) return;
    var cosRadius = cos(radius),
        sinRadius = sin(radius),
        step = direction * delta;
    if (t0 == null) {
      t0 = radius + direction * tau;
      t1 = radius - step / 2;
    } else {
      t0 = circleRadius(cosRadius, t0);
      t1 = circleRadius(cosRadius, t1);
      if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau;
    }
    for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
      point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
      stream.point(point[0], point[1]);
    }
  }

  // Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
  function circleRadius(cosRadius, point) {
    point = cartesian(point), point[0] -= cosRadius;
    cartesianNormalizeInPlace(point);
    var radius = acos(-point[1]);
    return ((-point[2] < 0 ? -radius : radius) + tau - epsilon) % tau;
  }

  function clipBuffer() {
    var lines = [],
        line;
    return {
      point: function(x, y, m) {
        line.push([x, y, m]);
      },
      lineStart: function() {
        lines.push(line = []);
      },
      lineEnd: noop,
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      },
      result: function() {
        var result = lines;
        lines = [];
        line = null;
        return result;
      }
    };
  }

  function pointEqual(a, b) {
    return abs(a[0] - b[0]) < epsilon && abs(a[1] - b[1]) < epsilon;
  }

  function Intersection(point, points, other, entry) {
    this.x = point;
    this.z = points;
    this.o = other; // another intersection
    this.e = entry; // is an entry?
    this.v = false; // visited
    this.n = this.p = null; // next & previous
  }

  // A generalized polygon clipping algorithm: given a polygon that has been cut
  // into its visible line segments, and rejoins the segments by interpolating
  // along the clip edge.
  function clipRejoin(segments, compareIntersection, startInside, interpolate, stream) {
    var subject = [],
        clip = [],
        i,
        n;

    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n], x;

      if (pointEqual(p0, p1)) {
        if (!p0[2] && !p1[2]) {
          stream.lineStart();
          for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
          stream.lineEnd();
          return;
        }
        // handle degenerate cases by moving the point
        p1[0] += 2 * epsilon;
      }

      subject.push(x = new Intersection(p0, segment, null, true));
      clip.push(x.o = new Intersection(p0, null, x, false));
      subject.push(x = new Intersection(p1, segment, null, false));
      clip.push(x.o = new Intersection(p1, null, x, true));
    });

    if (!subject.length) return;

    clip.sort(compareIntersection);
    link(subject);
    link(clip);

    for (i = 0, n = clip.length; i < n; ++i) {
      clip[i].e = startInside = !startInside;
    }

    var start = subject[0],
        points,
        point;

    while (1) {
      // Find first unvisited intersection.
      var current = start,
          isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      stream.lineStart();
      do {
        current.v = current.o.v = true;
        if (current.e) {
          if (isSubject) {
            for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.n.x, 1, stream);
          }
          current = current.n;
        } else {
          if (isSubject) {
            points = current.p.z;
            for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.p.x, -1, stream);
          }
          current = current.p;
        }
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      } while (!current.v);
      stream.lineEnd();
    }
  }

  function link(array) {
    if (!(n = array.length)) return;
    var n,
        i = 0,
        a = array[0],
        b;
    while (++i < n) {
      a.n = b = array[i];
      b.p = a;
      a = b;
    }
    a.n = b = array[0];
    b.p = a;
  }

  function longitude(point) {
    if (abs(point[0]) <= pi)
      return point[0];
    else
      return sign(point[0]) * ((abs(point[0]) + pi) % tau - pi);
  }

  function polygonContains(polygon, point) {
    var lambda = longitude(point),
        phi = point[1],
        sinPhi = sin(phi),
        normal = [sin(lambda), -cos(lambda), 0],
        angle = 0,
        winding = 0;

    var sum = new Adder();

    if (sinPhi === 1) phi = halfPi + epsilon;
    else if (sinPhi === -1) phi = -halfPi - epsilon;

    for (var i = 0, n = polygon.length; i < n; ++i) {
      if (!(m = (ring = polygon[i]).length)) continue;
      var ring,
          m,
          point0 = ring[m - 1],
          lambda0 = longitude(point0),
          phi0 = point0[1] / 2 + quarterPi,
          sinPhi0 = sin(phi0),
          cosPhi0 = cos(phi0);

      for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
        var point1 = ring[j],
            lambda1 = longitude(point1),
            phi1 = point1[1] / 2 + quarterPi,
            sinPhi1 = sin(phi1),
            cosPhi1 = cos(phi1),
            delta = lambda1 - lambda0,
            sign = delta >= 0 ? 1 : -1,
            absDelta = sign * delta,
            antimeridian = absDelta > pi,
            k = sinPhi0 * sinPhi1;

        sum.add(atan2(k * sign * sin(absDelta), cosPhi0 * cosPhi1 + k * cos(absDelta)));
        angle += antimeridian ? delta + sign * tau : delta;

        // Are the longitudes either side of the point’s meridian (lambda),
        // and are the latitudes smaller than the parallel (phi)?
        if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
          var arc = cartesianCross(cartesian(point0), cartesian(point1));
          cartesianNormalizeInPlace(arc);
          var intersection = cartesianCross(normal, arc);
          cartesianNormalizeInPlace(intersection);
          var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
          if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
            winding += antimeridian ^ delta >= 0 ? 1 : -1;
          }
        }
      }
    }

    // First, determine whether the South pole is inside or outside:
    //
    // It is inside if:
    // * the polygon winds around it in a clockwise direction.
    // * the polygon does not (cumulatively) wind around it, but has a negative
    //   (counter-clockwise) area.
    //
    // Second, count the (signed) number of times a segment crosses a lambda
    // from the point to the South pole.  If it is zero, then the point is the
    // same side as the South pole.

    return (angle < -epsilon || angle < epsilon && sum < -epsilon2) ^ (winding & 1);
  }

  function clip(pointVisible, clipLine, interpolate, start) {
    return function(sink) {
      var line = clipLine(sink),
          ringBuffer = clipBuffer(),
          ringSink = clipLine(ringBuffer),
          polygonStarted = false,
          polygon,
          segments,
          ring;

      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = merge(segments);
          var startInside = polygonContains(polygon, start);
          if (segments.length) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            clipRejoin(segments, compareIntersection, startInside, interpolate, sink);
          } else if (startInside) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            sink.lineStart();
            interpolate(null, null, 1, sink);
            sink.lineEnd();
          }
          if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
          segments = polygon = null;
        },
        sphere: function() {
          sink.polygonStart();
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
          sink.polygonEnd();
        }
      };

      function point(lambda, phi) {
        if (pointVisible(lambda, phi)) sink.point(lambda, phi);
      }

      function pointLine(lambda, phi) {
        line.point(lambda, phi);
      }

      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }

      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }

      function pointRing(lambda, phi) {
        ring.push([lambda, phi]);
        ringSink.point(lambda, phi);
      }

      function ringStart() {
        ringSink.lineStart();
        ring = [];
      }

      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringSink.lineEnd();

        var clean = ringSink.clean(),
            ringSegments = ringBuffer.result(),
            i, n = ringSegments.length, m,
            segment,
            point;

        ring.pop();
        polygon.push(ring);
        ring = null;

        if (!n) return;

        // No intersections.
        if (clean & 1) {
          segment = ringSegments[0];
          if ((m = segment.length - 1) > 0) {
            if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
            sink.lineStart();
            for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
            sink.lineEnd();
          }
          return;
        }

        // Rejoin connected segments.
        // TODO reuse ringBuffer.rejoin()?
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

        segments.push(ringSegments.filter(validSegment));
      }

      return clip;
    };
  }

  function validSegment(segment) {
    return segment.length > 1;
  }

  // Intersections are sorted along the clip edge. For both antimeridian cutting
  // and circle clipping, the same comparison is used.
  function compareIntersection(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon : halfPi - a[1])
         - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon : halfPi - b[1]);
  }

  var clipAntimeridian = clip(
    function() { return true; },
    clipAntimeridianLine,
    clipAntimeridianInterpolate,
    [-pi, -halfPi]
  );

  // Takes a line and cuts into visible segments. Return values: 0 - there were
  // intersections or the line was empty; 1 - no intersections; 2 - there were
  // intersections, and the first and last segments should be rejoined.
  function clipAntimeridianLine(stream) {
    var lambda0 = NaN,
        phi0 = NaN,
        sign0 = NaN,
        clean; // no intersections

    return {
      lineStart: function() {
        stream.lineStart();
        clean = 1;
      },
      point: function(lambda1, phi1) {
        var sign1 = lambda1 > 0 ? pi : -pi,
            delta = abs(lambda1 - lambda0);
        if (abs(delta - pi) < epsilon) { // line crosses a pole
          stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi : -halfPi);
          stream.point(sign0, phi0);
          stream.lineEnd();
          stream.lineStart();
          stream.point(sign1, phi0);
          stream.point(lambda1, phi0);
          clean = 0;
        } else if (sign0 !== sign1 && delta >= pi) { // line crosses antimeridian
          if (abs(lambda0 - sign0) < epsilon) lambda0 -= sign0 * epsilon; // handle degeneracies
          if (abs(lambda1 - sign1) < epsilon) lambda1 -= sign1 * epsilon;
          phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
          stream.point(sign0, phi0);
          stream.lineEnd();
          stream.lineStart();
          stream.point(sign1, phi0);
          clean = 0;
        }
        stream.point(lambda0 = lambda1, phi0 = phi1);
        sign0 = sign1;
      },
      lineEnd: function() {
        stream.lineEnd();
        lambda0 = phi0 = NaN;
      },
      clean: function() {
        return 2 - clean; // if intersections, rejoin first and last segments
      }
    };
  }

  function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
    var cosPhi0,
        cosPhi1,
        sinLambda0Lambda1 = sin(lambda0 - lambda1);
    return abs(sinLambda0Lambda1) > epsilon
        ? atan((sin(phi0) * (cosPhi1 = cos(phi1)) * sin(lambda1)
            - sin(phi1) * (cosPhi0 = cos(phi0)) * sin(lambda0))
            / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
        : (phi0 + phi1) / 2;
  }

  function clipAntimeridianInterpolate(from, to, direction, stream) {
    var phi;
    if (from == null) {
      phi = direction * halfPi;
      stream.point(-pi, phi);
      stream.point(0, phi);
      stream.point(pi, phi);
      stream.point(pi, 0);
      stream.point(pi, -phi);
      stream.point(0, -phi);
      stream.point(-pi, -phi);
      stream.point(-pi, 0);
      stream.point(-pi, phi);
    } else if (abs(from[0] - to[0]) > epsilon) {
      var lambda = from[0] < to[0] ? pi : -pi;
      phi = direction * lambda / 2;
      stream.point(-lambda, phi);
      stream.point(0, phi);
      stream.point(lambda, phi);
    } else {
      stream.point(to[0], to[1]);
    }
  }

  function clipCircle(radius) {
    var cr = cos(radius),
        delta = 6 * radians,
        smallRadius = cr > 0,
        notHemisphere = abs(cr) > epsilon; // TODO optimise for this common case

    function interpolate(from, to, direction, stream) {
      circleStream(stream, radius, delta, direction, from, to);
    }

    function visible(lambda, phi) {
      return cos(lambda) * cos(phi) > cr;
    }

    // Takes a line and cuts into visible segments. Return values used for polygon
    // clipping: 0 - there were intersections or the line was empty; 1 - no
    // intersections 2 - there were intersections, and the first and last segments
    // should be rejoined.
    function clipLine(stream) {
      var point0, // previous point
          c0, // code for previous point
          v0, // visibility of previous point
          v00, // visibility of first point
          clean; // no intersections
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(lambda, phi) {
          var point1 = [lambda, phi],
              point2,
              v = visible(lambda, phi),
              c = smallRadius
                ? v ? 0 : code(lambda, phi)
                : v ? code(lambda + (lambda < 0 ? pi : -pi), phi) : 0;
          if (!point0 && (v00 = v0 = v)) stream.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (!point2 || pointEqual(point0, point2) || pointEqual(point1, point2))
              point1[2] = 1;
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              // outside going in
              stream.lineStart();
              point2 = intersect(point1, point0);
              stream.point(point2[0], point2[1]);
            } else {
              // inside going out
              point2 = intersect(point0, point1);
              stream.point(point2[0], point2[1], 2);
              stream.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            // If the codes for two points are different, or are both zero,
            // and there this segment intersects with the small circle.
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                stream.lineStart();
                stream.point(t[0][0], t[0][1]);
                stream.point(t[1][0], t[1][1]);
                stream.lineEnd();
              } else {
                stream.point(t[1][0], t[1][1]);
                stream.lineEnd();
                stream.lineStart();
                stream.point(t[0][0], t[0][1], 3);
              }
            }
          }
          if (v && (!point0 || !pointEqual(point0, point1))) {
            stream.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) stream.lineEnd();
          point0 = null;
        },
        // Rejoin first and last segments if there were intersections and the first
        // and last points were visible.
        clean: function() {
          return clean | ((v00 && v0) << 1);
        }
      };
    }

    // Intersects the great circle between a and b with the clip circle.
    function intersect(a, b, two) {
      var pa = cartesian(a),
          pb = cartesian(b);

      // We have two planes, n1.p = d1 and n2.p = d2.
      // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
      var n1 = [1, 0, 0], // normal
          n2 = cartesianCross(pa, pb),
          n2n2 = cartesianDot(n2, n2),
          n1n2 = n2[0], // cartesianDot(n1, n2),
          determinant = n2n2 - n1n2 * n1n2;

      // Two polar points.
      if (!determinant) return !two && a;

      var c1 =  cr * n2n2 / determinant,
          c2 = -cr * n1n2 / determinant,
          n1xn2 = cartesianCross(n1, n2),
          A = cartesianScale(n1, c1),
          B = cartesianScale(n2, c2);
      cartesianAddInPlace(A, B);

      // Solve |p(t)|^2 = 1.
      var u = n1xn2,
          w = cartesianDot(A, u),
          uu = cartesianDot(u, u),
          t2 = w * w - uu * (cartesianDot(A, A) - 1);

      if (t2 < 0) return;

      var t = sqrt(t2),
          q = cartesianScale(u, (-w - t) / uu);
      cartesianAddInPlace(q, A);
      q = spherical(q);

      if (!two) return q;

      // Two intersection points.
      var lambda0 = a[0],
          lambda1 = b[0],
          phi0 = a[1],
          phi1 = b[1],
          z;

      if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

      var delta = lambda1 - lambda0,
          polar = abs(delta - pi) < epsilon,
          meridian = polar || delta < epsilon;

      if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

      // Check that the first point is between a and b.
      if (meridian
          ? polar
            ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon ? phi0 : phi1)
            : phi0 <= q[1] && q[1] <= phi1
          : delta > pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
        var q1 = cartesianScale(u, (-w + t) / uu);
        cartesianAddInPlace(q1, A);
        return [q, spherical(q1)];
      }
    }

    // Generates a 4-bit vector representing the location of a point relative to
    // the small circle's bounding box.
    function code(lambda, phi) {
      var r = smallRadius ? radius : pi - radius,
          code = 0;
      if (lambda < -r) code |= 1; // left
      else if (lambda > r) code |= 2; // right
      if (phi < -r) code |= 4; // below
      else if (phi > r) code |= 8; // above
      return code;
    }

    return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi, radius - pi]);
  }

  function clipLine(a, b, x0, y0, x1, y1) {
    var ax = a[0],
        ay = a[1],
        bx = b[0],
        by = b[1],
        t0 = 0,
        t1 = 1,
        dx = bx - ax,
        dy = by - ay,
        r;

    r = x0 - ax;
    if (!dx && r > 0) return;
    r /= dx;
    if (dx < 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    } else if (dx > 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    }

    r = x1 - ax;
    if (!dx && r < 0) return;
    r /= dx;
    if (dx < 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    } else if (dx > 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    }

    r = y0 - ay;
    if (!dy && r > 0) return;
    r /= dy;
    if (dy < 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    } else if (dy > 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    }

    r = y1 - ay;
    if (!dy && r < 0) return;
    r /= dy;
    if (dy < 0) {
      if (r > t1) return;
      if (r > t0) t0 = r;
    } else if (dy > 0) {
      if (r < t0) return;
      if (r < t1) t1 = r;
    }

    if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
    if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
    return true;
  }

  var clipMax = 1e9, clipMin = -clipMax;

  // TODO Use d3-polygon’s polygonContains here for the ring check?
  // TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

  function clipRectangle(x0, y0, x1, y1) {

    function visible(x, y) {
      return x0 <= x && x <= x1 && y0 <= y && y <= y1;
    }

    function interpolate(from, to, direction, stream) {
      var a = 0, a1 = 0;
      if (from == null
          || (a = corner(from, direction)) !== (a1 = corner(to, direction))
          || comparePoint(from, to) < 0 ^ direction > 0) {
        do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
        while ((a = (a + direction + 4) % 4) !== a1);
      } else {
        stream.point(to[0], to[1]);
      }
    }

    function corner(p, direction) {
      return abs(p[0] - x0) < epsilon ? direction > 0 ? 0 : 3
          : abs(p[0] - x1) < epsilon ? direction > 0 ? 2 : 1
          : abs(p[1] - y0) < epsilon ? direction > 0 ? 1 : 0
          : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
    }

    function compareIntersection(a, b) {
      return comparePoint(a.x, b.x);
    }

    function comparePoint(a, b) {
      var ca = corner(a, 1),
          cb = corner(b, 1);
      return ca !== cb ? ca - cb
          : ca === 0 ? b[1] - a[1]
          : ca === 1 ? a[0] - b[0]
          : ca === 2 ? a[1] - b[1]
          : b[0] - a[0];
    }

    return function(stream) {
      var activeStream = stream,
          bufferStream = clipBuffer(),
          segments,
          polygon,
          ring,
          x__, y__, v__, // first point
          x_, y_, v_, // previous point
          first,
          clean;

      var clipStream = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: polygonStart,
        polygonEnd: polygonEnd
      };

      function point(x, y) {
        if (visible(x, y)) activeStream.point(x, y);
      }

      function polygonInside() {
        var winding = 0;

        for (var i = 0, n = polygon.length; i < n; ++i) {
          for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
            a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
            if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
            else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
          }
        }

        return winding;
      }

      // Buffer geometry within a polygon and then clip it en masse.
      function polygonStart() {
        activeStream = bufferStream, segments = [], polygon = [], clean = true;
      }

      function polygonEnd() {
        var startInside = polygonInside(),
            cleanInside = clean && startInside,
            visible = (segments = merge(segments)).length;
        if (cleanInside || visible) {
          stream.polygonStart();
          if (cleanInside) {
            stream.lineStart();
            interpolate(null, null, 1, stream);
            stream.lineEnd();
          }
          if (visible) {
            clipRejoin(segments, compareIntersection, startInside, interpolate, stream);
          }
          stream.polygonEnd();
        }
        activeStream = stream, segments = polygon = ring = null;
      }

      function lineStart() {
        clipStream.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }

      // TODO rather than special-case polygons, simply handle them separately.
      // Ideally, coincident intersection points should be jittered to avoid
      // clipping issues.
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferStream.rejoin();
          segments.push(bufferStream.result());
        }
        clipStream.point = point;
        if (v_) activeStream.lineEnd();
      }

      function linePoint(x, y) {
        var v = visible(x, y);
        if (polygon) ring.push([x, y]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
          }
        } else {
          if (v && v_) activeStream.point(x, y);
          else {
            var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
                b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
            if (clipLine(a, b, x0, y0, x1, y1)) {
              if (!v_) {
                activeStream.lineStart();
                activeStream.point(a[0], a[1]);
              }
              activeStream.point(b[0], b[1]);
              if (!v) activeStream.lineEnd();
              clean = false;
            } else if (v) {
              activeStream.lineStart();
              activeStream.point(x, y);
              clean = false;
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }

      return clipStream;
    };
  }

  var identity = x => x;

  var areaSum = new Adder(),
      areaRingSum = new Adder(),
      x00$2,
      y00$2,
      x0$3,
      y0$3;

  var areaStream = {
    point: noop,
    lineStart: noop,
    lineEnd: noop,
    polygonStart: function() {
      areaStream.lineStart = areaRingStart;
      areaStream.lineEnd = areaRingEnd;
    },
    polygonEnd: function() {
      areaStream.lineStart = areaStream.lineEnd = areaStream.point = noop;
      areaSum.add(abs(areaRingSum));
      areaRingSum = new Adder();
    },
    result: function() {
      var area = areaSum / 2;
      areaSum = new Adder();
      return area;
    }
  };

  function areaRingStart() {
    areaStream.point = areaPointFirst;
  }

  function areaPointFirst(x, y) {
    areaStream.point = areaPoint;
    x00$2 = x0$3 = x, y00$2 = y0$3 = y;
  }

  function areaPoint(x, y) {
    areaRingSum.add(y0$3 * x - x0$3 * y);
    x0$3 = x, y0$3 = y;
  }

  function areaRingEnd() {
    areaPoint(x00$2, y00$2);
  }

  var x0$2 = Infinity,
      y0$2 = x0$2,
      x1 = -x0$2,
      y1 = x1;

  var boundsStream = {
    point: boundsPoint,
    lineStart: noop,
    lineEnd: noop,
    polygonStart: noop,
    polygonEnd: noop,
    result: function() {
      var bounds = [[x0$2, y0$2], [x1, y1]];
      x1 = y1 = -(y0$2 = x0$2 = Infinity);
      return bounds;
    }
  };

  function boundsPoint(x, y) {
    if (x < x0$2) x0$2 = x;
    if (x > x1) x1 = x;
    if (y < y0$2) y0$2 = y;
    if (y > y1) y1 = y;
  }

  // TODO Enforce positive area for exterior, negative area for interior?

  var X0 = 0,
      Y0 = 0,
      Z0 = 0,
      X1 = 0,
      Y1 = 0,
      Z1 = 0,
      X2 = 0,
      Y2 = 0,
      Z2 = 0,
      x00$1,
      y00$1,
      x0$1,
      y0$1;

  var centroidStream = {
    point: centroidPoint,
    lineStart: centroidLineStart,
    lineEnd: centroidLineEnd,
    polygonStart: function() {
      centroidStream.lineStart = centroidRingStart;
      centroidStream.lineEnd = centroidRingEnd;
    },
    polygonEnd: function() {
      centroidStream.point = centroidPoint;
      centroidStream.lineStart = centroidLineStart;
      centroidStream.lineEnd = centroidLineEnd;
    },
    result: function() {
      var centroid = Z2 ? [X2 / Z2, Y2 / Z2]
          : Z1 ? [X1 / Z1, Y1 / Z1]
          : Z0 ? [X0 / Z0, Y0 / Z0]
          : [NaN, NaN];
      X0 = Y0 = Z0 =
      X1 = Y1 = Z1 =
      X2 = Y2 = Z2 = 0;
      return centroid;
    }
  };

  function centroidPoint(x, y) {
    X0 += x;
    Y0 += y;
    ++Z0;
  }

  function centroidLineStart() {
    centroidStream.point = centroidPointFirstLine;
  }

  function centroidPointFirstLine(x, y) {
    centroidStream.point = centroidPointLine;
    centroidPoint(x0$1 = x, y0$1 = y);
  }

  function centroidPointLine(x, y) {
    var dx = x - x0$1, dy = y - y0$1, z = sqrt(dx * dx + dy * dy);
    X1 += z * (x0$1 + x) / 2;
    Y1 += z * (y0$1 + y) / 2;
    Z1 += z;
    centroidPoint(x0$1 = x, y0$1 = y);
  }

  function centroidLineEnd() {
    centroidStream.point = centroidPoint;
  }

  function centroidRingStart() {
    centroidStream.point = centroidPointFirstRing;
  }

  function centroidRingEnd() {
    centroidPointRing(x00$1, y00$1);
  }

  function centroidPointFirstRing(x, y) {
    centroidStream.point = centroidPointRing;
    centroidPoint(x00$1 = x0$1 = x, y00$1 = y0$1 = y);
  }

  function centroidPointRing(x, y) {
    var dx = x - x0$1,
        dy = y - y0$1,
        z = sqrt(dx * dx + dy * dy);

    X1 += z * (x0$1 + x) / 2;
    Y1 += z * (y0$1 + y) / 2;
    Z1 += z;

    z = y0$1 * x - x0$1 * y;
    X2 += z * (x0$1 + x);
    Y2 += z * (y0$1 + y);
    Z2 += z * 3;
    centroidPoint(x0$1 = x, y0$1 = y);
  }

  function PathContext(context) {
    this._context = context;
  }

  PathContext.prototype = {
    _radius: 4.5,
    pointRadius: function(_) {
      return this._radius = _, this;
    },
    polygonStart: function() {
      this._line = 0;
    },
    polygonEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line === 0) this._context.closePath();
      this._point = NaN;
    },
    point: function(x, y) {
      switch (this._point) {
        case 0: {
          this._context.moveTo(x, y);
          this._point = 1;
          break;
        }
        case 1: {
          this._context.lineTo(x, y);
          break;
        }
        default: {
          this._context.moveTo(x + this._radius, y);
          this._context.arc(x, y, this._radius, 0, tau);
          break;
        }
      }
    },
    result: noop
  };

  var lengthSum = new Adder(),
      lengthRing,
      x00,
      y00,
      x0,
      y0;

  var lengthStream = {
    point: noop,
    lineStart: function() {
      lengthStream.point = lengthPointFirst;
    },
    lineEnd: function() {
      if (lengthRing) lengthPoint(x00, y00);
      lengthStream.point = noop;
    },
    polygonStart: function() {
      lengthRing = true;
    },
    polygonEnd: function() {
      lengthRing = null;
    },
    result: function() {
      var length = +lengthSum;
      lengthSum = new Adder();
      return length;
    }
  };

  function lengthPointFirst(x, y) {
    lengthStream.point = lengthPoint;
    x00 = x0 = x, y00 = y0 = y;
  }

  function lengthPoint(x, y) {
    x0 -= x, y0 -= y;
    lengthSum.add(sqrt(x0 * x0 + y0 * y0));
    x0 = x, y0 = y;
  }

  function PathString() {
    this._string = [];
  }

  PathString.prototype = {
    _radius: 4.5,
    _circle: circle(4.5),
    pointRadius: function(_) {
      if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
      return this;
    },
    polygonStart: function() {
      this._line = 0;
    },
    polygonEnd: function() {
      this._line = NaN;
    },
    lineStart: function() {
      this._point = 0;
    },
    lineEnd: function() {
      if (this._line === 0) this._string.push("Z");
      this._point = NaN;
    },
    point: function(x, y) {
      switch (this._point) {
        case 0: {
          this._string.push("M", x, ",", y);
          this._point = 1;
          break;
        }
        case 1: {
          this._string.push("L", x, ",", y);
          break;
        }
        default: {
          if (this._circle == null) this._circle = circle(this._radius);
          this._string.push("M", x, ",", y, this._circle);
          break;
        }
      }
    },
    result: function() {
      if (this._string.length) {
        var result = this._string.join("");
        this._string = [];
        return result;
      } else {
        return null;
      }
    }
  };

  function circle(radius) {
    return "m0," + radius
        + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
        + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
        + "z";
  }

  function geoPath(projection, context) {
    var pointRadius = 4.5,
        projectionStream,
        contextStream;

    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        geoStream(object, projectionStream(contextStream));
      }
      return contextStream.result();
    }

    path.area = function(object) {
      geoStream(object, projectionStream(areaStream));
      return areaStream.result();
    };

    path.measure = function(object) {
      geoStream(object, projectionStream(lengthStream));
      return lengthStream.result();
    };

    path.bounds = function(object) {
      geoStream(object, projectionStream(boundsStream));
      return boundsStream.result();
    };

    path.centroid = function(object) {
      geoStream(object, projectionStream(centroidStream));
      return centroidStream.result();
    };

    path.projection = function(_) {
      return arguments.length ? (projectionStream = _ == null ? (projection = null, identity) : (projection = _).stream, path) : projection;
    };

    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return path;
    };

    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };

    return path.projection(projection).context(context);
  }

  function transformer(methods) {
    return function(stream) {
      var s = new TransformStream;
      for (var key in methods) s[key] = methods[key];
      s.stream = stream;
      return s;
    };
  }

  function TransformStream() {}

  TransformStream.prototype = {
    constructor: TransformStream,
    point: function(x, y) { this.stream.point(x, y); },
    sphere: function() { this.stream.sphere(); },
    lineStart: function() { this.stream.lineStart(); },
    lineEnd: function() { this.stream.lineEnd(); },
    polygonStart: function() { this.stream.polygonStart(); },
    polygonEnd: function() { this.stream.polygonEnd(); }
  };

  function fit(projection, fitBounds, object) {
    var clip = projection.clipExtent && projection.clipExtent();
    projection.scale(150).translate([0, 0]);
    if (clip != null) projection.clipExtent(null);
    geoStream(object, projection.stream(boundsStream));
    fitBounds(boundsStream.result());
    if (clip != null) projection.clipExtent(clip);
    return projection;
  }

  function fitExtent(projection, extent, object) {
    return fit(projection, function(b) {
      var w = extent[1][0] - extent[0][0],
          h = extent[1][1] - extent[0][1],
          k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
          x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
          y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }

  function fitSize(projection, size, object) {
    return fitExtent(projection, [[0, 0], size], object);
  }

  function fitWidth(projection, width, object) {
    return fit(projection, function(b) {
      var w = +width,
          k = w / (b[1][0] - b[0][0]),
          x = (w - k * (b[1][0] + b[0][0])) / 2,
          y = -k * b[0][1];
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }

  function fitHeight(projection, height, object) {
    return fit(projection, function(b) {
      var h = +height,
          k = h / (b[1][1] - b[0][1]),
          x = -k * b[0][0],
          y = (h - k * (b[1][1] + b[0][1])) / 2;
      projection.scale(150 * k).translate([x, y]);
    }, object);
  }

  var maxDepth = 16, // maximum depth of subdivision
      cosMinDistance = cos(30 * radians); // cos(minimum angular distance)

  function resample(project, delta2) {
    return +delta2 ? resample$1(project, delta2) : resampleNone(project);
  }

  function resampleNone(project) {
    return transformer({
      point: function(x, y) {
        x = project(x, y);
        this.stream.point(x[0], x[1]);
      }
    });
  }

  function resample$1(project, delta2) {

    function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0,
          dy = y1 - y0,
          d2 = dx * dx + dy * dy;
      if (d2 > 4 * delta2 && depth--) {
        var a = a0 + a1,
            b = b0 + b1,
            c = c0 + c1,
            m = sqrt(a * a + b * b + c * c),
            phi2 = asin(c /= m),
            lambda2 = abs(abs(c) - 1) < epsilon || abs(lambda0 - lambda1) < epsilon ? (lambda0 + lambda1) / 2 : atan2(b, a),
            p = project(lambda2, phi2),
            x2 = p[0],
            y2 = p[1],
            dx2 = x2 - x0,
            dy2 = y2 - y0,
            dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > delta2 // perpendicular projected distance
            || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
            || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
          resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
        }
      }
    }
    return function(stream) {
      var lambda00, x00, y00, a00, b00, c00, // first point
          lambda0, x0, y0, a0, b0, c0; // previous point

      var resampleStream = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
        polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
      };

      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }

      function lineStart() {
        x0 = NaN;
        resampleStream.point = linePoint;
        stream.lineStart();
      }

      function linePoint(lambda, phi) {
        var c = cartesian([lambda, phi]), p = project(lambda, phi);
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }

      function lineEnd() {
        resampleStream.point = point;
        stream.lineEnd();
      }

      function ringStart() {
        lineStart();
        resampleStream.point = ringPoint;
        resampleStream.lineEnd = ringEnd;
      }

      function ringPoint(lambda, phi) {
        linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resampleStream.point = linePoint;
      }

      function ringEnd() {
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
        resampleStream.lineEnd = lineEnd;
        lineEnd();
      }

      return resampleStream;
    };
  }

  var transformRadians = transformer({
    point: function(x, y) {
      this.stream.point(x * radians, y * radians);
    }
  });

  function transformRotate(rotate) {
    return transformer({
      point: function(x, y) {
        var r = rotate(x, y);
        return this.stream.point(r[0], r[1]);
      }
    });
  }

  function scaleTranslate(k, dx, dy, sx, sy) {
    function transform(x, y) {
      x *= sx; y *= sy;
      return [dx + k * x, dy - k * y];
    }
    transform.invert = function(x, y) {
      return [(x - dx) / k * sx, (dy - y) / k * sy];
    };
    return transform;
  }

  function scaleTranslateRotate(k, dx, dy, sx, sy, alpha) {
    if (!alpha) return scaleTranslate(k, dx, dy, sx, sy);
    var cosAlpha = cos(alpha),
        sinAlpha = sin(alpha),
        a = cosAlpha * k,
        b = sinAlpha * k,
        ai = cosAlpha / k,
        bi = sinAlpha / k,
        ci = (sinAlpha * dy - cosAlpha * dx) / k,
        fi = (sinAlpha * dx + cosAlpha * dy) / k;
    function transform(x, y) {
      x *= sx; y *= sy;
      return [a * x - b * y + dx, dy - b * x - a * y];
    }
    transform.invert = function(x, y) {
      return [sx * (ai * x - bi * y + ci), sy * (fi - bi * x - ai * y)];
    };
    return transform;
  }

  function projection(project) {
    return projectionMutator(function() { return project; })();
  }

  function projectionMutator(projectAt) {
    var project,
        k = 150, // scale
        x = 480, y = 250, // translate
        lambda = 0, phi = 0, // center
        deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, // pre-rotate
        alpha = 0, // post-rotate angle
        sx = 1, // reflectX
        sy = 1, // reflectX
        theta = null, preclip = clipAntimeridian, // pre-clip angle
        x0 = null, y0, x1, y1, postclip = identity, // post-clip extent
        delta2 = 0.5, // precision
        projectResample,
        projectTransform,
        projectRotateTransform,
        cache,
        cacheStream;

    function projection(point) {
      return projectRotateTransform(point[0] * radians, point[1] * radians);
    }

    function invert(point) {
      point = projectRotateTransform.invert(point[0], point[1]);
      return point && [point[0] * degrees, point[1] * degrees];
    }

    projection.stream = function(stream) {
      return cache && cacheStream === stream ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream)))));
    };

    projection.preclip = function(_) {
      return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
    };

    projection.postclip = function(_) {
      return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
    };

    projection.clipAngle = function(_) {
      return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
    };

    projection.clipExtent = function(_) {
      return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    };

    projection.scale = function(_) {
      return arguments.length ? (k = +_, recenter()) : k;
    };

    projection.translate = function(_) {
      return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
    };

    projection.center = function(_) {
      return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
    };

    projection.rotate = function(_) {
      return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
    };

    projection.angle = function(_) {
      return arguments.length ? (alpha = _ % 360 * radians, recenter()) : alpha * degrees;
    };

    projection.reflectX = function(_) {
      return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
    };

    projection.reflectY = function(_) {
      return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
    };

    projection.precision = function(_) {
      return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
    };

    projection.fitExtent = function(extent, object) {
      return fitExtent(projection, extent, object);
    };

    projection.fitSize = function(size, object) {
      return fitSize(projection, size, object);
    };

    projection.fitWidth = function(width, object) {
      return fitWidth(projection, width, object);
    };

    projection.fitHeight = function(height, object) {
      return fitHeight(projection, height, object);
    };

    function recenter() {
      var center = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)),
          transform = scaleTranslateRotate(k, x - center[0], y - center[1], sx, sy, alpha);
      rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma);
      projectTransform = compose(project, transform);
      projectRotateTransform = compose(rotate, projectTransform);
      projectResample = resample(projectTransform, delta2);
      return reset();
    }

    function reset() {
      cache = cacheStream = null;
      return projection;
    }

    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return recenter();
    };
  }

  function azimuthalInvert(angle) {
    return function(x, y) {
      var z = sqrt(x * x + y * y),
          c = angle(z),
          sc = sin(c),
          cc = cos(c);
      return [
        atan2(x * sc, z * cc),
        asin(z && y * sc / z)
      ];
    }
  }

  function orthographicRaw(x, y) {
    return [cos(y) * sin(x), sin(y)];
  }

  orthographicRaw.invert = azimuthalInvert(asin);

  function geoOrthographic() {
    return projection(orthographicRaw)
        .scale(249.5)
        .clipAngle(90 + epsilon);
  }

  var type$1 = "FeatureCollection";
  var features$1 = [
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-45.154757656421026,
  						-78.04706960058674
  					],
  					[
  						-43.33326677099711,
  						-80.02612273551293
  					],
  					[
  						-51.8531343247422,
  						-79.94772958772609
  					],
  					[
  						-48.66061601418244,
  						-78.0470187315987
  					],
  					[
  						-45.154757656421026,
  						-78.04706960058674
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-58.614142829001025,
  						-64.15246713013323
  					],
  					[
  						-62.5117602199671,
  						-65.09302987427762
  					],
  					[
  						-62.120078701410904,
  						-66.1903256226748
  					],
  					[
  						-65.50842485214048,
  						-67.58161020926883
  					],
  					[
  						-61.5129064601974,
  						-71.08904469821518
  					],
  					[
  						-60.69026933454316,
  						-73.166178894187
  					],
  					[
  						-61.963369920485604,
  						-74.4398479208848
  					],
  					[
  						-70.60072384304635,
  						-76.63449432388845
  					],
  					[
  						-77.92585812041938,
  						-78.37841888444225
  					],
  					[
  						-75.36009741891175,
  						-80.25954518017527
  					],
  					[
  						-63.25603003605087,
  						-81.74875660596248
  					],
  					[
  						-57.00811682801802,
  						-82.86569101351908
  					],
  					[
  						-49.761349860215546,
  						-81.72917123812384
  					],
  					[
  						-28.549802212018704,
  						-80.33793832796209
  					],
  					[
  						-29.685805223090966,
  						-79.26022633251506
  					],
  					[
  						-35.777009650198636,
  						-78.339248148765
  					],
  					[
  						-28.88277930349139,
  						-76.67366505956564
  					],
  					[
  						-21.224693772861798,
  						-75.90947397883339
  					],
  					[
  						-15.701490851290174,
  						-74.49860402440072
  					],
  					[
  						-15.446855231171952,
  						-73.14654184991616
  					],
  					[
  						-10.295774298534184,
  						-71.2654163616273
  					],
  					[
  						-7.416621873392444,
  						-71.69650115980613
  					],
  					[
  						0.868195428072994,
  						-71.30463877373688
  					],
  					[
  						9.525134718472202,
  						-70.01133270276813
  					],
  					[
  						19.259372592860103,
  						-69.89376881930411
  					],
  					[
  						27.09372643403725,
  						-70.46205454521788
  					],
  					[
  						32.754052768695345,
  						-69.38429087333856
  					],
  					[
  						33.87041873549671,
  						-68.50258758557466
  					],
  					[
  						38.6494035174168,
  						-69.7762049358401
  					],
  					[
  						40.02043094255245,
  						-69.10994069430103
  					],
  					[
  						52.614132521378934,
  						-66.05317637137213
  					],
  					[
  						56.355041131419995,
  						-65.97478322358539
  					],
  					[
  						58.744507684163835,
  						-67.28767466239267
  					],
  					[
  						62.38748945501183,
  						-68.01269500744765
  					],
  					[
  						64.05234907415914,
  						-67.40523854585669
  					],
  					[
  						68.8900382831628,
  						-67.9343018596609
  					],
  					[
  						69.55594078967582,
  						-69.67822642021471
  					],
  					[
  						67.81273969917405,
  						-70.30526824964429
  					],
  					[
  						71.02489505400465,
  						-72.08841522230776
  					],
  					[
  						73.86487674346913,
  						-69.87418345146557
  					],
  					[
  						77.6449044127551,
  						-69.4626840211254
  					],
  					[
  						79.11385867708393,
  						-68.32621592216245
  					],
  					[
  						82.77642581577041,
  						-67.20928151460592
  					],
  					[
  						87.4770174499038,
  						-66.8761752320525
  					],
  					[
  						99.71818240763506,
  						-67.24850392671549
  					],
  					[
  						102.83241092327253,
  						-65.5632837932452
  					],
  					[
  						106.18156050010882,
  						-66.93493133556831
  					],
  					[
  						113.60467329310737,
  						-65.8768047079599
  					],
  					[
  						115.60238081264643,
  						-66.69980356864036
  					],
  					[
  						120.87099979053218,
  						-67.18969614676729
  					],
  					[
  						122.32036868702235,
  						-66.5626543173377
  					],
  					[
  						128.80328047090242,
  						-66.75861134858847
  					],
  					[
  						135.8738049663734,
  						-66.0335910035335
  					],
  					[
  						137.46027143773395,
  						-66.95456837983924
  					],
  					[
  						145.49042728086502,
  						-66.91534596772976
  					],
  					[
  						146.64606733620823,
  						-67.89513112398362
  					],
  					[
  						152.50224734925243,
  						-68.87481292737299
  					],
  					[
  						154.28456749899917,
  						-68.56129201265819
  					],
  					[
  						159.18101281151874,
  						-69.59983327242796
  					],
  					[
  						162.68689700749624,
  						-70.73635304782312
  					],
  					[
  						168.42561648994106,
  						-70.97148081475115
  					],
  					[
  						171.20679039945745,
  						-71.69650115980613
  					],
  					[
  						169.2873209984081,
  						-73.65601979588172
  					],
  					[
  						166.09480268784844,
  						-74.3810401409367
  					],
  					[
  						163.48989708887981,
  						-77.06557912206718
  					],
  					[
  						166.99578128485732,
  						-78.75074757910517
  					],
  					[
  						161.76638471908117,
  						-79.16224781688967
  					],
  					[
  						159.78821089094825,
  						-80.94539478955305
  					],
  					[
  						180.00000000000014,
  						-84.71338
  					],
  					[
  						180.00000000000014,
  						-90.00000000000003
  					],
  					[
  						-180,
  						-90.00000000000003
  					],
  					[
  						-180,
  						-84.71338
  					],
  					[
  						-179.94249935617904,
  						-84.72144337355249
  					],
  					[
  						-167.02209937240343,
  						-84.57049651482791
  					],
  					[
  						-148.5330728830716,
  						-85.60903777459777
  					],
  					[
  						-142.89227943237563,
  						-84.57049651482791
  					],
  					[
  						-153.5862011383002,
  						-83.68868987419944
  					],
  					[
  						-152.86151669005505,
  						-82.04269215283864
  					],
  					[
  						-147.2207498850195,
  						-80.67104461051545
  					],
  					[
  						-149.5319008046251,
  						-79.35820484814045
  					],
  					[
  						-155.32937639058576,
  						-79.06426930126429
  					],
  					[
  						-156.97457312724606,
  						-77.30075856542751
  					],
  					[
  						-151.3337804839943,
  						-77.3987370810529
  					],
  					[
  						-144.32203712281108,
  						-75.53719696060277
  					],
  					[
  						-135.2145826956913,
  						-74.30269866958224
  					],
  					[
  						-116.2163116117835,
  						-74.24389088963403
  					],
  					[
  						-113.94433142785516,
  						-73.71482757582984
  					],
  					[
  						-107.55934648316813,
  						-75.18445363377842
  					],
  					[
  						-100.64553076862231,
  						-75.30201751724243
  					],
  					[
  						-100.31252783893346,
  						-72.75467946384683
  					],
  					[
  						-96.33659481482894,
  						-73.61684906020446
  					],
  					[
  						-88.42395117872962,
  						-73.0093925986135
  					],
  					[
  						-76.22187944202707,
  						-73.96954071059652
  					],
  					[
  						-68.93591590033134,
  						-73.0093925986135
  					],
  					[
  						-67.25154842799387,
  						-71.6377450562903
  					],
  					[
  						-68.48545244004302,
  						-70.10931121839351
  					],
  					[
  						-67.74118262395925,
  						-67.32684539806995
  					],
  					[
  						-63.00139441593248,
  						-64.64230803182787
  					],
  					[
  						-58.614142829001025,
  						-64.15246713013323
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-67.74999999999994,
  						-53.85
  					],
  					[
  						-65.50000000000003,
  						-55.19999999999996
  					],
  					[
  						-68.14862999999997,
  						-55.61182999999988
  					],
  					[
  						-71.00567999999996,
  						-55.05383000000004
  					],
  					[
  						-70.26747999999998,
  						-52.93123
  					],
  					[
  						-67.74999999999994,
  						-53.85
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						145.3979781434949,
  						-40.79254851660599
  					],
  					[
  						148.28906782449607,
  						-40.87543751400213
  					],
  					[
  						148.3598645367359,
  						-42.062445163746446
  					],
  					[
  						146.04837772032036,
  						-43.54974456153889
  					],
  					[
  						144.71807132383069,
  						-41.1625517718158
  					],
  					[
  						145.3979781434949,
  						-40.79254851660599
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						173.02037479074082,
  						-40.919052422856424
  					],
  					[
  						174.24851688058945,
  						-41.770008233406756
  					],
  					[
  						171.45292524646365,
  						-44.24251881284374
  					],
  					[
  						170.61669721911662,
  						-45.90892872495971
  					],
  					[
  						169.33233117093428,
  						-46.641235446967855
  					],
  					[
  						166.67688602118423,
  						-46.219917494492265
  					],
  					[
  						167.04642418850327,
  						-45.11094125750867
  					],
  					[
  						173.02037479074082,
  						-40.919052422856424
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						174.61200890533055,
  						-36.15639739354056
  					],
  					[
  						177.97046023997936,
  						-39.166342868812976
  					],
  					[
  						176.0124402204403,
  						-41.28962411882151
  					],
  					[
  						173.8240466657442,
  						-39.50885426204351
  					],
  					[
  						174.5748018740804,
  						-38.797683200842755
  					],
  					[
  						174.61200890533055,
  						-36.15639739354056
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						50.05651085795725,
  						-13.555761407122006
  					],
  					[
  						50.476536899625586,
  						-15.226512139550593
  					],
  					[
  						49.49861209493409,
  						-17.106035658438316
  					],
  					[
  						48.54854088724815,
  						-20.49688811613413
  					],
  					[
  						47.09576134622668,
  						-24.94162973399048
  					],
  					[
  						45.40950768411048,
  						-25.60143442149308
  					],
  					[
  						44.03972049334973,
  						-24.98834522878228
  					],
  					[
  						43.25418704608106,
  						-22.05741301848417
  					],
  					[
  						44.374325392439715,
  						-20.072366224856353
  					],
  					[
  						43.963084344261034,
  						-17.409944756746754
  					],
  					[
  						44.44651736835149,
  						-16.216219170804536
  					],
  					[
  						46.31224327981724,
  						-15.780018405828855
  					],
  					[
  						48.845060255738844,
  						-13.089174899958692
  					],
  					[
  						50.05651085795725,
  						-13.555761407122006
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						143.56181115130002,
  						-13.763655694232213
  					],
  					[
  						145.37472374896348,
  						-14.984976495018373
  					],
  					[
  						146.38747846901967,
  						-18.95827402107591
  					],
  					[
  						148.84841352762325,
  						-20.39120981209726
  					],
  					[
  						149.67833703023067,
  						-22.342511895438392
  					],
  					[
  						152.85519738180594,
  						-25.26750131602303
  					],
  					[
  						153.56946902894416,
  						-28.110066827102116
  					],
  					[
  						152.8915775901394,
  						-31.640445651986056
  					],
  					[
  						151.70911746643677,
  						-33.04134205498643
  					],
  					[
  						150.07521203023228,
  						-36.420205580390515
  					],
  					[
  						149.99728397033616,
  						-37.42526051203524
  					],
  					[
  						148.30462243061592,
  						-37.80906137466698
  					],
  					[
  						146.31792199115486,
  						-39.035756524411454
  					],
  					[
  						144.48568240781404,
  						-38.08532358169927
  					],
  					[
  						143.6099735861961,
  						-38.80946542740533
  					],
  					[
  						140.6385787294133,
  						-38.01933277766257
  					],
  					[
  						139.5741475770653,
  						-36.13836231867067
  					],
  					[
  						138.12074791885632,
  						-35.612296237939404
  					],
  					[
  						134.2739026226171,
  						-32.61723357516698
  					],
  					[
  						131.32633060112093,
  						-31.495803318001066
  					],
  					[
  						126.14871382050123,
  						-32.21596607842061
  					],
  					[
  						124.22164798390494,
  						-32.95948658623607
  					],
  					[
  						123.65966678273074,
  						-33.890179131812744
  					],
  					[
  						119.89369510302825,
  						-33.976065362281815
  					],
  					[
  						118.02497195848954,
  						-35.064732761374714
  					],
  					[
  						115.0268087097796,
  						-34.19651702243894
  					],
  					[
  						115.80164513556397,
  						-32.20506235120703
  					],
  					[
  						115.04003787644635,
  						-29.461095472940798
  					],
  					[
  						114.17357913620847,
  						-28.11807667410733
  					],
  					[
  						113.39352339076268,
  						-24.38476449961327
  					],
  					[
  						114.64776207891882,
  						-21.829519952077007
  					],
  					[
  						116.71161543179156,
  						-20.701681817306834
  					],
  					[
  						120.85622033089672,
  						-19.68370777758919
  					],
  					[
  						122.24166548064184,
  						-18.197648614171854
  					],
  					[
  						122.31277225147542,
  						-17.254967136303463
  					],
  					[
  						125.68579634003052,
  						-14.230655612853838
  					],
  					[
  						127.06586714081735,
  						-13.817967624570926
  					],
  					[
  						128.35968997610897,
  						-14.869169610252271
  					],
  					[
  						129.40960005098302,
  						-14.420669854391122
  					],
  					[
  						130.61779503796706,
  						-12.536392103732481
  					],
  					[
  						133.5508459819891,
  						-11.786515394745138
  					],
  					[
  						136.95162031468502,
  						-12.351958916882836
  					],
  					[
  						135.42866417861123,
  						-14.7154322241839
  					],
  					[
  						139.26057498591823,
  						-17.371600843986187
  					],
  					[
  						140.87546349503927,
  						-17.369068698803943
  					],
  					[
  						141.70218305884467,
  						-15.044921156476931
  					],
  					[
  						141.68699018775087,
  						-12.407614434461152
  					],
  					[
  						142.51526004452498,
  						-10.668185723516729
  					],
  					[
  						143.56181115130002,
  						-13.763655694232213
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						108.62347863162901,
  						-6.777673841990691
  					],
  					[
  						112.61481123255643,
  						-6.946035658397605
  					],
  					[
  						113.4647335144609,
  						-8.348947442257426
  					],
  					[
  						108.27776329959639,
  						-7.766657403192582
  					],
  					[
  						105.36548628135554,
  						-6.851416110871256
  					],
  					[
  						106.05164594932708,
  						-5.8959188777945
  					],
  					[
  						108.62347863162901,
  						-6.777673841990691
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						134.1433679546478,
  						-1.1518673641035946
  					],
  					[
  						134.4226273947531,
  						-2.7691846655423973
  					],
  					[
  						135.45760298069476,
  						-3.367752780779128
  					],
  					[
  						136.2933142437188,
  						-2.3070423315561897
  					],
  					[
  						138.3297274110448,
  						-1.7026864559027501
  					],
  					[
  						144.58397098203326,
  						-3.861417738463402
  					],
  					[
  						146.9709053895949,
  						-6.721656589386356
  					],
  					[
  						149.782310012002,
  						-10.393267103723943
  					],
  					[
  						147.91301842670802,
  						-10.130440769087471
  					],
  					[
  						146.04848107318494,
  						-8.06741423913131
  					],
  					[
  						144.74416792213808,
  						-7.630128269077474
  					],
  					[
  						143.28637576718435,
  						-8.245491224809072
  					],
  					[
  						142.62843143124425,
  						-9.326820570516503
  					],
  					[
  						141.0338517600139,
  						-9.117892754760518
  					],
  					[
  						138.6686214540148,
  						-7.320224704623087
  					],
  					[
  						137.92783979711086,
  						-5.393365573756
  					],
  					[
  						135.16459760959972,
  						-4.462931410340872
  					],
  					[
  						131.9898043153162,
  						-2.8205510392405557
  					],
  					[
  						132.3801164084168,
  						-0.3695378556369775
  					],
  					[
  						134.1433679546478,
  						-1.1518673641035946
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						125.24050052297159,
  						1.4198361271176054
  					],
  					[
  						124.43703535369744,
  						0.4278811710589565
  					],
  					[
  						120.18308312386276,
  						0.23724681233420597
  					],
  					[
  						120.04086958219548,
  						-0.5196578914448651
  					],
  					[
  						121.50827355355554,
  						-1.9044829240024228
  					],
  					[
  						123.17096276254657,
  						-4.683693129091722
  					],
  					[
  						122.62851525277873,
  						-5.634591159694494
  					],
  					[
  						120.30545291552991,
  						-2.9316036922357256
  					],
  					[
  						120.43071658740539,
  						-5.528241062037779
  					],
  					[
  						119.36690555224496,
  						-5.379878024927805
  					],
  					[
  						119.49883548388598,
  						-3.4944117163265247
  					],
  					[
  						118.76776899625284,
  						-2.801999200047689
  					],
  					[
  						120.03570193896635,
  						0.5664773624657045
  					],
  					[
  						120.88577925016764,
  						1.309222723796836
  					],
  					[
  						124.0775224142429,
  						0.9171019555661388
  					],
  					[
  						125.24050052297159,
  						1.4198361271176054
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						105.81765506390937,
  						-5.852355645372413
  					],
  					[
  						104.71038414919153,
  						-5.873284600450646
  					],
  					[
  						102.58426069540698,
  						-4.220258884298204
  					],
  					[
  						100.14198082886068,
  						-0.6503475887109715
  					],
  					[
  						98.60135135294311,
  						1.8235065779655315
  					],
  					[
  						95.38087609251355,
  						4.97078217205366
  					],
  					[
  						97.4848820332771,
  						5.246320909033912
  					],
  					[
  						100.64143354696168,
  						2.0993812117556985
  					],
  					[
  						101.65801232300745,
  						2.083697414555189
  					],
  					[
  						103.07684044801314,
  						0.5613613956688397
  					],
  					[
  						103.43764529827499,
  						-0.7119458960029448
  					],
  					[
  						104.88789269411407,
  						-2.340425306816755
  					],
  					[
  						106.10859337771271,
  						-3.0617766251789504
  					],
  					[
  						105.81765506390937,
  						-5.852355645372413
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						117.87562706916597,
  						1.827640692548897
  					],
  					[
  						117.52164350796662,
  						-0.8037232397533103
  					],
  					[
  						116.56004845587952,
  						-1.487660821136231
  					],
  					[
  						116.00085778204911,
  						-3.657037448749108
  					],
  					[
  						114.86480309454456,
  						-4.106984144714417
  					],
  					[
  						113.25699425664757,
  						-3.1187757299969547
  					],
  					[
  						110.223846063276,
  						-2.9340324845534838
  					],
  					[
  						110.07093550012436,
  						-1.592874037282499
  					],
  					[
  						109.09187381392255,
  						-0.4595065242571508
  					],
  					[
  						109.06913618371411,
  						1.3419339054376422
  					],
  					[
  						109.6632601257738,
  						2.006466986494985
  					],
  					[
  						112.99561486211527,
  						3.1023949243248694
  					],
  					[
  						114.59996137904872,
  						4.9000112980299235
  					],
  					[
  						116.22074100145105,
  						6.143191229675523
  					],
  					[
  						119.18190392463995,
  						5.407835598162151
  					],
  					[
  						117.31323245653354,
  						3.234428208830579
  					],
  					[
  						117.87562706916597,
  						1.827640692548897
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						126.37681359263749,
  						8.414706325713254
  					],
  					[
  						126.53742394420058,
  						7.189380601424574
  					],
  					[
  						124.21978763234242,
  						6.161355495626168
  					],
  					[
  						123.29607140512528,
  						7.418875637232773
  					],
  					[
  						123.48768761606354,
  						8.693009751821194
  					],
  					[
  						126.22271447154318,
  						9.286074327018838
  					],
  					[
  						126.37681359263749,
  						8.414706325713254
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						81.2180196471443,
  						6.197141424988303
  					],
  					[
  						80.34835696810447,
  						5.968369859232141
  					],
  					[
  						79.69516686393516,
  						8.200843410673372
  					],
  					[
  						80.83881798698664,
  						9.268426825391174
  					],
  					[
  						81.78795901889143,
  						7.523055324733178
  					],
  					[
  						81.2180196471443,
  						6.197141424988303
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						121.3213082215236,
  						18.504064642810903
  					],
  					[
  						122.51565392465338,
  						17.093504746971973
  					],
  					[
  						121.66278608610824,
  						15.9310175643501
  					],
  					[
  						121.72882856657728,
  						14.328376369682246
  					],
  					[
  						120.07042850146641,
  						14.970869452367197
  					],
  					[
  						120.39004723519176,
  						17.59908112229951
  					],
  					[
  						121.3213082215236,
  						18.504064642810903
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-72.57967281766363,
  						19.871500555902344
  					],
  					[
  						-70.80670610216168,
  						19.88028554939197
  					],
  					[
  						-68.31794328476892,
  						18.612197577381636
  					],
  					[
  						-71.70830481635795,
  						18.044997056546208
  					],
  					[
  						-72.69493709989067,
  						18.44579946540179
  					],
  					[
  						-72.57967281766363,
  						19.871500555902344
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-79.6795236884603,
  						22.765303249598816
  					],
  					[
  						-78.3474344550564,
  						22.512166246017074
  					],
  					[
  						-76.52382483590844,
  						21.206819566324327
  					],
  					[
  						-75.63468014189462,
  						19.873774318923154
  					],
  					[
  						-77.7554809231531,
  						19.85548086189189
  					],
  					[
  						-79.6795236884603,
  						22.765303249598816
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						15.520376010813834,
  						38.23115509699156
  					],
  					[
  						15.099988234119536,
  						36.6199872909954
  					],
  					[
  						12.431003859108785,
  						37.612949937483705
  					],
  					[
  						15.520376010813834,
  						38.23115509699156
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						140.9763875673053,
  						37.14207428644016
  					],
  					[
  						140.25327925024519,
  						35.138113918593746
  					],
  					[
  						137.21759891169128,
  						34.60628591566177
  					],
  					[
  						135.7929830262689,
  						33.46480520276671
  					],
  					[
  						135.07943484918277,
  						34.59654490817482
  					],
  					[
  						132.15677086805132,
  						33.90493337659652
  					],
  					[
  						131.33279015515737,
  						31.450354519164847
  					],
  					[
  						129.40846316947253,
  						33.29605581311759
  					],
  					[
  						132.61767296766251,
  						35.43339305270939
  					],
  					[
  						135.67753787652893,
  						35.527134100886826
  					],
  					[
  						139.4264046571429,
  						38.215962225897556
  					],
  					[
  						139.88337934789988,
  						40.56331248632361
  					],
  					[
  						141.3689734234267,
  						41.378559882160374
  					],
  					[
  						141.88460086483505,
  						39.18086456965142
  					],
  					[
  						140.9763875673053,
  						37.14207428644016
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						143.91016198137956,
  						44.17409983985374
  					],
  					[
  						143.18384972551726,
  						41.99521474869917
  					],
  					[
  						141.38054894426008,
  						43.38882477474638
  					],
  					[
  						141.967644891528,
  						45.55148346616136
  					],
  					[
  						143.91016198137956,
  						44.17409983985374
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-56.13403581401704,
  						50.687009792679305
  					],
  					[
  						-55.82240108908101,
  						49.58712860777899
  					],
  					[
  						-53.47654944519127,
  						49.24913890237406
  					],
  					[
  						-52.6480987209041,
  						47.53554840757559
  					],
  					[
  						-53.06915829121834,
  						46.655498765645035
  					],
  					[
  						-56.250798712780636,
  						47.63254507098739
  					],
  					[
  						-59.26601518414688,
  						47.6033478867424
  					],
  					[
  						-57.35868974468596,
  						50.71827403421594
  					],
  					[
  						-56.13403581401704,
  						50.687009792679305
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-6.788856573910806,
  						52.260117906292436
  					],
  					[
  						-8.561616583683502,
  						51.6693012558994
  					],
  					[
  						-9.688524542672383,
  						53.88136261658536
  					],
  					[
  						-7.572167934590993,
  						55.13162221945498
  					],
  					[
  						-5.661948614921926,
  						54.554603176483766
  					],
  					[
  						-6.788856573910806,
  						52.260117906292436
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-3.0050048486351955,
  						58.635000108466244
  					],
  					[
  						-1.959280564776833,
  						57.68479970969949
  					],
  					[
  						-2.0850093245430514,
  						55.909998480851186
  					],
  					[
  						0.4699768408317766,
  						52.92999949809189
  					],
  					[
  						0.5503336930456726,
  						50.765738837276075
  					],
  					[
  						-3.6174480859423284,
  						50.22835561787272
  					],
  					[
  						-5.2672957015088855,
  						51.99140045837467
  					],
  					[
  						-3.6300054589893307,
  						54.615012925833014
  					],
  					[
  						-5.58639767091114,
  						55.31114614523682
  					],
  					[
  						-6.149980841486354,
  						56.78500967063346
  					],
  					[
  						-5.009998745127575,
  						58.63001333275005
  					],
  					[
  						-3.0050048486351955,
  						58.635000108466244
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-85.16130794954995,
  						65.6572846543929
  					],
  					[
  						-83.10879757356506,
  						64.1018757188398
  					],
  					[
  						-86.35275977247127,
  						64.03583323837071
  					],
  					[
  						-85.16130794954995,
  						65.6572846543929
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-14.508695441129134,
  						66.45589223903139
  					],
  					[
  						-13.609732224979695,
  						65.12667104761994
  					],
  					[
  						-18.656245896874964,
  						63.496382961675835
  					],
  					[
  						-22.76297197111009,
  						63.96017894149537
  					],
  					[
  						-23.650514695723075,
  						66.26251902939524
  					],
  					[
  						-20.57628373867948,
  						65.73211212835153
  					],
  					[
  						-14.508695441129134,
  						66.45589223903139
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-175.0142500000001,
  						66.58435000000003
  					],
  					[
  						-171.85731000000004,
  						66.91307999999995
  					],
  					[
  						-173.89184000000003,
  						64.28259999999995
  					],
  					[
  						-178.35993000000008,
  						65.39051999999995
  					],
  					[
  						-180,
  						64.97970870219845
  					],
  					[
  						-180,
  						68.96363636363645
  					],
  					[
  						-174.92825000000005,
  						67.20589000000004
  					],
  					[
  						-175.0142500000001,
  						66.58435000000003
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-90.54711914062494,
  						69.49768066406259
  					],
  					[
  						-88.0195922851562,
  						68.61511230468756
  					],
  					[
  						-85.52191162109378,
  						69.88208007812497
  					],
  					[
  						-81.28039550781247,
  						69.16210937500003
  					],
  					[
  						-81.38647460937491,
  						67.11090087890622
  					],
  					[
  						-86.06762695312497,
  						66.05627441406261
  					],
  					[
  						-88.48291015624997,
  						64.09912109375009
  					],
  					[
  						-93.15698242187497,
  						62.024719238281364
  					],
  					[
  						-94.62927246093741,
  						60.110290527343835
  					],
  					[
  						-92.29699707031244,
  						57.08709716796881
  					],
  					[
  						-90.89770507812497,
  						57.284729003906335
  					],
  					[
  						-85.01177978515616,
  						55.30267333984389
  					],
  					[
  						-82.27282714843741,
  						55.148315429687585
  					],
  					[
  						-81.4006958007812,
  						52.15789794921878
  					],
  					[
  						-79.91290283203122,
  						51.208496093750085
  					],
  					[
  						-78.60192871093741,
  						52.56207275390628
  					],
  					[
  						-79.1242065429687,
  						54.14147949218764
  					],
  					[
  						-76.54138183593747,
  						56.5343017578125
  					],
  					[
  						-78.5169067382812,
  						58.80468750000006
  					],
  					[
  						-77.33666992187497,
  						59.85272216796878
  					],
  					[
  						-78.10681152343753,
  						62.31970214843753
  					],
  					[
  						-73.83990478515622,
  						62.44390869140631
  					],
  					[
  						-71.37371826171872,
  						61.13708496093747
  					],
  					[
  						-69.5903930664062,
  						61.061523437500114
  					],
  					[
  						-69.2879028320312,
  						58.95727539062506
  					],
  					[
  						-66.20178222656241,
  						58.76727294921878
  					],
  					[
  						-64.58349609374991,
  						60.33569335937506
  					],
  					[
  						-59.56958007812494,
  						55.2041015625
  					],
  					[
  						-57.333190917968665,
  						54.62652587890639
  					],
  					[
  						-55.756286621093665,
  						53.27050781250006
  					],
  					[
  						-55.68328857421872,
  						52.146728515625085
  					],
  					[
  						-60.03308105468747,
  						50.24291992187503
  					],
  					[
  						-66.39898681640616,
  						50.228881835937585
  					],
  					[
  						-65.05621337890616,
  						49.23291015625014
  					],
  					[
  						-64.47210693359366,
  						46.238525390625085
  					],
  					[
  						-61.03979492187497,
  						45.26531982421878
  					],
  					[
  						-65.36407470703116,
  						43.54528808593753
  					],
  					[
  						-67.13739013671872,
  						45.13751220703125
  					],
  					[
  						-70.11608886718747,
  						43.68408203124997
  					],
  					[
  						-70.64001464843744,
  						41.475097656250085
  					],
  					[
  						-73.9819946289062,
  						40.62811279296889
  					],
  					[
  						-75.72198486328122,
  						37.93707275390625
  					],
  					[
  						-75.7274780273437,
  						35.550720214843864
  					],
  					[
  						-78.55432128906247,
  						33.86132812500006
  					],
  					[
  						-81.33630371093741,
  						31.44049072265628
  					],
  					[
  						-81.49041748046866,
  						30.730102539062642
  					],
  					[
  						-80.05651855468744,
  						26.880126953125142
  					],
  					[
  						-81.17211914062494,
  						25.201293945312642
  					],
  					[
  						-82.85528564453122,
  						27.88629150390625
  					],
  					[
  						-83.70959472656247,
  						29.93670654296875
  					],
  					[
  						-85.10882568359372,
  						29.63629150390625
  					],
  					[
  						-86.40002441406241,
  						30.400085449218835
  					],
  					[
  						-89.60491943359372,
  						30.176330566406307
  					],
  					[
  						-91.62670898437497,
  						29.67712402343753
  					],
  					[
  						-94.69000244140622,
  						29.48010253906253
  					],
  					[
  						-97.36999511718744,
  						27.38012695312503
  					],
  					[
  						-97.14019775390614,
  						25.86950683593753
  					],
  					[
  						-97.87237548828128,
  						22.44427490234378
  					],
  					[
  						-97.1892700195312,
  						20.635498046875
  					],
  					[
  						-95.90087890624997,
  						18.82812500000003
  					],
  					[
  						-94.4257202148437,
  						18.144287109375142
  					],
  					[
  						-90.7717895507812,
  						19.284118652343892
  					],
  					[
  						-90.27862548828116,
  						20.999877929687557
  					],
  					[
  						-87.05187988281241,
  						21.543518066406364
  					],
  					[
  						-88.35540771484372,
  						16.5308837890625
  					],
  					[
  						-88.93060302734366,
  						15.887329101562642
  					],
  					[
  						-84.36822509765616,
  						15.8350830078125
  					],
  					[
  						-83.14721679687497,
  						14.995910644531307
  					],
  					[
  						-83.85540771484372,
  						11.373291015625057
  					],
  					[
  						-83.4022827148437,
  						10.395507812499986
  					],
  					[
  						-81.43920898437491,
  						8.786315917968764
  					],
  					[
  						-79.57330322265622,
  						9.611694335937585
  					],
  					[
  						-76.83660888671878,
  						8.638671875
  					],
  					[
  						-75.67462158203116,
  						9.44329833984385
  					],
  					[
  						-75.4804077148437,
  						10.619079589843764
  					],
  					[
  						-73.41467285156247,
  						11.227111816406236
  					],
  					[
  						-71.7540893554687,
  						12.437316894531406
  					],
  					[
  						-71.40057373046878,
  						10.969116210937543
  					],
  					[
  						-68.88299560546872,
  						11.443481445312557
  					],
  					[
  						-68.19409179687491,
  						10.554687500000085
  					],
  					[
  						-64.31799316406241,
  						10.641479492187585
  					],
  					[
  						-61.58868408203119,
  						9.87310791015625
  					],
  					[
  						-59.101684570312415,
  						7.99932861328125
  					],
  					[
  						-57.147399902343665,
  						5.973083496093864
  					],
  					[
  						-55.033203124999915,
  						6.0253295898438495
  					],
  					[
  						-52.882080078125,
  						5.409912109375
  					],
  					[
  						-51.31707763671872,
  						4.203491210937656
  					],
  					[
  						-49.94708251953119,
  						1.0463256835937926
  					],
  					[
  						-50.38818359374994,
  						-0.07836914062498579
  					],
  					[
  						-48.62048339843747,
  						-0.23541259765620737
  					],
  					[
  						-44.90570068359369,
  						-1.5516967773437216
  					],
  					[
  						-44.41760253906244,
  						-2.137695312499943
  					],
  					[
  						-41.47259521484372,
  						-2.911987304687443
  					],
  					[
  						-39.97857666015625,
  						-2.8729858398437074
  					],
  					[
  						-37.22320556640622,
  						-4.820922851562415
  					],
  					[
  						-35.235412597656165,
  						-5.464904785156222
  					],
  					[
  						-34.72998046874994,
  						-7.343200683593665
  					],
  					[
  						-35.12817382812497,
  						-8.996398925781165
  					],
  					[
  						-37.0465087890625,
  						-11.040710449218679
  					],
  					[
  						-38.95318603515625,
  						-13.793395996093679
  					],
  					[
  						-38.88232421874997,
  						-15.666992187499943
  					],
  					[
  						-39.76080322265619,
  						-19.59912109374997
  					],
  					[
  						-40.94470214843744,
  						-21.937316894531207
  					],
  					[
  						-41.988281249999915,
  						-22.970092773437486
  					],
  					[
  						-44.64782714843744,
  						-23.35198974609378
  					],
  					[
  						-46.47210693359369,
  						-24.08898925781253
  					],
  					[
  						-48.495483398437415,
  						-25.87701416015618
  					],
  					[
  						-48.88842773437494,
  						-28.674072265624957
  					],
  					[
  						-50.69689941406247,
  						-30.98437499999997
  					],
  					[
  						-52.256103515624915,
  						-32.24530029296871
  					],
  					[
  						-53.806396484374915,
  						-34.39678955078121
  					],
  					[
  						-54.93579101562497,
  						-34.95257568359378
  					],
  					[
  						-57.13970947265628,
  						-34.430480957031236
  					],
  					[
  						-56.78820800781247,
  						-36.90148925781243
  					],
  					[
  						-57.749084472656165,
  						-38.18389892578118
  					],
  					[
  						-59.23181152343747,
  						-38.7202148437499
  					],
  					[
  						-62.335876464843665,
  						-38.82769775390615
  					],
  					[
  						-62.145996093749915,
  						-40.676879882812415
  					],
  					[
  						-65.11798095703122,
  						-41.064270019531165
  					],
  					[
  						-64.37878417968747,
  						-42.873474121093665
  					],
  					[
  						-65.565185546875,
  						-45.03680419921868
  					],
  					[
  						-67.58050537109366,
  						-46.30169677734371
  					],
  					[
  						-65.64099121093747,
  						-47.23608398437493
  					],
  					[
  						-69.13848876953122,
  						-50.73248291015622
  					],
  					[
  						-68.81549072265622,
  						-51.77111816406246
  					],
  					[
  						-72.55792236328116,
  						-53.53137207031242
  					],
  					[
  						-74.94677734374991,
  						-52.26269531249992
  					],
  					[
  						-75.64440917968741,
  						-46.64758300781253
  					],
  					[
  						-74.6920776367187,
  						-45.763977050781165
  					],
  					[
  						-73.67712402343747,
  						-39.94219970703128
  					],
  					[
  						-73.1666870117187,
  						-37.123779296874915
  					],
  					[
  						-71.43847656249997,
  						-32.41888427734372
  					],
  					[
  						-71.48980712890616,
  						-28.86138916015622
  					],
  					[
  						-70.90509033203122,
  						-27.640380859375043
  					],
  					[
  						-70.09118652343744,
  						-21.39331054687493
  					],
  					[
  						-70.37249755859366,
  						-18.34790039062497
  					],
  					[
  						-71.46197509765616,
  						-17.363403320312457
  					],
  					[
  						-76.0092163085937,
  						-14.649291992187415
  					],
  					[
  						-77.10620117187491,
  						-12.222717285156207
  					],
  					[
  						-79.76049804687494,
  						-7.194274902343707
  					],
  					[
  						-81.24999999999991,
  						-6.136779785156236
  					],
  					[
  						-81.41088867187491,
  						-4.736694335937486
  					],
  					[
  						-80.30249023437497,
  						-3.404785156249986
  					],
  					[
  						-80.93359375000003,
  						-1.0573730468749432
  					],
  					[
  						-80.09057617187497,
  						0.7684936523438637
  					],
  					[
  						-78.85528564453122,
  						1.3809204101563353
  					],
  					[
  						-78.42761230468741,
  						2.629699707031378
  					],
  					[
  						-77.12768554687494,
  						3.8496704101564063
  					],
  					[
  						-77.47668457031241,
  						6.691101074218778
  					],
  					[
  						-79.12030029296872,
  						8.996093749999986
  					],
  					[
  						-80.48071289062494,
  						8.090270996093892
  					],
  					[
  						-82.96569824218744,
  						8.225097656250128
  					],
  					[
  						-83.63262939453122,
  						9.051513671875085
  					],
  					[
  						-85.7974243164062,
  						10.134887695312585
  					],
  					[
  						-85.71252441406241,
  						11.088500976562528
  					],
  					[
  						-87.9041137695312,
  						13.149108886718878
  					],
  					[
  						-91.23242187500003,
  						13.927917480468736
  					],
  					[
  						-93.35937499999991,
  						15.615478515625114
  					],
  					[
  						-94.69158935546878,
  						16.20111083984375
  					],
  					[
  						-96.55737304687494,
  						15.65350341796875
  					],
  					[
  						-100.82952880859378,
  						17.171081542968835
  					],
  					[
  						-103.50097656249996,
  						18.292297363281392
  					],
  					[
  						-104.99200439453116,
  						19.316284179687585
  					],
  					[
  						-106.02868652343744,
  						22.77368164062503
  					],
  					[
  						-108.40191650390621,
  						25.172302246093892
  					],
  					[
  						-109.2916259765624,
  						26.442871093750057
  					],
  					[
  						-112.22821044921868,
  						28.954528808593864
  					],
  					[
  						-113.14868164062491,
  						31.171081542968892
  					],
  					[
  						-114.77642822265618,
  						31.799682617187585
  					],
  					[
  						-114.67388916015615,
  						30.1627197265625
  					],
  					[
  						-111.61651611328116,
  						26.66290283203122
  					],
  					[
  						-110.29498291015624,
  						23.43109130859372
  					],
  					[
  						-112.18200683593747,
  						24.738525390625114
  					],
  					[
  						-112.30072021484371,
  						26.012084960937642
  					],
  					[
  						-114.4656982421874,
  						27.14208984375003
  					],
  					[
  						-114.16198730468753,
  						28.56610107421878
  					],
  					[
  						-115.51867675781243,
  						29.556274414062585
  					],
  					[
  						-117.29589843749997,
  						33.046325683593835
  					],
  					[
  						-118.51989746093753,
  						34.027893066406364
  					],
  					[
  						-120.3677978515624,
  						34.447082519531335
  					],
  					[
  						-123.72711181640615,
  						38.951721191406364
  					],
  					[
  						-124.39801025390622,
  						40.31329345703131
  					],
  					[
  						-124.53277587890615,
  						42.76611328125003
  					],
  					[
  						-123.89892578124996,
  						45.52349853515639
  					],
  					[
  						-124.68719482421866,
  						48.18450927734378
  					],
  					[
  						-122.97418212890615,
  						49.002685546875114
  					],
  					[
  						-127.43560791015628,
  						50.830688476562614
  					],
  					[
  						-127.85028076171879,
  						52.32971191406247
  					],
  					[
  						-129.12969970703116,
  						52.75549316406253
  					],
  					[
  						-130.53607177734366,
  						54.80267333984381
  					],
  					[
  						-131.96722412109372,
  						55.497924804687585
  					],
  					[
  						-134.0780029296874,
  						58.12310791015625
  					],
  					[
  						-137.79998779296872,
  						58.500122070312614
  					],
  					[
  						-139.8677978515625,
  						59.537902832031335
  					],
  					[
  						-143.9588012695312,
  						59.99932861328139
  					],
  					[
  						-147.11437988281244,
  						60.884704589843864
  					],
  					[
  						-148.01800537109378,
  						59.97827148437506
  					],
  					[
  						-154.23248291015614,
  						58.146484375000085
  					],
  					[
  						-157.72277832031244,
  						57.57012939453139
  					],
  					[
  						-161.87408447265614,
  						59.63372802734375
  					],
  					[
  						-163.81829833984378,
  						59.798095703125114
  					],
  					[
  						-166.1213989257812,
  						61.50012207031253
  					],
  					[
  						-164.56249999999991,
  						63.14648437499997
  					],
  					[
  						-160.9583129882812,
  						64.22290039062509
  					],
  					[
  						-166.42529296874997,
  						64.68670654296878
  					],
  					[
  						-168.11047363281241,
  						65.67010498046875
  					],
  					[
  						-164.47467041015616,
  						66.57672119140628
  					],
  					[
  						-165.39019775390616,
  						68.0429077148438
  					],
  					[
  						-161.9088745117188,
  						70.33331298828136
  					],
  					[
  						-156.5808105468749,
  						71.35791015625009
  					],
  					[
  						-152.2700195312499,
  						70.60009765625006
  					],
  					[
  						-143.58941650390625,
  						70.15252685546889
  					],
  					[
  						-136.50360107421866,
  						68.89807128906264
  					],
  					[
  						-127.44708251953121,
  						70.37731933593756
  					],
  					[
  						-125.75628662109378,
  						69.48071289062509
  					],
  					[
  						-121.47229003906253,
  						69.79791259765634
  					],
  					[
  						-113.89788818359366,
  						68.39892578124997
  					],
  					[
  						-109.94610595703121,
  						67.98107910156253
  					],
  					[
  						-106.15002441406247,
  						68.80010986328128
  					],
  					[
  						-104.33789062499993,
  						68.0181274414063
  					],
  					[
  						-98.44317626953122,
  						67.78167724609386
  					],
  					[
  						-94.23278808593744,
  						69.06909179687509
  					],
  					[
  						-96.47131347656241,
  						70.08990478515634
  					],
  					[
  						-92.87811279296872,
  						71.3187255859375
  					],
  					[
  						-90.54711914062494,
  						69.49768066406259
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-114.16716999999998,
  						73.12145000000001
  					],
  					[
  						-111.05039000000004,
  						72.45040000000003
  					],
  					[
  						-105.40246,
  						72.67258999999999
  					],
  					[
  						-104.46476000000003,
  						70.99297000000007
  					],
  					[
  						-100.98078,
  						70.0243200000001
  					],
  					[
  						-102.4302399999999,
  						68.7528200000001
  					],
  					[
  						-105.96000000000006,
  						69.18000000000006
  					],
  					[
  						-113.31320000000008,
  						68.53553999999997
  					],
  					[
  						-116.10794000000003,
  						69.16821000000004
  					],
  					[
  						-119.40198999999998,
  						71.55859000000007
  					],
  					[
  						-117.86642,
  						72.70594000000008
  					],
  					[
  						-114.16716999999998,
  						73.12145000000001
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-86.56217851433405,
  						73.15744700793854
  					],
  					[
  						-82.31559017610107,
  						73.75095083281067
  					],
  					[
  						-71.20001542833512,
  						70.92001251899723
  					],
  					[
  						-62.16317684594222,
  						66.16025136988961
  					],
  					[
  						-65.3201676093012,
  						64.38273712834615
  					],
  					[
  						-66.16556820338016,
  						61.93089712182589
  					],
  					[
  						-71.02343705919392,
  						62.91070811629584
  					],
  					[
  						-77.89728105336204,
  						65.3091922064747
  					],
  					[
  						-74.29388342964955,
  						65.81177134872931
  					],
  					[
  						-72.65116716173941,
  						67.28457550726387
  					],
  					[
  						-77.28736996123703,
  						69.76954010688328
  					],
  					[
  						-84.94470618359858,
  						69.9666340196444
  					],
  					[
  						-89.51341956252304,
  						70.7620376654809
  					],
  					[
  						-90.20516028518193,
  						72.23507436796072
  					],
  					[
  						-86.56217851433405,
  						73.15744700793854
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-100.35642000000006,
  						73.84389000000002
  					],
  					[
  						-97.12000000000006,
  						73.47000000000008
  					],
  					[
  						-96.71999999999991,
  						71.65999999999997
  					],
  					[
  						-102.50000000000004,
  						72.51000000000002
  					],
  					[
  						-100.35642000000006,
  						73.84389000000002
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-120.46000000000002,
  						71.39999999999995
  					],
  					[
  						-125.92896000000007,
  						71.86868000000004
  					],
  					[
  						-121.53787999999999,
  						74.44892999999996
  					],
  					[
  						-115.51081000000006,
  						73.47519
  					],
  					[
  						-119.22000000000007,
  						72.5200000000001
  					],
  					[
  						-120.46000000000002,
  						71.39999999999995
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						145.08628500000006,
  						75.56262499999997
  					],
  					[
  						138.95544000000004,
  						74.61148000000009
  					],
  					[
  						137.51176,
  						75.94916999999998
  					],
  					[
  						145.08628500000006,
  						75.56262499999997
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-108.21141000000001,
  						76.20167999999995
  					],
  					[
  						-106.31347000000001,
  						75.00526999999994
  					],
  					[
  						-112.22307000000004,
  						74.41695999999993
  					],
  					[
  						-117.71039999999999,
  						75.22220000000004
  					],
  					[
  						-115.40486999999997,
  						76.47887000000003
  					],
  					[
  						-108.21141000000001,
  						76.20167999999995
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						57.5356925799924,
  						70.72046397570224
  					],
  					[
  						53.6773751157842,
  						70.76265778266855
  					],
  					[
  						51.45575361512422,
  						72.01488108996514
  					],
  					[
  						55.631932814359715,
  						75.08141225859717
  					],
  					[
  						58.47708214705338,
  						74.30905630156283
  					],
  					[
  						55.4193359719109,
  						72.37126760526607
  					],
  					[
  						57.5356925799924,
  						70.72046397570224
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-94.68408586299947,
  						77.09787832305838
  					],
  					[
  						-89.1870828925999,
  						75.61016551380763
  					],
  					[
  						-81.12853084992429,
  						75.713983466282
  					],
  					[
  						-79.83393286814842,
  						74.9231273464872
  					],
  					[
  						-88.15035030796034,
  						74.39230703398508
  					],
  					[
  						-92.42244096552943,
  						74.83775788034109
  					],
  					[
  						-94.68408586299947,
  						77.09787832305838
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						106.97027587890628,
  						76.97430419921875
  					],
  					[
  						111.07727050781253,
  						76.71008300781253
  					],
  					[
  						113.88549804687509,
  						75.327880859375
  					],
  					[
  						109.40008544921884,
  						74.18011474609372
  					],
  					[
  						113.96887207031253,
  						73.5949096679688
  					],
  					[
  						126.97650146484384,
  						73.56549072265625
  					],
  					[
  						128.46008300781253,
  						71.9801025390625
  					],
  					[
  						131.28869628906253,
  						70.78710937500006
  					],
  					[
  						133.85772705078134,
  						71.38647460937503
  					],
  					[
  						139.86987304687509,
  						71.4879150390625
  					],
  					[
  						140.46807861328128,
  						72.84948730468753
  					],
  					[
  						149.50012207031253,
  						72.20007324218756
  					],
  					[
  						152.96887207031259,
  						70.84228515625
  					],
  					[
  						157.00689697265628,
  						71.031494140625
  					],
  					[
  						160.94067382812503,
  						69.43731689453125
  					],
  					[
  						167.83569335937509,
  						69.58270263671878
  					],
  					[
  						170.45349121093753,
  						70.09710693359378
  					],
  					[
  						175.72412109374997,
  						69.87731933593747
  					],
  					[
  						180.00000000000014,
  						68.96372213254719
  					],
  					[
  						180.00000000000014,
  						64.97958425748152
  					],
  					[
  						178.31311035156264,
  						64.07592773437497
  					],
  					[
  						179.37048339843759,
  						62.98272705078122
  					],
  					[
  						173.68011474609384,
  						61.65270996093753
  					],
  					[
  						170.69848632812503,
  						60.3363037109375
  					],
  					[
  						166.29510498046878,
  						59.7886962890625
  					],
  					[
  						163.53930664062509,
  						59.86871337890625
  					],
  					[
  						162.01727294921878,
  						58.2432861328125
  					],
  					[
  						163.19189453125009,
  						57.61511230468753
  					],
  					[
  						162.11749267578134,
  						54.85528564453128
  					],
  					[
  						156.78991699218753,
  						51.01110839843753
  					],
  					[
  						155.43371582031253,
  						55.381103515625
  					],
  					[
  						156.81048583984384,
  						57.83209228515628
  					],
  					[
  						158.36431884765628,
  						58.05572509765628
  					],
  					[
  						160.12152099609384,
  						60.5443115234375
  					],
  					[
  						159.30230712890628,
  						61.77410888671878
  					],
  					[
  						156.72070312500003,
  						61.43450927734378
  					],
  					[
  						154.21807861328128,
  						59.75830078125
  					],
  					[
  						151.26568603515628,
  						58.78088378906253
  					],
  					[
  						145.48730468750009,
  						59.33648681640625
  					],
  					[
  						142.19787597656259,
  						59.04010009765628
  					],
  					[
  						135.12628173828128,
  						54.72967529296878
  					],
  					[
  						137.19348144531259,
  						53.977294921875
  					],
  					[
  						139.90148925781253,
  						54.189697265625
  					],
  					[
  						141.34527587890628,
  						53.0897216796875
  					],
  					[
  						140.06207275390628,
  						48.44671630859381
  					],
  					[
  						138.21972656250009,
  						46.30792236328122
  					],
  					[
  						134.86950683593753,
  						43.39831542968753
  					],
  					[
  						132.27807617187509,
  						43.28448486328122
  					],
  					[
  						129.66748046875009,
  						41.60107421875
  					],
  					[
  						129.70532226562509,
  						40.88287353515625
  					],
  					[
  						127.53350830078128,
  						39.75689697265628
  					],
  					[
  						129.46051025390634,
  						36.78430175781253
  					],
  					[
  						129.09149169921878,
  						35.08251953125
  					],
  					[
  						126.48571777343759,
  						34.39007568359375
  					],
  					[
  						126.17468261718753,
  						37.74969482421878
  					],
  					[
  						124.71228027343759,
  						38.10827636718753
  					],
  					[
  						125.38671875000009,
  						39.38787841796872
  					],
  					[
  						124.26568603515634,
  						39.92852783203125
  					],
  					[
  						122.13153076171884,
  						39.17047119140625
  					],
  					[
  						121.37689208984384,
  						39.75030517578125
  					],
  					[
  						117.53271484375009,
  						38.7376708984375
  					],
  					[
  						119.70288085937503,
  						37.156494140625
  					],
  					[
  						120.82348632812509,
  						37.87048339843747
  					],
  					[
  						122.35791015625003,
  						37.45452880859378
  					],
  					[
  						119.15130615234384,
  						34.909912109375
  					],
  					[
  						120.22747802734378,
  						34.36047363281247
  					],
  					[
  						121.90808105468759,
  						31.69232177734375
  					],
  					[
  						122.09210205078128,
  						29.832519531250057
  					],
  					[
  						121.12567138671878,
  						28.13568115234375
  					],
  					[
  						118.65692138671884,
  						24.5474853515625
  					],
  					[
  						115.89068603515634,
  						22.78289794921875
  					],
  					[
  						111.84368896484384,
  						21.55047607421875
  					],
  					[
  						108.52288818359384,
  						21.71527099609375
  					],
  					[
  						106.71508789062509,
  						20.69689941406247
  					],
  					[
  						105.66210937500003,
  						19.058288574218807
  					],
  					[
  						107.36187744140634,
  						16.697509765625
  					],
  					[
  						108.87707519531259,
  						15.276672363281307
  					],
  					[
  						109.33532714843759,
  						13.426086425781222
  					],
  					[
  						109.20007324218759,
  						11.6668701171875
  					],
  					[
  						105.15832519531259,
  						8.59967041015625
  					],
  					[
  						105.07629394531259,
  						9.918518066406264
  					],
  					[
  						103.49731445312509,
  						10.632690429687486
  					],
  					[
  						102.58508300781253,
  						12.186706542968736
  					],
  					[
  						100.97851562500003,
  						13.412719726562543
  					],
  					[
  						100.01867675781259,
  						12.307128906250057
  					],
  					[
  						99.15368652343759,
  						9.963073730468778
  					],
  					[
  						100.45928955078134,
  						7.429687499999986
  					],
  					[
  						101.62310791015628,
  						6.740722656250057
  					],
  					[
  						103.38128662109378,
  						4.855102539062543
  					],
  					[
  						103.51971435546884,
  						1.2263183593749858
  					],
  					[
  						101.39068603515628,
  						2.7609252929687784
  					],
  					[
  						100.19671630859378,
  						5.312500000000057
  					],
  					[
  						100.30627441406253,
  						6.040710449218793
  					],
  					[
  						98.50390625000003,
  						8.38232421875
  					],
  					[
  						98.50970458984384,
  						13.122497558593778
  					],
  					[
  						97.16467285156253,
  						16.92871093750003
  					],
  					[
  						95.36932373046884,
  						15.714477539062528
  					],
  					[
  						94.18890380859378,
  						16.038085937500057
  					],
  					[
  						94.32489013671884,
  						18.21350097656253
  					],
  					[
  						92.36853027343753,
  						20.6708984375
  					],
  					[
  						91.41711425781259,
  						22.76507568359375
  					],
  					[
  						90.27288818359384,
  						21.83648681640625
  					],
  					[
  						86.97570800781253,
  						21.49548339843753
  					],
  					[
  						86.49932861328128,
  						20.151672363281307
  					],
  					[
  						83.94110107421878,
  						18.30212402343747
  					],
  					[
  						80.32489013671878,
  						15.8992919921875
  					],
  					[
  						80.28631591796884,
  						13.006286621093736
  					],
  					[
  						79.85809326171884,
  						10.357299804687514
  					],
  					[
  						77.53991699218759,
  						7.965515136718793
  					],
  					[
  						76.59307861328128,
  						8.899291992187486
  					],
  					[
  						74.86492919921878,
  						12.741882324218778
  					],
  					[
  						74.44390869140634,
  						14.617309570312557
  					],
  					[
  						73.53430175781259,
  						15.99072265625
  					],
  					[
  						72.82092285156253,
  						19.20831298828122
  					],
  					[
  						72.63067626953134,
  						21.35607910156247
  					],
  					[
  						70.47052001953134,
  						20.877319335937557
  					],
  					[
  						69.16412353515628,
  						22.08929443359375
  					],
  					[
  						69.34967041015634,
  						22.843322753906307
  					],
  					[
  						67.44372558593753,
  						23.94488525390628
  					],
  					[
  						66.37292480468753,
  						25.425292968750057
  					],
  					[
  						61.497497558593835,
  						25.07830810546875
  					],
  					[
  						57.397277832031335,
  						25.73992919921872
  					],
  					[
  						56.492126464843835,
  						27.14331054687503
  					],
  					[
  						54.71508789062503,
  						26.48071289062503
  					],
  					[
  						51.52087402343753,
  						27.86572265625003
  					],
  					[
  						50.115112304687585,
  						30.147888183593807
  					],
  					[
  						48.94128417968753,
  						30.317077636718807
  					],
  					[
  						48.093872070312585,
  						29.306274414062557
  					],
  					[
  						48.80767822265628,
  						27.689697265625057
  					],
  					[
  						51.589111328125085,
  						25.80108642578125
  					],
  					[
  						51.79449462890628,
  						24.0198974609375
  					],
  					[
  						54.008117675781335,
  						24.12188720703128
  					],
  					[
  						55.439086914062585,
  						25.4390869140625
  					],
  					[
  						57.40350341796878,
  						23.878723144531307
  					],
  					[
  						58.72930908203128,
  						23.565673828125
  					],
  					[
  						59.80627441406253,
  						22.31048583984378
  					],
  					[
  						57.78869628906253,
  						19.06768798828128
  					],
  					[
  						55.27490234375003,
  						17.228271484375057
  					],
  					[
  						52.385314941406335,
  						16.38250732421875
  					],
  					[
  						52.168273925781335,
  						15.597473144531278
  					],
  					[
  						49.57470703125003,
  						14.708679199218722
  					],
  					[
  						48.67932128906253,
  						14.003295898437514
  					],
  					[
  						43.48309326171878,
  						12.636901855468793
  					],
  					[
  						42.64971923828128,
  						16.77471923828122
  					],
  					[
  						40.93927001953128,
  						19.48651123046875
  					],
  					[
  						39.13952636718753,
  						21.29187011718753
  					],
  					[
  						38.49291992187503,
  						23.68847656249997
  					],
  					[
  						35.130310058593835,
  						28.0634765625
  					],
  					[
  						33.34887695312503,
  						27.69989013671878
  					],
  					[
  						35.692504882812585,
  						23.926696777343807
  					],
  					[
  						35.52612304687503,
  						23.10247802734375
  					],
  					[
  						36.866271972656335,
  						22.0001220703125
  					],
  					[
  						37.481872558593835,
  						18.61407470703122
  					],
  					[
  						38.410095214843835,
  						17.99829101562497
  					],
  					[
  						39.266113281250085,
  						15.9227294921875
  					],
  					[
  						41.17932128906253,
  						14.4910888671875
  					],
  					[
  						43.317871093750085,
  						12.390075683593778
  					],
  					[
  						44.117919921875085,
  						10.445678710937486
  					],
  					[
  						46.64550781250003,
  						10.816528320312543
  					],
  					[
  						51.111328125000085,
  						12.024719238281278
  					],
  					[
  						51.04528808593753,
  						10.640930175781264
  					],
  					[
  						49.452697753906335,
  						6.804687500000028
  					],
  					[
  						48.594482421875085,
  						5.339111328125057
  					],
  					[
  						46.564880371093835,
  						2.855285644531236
  					],
  					[
  						43.136108398437585,
  						0.29229736328125
  					],
  					[
  						41.58508300781253,
  						-1.6832275390625
  					],
  					[
  						40.26312255859378,
  						-2.573120117187514
  					],
  					[
  						38.74047851562503,
  						-5.90887451171875
  					],
  					[
  						39.44012451171878,
  						-6.840026855468736
  					],
  					[
  						39.18652343750003,
  						-8.485473632812472
  					],
  					[
  						40.478515625000085,
  						-10.765380859375014
  					],
  					[
  						40.77551269531253,
  						-14.691711425781236
  					],
  					[
  						39.45269775390628,
  						-16.720886230468764
  					],
  					[
  						37.41107177734378,
  						-17.586303710937486
  					],
  					[
  						34.786499023437585,
  						-19.78399658203128
  					],
  					[
  						35.562683105468835,
  						-22.09002685546872
  					],
  					[
  						35.45867919921878,
  						-24.12261962890625
  					],
  					[
  						33.01330566406253,
  						-25.357482910156207
  					],
  					[
  						32.46228027343753,
  						-28.301025390624986
  					],
  					[
  						30.055725097656335,
  						-31.14019775390622
  					],
  					[
  						28.21972656250003,
  						-32.77191162109379
  					],
  					[
  						25.78070068359375,
  						-33.94458007812497
  					],
  					[
  						22.57427978515628,
  						-33.86407470703121
  					],
  					[
  						19.61651611328125,
  						-34.81909179687497
  					],
  					[
  						18.24450683593753,
  						-33.86767578125003
  					],
  					[
  						18.2216796875,
  						-31.661621093750014
  					],
  					[
  						15.210510253906307,
  						-27.090881347656207
  					],
  					[
  						14.257690429687557,
  						-22.111206054687486
  					],
  					[
  						12.608703613281307,
  						-19.04528808593753
  					],
  					[
  						11.64007568359375,
  						-16.673095703125014
  					],
  					[
  						12.175720214843807,
  						-14.449096679687486
  					],
  					[
  						13.63372802734375,
  						-12.038574218749972
  					],
  					[
  						13.236511230468722,
  						-8.562622070312472
  					],
  					[
  						11.915100097656222,
  						-5.037902832031278
  					],
  					[
  						8.798095703125057,
  						-1.1113281250000142
  					],
  					[
  						9.7952880859375,
  						3.073486328124986
  					],
  					[
  						8.50030517578125,
  						4.7720947265625
  					],
  					[
  						5.898315429687528,
  						4.262512207031222
  					],
  					[
  						4.32568359375,
  						6.27069091796875
  					],
  					[
  						1.06011962890625,
  						5.92889404296875
  					],
  					[
  						-1.9647216796874716,
  						4.710510253906278
  					],
  					[
  						-4.008789062499943,
  						5.179870605468736
  					],
  					[
  						-7.518920898437472,
  						4.338317871093793
  					],
  					[
  						-9.004821777343693,
  						4.832519531250057
  					],
  					[
  						-12.948974609375,
  						7.798706054687528
  					],
  					[
  						-13.24652099609375,
  						8.903076171875043
  					],
  					[
  						-14.839477539062443,
  						10.876708984375043
  					],
  					[
  						-16.61376953125,
  						12.170898437500014
  					],
  					[
  						-17.18518066406247,
  						14.919494628906278
  					],
  					[
  						-16.463012695312443,
  						16.13507080078128
  					],
  					[
  						-16.27777099609375,
  						20.09252929687503
  					],
  					[
  						-17.06341552734375,
  						20.99987792968747
  					],
  					[
  						-15.98260498046875,
  						23.7235107421875
  					],
  					[
  						-15.089294433593722,
  						24.52032470703128
  					],
  					[
  						-14.439880371093778,
  						26.254516601562557
  					],
  					[
  						-12.618774414062472,
  						28.03833007812503
  					],
  					[
  						-11.68890380859375,
  						28.14868164062503
  					],
  					[
  						-9.564819335937443,
  						29.93371582031247
  					],
  					[
  						-9.814697265624972,
  						31.177673339843807
  					],
  					[
  						-8.657409667968722,
  						33.24029541015622
  					],
  					[
  						-6.912475585937472,
  						34.11047363281253
  					],
  					[
  						-5.929992675781222,
  						35.76007080078131
  					],
  					[
  						-2.169921874999943,
  						35.16851806640631
  					],
  					[
  						1.4669189453125568,
  						36.60571289062497
  					],
  					[
  						9.510070800781278,
  						37.35009765625
  					],
  					[
  						10.93951416015625,
  						35.6990966796875
  					],
  					[
  						10.149719238281278,
  						34.33068847656253
  					],
  					[
  						11.108520507812528,
  						33.29327392578128
  					],
  					[
  						15.2457275390625,
  						32.26507568359372
  					],
  					[
  						15.713928222656278,
  						31.37628173828125
  					],
  					[
  						19.08648681640628,
  						30.2664794921875
  					],
  					[
  						20.8544921875,
  						32.70690917968747
  					],
  					[
  						26.49530029296878,
  						31.585693359375
  					],
  					[
  						28.91351318359375,
  						30.870117187500057
  					],
  					[
  						30.97692871093753,
  						31.55590820312497
  					],
  					[
  						32.993896484375085,
  						31.02410888671878
  					],
  					[
  						34.265502929687585,
  						31.219482421875
  					],
  					[
  						35.99847412109378,
  						34.6448974609375
  					],
  					[
  						36.14990234375003,
  						35.82147216796878
  					],
  					[
  						34.71447753906253,
  						36.79547119140628
  					],
  					[
  						32.50927734375003,
  						36.10748291015628
  					],
  					[
  						30.621704101562585,
  						36.67791748046872
  					],
  					[
  						29.700073242187585,
  						36.14428710937503
  					],
  					[
  						27.64129638671875,
  						36.65887451171875
  					],
  					[
  						26.31829833984378,
  						38.20812988281253
  					],
  					[
  						26.170898437500057,
  						39.46368408203122
  					],
  					[
  						29.240112304687585,
  						41.2200927734375
  					],
  					[
  						31.145874023437585,
  						41.08770751953122
  					],
  					[
  						33.51330566406253,
  						42.01910400390628
  					],
  					[
  						35.16772460937503,
  						42.04028320312503
  					],
  					[
  						38.347717285156335,
  						40.94873046875006
  					],
  					[
  						41.554077148437585,
  						41.53570556640628
  					],
  					[
  						41.45349121093753,
  						42.64508056640625
  					],
  					[
  						37.53912353515628,
  						44.65728759765631
  					],
  					[
  						38.233093261718835,
  						46.24090576171875
  					],
  					[
  						37.42510986328128,
  						47.02227783203128
  					],
  					[
  						33.29870605468753,
  						46.0806884765625
  					],
  					[
  						30.74890136718753,
  						46.58312988281256
  					],
  					[
  						28.837890625,
  						44.91387939453125
  					],
  					[
  						27.673889160156307,
  						42.57788085937503
  					],
  					[
  						28.115478515625,
  						41.6229248046875
  					],
  					[
  						26.358093261718807,
  						40.15209960937503
  					],
  					[
  						22.84967041015625,
  						39.6593017578125
  					],
  					[
  						24.040100097656307,
  						37.65509033203128
  					],
  					[
  						21.67010498046878,
  						36.84509277343747
  					],
  					[
  						21.12011718750003,
  						38.31030273437506
  					],
  					[
  						19.4061279296875,
  						40.25091552734378
  					],
  					[
  						19.540100097656307,
  						41.7200927734375
  					],
  					[
  						16.015502929687557,
  						43.50732421875003
  					],
  					[
  						14.901672363281278,
  						45.07611083984378
  					],
  					[
  						13.1417236328125,
  						45.7366943359375
  					],
  					[
  						12.589294433593778,
  						44.09149169921872
  					],
  					[
  						15.8892822265625,
  						41.54107666015622
  					],
  					[
  						17.519287109375,
  						40.87707519531253
  					],
  					[
  						16.44873046875003,
  						39.79547119140622
  					],
  					[
  						12.106689453125057,
  						41.70452880859372
  					],
  					[
  						8.888916015625,
  						44.36627197265625
  					],
  					[
  						6.529296875000057,
  						43.12890625000003
  					],
  					[
  						3.1005249023437784,
  						43.07531738281253
  					],
  					[
  						3.0394897460937784,
  						41.89208984375003
  					],
  					[
  						0.8104858398437784,
  						41.01470947265628
  					],
  					[
  						-0.6834106445312784,
  						37.64227294921872
  					],
  					[
  						-2.14642333984375,
  						36.67407226562506
  					],
  					[
  						-8.898803710937472,
  						36.86889648437503
  					],
  					[
  						-9.526489257812472,
  						38.73748779296875
  					],
  					[
  						-8.768676757812443,
  						40.76068115234372
  					],
  					[
  						-8.984375,
  						42.5928955078125
  					],
  					[
  						-7.978210449218722,
  						43.74847412109375
  					],
  					[
  						-1.9013061523437216,
  						43.42291259765628
  					],
  					[
  						-1.19378662109375,
  						46.014892578125
  					],
  					[
  						-2.963195800781193,
  						47.5703125
  					],
  					[
  						-0.9893798828124432,
  						49.34747314453122
  					],
  					[
  						1.33868408203125,
  						50.1273193359375
  					],
  					[
  						3.830322265625057,
  						51.6204833984375
  					],
  					[
  						4.70611572265625,
  						53.0919189453125
  					],
  					[
  						9.939697265625028,
  						54.59667968749997
  					],
  					[
  						14.119689941406307,
  						53.75708007812497
  					],
  					[
  						17.622924804687557,
  						54.85168457031256
  					],
  					[
  						19.66070556640628,
  						54.42608642578125
  					],
  					[
  						21.26849365234378,
  						55.19049072265628
  					],
  					[
  						21.09051513671875,
  						56.78387451171875
  					],
  					[
  						27.98107910156247,
  						59.47552490234375
  					],
  					[
  						28.070129394531307,
  						60.50347900390625
  					],
  					[
  						22.86968994140625,
  						59.84649658203125
  					],
  					[
  						21.322326660156307,
  						60.72027587890628
  					],
  					[
  						21.059326171875,
  						62.60748291015625
  					],
  					[
  						25.3980712890625,
  						65.11151123046872
  					],
  					[
  						22.183288574218807,
  						65.72387695312497
  					],
  					[
  						21.36968994140628,
  						64.41369628906256
  					],
  					[
  						17.847900390625057,
  						62.74951171875003
  					],
  					[
  						17.11968994140625,
  						61.34130859375003
  					],
  					[
  						18.78771972656253,
  						60.08190917968753
  					],
  					[
  						16.829284667968807,
  						58.71990966796872
  					],
  					[
  						15.879882812500057,
  						56.10430908203128
  					],
  					[
  						12.6251220703125,
  						56.30712890625
  					],
  					[
  						10.356689453125057,
  						59.46990966796875
  					],
  					[
  						8.382080078125028,
  						58.31329345703125
  					],
  					[
  						5.6658935546875,
  						58.58807373046878
  					],
  					[
  						4.99212646484375,
  						61.97113037109378
  					],
  					[
  						10.5277099609375,
  						64.48608398437506
  					],
  					[
  						14.761291503906278,
  						67.81072998046875
  					],
  					[
  						19.184082031250057,
  						69.81750488281256
  					],
  					[
  						28.16552734375,
  						71.18548583984375
  					],
  					[
  						33.775512695312585,
  						69.301513671875
  					],
  					[
  						40.29248046875003,
  						67.93249511718747
  					],
  					[
  						41.12609863281253,
  						66.7916870117188
  					],
  					[
  						38.38287353515628,
  						65.99951171875
  					],
  					[
  						34.81488037109378,
  						65.90008544921878
  					],
  					[
  						34.94390869140628,
  						64.41448974609372
  					],
  					[
  						43.949890136718835,
  						66.06909179687506
  					],
  					[
  						53.717529296875085,
  						68.85748291015625
  					],
  					[
  						57.317077636718835,
  						68.46630859375003
  					],
  					[
  						63.50408935546878,
  						69.54748535156253
  					],
  					[
  						66.93011474609384,
  						69.45471191406253
  					],
  					[
  						66.69470214843753,
  						71.02911376953128
  					],
  					[
  						69.94012451171878,
  						73.04010009765625
  					],
  					[
  						75.68347167968753,
  						72.30047607421878
  					],
  					[
  						79.65209960937509,
  						72.32012939453128
  					],
  					[
  						80.51110839843759,
  						73.64831542968756
  					],
  					[
  						86.82232666015634,
  						73.93688964843753
  					],
  					[
  						87.16687011718759,
  						75.11651611328122
  					],
  					[
  						98.92248535156253,
  						76.44689941406247
  					],
  					[
  						104.35168457031253,
  						77.69787597656253
  					],
  					[
  						106.97027587890628,
  						76.97430419921875
  					]
  				],
  				[
  					[
  						49.11029052734378,
  						41.28228759765625
  					],
  					[
  						49.618896484375085,
  						40.57287597656253
  					],
  					[
  						49.19970703125003,
  						37.5828857421875
  					],
  					[
  						50.842285156250085,
  						36.87292480468756
  					],
  					[
  						53.825927734375085,
  						36.965087890625
  					],
  					[
  						53.88092041015628,
  						38.95208740234378
  					],
  					[
  						52.69409179687503,
  						40.03369140624997
  					],
  					[
  						54.736877441406335,
  						40.95111083984381
  					],
  					[
  						53.72167968750003,
  						42.12329101562497
  					],
  					[
  						51.34252929687503,
  						43.13311767578131
  					],
  					[
  						51.31689453125003,
  						45.24609374999997
  					],
  					[
  						53.040893554687585,
  						45.25909423828125
  					],
  					[
  						53.04272460937503,
  						46.85308837890628
  					],
  					[
  						51.192077636718835,
  						47.04870605468753
  					],
  					[
  						47.675903320312585,
  						45.64147949218756
  					],
  					[
  						46.68212890625003,
  						44.60931396484381
  					],
  					[
  						47.492492675781335,
  						42.9866943359375
  					],
  					[
  						49.11029052734378,
  						41.28228759765625
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0.5
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						18.25183000000007,
  						79.70175000000009
  					],
  					[
  						19.027370000000047,
  						78.56260000000006
  					],
  					[
  						13.762590000000046,
  						77.38034999999996
  					],
  					[
  						10.4445300000001,
  						79.65239000000003
  					],
  					[
  						18.25183000000007,
  						79.70175000000009
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 1,
  			min_zoom: 1
  		}
  	},
  	{
  		type: "Feature",
  		geometry: null,
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-87.02000000000007,
  						79.65999999999997
  					],
  					[
  						-92.87668999999994,
  						78.34332999999995
  					],
  					[
  						-96.70972000000006,
  						80.15777000000011
  					],
  					[
  						-87.02000000000007,
  						79.65999999999997
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-68.50000000000006,
  						83.10632151676583
  					],
  					[
  						-61.89388000000005,
  						82.36165
  					],
  					[
  						-71.18000000000004,
  						79.8000000000001
  					],
  					[
  						-79.75951000000006,
  						77.20967999999999
  					],
  					[
  						-80.56125000000006,
  						76.17812000000006
  					],
  					[
  						-89.49068000000003,
  						76.47238999999999
  					],
  					[
  						-85.09494999999995,
  						79.34543000000005
  					],
  					[
  						-91.58701999999997,
  						81.89429000000004
  					],
  					[
  						-79.30663999999999,
  						83.13056000000003
  					],
  					[
  						-68.50000000000006,
  						83.10632151676583
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-27.10045999999997,
  						83.51966000000004
  					],
  					[
  						-12.208549999999917,
  						81.29154000000005
  					],
  					[
  						-19.70498999999998,
  						78.7512800000001
  					],
  					[
  						-18.472849999999937,
  						76.98565000000002
  					],
  					[
  						-19.37280999999996,
  						74.29561000000007
  					],
  					[
  						-23.442959999999943,
  						72.08016000000006
  					],
  					[
  						-22.349019999999967,
  						70.12945999999997
  					],
  					[
  						-27.74736999999999,
  						68.47046000000006
  					],
  					[
  						-32.81105000000002,
  						67.73547000000005
  					],
  					[
  						-36.3528399999999,
  						65.97890000000007
  					],
  					[
  						-39.81221999999997,
  						65.45848000000004
  					],
  					[
  						-43.37840000000003,
  						60.097720000000095
  					],
  					[
  						-48.26293999999996,
  						60.85842999999994
  					],
  					[
  						-51.63324999999992,
  						63.62690999999998
  					],
  					[
  						-53.96910999999989,
  						67.18899000000008
  					],
  					[
  						-52.980399999999946,
  						68.35759000000002
  					],
  					[
  						-54.68335999999994,
  						69.61002999999994
  					],
  					[
  						-54.00422000000003,
  						71.54718999999997
  					],
  					[
  						-58.58515999999989,
  						75.51727000000011
  					],
  					[
  						-68.50438,
  						76.06140999999997
  					],
  					[
  						-73.15937999999989,
  						78.43270999999996
  					],
  					[
  						-62.651159999999976,
  						81.77042000000006
  					],
  					[
  						-46.76378999999997,
  						82.62795999999994
  					],
  					[
  						-38.622139999999945,
  						83.54904999999997
  					],
  					[
  						-27.10045999999997,
  						83.51966000000004
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Land",
  			scalerank: 0,
  			min_zoom: 0
  		}
  	}
  ];
  var collection = {
  	type: type$1,
  	features: features$1
  };

  var type = "FeatureCollection";
  var features = [
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					82.40047977084697,
  					30.411477362585146
  				],
  				[
  					82.72273400261909,
  					30.3650460881709
  				],
  				[
  					83.76101688022743,
  					29.833321438103667
  				],
  				[
  					84.06673465366615,
  					29.613283189404868
  				],
  				[
  					84.37906701043823,
  					29.494504909781995
  				],
  				[
  					84.70721235549163,
  					29.29635163015881
  				],
  				[
  					85.4086682474215,
  					29.27438914643477
  				],
  				[
  					87.66021040237845,
  					29.15152842866084
  				],
  				[
  					87.78872968948832,
  					29.265604152945144
  				],
  				[
  					87.9841182799839,
  					29.34203359630483
  				],
  				[
  					88.6307971536844,
  					29.350663560497566
  				],
  				[
  					91.03798872270445,
  					29.316505438752642
  				],
  				[
  					92.09549523312535,
  					29.25340851492426
  				],
  				[
  					93.25005008339039,
  					29.069802150991237
  				],
  				[
  					93.60749596555328,
  					29.10858531342629
  				],
  				[
  					94.35602908730107,
  					29.309529120393236
  				],
  				[
  					94.82039350787582,
  					29.542150580355113
  				],
  				[
  					95.15060591022092,
  					29.810118720004624
  				],
  				[
  					95.26543094277343,
  					29.828541368116674
  				],
  				[
  					95.33602094928415,
  					29.740717271436637
  				],
  				[
  					95.37260786334679,
  					29.595739040641774
  				],
  				[
  					95.31690066933615,
  					29.41768789318013
  				],
  				[
  					94.8764624369125,
  					28.967947902943962
  				],
  				[
  					94.87082970579272,
  					28.831961371367896
  				],
  				[
  					95.04353234251215,
  					28.511231594348374
  				],
  				[
  					95.08792239785086,
  					28.21724437103991
  				],
  				[
  					95.39648237506563,
  					28.002916368109368
  				],
  				[
  					95.38283979694057,
  					27.90434357351262
  				],
  				[
  					95.28992557167979,
  					27.78786489512673
  				],
  				[
  					94.83150394081858,
  					27.464163723250437
  				],
  				[
  					94.3951998229783,
  					27.042406521100318
  				],
  				[
  					93.75162153521532,
  					26.732037868755327
  				],
  				[
  					92.67788862505475,
  					26.555123602804102
  				],
  				[
  					92.32225141802209,
  					26.464431464131863
  				],
  				[
  					91.68342736202996,
  					26.214860134378256
  				],
  				[
  					91.25037885942405,
  					26.183208319599487
  				],
  				[
  					90.60607710160897,
  					26.180831203714064
  				],
  				[
  					90.33405236202455,
  					26.13476166432585
  				],
  				[
  					90.11236046749241,
  					26.02952260996345
  				],
  				[
  					89.9249817240021,
  					25.87379568125189
  				],
  				[
  					89.78803917842862,
  					25.632105007422794
  				],
  				[
  					89.61264936723,
  					24.94837413176903
  				],
  				[
  					89.71419355668354,
  					24.584623724866532
  				],
  				[
  					89.74442426957427,
  					23.858673204030282
  				],
  				[
  					90.00570031124198,
  					23.65902130787063
  				],
  				[
  					90.2256868835085,
  					23.418415839119675
  				],
  				[
  					90.38727908728518,
  					23.11982941333723
  				],
  				[
  					90.50753014522837,
  					22.780237738531184
  				]
  			]
  		},
  		properties: {
  			scalerank: 2,
  			featurecla: "River",
  			name: "Brahmaputra",
  			name_alt: "",
  			min_zoom: 2.1,
  			name_en: "Brahmaputra",
  			min_label: 3.1,
  			wikidataid: "Q45403",
  			label: "Brahmaputra",
  			name_ar: "نهر براهمابوترا",
  			name_bn: "ব্রহ্মপুত্র নদ",
  			name_de: "Brahmaputra",
  			name_es: "Brahmaputra",
  			name_fr: "Brahmapoutre",
  			name_el: "Βραχμαπούτρας",
  			name_hi: "ब्रह्मपुत्र नदी",
  			name_hu: "Brahmaputra",
  			name_id: "Sungai Brahmaputra",
  			name_it: "Brahmaputra",
  			name_ja: "ブラマプトラ川",
  			name_ko: "브라마푸트라 강",
  			name_nl: "Brahmaputra",
  			name_pl: "Brahmaputra",
  			name_pt: "Rio Bramaputra",
  			name_ru: "Брахмапутра",
  			name_sv: "Brahmaputra",
  			name_tr: "Brahmaputra Nehri",
  			name_vi: "Brahmaputra",
  			name_zh: "布拉马普特拉河",
  			wdid_score: 4,
  			ne_id: 1159120261
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					94.08400434771664,
  					33.15585765230966
  				],
  				[
  					94.44770307818683,
  					33.1632990585597
  				],
  				[
  					94.9414197123034,
  					33.089272569301585
  				],
  				[
  					95.84043460488513,
  					32.6322720403284
  				],
  				[
  					96.2393249857461,
  					32.52587026623944
  				],
  				[
  					96.94129764199889,
  					31.96554271089866
  				],
  				[
  					97.16515994668728,
  					31.488517564412376
  				],
  				[
  					97.25678226114078,
  					31.096474310830075
  				],
  				[
  					97.84625532429419,
  					30.277738755813786
  				],
  				[
  					98.28457482299385,
  					29.66689748790769
  				],
  				[
  					98.62398563028688,
  					28.963116156524663
  				],
  				[
  					99.02809533080932,
  					27.516279405216792
  				],
  				[
  					99.15015506388275,
  					27.027859605410157
  				],
  				[
  					99.1725826354974,
  					26.02644786224208
  				],
  				[
  					99.24027876179977,
  					25.66825267181096
  				],
  				[
  					99.39127729695662,
  					25.344758205663837
  				],
  				[
  					99.6668160339369,
  					25.013563951105226
  				],
  				[
  					99.91656823120351,
  					24.833833319594092
  				],
  				[
  					100.30031741740297,
  					24.72146291757541
  				],
  				[
  					100.42129194539825,
  					24.647255560804282
  				],
  				[
  					100.48733442586726,
  					24.52594513599911
  				],
  				[
  					100.51994225464341,
  					24.377917995699036
  				],
  				[
  					100.4755521993047,
  					24.163977566010672
  				],
  				[
  					100.13851850789712,
  					23.473115342700623
  				],
  				[
  					100.12239546102205,
  					23.311135565681738
  				],
  				[
  					100.17148807169932,
  					23.106574408454364
  				],
  				[
  					100.98373823446298,
  					21.844971828696714
  				],
  				[
  					101.01825809123395,
  					21.79771373136579
  				],
  				[
  					101.15003299357824,
  					21.849984442629022
  				],
  				[
  					101.18000532430753,
  					21.43657298429403
  				],
  				[
  					100.32910119018953,
  					20.786121731036232
  				],
  				[
  					100.11598758341785,
  					20.41784963630819
  				],
  				[
  					100.54888105672688,
  					20.109237982661128
  				],
  				[
  					100.55908715210452,
  					20.00237112068153
  				],
  				[
  					100.56929324748216,
  					19.89553009691808
  				],
  				[
  					100.59730187378435,
  					19.89304962816807
  				],
  				[
  					101.11478966675517,
  					19.85214773200906
  				],
  				[
  					101.47156375529826,
  					19.870131130446623
  				],
  				[
  					102.18480187379072,
  					20.04890574796036
  				],
  				[
  					101.88373497925826,
  					19.55518911384381
  				],
  				[
  					101.76482750855465,
  					18.721777452056614
  				],
  				[
  					101.49228600464733,
  					18.16002879482781
  				],
  				[
  					101.48598147990771,
  					17.969704494696842
  				],
  				[
  					101.5636511576424,
  					17.82051463467019
  				],
  				[
  					101.58597537639247,
  					17.810463568589427
  				],
  				[
  					102.1135917500925,
  					18.109101670804165
  				],
  				[
  					102.41300499879162,
  					17.932781683824288
  				],
  				[
  					102.99870568238771,
  					17.9616946476916
  				],
  				[
  					103.20019209189374,
  					18.309632066312773
  				],
  				[
  					103.9564766784853,
  					18.24095408779688
  				],
  				[
  					104.7169470560925,
  					17.42885895433008
  				],
  				[
  					104.7793205098688,
  					16.44186493577145
  				],
  				[
  					105.58903852745016,
  					15.570316066952856
  				],
  				[
  					105.5760677429449,
  					15.324646307837298
  				],
  				[
  					105.78168826703427,
  					15.120524400284395
  				],
  				[
  					105.89103559776387,
  					14.771088365126744
  				],
  				[
  					105.86969323122733,
  					14.217840481009958
  				],
  				[
  					105.96493289594125,
  					13.857397365774133
  				],
  				[
  					105.9493266133891,
  					13.350089829964816
  				],
  				[
  					105.97227094932668,
  					12.659641018113092
  				],
  				[
  					105.92989627484735,
  					12.397073065638082
  				],
  				[
  					105.81016198122708,
  					12.286769720911082
  				],
  				[
  					105.65068851117437,
  					12.233956407108792
  				],
  				[
  					105.3681217794024,
  					11.970484117068665
  				],
  				[
  					105.04984663291677,
  					11.804602769411758
  				],
  				[
  					104.95114464723929,
  					11.590920721884856
  				],
  				[
  					105.11258182171909,
  					10.93261465091868
  				],
  				[
  					105.20797651572988,
  					10.706866156451639
  				],
  				[
  					105.5666109558355,
  					10.26707387943165
  				],
  				[
  					106.36108442589074,
  					9.433791408725185
  				]
  			]
  		},
  		properties: {
  			scalerank: 2,
  			featurecla: "River",
  			name: "Mekong",
  			name_alt: "",
  			min_zoom: 2.1,
  			name_en: "Mekong",
  			min_label: 3.1,
  			wikidataid: "Q41179",
  			label: "Mekong",
  			name_ar: "نهر ميكونغ",
  			name_bn: "",
  			name_de: "Mekong",
  			name_es: "Mekong",
  			name_fr: "Mékong",
  			name_el: "Μεκόνγκ",
  			name_hi: "मीकांग नदी",
  			name_hu: "Mekong",
  			name_id: "Mekong",
  			name_it: "Mekong",
  			name_ja: "メコン川",
  			name_ko: "메콩 강",
  			name_nl: "Mekong",
  			name_pl: "Mekong",
  			name_pt: "Rio Mekong",
  			name_ru: "Меконг",
  			name_sv: "Mekong",
  			name_tr: "Mekong",
  			name_vi: "Mê Kông",
  			name_zh: "湄公河",
  			wdid_score: 4,
  			ne_id: 1159121023
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					90.32537072139951,
  					47.650166734398894
  				],
  				[
  					90.20052046098235,
  					47.40801097267918
  				],
  				[
  					89.7334171894961,
  					47.162496242860485
  				],
  				[
  					89.39690026241144,
  					47.06914276792523
  				],
  				[
  					89.04813602087359,
  					47.08743622495655
  				],
  				[
  					86.94356163935473,
  					47.660114447615086
  				],
  				[
  					86.40013227737339,
  					47.85656240497265
  				],
  				[
  					85.2670748229418,
  					47.99438344989507
  				],
  				[
  					84.35684614455272,
  					47.73212555601381
  				],
  				[
  					83.8356376484569,
  					48.0355178899994
  				],
  				[
  					83.61973351434145,
  					48.193983669622426
  				],
  				[
  					83.55115888869014,
  					48.313123684271346
  				],
  				[
  					83.4915759622576,
  					48.778573309924255
  				],
  				[
  					83.61901004428935,
  					48.8964989284143
  				],
  				[
  					83.86840050652995,
  					49.025354112334085
  				],
  				[
  					84.01164757684302,
  					49.17591339781646
  				],
  				[
  					83.88276655470708,
  					49.34623891865047
  				],
  				[
  					83.3637284687675,
  					49.643843492219375
  				],
  				[
  					82.48481570834733,
  					50.06040721292416
  				],
  				[
  					82.14003055209594,
  					50.18215688740382
  				],
  				[
  					81.78108605339659,
  					50.25186839456556
  				],
  				[
  					80.42778364453702,
  					50.3851935898786
  				],
  				[
  					78.54531456900864,
  					50.767289130244706
  				],
  				[
  					77.24286176952427,
  					51.869030666707445
  				],
  				[
  					76.99884565624205,
  					52.13010000264599
  				],
  				[
  					76.6061047708238,
  					52.692520453494595
  				],
  				[
  					76.32787885936435,
  					52.90178416606054
  				],
  				[
  					75.58952599477806,
  					53.29648875590587
  				],
  				[
  					75.30933637889154,
  					53.496321519578544
  				],
  				[
  					75.11782352081784,
  					53.687886054084515
  				],
  				[
  					75.02191206248412,
  					53.8479021266763
  				],
  				[
  					74.99359337758818,
  					53.98559398051799
  				],
  				[
  					74.51992719920088,
  					54.375285956431014
  				],
  				[
  					74.39617506296992,
  					54.42505036072808
  				],
  				[
  					74.12368523549486,
  					54.534526882538415
  				],
  				[
  					73.85061404815653,
  					54.64400340434875
  				],
  				[
  					73.72509199411957,
  					54.69376780864583
  				],
  				[
  					73.63321129750463,
  					54.74134888367857
  				],
  				[
  					73.46589592885161,
  					54.82971558289768
  				],
  				[
  					73.37612104685255,
  					54.877296657930415
  				],
  				[
  					73.08177208851805,
  					55.229549058647976
  				],
  				[
  					73.11515506377859,
  					55.30603017843994
  				],
  				[
  					73.33405643096697,
  					55.445763251357164
  				],
  				[
  					73.65517378122865,
  					55.58549632427439
  				],
  				[
  					74.24108117055391,
  					55.76124787049906
  				],
  				[
  					74.47186811716944,
  					55.87488434510888
  				],
  				[
  					74.62452029815964,
  					56.02727814393762
  				],
  				[
  					74.71030317576412,
  					56.203339748756036
  				],
  				[
  					74.70265506378493,
  					56.41234507916052
  				],
  				[
  					74.6298429706857,
  					56.644346421934884
  				],
  				[
  					74.47806928904447,
  					56.859475409565945
  				],
  				[
  					74.27994184763742,
  					57.02778554954058
  				],
  				[
  					73.69021040232255,
  					57.255471910218574
  				],
  				[
  					72.90105960479335,
  					57.446312974672466
  				],
  				[
  					71.47432498564703,
  					57.65875478782435
  				],
  				[
  					70.28902265816834,
  					57.94623078066405
  				],
  				[
  					68.8398604674073,
  					58.03358978945346
  				],
  				[
  					68.68060662219185,
  					58.06849721946662
  				],
  				[
  					68.38450066515941,
  					58.13310567893953
  				],
  				[
  					68.22403242378508,
  					58.16727671979254
  				],
  				[
  					68.24538770942968,
  					58.24941640892047
  				],
  				[
  					68.26811242053003,
  					58.332382920965074
  				],
  				[
  					68.5037052753487,
  					58.52707387962471
  				],
  				[
  					68.60142540881262,
  					58.74607859967766
  				],
  				[
  					68.79314497261547,
  					58.98407440859789
  				],
  				[
  					68.96832807808491,
  					59.40474640566988
  				],
  				[
  					69.12955854683557,
  					59.55042226830068
  				],
  				[
  					69.33430057157597,
  					59.64953766543648
  				],
  				[
  					69.78274865100485,
  					59.87262482364051
  				],
  				[
  					69.804556105432,
  					59.996028143953495
  				],
  				[
  					69.7676591327756,
  					60.10713247338103
  				],
  				[
  					69.83731896350506,
  					60.25686493594672
  				],
  				[
  					69.8040910175414,
  					60.51501455346079
  				],
  				[
  					69.7250777525671,
  					60.65833913842229
  				],
  				[
  					69.49749474475371,
  					60.81308421492031
  				],
  				[
  					69.39806928902414,
  					60.86172465681503
  				],
  				[
  					69.17914208361961,
  					60.96873362898343
  				],
  				[
  					68.95981438586483,
  					61.07570384382761
  				],
  				[
  					68.85913577665218,
  					61.12422801374967
  				],
  				[
  					68.82178663521324,
  					61.106709703202725
  				],
  				[
  					68.78611697782378,
  					61.08934642195267
  				],
  				[
  					68.40846561063475,
  					61.20691030541667
  				],
  				[
  					68.22589277534757,
  					61.44767080346452
  				],
  				[
  					67.64510135281921,
  					61.730470079181785
  				],
  				[
  					67.23282677599465,
  					62.06812388777689
  				],
  				[
  					66.28074018744917,
  					62.44683462182789
  				],
  				[
  					65.68873497911346,
  					62.66237702091729
  				],
  				[
  					65.40994062689882,
  					62.84727529565761
  				],
  				[
  					65.3032287942161,
  					63.0750650092002
  				],
  				[
  					65.42725223171658,
  					63.3065237494355
  				],
  				[
  					65.68899336127492,
  					63.58733348250952
  				],
  				[
  					65.83332563666613,
  					64.01516266545396
  				],
  				[
  					65.91838504421855,
  					64.11505320907413
  				],
  				[
  					65.92603315619775,
  					64.22434886337145
  				],
  				[
  					65.5822815285922,
  					64.7073684760036
  				],
  				[
  					65.51065799343567,
  					64.96564728459838
  				],
  				[
  					65.41102583197693,
  					65.04016469996326
  				],
  				[
  					65.36839277533613,
  					65.16746959091428
  				],
  				[
  					65.76630130398357,
  					65.802676296646
  				],
  				[
  					65.8353926939578,
  					65.99979604762335
  				],
  				[
  					65.8392684263797,
  					66.15717662216825
  				],
  				[
  					66.34140831895982,
  					66.44317983668763
  				],
  				[
  					66.677305128857,
  					66.56653148056832
  				],
  				[
  					67.03309736518653,
  					66.60508209905807
  				],
  				[
  					68.19287153511306,
  					66.57575572373243
  				],
  				[
  					69.013493279908,
  					66.78835256618119
  				],
  				[
  					69.93043989449501,
  					66.74683055283468
  				],
  				[
  					70.84010013212887,
  					66.65303782822492
  				],
  				[
  					71.46957075387618,
  					66.66347646754788
  				]
  			]
  		},
  		properties: {
  			scalerank: 2,
  			featurecla: "River",
  			name: "Ob",
  			name_alt: "",
  			min_zoom: 2.1,
  			name_en: "Ob",
  			min_label: 3.1,
  			wikidataid: "Q973",
  			label: "Ob",
  			name_ar: "أوبي",
  			name_bn: "ওব নদী",
  			name_de: "Ob",
  			name_es: "Obi",
  			name_fr: "Ob",
  			name_el: "Ομπ",
  			name_hi: "ओब नदी",
  			name_hu: "Ob",
  			name_id: "Sungai Ob",
  			name_it: "Ob'",
  			name_ja: "オビ川",
  			name_ko: "오비 강",
  			name_nl: "Ob",
  			name_pl: "Ob",
  			name_pt: "Rio Ob",
  			name_ru: "Обь",
  			name_sv: "Ob",
  			name_tr: "Obi Nehri",
  			name_vi: "Sông Obi",
  			name_zh: "鄂畢河",
  			wdid_score: 4,
  			ne_id: 1159114911
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					-124.83563045947423,
  					56.75692352968272
  				],
  				[
  					-124.20045039940291,
  					56.243492336646824
  				],
  				[
  					-123.88873815981833,
  					56.088824774797246
  				],
  				[
  					-123.54353959210863,
  					56.04471893983613
  				],
  				[
  					-122.7300750331861,
  					56.09853994406811
  				],
  				[
  					-122.2217081305148,
  					56.021232001359465
  				],
  				[
  					-121.97363541729766,
  					56.019785061255305
  				],
  				[
  					-121.3571355800556,
  					56.18974884706327
  				],
  				[
  					-120.24459366924387,
  					56.151973375057906
  				],
  				[
  					-119.50944474345967,
  					56.25145050721977
  				],
  				[
  					-119.18871415899591,
  					56.24437083599578
  				],
  				[
  					-118.67034786667612,
  					56.01621938742716
  				],
  				[
  					-118.34623328334149,
  					55.98131195741399
  				],
  				[
  					-117.77913611537048,
  					56.054098212297106
  				],
  				[
  					-117.50612952357251,
  					56.15535818137303
  				],
  				[
  					-117.20036007370149,
  					56.41231924094437
  				],
  				[
  					-117.17689897344098,
  					56.545024319069896
  				],
  				[
  					-117.25821183965225,
  					56.854876207091976
  				],
  				[
  					-117.13227637415694,
  					57.28102590598691
  				],
  				[
  					-117.10752336308914,
  					57.65415558535038
  				],
  				[
  					-117.03701087122688,
  					57.929229234440015
  				],
  				[
  					-116.85415381556209,
  					58.06958242454475
  				],
  				[
  					-116.67623185918117,
  					58.12740835227936
  				],
  				[
  					-116.5421056791676,
  					58.288948879623746
  				],
  				[
  					-116.32315263554695,
  					58.37095937767096
  				],
  				[
  					-115.98847022180863,
  					58.418708401108645
  				],
  				[
  					-114.97251156295039,
  					58.40971670188986
  				],
  				[
  					-114.61323116744114,
  					58.475862535223456
  				],
  				[
  					-114.48895903711025,
  					58.5121652289085
  				],
  				[
  					-114.21144044681779,
  					58.59048086204683
  				],
  				[
  					-113.92362209761417,
  					58.66495952008749
  				],
  				[
  					-113.76845069054974,
  					58.68975128847953
  				],
  				[
  					-113.58348782026906,
  					58.72357351341455
  				],
  				[
  					-113.29752982262794,
  					58.807844855374526
  				],
  				[
  					-113.14918616418008,
  					58.85532257754268
  				],
  				[
  					-112.64761471235515,
  					59.097607530343126
  				],
  				[
  					-112.32267330610385,
  					59.12590037702293
  				],
  				[
  					-112.06504045291271,
  					59.08357737897589
  				],
  				[
  					-111.92647009972205,
  					58.97345490176191
  				],
  				[
  					-111.41076514366532,
  					59.00505504010839
  				],
  				[
  					-111.44383806033211,
  					59.53662466087874
  				],
  				[
  					-111.56902421755917,
  					59.84794932722113
  				],
  				[
  					-112.38313473188535,
  					60.221544094475234
  				],
  				[
  					-112.49320553266703,
  					60.314613349032896
  				],
  				[
  					-112.48369706912533,
  					60.45052236596052
  				],
  				[
  					-112.57134029829234,
  					60.54059438744525
  				],
  				[
  					-113.16011572960981,
  					60.8532368028111
  				],
  				[
  					-113.28245968306082,
  					61.17381155053373
  				],
  				[
  					-113.45965816938966,
  					61.242670396562644
  				],
  				[
  					-113.58197951440154,
  					61.24420777042333
  				],
  				[
  					-113.70401017948177,
  					61.245874335364746
  				],
  				[
  					-113.83890020176014,
  					61.25600291609395
  				],
  				[
  					-114.13603484277289,
  					61.278107510006805
  				],
  				[
  					-114.43324215376855,
  					61.3001862657035
  				],
  				[
  					-114.56835018599566,
  					61.31021149356813
  				],
  				[
  					-116.33434058313813,
  					61.08939809838495
  				],
  				[
  					-116.6986335925797,
  					61.12138580997362
  				],
  				[
  					-117.66810930059138,
  					61.30783437768271
  				],
  				[
  					-118.15497880742927,
  					61.42147085229253
  				],
  				[
  					-119.07063351120897,
  					61.30132314721392
  				],
  				[
  					-119.7683695074581,
  					61.33413768171927
  				],
  				[
  					-120.31781917380145,
  					61.4633546006651
  				],
  				[
  					-120.57503861553425,
  					61.569678860105626
  				],
  				[
  					-120.81339615948052,
  					61.780957953530944
  				],
  				[
  					-121.58916276104611,
  					61.973685207763495
  				],
  				[
  					-123.02421728579144,
  					62.24229930281665
  				],
  				[
  					-123.25466833559705,
  					62.34890778263478
  				],
  				[
  					-123.29611283429513,
  					62.50993154565626
  				],
  				[
  					-123.2289334723157,
  					62.86667979598322
  				],
  				[
  					-123.3205041103369,
  					63.05733999292407
  				],
  				[
  					-123.9544189052613,
  					63.74101919214557
  				],
  				[
  					-124.33648860741127,
  					64.00276032170389
  				],
  				[
  					-124.48934749413064,
  					64.22316030542875
  				],
  				[
  					-124.7616822923088,
  					64.42387156845037
  				],
  				[
  					-125.02515458234892,
  					64.69202057561291
  				],
  				[
  					-125.30022823143857,
  					64.80596710881649
  				],
  				[
  					-126.18162146060875,
  					65.04910472274976
  				],
  				[
  					-126.92932775943987,
  					65.2913896755502
  				],
  				[
  					-128.03019079655365,
  					65.60834707301241
  				],
  				[
  					-128.67141780664736,
  					65.72275869410662
  				],
  				[
  					-128.90856095443476,
  					65.86055390081289
  				],
  				[
  					-128.98336259017725,
  					66.02966502548806
  				],
  				[
  					-128.84207922429127,
  					66.3225153672861
  				],
  				[
  					-129.02560807357585,
  					66.45547882757309
  				],
  				[
  					-129.77052384506322,
  					66.7316118435247
  				],
  				[
  					-130.0437113043742,
  					66.88087921819978
  				],
  				[
  					-130.34503658106811,
  					67.21377879502403
  				],
  				[
  					-130.5328287360168,
  					67.30584035915201
  				],
  				[
  					-130.75940405340052,
  					67.35366689723814
  				],
  				[
  					-131.20867895574605,
  					67.45469432236875
  				],
  				[
  					-132.65282853257474,
  					67.29330882432124
  				],
  				[
  					-133.01577633988822,
  					67.29274038356603
  				],
  				[
  					-133.3725504284313,
  					67.35935130479025
  				],
  				[
  					-133.8297318249175,
  					67.52058177354088
  				],
  				[
  					-134.19007158728874,
  					67.74152435980479
  				],
  				[
  					-134.39956784379999,
  					68.05264232041803
  				],
  				[
  					-134.40719011756306,
  					68.18209178330916
  				],
  				[
  					-134.15968584510114,
  					68.4496723497165
  				],
  				[
  					-134.24422848833063,
  					68.70619415961333
  				],
  				[
  					-134.83589779985644,
  					68.9637753363722
  				],
  				[
  					-135.3134138724495,
  					69.37499054633476
  				]
  			]
  		},
  		properties: {
  			scalerank: 2,
  			featurecla: "River",
  			name: "Peace",
  			name_alt: "",
  			min_zoom: 2.1,
  			name_en: "Peace",
  			min_label: 3.1,
  			wikidataid: "Q2220",
  			label: "Peace",
  			name_ar: "",
  			name_bn: "",
  			name_de: "Peace",
  			name_es: "Río de la Paz",
  			name_fr: "rivière de la Paix",
  			name_el: "",
  			name_hi: "",
  			name_hu: "Peace-folyó",
  			name_id: "",
  			name_it: "Peace",
  			name_ja: "ピース川",
  			name_ko: "피스 강",
  			name_nl: "Peace",
  			name_pl: "Peace",
  			name_pt: "Rio Peace",
  			name_ru: "Пис",
  			name_sv: "Peace",
  			name_tr: "",
  			name_vi: "",
  			name_zh: "皮斯河",
  			wdid_score: 4,
  			ne_id: 1159117465
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					8.219788038779399,
  					48.04680919045518
  				],
  				[
  					8.553359409223447,
  					47.98081838641845
  				],
  				[
  					9.41408206547689,
  					48.13835399026023
  				],
  				[
  					10.71989383306024,
  					48.64871043557477
  				],
  				[
  					11.683555942439085,
  					48.794127916044104
  				],
  				[
  					12.032991977596737,
  					49.02749868427421
  				],
  				[
  					12.155762261614143,
  					49.00075613056316
  				],
  				[
  					12.38378451910205,
  					48.95181854918275
  				],
  				[
  					12.506554803119457,
  					48.92755646422172
  				],
  				[
  					12.659697910216437,
  					48.87510488544547
  				],
  				[
  					12.99660241054329,
  					48.75609406187728
  				],
  				[
  					13.33350691087017,
  					48.636385606473155
  				],
  				[
  					13.486650017967122,
  					48.58184113218908
  				],
  				[
  					14.701666294013677,
  					48.234058742864775
  				],
  				[
  					14.995601840889833,
  					48.21305227313813
  				],
  				[
  					15.634425896881964,
  					48.37461863869868
  				],
  				[
  					15.936733025789437,
  					48.353482977891304
  				],
  				[
  					16.87807091641821,
  					48.17178864195307
  				],
  				[
  					17.48847293464982,
  					47.86746613218622
  				],
  				[
  					17.857132602620027,
  					47.75842886005037
  				],
  				[
  					18.696512892336926,
  					47.880953681014404
  				],
  				[
  					18.909884881270074,
  					47.80610036883962
  				],
  				[
  					19.025691766036175,
  					47.668201809268766
  				],
  				[
  					18.933242628665994,
  					47.17593211525637
  				],
  				[
  					18.9523112321817,
  					46.77776520444749
  				],
  				[
  					18.88228966642623,
  					46.279656073586125
  				],
  				[
  					18.764209018639292,
  					46.0343480494966
  				],
  				[
  					18.78051293302738,
  					45.96511454933356
  				],
  				[
  					18.810976189863425,
  					45.901436265641905
  				],
  				[
  					18.8872247657101,
  					45.80624827736027
  				],
  				[
  					19.00909071216242,
  					45.6216600612137
  				],
  				[
  					19.072768995854062,
  					45.52151113543205
  				],
  				[
  					19.155205824467686,
  					45.44800141049686
  				],
  				[
  					19.308633151942246,
  					45.313461819024965
  				],
  				[
  					19.39223270028242,
  					45.246825059584594
  				],
  				[
  					19.51297468433239,
  					45.23265279802855
  				],
  				[
  					19.77689914315505,
  					45.19142792416771
  				],
  				[
  					20.040487705167834,
  					45.14827810320399
  				],
  				[
  					20.16024783700425,
  					45.12830516212318
  				],
  				[
  					20.541981642344325,
  					44.801761786470834
  				],
  				[
  					20.767807651459805,
  					44.7441942408977
  				],
  				[
  					21.360071241956973,
  					44.82666982683553
  				],
  				[
  					21.56202273935361,
  					44.7689472519655
  				],
  				[
  					22.14508792490281,
  					44.47842234962059
  				],
  				[
  					22.459022251075936,
  					44.7025171982543
  				],
  				[
  					22.705725538837356,
  					44.57800283464702
  				],
  				[
  					22.474008416440597,
  					44.40922760678177
  				],
  				[
  					22.65714969248299,
  					44.23492300066128
  				],
  				[
  					22.944832391051847,
  					43.82378530534713
  				],
  				[
  					23.332302280376325,
  					43.897010809904714
  				],
  				[
  					24.100679152124172,
  					43.74105133724785
  				],
  				[
  					25.569271681426926,
  					43.68844472917472
  				],
  				[
  					26.065158725699746,
  					43.94349376075127
  				],
  				[
  					27.242399529740908,
  					44.1759860296324
  				],
  				[
  					27.28505842459785,
  					44.1530416936948
  				],
  				[
  					27.301517368282816,
  					44.13337881120775
  				],
  				[
  					27.384419284787043,
  					44.16655508073913
  				],
  				[
  					27.600853102333502,
  					44.23523305925504
  				],
  				[
  					27.823836907672927,
  					44.303084214854266
  				],
  				[
  					27.926388787556164,
  					44.33378001563564
  				],
  				[
  					28.05278934094207,
  					44.40940847429479
  				],
  				[
  					28.044107700317028,
  					44.49583730730295
  				],
  				[
  					27.876676059691363,
  					44.74411672624926
  				],
  				[
  					27.98819380057722,
  					45.21848053647251
  				],
  				[
  					28.046730279255854,
  					45.279316616388115
  				],
  				[
  					28.15744703544118,
  					45.39591156674665
  				],
  				[
  					28.223011508911497,
  					45.46936961524955
  				],
  				[
  					28.346117689738804,
  					45.43491435401894
  				],
  				[
  					28.563701307903756,
  					45.351095180841526
  				],
  				[
  					28.679779493939378,
  					45.3040308701317
  				],
  				[
  					29.149724969201657,
  					45.464925442072456
  				],
  				[
  					29.603289015427436,
  					45.29330801043113
  				]
  			]
  		},
  		properties: {
  			scalerank: 2,
  			featurecla: "River",
  			name: "Donau",
  			name_alt: "Danube",
  			min_zoom: 2.1,
  			name_en: "Danube",
  			min_label: 3.1,
  			wikidataid: "Q1653",
  			label: "Donau",
  			name_ar: "دانوب",
  			name_bn: "দানিউব নদী",
  			name_de: "Donau",
  			name_es: "Danubio",
  			name_fr: "Danube",
  			name_el: "Δούναβης",
  			name_hi: "डैन्यूब नदी",
  			name_hu: "Duna",
  			name_id: "Sungai Donau",
  			name_it: "Danubio",
  			name_ja: "ドナウ川",
  			name_ko: "도나우 강",
  			name_nl: "Donau",
  			name_pl: "Dunaj",
  			name_pt: "Rio Danúbio",
  			name_ru: "Дунай",
  			name_sv: "Donau",
  			name_tr: "Tuna",
  			name_vi: "Sông Donau",
  			name_zh: "多瑙河",
  			wdid_score: 4,
  			ne_id: 1159118769
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					-55.0752890692212,
  					-14.319384047099
  				],
  				[
  					-55.43245073100648,
  					-14.357366224833527
  				],
  				[
  					-56.12057410340506,
  					-14.689128920147354
  				],
  				[
  					-56.3346695623903,
  					-14.85857594163241
  				],
  				[
  					-56.39368404806761,
  					-15.068382256737415
  				],
  				[
  					-56.08721696636066,
  					-15.843322035386343
  				],
  				[
  					-55.9346939764512,
  					-16.078863213772706
  				],
  				[
  					-55.9273300848496,
  					-16.215340671455543
  				],
  				[
  					-55.99913448751917,
  					-16.336883640206025
  				],
  				[
  					-56.42939246278131,
  					-16.6524716122125
  				],
  				[
  					-56.54054846864112,
  					-16.808224379140206
  				],
  				[
  					-56.58974443218298,
  					-17.067174981354782
  				],
  				[
  					-56.980159878148086,
  					-17.594739678622517
  				],
  				[
  					-57.1750058661046,
  					-17.735196221591828
  				],
  				[
  					-57.31822709820153,
  					-17.92546884529051
  				],
  				[
  					-57.44271562359265,
  					-18.46755462003226
  				],
  				[
  					-57.59976030132765,
  					-18.8793641089662
  				],
  				[
  					-57.33719234885264,
  					-19.210920098550858
  				],
  				[
  					-57.38695675314972,
  					-19.393492933838047
  				],
  				[
  					-57.45651323101458,
  					-19.484314263591017
  				],
  				[
  					-57.610399186825745,
  					-19.683933861980485
  				],
  				[
  					-57.76641679546894,
  					-19.883078683148277
  				],
  				[
  					-57.842381150937996,
  					-19.972475681236197
  				],
  				[
  					-57.93052176576582,
  					-20.021981703371814
  				],
  				[
  					-58.01009701194127,
  					-20.073348077069937
  				],
  				[
  					-58.166392381408045,
  					-20.176700941653678
  				],
  				[
  					-57.8706739976178,
  					-20.732687676681948
  				],
  				[
  					-57.888786587136096,
  					-21.102639255459465
  				],
  				[
  					-57.937155727761294,
  					-22.09017587655717
  				],
  				[
  					-57.974672817605196,
  					-22.16221282317204
  				],
  				[
  					-57.83235592307338,
  					-22.550147800387137
  				],
  				[
  					-57.82928117535201,
  					-22.81979542408613
  				],
  				[
  					-57.34210160992038,
  					-23.702738946225075
  				],
  				[
  					-57.20110246441199,
  					-24.043079929299353
  				],
  				[
  					-57.12177914084397,
  					-24.334741713154692
  				],
  				[
  					-57.13038326682057,
  					-24.639529310812158
  				],
  				[
  					-57.26846269390445,
  					-24.97160206471974
  				],
  				[
  					-57.573146938697334,
  					-25.258457940371926
  				],
  				[
  					-57.630507778541315,
  					-25.421755466414247
  				],
  				[
  					-57.62866034608689,
  					-25.510535577091687
  				],
  				[
  					-57.62973263205694,
  					-25.601176039331634
  				],
  				[
  					-57.70431464296219,
  					-25.714818973495497
  				],
  				[
  					-57.88774013938219,
  					-25.99701105113334
  				],
  				[
  					-58.125425889708666,
  					-26.363377577420614
  				],
  				[
  					-58.36278220277927,
  					-26.729537397978724
  				],
  				[
  					-58.54523230653977,
  					-27.011109358429067
  				],
  				[
  					-58.61817359071975,
  					-27.123718763947096
  				],
  				[
  					-58.85022660992641,
  					-27.610769138298004
  				],
  				[
  					-58.893066372296374,
  					-27.96475269949734
  				],
  				[
  					-59.0738046942372,
  					-28.348553562129077
  				],
  				[
  					-59.2273612127925,
  					-29.05832935965796
  				],
  				[
  					-59.39623979352234,
  					-29.19682219820018
  				],
  				[
  					-59.52264034690826,
  					-29.40301116304476
  				],
  				[
  					-59.58896704775488,
  					-29.70495655692617
  				],
  				[
  					-59.654286058171806,
  					-30.717246189091682
  				],
  				[
  					-60.06351172549115,
  					-31.269615573859518
  				],
  				[
  					-60.38044328473721,
  					-31.531666762011604
  				],
  				[
  					-60.59117977562347,
  					-31.781573988575104
  				],
  				[
  					-60.696212124256704,
  					-32.05111825940951
  				],
  				[
  					-60.72649451357974,
  					-32.33456349053044
  				],
  				[
  					-60.71249020042865,
  					-32.55703053154696
  				],
  				[
  					-60.64159013532419,
  					-32.784613539360365
  				],
  				[
  					-60.49017818870901,
  					-33.01943124769464
  				],
  				[
  					-60.248952602770544,
  					-33.24339690524762
  				],
  				[
  					-59.868510708237764,
  					-33.49831674574343
  				],
  				[
  					-59.20043779156843,
  					-33.81235442478115
  				],
  				[
  					-58.66884233258193,
  					-33.99358367282875
  				],
  				[
  					-58.429477098205965,
  					-33.99094817478186
  				]
  			]
  		},
  		properties: {
  			scalerank: 2,
  			featurecla: "River",
  			name: "Paraná",
  			name_alt: "",
  			min_zoom: 2.1,
  			name_en: "Paraná",
  			min_label: 3.1,
  			wikidataid: "Q127892",
  			label: "Paraná",
  			name_ar: "نهر بارانا",
  			name_bn: "",
  			name_de: "Río Paraná",
  			name_es: "Paraná",
  			name_fr: "Paraná",
  			name_el: "Παρανά",
  			name_hi: "पराना नदी",
  			name_hu: "Paraná",
  			name_id: "Sungai Paraná",
  			name_it: "Paraná",
  			name_ja: "パラナ川",
  			name_ko: "파라나 강",
  			name_nl: "Paraná",
  			name_pl: "Parana",
  			name_pt: "Rio Paraná",
  			name_ru: "Парана",
  			name_sv: "Paranáfloden",
  			name_tr: "Paraná Nehri",
  			name_vi: "Sông Paraná",
  			name_zh: "巴拉那河",
  			wdid_score: 5,
  			ne_id: 1159118169
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					26.249281853955694,
  					-11.742900485890779
  				],
  				[
  					25.938293084423208,
  					-11.653500258025836
  				],
  				[
  					25.639603305776177,
  					-11.18577686935209
  				],
  				[
  					25.711175164500418,
  					-10.742548109584689
  				],
  				[
  					25.467107374785883,
  					-10.375180352421765
  				],
  				[
  					25.448193800567083,
  					-10.092923679243547
  				],
  				[
  					25.501937290150607,
  					-9.455029799032665
  				],
  				[
  					25.646734653432446,
  					-9.248272393432877
  				],
  				[
  					25.923203566193962,
  					-9.099702650593741
  				],
  				[
  					26.08143680187169,
  					-8.766234633014285
  				],
  				[
  					26.441311476352297,
  					-8.272001234574809
  				],
  				[
  					26.73204308442638,
  					-8.161723728063947
  				],
  				[
  					26.857565138463343,
  					-8.046588636917654
  				],
  				[
  					26.9193701514844,
  					-7.916674086135885
  				],
  				[
  					26.888260939244702,
  					-7.642375583530622
  				],
  				[
  					27.009390496536867,
  					-6.987428480663418
  				],
  				[
  					27.017090284948353,
  					-6.622179457224455
  				],
  				[
  					26.93048058442716,
  					-5.61025156008499
  				],
  				[
  					26.98189863455758,
  					-5.252237237166895
  				],
  				[
  					26.946396925573055,
  					-5.008634535343006
  				],
  				[
  					26.81245161307254,
  					-4.746738376487791
  				],
  				[
  					26.359611036898826,
  					-4.334722181824681
  				],
  				[
  					26.1366272315594,
  					-4.068278496927782
  				],
  				[
  					26.014464145621417,
  					-3.7429753556504437
  				],
  				[
  					25.992850477815352,
  					-3.587061099871825
  				],
  				[
  					25.945321079214892,
  					-3.244330081804044
  				],
  				[
  					25.897778761506373,
  					-2.902309614680277
  				],
  				[
  					25.876178012808367,
  					-2.7485140926256264
  				],
  				[
  					25.86847822439688,
  					-2.604982801934952
  				],
  				[
  					25.85013309093327,
  					-2.2594806351855183
  				],
  				[
  					25.82822228364151,
  					-1.846359856782179
  				],
  				[
  					25.809877150177897,
  					-1.4999662715757154
  				],
  				[
  					25.80217736176641,
  					-1.35464568441693
  				],
  				[
  					25.68156456879717,
  					-1.0123409969155546
  				],
  				[
  					25.552425164499766,
  					-0.778815199388589
  				],
  				[
  					25.480181512155752,
  					-0.5390365535542969
  				],
  				[
  					25.513409458119412,
  					-0.054414971521097755
  				],
  				[
  					25.409436476348162,
  					0.34566396728257587
  				],
  				[
  					24.933599887804604,
  					0.5385720890281505
  				],
  				[
  					24.292295363062436,
  					0.7817097029614075
  				],
  				[
  					22.73487104664997,
  					1.9500363224322257
  				],
  				[
  					22.347091098731738,
  					2.129379380701181
  				],
  				[
  					21.712607863052114,
  					2.141032416182995
  				],
  				[
  					20.267528110442186,
  					1.9234487980180575
  				],
  				[
  					19.907653435961578,
  					1.8428852400750344
  				],
  				[
  					19.14284223804185,
  					1.5735993514020805
  				],
  				[
  					18.712480909915115,
  					1.1901085473640904
  				],
  				[
  					18.4875850765809,
  					0.9113658715817223
  				],
  				[
  					18.33586307137196,
  					0.5869929060856265
  				],
  				[
  					18.19923058439224,
  					0.09978750243784873
  				],
  				[
  					17.59957726407734,
  					-0.6490556779036893
  				],
  				[
  					17.523716261472856,
  					-0.743830254726987
  				],
  				[
  					16.865306837642123,
  					-1.2258163387132868
  				],
  				[
  					16.407091912510054,
  					-1.7409270157986825
  				],
  				[
  					15.972803175529151,
  					-2.7123922664536124
  				],
  				[
  					16.0062895036543,
  					-3.535132744972529
  				],
  				[
  					15.753540073314753,
  					-3.8551648901560966
  				],
  				[
  					15.170991652088446,
  					-4.343507175314301
  				],
  				[
  					14.582603794013181,
  					-4.97023894615014
  				],
  				[
  					14.19590905117309,
  					-4.971840915551191
  				],
  				[
  					14.074624464584076,
  					-5.020313409040966
  				],
  				[
  					13.826422560286204,
  					-5.257714938989835
  				],
  				[
  					13.60994998541554,
  					-5.363393243026714
  				],
  				[
  					13.46959679531082,
  					-5.759596449408505
  				],
  				[
  					13.428152296612723,
  					-5.776442966335658
  				],
  				[
  					13.375597364971895,
  					-5.8642412247995495
  				],
  				[
  					13.024869419006961,
  					-5.984388929878158
  				],
  				[
  					12.735171339578699,
  					-5.965682061388499
  				],
  				[
  					12.322431674863509,
  					-6.10009246177966
  				]
  			]
  		},
  		properties: {
  			scalerank: 2,
  			featurecla: "River",
  			name: "Congo",
  			name_alt: "",
  			min_zoom: 2.1,
  			name_en: "Congo",
  			min_label: 3.1,
  			wikidataid: "Q3503",
  			label: "Congo",
  			name_ar: "نهر الكونغو",
  			name_bn: "কঙ্গো নদী",
  			name_de: "Kongo",
  			name_es: "río Congo",
  			name_fr: "Congo",
  			name_el: "Κονγκό",
  			name_hi: "कांगो नदी",
  			name_hu: "Kongó",
  			name_id: "Sungai Kongo",
  			name_it: "Congo",
  			name_ja: "コンゴ川",
  			name_ko: "콩고 강",
  			name_nl: "Kongo",
  			name_pl: "Kongo",
  			name_pt: "Rio Congo",
  			name_ru: "Конго",
  			name_sv: "Kongofloden",
  			name_tr: "Kongo Nehri",
  			name_vi: "Sông Congo",
  			name_zh: "刚果河",
  			wdid_score: 4,
  			ne_id: 1159120849
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					107.98010704959515,
  					54.00414581971077
  				],
  				[
  					108.0433590027204,
  					54.10204682068773
  				],
  				[
  					108.04067182824122,
  					54.18501333273234
  				],
  				[
  					107.78290978396936,
  					54.29379222270673
  				],
  				[
  					107.18170617068569,
  					53.9213601751792
  				],
  				[
  					107.02316287641423,
  					53.87113068299149
  				],
  				[
  					106.92714806521593,
  					53.884334011442064
  				],
  				[
  					106.10735314333766,
  					53.88544505473634
  				],
  				[
  					105.66541629437754,
  					54.02166413025772
  				],
  				[
  					105.28776492718853,
  					54.38500112570189
  				],
  				[
  					105.15526655479218,
  					54.88093984640699
  				],
  				[
  					105.16973595583391,
  					55.053590806694146
  				],
  				[
  					105.72319054567987,
  					55.844756985082725
  				],
  				[
  					105.78571902875302,
  					56.22912628846967
  				],
  				[
  					106.24641442263507,
  					56.485260525124346
  				],
  				[
  					106.18802005414526,
  					56.564790554421535
  				],
  				[
  					105.98229617719133,
  					56.65116771099741
  				],
  				[
  					105.86189008995126,
  					56.760721747456174
  				],
  				[
  					106.0110282735456,
  					56.896940822977555
  				],
  				[
  					106.32501427615102,
  					57.010396430074366
  				],
  				[
  					106.80725874229879,
  					57.111294664124244
  				],
  				[
  					107.0328780456851,
  					57.270845648825414
  				],
  				[
  					107.3934761902178,
  					57.30092133241928
  				],
  				[
  					107.69723025922943,
  					57.438303127667226
  				],
  				[
  					108.0815478861841,
  					57.760298977277884
  				],
  				[
  					108.60890587772266,
  					58.04532033958371
  				],
  				[
  					108.92506229048433,
  					58.16513214785242
  				],
  				[
  					109.48569990441888,
  					58.28305776634248
  				],
  				[
  					110.0088204285095,
  					58.56332489687745
  				],
  				[
  					111.10126020715973,
  					58.783053086982505
  				],
  				[
  					111.83387698776161,
  					59.14274689395009
  				],
  				[
  					112.34996951706054,
  					59.30067007103405
  				],
  				[
  					112.6427681824263,
  					59.5445311550194
  				],
  				[
  					113.51082889206518,
  					59.92807363548968
  				],
  				[
  					114.43092776902199,
  					60.493052069736734
  				],
  				[
  					114.94443647670633,
  					60.73241730411269
  				],
  				[
  					115.4717944682449,
  					60.74453542748513
  				],
  				[
  					116.15180464077366,
  					60.607153632237186
  				],
  				[
  					116.86235558478691,
  					60.355282701246594
  				],
  				[
  					117.46821007697685,
  					60.013184719474395
  				],
  				[
  					117.80162641812402,
  					59.88042796491658
  				],
  				[
  					118.31740888882919,
  					59.80053620059334
  				],
  				[
  					118.66007531135662,
  					59.87737905541135
  				],
  				[
  					119.36297814339068,
  					60.16428660749584
  				],
  				[
  					119.4966909119459,
  					60.18916880964437
  				],
  				[
  					119.81561201383519,
  					60.24858378767196
  				],
  				[
  					120.19651899625859,
  					60.319625962965205
  				],
  				[
  					120.51608605355153,
  					60.379428514234974
  				],
  				[
  					120.65111657113022,
  					60.405098781975965
  				],
  				[
  					120.79356265674275,
  					60.4534033270608
  				],
  				[
  					121.05522627165266,
  					60.541434129470005
  				],
  				[
  					121.19583784391884,
  					60.58867930769284
  				],
  				[
  					123.55114627491787,
  					60.59165070254963
  				],
  				[
  					124.99488244028822,
  					60.75763540307112
  				],
  				[
  					126.32420698456434,
  					61.055705064530656
  				],
  				[
  					128.47611697806258,
  					61.28907583276076
  				],
  				[
  					129.21560672415927,
  					61.49919220645951
  				],
  				[
  					129.74306806856242,
  					61.9093997259924
  				],
  				[
  					129.91990481986522,
  					62.14494090437876
  				],
  				[
  					129.95602664603723,
  					62.41520864526525
  				],
  				[
  					129.8574280132243,
  					62.712038072349785
  				],
  				[
  					129.37962772025367,
  					63.48987173120706
  				],
  				[
  					128.30114057832225,
  					63.599761664475736
  				],
  				[
  					127.95501183483128,
  					63.716472886806926
  				],
  				[
  					126.85265018118105,
  					64.22445221623603
  				],
  				[
  					125.50916629445692,
  					64.6799799668889
  				],
  				[
  					124.7972200867718,
  					65.01840892196837
  				],
  				[
  					124.52566043507801,
  					65.23653514267237
  				],
  				[
  					124.17963504445163,
  					65.8563939480134
  				],
  				[
  					123.69687381398091,
  					66.50265941025556
  				],
  				[
  					123.23354292205198,
  					67.35958384873557
  				],
  				[
  					123.145899692885,
  					67.64946279567683
  				],
  				[
  					123.1834167827289,
  					67.88851797145902
  				],
  				[
  					123.74286583872072,
  					68.41127676052362
  				],
  				[
  					124.07633385630015,
  					68.97548004828629
  				],
  				[
  					124.32381229054596,
  					69.18342601182879
  				],
  				[
  					124.62157189341173,
  					69.33643992784503
  				],
  				[
  					125.07126020721557,
  					69.77558624946137
  				],
  				[
  					125.48477501841518,
  					69.97366201443613
  				],
  				[
  					125.90872846893768,
  					70.22785838487984
  				],
  				[
  					125.94066450409406,
  					70.42787201606554
  				],
  				[
  					127.10173058482786,
  					70.64121816678254
  				],
  				[
  					127.33623823456838,
  					70.74999705675692
  				],
  				[
  					127.46036502493348,
  					70.87029979113241
  				],
  				[
  					127.45550744029805,
  					71.00434845649754
  				],
  				[
  					127.27557010305776,
  					71.3314085964728
  				],
  				[
  					127.10989546113001,
  					71.83029287381855
  				],
  				[
  					126.92882124237929,
  					72.06983897570753
  				],
  				[
  					126.6896627137325,
  					72.29439891223187
  				],
  				[
  					126.01228803925062,
  					72.32971975370334
  				],
  				[
  					124.6116500184117,
  					72.6515864122333
  				],
  				[
  					122.75191857309173,
  					72.9065062527291
  				]
  			]
  		},
  		properties: {
  			scalerank: 1,
  			featurecla: "River",
  			name: "Lena",
  			name_alt: "",
  			min_zoom: 2,
  			name_en: "Lena",
  			min_label: 3,
  			wikidataid: "Q46841",
  			label: "Lena",
  			name_ar: "نهر لينا",
  			name_bn: "লেনা নদী",
  			name_de: "Lena",
  			name_es: "Lena",
  			name_fr: "Léna",
  			name_el: "Λένας ποταμός",
  			name_hi: "लेना नदी",
  			name_hu: "Léna",
  			name_id: "Sungai Lena",
  			name_it: "Lena",
  			name_ja: "レナ川",
  			name_ko: "레나 강",
  			name_nl: "Lena",
  			name_pl: "Lena",
  			name_pt: "Rio Lena",
  			name_ru: "Лена",
  			name_sv: "Lena",
  			name_tr: "Lena Nehri",
  			name_vi: "Sông Lena",
  			name_zh: "勒拿河",
  			wdid_score: 4,
  			ne_id: 1159112191
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					90.7946960794743,
  					34.30041311292622
  				],
  				[
  					91.15157352088198,
  					34.320902818329955
  				],
  				[
  					92.99280480344143,
  					34.10029612887594
  				],
  				[
  					93.83761111854898,
  					34.320902818329955
  				],
  				[
  					94.15583458860235,
  					34.55639232028402
  				],
  				[
  					94.38894697467097,
  					34.65382823337035
  				],
  				[
  					94.68169396360443,
  					34.67452464450324
  				],
  				[
  					95.00405154824116,
  					34.60171255140399
  				],
  				[
  					95.37482994993533,
  					34.406582343069886
  				],
  				[
  					96.00378380735972,
  					33.88408193616675
  				],
  				[
  					96.40985721230928,
  					33.68094188082739
  				],
  				[
  					97.0328166035878,
  					33.236860459927186
  				],
  				[
  					97.45015547077699,
  					32.78089345959984
  				],
  				[
  					98.16179161986835,
  					32.28658254651192
  				],
  				[
  					98.37531863809838,
  					32.00975189872436
  				],
  				[
  					98.54151004434905,
  					31.689797268189224
  				],
  				[
  					98.77415734252708,
  					31.359688218708726
  				],
  				[
  					98.69870975138093,
  					31.150941270465708
  				],
  				[
  					98.90903283080885,
  					30.675853990190376
  				],
  				[
  					98.98437706909041,
  					30.342773545853106
  				],
  				[
  					99.0964115742992,
  					29.25048879649978
  				],
  				[
  					99.23221723836224,
  					28.433381049100674
  				],
  				[
  					99.27536705932596,
  					28.353670152290462
  				],
  				[
  					99.35546552937836,
  					28.204997056586734
  				],
  				[
  					99.39861535034206,
  					28.123012396755684
  				],
  				[
  					99.43455630900107,
  					28.0165718653425
  				],
  				[
  					99.51364708862377,
  					27.785720323186624
  				],
  				[
  					99.59273786824647,
  					27.55550827688036
  				],
  				[
  					99.62867882690549,
  					27.45098623301601
  				],
  				[
  					99.79822920125511,
  					27.165008856712788
  				],
  				[
  					99.98049197794856,
  					27.080621242780154
  				],
  				[
  					100.14037885945962,
  					27.245546576439665
  				],
  				[
  					100.2460054870642,
  					27.495660508732342
  				],
  				[
  					100.3712691589397,
  					27.65851878510017
  				],
  				[
  					100.47007449748176,
  					27.569118557235242
  				],
  				[
  					100.51198408407046,
  					27.36037160899221
  				],
  				[
  					100.44061893107539,
  					26.798648789979552
  				],
  				[
  					100.45317630412234,
  					26.376116441345047
  				],
  				[
  					100.50490441284649,
  					26.240775865172637
  				],
  				[
  					100.61476850789902,
  					26.215144354755864
  				],
  				[
  					101.0021867207912,
  					26.258449205016447
  				],
  				[
  					101.66302493693968,
  					26.529853827413376
  				],
  				[
  					101.82306684774758,
  					26.52954376881962
  				],
  				[
  					101.88611209514369,
  					26.41048126881914
  				],
  				[
  					101.91215701701879,
  					26.2209062769564
  				],
  				[
  					101.9965446309514,
  					26.104272569273647
  				],
  				[
  					102.44297732952091,
  					26.27700104420923
  				],
  				[
  					102.75639489137112,
  					26.312554429626047
  				],
  				[
  					102.89736819866334,
  					26.393221340433655
  				],
  				[
  					102.98092898967931,
  					26.592175604757372
  				],
  				[
  					102.95777794801256,
  					27.223661607364065
  				],
  				[
  					103.02516401572115,
  					27.37352326101049
  				],
  				[
  					103.1470170430654,
  					27.434346421818034
  				],
  				[
  					103.4706148620771,
  					27.88530080821306
  				],
  				[
  					103.54363366090553,
  					28.146137600206288
  				],
  				[
  					103.7897685079117,
  					28.332224432889333
  				],
  				[
  					103.84563073121922,
  					28.483067938749315
  				],
  				[
  					103.85074669801614,
  					28.668043728138073
  				],
  				[
  					104.32560143434614,
  					28.66719106700525
  				],
  				[
  					104.74123497926968,
  					28.777210191354655
  				],
  				[
  					105.11278852744826,
  					28.766926581328576
  				],
  				[
  					105.54712894086146,
  					28.880485541289957
  				],
  				[
  					105.82003217979482,
  					28.876894029245676
  				],
  				[
  					105.90571170453475,
  					29.01202789968893
  				],
  				[
  					106.61429894412092,
  					29.548739325472326
  				],
  				[
  					107.60431603396864,
  					29.923677679966005
  				],
  				[
  					107.88987999881354,
  					30.141261298130942
  				],
  				[
  					108.30814904178396,
  					30.57952912039832
  				],
  				[
  					108.40199344282601,
  					30.735979519161972
  				],
  				[
  					108.57603966678502,
  					30.859744574501008
  				],
  				[
  					108.863567336057,
  					30.937285061154967
  				],
  				[
  					109.4600167175698,
  					31.010019639605773
  				],
  				[
  					110.25578209843238,
  					31.02270620373342
  				],
  				[
  					110.82758182174194,
  					30.921704616818957
  				],
  				[
  					111.21505171106642,
  					30.72897736258642
  				],
  				[
  					111.53358523971352,
  					30.379748033157938
  				],
  				[
  					112.03257286992385,
  					30.351739406855742
  				],
  				[
  					112.20796268112247,
  					30.220326239537513
  				],
  				[
  					112.44040327357132,
  					29.818231919874435
  				],
  				[
  					112.59579430547299,
  					29.741234035759547
  				],
  				[
  					112.78188113815602,
  					29.74394704845487
  				],
  				[
  					112.91582645065657,
  					29.709995632439117
  				],
  				[
  					112.95654747930254,
  					29.550935573844725
  				],
  				[
  					113.12769982305323,
  					29.462775580354787
  				],
  				[
  					113.6575899597741,
  					29.893524481723702
  				],
  				[
  					113.93498904831688,
  					30.06400503185459
  				],
  				[
  					113.9228450867283,
  					30.218440049758854
  				],
  				[
  					114.05053755092152,
  					30.301768296829508
  				],
  				[
  					114.30323530482877,
  					30.593042507442647
  				],
  				[
  					114.54353071498599,
  					30.595445461544216
  				],
  				[
  					114.78765018113279,
  					30.517930813106403
  				],
  				[
  					115.39035241095291,
  					30.013155422479386
  				],
  				[
  					115.6791719910322,
  					29.85613658296053
  				],
  				[
  					115.9761047709813,
  					29.805442002882202
  				],
  				[
  					116.26337405809181,
  					29.83872162527817
  				],
  				[
  					116.69533735561959,
  					30.04953563081287
  				],
  				[
  					116.95433963426646,
  					30.408170070918473
  				],
  				[
  					117.32661665249711,
  					30.694767564409204
  				],
  				[
  					117.59895145067529,
  					30.815432033810723
  				],
  				[
  					117.87733239143162,
  					31.104975083942094
  				],
  				[
  					118.27301883349048,
  					31.382219143187996
  				],
  				[
  					118.55036624560097,
  					31.820848700481406
  				],
  				[
  					118.73800337125277,
  					32.022180080690546
  				],
  				[
  					119.00444705614967,
  					32.15069936780044
  				],
  				[
  					119.33181725471869,
  					32.20490794527461
  				],
  				[
  					119.74584883024116,
  					32.13703095145924
  				],
  				[
  					120.57742597868199,
  					31.61375539807173
  				],
  				[
  					120.92122928271982,
  					31.51619029390467
  				],
  				[
  					121.85822635303609,
  					31.4149044866126
  				]
  			]
  		},
  		properties: {
  			scalerank: 1,
  			featurecla: "River",
  			name: "Chang",
  			name_alt: "",
  			min_zoom: 2,
  			name_en: "Yangtze",
  			min_label: 3,
  			wikidataid: "Q5413",
  			label: "Yangtze",
  			name_ar: "يانغتسي",
  			name_bn: "ইয়াং চি কিয়াং",
  			name_de: "Jangtsekiang",
  			name_es: "Yangtsé",
  			name_fr: "Yangzi Jiang",
  			name_el: "Γιανγκτσέ",
  			name_hi: "यांग्त्सीक्यांग",
  			name_hu: "Jangce",
  			name_id: "Sungai Panjang",
  			name_it: "Fiume Azzurro",
  			name_ja: "長江",
  			name_ko: "창 강",
  			name_nl: "Jangtsekiang",
  			name_pl: "Jangcy",
  			name_pt: "Rio Yangtzé",
  			name_ru: "Янцзы",
  			name_sv: "Yangtze",
  			name_tr: "Yangtze",
  			name_vi: "Trường Giang",
  			name_zh: "长江",
  			wdid_score: 4,
  			ne_id: 1159113707
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					33.206893344868945,
  					0.26153473551141815
  				],
  				[
  					33.18725630059802,
  					0.42819122965271106
  				],
  				[
  					32.8931140479927,
  					1.3114448103854102
  				],
  				[
  					32.80150465264725,
  					1.366544806316611
  				],
  				[
  					32.62475833510098,
  					1.471712805584616
  				],
  				[
  					32.51003665541302,
  					1.5367540551779655
  				],
  				[
  					32.36248752211165,
  					1.6068789737980467
  				],
  				[
  					32.24095747246923,
  					1.6658417830430778
  				],
  				[
  					32.172589552547095,
  					1.6822232120795917
  				],
  				[
  					32.159360385880376,
  					1.7252696801787266
  				],
  				[
  					32.2945976091882,
  					1.930580145674341
  				],
  				[
  					32.295321079240296,
  					2.07914988851347
  				],
  				[
  					32.18824751153153,
  					2.207824204920243
  				],
  				[
  					31.99864668145264,
  					2.2842019718476223
  				],
  				[
  					31.766929559055882,
  					2.292935288904957
  				],
  				[
  					31.662943658176573,
  					2.2670001794484733
  				],
  				[
  					31.469906345350267,
  					2.2188765018766645
  				],
  				[
  					31.366230503064713,
  					2.1930964217170583
  				],
  				[
  					31.42064578626804,
  					2.2968756168672115
  				],
  				[
  					31.47475101087764,
  					2.400577297368926
  				],
  				[
  					31.457168104790327,
  					2.5382110152242916
  				],
  				[
  					31.439559360486868,
  					2.6757284611070133
  				],
  				[
  					31.461418491346336,
  					2.9504145369544545
  				],
  				[
  					31.564047885877983,
  					3.2246613631274386
  				],
  				[
  					31.71974897637341,
  					3.435216986500677
  				],
  				[
  					32.01585493340585,
  					3.613655707204515
  				],
  				[
  					31.729567498508857,
  					4.022597154146254
  				],
  				[
  					31.604665561659402,
  					4.342680975762107
  				],
  				[
  					31.603477003716705,
  					4.686277574070786
  				],
  				[
  					31.745535516087045,
  					5.419281927914852
  				],
  				[
  					31.6728267758524,
  					5.9299742700392954
  				],
  				[
  					31.14831098808986,
  					6.829660956240815
  				],
  				[
  					30.789934930145733,
  					7.241289577661732
  				],
  				[
  					30.592065870900143,
  					7.544190985540553
  				],
  				[
  					30.458430616993354,
  					7.880397854031472
  				],
  				[
  					30.288415154753096,
  					8.573094590687887
  				],
  				[
  					30.264023878711328,
  					8.908939724152773
  				],
  				[
  					30.329911329883487,
  					9.21098847089877
  				],
  				[
  					30.519098748504035,
  					9.3993749048188
  				],
  				[
  					30.792260369598864,
  					9.460818182813838
  				],
  				[
  					31.12474653496477,
  					9.432525336134034
  				],
  				[
  					31.321582065564513,
  					9.404077460157367
  				],
  				[
  					31.53851972832581,
  					9.459629624871127
  				],
  				[
  					31.78393110527992,
  					9.633934230991613
  				],
  				[
  					32.15822350436994,
  					10.040007635941151
  				],
  				[
  					32.23945885593278,
  					10.220410061072087
  				],
  				[
  					32.175121697729395,
  					10.439414781125038
  				],
  				[
  					32.19920291517741,
  					10.569742743365154
  				],
  				[
  					32.58481245293936,
  					11.130328680867393
  				],
  				[
  					32.68811364109084,
  					11.470721340373956
  				],
  				[
  					32.74914350762754,
  					11.995340481001065
  				],
  				[
  					32.778599074033906,
  					12.634267889857782
  				],
  				[
  					32.748058302549396,
  					12.995692857307148
  				],
  				[
  					32.650183139788595,
  					13.344948024951776
  				],
  				[
  					32.317180210099764,
  					14.124564520723126
  				],
  				[
  					32.253618198380764,
  					14.462838446505728
  				],
  				[
  					32.49014122898066,
  					15.634549872291657
  				],
  				[
  					32.55933597181948,
  					15.945512803608011
  				],
  				[
  					32.70273807142942,
  					16.218751939351293
  				],
  				[
  					32.95109500502417,
  					16.438583482320922
  				],
  				[
  					33.3120032081506,
  					16.64239533128007
  				],
  				[
  					33.5804622739069,
  					16.871864528872138
  				],
  				[
  					33.77233686700663,
  					17.168358059146755
  				],
  				[
  					33.881064080548725,
  					17.555569566309757
  				],
  				[
  					33.91269005711135,
  					17.913816433173167
  				],
  				[
  					33.8773433774237,
  					18.197313340726396
  				],
  				[
  					33.59591352716217,
  					18.804898993398098
  				],
  				[
  					33.379699334452965,
  					19.423129991121925
  				],
  				[
  					33.159092644998964,
  					19.448528957593382
  				],
  				[
  					32.91704023614383,
  					19.400418199129646
  				],
  				[
  					32.64465376153336,
  					19.248360297110807
  				],
  				[
  					32.09290449395303,
  					18.793685207590755
  				],
  				[
  					31.494801466606873,
  					18.150106919827763
  				],
  				[
  					31.310006544731152,
  					18.039493516507008
  				],
  				[
  					31.144590284964863,
  					18.035023505113756
  				],
  				[
  					30.977261997203783,
  					18.07765656175455
  				],
  				[
  					30.82187096530211,
  					18.205529893460806
  				],
  				[
  					30.685083449025512,
  					18.40688711188608
  				],
  				[
  					30.494500766733097,
  					19.02449799242241
  				],
  				[
  					30.347739699024174,
  					19.821761989821425
  				],
  				[
  					30.55857954277502,
  					20.08590607348134
  				],
  				[
  					30.585244581837628,
  					20.194581610591158
  				],
  				[
  					30.36489627454506,
  					20.528669745358116
  				],
  				[
  					30.345465936003336,
  					20.65062612556693
  				],
  				[
  					30.61180626803565,
  					21.0546324732248
  				],
  				[
  					31.09064008965214,
  					21.609198106365042
  				],
  				[
  					31.433564894341004,
  					22.09673940682272
  				],
  				[
  					31.77235558444653,
  					22.44478017830849
  				],
  				[
  					32.00448611830163,
  					22.617844550053974
  				],
  				[
  					32.45117719903257,
  					22.729620673101294
  				],
  				[
  					32.58904992038731,
  					22.860878811122646
  				],
  				[
  					32.745112745908756,
  					23.0691348332589
  				],
  				[
  					32.859576043435254,
  					23.350978094978785
  				],
  				[
  					32.896834751117694,
  					23.659796454355018
  				],
  				[
  					32.87947146986764,
  					23.987683417246956
  				],
  				[
  					32.88892825697704,
  					24.563048814384672
  				],
  				[
  					32.84133426283623,
  					24.885923163344287
  				],
  				[
  					32.589773390439376,
  					25.32723989511689
  				],
  				[
  					32.523214145647444,
  					25.612002875261254
  				],
  				[
  					32.72444217299201,
  					25.8766120468118
  				],
  				[
  					32.74919518405983,
  					26.003994452411263
  				],
  				[
  					32.66460086439801,
  					26.084661363218885
  				],
  				[
  					32.12194664890106,
  					26.13850820566701
  				],
  				[
  					31.7852230160872,
  					26.49047638600696
  				],
  				[
  					31.303546990694656,
  					27.09855296478544
  				],
  				[
  					31.085885857881294,
  					27.29941925710395
  				],
  				[
  					30.927445916474397,
  					27.520129299422535
  				],
  				[
  					30.852825148244932,
  					27.76900299734021
  				],
  				[
  					30.83742557142196,
  					28.037668768825654
  				],
  				[
  					30.77158979668212,
  					28.267887274685947
  				],
  				[
  					30.798978305796794,
  					28.455756944283053
  				],
  				[
  					31.168568149548292,
  					29.302526963817698
  				],
  				[
  					31.22727257663186,
  					29.652298895785236
  				],
  				[
  					31.237607863090233,
  					30.12069407807877
  				],
  				[
  					31.175544467907685,
  					31.016892605100594
  				],
  				[
  					31.033537631969608,
  					31.531796576456813
  				]
  			]
  		},
  		properties: {
  			scalerank: 1,
  			featurecla: "River",
  			name: "Nile",
  			name_alt: "",
  			min_zoom: 2,
  			name_en: "Nile",
  			min_label: 3,
  			wikidataid: "Q3392",
  			label: "Nile",
  			name_ar: "نهر النيل",
  			name_bn: "নীলনদ",
  			name_de: "Nil",
  			name_es: "Nilo",
  			name_fr: "Nil",
  			name_el: "Νείλος",
  			name_hi: "नील नदी",
  			name_hu: "Nílus",
  			name_id: "Sungai Nil",
  			name_it: "Nilo",
  			name_ja: "ナイル川",
  			name_ko: "나일 강",
  			name_nl: "Nijl",
  			name_pl: "Nil",
  			name_pt: "Rio Nilo",
  			name_ru: "Нил",
  			name_sv: "Nilen",
  			name_tr: "Nil",
  			name_vi: "Sông Nin",
  			name_zh: "尼罗河",
  			wdid_score: 4,
  			ne_id: 1159121589
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					-71.66874650743861,
  					-15.336376234603065
  				],
  				[
  					-71.50115983751607,
  					-14.792326755434225
  				],
  				[
  					-71.55753882514651,
  					-14.286879571187413
  				],
  				[
  					-71.65921220568077,
  					-14.077951755431364
  				],
  				[
  					-71.85713294135864,
  					-13.901683444883787
  				],
  				[
  					-72.13680579292227,
  					-13.739212741758138
  				],
  				[
  					-72.75074764676586,
  					-13.486825046444629
  				],
  				[
  					-73.2211065334865,
  					-13.42186777105374
  				],
  				[
  					-73.5623001776936,
  					-13.017551364802124
  				],
  				[
  					-73.85866451688749,
  					-12.496136162977123
  				],
  				[
  					-73.98067257352861,
  					-12.198376560111349
  				],
  				[
  					-74.14422848173237,
  					-11.452788995004198
  				],
  				[
  					-74.14515865751363,
  					-11.27765756596704
  				],
  				[
  					-73.8025955878508,
  					-11.188774102425015
  				],
  				[
  					-73.73572628446512,
  					-11.029765720262922
  				],
  				[
  					-73.78828121610596,
  					-10.80207935958493
  				],
  				[
  					-73.99537451851563,
  					-10.394352308802048
  				],
  				[
  					-74.0505907864195,
  					-10.181703789920988
  				],
  				[
  					-74.00661414253912,
  					-9.860328057497831
  				],
  				[
  					-74.16688859729237,
  					-9.681475925335654
  				],
  				[
  					-74.47550025093943,
  					-9.029215996947627
  				],
  				[
  					-74.46818803577014,
  					-8.738846123899592
  				],
  				[
  					-74.33734330920711,
  					-8.511676527544516
  				],
  				[
  					-74.48307084827019,
  					-8.390133558794034
  				],
  				[
  					-74.66032101103131,
  					-8.069016208532332
  				],
  				[
  					-74.90839372424846,
  					-7.836368910354317
  				],
  				[
  					-75.02177181669683,
  					-7.461508070509069
  				],
  				[
  					-75.21568762887208,
  					-7.17806283938814
  				],
  				[
  					-75.20819454618976,
  					-7.085458672721103
  				],
  				[
  					-75.13602840849416,
  					-7.012336521028104
  				],
  				[
  					-75.16078141956197,
  					-6.526629733916785
  				],
  				[
  					-75.10347225615027,
  					-6.238481947457295
  				],
  				[
  					-74.93844356962617,
  					-6.0660376928993145
  				],
  				[
  					-74.74708574084937,
  					-5.970126234565598
  				],
  				[
  					-74.30618242053511,
  					-5.6398621557882365
  				],
  				[
  					-74.06433671740913,
  					-5.137877292504982
  				],
  				[
  					-73.9742646959244,
  					-5.044911390811897
  				],
  				[
  					-73.80657467313728,
  					-4.972357679874108
  				],
  				[
  					-73.48863542346152,
  					-4.444844659038665
  				],
  				[
  					-73.35828162300527,
  					-4.173388360209451
  				],
  				[
  					-73.21578386096044,
  					-4.037220961120369
  				],
  				[
  					-73.13912187365544,
  					-3.683702487811658
  				],
  				[
  					-73.0350455390196,
  					-3.554769789243437
  				],
  				[
  					-72.87210974800334,
  					-3.4947734513525717
  				],
  				[
  					-72.47585486518925,
  					-3.481027520362936
  				],
  				[
  					-72.13262000190662,
  					-3.420101006690814
  				],
  				[
  					-71.86555619982222,
  					-3.4359656714044178
  				],
  				[
  					-71.54273352729489,
  					-3.7312964819524765
  				],
  				[
  					-71.26582536485888,
  					-3.859660739765488
  				],
  				[
  					-70.90047298855534,
  					-3.960068047708603
  				],
  				[
  					-70.62899085150998,
  					-3.888186130390608
  				],
  				[
  					-70.36549272325371,
  					-3.911182142760488
  				],
  				[
  					-70.11338924831782,
  					-4.068330173360074
  				],
  				[
  					-69.86929562038715,
  					-4.320356133647543
  				],
  				[
  					-69.66403683132383,
  					-4.27172861086089
  				],
  				[
  					-69.50324561224767,
  					-4.139178562032235
  				],
  				[
  					-69.26287268744201,
  					-3.622155856952041
  				],
  				[
  					-68.95294328477151,
  					-3.443303724789864
  				],
  				[
  					-68.06875952825756,
  					-3.2969043921069883
  				],
  				[
  					-67.96010982936389,
  					-3.2170126277837525
  				],
  				[
  					-67.9323854234393,
  					-3.1080270320801944
  				],
  				[
  					-67.65821611191477,
  					-2.8654061824698474
  				],
  				[
  					-67.37890499537718,
  					-2.7073279760890046
  				],
  				[
  					-66.8465860663386,
  					-2.659217217625269
  				],
  				[
  					-66.54146257187124,
  					-2.486256198744371
  				],
  				[
  					-65.99787818059302,
  					-2.496539808770457
  				],
  				[
  					-65.76096757675093,
  					-2.602993259291715
  				],
  				[
  					-65.62045935734932,
  					-2.609246107599027
  				],
  				[
  					-65.43910091822099,
  					-2.6846420223128717
  				],
  				[
  					-64.57561357283993,
  					-3.3981901993990604
  				],
  				[
  					-64.01112606469965,
  					-3.7435437964056533
  				],
  				[
  					-63.177275153237986,
  					-4.035153903828693
  				],
  				[
  					-62.736501024004454,
  					-3.8558883602081835
  				],
  				[
  					-62.41055192732345,
  					-3.789432468280836
  				],
  				[
  					-61.81082109236013,
  					-3.8551648901560966
  				],
  				[
  					-61.49355363630417,
  					-3.769588718280758
  				],
  				[
  					-60.59606319847505,
  					-3.350854587419704
  				],
  				[
  					-59.92450212262601,
  					-3.2059538712732945
  				],
  				[
  					-59.82996008974803,
  					-3.1419267716636625
  				],
  				[
  					-59.65792924664838,
  					-3.1232199031740038
  				],
  				[
  					-58.689047817608056,
  					-3.3423279760915463
  				],
  				[
  					-58.535594651917336,
  					-3.226262709163997
  				],
  				[
  					-58.315918138244584,
  					-3.211844984554567
  				],
  				[
  					-57.76649431011738,
  					-2.658493747573182
  				],
  				[
  					-57.47589189312403,
  					-2.4955062801246157
  				],
  				[
  					-56.7022440252824,
  					-2.479279880384965
  				],
  				[
  					-56.11954057475923,
  					-2.1329961075971227
  				],
  				[
  					-55.82214270691949,
  					-2.014502048351858
  				],
  				[
  					-55.51484880229587,
  					-1.949493096528684
  				],
  				[
  					-55.15102088074494,
  					-2.1375953100710987
  				],
  				[
  					-54.80639075379044,
  					-2.175629164237918
  				],
  				[
  					-54.52511593282577,
  					-2.440315850436896
  				],
  				[
  					-54.1859635076942,
  					-2.3111764461395055
  				],
  				[
  					-53.79198238790096,
  					-1.978535251476714
  				],
  				[
  					-53.49644487162374,
  					-1.828105157075072
  				],
  				[
  					-52.436199510291374,
  					-1.4307650691828542
  				],
  				[
  					-51.788177049351276,
  					-1.085101413582521
  				],
  				[
  					-51.000240647980945,
  					-0.4831743302467686
  				],
  				[
  					-50.55481563984114,
  					0.05627594644809619
  				]
  			]
  		},
  		properties: {
  			scalerank: 1,
  			featurecla: "River",
  			name: "Amazonas",
  			name_alt: "Amazon",
  			min_zoom: 2,
  			name_en: "Amazon",
  			min_label: 3,
  			wikidataid: "Q3783",
  			label: "Amazonas",
  			name_ar: "نهر الأمازون",
  			name_bn: "আমাজন নদী",
  			name_de: "Amazonas",
  			name_es: "Amazonas",
  			name_fr: "Amazone",
  			name_el: "Αμαζόνιος",
  			name_hi: "अमेज़न नदी",
  			name_hu: "Amazonas",
  			name_id: "Sungai Amazon",
  			name_it: "Rio delle Amazzoni",
  			name_ja: "アマゾン川",
  			name_ko: "아마존 강",
  			name_nl: "Amazone",
  			name_pl: "Amazonka",
  			name_pt: "Amazonas",
  			name_ru: "Амазонка",
  			name_sv: "Amazonfloden",
  			name_tr: "Amazon Nehri",
  			name_vi: "Sông Amazon",
  			name_zh: "亚马逊河",
  			wdid_score: 5,
  			ne_id: 1159116655
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					-110.74369991742566,
  					44.726727606783044
  				],
  				[
  					-110.92939917686651,
  					44.67892690691306
  				],
  				[
  					-111.09967302126823,
  					44.7565190699993
  				],
  				[
  					-111.20441468996982,
  					44.812471727063325
  				],
  				[
  					-111.30919511599564,
  					44.8684502223435
  				],
  				[
  					-111.4255123055306,
  					44.905566819837134
  				],
  				[
  					-111.54179073774135,
  					44.94265757911464
  				],
  				[
  					-111.63594519737715,
  					45.07750722918027
  				],
  				[
  					-111.65405778689545,
  					45.30971527768381
  				],
  				[
  					-111.44851477745452,
  					46.024581203793446
  				],
  				[
  					-111.45280392133475,
  					46.22265696876819
  				],
  				[
  					-111.48432008547876,
  					46.29164500587784
  				],
  				[
  					-111.51579749229855,
  					46.36143402768802
  				],
  				[
  					-111.5628488839003,
  					46.43974966082635
  				],
  				[
  					-111.65045012596607,
  					46.58417236997407
  				],
  				[
  					-111.69803443077583,
  					46.66213918719443
  				],
  				[
  					-111.78362352175925,
  					46.738116461771554
  				],
  				[
  					-111.8686700102036,
  					46.81368032489034
  				],
  				[
  					-111.92197425011267,
  					46.941295274435134
  				],
  				[
  					-111.85590593142751,
  					47.10818431252173
  				],
  				[
  					-111.64449764692145,
  					47.292255764345384
  				],
  				[
  					-111.17062476280498,
  					47.58802582456792
  				],
  				[
  					-110.51154354535441,
  					47.913819891952045
  				],
  				[
  					-110.22665137412932,
  					47.96425608986891
  				],
  				[
  					-109.81907935264331,
  					47.8069271917563
  				],
  				[
  					-108.93802202028303,
  					47.76413910581863
  				],
  				[
  					-108.8212865746242,
  					47.73876597756332
  				],
  				[
  					-108.56467917563634,
  					47.68294251158002
  				],
  				[
  					-108.30860630474503,
  					47.627106126488655
  				],
  				[
  					-108.1934679838217,
  					47.601694240909126
  				],
  				[
  					-108.10808721345597,
  					47.58687602394943
  				],
  				[
  					-107.94651923300692,
  					47.55944875751052
  				],
  				[
  					-107.85922481975787,
  					47.54469513609119
  				],
  				[
  					-106.88396135132949,
  					47.7509616155842
  				],
  				[
  					-106.75995729249111,
  					47.82080231382666
  				],
  				[
  					-106.52967580597895,
  					47.95054891620349
  				],
  				[
  					-106.40572180868435,
  					48.02053172463475
  				],
  				[
  					-106.23357146383503,
  					48.03178426776631
  				],
  				[
  					-105.8229666817289,
  					48.05846222593699
  				],
  				[
  					-105.33286739787277,
  					48.09024323179649
  				],
  				[
  					-104.9222367775505,
  					48.11685659442681
  				],
  				[
  					-104.75003475626887,
  					48.12801870380186
  				],
  				[
  					-103.77231665730663,
  					48.02730133726499
  				],
  				[
  					-103.24043697794252,
  					48.09241364195276
  				],
  				[
  					-102.89402401407395,
  					48.05866893166616
  				],
  				[
  					-102.14009070515166,
  					47.65021841083119
  				],
  				[
  					-101.7936260648508,
  					47.553273423851635
  				],
  				[
  					-101.69159417906751,
  					47.540974432966166
  				],
  				[
  					-101.50206440408303,
  					47.51815928810932
  				],
  				[
  					-101.39987748900288,
  					47.50598948830458
  				],
  				[
  					-101.35539699990764,
  					47.427002061546446
  				],
  				[
  					-101.31107154010928,
  					47.347859605491436
  				],
  				[
  					-101.00527625202213,
  					47.171126207053234
  				],
  				[
  					-100.94612934548705,
  					47.05254171405146
  				],
  				[
  					-100.83629108865068,
  					46.83227092140734
  				],
  				[
  					-100.7771764798858,
  					46.71353139910869
  				],
  				[
  					-100.6914517382676,
  					46.60477834735045
  				],
  				[
  					-100.60568823932522,
  					46.49618032488908
  				],
  				[
  					-100.57041907428601,
  					46.14054311785641
  				],
  				[
  					-100.35539343951953,
  					45.35033295346523
  				],
  				[
  					-100.3705087959649,
  					45.08492279721416
  				],
  				[
  					-100.45936642129078,
  					44.910204779635336
  				],
  				[
  					-100.63987219928629,
  					44.74770823829354
  				],
  				[
  					-100.62938188353104,
  					44.640117906261864
  				],
  				[
  					-100.55718990761929,
  					44.5337161321729
  				],
  				[
  					-100.47547654905776,
  					44.48413259538884
  				],
  				[
  					-100.39391821979311,
  					44.43496247006313
  				],
  				[
  					-100.27124159930923,
  					44.37287323666443
  				],
  				[
  					-100.04319673338222,
  					44.25697591814183
  				],
  				[
  					-99.92038123248653,
  					44.19451203060903
  				],
  				[
  					-99.62551550982911,
  					44.166451727874545
  				],
  				[
  					-99.55783230263482,
  					44.12086019548504
  				],
  				[
  					-99.43218105751714,
  					44.0362400376071
  				],
  				[
  					-99.36465287961973,
  					43.99075185808218
  				],
  				[
  					-99.37696155983625,
  					43.91478750261312
  				],
  				[
  					-99.39957645851797,
  					43.77352997494329
  				],
  				[
  					-99.41173010943763,
  					43.69746226660965
  				],
  				[
  					-99.37731360553124,
  					43.59467784278111
  				],
  				[
  					-99.2501831225392,
  					43.51065196387452
  				],
  				[
  					-98.97351073382552,
  					43.32353160254566
  				],
  				[
  					-98.70437018511839,
  					43.13080434831312
  				],
  				[
  					-98.5998416817,
  					43.02993195247937
  				],
  				[
  					-98.61203731972088,
  					43.0037513799695
  				],
  				[
  					-98.59407975949946,
  					43.000011298182386
  				],
  				[
  					-98.33611100949842,
  					42.87363658301261
  				],
  				[
  					-97.96817481158028,
  					42.794545803389894
  				],
  				[
  					-97.88182349322057,
  					42.83971100521299
  				],
  				[
  					-97.6440860664618,
  					42.836352037114025
  				],
  				[
  					-97.28738949256714,
  					42.84617055924947
  				],
  				[
  					-97.02828386105568,
  					42.71765127213959
  				],
  				[
  					-96.7541403877473,
  					42.63383209896217
  				],
  				[
  					-96.70879431841118,
  					42.55109813086288
  				],
  				[
  					-96.62303727902282,
  					42.502651475589246
  				],
  				[
  					-96.45539893266798,
  					42.48887970638346
  				],
  				[
  					-96.41036292192561,
  					42.389273383140875
  				],
  				[
  					-96.34659420447744,
  					42.224606431642826
  				],
  				[
  					-96.34891964393057,
  					42.141949978191974
  				],
  				[
  					-96.1672511462085,
  					41.95330516211048
  				],
  				[
  					-96.10456763383846,
  					41.78768219661504
  				],
  				[
  					-96.09689368364312,
  					41.55668854427036
  				],
  				[
  					-96.02485673702824,
  					41.52454580338481
  				],
  				[
  					-95.95863338904621,
  					41.40491486262913
  				],
  				[
  					-95.85595231808225,
  					41.11656037044047
  				],
  				[
  					-95.83424821651967,
  					40.944038601234055
  				],
  				[
  					-95.86186926957967,
  					40.764721381181246
  				],
  				[
  					-95.79636939164973,
  					40.584189764969594
  				],
  				[
  					-95.77642228878506,
  					40.50135244400572
  				],
  				[
  					-95.60813798702657,
  					40.34322256119259
  				],
  				[
  					-95.45235938188273,
  					40.21506500910874
  				],
  				[
  					-95.32293575720772,
  					40.00133128514955
  				],
  				[
  					-95.08517249223281,
  					39.86798025162037
  				],
  				[
  					-94.95499955928959,
  					39.86999563247976
  				],
  				[
  					-94.92655168331291,
  					39.725379136710956
  				],
  				[
  					-95.0670599027145,
  					39.5396798772701
  				],
  				[
  					-94.99130225297463,
  					39.44441437434003
  				],
  				[
  					-94.86800228552622,
  					39.23460805923503
  				],
  				[
  					-94.60478837764757,
  					39.139704291331
  				],
  				[
  					-93.18169694697781,
  					39.317962144521815
  				],
  				[
  					-92.9925353665734,
  					39.27553579361019
  				],
  				[
  					-92.84479244665093,
  					39.03348338475506
  				],
  				[
  					-92.5315815905299,
  					38.87687795669453
  				],
  				[
  					-92.29291398798988,
  					38.658880927071266
  				],
  				[
  					-92.0472442288743,
  					38.614465033516396
  				],
  				[
  					-91.4517508613589,
  					38.67048228612079
  				],
  				[
  					-90.88537716343998,
  					38.635058091784714
  				],
  				[
  					-90.43271745477931,
  					38.79494497329577
  				],
  				[
  					-90.35547087783402,
  					38.80027410537586
  				],
  				[
  					-90.21419720127909,
  					38.80545466771312
  				],
  				[
  					-90.14459550653598,
  					38.794299017892115
  				],
  				[
  					-90.18284898554003,
  					38.680287889148175
  				],
  				[
  					-90.21249833856749,
  					38.58482859959702
  				],
  				[
  					-90.30549007847671,
  					38.43907522231778
  				],
  				[
  					-90.36972388381551,
  					38.26340119074156
  				],
  				[
  					-90.22794959182275,
  					38.113384507798244
  				],
  				[
  					-90.03018388544176,
  					37.9721786565607
  				],
  				[
  					-89.91701249872256,
  					37.96853546808413
  				],
  				[
  					-89.65496131057047,
  					37.74860057224991
  				],
  				[
  					-89.55388220900755,
  					37.71901581476281
  				],
  				[
  					-89.47928727899424,
  					37.47737681736602
  				],
  				[
  					-89.51623592808293,
  					37.32681753188365
  				],
  				[
  					-89.3883109199444,
  					37.08145783136183
  				],
  				[
  					-89.28017798537365,
  					37.107089341778604
  				],
  				[
  					-89.10295366082867,
  					36.952215074199856
  				],
  				[
  					-89.13437293166214,
  					36.851988633769764
  				],
  				[
  					-89.11509762241727,
  					36.69455638279257
  				],
  				[
  					-89.27382178420176,
  					36.61171906182871
  				],
  				[
  					-89.49820085321306,
  					36.50640249281787
  				],
  				[
  					-89.524039069359,
  					36.40943166762216
  				],
  				[
  					-89.58535315627331,
  					36.266882229145025
  				],
  				[
  					-89.66302283400799,
  					36.02327952732114
  				],
  				[
  					-89.68426507745698,
  					36.02327952732114
  				],
  				[
  					-89.68731075718517,
  					36.02327952732114
  				],
  				[
  					-89.67142025425542,
  					35.981718756650395
  				],
  				[
  					-89.67374569370855,
  					35.94015798597967
  				],
  				[
  					-89.77510901564906,
  					35.79941722263274
  				],
  				[
  					-89.95026628290238,
  					35.70198130954641
  				],
  				[
  					-89.98897193068899,
  					35.53646169691555
  				],
  				[
  					-90.14728268101516,
  					35.40525523532648
  				],
  				[
  					-90.13519039585884,
  					35.113877671848755
  				],
  				[
  					-90.24939531122388,
  					35.020653387994216
  				],
  				[
  					-90.26807634149739,
  					34.94148509372306
  				],
  				[
  					-90.44638587112051,
  					34.866993516574325
  				],
  				[
  					-90.45010657424552,
  					34.72204112399562
  				],
  				[
  					-90.58433610712366,
  					34.454253851859136
  				],
  				[
  					-90.69972958043141,
  					34.3975389674188
  				],
  				[
  					-90.87654049351806,
  					34.261733303355754
  				],
  				[
  					-90.9819087389612,
  					34.054872544891396
  				],
  				[
  					-91.20062923863654,
  					33.706159979785824
  				],
  				[
  					-91.22341854527727,
  					33.46906850843071
  				],
  				[
  					-91.10830929234712,
  					33.20665558525258
  				],
  				[
  					-91.1561099922171,
  					33.00992340751742
  				],
  				[
  					-91.08464148635744,
  					32.952872626267194
  				],
  				[
  					-91.17564368362343,
  					32.80854035087599
  				],
  				[
  					-91.03102718785462,
  					32.60260976819288
  				],
  				[
  					-91.07182573114906,
  					32.47889638928612
  				],
  				[
  					-90.94307390009385,
  					32.30668467867346
  				],
  				[
  					-91.08161841506836,
  					32.2046754013293
  				],
  				[
  					-91.12820471877949,
  					32.0154621444926
  				],
  				[
  					-91.32144873733495,
  					31.859606024700312
  				],
  				[
  					-91.41141740595509,
  					31.64995473889219
  				],
  				[
  					-91.50216122105962,
  					31.40862580008914
  				],
  				[
  					-91.62466020380751,
  					31.296953029906405
  				],
  				[
  					-91.5837583076485,
  					31.04735586193665
  				],
  				[
  					-91.52892961298681,
  					30.80835236258673
  				],
  				[
  					-91.34036231155378,
  					30.64686351167464
  				],
  				[
  					-91.12184851760759,
  					30.269987290969993
  				],
  				[
  					-90.99136552607061,
  					30.133768215448626
  				],
  				[
  					-90.78339372431196,
  					30.052894598911834
  				],
  				[
  					-90.0458935208585,
  					29.8957207300961
  				],
  				[
  					-89.9526950752201,
  					29.801333726514997
  				],
  				[
  					-89.88768612339692,
  					29.647699693311253
  				],
  				[
  					-89.40386552606425,
  					29.15721283621295
  				]
  			]
  		},
  		properties: {
  			scalerank: 1,
  			featurecla: "River",
  			name: "Mississippi",
  			name_alt: "",
  			min_zoom: 2,
  			name_en: "Mississippi",
  			min_label: 3,
  			wikidataid: "Q1497",
  			label: "Mississippi",
  			name_ar: "نهر مسيسيبي",
  			name_bn: "মিসিসিপি নদী",
  			name_de: "Mississippi",
  			name_es: "Río Misisipi",
  			name_fr: "Mississippi",
  			name_el: "Ποταμός Μισσισσιππής",
  			name_hi: "मिसिसिप्पी नदी",
  			name_hu: "Mississippi",
  			name_id: "Sungai Mississippi",
  			name_it: "Mississippi",
  			name_ja: "ミシシッピ川",
  			name_ko: "미시시피 강",
  			name_nl: "Mississippi",
  			name_pl: "Missisipi",
  			name_pt: "Rio Mississippi",
  			name_ru: "Миссисипи",
  			name_sv: "Mississippifloden",
  			name_tr: "Mississippi Nehri",
  			name_vi: "Sông Mississippi",
  			name_zh: "密西西比河",
  			wdid_score: 4,
  			ne_id: 1159119147
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "LineString",
  			coordinates: [
  				[
  					116.19758995978427,
  					29.75138845470491
  				],
  				[
  					116.21185265509683,
  					29.78515900320764
  				]
  			]
  		},
  		properties: {
  			scalerank: 1,
  			featurecla: "River",
  			name: "Yangtze",
  			name_alt: "",
  			min_zoom: 2,
  			name_en: "Yangtze",
  			min_label: 3,
  			wikidataid: "Q5413",
  			label: "Yangtze",
  			name_ar: "يانغتسي",
  			name_bn: "ইয়াং চি কিয়াং",
  			name_de: "Jangtsekiang",
  			name_es: "Yangtsé",
  			name_fr: "Yangzi Jiang",
  			name_el: "Γιανγκτσέ",
  			name_hi: "यांग्त्सीक्यांग",
  			name_hu: "Jangce",
  			name_id: "Sungai Panjang",
  			name_it: "Fiume Azzurro",
  			name_ja: "長江",
  			name_ko: "창 강",
  			name_nl: "Jangtsekiang",
  			name_pl: "Jangcy",
  			name_pt: "Rio Yangtzé",
  			name_ru: "Янцзы",
  			name_sv: "Yangtze",
  			name_tr: "Yangtze",
  			name_vi: "Trường Giang",
  			name_zh: "长江",
  			wdid_score: 4,
  			ne_id: 1159113707
  		}
  	}
  ];
  var lakes = {
  	type: type,
  	features: features
  };

  const WIDTH = 1000;
    const HEIGHT = 400;
    
    const svg = select('#map').append('svg')
      .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
    
    const g_country = svg.append('g');
     
    const paths = g_country.selectAll('path')
      .data(collection.features)
      .enter()
      .append('path')
      .attr('fill', 'indianred');
    
    const g_lakes = svg.append('g');

    const lakes_path = g_lakes.selectAll('path')
      .data(lakes.features)
      .enter()
      .append('path')
      .attr('stroke', 'aqua')
      .attr('fill-opacity', 0);

    paths.on('mouseover', e => {
      select(e.target).attr('fill', 'greenyellow');
    });
    
    paths.on('mouseout', e => {
      select(e.target).attr('fill', 'green');
    });
    
    let rotate = [0, 0, 0];
    
    const tick = () => {
      rotate = [rotate[0] + 0.2, -10, -15];
      const projection = geoOrthographic()
        .fitExtent([[0, 0], [WIDTH, HEIGHT]], collection)
        // .fitExtent([[0, 0], [WIDTH, HEIGHT]], lakes)
        .rotate(rotate);
      const pathCreator = geoPath().projection(projection);
      paths.attr('d', pathCreator);
      lakes_path.attr('d', pathCreator);
    };
    
    timer(tick);

}());
