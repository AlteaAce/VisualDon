
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

  var type = "FeatureCollection";
  var features = [
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						33.90371119710453,
  						-0.9500000000000001
  					],
  					[
  						37.69868999999994,
  						-3.0969899999999484
  					],
  					[
  						37.7669,
  						-3.6771200000000004
  					],
  					[
  						39.20222,
  						-4.67677
  					],
  					[
  						38.74053999999995,
  						-5.9089499999999475
  					],
  					[
  						39.44,
  						-6.839999999999861
  					],
  					[
  						39.18652000000009,
  						-8.48550999999992
  					],
  					[
  						39.94960000000003,
  						-10.098400000000026
  					],
  					[
  						40.316586229110854,
  						-10.317097752817492
  					],
  					[
  						39.52099999999996,
  						-10.89688000000001
  					],
  					[
  						36.51408165868426,
  						-11.720938002166735
  					],
  					[
  						34.55998904799935,
  						-11.520020033415925
  					],
  					[
  						34.27999999999997,
  						-10.160000000000025
  					],
  					[
  						33.73972000000009,
  						-9.417149999999992
  					],
  					[
  						32.75937544122132,
  						-9.23059905358906
  					],
  					[
  						30.740009731422095,
  						-8.34000593035372
  					],
  					[
  						30.199996779101696,
  						-7.079980970898163
  					],
  					[
  						29.620032179490014,
  						-6.520015150583426
  					],
  					[
  						29.339997592900346,
  						-4.4999834122940925
  					],
  					[
  						30.752240000000086,
  						-3.3593099999999936
  					],
  					[
  						30.469673645761223,
  						-2.41385475710134
  					],
  					[
  						30.419104852019245,
  						-1.1346591121504161
  					],
  					[
  						33.90371119710453,
  						-0.9500000000000001
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "United Republic of Tanzania",
  			SOV_A3: "TZA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "United Republic of Tanzania",
  			ADM0_A3: "TZA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Tanzania",
  			GU_A3: "TZA",
  			SU_DIF: 0,
  			SUBUNIT: "Tanzania",
  			SU_A3: "TZA",
  			BRK_DIFF: 0,
  			NAME: "Tanzania",
  			NAME_LONG: "Tanzania",
  			BRK_A3: "TZA",
  			BRK_NAME: "Tanzania",
  			BRK_GROUP: "",
  			ABBREV: "Tanz.",
  			POSTAL: "TZ",
  			FORMAL_EN: "United Republic of Tanzania",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Tanzania",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Tanzania",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 2,
  			POP_EST: 53950935,
  			POP_RANK: 16,
  			GDP_MD_EST: 150600,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "TZ",
  			ISO_A2: "TZ",
  			ISO_A3: "TZA",
  			ISO_A3_EH: "TZA",
  			ISO_N3: "834",
  			UN_A3: "834",
  			WB_A2: "TZ",
  			WB_A3: "TZA",
  			WOE_ID: 23424973,
  			WOE_ID_EH: 23424973,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "TZA",
  			ADM0_A3_US: "TZA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321337,
  			WIKIDATAID: "Q924",
  			NAME_AR: "تنزانيا",
  			NAME_BN: "তানজানিয়া",
  			NAME_DE: "Tansania",
  			NAME_EN: "Tanzania",
  			NAME_ES: "Tanzania",
  			NAME_FR: "Tanzanie",
  			NAME_EL: "Τανζανία",
  			NAME_HI: "तंज़ानिया",
  			NAME_HU: "Tanzánia",
  			NAME_ID: "Tanzania",
  			NAME_IT: "Tanzania",
  			NAME_JA: "タンザニア",
  			NAME_KO: "탄자니아",
  			NAME_NL: "Tanzania",
  			NAME_PL: "Tanzania",
  			NAME_PT: "Tanzânia",
  			NAME_RU: "Танзания",
  			NAME_SV: "Tanzania",
  			NAME_TR: "Tanzanya",
  			NAME_VI: "Tanzania",
  			NAME_ZH: "坦桑尼亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-8.665589565454809,
  						27.656425889592356
  					],
  					[
  						-8.684399786809053,
  						27.395744126896005
  					],
  					[
  						-8.6872936670174,
  						25.881056219988906
  					],
  					[
  						-11.96941891117116,
  						25.933352769468268
  					],
  					[
  						-11.937224493853321,
  						23.374594224536168
  					],
  					[
  						-13.118754441774712,
  						22.771220201096256
  					],
  					[
  						-12.929101935263532,
  						21.327070624267563
  					],
  					[
  						-16.845193650773993,
  						21.33332347257488
  					],
  					[
  						-17.06342322434257,
  						20.999752102130827
  					],
  					[
  						-17.02042843267577,
  						21.422310288981578
  					],
  					[
  						-14.750954555713534,
  						21.500600083903663
  					],
  					[
  						-14.221167771857253,
  						22.31016307218816
  					],
  					[
  						-13.891110398809047,
  						23.691009019459305
  					],
  					[
  						-12.50096269372537,
  						24.7701162785782
  					],
  					[
  						-11.392554897497007,
  						26.883423977154393
  					],
  					[
  						-9.735343390328879,
  						26.860944729107405
  					],
  					[
  						-8.665589565454809,
  						27.656425889592356
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 7,
  			SOVEREIGNT: "Western Sahara",
  			SOV_A3: "SAH",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Indeterminate",
  			ADMIN: "Western Sahara",
  			ADM0_A3: "SAH",
  			GEOU_DIF: 0,
  			GEOUNIT: "Western Sahara",
  			GU_A3: "SAH",
  			SU_DIF: 0,
  			SUBUNIT: "Western Sahara",
  			SU_A3: "SAH",
  			BRK_DIFF: 1,
  			NAME: "W. Sahara",
  			NAME_LONG: "Western Sahara",
  			BRK_A3: "B28",
  			BRK_NAME: "W. Sahara",
  			BRK_GROUP: "",
  			ABBREV: "W. Sah.",
  			POSTAL: "WS",
  			FORMAL_EN: "Sahrawi Arab Democratic Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Western Sahara",
  			NOTE_ADM0: "Self admin.",
  			NOTE_BRK: "Self admin.; Claimed by Morocco",
  			NAME_SORT: "Western Sahara",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 7,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 4,
  			POP_EST: 603253,
  			POP_RANK: 11,
  			GDP_MD_EST: 906.5,
  			POP_YEAR: 2017,
  			LASTCENSUS: -99,
  			GDP_YEAR: 2007,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "WI",
  			ISO_A2: "EH",
  			ISO_A3: "ESH",
  			ISO_A3_EH: "ESH",
  			ISO_N3: "732",
  			UN_A3: "732",
  			WB_A2: "-99",
  			WB_A3: "-99",
  			WOE_ID: 23424990,
  			WOE_ID_EH: 23424990,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MAR",
  			ADM0_A3_US: "SAH",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Northern Africa",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 9,
  			LONG_LEN: 14,
  			ABBREV_LEN: 7,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 4.7,
  			MIN_LABEL: 6,
  			MAX_LABEL: 11,
  			NE_ID: 1159321223,
  			WIKIDATAID: "Q6250",
  			NAME_AR: "الصحراء الغربية",
  			NAME_BN: "পশ্চিম সাহারা",
  			NAME_DE: "Westsahara",
  			NAME_EN: "Western Sahara",
  			NAME_ES: "Sahara Occidental",
  			NAME_FR: "Sahara occidental",
  			NAME_EL: "Δυτική Σαχάρα",
  			NAME_HI: "पश्चिमी सहारा",
  			NAME_HU: "Nyugat-Szahara",
  			NAME_ID: "Sahara Barat",
  			NAME_IT: "Sahara Occidentale",
  			NAME_JA: "西サハラ",
  			NAME_KO: "서사하라",
  			NAME_NL: "Westelijke Sahara",
  			NAME_PL: "Sahara Zachodnia",
  			NAME_PT: "Saara Ocidental",
  			NAME_RU: "Западная Сахара",
  			NAME_SV: "Västsahara",
  			NAME_TR: "Batı Sahra",
  			NAME_VI: "Tây Sahara",
  			NAME_ZH: "西撒哈拉"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						87.35997033076265,
  						49.21498078062912
  					],
  					[
  						85.7682328633083,
  						48.45575063739699
  					],
  					[
  						85.16429039911324,
  						47.0009557155161
  					],
  					[
  						83.18048383986047,
  						47.33003123635086
  					],
  					[
  						82.45892581576906,
  						45.539649563166506
  					],
  					[
  						79.96610639844141,
  						44.91751699480463
  					],
  					[
  						80.86620649610126,
  						43.18036204688101
  					],
  					[
  						80.2599902688853,
  						42.34999929459906
  					],
  					[
  						79.14217736197978,
  						42.85609243424952
  					],
  					[
  						76.00035363149846,
  						42.98802236589067
  					],
  					[
  						74.21286583852256,
  						43.29833934180337
  					],
  					[
  						73.48975752146237,
  						42.50089447689132
  					],
  					[
  						71.8446382994506,
  						42.8453954127651
  					],
  					[
  						70.96231489449914,
  						42.266154283205495
  					],
  					[
  						69.07002729683524,
  						41.38424428971234
  					],
  					[
  						66.71404707221652,
  						41.1684435084615
  					],
  					[
  						66.02339155463562,
  						41.99464630794404
  					],
  					[
  						66.09801232286509,
  						42.997660020513095
  					],
  					[
  						64.90082441595928,
  						43.72808055274258
  					],
  					[
  						62.01330040878625,
  						43.50447663021565
  					],
  					[
  						61.05831994003245,
  						44.40581696225051
  					],
  					[
  						58.50312706892845,
  						45.586804307632974
  					],
  					[
  						55.928917270741096,
  						44.99585846615911
  					],
  					[
  						55.96819135928291,
  						41.30864166926936
  					],
  					[
  						55.45525109235377,
  						41.25985911718584
  					],
  					[
  						54.07941775901495,
  						42.32410940202083
  					],
  					[
  						52.50245975119615,
  						41.78331553808637
  					],
  					[
  						52.50142622255032,
  						42.7922978785852
  					],
  					[
  						51.342427199108215,
  						43.132974758469345
  					],
  					[
  						50.89129194520024,
  						44.03103363705378
  					],
  					[
  						51.31689904155604,
  						45.2459982366679
  					],
  					[
  						53.0408764992452,
  						45.25904653582177
  					],
  					[
  						53.042736850807785,
  						46.85300608986449
  					],
  					[
  						51.191945428274266,
  						47.048704738953916
  					],
  					[
  						49.10116000000011,
  						46.399330000000134
  					],
  					[
  						48.05725000000001,
  						47.74377000000004
  					],
  					[
  						46.46644575377627,
  						48.39415233010493
  					],
  					[
  						47.54948042174931,
  						50.454698391311126
  					],
  					[
  						48.70238162618102,
  						50.60512848571284
  					],
  					[
  						50.76664839051216,
  						51.6927623561599
  					],
  					[
  						52.32872358583097,
  						51.718652248738124
  					],
  					[
  						55.71694000000002,
  						50.62171000000018
  					],
  					[
  						56.77798000000013,
  						51.043550000000096
  					],
  					[
  						61.337424350840934,
  						50.79907013610426
  					],
  					[
  						61.58800337102417,
  						51.272658799843214
  					],
  					[
  						59.967533807215545,
  						51.9604204372157
  					],
  					[
  						61.699986199800605,
  						52.97999644633427
  					],
  					[
  						61.43660000000017,
  						54.00625000000002
  					],
  					[
  						65.17853356309593,
  						54.35422781027211
  					],
  					[
  						68.16910037625883,
  						54.97039175070432
  					],
  					[
  						69.06816694527288,
  						55.38525014914353
  					],
  					[
  						70.86526655465514,
  						55.169733588270105
  					],
  					[
  						72.22415001820218,
  						54.376655381886735
  					],
  					[
  						74.38482000000016,
  						53.54685000000012
  					],
  					[
  						76.52517947785475,
  						54.17700348572714
  					],
  					[
  						77.80091556184425,
  						53.404414984747575
  					],
  					[
  						80.03555952344169,
  						50.86475088154725
  					],
  					[
  						83.38300377801238,
  						51.069182847693924
  					],
  					[
  						85.54126997268247,
  						49.69285858824816
  					],
  					[
  						86.82935672398963,
  						49.82667470966817
  					],
  					[
  						87.35997033076265,
  						49.21498078062912
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Kazakhstan",
  			SOV_A3: "KAZ",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Kazakhstan",
  			ADM0_A3: "KAZ",
  			GEOU_DIF: 0,
  			GEOUNIT: "Kazakhstan",
  			GU_A3: "KAZ",
  			SU_DIF: 0,
  			SUBUNIT: "Kazakhstan",
  			SU_A3: "KAZ",
  			BRK_DIFF: 0,
  			NAME: "Kazakhstan",
  			NAME_LONG: "Kazakhstan",
  			BRK_A3: "KAZ",
  			BRK_NAME: "Kazakhstan",
  			BRK_GROUP: "",
  			ABBREV: "Kaz.",
  			POSTAL: "KZ",
  			FORMAL_EN: "Republic of Kazakhstan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Kazakhstan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Kazakhstan",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 1,
  			POP_EST: 18556698,
  			POP_RANK: 14,
  			GDP_MD_EST: 460700,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "KZ",
  			ISO_A2: "KZ",
  			ISO_A3: "KAZ",
  			ISO_A3_EH: "KAZ",
  			ISO_N3: "398",
  			UN_A3: "398",
  			WB_A2: "KZ",
  			WB_A3: "KAZ",
  			WOE_ID: -90,
  			WOE_ID_EH: 23424871,
  			WOE_NOTE: "Includes Baykonur Cosmodrome as an admin-1",
  			ADM0_A3_IS: "KAZ",
  			ADM0_A3_US: "KAZ",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Central Asia",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159320967,
  			WIKIDATAID: "Q232",
  			NAME_AR: "كازاخستان",
  			NAME_BN: "কাজাখস্তান",
  			NAME_DE: "Kasachstan",
  			NAME_EN: "Kazakhstan",
  			NAME_ES: "Kazajistán",
  			NAME_FR: "Kazakhstan",
  			NAME_EL: "Καζακστάν",
  			NAME_HI: "कज़ाख़िस्तान",
  			NAME_HU: "Kazahsztán",
  			NAME_ID: "Kazakhstan",
  			NAME_IT: "Kazakistan",
  			NAME_JA: "カザフスタン",
  			NAME_KO: "카자흐스탄",
  			NAME_NL: "Kazachstan",
  			NAME_PL: "Kazachstan",
  			NAME_PT: "Cazaquistão",
  			NAME_RU: "Казахстан",
  			NAME_SV: "Kazakstan",
  			NAME_TR: "Kazakistan",
  			NAME_VI: "Kazakhstan",
  			NAME_ZH: "哈萨克斯坦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						55.96819135928291,
  						41.30864166926936
  					],
  					[
  						55.928917270741096,
  						44.99585846615911
  					],
  					[
  						58.50312706892845,
  						45.586804307632974
  					],
  					[
  						61.05831994003245,
  						44.40581696225051
  					],
  					[
  						62.01330040878625,
  						43.50447663021565
  					],
  					[
  						64.90082441595928,
  						43.72808055274258
  					],
  					[
  						66.09801232286509,
  						42.997660020513095
  					],
  					[
  						66.02339155463562,
  						41.99464630794404
  					],
  					[
  						66.71404707221652,
  						41.1684435084615
  					],
  					[
  						69.07002729683524,
  						41.38424428971234
  					],
  					[
  						70.96231489449914,
  						42.266154283205495
  					],
  					[
  						71.87011478057047,
  						41.392900092121266
  					],
  					[
  						73.05541710804917,
  						40.866033026689465
  					],
  					[
  						71.77487511585656,
  						40.14584442805378
  					],
  					[
  						71.01419803252017,
  						40.24436554621823
  					],
  					[
  						70.66662234892505,
  						40.960213324541414
  					],
  					[
  						69.32949466337283,
  						40.72782440852485
  					],
  					[
  						68.17602501818592,
  						38.901553453113905
  					],
  					[
  						68.39203250516596,
  						38.15702525486874
  					],
  					[
  						67.82999962755952,
  						37.144994004864685
  					],
  					[
  						66.51860680528867,
  						37.36278432875879
  					],
  					[
  						66.54615034370022,
  						37.97468496352687
  					],
  					[
  						64.17022301621677,
  						38.892406724598246
  					],
  					[
  						62.374260288345006,
  						40.05388621679039
  					],
  					[
  						61.88271406438469,
  						41.084856879229406
  					],
  					[
  						60.083340691981675,
  						41.425146185871405
  					],
  					[
  						59.976422153569786,
  						42.22308197689021
  					],
  					[
  						58.62901085799146,
  						42.75155101172305
  					],
  					[
  						55.96819135928291,
  						41.30864166926936
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Uzbekistan",
  			SOV_A3: "UZB",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Uzbekistan",
  			ADM0_A3: "UZB",
  			GEOU_DIF: 0,
  			GEOUNIT: "Uzbekistan",
  			GU_A3: "UZB",
  			SU_DIF: 0,
  			SUBUNIT: "Uzbekistan",
  			SU_A3: "UZB",
  			BRK_DIFF: 0,
  			NAME: "Uzbekistan",
  			NAME_LONG: "Uzbekistan",
  			BRK_A3: "UZB",
  			BRK_NAME: "Uzbekistan",
  			BRK_GROUP: "",
  			ABBREV: "Uzb.",
  			POSTAL: "UZ",
  			FORMAL_EN: "Republic of Uzbekistan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Uzbekistan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Uzbekistan",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 4,
  			POP_EST: 29748859,
  			POP_RANK: 15,
  			GDP_MD_EST: 202300,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1989,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "UZ",
  			ISO_A2: "UZ",
  			ISO_A3: "UZB",
  			ISO_A3_EH: "UZB",
  			ISO_N3: "860",
  			UN_A3: "860",
  			WB_A2: "UZ",
  			WB_A3: "UZB",
  			WOE_ID: 23424980,
  			WOE_ID_EH: 23424980,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "UZB",
  			ADM0_A3_US: "UZB",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Central Asia",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: 5,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321405,
  			WIKIDATAID: "Q265",
  			NAME_AR: "أوزبكستان",
  			NAME_BN: "উজবেকিস্তান",
  			NAME_DE: "Usbekistan",
  			NAME_EN: "Uzbekistan",
  			NAME_ES: "Uzbekistán",
  			NAME_FR: "Ouzbékistan",
  			NAME_EL: "Ουζμπεκιστάν",
  			NAME_HI: "उज़्बेकिस्तान",
  			NAME_HU: "Üzbegisztán",
  			NAME_ID: "Uzbekistan",
  			NAME_IT: "Uzbekistan",
  			NAME_JA: "ウズベキスタン",
  			NAME_KO: "우즈베키스탄",
  			NAME_NL: "Oezbekistan",
  			NAME_PL: "Uzbekistan",
  			NAME_PT: "Usbequistão",
  			NAME_RU: "Узбекистан",
  			NAME_SV: "Uzbekistan",
  			NAME_TR: "Özbekistan",
  			NAME_VI: "Uzbekistan",
  			NAME_ZH: "乌兹别克斯坦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						29.339997592900346,
  						-4.4999834122940925
  					],
  					[
  						29.620032179490014,
  						-6.520015150583426
  					],
  					[
  						30.199996779101696,
  						-7.079980970898163
  					],
  					[
  						30.740009731422095,
  						-8.34000593035372
  					],
  					[
  						28.734866570762502,
  						-8.526559340044578
  					],
  					[
  						28.372253045370428,
  						-11.793646742401393
  					],
  					[
  						29.34154788586909,
  						-12.360743910372413
  					],
  					[
  						28.934285922976837,
  						-13.248958428605135
  					],
  					[
  						28.155108676879987,
  						-12.272480564017897
  					],
  					[
  						25.752309604604733,
  						-11.784965101776358
  					],
  					[
  						25.418118116973204,
  						-11.330935967659961
  					],
  					[
  						23.912215203555718,
  						-10.926826267137514
  					],
  					[
  						22.155268182064308,
  						-11.084801120653772
  					],
  					[
  						21.875181919042348,
  						-9.523707777548566
  					],
  					[
  						21.7281107927397,
  						-7.290872491081302
  					],
  					[
  						19.41750247567316,
  						-7.155428562044299
  					],
  					[
  						19.01675174324967,
  						-7.988245944860132
  					],
  					[
  						17.472970004962235,
  						-8.0685511206417
  					],
  					[
  						16.326528354567046,
  						-5.877470391466268
  					],
  					[
  						13.375597364971895,
  						-5.8642412247995495
  					],
  					[
  						12.32243167486351,
  						-6.10009246177966
  					],
  					[
  						12.182336866920252,
  						-5.789930515163839
  					],
  					[
  						12.995517205465177,
  						-4.781103203961884
  					],
  					[
  						14.144956088933299,
  						-4.510008640158716
  					],
  					[
  						14.582603794013181,
  						-4.97023894615014
  					],
  					[
  						16.0062895036543,
  						-3.535132744972529
  					],
  					[
  						16.407091912510054,
  						-1.7409270157986825
  					],
  					[
  						17.523716261472856,
  						-0.743830254726987
  					],
  					[
  						17.898835483479587,
  						1.7418319767282782
  					],
  					[
  						18.45306521980993,
  						3.5043858911233485
  					],
  					[
  						18.54298221199778,
  						4.201785183118318
  					],
  					[
  						19.46778364429315,
  						5.03152781821278
  					],
  					[
  						20.927591180106276,
  						4.322785549329737
  					],
  					[
  						22.405123732195538,
  						4.029160061047321
  					],
  					[
  						24.410531040146253,
  						5.10878408448913
  					],
  					[
  						27.37422610851749,
  						5.233944403500061
  					],
  					[
  						28.428993768026913,
  						4.287154649264494
  					],
  					[
  						29.71599531425602,
  						4.600804755060153
  					],
  					[
  						30.833852421715427,
  						3.5091716042224625
  					],
  					[
  						30.77334679538004,
  						2.339883327642127
  					],
  					[
  						29.875778842902434,
  						0.5973798689763612
  					],
  					[
  						29.579466180140884,
  						-1.3413131648856265
  					],
  					[
  						29.024926385216787,
  						-2.8392579077301576
  					],
  					[
  						29.339997592900346,
  						-4.4999834122940925
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Democratic Republic of the Congo",
  			SOV_A3: "COD",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Democratic Republic of the Congo",
  			ADM0_A3: "COD",
  			GEOU_DIF: 0,
  			GEOUNIT: "Democratic Republic of the Congo",
  			GU_A3: "COD",
  			SU_DIF: 0,
  			SUBUNIT: "Democratic Republic of the Congo",
  			SU_A3: "COD",
  			BRK_DIFF: 0,
  			NAME: "Dem. Rep. Congo",
  			NAME_LONG: "Democratic Republic of the Congo",
  			BRK_A3: "COD",
  			BRK_NAME: "Democratic Republic of the Congo",
  			BRK_GROUP: "",
  			ABBREV: "D.R.C.",
  			POSTAL: "DRC",
  			FORMAL_EN: "Democratic Republic of the Congo",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Congo, Democratic Republic of the",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Congo, Dem. Rep.",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 7,
  			POP_EST: 83301151,
  			POP_RANK: 16,
  			GDP_MD_EST: 66010,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1984,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CG",
  			ISO_A2: "CD",
  			ISO_A3: "COD",
  			ISO_A3_EH: "COD",
  			ISO_N3: "180",
  			UN_A3: "180",
  			WB_A2: "ZR",
  			WB_A3: "ZAR",
  			WOE_ID: 23424780,
  			WOE_ID_EH: 23424780,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "COD",
  			ADM0_A3_US: "COD",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Middle Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 15,
  			LONG_LEN: 32,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2,
  			MAX_LABEL: 7,
  			NE_ID: 1159320513,
  			WIKIDATAID: "Q974",
  			NAME_AR: "جمهورية الكونغو الديمقراطية",
  			NAME_BN: "গণতান্ত্রিক কঙ্গো প্রজাতন্ত্র",
  			NAME_DE: "Demokratische Republik Kongo",
  			NAME_EN: "Democratic Republic of the Congo",
  			NAME_ES: "República Democrática del Congo",
  			NAME_FR: "République démocratique du Congo",
  			NAME_EL: "Λαϊκή Δημοκρατία του Κονγκό",
  			NAME_HI: "कांगो लोकतान्त्रिक गणराज्य",
  			NAME_HU: "Kongói Demokratikus Köztársaság",
  			NAME_ID: "Republik Demokratik Kongo",
  			NAME_IT: "Repubblica Democratica del Congo",
  			NAME_JA: "コンゴ民主共和国",
  			NAME_KO: "콩고 민주 공화국",
  			NAME_NL: "Congo-Kinshasa",
  			NAME_PL: "Demokratyczna Republika Konga",
  			NAME_PT: "República Democrática do Congo",
  			NAME_RU: "Демократическая Республика Конго",
  			NAME_SV: "Kongo-Kinshasa",
  			NAME_TR: "Demokratik Kongo Cumhuriyeti",
  			NAME_VI: "Cộng hòa Dân chủ Congo",
  			NAME_ZH: "刚果民主共和国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						41.58513,
  						-1.6832500000000001
  					],
  					[
  						40.993,
  						-0.85829
  					],
  					[
  						40.98105,
  						2.7845199999999997
  					],
  					[
  						41.85508309264397,
  						3.918911920483727
  					],
  					[
  						43.66086999999999,
  						4.957550000000083
  					],
  					[
  						44.96360000000001,
  						5.00162
  					],
  					[
  						47.78942,
  						8.003
  					],
  					[
  						48.93812951029645,
  						9.451748968946617
  					],
  					[
  						48.94820475850985,
  						11.41061728169797
  					],
  					[
  						51.1112,
  						12.024640000000002
  					],
  					[
  						51.04531,
  						10.6409
  					],
  					[
  						50.55239,
  						9.19874
  					],
  					[
  						49.45270000000001,
  						6.80466
  					],
  					[
  						48.594550000000005,
  						5.339110000000001
  					],
  					[
  						46.56476,
  						2.85529
  					],
  					[
  						43.13597,
  						0.2922
  					],
  					[
  						41.58513,
  						-1.6832500000000001
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Somalia",
  			SOV_A3: "SOM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Somalia",
  			ADM0_A3: "SOM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Somalia",
  			GU_A3: "SOM",
  			SU_DIF: 0,
  			SUBUNIT: "Somalia",
  			SU_A3: "SOM",
  			BRK_DIFF: 0,
  			NAME: "Somalia",
  			NAME_LONG: "Somalia",
  			BRK_A3: "SOM",
  			BRK_NAME: "Somalia",
  			BRK_GROUP: "",
  			ABBREV: "Som.",
  			POSTAL: "SO",
  			FORMAL_EN: "Federal Republic of Somalia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Somalia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Somalia",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 8,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 7,
  			POP_EST: 7531386,
  			POP_RANK: 13,
  			GDP_MD_EST: 4719,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1987,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SO",
  			ISO_A2: "SO",
  			ISO_A3: "SOM",
  			ISO_A3_EH: "SOM",
  			ISO_N3: "706",
  			UN_A3: "706",
  			WB_A2: "SO",
  			WB_A3: "SOM",
  			WOE_ID: -90,
  			WOE_ID_EH: 23424949,
  			WOE_NOTE: "Includes Somaliland (2347021, 2347020, 2347017 and portion of 2347016)",
  			ADM0_A3_IS: "SOM",
  			ADM0_A3_US: "SOM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321261,
  			WIKIDATAID: "Q1045",
  			NAME_AR: "الصومال",
  			NAME_BN: "সোমালিয়া",
  			NAME_DE: "Somalia",
  			NAME_EN: "Somalia",
  			NAME_ES: "Somalia",
  			NAME_FR: "Somalie",
  			NAME_EL: "Σομαλία",
  			NAME_HI: "सोमालिया",
  			NAME_HU: "Szomália",
  			NAME_ID: "Somalia",
  			NAME_IT: "Somalia",
  			NAME_JA: "ソマリア",
  			NAME_KO: "소말리아",
  			NAME_NL: "Somalië",
  			NAME_PL: "Somalia",
  			NAME_PT: "Somália",
  			NAME_RU: "Сомали",
  			NAME_SV: "Somalia",
  			NAME_TR: "Somali",
  			NAME_VI: "Somalia",
  			NAME_ZH: "索马里"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						39.20222,
  						-4.67677
  					],
  					[
  						37.7669,
  						-3.6771200000000004
  					],
  					[
  						37.69868999999994,
  						-3.0969899999999484
  					],
  					[
  						33.90371119710453,
  						-0.9500000000000001
  					],
  					[
  						33.893568969666944,
  						0.1098135378618963
  					],
  					[
  						35.03599,
  						1.90584
  					],
  					[
  						34.47913,
  						3.5556000000000836
  					],
  					[
  						34.005,
  						4.249884947362048
  					],
  					[
  						35.29800711823298,
  						5.506
  					],
  					[
  						36.159078632855646,
  						4.447864127672769
  					],
  					[
  						36.85509323800812,
  						4.447864127672769
  					],
  					[
  						38.120915,
  						3.598605
  					],
  					[
  						39.55938425876585,
  						3.42206
  					],
  					[
  						40.76848,
  						4.257020000000001
  					],
  					[
  						41.85508309264397,
  						3.918911920483727
  					],
  					[
  						40.98105,
  						2.7845199999999997
  					],
  					[
  						40.993,
  						-0.85829
  					],
  					[
  						41.58513,
  						-1.6832500000000001
  					],
  					[
  						40.26304000000001,
  						-2.57309
  					],
  					[
  						39.604890000000005,
  						-4.3465300000000004
  					],
  					[
  						39.20222,
  						-4.67677
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Kenya",
  			SOV_A3: "KEN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Kenya",
  			ADM0_A3: "KEN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Kenya",
  			GU_A3: "KEN",
  			SU_DIF: 0,
  			SUBUNIT: "Kenya",
  			SU_A3: "KEN",
  			BRK_DIFF: 0,
  			NAME: "Kenya",
  			NAME_LONG: "Kenya",
  			BRK_A3: "KEN",
  			BRK_NAME: "Kenya",
  			BRK_GROUP: "",
  			ABBREV: "Ken.",
  			POSTAL: "KE",
  			FORMAL_EN: "Republic of Kenya",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Kenya",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Kenya",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 3,
  			POP_EST: 47615739,
  			POP_RANK: 15,
  			GDP_MD_EST: 152700,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "KE",
  			ISO_A2: "KE",
  			ISO_A3: "KEN",
  			ISO_A3_EH: "KEN",
  			ISO_N3: "404",
  			UN_A3: "404",
  			WB_A2: "KE",
  			WB_A3: "KEN",
  			WOE_ID: 23424863,
  			WOE_ID_EH: 23424863,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "KEN",
  			ADM0_A3_US: "KEN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 1.7,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159320971,
  			WIKIDATAID: "Q114",
  			NAME_AR: "كينيا",
  			NAME_BN: "কেনিয়া",
  			NAME_DE: "Kenia",
  			NAME_EN: "Kenya",
  			NAME_ES: "Kenia",
  			NAME_FR: "Kenya",
  			NAME_EL: "Κένυα",
  			NAME_HI: "कीनिया",
  			NAME_HU: "Kenya",
  			NAME_ID: "Kenya",
  			NAME_IT: "Kenya",
  			NAME_JA: "ケニア",
  			NAME_KO: "케냐",
  			NAME_NL: "Kenia",
  			NAME_PL: "Kenia",
  			NAME_PT: "Quénia",
  			NAME_RU: "Кения",
  			NAME_SV: "Kenya",
  			NAME_TR: "Kenya",
  			NAME_VI: "Kenya",
  			NAME_ZH: "肯尼亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						24.567369012152085,
  						8.229187933785468
  					],
  					[
  						23.459012892355986,
  						8.954285793488893
  					],
  					[
  						23.554304233502194,
  						10.089255275915308
  					],
  					[
  						22.864165480244225,
  						11.142395127807546
  					],
  					[
  						22.037589999999966,
  						12.95545999999996
  					],
  					[
  						22.30350999999996,
  						14.326820000000055
  					],
  					[
  						23.024590000000103,
  						15.680720000000065
  					],
  					[
  						23.886890000000108,
  						15.610839999999996
  					],
  					[
  						23.83766000000014,
  						19.580470000000105
  					],
  					[
  						25.000000000000114,
  						20.003040000000055
  					],
  					[
  						25,
  						22
  					],
  					[
  						29.019999999999982,
  						22
  					],
  					[
  						32.89999999999998,
  						22
  					],
  					[
  						36.86622999999997,
  						22
  					],
  					[
  						37.1887200000001,
  						21.018850000000043
  					],
  					[
  						37.11470000000014,
  						19.807960000000094
  					],
  					[
  						37.4817900000001,
  						18.61409000000009
  					],
  					[
  						38.410089959473225,
  						17.998307399970315
  					],
  					[
  						36.852530000000115,
  						16.956549999999993
  					],
  					[
  						36.32321999999999,
  						14.822490000000016
  					],
  					[
  						36.42951000000005,
  						14.422110000000032
  					],
  					[
  						35.86363,
  						12.578280000000063
  					],
  					[
  						34.25745000000006,
  						10.630089999999996
  					],
  					[
  						33.97498000000007,
  						8.68455999999992
  					],
  					[
  						33.72195924818311,
  						10.325262079630193
  					],
  					[
  						33.206938084561784,
  						10.720111638406593
  					],
  					[
  						33.206938084561784,
  						12.179338268667095
  					],
  					[
  						32.31423473428475,
  						11.68148447716652
  					],
  					[
  						32.400071594888345,
  						11.080626452941488
  					],
  					[
  						31.35286189552488,
  						9.810240916008695
  					],
  					[
  						29.996639497988554,
  						10.290927335388687
  					],
  					[
  						28.966597170745786,
  						9.398223985111656
  					],
  					[
  						26.477328213242515,
  						9.552730334198088
  					],
  					[
  						25.790633328413946,
  						10.411098940233728
  					],
  					[
  						25.069603699343986,
  						10.273759963267992
  					],
  					[
  						24.53741516360202,
  						8.91753756573172
  					],
  					[
  						24.567369012152085,
  						8.229187933785468
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Sudan",
  			SOV_A3: "SDN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Sudan",
  			ADM0_A3: "SDN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Sudan",
  			GU_A3: "SDN",
  			SU_DIF: 0,
  			SUBUNIT: "Sudan",
  			SU_A3: "SDN",
  			BRK_DIFF: 0,
  			NAME: "Sudan",
  			NAME_LONG: "Sudan",
  			BRK_A3: "SDN",
  			BRK_NAME: "Sudan",
  			BRK_GROUP: "",
  			ABBREV: "Sudan",
  			POSTAL: "SD",
  			FORMAL_EN: "Republic of the Sudan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Sudan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Sudan",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 1,
  			POP_EST: 37345935,
  			POP_RANK: 15,
  			GDP_MD_EST: 176300,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2008,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SU",
  			ISO_A2: "SD",
  			ISO_A3: "SDN",
  			ISO_A3_EH: "SDN",
  			ISO_N3: "729",
  			UN_A3: "729",
  			WB_A2: "SD",
  			WB_A3: "SDN",
  			WOE_ID: -90,
  			WOE_ID_EH: 23424952,
  			WOE_NOTE: "Almost all FLickr photos are in the north.",
  			ADM0_A3_IS: "SDN",
  			ADM0_A3_US: "SDN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Northern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321229,
  			WIKIDATAID: "Q1049",
  			NAME_AR: "السودان",
  			NAME_BN: "সুদান",
  			NAME_DE: "Sudan",
  			NAME_EN: "Sudan",
  			NAME_ES: "Sudán",
  			NAME_FR: "Soudan",
  			NAME_EL: "Σουδάν",
  			NAME_HI: "सूडान",
  			NAME_HU: "Szudán",
  			NAME_ID: "Sudan",
  			NAME_IT: "Sudan",
  			NAME_JA: "スーダン",
  			NAME_KO: "수단",
  			NAME_NL: "Soedan",
  			NAME_PL: "Sudan",
  			NAME_PT: "Sudão",
  			NAME_RU: "Судан",
  			NAME_SV: "Sudan",
  			NAME_TR: "Sudan",
  			NAME_VI: "Sudan",
  			NAME_ZH: "苏丹共和国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						23.83766000000014,
  						19.580470000000105
  					],
  					[
  						23.886890000000108,
  						15.610839999999996
  					],
  					[
  						23.024590000000103,
  						15.680720000000065
  					],
  					[
  						22.30350999999996,
  						14.326820000000055
  					],
  					[
  						22.037589999999966,
  						12.95545999999996
  					],
  					[
  						22.864165480244225,
  						11.142395127807546
  					],
  					[
  						21.723821648859456,
  						10.567055568885976
  					],
  					[
  						21.000868361096167,
  						9.475985215691509
  					],
  					[
  						20.05968549976427,
  						9.012706000194854
  					],
  					[
  						19.09400800952602,
  						9.07484691002584
  					],
  					[
  						17.964929640380888,
  						7.890914008002994
  					],
  					[
  						16.705988396886255,
  						7.5083275415299795
  					],
  					[
  						15.279460483469109,
  						7.421924546737969
  					],
  					[
  						14.97999555833769,
  						8.796104234243472
  					],
  					[
  						13.954218377344006,
  						9.549494940626687
  					],
  					[
  						14.171466098699028,
  						10.021378282099931
  					],
  					[
  						15.467872755605242,
  						9.982336737503545
  					],
  					[
  						14.92356489427496,
  						10.891325181517473
  					],
  					[
  						14.89336000000003,
  						12.219049999999982
  					],
  					[
  						14.495787387762846,
  						12.85939626713733
  					],
  					[
  						13.540393507550789,
  						14.367133693901224
  					],
  					[
  						13.972170000000006,
  						15.684370000000058
  					],
  					[
  						15.247731154041844,
  						16.627305813050782
  					],
  					[
  						15.30044111497972,
  						17.927949937405003
  					],
  					[
  						15.903246697664315,
  						20.387618923417506
  					],
  					[
  						15.096887648181848,
  						21.30851878507491
  					],
  					[
  						14.851300000000037,
  						22.862950000000126
  					],
  					[
  						15.860850000000084,
  						23.409719999999993
  					],
  					[
  						19.849260000000072,
  						21.49509000000006
  					],
  					[
  						23.83766000000014,
  						19.580470000000105
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Chad",
  			SOV_A3: "TCD",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Chad",
  			ADM0_A3: "TCD",
  			GEOU_DIF: 0,
  			GEOUNIT: "Chad",
  			GU_A3: "TCD",
  			SU_DIF: 0,
  			SUBUNIT: "Chad",
  			SU_A3: "TCD",
  			BRK_DIFF: 0,
  			NAME: "Chad",
  			NAME_LONG: "Chad",
  			BRK_A3: "TCD",
  			BRK_NAME: "Chad",
  			BRK_GROUP: "",
  			ABBREV: "Chad",
  			POSTAL: "TD",
  			FORMAL_EN: "Republic of Chad",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Chad",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Chad",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 8,
  			MAPCOLOR13: 6,
  			POP_EST: 12075985,
  			POP_RANK: 14,
  			GDP_MD_EST: 30590,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CD",
  			ISO_A2: "TD",
  			ISO_A3: "TCD",
  			ISO_A3_EH: "TCD",
  			ISO_N3: "148",
  			UN_A3: "148",
  			WB_A2: "TD",
  			WB_A3: "TCD",
  			WOE_ID: 23424777,
  			WOE_ID_EH: 23424777,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "TCD",
  			ADM0_A3_US: "TCD",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Middle Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 4,
  			LONG_LEN: 4,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321301,
  			WIKIDATAID: "Q657",
  			NAME_AR: "تشاد",
  			NAME_BN: "চাদ",
  			NAME_DE: "Tschad",
  			NAME_EN: "Chad",
  			NAME_ES: "Chad",
  			NAME_FR: "Tchad",
  			NAME_EL: "Τσαντ",
  			NAME_HI: "चाड",
  			NAME_HU: "Csád",
  			NAME_ID: "Chad",
  			NAME_IT: "Ciad",
  			NAME_JA: "チャド",
  			NAME_KO: "차드",
  			NAME_NL: "Tsjaad",
  			NAME_PL: "Czad",
  			NAME_PT: "Chade",
  			NAME_RU: "Чад",
  			NAME_SV: "Tchad",
  			NAME_TR: "Çad",
  			NAME_VI: "Tchad",
  			NAME_ZH: "乍得"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-71.71236141629296,
  						19.714455878167357
  					],
  					[
  						-71.70830481635805,
  						18.044997056546094
  					],
  					[
  						-72.69493709989064,
  						18.445799465401862
  					],
  					[
  						-72.78410478381028,
  						19.48359141690341
  					],
  					[
  						-71.71236141629296,
  						19.714455878167357
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Haiti",
  			SOV_A3: "HTI",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Haiti",
  			ADM0_A3: "HTI",
  			GEOU_DIF: 0,
  			GEOUNIT: "Haiti",
  			GU_A3: "HTI",
  			SU_DIF: 0,
  			SUBUNIT: "Haiti",
  			SU_A3: "HTI",
  			BRK_DIFF: 0,
  			NAME: "Haiti",
  			NAME_LONG: "Haiti",
  			BRK_A3: "HTI",
  			BRK_NAME: "Haiti",
  			BRK_GROUP: "",
  			ABBREV: "Haiti",
  			POSTAL: "HT",
  			FORMAL_EN: "Republic of Haiti",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Haiti",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Haiti",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 2,
  			POP_EST: 10646714,
  			POP_RANK: 14,
  			GDP_MD_EST: 19340,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2003,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "HA",
  			ISO_A2: "HT",
  			ISO_A3: "HTI",
  			ISO_A3_EH: "HTI",
  			ISO_N3: "332",
  			UN_A3: "332",
  			WB_A2: "HT",
  			WB_A3: "HTI",
  			WOE_ID: 23424839,
  			WOE_ID_EH: 23424839,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "HTI",
  			ADM0_A3_US: "HTI",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Caribbean",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320839,
  			WIKIDATAID: "Q790",
  			NAME_AR: "هايتي",
  			NAME_BN: "হাইতি",
  			NAME_DE: "Haiti",
  			NAME_EN: "Haiti",
  			NAME_ES: "Haití",
  			NAME_FR: "Haïti",
  			NAME_EL: "Αϊτή",
  			NAME_HI: "हैती",
  			NAME_HU: "Haiti",
  			NAME_ID: "Haiti",
  			NAME_IT: "Haiti",
  			NAME_JA: "ハイチ",
  			NAME_KO: "아이티",
  			NAME_NL: "Haïti",
  			NAME_PL: "Haiti",
  			NAME_PT: "Haiti",
  			NAME_RU: "Республика Гаити",
  			NAME_SV: "Haiti",
  			NAME_TR: "Haiti",
  			NAME_VI: "Haiti",
  			NAME_ZH: "海地"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-71.70830481635805,
  						18.044997056546094
  					],
  					[
  						-71.71236141629296,
  						19.714455878167357
  					],
  					[
  						-70.80670610216174,
  						19.880285549391985
  					],
  					[
  						-69.22212582057988,
  						19.313214219637103
  					],
  					[
  						-68.31794328476897,
  						18.612197577381693
  					],
  					[
  						-71.70830481635805,
  						18.044997056546094
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Dominican Republic",
  			SOV_A3: "DOM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Dominican Republic",
  			ADM0_A3: "DOM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Dominican Republic",
  			GU_A3: "DOM",
  			SU_DIF: 0,
  			SUBUNIT: "Dominican Republic",
  			SU_A3: "DOM",
  			BRK_DIFF: 0,
  			NAME: "Dominican Rep.",
  			NAME_LONG: "Dominican Republic",
  			BRK_A3: "DOM",
  			BRK_NAME: "Dominican Rep.",
  			BRK_GROUP: "",
  			ABBREV: "Dom. Rep.",
  			POSTAL: "DO",
  			FORMAL_EN: "Dominican Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Dominican Republic",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Dominican Republic",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 7,
  			POP_EST: 10734247,
  			POP_RANK: 14,
  			GDP_MD_EST: 161900,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "DR",
  			ISO_A2: "DO",
  			ISO_A3: "DOM",
  			ISO_A3_EH: "DOM",
  			ISO_N3: "214",
  			UN_A3: "214",
  			WB_A2: "DO",
  			WB_A3: "DOM",
  			WOE_ID: 23424800,
  			WOE_ID_EH: 23424800,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "DOM",
  			ADM0_A3_US: "DOM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Caribbean",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 14,
  			LONG_LEN: 18,
  			ABBREV_LEN: 9,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4.5,
  			MAX_LABEL: 9.5,
  			NE_ID: 1159320563,
  			WIKIDATAID: "Q786",
  			NAME_AR: "جمهورية الدومينيكان",
  			NAME_BN: "ডোমিনিকান প্রজাতন্ত্র",
  			NAME_DE: "Dominikanische Republik",
  			NAME_EN: "Dominican Republic",
  			NAME_ES: "República Dominicana",
  			NAME_FR: "République dominicaine",
  			NAME_EL: "Δομινικανή Δημοκρατία",
  			NAME_HI: "डोमिनिकन गणराज्य",
  			NAME_HU: "Dominikai Köztársaság",
  			NAME_ID: "Republik Dominika",
  			NAME_IT: "Repubblica Dominicana",
  			NAME_JA: "ドミニカ共和国",
  			NAME_KO: "도미니카 공화국",
  			NAME_NL: "Dominicaanse Republiek",
  			NAME_PL: "Dominikana",
  			NAME_PT: "República Dominicana",
  			NAME_RU: "Доминиканская Республика",
  			NAME_SV: "Dominikanska republiken",
  			NAME_TR: "Dominik Cumhuriyeti",
  			NAME_VI: "Cộng hòa Dominica",
  			NAME_ZH: "多明尼加"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-61.2,
  						-51.85
  					],
  					[
  						-60,
  						-51.25
  					],
  					[
  						-58.050000000000004,
  						-51.900000000000006
  					],
  					[
  						-60.7,
  						-52.300000000000004
  					],
  					[
  						-61.2,
  						-51.85
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "United Kingdom",
  			SOV_A3: "GB1",
  			ADM0_DIF: 1,
  			LEVEL: 2,
  			TYPE: "Dependency",
  			ADMIN: "Falkland Islands",
  			ADM0_A3: "FLK",
  			GEOU_DIF: 0,
  			GEOUNIT: "Falkland Islands",
  			GU_A3: "FLK",
  			SU_DIF: 0,
  			SUBUNIT: "Falkland Islands",
  			SU_A3: "FLK",
  			BRK_DIFF: 1,
  			NAME: "Falkland Is.",
  			NAME_LONG: "Falkland Islands",
  			BRK_A3: "B12",
  			BRK_NAME: "Falkland Is.",
  			BRK_GROUP: "",
  			ABBREV: "Flk. Is.",
  			POSTAL: "FK",
  			FORMAL_EN: "Falkland Islands",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Falkland Islands (Islas Malvinas)",
  			NOTE_ADM0: "U.K.",
  			NOTE_BRK: "Admin. by U.K.; Claimed by Argentina",
  			NAME_SORT: "Falkland Islands",
  			NAME_ALT: "Islas Malvinas",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 3,
  			POP_EST: 2931,
  			POP_RANK: 4,
  			GDP_MD_EST: 281.8,
  			POP_YEAR: 2014,
  			LASTCENSUS: -99,
  			GDP_YEAR: 2012,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "FK",
  			ISO_A2: "FK",
  			ISO_A3: "FLK",
  			ISO_A3_EH: "FLK",
  			ISO_N3: "238",
  			UN_A3: "238",
  			WB_A2: "-99",
  			WB_A3: "-99",
  			WOE_ID: 23424814,
  			WOE_ID_EH: 23424814,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "FLK",
  			ADM0_A3_US: "FLK",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 12,
  			LONG_LEN: 16,
  			ABBREV_LEN: 8,
  			TINY: -99,
  			HOMEPART: -99,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4.5,
  			MAX_LABEL: 9,
  			NE_ID: 1159320711,
  			WIKIDATAID: "Q9648",
  			NAME_AR: "جزر فوكلاند",
  			NAME_BN: "ফক্‌ল্যান্ড দ্বীপপুঞ্জ",
  			NAME_DE: "Falklandinseln",
  			NAME_EN: "Falkland Islands",
  			NAME_ES: "Islas Malvinas",
  			NAME_FR: "îles Malouines",
  			NAME_EL: "Νήσοι Φώκλαντ",
  			NAME_HI: "फ़ॉकलैंड द्वीपसमूह",
  			NAME_HU: "Falkland-szigetek",
  			NAME_ID: "Kepulauan Falkland",
  			NAME_IT: "Isole Falkland",
  			NAME_JA: "フォークランド諸島",
  			NAME_KO: "포클랜드 제도",
  			NAME_NL: "Falklandeilanden",
  			NAME_PL: "Falklandy",
  			NAME_PT: "Ilhas Malvinas",
  			NAME_RU: "Фолклендские острова",
  			NAME_SV: "Falklandsöarna",
  			NAME_TR: "Falkland Adaları",
  			NAME_VI: "Quần đảo Falkland",
  			NAME_ZH: "福克兰群岛"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-46.76379,
  						82.62796
  					],
  					[
  						-38.62214,
  						83.54905
  					],
  					[
  						-27.10046,
  						83.51966
  					],
  					[
  						-12.20855,
  						81.29154
  					],
  					[
  						-17.73035,
  						80.12912
  					],
  					[
  						-19.70499,
  						78.75128000000001
  					],
  					[
  						-18.47285,
  						76.98565
  					],
  					[
  						-19.83407,
  						76.09808
  					],
  					[
  						-19.37281,
  						74.29561000000001
  					],
  					[
  						-23.442960000000003,
  						72.08015999999999
  					],
  					[
  						-21.753560000000004,
  						70.66369
  					],
  					[
  						-22.349020000000003,
  						70.12946000000001
  					],
  					[
  						-27.74737,
  						68.47046
  					],
  					[
  						-32.81105,
  						67.73547
  					],
  					[
  						-34.20196,
  						66.67974
  					],
  					[
  						-36.35284,
  						65.9789
  					],
  					[
  						-39.81222,
  						65.45848
  					],
  					[
  						-41.188700000000004,
  						63.482459999999996
  					],
  					[
  						-42.819379999999995,
  						62.68233
  					],
  					[
  						-42.41666000000001,
  						61.90093
  					],
  					[
  						-43.3784,
  						60.09772
  					],
  					[
  						-44.7875,
  						60.03676000000001
  					],
  					[
  						-46.26364,
  						60.85328
  					],
  					[
  						-48.26294000000001,
  						60.858430000000006
  					],
  					[
  						-51.63325,
  						63.62691
  					],
  					[
  						-52.27659,
  						65.17670000000001
  					],
  					[
  						-53.66166,
  						66.09957
  					],
  					[
  						-53.96911,
  						67.18899
  					],
  					[
  						-52.9804,
  						68.35759
  					],
  					[
  						-51.47536,
  						68.72958000000001
  					],
  					[
  						-54.68336,
  						69.61003
  					],
  					[
  						-54.00422,
  						71.54719
  					],
  					[
  						-58.58516,
  						75.51727
  					],
  					[
  						-61.26861,
  						76.10238000000001
  					],
  					[
  						-68.50438,
  						76.06141000000001
  					],
  					[
  						-71.40257,
  						77.00857
  					],
  					[
  						-73.15938,
  						78.43271
  					],
  					[
  						-65.7107,
  						79.39436
  					],
  					[
  						-68.02298,
  						80.11721
  					],
  					[
  						-62.65116,
  						81.77042
  					],
  					[
  						-46.76379,
  						82.62796
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Denmark",
  			SOV_A3: "DN1",
  			ADM0_DIF: 1,
  			LEVEL: 2,
  			TYPE: "Country",
  			ADMIN: "Greenland",
  			ADM0_A3: "GRL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Greenland",
  			GU_A3: "GRL",
  			SU_DIF: 0,
  			SUBUNIT: "Greenland",
  			SU_A3: "GRL",
  			BRK_DIFF: 0,
  			NAME: "Greenland",
  			NAME_LONG: "Greenland",
  			BRK_A3: "GRL",
  			BRK_NAME: "Greenland",
  			BRK_GROUP: "",
  			ABBREV: "Grlnd.",
  			POSTAL: "GL",
  			FORMAL_EN: "Greenland",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Greenland",
  			NOTE_ADM0: "Den.",
  			NOTE_BRK: "",
  			NAME_SORT: "Greenland",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 12,
  			POP_EST: 57713,
  			POP_RANK: 8,
  			GDP_MD_EST: 2173,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2015,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GL",
  			ISO_A2: "GL",
  			ISO_A3: "GRL",
  			ISO_A3_EH: "GRL",
  			ISO_N3: "304",
  			UN_A3: "304",
  			WB_A2: "GL",
  			WB_A3: "GRL",
  			WOE_ID: 23424828,
  			WOE_ID_EH: 23424828,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GRL",
  			ADM0_A3_US: "GRL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Northern America",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 9,
  			LONG_LEN: 9,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: -99,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 1.7,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159320551,
  			WIKIDATAID: "Q223",
  			NAME_AR: "جرينلاند",
  			NAME_BN: "গ্রিনল্যান্ড",
  			NAME_DE: "Grönland",
  			NAME_EN: "Greenland",
  			NAME_ES: "Groenlandia",
  			NAME_FR: "Groenland",
  			NAME_EL: "Γροιλανδία",
  			NAME_HI: "ग्रीनलैण्ड",
  			NAME_HU: "Grönland",
  			NAME_ID: "Greenland",
  			NAME_IT: "Groenlandia",
  			NAME_JA: "グリーンランド",
  			NAME_KO: "그린란드",
  			NAME_NL: "Groenland",
  			NAME_PL: "Grenlandia",
  			NAME_PT: "Gronelândia",
  			NAME_RU: "Гренландия",
  			NAME_SV: "Grönland",
  			NAME_TR: "Grönland",
  			NAME_VI: "Greenland",
  			NAME_ZH: "格陵兰"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						68.935,
  						-48.62500000000001
  					],
  					[
  						70.525,
  						-49.065000000000005
  					],
  					[
  						70.28,
  						-49.71
  					],
  					[
  						68.745,
  						-49.775000000000006
  					],
  					[
  						68.935,
  						-48.62500000000001
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 3,
  			LABELRANK: 6,
  			SOVEREIGNT: "France",
  			SOV_A3: "FR1",
  			ADM0_DIF: 1,
  			LEVEL: 2,
  			TYPE: "Dependency",
  			ADMIN: "French Southern and Antarctic Lands",
  			ADM0_A3: "ATF",
  			GEOU_DIF: 0,
  			GEOUNIT: "French Southern and Antarctic Lands",
  			GU_A3: "ATF",
  			SU_DIF: 0,
  			SUBUNIT: "French Southern and Antarctic Lands",
  			SU_A3: "ATF",
  			BRK_DIFF: 0,
  			NAME: "Fr. S. Antarctic Lands",
  			NAME_LONG: "French Southern and Antarctic Lands",
  			BRK_A3: "ATF",
  			BRK_NAME: "Fr. S. and Antarctic Lands",
  			BRK_GROUP: "",
  			ABBREV: "Fr. S.A.L.",
  			POSTAL: "TF",
  			FORMAL_EN: "Territory of the French Southern and Antarctic Lands",
  			FORMAL_FR: "",
  			NAME_CIAWF: "",
  			NOTE_ADM0: "Fr.",
  			NOTE_BRK: "",
  			NAME_SORT: "French Southern and Antarctic Lands",
  			NAME_ALT: "",
  			MAPCOLOR7: 7,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 9,
  			MAPCOLOR13: 11,
  			POP_EST: 140,
  			POP_RANK: 1,
  			GDP_MD_EST: 16,
  			POP_YEAR: 2017,
  			LASTCENSUS: -99,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "FS",
  			ISO_A2: "TF",
  			ISO_A3: "ATF",
  			ISO_A3_EH: "ATF",
  			ISO_N3: "260",
  			UN_A3: "-099",
  			WB_A2: "-99",
  			WB_A3: "-99",
  			WOE_ID: 28289406,
  			WOE_ID_EH: 28289406,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ATF",
  			ADM0_A3_US: "ATF",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Seven seas (open ocean)",
  			REGION_UN: "Seven seas (open ocean)",
  			SUBREGION: "Seven seas (open ocean)",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 22,
  			LONG_LEN: 35,
  			ABBREV_LEN: 10,
  			TINY: 2,
  			HOMEPART: -99,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320631,
  			WIKIDATAID: "Q129003",
  			NAME_AR: "أراض فرنسية جنوبية وأنتارتيكية",
  			NAME_BN: "",
  			NAME_DE: "Französische Süd- und Antarktisgebiete",
  			NAME_EN: "French Southern and Antarctic Lands",
  			NAME_ES: "Tierras Australes y Antárticas Francesas",
  			NAME_FR: "Terres australes et antarctiques françaises",
  			NAME_EL: "Γαλλικά Νότια και Ανταρκτικά Εδάφη",
  			NAME_HI: "दक्षिण फ्रांसीसी और अंटार्कटिक लैंड",
  			NAME_HU: "Francia déli és antarktiszi területek",
  			NAME_ID: "Daratan Selatan dan Antarktika Perancis",
  			NAME_IT: "Terre australi e antartiche francesi",
  			NAME_JA: "フランス領南方・南極地域",
  			NAME_KO: "프랑스령 남방 및 남극",
  			NAME_NL: "Franse Zuidelijke en Antarctische Gebieden",
  			NAME_PL: "Francuskie Terytoria Południowe i Antarktyczne",
  			NAME_PT: "Terras Austrais e Antárticas Francesas",
  			NAME_RU: "Французские Южные и Антарктические территории",
  			NAME_SV: "Franska sydterritorierna",
  			NAME_TR: "Fransız Güney ve Antarktika Toprakları",
  			NAME_VI: "Vùng đất phía Nam và châu Nam Cực thuộc Pháp",
  			NAME_ZH: "法属南部领地"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						16.344976840895242,
  						-28.5767050106977
  					],
  					[
  						18.464899122804752,
  						-29.04546192801728
  					],
  					[
  						19.894734327888614,
  						-28.461104831660776
  					],
  					[
  						19.895767856534434,
  						-24.76779021576059
  					],
  					[
  						21.605896030369394,
  						-26.726533705351756
  					],
  					[
  						23.312096795350186,
  						-25.26868987396572
  					],
  					[
  						24.211266717228796,
  						-25.670215752873574
  					],
  					[
  						25.66466637543772,
  						-25.486816094669713
  					],
  					[
  						27.119409620886245,
  						-23.574323011979775
  					],
  					[
  						29.43218834810904,
  						-22.091312758067588
  					],
  					[
  						31.19140913262129,
  						-22.2515096981724
  					],
  					[
  						31.930588820124253,
  						-24.36941659922254
  					],
  					[
  						31.83777794772806,
  						-25.84333180105135
  					],
  					[
  						31.04407962415715,
  						-25.731452325139443
  					],
  					[
  						30.68596194837448,
  						-26.743845310169533
  					],
  					[
  						31.28277306491333,
  						-27.285879408478998
  					],
  					[
  						32.07166548028107,
  						-26.73382008230491
  					],
  					[
  						32.830120477028885,
  						-26.742191664336197
  					],
  					[
  						32.46213260267845,
  						-28.301011244420557
  					],
  					[
  						31.325561150851,
  						-29.401977634398914
  					],
  					[
  						30.05571618014278,
  						-31.140269463832958
  					],
  					[
  						28.2197558936771,
  						-32.771952813448856
  					],
  					[
  						25.780628289500697,
  						-33.94464609144834
  					],
  					[
  						22.574157342222236,
  						-33.86408253350531
  					],
  					[
  						19.61640506356457,
  						-34.81916635512371
  					],
  					[
  						18.24449913907992,
  						-33.86775156019803
  					],
  					[
  						18.22176150887148,
  						-31.66163298922567
  					],
  					[
  						16.344976840895242,
  						-28.5767050106977
  					]
  				],
  				[
  					[
  						28.978262566857243,
  						-28.95559661226171
  					],
  					[
  						28.541700066855498,
  						-28.64750172293757
  					],
  					[
  						26.999261915807637,
  						-29.875953871379984
  					],
  					[
  						27.749397006956485,
  						-30.645105889612225
  					],
  					[
  						28.84839969250774,
  						-30.070050551068256
  					],
  					[
  						28.978262566857243,
  						-28.95559661226171
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "South Africa",
  			SOV_A3: "ZAF",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "South Africa",
  			ADM0_A3: "ZAF",
  			GEOU_DIF: 0,
  			GEOUNIT: "South Africa",
  			GU_A3: "ZAF",
  			SU_DIF: 0,
  			SUBUNIT: "South Africa",
  			SU_A3: "ZAF",
  			BRK_DIFF: 0,
  			NAME: "South Africa",
  			NAME_LONG: "South Africa",
  			BRK_A3: "ZAF",
  			BRK_NAME: "South Africa",
  			BRK_GROUP: "",
  			ABBREV: "S.Af.",
  			POSTAL: "ZA",
  			FORMAL_EN: "Republic of South Africa",
  			FORMAL_FR: "",
  			NAME_CIAWF: "South Africa",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "South Africa",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 2,
  			POP_EST: 54841552,
  			POP_RANK: 16,
  			GDP_MD_EST: 739100,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SF",
  			ISO_A2: "ZA",
  			ISO_A3: "ZAF",
  			ISO_A3_EH: "ZAF",
  			ISO_N3: "710",
  			UN_A3: "710",
  			WB_A2: "ZA",
  			WB_A3: "ZAF",
  			WOE_ID: 23424942,
  			WOE_ID_EH: 23424942,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ZAF",
  			ADM0_A3_US: "ZAF",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Southern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 12,
  			LONG_LEN: 12,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 1.7,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159321431,
  			WIKIDATAID: "Q258",
  			NAME_AR: "جنوب أفريقيا",
  			NAME_BN: "দক্ষিণ আফ্রিকা",
  			NAME_DE: "Südafrika",
  			NAME_EN: "South Africa",
  			NAME_ES: "Sudáfrica",
  			NAME_FR: "Afrique du Sud",
  			NAME_EL: "Νότια Αφρική",
  			NAME_HI: "दक्षिण अफ़्रीका",
  			NAME_HU: "Dél-afrikai Köztársaság",
  			NAME_ID: "Afrika Selatan",
  			NAME_IT: "Sudafrica",
  			NAME_JA: "南アフリカ共和国",
  			NAME_KO: "남아프리카 공화국",
  			NAME_NL: "Zuid-Afrika",
  			NAME_PL: "Południowa Afryka",
  			NAME_PT: "África do Sul",
  			NAME_RU: "Южно-Африканская Республика",
  			NAME_SV: "Sydafrika",
  			NAME_TR: "Güney Afrika Cumhuriyeti",
  			NAME_VI: "Cộng hòa Nam Phi",
  			NAME_ZH: "南非"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						28.978262566857243,
  						-28.95559661226171
  					],
  					[
  						28.84839969250774,
  						-30.070050551068256
  					],
  					[
  						27.749397006956485,
  						-30.645105889612225
  					],
  					[
  						26.999261915807637,
  						-29.875953871379984
  					],
  					[
  						28.541700066855498,
  						-28.64750172293757
  					],
  					[
  						28.978262566857243,
  						-28.95559661226171
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Lesotho",
  			SOV_A3: "LSO",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Lesotho",
  			ADM0_A3: "LSO",
  			GEOU_DIF: 0,
  			GEOUNIT: "Lesotho",
  			GU_A3: "LSO",
  			SU_DIF: 0,
  			SUBUNIT: "Lesotho",
  			SU_A3: "LSO",
  			BRK_DIFF: 0,
  			NAME: "Lesotho",
  			NAME_LONG: "Lesotho",
  			BRK_A3: "LSO",
  			BRK_NAME: "Lesotho",
  			BRK_GROUP: "",
  			ABBREV: "Les.",
  			POSTAL: "LS",
  			FORMAL_EN: "Kingdom of Lesotho",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Lesotho",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Lesotho",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 8,
  			POP_EST: 1958042,
  			POP_RANK: 12,
  			GDP_MD_EST: 6019,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2006,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LT",
  			ISO_A2: "LS",
  			ISO_A3: "LSO",
  			ISO_A3_EH: "LSO",
  			ISO_N3: "426",
  			UN_A3: "426",
  			WB_A2: "LS",
  			WB_A3: "LSO",
  			WOE_ID: 23424880,
  			WOE_ID_EH: 23424880,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LSO",
  			ADM0_A3_US: "LSO",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Southern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321027,
  			WIKIDATAID: "Q1013",
  			NAME_AR: "ليسوتو",
  			NAME_BN: "লেসোথো",
  			NAME_DE: "Lesotho",
  			NAME_EN: "Lesotho",
  			NAME_ES: "Lesoto",
  			NAME_FR: "Lesotho",
  			NAME_EL: "Λεσότο",
  			NAME_HI: "लेसोथो",
  			NAME_HU: "Lesotho",
  			NAME_ID: "Lesotho",
  			NAME_IT: "Lesotho",
  			NAME_JA: "レソト",
  			NAME_KO: "레소토",
  			NAME_NL: "Lesotho",
  			NAME_PL: "Lesotho",
  			NAME_PT: "Lesoto",
  			NAME_RU: "Лесото",
  			NAME_SV: "Lesotho",
  			NAME_TR: "Lesotho",
  			NAME_VI: "Lesotho",
  			NAME_ZH: "莱索托"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-117.12775999999985,
  						32.53533999999996
  					],
  					[
  						-114.815,
  						32.52528000000001
  					],
  					[
  						-111.02361000000002,
  						31.334719999999948
  					],
  					[
  						-108.24193999999994,
  						31.342220000000054
  					],
  					[
  						-106.50758999999988,
  						31.754520000000014
  					],
  					[
  						-105.03737000000001,
  						30.644019999999955
  					],
  					[
  						-104.4569699999999,
  						29.571960000000047
  					],
  					[
  						-103.11000000000001,
  						28.970000000000027
  					],
  					[
  						-102.48000000000002,
  						29.75999999999999
  					],
  					[
  						-100.95759999999996,
  						29.380710000000136
  					],
  					[
  						-99.51999999999992,
  						27.54000000000002
  					],
  					[
  						-99.01999999999992,
  						26.37000000000006
  					],
  					[
  						-97.52999999999992,
  						25.84000000000009
  					],
  					[
  						-97.87236670611111,
  						22.44421173755336
  					],
  					[
  						-97.18933346229329,
  						20.635433254473128
  					],
  					[
  						-95.90088497595997,
  						18.82802419684873
  					],
  					[
  						-94.42572953975622,
  						18.144370835843347
  					],
  					[
  						-91.40790340855926,
  						18.87608327888023
  					],
  					[
  						-90.77186987991087,
  						19.28412038825678
  					],
  					[
  						-90.2786183336849,
  						20.999855454995554
  					],
  					[
  						-88.54386633986286,
  						21.49367544197662
  					],
  					[
  						-87.05189022494807,
  						21.5435431991383
  					],
  					[
  						-86.84590796583262,
  						20.849864610268355
  					],
  					[
  						-87.38329118523586,
  						20.25540477139873
  					],
  					[
  						-87.83719112827151,
  						18.25981598558343
  					],
  					[
  						-88.3000310940937,
  						18.4999822046599
  					],
  					[
  						-89.14308041050333,
  						17.808318996649405
  					],
  					[
  						-91.00151994501596,
  						17.81759491624571
  					],
  					[
  						-90.46447262242266,
  						16.069562079324655
  					],
  					[
  						-91.74796017125595,
  						16.066564846251765
  					],
  					[
  						-92.22775000686983,
  						14.538828640190928
  					],
  					[
  						-93.35946387406176,
  						15.615429592343673
  					],
  					[
  						-94.69165646033014,
  						16.200975246642884
  					],
  					[
  						-96.55743404822829,
  						15.653515122942792
  					],
  					[
  						-100.82949886758132,
  						17.17107107184205
  					],
  					[
  						-101.91852800170022,
  						17.916090196193977
  					],
  					[
  						-103.50098954955808,
  						18.29229462327885
  					],
  					[
  						-104.9920096504755,
  						19.316133938061682
  					],
  					[
  						-105.73139604370766,
  						20.434101874264115
  					],
  					[
  						-105.27075232625793,
  						21.07628489835514
  					],
  					[
  						-106.02871639689897,
  						22.773752346278627
  					],
  					[
  						-108.40190487347098,
  						25.172313951105934
  					],
  					[
  						-109.44408932171734,
  						25.82488393808768
  					],
  					[
  						-109.29164384645628,
  						26.442934068298428
  					],
  					[
  						-110.3917317370857,
  						27.16211497650454
  					],
  					[
  						-112.2282346260904,
  						28.95440867768349
  					],
  					[
  						-113.14866939985717,
  						31.170965887978923
  					],
  					[
  						-114.77645117883503,
  						31.79953217216115
  					],
  					[
  						-114.67389929895177,
  						30.162681179315996
  					],
  					[
  						-112.9622983467965,
  						28.42519033458251
  					],
  					[
  						-112.76158708377488,
  						27.780216783147523
  					],
  					[
  						-111.61648902061921,
  						26.662817287700477
  					],
  					[
  						-110.71000688357134,
  						24.82600434010186
  					],
  					[
  						-110.29507097048366,
  						23.43097321216669
  					],
  					[
  						-112.18203589562148,
  						24.738412787367167
  					],
  					[
  						-112.3007108223797,
  						26.012004299416617
  					],
  					[
  						-114.46574662968004,
  						27.142090358991368
  					],
  					[
  						-114.16201839888464,
  						28.566111965442303
  					],
  					[
  						-115.518653937627,
  						29.5563615992354
  					],
  					[
  						-117.12775999999985,
  						32.53533999999996
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Mexico",
  			SOV_A3: "MEX",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Mexico",
  			ADM0_A3: "MEX",
  			GEOU_DIF: 0,
  			GEOUNIT: "Mexico",
  			GU_A3: "MEX",
  			SU_DIF: 0,
  			SUBUNIT: "Mexico",
  			SU_A3: "MEX",
  			BRK_DIFF: 0,
  			NAME: "Mexico",
  			NAME_LONG: "Mexico",
  			BRK_A3: "MEX",
  			BRK_NAME: "Mexico",
  			BRK_GROUP: "",
  			ABBREV: "Mex.",
  			POSTAL: "MX",
  			FORMAL_EN: "United Mexican States",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Mexico",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Mexico",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 3,
  			POP_EST: 124574795,
  			POP_RANK: 17,
  			GDP_MD_EST: 2307000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "4. Emerging region: MIKT",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MX",
  			ISO_A2: "MX",
  			ISO_A3: "MEX",
  			ISO_A3_EH: "MEX",
  			ISO_N3: "484",
  			UN_A3: "484",
  			WB_A2: "MX",
  			WB_A3: "MEX",
  			WOE_ID: 23424900,
  			WOE_ID_EH: 23424900,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MEX",
  			ADM0_A3_US: "MEX",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Central America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159321055,
  			WIKIDATAID: "Q96",
  			NAME_AR: "المكسيك",
  			NAME_BN: "মেক্সিকো",
  			NAME_DE: "Mexiko",
  			NAME_EN: "Mexico",
  			NAME_ES: "México",
  			NAME_FR: "Mexique",
  			NAME_EL: "Μεξικό",
  			NAME_HI: "मेक्सिको",
  			NAME_HU: "Mexikó",
  			NAME_ID: "Meksiko",
  			NAME_IT: "Messico",
  			NAME_JA: "メキシコ",
  			NAME_KO: "멕시코",
  			NAME_NL: "Mexico",
  			NAME_PL: "Meksyk",
  			NAME_PT: "México",
  			NAME_RU: "Мексика",
  			NAME_SV: "Mexiko",
  			NAME_TR: "Meksika",
  			NAME_VI: "México",
  			NAME_ZH: "墨西哥"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-57.62513342958296,
  						-30.21629485445426
  					],
  					[
  						-56.976025763564735,
  						-30.109686374636127
  					],
  					[
  						-53.78795162618219,
  						-32.047242526987624
  					],
  					[
  						-53.209588995971544,
  						-32.727666110974724
  					],
  					[
  						-53.373661668498244,
  						-33.768377780900764
  					],
  					[
  						-54.93586605489773,
  						-34.952646579733624
  					],
  					[
  						-57.81786068381551,
  						-34.4625472958775
  					],
  					[
  						-58.42707414410439,
  						-33.909454441057576
  					],
  					[
  						-58.14244035504076,
  						-32.044503676076154
  					],
  					[
  						-57.62513342958296,
  						-30.21629485445426
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Uruguay",
  			SOV_A3: "URY",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Uruguay",
  			ADM0_A3: "URY",
  			GEOU_DIF: 0,
  			GEOUNIT: "Uruguay",
  			GU_A3: "URY",
  			SU_DIF: 0,
  			SUBUNIT: "Uruguay",
  			SU_A3: "URY",
  			BRK_DIFF: 0,
  			NAME: "Uruguay",
  			NAME_LONG: "Uruguay",
  			BRK_A3: "URY",
  			BRK_NAME: "Uruguay",
  			BRK_GROUP: "",
  			ABBREV: "Ury.",
  			POSTAL: "UY",
  			FORMAL_EN: "Oriental Republic of Uruguay",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Uruguay",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Uruguay",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 10,
  			POP_EST: 3360148,
  			POP_RANK: 12,
  			GDP_MD_EST: 73250,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "UY",
  			ISO_A2: "UY",
  			ISO_A3: "URY",
  			ISO_A3_EH: "URY",
  			ISO_N3: "858",
  			UN_A3: "858",
  			WB_A2: "UY",
  			WB_A3: "URY",
  			WOE_ID: 23424979,
  			WOE_ID_EH: 23424979,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "URY",
  			ADM0_A3_US: "URY",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321353,
  			WIKIDATAID: "Q77",
  			NAME_AR: "الأوروغواي",
  			NAME_BN: "উরুগুয়ে",
  			NAME_DE: "Uruguay",
  			NAME_EN: "Uruguay",
  			NAME_ES: "Uruguay",
  			NAME_FR: "Uruguay",
  			NAME_EL: "Ουρουγουάη",
  			NAME_HI: "उरुग्वे",
  			NAME_HU: "Uruguay",
  			NAME_ID: "Uruguay",
  			NAME_IT: "Uruguay",
  			NAME_JA: "ウルグアイ",
  			NAME_KO: "우루과이",
  			NAME_NL: "Uruguay",
  			NAME_PL: "Urugwaj",
  			NAME_PT: "Uruguai",
  			NAME_RU: "Уругвай",
  			NAME_SV: "Uruguay",
  			NAME_TR: "Uruguay",
  			NAME_VI: "Uruguay",
  			NAME_ZH: "乌拉圭"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-53.373661668498244,
  						-33.768377780900764
  					],
  					[
  						-53.209588995971544,
  						-32.727666110974724
  					],
  					[
  						-53.78795162618219,
  						-32.047242526987624
  					],
  					[
  						-56.976025763564735,
  						-30.109686374636127
  					],
  					[
  						-57.62513342958296,
  						-30.21629485445426
  					],
  					[
  						-55.16228634298457,
  						-27.881915378533463
  					],
  					[
  						-53.64873531758789,
  						-26.92347258881609
  					],
  					[
  						-53.628348965048744,
  						-26.124865004177472
  					],
  					[
  						-54.625290696823576,
  						-25.739255466415514
  					],
  					[
  						-54.29347632507745,
  						-24.570799655863965
  					],
  					[
  						-55.40074723979542,
  						-23.956935316668805
  					],
  					[
  						-55.610682745981144,
  						-22.655619398694846
  					],
  					[
  						-56.47331743022939,
  						-22.086300144135283
  					],
  					[
  						-57.937155727761294,
  						-22.090175876557172
  					],
  					[
  						-57.8706739976178,
  						-20.73268767668195
  					],
  					[
  						-58.166392381408045,
  						-20.176700941653678
  					],
  					[
  						-57.49837114117099,
  						-18.174187513911292
  					],
  					[
  						-58.28080400250225,
  						-17.271710300366017
  					],
  					[
  						-58.24121985536668,
  						-16.299573256091293
  					],
  					[
  						-60.158389655179036,
  						-16.258283786690086
  					],
  					[
  						-60.503304002511136,
  						-13.775954685117659
  					],
  					[
  						-61.71320431176078,
  						-13.489202162330052
  					],
  					[
  						-63.19649878605057,
  						-12.627032565972435
  					],
  					[
  						-64.3163529120316,
  						-12.461978041232193
  					],
  					[
  						-65.40228146021303,
  						-11.566270440317155
  					],
  					[
  						-65.33843522811642,
  						-9.761987806846392
  					],
  					[
  						-66.6469083319628,
  						-9.931331475466862
  					],
  					[
  						-68.27125362819326,
  						-11.01452117273682
  					],
  					[
  						-69.52967810736496,
  						-10.951734307502194
  					],
  					[
  						-70.54868567572841,
  						-11.009146823778465
  					],
  					[
  						-70.48189388699117,
  						-9.490118096558845
  					],
  					[
  						-71.30241227892154,
  						-10.079436130415374
  					],
  					[
  						-72.18489071316985,
  						-10.053597914269432
  					],
  					[
  						-73.57105933296707,
  						-8.424446709835834
  					],
  					[
  						-73.98723548042966,
  						-7.523829847853065
  					],
  					[
  						-73.1200274319236,
  						-6.629930922068239
  					],
  					[
  						-72.89192765978726,
  						-5.274561455916981
  					],
  					[
  						-70.7947688463023,
  						-4.251264743673303
  					],
  					[
  						-69.89363521999663,
  						-4.2981869441943275
  					],
  					[
  						-69.44410193548961,
  						-1.5562871232198177
  					],
  					[
  						-70.02065589057005,
  						-0.18515634521953928
  					],
  					[
  						-69.81697323269162,
  						1.7148052026396243
  					],
  					[
  						-67.86856502955884,
  						1.6924551456733923
  					],
  					[
  						-66.87632585312258,
  						1.253360500489336
  					],
  					[
  						-66.32576514348496,
  						0.7244522159820121
  					],
  					[
  						-64.19930579289051,
  						1.49285492594602
  					],
  					[
  						-64.3684944322141,
  						3.797210394705246
  					],
  					[
  						-62.804533047116706,
  						4.006965033377952
  					],
  					[
  						-60.96689327660154,
  						4.536467596856639
  					],
  					[
  						-60.73357418480372,
  						5.200277207861901
  					],
  					[
  						-59.53803992373123,
  						3.9588025984819377
  					],
  					[
  						-59.97452490908456,
  						2.755232652188056
  					],
  					[
  						-59.64604366722126,
  						1.786893825686789
  					],
  					[
  						-59.03086157900265,
  						1.3176976586927225
  					],
  					[
  						-56.539385748914555,
  						1.8995226098669207
  					],
  					[
  						-55.973322109589375,
  						2.510363877773017
  					],
  					[
  						-54.524754197799716,
  						2.3118488631237852
  					],
  					[
  						-52.939657151894956,
  						2.1248576928756364
  					],
  					[
  						-51.65779741067889,
  						4.156232408053029
  					],
  					[
  						-51.31714636901086,
  						4.203490505383954
  					],
  					[
  						-50.508875291533656,
  						1.901563828942457
  					],
  					[
  						-49.94710079608871,
  						1.0461896834312228
  					],
  					[
  						-50.38821082213214,
  						-0.07844451253681939
  					],
  					[
  						-48.62056677915632,
  						-0.2354891902718208
  					],
  					[
  						-44.905703090990414,
  						-1.551739597178134
  					],
  					[
  						-44.417619187993665,
  						-2.137750339367976
  					],
  					[
  						-41.47265682632825,
  						-2.9120183243971165
  					],
  					[
  						-39.97866533055404,
  						-2.873054294449041
  					],
  					[
  						-38.50038347019657,
  						-3.7006523576033956
  					],
  					[
  						-37.2232521225352,
  						-4.820945733258917
  					],
  					[
  						-35.23538896334756,
  						-5.464937432480247
  					],
  					[
  						-34.729993455533034,
  						-7.343220716992967
  					],
  					[
  						-35.12821204277422,
  						-8.996401462442286
  					],
  					[
  						-37.046518724097,
  						-11.040721123908803
  					],
  					[
  						-37.68361161960736,
  						-12.171194756725823
  					],
  					[
  						-38.953275722802545,
  						-13.793369642800023
  					],
  					[
  						-38.88229814304965,
  						-15.667053724838768
  					],
  					[
  						-39.2673392400564,
  						-17.867746270420483
  					],
  					[
  						-39.76082333022764,
  						-19.59911345792741
  					],
  					[
  						-40.77474077001034,
  						-20.904511814052423
  					],
  					[
  						-40.94475623225061,
  						-21.93731698983781
  					],
  					[
  						-41.98828426773656,
  						-22.970070489190896
  					],
  					[
  						-43.07470374202475,
  						-22.96769337330547
  					],
  					[
  						-44.64781185563781,
  						-23.351959323827842
  					],
  					[
  						-46.47209326840554,
  						-24.088968601174543
  					],
  					[
  						-47.64897233742066,
  						-24.885199069927722
  					],
  					[
  						-48.4954581365777,
  						-25.877024834905654
  					],
  					[
  						-48.474735887228654,
  						-27.17591196056189
  					],
  					[
  						-48.8884574041574,
  						-28.674115085567884
  					],
  					[
  						-49.587329474472675,
  						-29.224469089476337
  					],
  					[
  						-50.696874152211485,
  						-30.98446502047296
  					],
  					[
  						-52.256081305538046,
  						-32.24536996839467
  					],
  					[
  						-53.373661668498244,
  						-33.768377780900764
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Brazil",
  			SOV_A3: "BRA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Brazil",
  			ADM0_A3: "BRA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Brazil",
  			GU_A3: "BRA",
  			SU_DIF: 0,
  			SUBUNIT: "Brazil",
  			SU_A3: "BRA",
  			BRK_DIFF: 0,
  			NAME: "Brazil",
  			NAME_LONG: "Brazil",
  			BRK_A3: "BRA",
  			BRK_NAME: "Brazil",
  			BRK_GROUP: "",
  			ABBREV: "Brazil",
  			POSTAL: "BR",
  			FORMAL_EN: "Federative Republic of Brazil",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Brazil",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Brazil",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 7,
  			POP_EST: 207353391,
  			POP_RANK: 17,
  			GDP_MD_EST: 3081000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "3. Emerging region: BRIC",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BR",
  			ISO_A2: "BR",
  			ISO_A3: "BRA",
  			ISO_A3_EH: "BRA",
  			ISO_N3: "076",
  			UN_A3: "076",
  			WB_A2: "BR",
  			WB_A3: "BRA",
  			WOE_ID: 23424768,
  			WOE_ID_EH: 23424768,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BRA",
  			ADM0_A3_US: "BRA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 1.7,
  			MAX_LABEL: 5.7,
  			NE_ID: 1159320441,
  			WIKIDATAID: "Q155",
  			NAME_AR: "البرازيل",
  			NAME_BN: "ব্রাজিল",
  			NAME_DE: "Brasilien",
  			NAME_EN: "Brazil",
  			NAME_ES: "Brasil",
  			NAME_FR: "Brésil",
  			NAME_EL: "Βραζιλία",
  			NAME_HI: "ब्राज़ील",
  			NAME_HU: "Brazília",
  			NAME_ID: "Brasil",
  			NAME_IT: "Brasile",
  			NAME_JA: "ブラジル",
  			NAME_KO: "브라질",
  			NAME_NL: "Brazilië",
  			NAME_PL: "Brazylia",
  			NAME_PT: "Brasil",
  			NAME_RU: "Бразилия",
  			NAME_SV: "Brasilien",
  			NAME_TR: "Brezilya",
  			NAME_VI: "Brasil",
  			NAME_ZH: "巴西"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-69.52967810736496,
  						-10.951734307502194
  					],
  					[
  						-68.27125362819326,
  						-11.01452117273682
  					],
  					[
  						-66.6469083319628,
  						-9.931331475466862
  					],
  					[
  						-65.33843522811642,
  						-9.761987806846392
  					],
  					[
  						-65.40228146021303,
  						-11.566270440317155
  					],
  					[
  						-64.3163529120316,
  						-12.461978041232193
  					],
  					[
  						-63.19649878605057,
  						-12.627032565972435
  					],
  					[
  						-61.71320431176078,
  						-13.489202162330052
  					],
  					[
  						-60.503304002511136,
  						-13.775954685117659
  					],
  					[
  						-60.158389655179036,
  						-16.258283786690086
  					],
  					[
  						-58.24121985536668,
  						-16.299573256091293
  					],
  					[
  						-58.28080400250225,
  						-17.271710300366017
  					],
  					[
  						-57.49837114117099,
  						-18.174187513911292
  					],
  					[
  						-58.166392381408045,
  						-20.176700941653678
  					],
  					[
  						-59.11504248720611,
  						-19.3569060197754
  					],
  					[
  						-61.78632646345377,
  						-19.633736667562964
  					],
  					[
  						-62.2659612697708,
  						-20.513734633061276
  					],
  					[
  						-62.685057135657885,
  						-22.249029229422387
  					],
  					[
  						-63.986838141522476,
  						-21.99364430103595
  					],
  					[
  						-66.27333940292485,
  						-21.83231047942072
  					],
  					[
  						-67.1066735500636,
  						-22.735924574476417
  					],
  					[
  						-67.82817989772273,
  						-22.872918796482175
  					],
  					[
  						-68.75716712103375,
  						-20.372657972904463
  					],
  					[
  						-68.44222510443092,
  						-19.40506845467143
  					],
  					[
  						-68.96681840684187,
  						-18.981683444904107
  					],
  					[
  						-69.59042375352405,
  						-17.580011895419332
  					],
  					[
  						-68.9596353827533,
  						-16.50069793057127
  					],
  					[
  						-69.38976416693471,
  						-15.660129082911652
  					],
  					[
  						-68.9488866848366,
  						-14.453639418193283
  					],
  					[
  						-68.66507971868963,
  						-12.561300144097173
  					],
  					[
  						-69.52967810736496,
  						-10.951734307502194
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Bolivia",
  			SOV_A3: "BOL",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Bolivia",
  			ADM0_A3: "BOL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Bolivia",
  			GU_A3: "BOL",
  			SU_DIF: 0,
  			SUBUNIT: "Bolivia",
  			SU_A3: "BOL",
  			BRK_DIFF: 0,
  			NAME: "Bolivia",
  			NAME_LONG: "Bolivia",
  			BRK_A3: "BOL",
  			BRK_NAME: "Bolivia",
  			BRK_GROUP: "",
  			ABBREV: "Bolivia",
  			POSTAL: "BO",
  			FORMAL_EN: "Plurinational State of Bolivia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Bolivia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Bolivia",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 3,
  			POP_EST: 11138234,
  			POP_RANK: 14,
  			GDP_MD_EST: 78350,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BL",
  			ISO_A2: "BO",
  			ISO_A3: "BOL",
  			ISO_A3_EH: "BOL",
  			ISO_N3: "068",
  			UN_A3: "068",
  			WB_A2: "BO",
  			WB_A3: "BOL",
  			WOE_ID: 23424762,
  			WOE_ID_EH: 23424762,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BOL",
  			ADM0_A3_US: "BOL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 7,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7.5,
  			NE_ID: 1159320439,
  			WIKIDATAID: "Q750",
  			NAME_AR: "بوليفيا",
  			NAME_BN: "বলিভিয়া",
  			NAME_DE: "Bolivien",
  			NAME_EN: "Bolivia",
  			NAME_ES: "Bolivia",
  			NAME_FR: "Bolivie",
  			NAME_EL: "Βολιβία",
  			NAME_HI: "बोलिविया",
  			NAME_HU: "Bolívia",
  			NAME_ID: "Bolivia",
  			NAME_IT: "Bolivia",
  			NAME_JA: "ボリビア",
  			NAME_KO: "볼리비아",
  			NAME_NL: "Bolivia",
  			NAME_PL: "Boliwia",
  			NAME_PT: "Bolívia",
  			NAME_RU: "Боливия",
  			NAME_SV: "Bolivia",
  			NAME_TR: "Bolivya",
  			NAME_VI: "Bolivia",
  			NAME_ZH: "玻利維亞"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-69.89363521999663,
  						-4.2981869441943275
  					],
  					[
  						-70.7947688463023,
  						-4.251264743673303
  					],
  					[
  						-72.89192765978726,
  						-5.274561455916981
  					],
  					[
  						-73.1200274319236,
  						-6.629930922068239
  					],
  					[
  						-73.98723548042966,
  						-7.523829847853065
  					],
  					[
  						-73.57105933296707,
  						-8.424446709835834
  					],
  					[
  						-72.18489071316985,
  						-10.053597914269432
  					],
  					[
  						-71.30241227892154,
  						-10.079436130415374
  					],
  					[
  						-70.48189388699117,
  						-9.490118096558845
  					],
  					[
  						-70.54868567572841,
  						-11.009146823778465
  					],
  					[
  						-69.52967810736496,
  						-10.951734307502194
  					],
  					[
  						-68.66507971868963,
  						-12.561300144097173
  					],
  					[
  						-68.9488866848366,
  						-14.453639418193283
  					],
  					[
  						-69.38976416693471,
  						-15.660129082911652
  					],
  					[
  						-68.9596353827533,
  						-16.50069793057127
  					],
  					[
  						-69.59042375352405,
  						-17.580011895419332
  					],
  					[
  						-70.37257239447771,
  						-18.34797535570887
  					],
  					[
  						-71.46204077827113,
  						-17.363487644116383
  					],
  					[
  						-73.44452958850042,
  						-16.359362888252996
  					],
  					[
  						-76.00920508492995,
  						-14.649286390850321
  					],
  					[
  						-76.25924150257417,
  						-13.535039157772943
  					],
  					[
  						-77.10619238962184,
  						-12.22271615972082
  					],
  					[
  						-79.03695309112695,
  						-8.386567884965892
  					],
  					[
  						-79.76057817251005,
  						-7.194340915560084
  					],
  					[
  						-81.24999630402642,
  						-6.136834405139183
  					],
  					[
  						-80.92634680858244,
  						-5.690556735866565
  					],
  					[
  						-81.41094255239946,
  						-4.7367648250554595
  					],
  					[
  						-80.30256059438722,
  						-3.4048564591647126
  					],
  					[
  						-80.44224199087216,
  						-4.425724379090674
  					],
  					[
  						-78.63989722361234,
  						-4.547784112164074
  					],
  					[
  						-77.83790483265861,
  						-3.003020521663103
  					],
  					[
  						-76.63539425322672,
  						-2.6086776668438176
  					],
  					[
  						-75.54499569365204,
  						-1.5616097957458803
  					],
  					[
  						-75.37322323271385,
  						-0.1520317521204504
  					],
  					[
  						-73.6595035468346,
  						-1.2604912247811342
  					],
  					[
  						-73.07039221870724,
  						-2.3089543595509525
  					],
  					[
  						-70.81347571479196,
  						-2.2568645158007428
  					],
  					[
  						-70.04770850287485,
  						-2.725156345229699
  					],
  					[
  						-70.39404395209499,
  						-3.7665914852078255
  					],
  					[
  						-69.89363521999663,
  						-4.2981869441943275
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Peru",
  			SOV_A3: "PER",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Peru",
  			ADM0_A3: "PER",
  			GEOU_DIF: 0,
  			GEOUNIT: "Peru",
  			GU_A3: "PER",
  			SU_DIF: 0,
  			SUBUNIT: "Peru",
  			SU_A3: "PER",
  			BRK_DIFF: 0,
  			NAME: "Peru",
  			NAME_LONG: "Peru",
  			BRK_A3: "PER",
  			BRK_NAME: "Peru",
  			BRK_GROUP: "",
  			ABBREV: "Peru",
  			POSTAL: "PE",
  			FORMAL_EN: "Republic of Peru",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Peru",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Peru",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 11,
  			POP_EST: 31036656,
  			POP_RANK: 15,
  			GDP_MD_EST: 410400,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2007,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "PE",
  			ISO_A2: "PE",
  			ISO_A3: "PER",
  			ISO_A3_EH: "PER",
  			ISO_N3: "604",
  			UN_A3: "604",
  			WB_A2: "PE",
  			WB_A3: "PER",
  			WOE_ID: 23424919,
  			WOE_ID_EH: 23424919,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "PER",
  			ADM0_A3_US: "PER",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 4,
  			LONG_LEN: 4,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2,
  			MAX_LABEL: 7,
  			NE_ID: 1159321163,
  			WIKIDATAID: "Q419",
  			NAME_AR: "بيرو",
  			NAME_BN: "পেরু",
  			NAME_DE: "Peru",
  			NAME_EN: "Peru",
  			NAME_ES: "Perú",
  			NAME_FR: "Pérou",
  			NAME_EL: "Περού",
  			NAME_HI: "पेरू",
  			NAME_HU: "Peru",
  			NAME_ID: "Peru",
  			NAME_IT: "Perù",
  			NAME_JA: "ペルー",
  			NAME_KO: "페루",
  			NAME_NL: "Peru",
  			NAME_PL: "Peru",
  			NAME_PT: "Peru",
  			NAME_RU: "Перу",
  			NAME_SV: "Peru",
  			NAME_TR: "Peru",
  			NAME_VI: "Peru",
  			NAME_ZH: "秘鲁"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-66.87632585312258,
  						1.253360500489336
  					],
  					[
  						-67.86856502955884,
  						1.6924551456733923
  					],
  					[
  						-69.81697323269162,
  						1.7148052026396243
  					],
  					[
  						-70.02065589057005,
  						-0.18515634521953928
  					],
  					[
  						-69.44410193548961,
  						-1.5562871232198177
  					],
  					[
  						-69.89363521999663,
  						-4.2981869441943275
  					],
  					[
  						-70.39404395209499,
  						-3.7665914852078255
  					],
  					[
  						-70.04770850287485,
  						-2.725156345229699
  					],
  					[
  						-70.81347571479196,
  						-2.2568645158007428
  					],
  					[
  						-73.07039221870724,
  						-2.3089543595509525
  					],
  					[
  						-73.6595035468346,
  						-1.2604912247811342
  					],
  					[
  						-75.37322323271385,
  						-0.1520317521204504
  					],
  					[
  						-76.29231441924097,
  						0.4160472680641192
  					],
  					[
  						-77.4249843004304,
  						0.395686753741117
  					],
  					[
  						-78.85525875518871,
  						1.380923773601822
  					],
  					[
  						-78.42761043975733,
  						2.629555568854215
  					],
  					[
  						-77.93154252797149,
  						2.6966057397529255
  					],
  					[
  						-77.12768978545526,
  						3.8496361352653565
  					],
  					[
  						-77.53322058786573,
  						5.582811997902497
  					],
  					[
  						-77.47666073272228,
  						6.691116441266303
  					],
  					[
  						-77.88157141794525,
  						7.223771267114785
  					],
  					[
  						-77.24256649444008,
  						7.935278225125444
  					],
  					[
  						-77.35336076527386,
  						8.67050466555807
  					],
  					[
  						-76.83667395700357,
  						8.638749497914716
  					],
  					[
  						-75.67460018584006,
  						9.443248195834599
  					],
  					[
  						-75.48042599150335,
  						10.618990383339309
  					],
  					[
  						-74.1972226630477,
  						11.310472723836867
  					],
  					[
  						-73.41476396350029,
  						11.22701528568548
  					],
  					[
  						-71.75409013536864,
  						12.437303168177309
  					],
  					[
  						-71.3315836249503,
  						11.776284084515808
  					],
  					[
  						-71.97392167833829,
  						11.60867157637712
  					],
  					[
  						-72.9052860175347,
  						10.450344346554772
  					],
  					[
  						-72.7887298245004,
  						9.085027167187334
  					],
  					[
  						-71.96017574734864,
  						6.991614895043539
  					],
  					[
  						-70.09331295437242,
  						6.96037649172311
  					],
  					[
  						-69.38947994655712,
  						6.0998605411988365
  					],
  					[
  						-67.34143958196557,
  						6.095468044454023
  					],
  					[
  						-67.82301225449355,
  						4.503937282728899
  					],
  					[
  						-67.30317318385345,
  						3.31845408773718
  					],
  					[
  						-66.87632585312258,
  						1.253360500489336
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Colombia",
  			SOV_A3: "COL",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Colombia",
  			ADM0_A3: "COL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Colombia",
  			GU_A3: "COL",
  			SU_DIF: 0,
  			SUBUNIT: "Colombia",
  			SU_A3: "COL",
  			BRK_DIFF: 0,
  			NAME: "Colombia",
  			NAME_LONG: "Colombia",
  			BRK_A3: "COL",
  			BRK_NAME: "Colombia",
  			BRK_GROUP: "",
  			ABBREV: "Col.",
  			POSTAL: "CO",
  			FORMAL_EN: "Republic of Colombia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Colombia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Colombia",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 1,
  			POP_EST: 47698524,
  			POP_RANK: 15,
  			GDP_MD_EST: 688000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2006,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CO",
  			ISO_A2: "CO",
  			ISO_A3: "COL",
  			ISO_A3_EH: "COL",
  			ISO_N3: "170",
  			UN_A3: "170",
  			WB_A2: "CO",
  			WB_A3: "COL",
  			WOE_ID: 23424787,
  			WOE_ID_EH: 23424787,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "COL",
  			ADM0_A3_US: "COL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2,
  			MAX_LABEL: 7,
  			NE_ID: 1159320517,
  			WIKIDATAID: "Q739",
  			NAME_AR: "كولومبيا",
  			NAME_BN: "কলম্বিয়া",
  			NAME_DE: "Kolumbien",
  			NAME_EN: "Colombia",
  			NAME_ES: "Colombia",
  			NAME_FR: "Colombie",
  			NAME_EL: "Κολομβία",
  			NAME_HI: "कोलम्बिया",
  			NAME_HU: "Kolumbia",
  			NAME_ID: "Kolombia",
  			NAME_IT: "Colombia",
  			NAME_JA: "コロンビア",
  			NAME_KO: "콜롬비아",
  			NAME_NL: "Colombia",
  			NAME_PL: "Kolumbia",
  			NAME_PT: "Colômbia",
  			NAME_RU: "Колумбия",
  			NAME_SV: "Colombia",
  			NAME_TR: "Kolombiya",
  			NAME_VI: "Colombia",
  			NAME_ZH: "哥伦比亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-77.35336076527386,
  						8.67050466555807
  					],
  					[
  						-77.24256649444008,
  						7.935278225125444
  					],
  					[
  						-77.88157141794525,
  						7.223771267114785
  					],
  					[
  						-78.62212053090394,
  						8.718124497915028
  					],
  					[
  						-79.12030717641375,
  						8.996092027213024
  					],
  					[
  						-80.4806892564973,
  						8.09030752200107
  					],
  					[
  						-80.8864009264208,
  						7.220541490096537
  					],
  					[
  						-81.72131120474447,
  						8.108962714058435
  					],
  					[
  						-82.96578304719736,
  						8.225027980985985
  					],
  					[
  						-82.54619625520348,
  						9.566134751824677
  					],
  					[
  						-81.43928707551154,
  						8.786234035675719
  					],
  					[
  						-79.57330278188431,
  						9.611610012241528
  					],
  					[
  						-78.05592770049802,
  						9.2477304142583
  					],
  					[
  						-77.35336076527386,
  						8.67050466555807
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Panama",
  			SOV_A3: "PAN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Panama",
  			ADM0_A3: "PAN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Panama",
  			GU_A3: "PAN",
  			SU_DIF: 0,
  			SUBUNIT: "Panama",
  			SU_A3: "PAN",
  			BRK_DIFF: 0,
  			NAME: "Panama",
  			NAME_LONG: "Panama",
  			BRK_A3: "PAN",
  			BRK_NAME: "Panama",
  			BRK_GROUP: "",
  			ABBREV: "Pan.",
  			POSTAL: "PA",
  			FORMAL_EN: "Republic of Panama",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Panama",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Panama",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 3,
  			POP_EST: 3753142,
  			POP_RANK: 12,
  			GDP_MD_EST: 93120,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "PM",
  			ISO_A2: "PA",
  			ISO_A3: "PAN",
  			ISO_A3_EH: "PAN",
  			ISO_N3: "591",
  			UN_A3: "591",
  			WB_A2: "PA",
  			WB_A3: "PAN",
  			WOE_ID: 23424924,
  			WOE_ID_EH: 23424924,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "PAN",
  			ADM0_A3_US: "PAN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Central America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321161,
  			WIKIDATAID: "Q804",
  			NAME_AR: "بنما",
  			NAME_BN: "পানামা",
  			NAME_DE: "Panama",
  			NAME_EN: "Panama",
  			NAME_ES: "Panamá",
  			NAME_FR: "Panama",
  			NAME_EL: "Παναμάς",
  			NAME_HI: "पनामा",
  			NAME_HU: "Panama",
  			NAME_ID: "Panama",
  			NAME_IT: "Panama",
  			NAME_JA: "パナマ",
  			NAME_KO: "파나마",
  			NAME_NL: "Panama",
  			NAME_PL: "Panama",
  			NAME_PT: "Panamá",
  			NAME_RU: "Панама",
  			NAME_SV: "Panama",
  			NAME_TR: "Panama",
  			NAME_VI: "Panama",
  			NAME_ZH: "巴拿马"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-82.54619625520348,
  						9.566134751824677
  					],
  					[
  						-82.96578304719736,
  						8.225027980985985
  					],
  					[
  						-83.63264156770784,
  						9.051385809765321
  					],
  					[
  						-85.79744483106285,
  						10.134885565629034
  					],
  					[
  						-85.7125404528073,
  						11.088444932494824
  					],
  					[
  						-83.65561174186158,
  						10.938764146361422
  					],
  					[
  						-82.54619625520348,
  						9.566134751824677
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Costa Rica",
  			SOV_A3: "CRI",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Costa Rica",
  			ADM0_A3: "CRI",
  			GEOU_DIF: 0,
  			GEOUNIT: "Costa Rica",
  			GU_A3: "CRI",
  			SU_DIF: 0,
  			SUBUNIT: "Costa Rica",
  			SU_A3: "CRI",
  			BRK_DIFF: 0,
  			NAME: "Costa Rica",
  			NAME_LONG: "Costa Rica",
  			BRK_A3: "CRI",
  			BRK_NAME: "Costa Rica",
  			BRK_GROUP: "",
  			ABBREV: "C.R.",
  			POSTAL: "CR",
  			FORMAL_EN: "Republic of Costa Rica",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Costa Rica",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Costa Rica",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 2,
  			POP_EST: 4930258,
  			POP_RANK: 12,
  			GDP_MD_EST: 79260,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CS",
  			ISO_A2: "CR",
  			ISO_A3: "CRI",
  			ISO_A3_EH: "CRI",
  			ISO_N3: "188",
  			UN_A3: "188",
  			WB_A2: "CR",
  			WB_A3: "CRI",
  			WOE_ID: 23424791,
  			WOE_ID_EH: 23424791,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "CRI",
  			ADM0_A3_US: "CRI",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Central America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320525,
  			WIKIDATAID: "Q800",
  			NAME_AR: "كوستاريكا",
  			NAME_BN: "কোস্টা রিকা",
  			NAME_DE: "Costa Rica",
  			NAME_EN: "Costa Rica",
  			NAME_ES: "Costa Rica",
  			NAME_FR: "Costa Rica",
  			NAME_EL: "Κόστα Ρίκα",
  			NAME_HI: "कोस्टा रीका",
  			NAME_HU: "Costa Rica",
  			NAME_ID: "Kosta Rika",
  			NAME_IT: "Costa Rica",
  			NAME_JA: "コスタリカ",
  			NAME_KO: "코스타리카",
  			NAME_NL: "Costa Rica",
  			NAME_PL: "Kostaryka",
  			NAME_PT: "Costa Rica",
  			NAME_RU: "Коста-Рика",
  			NAME_SV: "Costa Rica",
  			NAME_TR: "Kosta Rika",
  			NAME_VI: "Costa Rica",
  			NAME_ZH: "哥斯达黎加"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-83.65561174186158,
  						10.938764146361422
  					],
  					[
  						-85.7125404528073,
  						11.088444932494824
  					],
  					[
  						-86.52584998243296,
  						11.806876532432597
  					],
  					[
  						-87.31665442579549,
  						12.984685777228975
  					],
  					[
  						-86.75508663607971,
  						13.754845485890913
  					],
  					[
  						-85.80129472526859,
  						13.83605499923759
  					],
  					[
  						-84.9245006985724,
  						14.79049286545235
  					],
  					[
  						-83.14721900097413,
  						14.99582916916411
  					],
  					[
  						-83.55220720084554,
  						13.127054348193086
  					],
  					[
  						-83.65561174186158,
  						10.938764146361422
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Nicaragua",
  			SOV_A3: "NIC",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Nicaragua",
  			ADM0_A3: "NIC",
  			GEOU_DIF: 0,
  			GEOUNIT: "Nicaragua",
  			GU_A3: "NIC",
  			SU_DIF: 0,
  			SUBUNIT: "Nicaragua",
  			SU_A3: "NIC",
  			BRK_DIFF: 0,
  			NAME: "Nicaragua",
  			NAME_LONG: "Nicaragua",
  			BRK_A3: "NIC",
  			BRK_NAME: "Nicaragua",
  			BRK_GROUP: "",
  			ABBREV: "Nic.",
  			POSTAL: "NI",
  			FORMAL_EN: "Republic of Nicaragua",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Nicaragua",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Nicaragua",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 9,
  			POP_EST: 6025951,
  			POP_RANK: 13,
  			GDP_MD_EST: 33550,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2005,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "NU",
  			ISO_A2: "NI",
  			ISO_A3: "NIC",
  			ISO_A3_EH: "NIC",
  			ISO_N3: "558",
  			UN_A3: "558",
  			WB_A2: "NI",
  			WB_A3: "NIC",
  			WOE_ID: 23424915,
  			WOE_ID_EH: 23424915,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "NIC",
  			ADM0_A3_US: "NIC",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Central America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 9,
  			LONG_LEN: 9,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321091,
  			WIKIDATAID: "Q811",
  			NAME_AR: "نيكاراغوا",
  			NAME_BN: "নিকারাগুয়া",
  			NAME_DE: "Nicaragua",
  			NAME_EN: "Nicaragua",
  			NAME_ES: "Nicaragua",
  			NAME_FR: "Nicaragua",
  			NAME_EL: "Νικαράγουα",
  			NAME_HI: "निकारागुआ",
  			NAME_HU: "Nicaragua",
  			NAME_ID: "Nikaragua",
  			NAME_IT: "Nicaragua",
  			NAME_JA: "ニカラグア",
  			NAME_KO: "니카라과",
  			NAME_NL: "Nicaragua",
  			NAME_PL: "Nikaragua",
  			NAME_PT: "Nicarágua",
  			NAME_RU: "Никарагуа",
  			NAME_SV: "Nicaragua",
  			NAME_TR: "Nikaragua",
  			NAME_VI: "Nicaragua",
  			NAME_ZH: "尼加拉瓜"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-83.14721900097413,
  						14.99582916916411
  					],
  					[
  						-84.9245006985724,
  						14.79049286545235
  					],
  					[
  						-85.80129472526859,
  						13.83605499923759
  					],
  					[
  						-86.75508663607971,
  						13.754845485890913
  					],
  					[
  						-87.31665442579549,
  						12.984685777228975
  					],
  					[
  						-87.79311113152657,
  						13.384480495655055
  					],
  					[
  						-87.7235029772294,
  						13.785050360565506
  					],
  					[
  						-89.35332597528281,
  						14.424132798719086
  					],
  					[
  						-89.15481096063357,
  						15.06641917567481
  					],
  					[
  						-88.22502275262202,
  						15.727722479713904
  					],
  					[
  						-86.00195431185784,
  						16.00540578863439
  					],
  					[
  						-84.36825558138258,
  						15.835157782448732
  					],
  					[
  						-83.14721900097413,
  						14.99582916916411
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Honduras",
  			SOV_A3: "HND",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Honduras",
  			ADM0_A3: "HND",
  			GEOU_DIF: 0,
  			GEOUNIT: "Honduras",
  			GU_A3: "HND",
  			SU_DIF: 0,
  			SUBUNIT: "Honduras",
  			SU_A3: "HND",
  			BRK_DIFF: 0,
  			NAME: "Honduras",
  			NAME_LONG: "Honduras",
  			BRK_A3: "HND",
  			BRK_NAME: "Honduras",
  			BRK_GROUP: "",
  			ABBREV: "Hond.",
  			POSTAL: "HN",
  			FORMAL_EN: "Republic of Honduras",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Honduras",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Honduras",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 5,
  			POP_EST: 9038741,
  			POP_RANK: 13,
  			GDP_MD_EST: 43190,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "HO",
  			ISO_A2: "HN",
  			ISO_A3: "HND",
  			ISO_A3_EH: "HND",
  			ISO_N3: "340",
  			UN_A3: "340",
  			WB_A2: "HN",
  			WB_A3: "HND",
  			WOE_ID: 23424841,
  			WOE_ID_EH: 23424841,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "HND",
  			ADM0_A3_US: "HND",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Central America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4.5,
  			MAX_LABEL: 9.5,
  			NE_ID: 1159320827,
  			WIKIDATAID: "Q783",
  			NAME_AR: "هندوراس",
  			NAME_BN: "হন্ডুরাস",
  			NAME_DE: "Honduras",
  			NAME_EN: "Honduras",
  			NAME_ES: "Honduras",
  			NAME_FR: "Honduras",
  			NAME_EL: "Ονδούρα",
  			NAME_HI: "हौण्डुरस",
  			NAME_HU: "Honduras",
  			NAME_ID: "Honduras",
  			NAME_IT: "Honduras",
  			NAME_JA: "ホンジュラス",
  			NAME_KO: "온두라스",
  			NAME_NL: "Honduras",
  			NAME_PL: "Honduras",
  			NAME_PT: "Honduras",
  			NAME_RU: "Гондурас",
  			NAME_SV: "Honduras",
  			NAME_TR: "Honduras",
  			NAME_VI: "Honduras",
  			NAME_ZH: "洪都拉斯"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-89.35332597528281,
  						14.424132798719086
  					],
  					[
  						-87.7235029772294,
  						13.785050360565506
  					],
  					[
  						-87.79311113152657,
  						13.384480495655055
  					],
  					[
  						-88.48330156121682,
  						13.163951320849492
  					],
  					[
  						-90.09555457229098,
  						13.735337632700734
  					],
  					[
  						-89.35332597528281,
  						14.424132798719086
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "El Salvador",
  			SOV_A3: "SLV",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "El Salvador",
  			ADM0_A3: "SLV",
  			GEOU_DIF: 0,
  			GEOUNIT: "El Salvador",
  			GU_A3: "SLV",
  			SU_DIF: 0,
  			SUBUNIT: "El Salvador",
  			SU_A3: "SLV",
  			BRK_DIFF: 0,
  			NAME: "El Salvador",
  			NAME_LONG: "El Salvador",
  			BRK_A3: "SLV",
  			BRK_NAME: "El Salvador",
  			BRK_GROUP: "",
  			ABBREV: "El. S.",
  			POSTAL: "SV",
  			FORMAL_EN: "Republic of El Salvador",
  			FORMAL_FR: "",
  			NAME_CIAWF: "El Salvador",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "El Salvador",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 8,
  			POP_EST: 6172011,
  			POP_RANK: 13,
  			GDP_MD_EST: 54790,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2007,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "ES",
  			ISO_A2: "SV",
  			ISO_A3: "SLV",
  			ISO_A3_EH: "SLV",
  			ISO_N3: "222",
  			UN_A3: "222",
  			WB_A2: "SV",
  			WB_A3: "SLV",
  			WOE_ID: 23424807,
  			WOE_ID_EH: 23424807,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SLV",
  			ADM0_A3_US: "SLV",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Central America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 11,
  			LONG_LEN: 11,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321253,
  			WIKIDATAID: "Q792",
  			NAME_AR: "السلفادور",
  			NAME_BN: "এল সালভাদোর",
  			NAME_DE: "El Salvador",
  			NAME_EN: "El Salvador",
  			NAME_ES: "El Salvador",
  			NAME_FR: "Salvador",
  			NAME_EL: "Ελ Σαλβαδόρ",
  			NAME_HI: "अल साल्वाडोर",
  			NAME_HU: "El Salvador",
  			NAME_ID: "El Salvador",
  			NAME_IT: "El Salvador",
  			NAME_JA: "エルサルバドル",
  			NAME_KO: "엘살바도르",
  			NAME_NL: "El Salvador",
  			NAME_PL: "Salwador",
  			NAME_PT: "El Salvador",
  			NAME_RU: "Сальвадор",
  			NAME_SV: "El Salvador",
  			NAME_TR: "El Salvador",
  			NAME_VI: "El Salvador",
  			NAME_ZH: "萨尔瓦多"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-92.22775000686983,
  						14.538828640190928
  					],
  					[
  						-91.74796017125595,
  						16.066564846251765
  					],
  					[
  						-90.46447262242266,
  						16.069562079324655
  					],
  					[
  						-91.00151994501596,
  						17.81759491624571
  					],
  					[
  						-89.14308041050333,
  						17.808318996649405
  					],
  					[
  						-88.93061275913527,
  						15.887273464415076
  					],
  					[
  						-88.22502275262202,
  						15.727722479713904
  					],
  					[
  						-89.15481096063357,
  						15.06641917567481
  					],
  					[
  						-89.35332597528281,
  						14.424132798719086
  					],
  					[
  						-90.09555457229098,
  						13.735337632700734
  					],
  					[
  						-91.23241024449605,
  						13.927832342987957
  					],
  					[
  						-92.22775000686983,
  						14.538828640190928
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Guatemala",
  			SOV_A3: "GTM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Guatemala",
  			ADM0_A3: "GTM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Guatemala",
  			GU_A3: "GTM",
  			SU_DIF: 0,
  			SUBUNIT: "Guatemala",
  			SU_A3: "GTM",
  			BRK_DIFF: 0,
  			NAME: "Guatemala",
  			NAME_LONG: "Guatemala",
  			BRK_A3: "GTM",
  			BRK_NAME: "Guatemala",
  			BRK_GROUP: "",
  			ABBREV: "Guat.",
  			POSTAL: "GT",
  			FORMAL_EN: "Republic of Guatemala",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Guatemala",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Guatemala",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 6,
  			POP_EST: 15460732,
  			POP_RANK: 14,
  			GDP_MD_EST: 131800,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GT",
  			ISO_A2: "GT",
  			ISO_A3: "GTM",
  			ISO_A3_EH: "GTM",
  			ISO_N3: "320",
  			UN_A3: "320",
  			WB_A2: "GT",
  			WB_A3: "GTM",
  			WOE_ID: 23424834,
  			WOE_ID_EH: 23424834,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GTM",
  			ADM0_A3_US: "GTM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Central America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 9,
  			LONG_LEN: 9,
  			ABBREV_LEN: 5,
  			TINY: 4,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320815,
  			WIKIDATAID: "Q774",
  			NAME_AR: "غواتيمالا",
  			NAME_BN: "গুয়াতেমালা",
  			NAME_DE: "Guatemala",
  			NAME_EN: "Guatemala",
  			NAME_ES: "Guatemala",
  			NAME_FR: "Guatemala",
  			NAME_EL: "Γουατεμάλα",
  			NAME_HI: "ग्वाटेमाला",
  			NAME_HU: "Guatemala",
  			NAME_ID: "Guatemala",
  			NAME_IT: "Guatemala",
  			NAME_JA: "グアテマラ",
  			NAME_KO: "과테말라",
  			NAME_NL: "Guatemala",
  			NAME_PL: "Gwatemala",
  			NAME_PT: "Guatemala",
  			NAME_RU: "Гватемала",
  			NAME_SV: "Guatemala",
  			NAME_TR: "Guatemala",
  			NAME_VI: "Guatemala",
  			NAME_ZH: "危地马拉"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-89.14308041050333,
  						17.808318996649405
  					],
  					[
  						-88.3000310940937,
  						18.4999822046599
  					],
  					[
  						-88.35542822951057,
  						16.530774237529627
  					],
  					[
  						-88.93061275913527,
  						15.887273464415076
  					],
  					[
  						-89.14308041050333,
  						17.808318996649405
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Belize",
  			SOV_A3: "BLZ",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Belize",
  			ADM0_A3: "BLZ",
  			GEOU_DIF: 0,
  			GEOUNIT: "Belize",
  			GU_A3: "BLZ",
  			SU_DIF: 0,
  			SUBUNIT: "Belize",
  			SU_A3: "BLZ",
  			BRK_DIFF: 0,
  			NAME: "Belize",
  			NAME_LONG: "Belize",
  			BRK_A3: "BLZ",
  			BRK_NAME: "Belize",
  			BRK_GROUP: "",
  			ABBREV: "Belize",
  			POSTAL: "BZ",
  			FORMAL_EN: "Belize",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Belize",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Belize",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 7,
  			POP_EST: 360346,
  			POP_RANK: 10,
  			GDP_MD_EST: 3088,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BH",
  			ISO_A2: "BZ",
  			ISO_A3: "BLZ",
  			ISO_A3_EH: "BLZ",
  			ISO_N3: "084",
  			UN_A3: "084",
  			WB_A2: "BZ",
  			WB_A3: "BLZ",
  			WOE_ID: 23424760,
  			WOE_ID_EH: 23424760,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BLZ",
  			ADM0_A3_US: "BLZ",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Central America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159320431,
  			WIKIDATAID: "Q242",
  			NAME_AR: "بليز",
  			NAME_BN: "বেলিজ",
  			NAME_DE: "Belize",
  			NAME_EN: "Belize",
  			NAME_ES: "Belice",
  			NAME_FR: "Belize",
  			NAME_EL: "Μπελίζε",
  			NAME_HI: "बेलीज़",
  			NAME_HU: "Belize",
  			NAME_ID: "Belize",
  			NAME_IT: "Belize",
  			NAME_JA: "ベリーズ",
  			NAME_KO: "벨리즈",
  			NAME_NL: "Belize",
  			NAME_PL: "Belize",
  			NAME_PT: "Belize",
  			NAME_RU: "Белиз",
  			NAME_SV: "Belize",
  			NAME_TR: "Belize",
  			NAME_VI: "Belize",
  			NAME_ZH: "伯利兹"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-60.73357418480372,
  						5.200277207861901
  					],
  					[
  						-60.96689327660154,
  						4.536467596856639
  					],
  					[
  						-62.804533047116706,
  						4.006965033377952
  					],
  					[
  						-64.3684944322141,
  						3.797210394705246
  					],
  					[
  						-64.19930579289051,
  						1.49285492594602
  					],
  					[
  						-66.32576514348496,
  						0.7244522159820121
  					],
  					[
  						-66.87632585312258,
  						1.253360500489336
  					],
  					[
  						-67.30317318385345,
  						3.31845408773718
  					],
  					[
  						-67.82301225449355,
  						4.503937282728899
  					],
  					[
  						-67.34143958196557,
  						6.095468044454023
  					],
  					[
  						-69.38947994655712,
  						6.0998605411988365
  					],
  					[
  						-70.09331295437242,
  						6.96037649172311
  					],
  					[
  						-71.96017574734864,
  						6.991614895043539
  					],
  					[
  						-72.7887298245004,
  						9.085027167187334
  					],
  					[
  						-72.9052860175347,
  						10.450344346554772
  					],
  					[
  						-71.97392167833829,
  						11.60867157637712
  					],
  					[
  						-71.3315836249503,
  						11.776284084515808
  					],
  					[
  						-71.40062333849224,
  						10.968969021036015
  					],
  					[
  						-70.15529883490652,
  						11.37548167566004
  					],
  					[
  						-68.88299923366445,
  						11.443384507691563
  					],
  					[
  						-68.19412655299763,
  						10.554653225135922
  					],
  					[
  						-66.227864142508,
  						10.648626817258688
  					],
  					[
  						-64.89045223657817,
  						10.0772146671913
  					],
  					[
  						-64.31800655786495,
  						10.64141795495398
  					],
  					[
  						-62.73011898461641,
  						10.420268662960906
  					],
  					[
  						-60.83059668643172,
  						9.381339829948942
  					],
  					[
  						-60.67125240745973,
  						8.580174261911878
  					],
  					[
  						-59.758284878159195,
  						8.367034816924047
  					],
  					[
  						-60.5505879380582,
  						7.779602972846178
  					],
  					[
  						-60.2956680975624,
  						7.043911444522919
  					],
  					[
  						-61.15933631045648,
  						6.696077378766319
  					],
  					[
  						-61.410302903881956,
  						5.959068101419618
  					],
  					[
  						-60.73357418480372,
  						5.200277207861901
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Venezuela",
  			SOV_A3: "VEN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Venezuela",
  			ADM0_A3: "VEN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Venezuela",
  			GU_A3: "VEN",
  			SU_DIF: 0,
  			SUBUNIT: "Venezuela",
  			SU_A3: "VEN",
  			BRK_DIFF: 0,
  			NAME: "Venezuela",
  			NAME_LONG: "Venezuela",
  			BRK_A3: "VEN",
  			BRK_NAME: "Venezuela",
  			BRK_GROUP: "",
  			ABBREV: "Ven.",
  			POSTAL: "VE",
  			FORMAL_EN: "Bolivarian Republic of Venezuela",
  			FORMAL_FR: "República Bolivariana de Venezuela",
  			NAME_CIAWF: "Venezuela",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Venezuela, RB",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 4,
  			POP_EST: 31304016,
  			POP_RANK: 15,
  			GDP_MD_EST: 468600,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "VE",
  			ISO_A2: "VE",
  			ISO_A3: "VEN",
  			ISO_A3_EH: "VEN",
  			ISO_N3: "862",
  			UN_A3: "862",
  			WB_A2: "VE",
  			WB_A3: "VEN",
  			WOE_ID: 23424982,
  			WOE_ID_EH: 23424982,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "VEN",
  			ADM0_A3_US: "VEN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 9,
  			LONG_LEN: 9,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7.5,
  			NE_ID: 1159321411,
  			WIKIDATAID: "Q717",
  			NAME_AR: "فنزويلا",
  			NAME_BN: "ভেনেজুয়েলা",
  			NAME_DE: "Venezuela",
  			NAME_EN: "Venezuela",
  			NAME_ES: "Venezuela",
  			NAME_FR: "Venezuela",
  			NAME_EL: "Βενεζουέλα",
  			NAME_HI: "वेनेज़ुएला",
  			NAME_HU: "Venezuela",
  			NAME_ID: "Venezuela",
  			NAME_IT: "Venezuela",
  			NAME_JA: "ベネズエラ",
  			NAME_KO: "베네수엘라",
  			NAME_NL: "Venezuela",
  			NAME_PL: "Wenezuela",
  			NAME_PT: "Venezuela",
  			NAME_RU: "Венесуэла",
  			NAME_SV: "Venezuela",
  			NAME_TR: "Venezuela",
  			NAME_VI: "Venezuela",
  			NAME_ZH: "委內瑞拉"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-56.539385748914555,
  						1.8995226098669207
  					],
  					[
  						-59.03086157900265,
  						1.3176976586927225
  					],
  					[
  						-59.64604366722126,
  						1.786893825686789
  					],
  					[
  						-59.97452490908456,
  						2.755232652188056
  					],
  					[
  						-59.53803992373123,
  						3.9588025984819377
  					],
  					[
  						-60.73357418480372,
  						5.200277207861901
  					],
  					[
  						-61.410302903881956,
  						5.959068101419618
  					],
  					[
  						-61.15933631045648,
  						6.696077378766319
  					],
  					[
  						-60.2956680975624,
  						7.043911444522919
  					],
  					[
  						-60.5505879380582,
  						7.779602972846178
  					],
  					[
  						-59.758284878159195,
  						8.367034816924047
  					],
  					[
  						-59.10168412945866,
  						7.999201971870492
  					],
  					[
  						-57.14743648947689,
  						5.973149929219161
  					],
  					[
  						-57.307245856339506,
  						5.073566595882227
  					],
  					[
  						-58.04469438336068,
  						4.0608635522583825
  					],
  					[
  						-56.539385748914555,
  						1.8995226098669207
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Guyana",
  			SOV_A3: "GUY",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Guyana",
  			ADM0_A3: "GUY",
  			GEOU_DIF: 0,
  			GEOUNIT: "Guyana",
  			GU_A3: "GUY",
  			SU_DIF: 0,
  			SUBUNIT: "Guyana",
  			SU_A3: "GUY",
  			BRK_DIFF: 0,
  			NAME: "Guyana",
  			NAME_LONG: "Guyana",
  			BRK_A3: "GUY",
  			BRK_NAME: "Guyana",
  			BRK_GROUP: "",
  			ABBREV: "Guy.",
  			POSTAL: "GY",
  			FORMAL_EN: "Co-operative Republic of Guyana",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Guyana",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Guyana",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 8,
  			POP_EST: 737718,
  			POP_RANK: 11,
  			GDP_MD_EST: 6093,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GY",
  			ISO_A2: "GY",
  			ISO_A3: "GUY",
  			ISO_A3_EH: "GUY",
  			ISO_N3: "328",
  			UN_A3: "328",
  			WB_A2: "GY",
  			WB_A3: "GUY",
  			WOE_ID: 23424836,
  			WOE_ID_EH: 23424836,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GUY",
  			ADM0_A3_US: "GUY",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320817,
  			WIKIDATAID: "Q734",
  			NAME_AR: "غيانا",
  			NAME_BN: "গায়ানা",
  			NAME_DE: "Guyana",
  			NAME_EN: "Guyana",
  			NAME_ES: "Guyana",
  			NAME_FR: "Guyana",
  			NAME_EL: "Γουιάνα",
  			NAME_HI: "गयाना",
  			NAME_HU: "Guyana",
  			NAME_ID: "Guyana",
  			NAME_IT: "Guyana",
  			NAME_JA: "ガイアナ",
  			NAME_KO: "가이아나",
  			NAME_NL: "Guyana",
  			NAME_PL: "Gujana",
  			NAME_PT: "Guiana",
  			NAME_RU: "Гайана",
  			NAME_SV: "Guyana",
  			NAME_TR: "Guyana",
  			NAME_VI: "Guyana",
  			NAME_ZH: "圭亚那"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-54.524754197799716,
  						2.3118488631237852
  					],
  					[
  						-55.973322109589375,
  						2.510363877773017
  					],
  					[
  						-56.539385748914555,
  						1.8995226098669207
  					],
  					[
  						-58.04469438336068,
  						4.0608635522583825
  					],
  					[
  						-57.307245856339506,
  						5.073566595882227
  					],
  					[
  						-57.14743648947689,
  						5.973149929219161
  					],
  					[
  						-55.9493184067898,
  						5.772877915872002
  					],
  					[
  						-55.033250291551774,
  						6.025291449401664
  					],
  					[
  						-53.9580446030709,
  						5.756548163267765
  					],
  					[
  						-54.47863298197923,
  						4.896755682795586
  					],
  					[
  						-54.00693050801901,
  						3.6200377465925584
  					],
  					[
  						-54.524754197799716,
  						2.3118488631237852
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Suriname",
  			SOV_A3: "SUR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Suriname",
  			ADM0_A3: "SUR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Suriname",
  			GU_A3: "SUR",
  			SU_DIF: 0,
  			SUBUNIT: "Suriname",
  			SU_A3: "SUR",
  			BRK_DIFF: 0,
  			NAME: "Suriname",
  			NAME_LONG: "Suriname",
  			BRK_A3: "SUR",
  			BRK_NAME: "Suriname",
  			BRK_GROUP: "",
  			ABBREV: "Sur.",
  			POSTAL: "SR",
  			FORMAL_EN: "Republic of Suriname",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Suriname",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Suriname",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 6,
  			POP_EST: 591919,
  			POP_RANK: 11,
  			GDP_MD_EST: 8547,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "NS",
  			ISO_A2: "SR",
  			ISO_A3: "SUR",
  			ISO_A3_EH: "SUR",
  			ISO_N3: "740",
  			UN_A3: "740",
  			WB_A2: "SR",
  			WB_A3: "SUR",
  			WOE_ID: 23424913,
  			WOE_ID_EH: 23424913,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SUR",
  			ADM0_A3_US: "SUR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321281,
  			WIKIDATAID: "Q730",
  			NAME_AR: "سورينام",
  			NAME_BN: "সুরিনাম",
  			NAME_DE: "Suriname",
  			NAME_EN: "Suriname",
  			NAME_ES: "Surinam",
  			NAME_FR: "Suriname",
  			NAME_EL: "Σουρινάμ",
  			NAME_HI: "सूरीनाम",
  			NAME_HU: "Suriname",
  			NAME_ID: "Suriname",
  			NAME_IT: "Suriname",
  			NAME_JA: "スリナム",
  			NAME_KO: "수리남",
  			NAME_NL: "Suriname",
  			NAME_PL: "Surinam",
  			NAME_PT: "Suriname",
  			NAME_RU: "Суринам",
  			NAME_SV: "Surinam",
  			NAME_TR: "Surinam",
  			NAME_VI: "Suriname",
  			NAME_ZH: "蘇利南"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-75.37322323271385,
  						-0.1520317521204504
  					],
  					[
  						-75.54499569365204,
  						-1.5616097957458803
  					],
  					[
  						-76.63539425322672,
  						-2.6086776668438176
  					],
  					[
  						-77.83790483265861,
  						-3.003020521663103
  					],
  					[
  						-78.63989722361234,
  						-4.547784112164074
  					],
  					[
  						-80.44224199087216,
  						-4.425724379090674
  					],
  					[
  						-80.30256059438722,
  						-3.4048564591647126
  					],
  					[
  						-80.93365902375172,
  						-1.057454522306358
  					],
  					[
  						-80.58337032746127,
  						-0.9066626928786832
  					],
  					[
  						-80.09060970734211,
  						0.7684288598623965
  					],
  					[
  						-78.85525875518871,
  						1.380923773601822
  					],
  					[
  						-77.4249843004304,
  						0.395686753741117
  					],
  					[
  						-76.29231441924097,
  						0.4160472680641192
  					],
  					[
  						-75.37322323271385,
  						-0.1520317521204504
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Ecuador",
  			SOV_A3: "ECU",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Ecuador",
  			ADM0_A3: "ECU",
  			GEOU_DIF: 0,
  			GEOUNIT: "Ecuador",
  			GU_A3: "ECU",
  			SU_DIF: 0,
  			SUBUNIT: "Ecuador",
  			SU_A3: "ECU",
  			BRK_DIFF: 0,
  			NAME: "Ecuador",
  			NAME_LONG: "Ecuador",
  			BRK_A3: "ECU",
  			BRK_NAME: "Ecuador",
  			BRK_GROUP: "",
  			ABBREV: "Ecu.",
  			POSTAL: "EC",
  			FORMAL_EN: "Republic of Ecuador",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Ecuador",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Ecuador",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 12,
  			POP_EST: 16290913,
  			POP_RANK: 14,
  			GDP_MD_EST: 182400,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "EC",
  			ISO_A2: "EC",
  			ISO_A3: "ECU",
  			ISO_A3_EH: "ECU",
  			ISO_N3: "218",
  			UN_A3: "218",
  			WB_A2: "EC",
  			WB_A3: "ECU",
  			WOE_ID: 23424801,
  			WOE_ID_EH: 23424801,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ECU",
  			ADM0_A3_US: "ECU",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320567,
  			WIKIDATAID: "Q736",
  			NAME_AR: "الإكوادور",
  			NAME_BN: "ইকুয়েডর",
  			NAME_DE: "Ecuador",
  			NAME_EN: "Ecuador",
  			NAME_ES: "Ecuador",
  			NAME_FR: "Équateur",
  			NAME_EL: "Εκουαδόρ",
  			NAME_HI: "ईक्वाडोर",
  			NAME_HU: "Ecuador",
  			NAME_ID: "Ekuador",
  			NAME_IT: "Ecuador",
  			NAME_JA: "エクアドル",
  			NAME_KO: "에콰도르",
  			NAME_NL: "Ecuador",
  			NAME_PL: "Ekwador",
  			NAME_PT: "Equador",
  			NAME_RU: "Эквадор",
  			NAME_SV: "Ecuador",
  			NAME_TR: "Ekvador",
  			NAME_VI: "Ecuador",
  			NAME_ZH: "厄瓜多尔"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-82.26815121125706,
  						23.188610744717707
  					],
  					[
  						-80.6187686835812,
  						23.105980129483
  					],
  					[
  						-79.28148596873208,
  						22.399201565027056
  					],
  					[
  						-78.34743445505649,
  						22.512166246017088
  					],
  					[
  						-76.52382483590856,
  						21.206819566324373
  					],
  					[
  						-74.17802486845126,
  						20.28462779385974
  					],
  					[
  						-75.63468014189459,
  						19.873774318923196
  					],
  					[
  						-77.75548092315307,
  						19.855480861891877
  					],
  					[
  						-78.71986650258401,
  						21.598113511638434
  					],
  					[
  						-81.82094336620318,
  						22.19205658618507
  					],
  					[
  						-82.26815121125706,
  						23.188610744717707
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Cuba",
  			SOV_A3: "CUB",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Cuba",
  			ADM0_A3: "CUB",
  			GEOU_DIF: 0,
  			GEOUNIT: "Cuba",
  			GU_A3: "CUB",
  			SU_DIF: 0,
  			SUBUNIT: "Cuba",
  			SU_A3: "CUB",
  			BRK_DIFF: 0,
  			NAME: "Cuba",
  			NAME_LONG: "Cuba",
  			BRK_A3: "CUB",
  			BRK_NAME: "Cuba",
  			BRK_GROUP: "",
  			ABBREV: "Cuba",
  			POSTAL: "CU",
  			FORMAL_EN: "Republic of Cuba",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Cuba",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Cuba",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 4,
  			POP_EST: 11147407,
  			POP_RANK: 14,
  			GDP_MD_EST: 132900,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CU",
  			ISO_A2: "CU",
  			ISO_A3: "CUB",
  			ISO_A3_EH: "CUB",
  			ISO_N3: "192",
  			UN_A3: "192",
  			WB_A2: "CU",
  			WB_A3: "CUB",
  			WOE_ID: 23424793,
  			WOE_ID_EH: 23424793,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "CUB",
  			ADM0_A3_US: "CUB",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "North America",
  			REGION_UN: "Americas",
  			SUBREGION: "Caribbean",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 4,
  			LONG_LEN: 4,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320527,
  			WIKIDATAID: "Q241",
  			NAME_AR: "كوبا",
  			NAME_BN: "কিউবা",
  			NAME_DE: "Kuba",
  			NAME_EN: "Cuba",
  			NAME_ES: "Cuba",
  			NAME_FR: "Cuba",
  			NAME_EL: "Κούβα",
  			NAME_HI: "क्यूबा",
  			NAME_HU: "Kuba",
  			NAME_ID: "Kuba",
  			NAME_IT: "Cuba",
  			NAME_JA: "キューバ",
  			NAME_KO: "쿠바",
  			NAME_NL: "Cuba",
  			NAME_PL: "Kuba",
  			NAME_PT: "Cuba",
  			NAME_RU: "Куба",
  			NAME_SV: "Kuba",
  			NAME_TR: "Küba",
  			NAME_VI: "Cuba",
  			NAME_ZH: "古巴"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						31.19140913262129,
  						-22.2515096981724
  					],
  					[
  						29.43218834810904,
  						-22.091312758067588
  					],
  					[
  						28.021370070108617,
  						-21.485975030200585
  					],
  					[
  						27.296504754350508,
  						-20.391519870691
  					],
  					[
  						26.164790887158485,
  						-19.29308562589494
  					],
  					[
  						25.264225701608012,
  						-17.736539808831417
  					],
  					[
  						27.044427117630732,
  						-17.938026218337434
  					],
  					[
  						29.516834344203147,
  						-15.644677829656388
  					],
  					[
  						30.27425581230511,
  						-15.507786960515213
  					],
  					[
  						32.847638787575846,
  						-16.713398125884616
  					],
  					[
  						32.772707960752626,
  						-19.715592136313298
  					],
  					[
  						32.244988234188014,
  						-21.116488539313693
  					],
  					[
  						31.19140913262129,
  						-22.2515096981724
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Zimbabwe",
  			SOV_A3: "ZWE",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Zimbabwe",
  			ADM0_A3: "ZWE",
  			GEOU_DIF: 0,
  			GEOUNIT: "Zimbabwe",
  			GU_A3: "ZWE",
  			SU_DIF: 0,
  			SUBUNIT: "Zimbabwe",
  			SU_A3: "ZWE",
  			BRK_DIFF: 0,
  			NAME: "Zimbabwe",
  			NAME_LONG: "Zimbabwe",
  			BRK_A3: "ZWE",
  			BRK_NAME: "Zimbabwe",
  			BRK_GROUP: "",
  			ABBREV: "Zimb.",
  			POSTAL: "ZW",
  			FORMAL_EN: "Republic of Zimbabwe",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Zimbabwe",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Zimbabwe",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 9,
  			POP_EST: 13805084,
  			POP_RANK: 14,
  			GDP_MD_EST: 28330,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "ZI",
  			ISO_A2: "ZW",
  			ISO_A3: "ZWE",
  			ISO_A3_EH: "ZWE",
  			ISO_N3: "716",
  			UN_A3: "716",
  			WB_A2: "ZW",
  			WB_A3: "ZWE",
  			WOE_ID: 23425004,
  			WOE_ID_EH: 23425004,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ZWE",
  			ADM0_A3_US: "ZWE",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321441,
  			WIKIDATAID: "Q954",
  			NAME_AR: "زيمبابوي",
  			NAME_BN: "জিম্বাবুয়ে",
  			NAME_DE: "Simbabwe",
  			NAME_EN: "Zimbabwe",
  			NAME_ES: "Zimbabue",
  			NAME_FR: "Zimbabwe",
  			NAME_EL: "Ζιμπάμπουε",
  			NAME_HI: "ज़िम्बाब्वे",
  			NAME_HU: "Zimbabwe",
  			NAME_ID: "Zimbabwe",
  			NAME_IT: "Zimbabwe",
  			NAME_JA: "ジンバブエ",
  			NAME_KO: "짐바브웨",
  			NAME_NL: "Zimbabwe",
  			NAME_PL: "Zimbabwe",
  			NAME_PT: "Zimbábue",
  			NAME_RU: "Зимбабве",
  			NAME_SV: "Zimbabwe",
  			NAME_TR: "Zimbabve",
  			NAME_VI: "Zimbabwe",
  			NAME_ZH: "辛巴威"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						29.43218834810904,
  						-22.091312758067588
  					],
  					[
  						27.119409620886245,
  						-23.574323011979775
  					],
  					[
  						25.66466637543772,
  						-25.486816094669713
  					],
  					[
  						24.211266717228796,
  						-25.670215752873574
  					],
  					[
  						23.312096795350186,
  						-25.26868987396572
  					],
  					[
  						21.605896030369394,
  						-26.726533705351756
  					],
  					[
  						19.895767856534434,
  						-24.76779021576059
  					],
  					[
  						19.89545779794068,
  						-21.84915699634787
  					],
  					[
  						20.88113406747587,
  						-21.814327080983148
  					],
  					[
  						20.910641310314535,
  						-18.252218926672022
  					],
  					[
  						23.1968583513393,
  						-17.869038181227786
  					],
  					[
  						23.579005568137717,
  						-18.28126108162006
  					],
  					[
  						25.08444339366457,
  						-17.661815687737374
  					],
  					[
  						25.264225701608012,
  						-17.736539808831417
  					],
  					[
  						26.164790887158485,
  						-19.29308562589494
  					],
  					[
  						27.296504754350508,
  						-20.391519870691
  					],
  					[
  						28.021370070108617,
  						-21.485975030200585
  					],
  					[
  						29.43218834810904,
  						-22.091312758067588
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Botswana",
  			SOV_A3: "BWA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Botswana",
  			ADM0_A3: "BWA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Botswana",
  			GU_A3: "BWA",
  			SU_DIF: 0,
  			SUBUNIT: "Botswana",
  			SU_A3: "BWA",
  			BRK_DIFF: 0,
  			NAME: "Botswana",
  			NAME_LONG: "Botswana",
  			BRK_A3: "BWA",
  			BRK_NAME: "Botswana",
  			BRK_GROUP: "",
  			ABBREV: "Bwa.",
  			POSTAL: "BW",
  			FORMAL_EN: "Republic of Botswana",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Botswana",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Botswana",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 3,
  			POP_EST: 2214858,
  			POP_RANK: 12,
  			GDP_MD_EST: 35900,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BC",
  			ISO_A2: "BW",
  			ISO_A3: "BWA",
  			ISO_A3_EH: "BWA",
  			ISO_N3: "072",
  			UN_A3: "072",
  			WB_A2: "BW",
  			WB_A3: "BWA",
  			WOE_ID: 23424755,
  			WOE_ID_EH: 23424755,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BWA",
  			ADM0_A3_US: "BWA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Southern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320461,
  			WIKIDATAID: "Q963",
  			NAME_AR: "بوتسوانا",
  			NAME_BN: "বতসোয়ানা",
  			NAME_DE: "Botswana",
  			NAME_EN: "Botswana",
  			NAME_ES: "Botsuana",
  			NAME_FR: "Botswana",
  			NAME_EL: "Μποτσουάνα",
  			NAME_HI: "बोत्सवाना",
  			NAME_HU: "Botswana",
  			NAME_ID: "Botswana",
  			NAME_IT: "Botswana",
  			NAME_JA: "ボツワナ",
  			NAME_KO: "보츠와나",
  			NAME_NL: "Botswana",
  			NAME_PL: "Botswana",
  			NAME_PT: "Botsuana",
  			NAME_RU: "Ботсвана",
  			NAME_SV: "Botswana",
  			NAME_TR: "Botsvana",
  			NAME_VI: "Botswana",
  			NAME_ZH: "波札那"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						19.895767856534434,
  						-24.76779021576059
  					],
  					[
  						19.894734327888614,
  						-28.461104831660776
  					],
  					[
  						18.464899122804752,
  						-29.04546192801728
  					],
  					[
  						16.344976840895242,
  						-28.5767050106977
  					],
  					[
  						15.21047244635946,
  						-27.090955905874047
  					],
  					[
  						14.408144158595833,
  						-23.853014011329847
  					],
  					[
  						14.257714064194175,
  						-22.111208184499958
  					],
  					[
  						13.35249799973744,
  						-20.872834161057504
  					],
  					[
  						12.608564080463621,
  						-19.0453488094877
  					],
  					[
  						11.794918654028066,
  						-18.069129327061916
  					],
  					[
  						11.734198846085121,
  						-17.301889336824473
  					],
  					[
  						12.814081251688407,
  						-16.94134286872407
  					],
  					[
  						14.209706658595024,
  						-17.35310068122572
  					],
  					[
  						18.263309360434164,
  						-17.309950860262006
  					],
  					[
  						18.956186964603603,
  						-17.789094740472258
  					],
  					[
  						21.377176141045567,
  						-17.930636488519696
  					],
  					[
  						23.215048455506064,
  						-17.523116143465984
  					],
  					[
  						24.033861525170778,
  						-17.295843194246324
  					],
  					[
  						25.08444339366457,
  						-17.661815687737374
  					],
  					[
  						23.579005568137717,
  						-18.28126108162006
  					],
  					[
  						23.1968583513393,
  						-17.869038181227786
  					],
  					[
  						20.910641310314535,
  						-18.252218926672022
  					],
  					[
  						20.88113406747587,
  						-21.814327080983148
  					],
  					[
  						19.89545779794068,
  						-21.84915699634787
  					],
  					[
  						19.895767856534434,
  						-24.76779021576059
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Namibia",
  			SOV_A3: "NAM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Namibia",
  			ADM0_A3: "NAM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Namibia",
  			GU_A3: "NAM",
  			SU_DIF: 0,
  			SUBUNIT: "Namibia",
  			SU_A3: "NAM",
  			BRK_DIFF: 0,
  			NAME: "Namibia",
  			NAME_LONG: "Namibia",
  			BRK_A3: "NAM",
  			BRK_NAME: "Namibia",
  			BRK_GROUP: "",
  			ABBREV: "Nam.",
  			POSTAL: "NA",
  			FORMAL_EN: "Republic of Namibia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Namibia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Namibia",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 7,
  			POP_EST: 2484780,
  			POP_RANK: 12,
  			GDP_MD_EST: 25990,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "WA",
  			ISO_A2: "NA",
  			ISO_A3: "NAM",
  			ISO_A3_EH: "NAM",
  			ISO_N3: "516",
  			UN_A3: "516",
  			WB_A2: "NA",
  			WB_A3: "NAM",
  			WOE_ID: 23424987,
  			WOE_ID_EH: 23424987,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "NAM",
  			ADM0_A3_US: "NAM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Southern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7.5,
  			NE_ID: 1159321085,
  			WIKIDATAID: "Q1030",
  			NAME_AR: "ناميبيا",
  			NAME_BN: "নামিবিয়া",
  			NAME_DE: "Namibia",
  			NAME_EN: "Namibia",
  			NAME_ES: "Namibia",
  			NAME_FR: "Namibie",
  			NAME_EL: "Ναμίμπια",
  			NAME_HI: "नामीबिया",
  			NAME_HU: "Namíbia",
  			NAME_ID: "Namibia",
  			NAME_IT: "Namibia",
  			NAME_JA: "ナミビア",
  			NAME_KO: "나미비아",
  			NAME_NL: "Namibië",
  			NAME_PL: "Namibia",
  			NAME_PT: "Namíbia",
  			NAME_RU: "Намибия",
  			NAME_SV: "Namibia",
  			NAME_TR: "Namibya",
  			NAME_VI: "Namibia",
  			NAME_ZH: "纳米比亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-16.71372880702347,
  						13.594958604379855
  					],
  					[
  						-17.18517289882223,
  						14.919477240452862
  					],
  					[
  						-16.463098110407884,
  						16.13503611903846
  					],
  					[
  						-14.577347581428981,
  						16.59826365810281
  					],
  					[
  						-13.435737677453062,
  						16.03938304286619
  					],
  					[
  						-12.170750291380301,
  						14.616834214735505
  					],
  					[
  						-11.51394283695059,
  						12.442987575729418
  					],
  					[
  						-13.700476040084325,
  						12.586182969610194
  					],
  					[
  						-15.54847693527401,
  						12.628170070847347
  					],
  					[
  						-16.677451951554573,
  						12.384851589401052
  					],
  					[
  						-16.841524624081273,
  						13.15139394780256
  					],
  					[
  						-16.71372880702347,
  						13.594958604379855
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Senegal",
  			SOV_A3: "SEN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Senegal",
  			ADM0_A3: "SEN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Senegal",
  			GU_A3: "SEN",
  			SU_DIF: 0,
  			SUBUNIT: "Senegal",
  			SU_A3: "SEN",
  			BRK_DIFF: 0,
  			NAME: "Senegal",
  			NAME_LONG: "Senegal",
  			BRK_A3: "SEN",
  			BRK_NAME: "Senegal",
  			BRK_GROUP: "",
  			ABBREV: "Sen.",
  			POSTAL: "SN",
  			FORMAL_EN: "Republic of Senegal",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Senegal",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Senegal",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 5,
  			POP_EST: 14668522,
  			POP_RANK: 14,
  			GDP_MD_EST: 39720,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SG",
  			ISO_A2: "SN",
  			ISO_A3: "SEN",
  			ISO_A3_EH: "SEN",
  			ISO_N3: "686",
  			UN_A3: "686",
  			WB_A2: "SN",
  			WB_A3: "SEN",
  			WOE_ID: 23424943,
  			WOE_ID_EH: 23424943,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SEN",
  			ADM0_A3_US: "SEN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321243,
  			WIKIDATAID: "Q1041",
  			NAME_AR: "السنغال",
  			NAME_BN: "সেনেগাল",
  			NAME_DE: "Senegal",
  			NAME_EN: "Senegal",
  			NAME_ES: "Senegal",
  			NAME_FR: "Sénégal",
  			NAME_EL: "Σενεγάλη",
  			NAME_HI: "सेनेगल",
  			NAME_HU: "Szenegál",
  			NAME_ID: "Senegal",
  			NAME_IT: "Senegal",
  			NAME_JA: "セネガル",
  			NAME_KO: "세네갈",
  			NAME_NL: "Senegal",
  			NAME_PL: "Senegal",
  			NAME_PT: "Senegal",
  			NAME_RU: "Сенегал",
  			NAME_SV: "Senegal",
  			NAME_TR: "Senegal",
  			NAME_VI: "Sénégal",
  			NAME_ZH: "塞内加尔"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-11.51394283695059,
  						12.442987575729418
  					],
  					[
  						-12.170750291380301,
  						14.616834214735505
  					],
  					[
  						-11.666078253617854,
  						15.388208319556298
  					],
  					[
  						-10.650791388379417,
  						15.132745876521426
  					],
  					[
  						-9.55023840985939,
  						15.486496893775438
  					],
  					[
  						-5.537744309908447,
  						15.501689764869257
  					],
  					[
  						-5.488522508150439,
  						16.325102037007966
  					],
  					[
  						-5.9711287093242476,
  						20.64083344164763
  					],
  					[
  						-6.453786586930335,
  						24.956590684503425
  					],
  					[
  						-4.923337368174231,
  						24.974574082941
  					],
  					[
  						-1.5500548974576134,
  						22.792665920497384
  					],
  					[
  						3.1466610042539003,
  						19.693578599521445
  					],
  					[
  						4.267419467800039,
  						19.155265204337
  					],
  					[
  						4.2702099951438015,
  						16.852227484601215
  					],
  					[
  						3.6382589046464773,
  						15.568119818580456
  					],
  					[
  						1.3855281917468576,
  						15.323561102759172
  					],
  					[
  						0.3748922054146817,
  						14.92890818934613
  					],
  					[
  						-0.5158544580003479,
  						15.116157741755728
  					],
  					[
  						-2.001035122068771,
  						14.559008287000893
  					],
  					[
  						-4.427166103523803,
  						12.542645575404295
  					],
  					[
  						-5.220941941743121,
  						11.713858954307227
  					],
  					[
  						-5.404341599946974,
  						10.370736802609146
  					],
  					[
  						-6.050452032892267,
  						10.096360785355444
  					],
  					[
  						-8.029943610048619,
  						10.206534939001713
  					],
  					[
  						-8.376304897484914,
  						11.393645941610629
  					],
  					[
  						-9.127473517279583,
  						12.308060411015333
  					],
  					[
  						-10.165213792348837,
  						11.844083563682744
  					],
  					[
  						-11.51394283695059,
  						12.442987575729418
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Mali",
  			SOV_A3: "MLI",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Mali",
  			ADM0_A3: "MLI",
  			GEOU_DIF: 0,
  			GEOUNIT: "Mali",
  			GU_A3: "MLI",
  			SU_DIF: 0,
  			SUBUNIT: "Mali",
  			SU_A3: "MLI",
  			BRK_DIFF: 0,
  			NAME: "Mali",
  			NAME_LONG: "Mali",
  			BRK_A3: "MLI",
  			BRK_NAME: "Mali",
  			BRK_GROUP: "",
  			ABBREV: "Mali",
  			POSTAL: "ML",
  			FORMAL_EN: "Republic of Mali",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Mali",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Mali",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 7,
  			POP_EST: 17885245,
  			POP_RANK: 14,
  			GDP_MD_EST: 38090,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "ML",
  			ISO_A2: "ML",
  			ISO_A3: "MLI",
  			ISO_A3_EH: "MLI",
  			ISO_N3: "466",
  			UN_A3: "466",
  			WB_A2: "ML",
  			WB_A3: "MLI",
  			WOE_ID: 23424891,
  			WOE_ID_EH: 23424891,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MLI",
  			ADM0_A3_US: "MLI",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 4,
  			LONG_LEN: 4,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159321063,
  			WIKIDATAID: "Q912",
  			NAME_AR: "مالي",
  			NAME_BN: "মালি",
  			NAME_DE: "Mali",
  			NAME_EN: "Mali",
  			NAME_ES: "Malí",
  			NAME_FR: "Mali",
  			NAME_EL: "Μάλι",
  			NAME_HI: "माली",
  			NAME_HU: "Mali",
  			NAME_ID: "Mali",
  			NAME_IT: "Mali",
  			NAME_JA: "マリ共和国",
  			NAME_KO: "말리",
  			NAME_NL: "Mali",
  			NAME_PL: "Mali",
  			NAME_PT: "Mali",
  			NAME_RU: "Мали",
  			NAME_SV: "Mali",
  			NAME_TR: "Mali",
  			NAME_VI: "Mali",
  			NAME_ZH: "马里共和国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-17.06342322434257,
  						20.999752102130827
  					],
  					[
  						-16.845193650773993,
  						21.33332347257488
  					],
  					[
  						-12.929101935263532,
  						21.327070624267563
  					],
  					[
  						-13.118754441774712,
  						22.771220201096256
  					],
  					[
  						-11.937224493853321,
  						23.374594224536168
  					],
  					[
  						-11.96941891117116,
  						25.933352769468268
  					],
  					[
  						-8.6872936670174,
  						25.881056219988906
  					],
  					[
  						-8.684399786809053,
  						27.395744126896005
  					],
  					[
  						-4.923337368174231,
  						24.974574082941
  					],
  					[
  						-6.453786586930335,
  						24.956590684503425
  					],
  					[
  						-5.9711287093242476,
  						20.64083344164763
  					],
  					[
  						-5.488522508150439,
  						16.325102037007966
  					],
  					[
  						-5.537744309908447,
  						15.501689764869257
  					],
  					[
  						-9.55023840985939,
  						15.486496893775438
  					],
  					[
  						-10.650791388379417,
  						15.132745876521426
  					],
  					[
  						-11.666078253617854,
  						15.388208319556298
  					],
  					[
  						-12.170750291380301,
  						14.616834214735505
  					],
  					[
  						-13.435737677453062,
  						16.03938304286619
  					],
  					[
  						-14.577347581428981,
  						16.59826365810281
  					],
  					[
  						-16.463098110407884,
  						16.13503611903846
  					],
  					[
  						-16.14634741867485,
  						18.108481553616656
  					],
  					[
  						-16.277838100641517,
  						20.0925206568147
  					],
  					[
  						-17.06342322434257,
  						20.999752102130827
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Mauritania",
  			SOV_A3: "MRT",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Mauritania",
  			ADM0_A3: "MRT",
  			GEOU_DIF: 0,
  			GEOUNIT: "Mauritania",
  			GU_A3: "MRT",
  			SU_DIF: 0,
  			SUBUNIT: "Mauritania",
  			SU_A3: "MRT",
  			BRK_DIFF: 0,
  			NAME: "Mauritania",
  			NAME_LONG: "Mauritania",
  			BRK_A3: "MRT",
  			BRK_NAME: "Mauritania",
  			BRK_GROUP: "",
  			ABBREV: "Mrt.",
  			POSTAL: "MR",
  			FORMAL_EN: "Islamic Republic of Mauritania",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Mauritania",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Mauritania",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 1,
  			POP_EST: 3758571,
  			POP_RANK: 12,
  			GDP_MD_EST: 16710,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2000,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MR",
  			ISO_A2: "MR",
  			ISO_A3: "MRT",
  			ISO_A3_EH: "MRT",
  			ISO_N3: "478",
  			UN_A3: "478",
  			WB_A2: "MR",
  			WB_A3: "MRT",
  			WOE_ID: 23424896,
  			WOE_ID_EH: 23424896,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MRT",
  			ADM0_A3_US: "MRT",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321075,
  			WIKIDATAID: "Q1025",
  			NAME_AR: "موريتانيا",
  			NAME_BN: "মৌরিতানিয়া",
  			NAME_DE: "Mauretanien",
  			NAME_EN: "Mauritania",
  			NAME_ES: "Mauritania",
  			NAME_FR: "Mauritanie",
  			NAME_EL: "Μαυριτανία",
  			NAME_HI: "मॉरीतानिया",
  			NAME_HU: "Mauritánia",
  			NAME_ID: "Mauritania",
  			NAME_IT: "Mauritania",
  			NAME_JA: "モーリタニア",
  			NAME_KO: "모리타니",
  			NAME_NL: "Mauritanië",
  			NAME_PL: "Mauretania",
  			NAME_PT: "Mauritânia",
  			NAME_RU: "Мавритания",
  			NAME_SV: "Mauretanien",
  			NAME_TR: "Moritanya",
  			NAME_VI: "Mauritanie",
  			NAME_ZH: "毛里塔尼亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						2.6917016943562544,
  						6.258817246928629
  					],
  					[
  						1.8652405127123188,
  						6.142157701029731
  					],
  					[
  						1.618950636409238,
  						6.832038072126238
  					],
  					[
  						1.664477573258381,
  						9.12859039960938
  					],
  					[
  						0.7723356461714843,
  						10.470808213742359
  					],
  					[
  						0.8995630224740694,
  						10.99733938236426
  					],
  					[
  						2.1544735042499212,
  						11.940150051313339
  					],
  					[
  						2.8486430192265857,
  						12.23563589115821
  					],
  					[
  						3.611180454125559,
  						11.660167141155968
  					],
  					[
  						3.7054382666259187,
  						10.063210354040208
  					],
  					[
  						2.723792758809509,
  						8.50684540448971
  					],
  					[
  						2.6917016943562544,
  						6.258817246928629
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Benin",
  			SOV_A3: "BEN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Benin",
  			ADM0_A3: "BEN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Benin",
  			GU_A3: "BEN",
  			SU_DIF: 0,
  			SUBUNIT: "Benin",
  			SU_A3: "BEN",
  			BRK_DIFF: 0,
  			NAME: "Benin",
  			NAME_LONG: "Benin",
  			BRK_A3: "BEN",
  			BRK_NAME: "Benin",
  			BRK_GROUP: "",
  			ABBREV: "Benin",
  			POSTAL: "BJ",
  			FORMAL_EN: "Republic of Benin",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Benin",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Benin",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 12,
  			POP_EST: 11038805,
  			POP_RANK: 14,
  			GDP_MD_EST: 24310,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BN",
  			ISO_A2: "BJ",
  			ISO_A3: "BEN",
  			ISO_A3_EH: "BEN",
  			ISO_N3: "204",
  			UN_A3: "204",
  			WB_A2: "BJ",
  			WB_A3: "BEN",
  			WOE_ID: 23424764,
  			WOE_ID_EH: 23424764,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BEN",
  			ADM0_A3_US: "BEN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320399,
  			WIKIDATAID: "Q962",
  			NAME_AR: "بنين",
  			NAME_BN: "বেনিন",
  			NAME_DE: "Benin",
  			NAME_EN: "Benin",
  			NAME_ES: "Benín",
  			NAME_FR: "Bénin",
  			NAME_EL: "Μπενίν",
  			NAME_HI: "बेनिन",
  			NAME_HU: "Benin",
  			NAME_ID: "Benin",
  			NAME_IT: "Benin",
  			NAME_JA: "ベナン",
  			NAME_KO: "베냉",
  			NAME_NL: "Benin",
  			NAME_PL: "Benin",
  			NAME_PT: "Benim",
  			NAME_RU: "Бенин",
  			NAME_SV: "Benin",
  			NAME_TR: "Benin",
  			NAME_VI: "Bénin",
  			NAME_ZH: "贝宁"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						14.851300000000037,
  						22.862950000000126
  					],
  					[
  						15.096887648181848,
  						21.30851878507491
  					],
  					[
  						15.903246697664315,
  						20.387618923417506
  					],
  					[
  						15.30044111497972,
  						17.927949937405003
  					],
  					[
  						15.247731154041844,
  						16.627305813050782
  					],
  					[
  						13.972170000000006,
  						15.684370000000058
  					],
  					[
  						13.540393507550789,
  						14.367133693901224
  					],
  					[
  						14.495787387762846,
  						12.85939626713733
  					],
  					[
  						14.181336297266794,
  						12.483656927943116
  					],
  					[
  						13.318701613018561,
  						13.556356309457826
  					],
  					[
  						12.302071160540523,
  						13.037189032437524
  					],
  					[
  						11.527803175511394,
  						13.328980007373588
  					],
  					[
  						10.114814487354693,
  						13.27725189864941
  					],
  					[
  						9.014933302454438,
  						12.826659247280418
  					],
  					[
  						7.804671258178786,
  						13.343526923063747
  					],
  					[
  						6.820441928747754,
  						13.115091254117518
  					],
  					[
  						5.443058302440136,
  						13.865923977102227
  					],
  					[
  						4.368343540066007,
  						13.747481594289411
  					],
  					[
  						3.6806335791258107,
  						12.552903347214226
  					],
  					[
  						3.611180454125559,
  						11.660167141155968
  					],
  					[
  						2.8486430192265857,
  						12.23563589115821
  					],
  					[
  						2.1544735042499212,
  						11.940150051313339
  					],
  					[
  						2.177107781593776,
  						12.625017808477535
  					],
  					[
  						1.0241032242974768,
  						12.851825669806574
  					],
  					[
  						0.429927605805517,
  						13.988733018443924
  					],
  					[
  						0.3748922054146817,
  						14.92890818934613
  					],
  					[
  						1.3855281917468576,
  						15.323561102759172
  					],
  					[
  						3.6382589046464773,
  						15.568119818580456
  					],
  					[
  						4.2702099951438015,
  						16.852227484601215
  					],
  					[
  						4.267419467800039,
  						19.155265204337
  					],
  					[
  						5.677565952180686,
  						19.601206976799716
  					],
  					[
  						8.572893100629784,
  						21.565660712159143
  					],
  					[
  						11.999505649471613,
  						23.47166840259645
  					],
  					[
  						14.851300000000037,
  						22.862950000000126
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Niger",
  			SOV_A3: "NER",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Niger",
  			ADM0_A3: "NER",
  			GEOU_DIF: 0,
  			GEOUNIT: "Niger",
  			GU_A3: "NER",
  			SU_DIF: 0,
  			SUBUNIT: "Niger",
  			SU_A3: "NER",
  			BRK_DIFF: 0,
  			NAME: "Niger",
  			NAME_LONG: "Niger",
  			BRK_A3: "NER",
  			BRK_NAME: "Niger",
  			BRK_GROUP: "",
  			ABBREV: "Niger",
  			POSTAL: "NE",
  			FORMAL_EN: "Republic of Niger",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Niger",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Niger",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 13,
  			POP_EST: 19245344,
  			POP_RANK: 14,
  			GDP_MD_EST: 20150,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "NG",
  			ISO_A2: "NE",
  			ISO_A3: "NER",
  			ISO_A3_EH: "NER",
  			ISO_N3: "562",
  			UN_A3: "562",
  			WB_A2: "NE",
  			WB_A3: "NER",
  			WOE_ID: 23424906,
  			WOE_ID_EH: 23424906,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "NER",
  			ADM0_A3_US: "NER",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321087,
  			WIKIDATAID: "Q1032",
  			NAME_AR: "النيجر",
  			NAME_BN: "নাইজার",
  			NAME_DE: "Niger",
  			NAME_EN: "Niger",
  			NAME_ES: "Níger",
  			NAME_FR: "Niger",
  			NAME_EL: "Νίγηρας",
  			NAME_HI: "नाइजर",
  			NAME_HU: "Niger",
  			NAME_ID: "Niger",
  			NAME_IT: "Niger",
  			NAME_JA: "ニジェール",
  			NAME_KO: "니제르",
  			NAME_NL: "Niger",
  			NAME_PL: "Niger",
  			NAME_PT: "Níger",
  			NAME_RU: "Нигер",
  			NAME_SV: "Niger",
  			NAME_TR: "Nijer",
  			NAME_VI: "Niger",
  			NAME_ZH: "尼日尔"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						2.6917016943562544,
  						6.258817246928629
  					],
  					[
  						2.723792758809509,
  						8.50684540448971
  					],
  					[
  						3.7054382666259187,
  						10.063210354040208
  					],
  					[
  						3.611180454125559,
  						11.660167141155968
  					],
  					[
  						3.6806335791258107,
  						12.552903347214226
  					],
  					[
  						4.368343540066007,
  						13.747481594289411
  					],
  					[
  						5.443058302440136,
  						13.865923977102227
  					],
  					[
  						6.820441928747754,
  						13.115091254117518
  					],
  					[
  						7.804671258178786,
  						13.343526923063747
  					],
  					[
  						9.014933302454438,
  						12.826659247280418
  					],
  					[
  						10.114814487354693,
  						13.27725189864941
  					],
  					[
  						11.527803175511394,
  						13.328980007373588
  					],
  					[
  						12.302071160540523,
  						13.037189032437524
  					],
  					[
  						13.318701613018561,
  						13.556356309457826
  					],
  					[
  						14.181336297266794,
  						12.483656927943116
  					],
  					[
  						14.415378859116684,
  						11.572368882692075
  					],
  					[
  						13.572949659894562,
  						10.798565985553566
  					],
  					[
  						12.753671502339216,
  						8.717762762888995
  					],
  					[
  						12.218872104550599,
  						8.305824082874324
  					],
  					[
  						11.74577436691851,
  						6.981382961449754
  					],
  					[
  						11.058787876030351,
  						6.6444267846905944
  					],
  					[
  						10.118276808318257,
  						7.03876963950988
  					],
  					[
  						9.233162876023044,
  						6.444490668153335
  					],
  					[
  						8.500287713259695,
  						4.7719829370268485
  					],
  					[
  						6.6980721370806,
  						4.240594183769517
  					],
  					[
  						5.898172641634687,
  						4.262453314628985
  					],
  					[
  						4.325607130560684,
  						6.2706511499234665
  					],
  					[
  						2.6917016943562544,
  						6.258817246928629
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Nigeria",
  			SOV_A3: "NGA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Nigeria",
  			ADM0_A3: "NGA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Nigeria",
  			GU_A3: "NGA",
  			SU_DIF: 0,
  			SUBUNIT: "Nigeria",
  			SU_A3: "NGA",
  			BRK_DIFF: 0,
  			NAME: "Nigeria",
  			NAME_LONG: "Nigeria",
  			BRK_A3: "NGA",
  			BRK_NAME: "Nigeria",
  			BRK_GROUP: "",
  			ABBREV: "Nigeria",
  			POSTAL: "NG",
  			FORMAL_EN: "Federal Republic of Nigeria",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Nigeria",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Nigeria",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 2,
  			POP_EST: 190632261,
  			POP_RANK: 17,
  			GDP_MD_EST: 1089000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2006,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "NI",
  			ISO_A2: "NG",
  			ISO_A3: "NGA",
  			ISO_A3_EH: "NGA",
  			ISO_N3: "566",
  			UN_A3: "566",
  			WB_A2: "NG",
  			WB_A3: "NGA",
  			WOE_ID: 23424908,
  			WOE_ID_EH: 23424908,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "NGA",
  			ADM0_A3_US: "NGA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 7,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 1.7,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159321089,
  			WIKIDATAID: "Q1033",
  			NAME_AR: "نيجيريا",
  			NAME_BN: "নাইজেরিয়া",
  			NAME_DE: "Nigeria",
  			NAME_EN: "Nigeria",
  			NAME_ES: "Nigeria",
  			NAME_FR: "Nigeria",
  			NAME_EL: "Νιγηρία",
  			NAME_HI: "नाईजीरिया",
  			NAME_HU: "Nigéria",
  			NAME_ID: "Nigeria",
  			NAME_IT: "Nigeria",
  			NAME_JA: "ナイジェリア",
  			NAME_KO: "나이지리아",
  			NAME_NL: "Nigeria",
  			NAME_PL: "Nigeria",
  			NAME_PT: "Nigéria",
  			NAME_RU: "Нигерия",
  			NAME_SV: "Nigeria",
  			NAME_TR: "Nijerya",
  			NAME_VI: "Nigeria",
  			NAME_ZH: "奈及利亞"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						14.495787387762846,
  						12.85939626713733
  					],
  					[
  						14.89336000000003,
  						12.219049999999982
  					],
  					[
  						14.92356489427496,
  						10.891325181517473
  					],
  					[
  						15.467872755605242,
  						9.982336737503545
  					],
  					[
  						14.171466098699028,
  						10.021378282099931
  					],
  					[
  						13.954218377344006,
  						9.549494940626687
  					],
  					[
  						14.97999555833769,
  						8.796104234243472
  					],
  					[
  						15.279460483469109,
  						7.421924546737969
  					],
  					[
  						14.536560092841114,
  						6.2269587264206905
  					],
  					[
  						14.47837243008047,
  						4.732605495620447
  					],
  					[
  						16.012852410555354,
  						2.267639675298085
  					],
  					[
  						15.940918816805066,
  						1.7276726342802957
  					],
  					[
  						14.33781253424658,
  						2.2278746606494906
  					],
  					[
  						13.075822381246752,
  						2.2670970727590145
  					],
  					[
  						11.276449008843713,
  						2.261050930180872
  					],
  					[
  						9.649158155972628,
  						2.2838660750377358
  					],
  					[
  						9.795195753629457,
  						3.073404445809117
  					],
  					[
  						8.500287713259695,
  						4.7719829370268485
  					],
  					[
  						9.233162876023044,
  						6.444490668153335
  					],
  					[
  						10.118276808318257,
  						7.03876963950988
  					],
  					[
  						11.058787876030351,
  						6.6444267846905944
  					],
  					[
  						11.74577436691851,
  						6.981382961449754
  					],
  					[
  						12.218872104550599,
  						8.305824082874324
  					],
  					[
  						12.753671502339216,
  						8.717762762888995
  					],
  					[
  						13.572949659894562,
  						10.798565985553566
  					],
  					[
  						14.415378859116684,
  						11.572368882692075
  					],
  					[
  						14.181336297266794,
  						12.483656927943116
  					],
  					[
  						14.495787387762846,
  						12.85939626713733
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Cameroon",
  			SOV_A3: "CMR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Cameroon",
  			ADM0_A3: "CMR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Cameroon",
  			GU_A3: "CMR",
  			SU_DIF: 0,
  			SUBUNIT: "Cameroon",
  			SU_A3: "CMR",
  			BRK_DIFF: 0,
  			NAME: "Cameroon",
  			NAME_LONG: "Cameroon",
  			BRK_A3: "CMR",
  			BRK_NAME: "Cameroon",
  			BRK_GROUP: "",
  			ABBREV: "Cam.",
  			POSTAL: "CM",
  			FORMAL_EN: "Republic of Cameroon",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Cameroon",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Cameroon",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 3,
  			POP_EST: 24994885,
  			POP_RANK: 15,
  			GDP_MD_EST: 77240,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2005,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CM",
  			ISO_A2: "CM",
  			ISO_A3: "CMR",
  			ISO_A3_EH: "CMR",
  			ISO_N3: "120",
  			UN_A3: "120",
  			WB_A2: "CM",
  			WB_A3: "CMR",
  			WOE_ID: 23424785,
  			WOE_ID_EH: 23424785,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "CMR",
  			ADM0_A3_US: "CMR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Middle Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320509,
  			WIKIDATAID: "Q1009",
  			NAME_AR: "الكاميرون",
  			NAME_BN: "ক্যামেরুন",
  			NAME_DE: "Kamerun",
  			NAME_EN: "Cameroon",
  			NAME_ES: "Camerún",
  			NAME_FR: "Cameroun",
  			NAME_EL: "Καμερούν",
  			NAME_HI: "कैमरुन",
  			NAME_HU: "Kamerun",
  			NAME_ID: "Kamerun",
  			NAME_IT: "Camerun",
  			NAME_JA: "カメルーン",
  			NAME_KO: "카메룬",
  			NAME_NL: "Kameroen",
  			NAME_PL: "Kamerun",
  			NAME_PT: "Camarões",
  			NAME_RU: "Камерун",
  			NAME_SV: "Kamerun",
  			NAME_TR: "Kamerun",
  			NAME_VI: "Cameroon",
  			NAME_ZH: "喀麦隆"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						0.8995630224740694,
  						10.99733938236426
  					],
  					[
  						0.7723356461714843,
  						10.470808213742359
  					],
  					[
  						1.664477573258381,
  						9.12859039960938
  					],
  					[
  						1.618950636409238,
  						6.832038072126238
  					],
  					[
  						1.8652405127123188,
  						6.142157701029731
  					],
  					[
  						1.0601216976049272,
  						5.928837388528876
  					],
  					[
  						0.4909574723422451,
  						7.411744289576475
  					],
  					[
  						0.3675799902453889,
  						10.19121287682718
  					],
  					[
  						0.023802524423700785,
  						11.018681748900804
  					],
  					[
  						0.8995630224740694,
  						10.99733938236426
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Togo",
  			SOV_A3: "TGO",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Togo",
  			ADM0_A3: "TGO",
  			GEOU_DIF: 0,
  			GEOUNIT: "Togo",
  			GU_A3: "TGO",
  			SU_DIF: 0,
  			SUBUNIT: "Togo",
  			SU_A3: "TGO",
  			BRK_DIFF: 0,
  			NAME: "Togo",
  			NAME_LONG: "Togo",
  			BRK_A3: "TGO",
  			BRK_NAME: "Togo",
  			BRK_GROUP: "",
  			ABBREV: "Togo",
  			POSTAL: "TG",
  			FORMAL_EN: "Togolese Republic",
  			FORMAL_FR: "République Togolaise",
  			NAME_CIAWF: "Togo",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Togo",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 5,
  			POP_EST: 7965055,
  			POP_RANK: 13,
  			GDP_MD_EST: 11610,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "TO",
  			ISO_A2: "TG",
  			ISO_A3: "TGO",
  			ISO_A3_EH: "TGO",
  			ISO_N3: "768",
  			UN_A3: "768",
  			WB_A2: "TG",
  			WB_A3: "TGO",
  			WOE_ID: 23424965,
  			WOE_ID_EH: 23424965,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "TGO",
  			ADM0_A3_US: "TGO",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 4,
  			LONG_LEN: 4,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321303,
  			WIKIDATAID: "Q945",
  			NAME_AR: "توغو",
  			NAME_BN: "টোগো",
  			NAME_DE: "Togo",
  			NAME_EN: "Togo",
  			NAME_ES: "Togo",
  			NAME_FR: "Togo",
  			NAME_EL: "Τόγκο",
  			NAME_HI: "टोगो",
  			NAME_HU: "Togo",
  			NAME_ID: "Togo",
  			NAME_IT: "Togo",
  			NAME_JA: "トーゴ",
  			NAME_KO: "토고",
  			NAME_NL: "Togo",
  			NAME_PL: "Togo",
  			NAME_PT: "Togo",
  			NAME_RU: "Того",
  			NAME_SV: "Togo",
  			NAME_TR: "Togo",
  			NAME_VI: "Togo",
  			NAME_ZH: "多哥"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						0.023802524423700785,
  						11.018681748900804
  					],
  					[
  						0.3675799902453889,
  						10.19121287682718
  					],
  					[
  						0.4909574723422451,
  						7.411744289576475
  					],
  					[
  						1.0601216976049272,
  						5.928837388528876
  					],
  					[
  						-1.9647065901675944,
  						4.710462144383371
  					],
  					[
  						-2.856125047202397,
  						4.994475816259509
  					],
  					[
  						-3.244370083011262,
  						6.250471503113502
  					],
  					[
  						-2.562189500326241,
  						8.219627793811483
  					],
  					[
  						-2.8274963037127065,
  						9.642460842319778
  					],
  					[
  						-2.9404093082704605,
  						10.962690334512558
  					],
  					[
  						0.023802524423700785,
  						11.018681748900804
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Ghana",
  			SOV_A3: "GHA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Ghana",
  			ADM0_A3: "GHA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Ghana",
  			GU_A3: "GHA",
  			SU_DIF: 0,
  			SUBUNIT: "Ghana",
  			SU_A3: "GHA",
  			BRK_DIFF: 0,
  			NAME: "Ghana",
  			NAME_LONG: "Ghana",
  			BRK_A3: "GHA",
  			BRK_NAME: "Ghana",
  			BRK_GROUP: "",
  			ABBREV: "Ghana",
  			POSTAL: "GH",
  			FORMAL_EN: "Republic of Ghana",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Ghana",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Ghana",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 4,
  			POP_EST: 27499924,
  			POP_RANK: 15,
  			GDP_MD_EST: 120800,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GH",
  			ISO_A2: "GH",
  			ISO_A3: "GHA",
  			ISO_A3_EH: "GHA",
  			ISO_N3: "288",
  			UN_A3: "288",
  			WB_A2: "GH",
  			WB_A3: "GHA",
  			WOE_ID: 23424824,
  			WOE_ID_EH: 23424824,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GHA",
  			ADM0_A3_US: "GHA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320793,
  			WIKIDATAID: "Q117",
  			NAME_AR: "غانا",
  			NAME_BN: "ঘানা",
  			NAME_DE: "Ghana",
  			NAME_EN: "Ghana",
  			NAME_ES: "Ghana",
  			NAME_FR: "Ghana",
  			NAME_EL: "Γκάνα",
  			NAME_HI: "घाना",
  			NAME_HU: "Ghána",
  			NAME_ID: "Ghana",
  			NAME_IT: "Ghana",
  			NAME_JA: "ガーナ",
  			NAME_KO: "가나",
  			NAME_NL: "Ghana",
  			NAME_PL: "Ghana",
  			NAME_PT: "Gana",
  			NAME_RU: "Гана",
  			NAME_SV: "Ghana",
  			NAME_TR: "Gana",
  			NAME_VI: "Ghana",
  			NAME_ZH: "迦納"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-8.029943610048619,
  						10.206534939001713
  					],
  					[
  						-6.050452032892267,
  						10.096360785355444
  					],
  					[
  						-5.404341599946974,
  						10.370736802609146
  					],
  					[
  						-4.3302469547603835,
  						9.610834865757141
  					],
  					[
  						-2.8274963037127065,
  						9.642460842319778
  					],
  					[
  						-2.562189500326241,
  						8.219627793811483
  					],
  					[
  						-3.244370083011262,
  						6.250471503113502
  					],
  					[
  						-2.856125047202397,
  						4.994475816259509
  					],
  					[
  						-4.008819545904942,
  						5.179813340674315
  					],
  					[
  						-5.8344962223445265,
  						4.993700669775137
  					],
  					[
  						-7.7121593896697505,
  						4.364565944837722
  					],
  					[
  						-7.570152553731688,
  						5.707352199725904
  					],
  					[
  						-8.60288021486862,
  						6.4675641951716605
  					],
  					[
  						-8.439298468448698,
  						7.686042792181738
  					],
  					[
  						-7.832100389019188,
  						8.575704250518626
  					],
  					[
  						-8.30961646161225,
  						9.789531968622441
  					],
  					[
  						-8.029943610048619,
  						10.206534939001713
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Ivory Coast",
  			SOV_A3: "CIV",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Ivory Coast",
  			ADM0_A3: "CIV",
  			GEOU_DIF: 0,
  			GEOUNIT: "Ivory Coast",
  			GU_A3: "CIV",
  			SU_DIF: 0,
  			SUBUNIT: "Ivory Coast",
  			SU_A3: "CIV",
  			BRK_DIFF: 0,
  			NAME: "Côte d'Ivoire",
  			NAME_LONG: "Côte d'Ivoire",
  			BRK_A3: "CIV",
  			BRK_NAME: "Côte d'Ivoire",
  			BRK_GROUP: "",
  			ABBREV: "I.C.",
  			POSTAL: "CI",
  			FORMAL_EN: "Republic of Ivory Coast",
  			FORMAL_FR: "Republic of Cote D'Ivoire",
  			NAME_CIAWF: "Cote D'ivoire",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Côte d'Ivoire",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 3,
  			POP_EST: 24184810,
  			POP_RANK: 15,
  			GDP_MD_EST: 87120,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1998,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "IV",
  			ISO_A2: "CI",
  			ISO_A3: "CIV",
  			ISO_A3_EH: "CIV",
  			ISO_N3: "384",
  			UN_A3: "384",
  			WB_A2: "CI",
  			WB_A3: "CIV",
  			WOE_ID: 23424854,
  			WOE_ID_EH: 23424854,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "CIV",
  			ADM0_A3_US: "CIV",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 13,
  			LONG_LEN: 13,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320507,
  			WIKIDATAID: "Q1008",
  			NAME_AR: "ساحل العاج",
  			NAME_BN: "কোত দিভোয়ার",
  			NAME_DE: "Elfenbeinküste",
  			NAME_EN: "Ivory Coast",
  			NAME_ES: "Costa de Marfil",
  			NAME_FR: "Côte d'Ivoire",
  			NAME_EL: "Ακτή Ελεφαντοστού",
  			NAME_HI: "कोत द'ईवोआर",
  			NAME_HU: "Elefántcsontpart",
  			NAME_ID: "Pantai Gading",
  			NAME_IT: "Costa d'Avorio",
  			NAME_JA: "コートジボワール",
  			NAME_KO: "코트디부아르",
  			NAME_NL: "Ivoorkust",
  			NAME_PL: "Wybrzeże Kości Słoniowej",
  			NAME_PT: "Costa do Marfim",
  			NAME_RU: "Кот-д’Ивуар",
  			NAME_SV: "Elfenbenskusten",
  			NAME_TR: "Fildişi Sahili",
  			NAME_VI: "Bờ Biển Ngà",
  			NAME_ZH: "科特迪瓦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-13.700476040084325,
  						12.586182969610194
  					],
  					[
  						-11.51394283695059,
  						12.442987575729418
  					],
  					[
  						-10.165213792348837,
  						11.844083563682744
  					],
  					[
  						-9.127473517279583,
  						12.308060411015333
  					],
  					[
  						-8.376304897484914,
  						11.393645941610629
  					],
  					[
  						-8.029943610048619,
  						10.206534939001713
  					],
  					[
  						-8.30961646161225,
  						9.789531968622441
  					],
  					[
  						-7.832100389019188,
  						8.575704250518626
  					],
  					[
  						-8.439298468448698,
  						7.686042792181738
  					],
  					[
  						-8.926064622422004,
  						7.309037380396376
  					],
  					[
  						-9.755342169625834,
  						8.541055202666925
  					],
  					[
  						-10.23009355309128,
  						8.406205552601293
  					],
  					[
  						-11.11748124840733,
  						10.045872911006285
  					],
  					[
  						-12.425928514037565,
  						9.835834051955956
  					],
  					[
  						-13.246550258832515,
  						8.903048610871508
  					],
  					[
  						-14.579698859098258,
  						10.214467271358515
  					],
  					[
  						-15.130311245168173,
  						11.040411688679526
  					],
  					[
  						-13.743160773157413,
  						11.811269029177412
  					],
  					[
  						-13.700476040084325,
  						12.586182969610194
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Guinea",
  			SOV_A3: "GIN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Guinea",
  			ADM0_A3: "GIN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Guinea",
  			GU_A3: "GIN",
  			SU_DIF: 0,
  			SUBUNIT: "Guinea",
  			SU_A3: "GIN",
  			BRK_DIFF: 0,
  			NAME: "Guinea",
  			NAME_LONG: "Guinea",
  			BRK_A3: "GIN",
  			BRK_NAME: "Guinea",
  			BRK_GROUP: "",
  			ABBREV: "Gin.",
  			POSTAL: "GN",
  			FORMAL_EN: "Republic of Guinea",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Guinea",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Guinea",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 2,
  			POP_EST: 12413867,
  			POP_RANK: 14,
  			GDP_MD_EST: 16080,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1996,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GV",
  			ISO_A2: "GN",
  			ISO_A3: "GIN",
  			ISO_A3_EH: "GIN",
  			ISO_N3: "324",
  			UN_A3: "324",
  			WB_A2: "GN",
  			WB_A3: "GIN",
  			WOE_ID: 23424835,
  			WOE_ID_EH: 23424835,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GIN",
  			ADM0_A3_US: "GIN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320795,
  			WIKIDATAID: "Q1006",
  			NAME_AR: "غينيا",
  			NAME_BN: "গিনি",
  			NAME_DE: "Guinea",
  			NAME_EN: "Guinea",
  			NAME_ES: "Guinea",
  			NAME_FR: "Guinée",
  			NAME_EL: "Γουινέα",
  			NAME_HI: "गिनी",
  			NAME_HU: "Guinea",
  			NAME_ID: "Guinea",
  			NAME_IT: "Guinea",
  			NAME_JA: "ギニア",
  			NAME_KO: "기니",
  			NAME_NL: "Guinee",
  			NAME_PL: "Gwinea",
  			NAME_PT: "Guiné",
  			NAME_RU: "Гвинея",
  			NAME_SV: "Guinea",
  			NAME_TR: "Gine",
  			NAME_VI: "Guinée",
  			NAME_ZH: "几内亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-16.677451951554573,
  						12.384851589401052
  					],
  					[
  						-15.54847693527401,
  						12.628170070847347
  					],
  					[
  						-13.700476040084325,
  						12.586182969610194
  					],
  					[
  						-13.743160773157413,
  						11.811269029177412
  					],
  					[
  						-15.130311245168173,
  						11.040411688679526
  					],
  					[
  						-16.085214199273565,
  						11.52459402103824
  					],
  					[
  						-16.677451951554573,
  						12.384851589401052
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Guinea-Bissau",
  			SOV_A3: "GNB",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Guinea-Bissau",
  			ADM0_A3: "GNB",
  			GEOU_DIF: 0,
  			GEOUNIT: "Guinea-Bissau",
  			GU_A3: "GNB",
  			SU_DIF: 0,
  			SUBUNIT: "Guinea-Bissau",
  			SU_A3: "GNB",
  			BRK_DIFF: 0,
  			NAME: "Guinea-Bissau",
  			NAME_LONG: "Guinea-Bissau",
  			BRK_A3: "GNB",
  			BRK_NAME: "Guinea-Bissau",
  			BRK_GROUP: "",
  			ABBREV: "GnB.",
  			POSTAL: "GW",
  			FORMAL_EN: "Republic of Guinea-Bissau",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Guinea-Bissau",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Guinea-Bissau",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 4,
  			POP_EST: 1792338,
  			POP_RANK: 12,
  			GDP_MD_EST: 2851,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "PU",
  			ISO_A2: "GW",
  			ISO_A3: "GNB",
  			ISO_A3_EH: "GNB",
  			ISO_N3: "624",
  			UN_A3: "624",
  			WB_A2: "GW",
  			WB_A3: "GNB",
  			WOE_ID: 23424929,
  			WOE_ID_EH: 23424929,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GNB",
  			ADM0_A3_US: "GNB",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 13,
  			LONG_LEN: 13,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159320799,
  			WIKIDATAID: "Q1007",
  			NAME_AR: "غينيا بيساو",
  			NAME_BN: "গিনি-বিসাউ",
  			NAME_DE: "Guinea-Bissau",
  			NAME_EN: "Guinea-Bissau",
  			NAME_ES: "Guinea-Bisáu",
  			NAME_FR: "Guinée-Bissau",
  			NAME_EL: "Γουινέα-Μπισσάου",
  			NAME_HI: "गिनी-बिसाऊ",
  			NAME_HU: "Bissau-Guinea",
  			NAME_ID: "Guinea-Bissau",
  			NAME_IT: "Guinea-Bissau",
  			NAME_JA: "ギニアビサウ",
  			NAME_KO: "기니비사우",
  			NAME_NL: "Guinee-Bissau",
  			NAME_PL: "Gwinea Bissau",
  			NAME_PT: "Guiné-Bissau",
  			NAME_RU: "Гвинея-Бисау",
  			NAME_SV: "Guinea-Bissau",
  			NAME_TR: "Gine-Bissau",
  			NAME_VI: "Guiné-Bissau",
  			NAME_ZH: "幾內亞比索"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-8.439298468448698,
  						7.686042792181738
  					],
  					[
  						-8.60288021486862,
  						6.4675641951716605
  					],
  					[
  						-7.570152553731688,
  						5.707352199725904
  					],
  					[
  						-7.7121593896697505,
  						4.364565944837722
  					],
  					[
  						-9.004793667018674,
  						4.8324185245922
  					],
  					[
  						-11.438779466182055,
  						6.7859168563057475
  					],
  					[
  						-10.23009355309128,
  						8.406205552601293
  					],
  					[
  						-9.755342169625834,
  						8.541055202666925
  					],
  					[
  						-8.926064622422004,
  						7.309037380396376
  					],
  					[
  						-8.439298468448698,
  						7.686042792181738
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Liberia",
  			SOV_A3: "LBR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Liberia",
  			ADM0_A3: "LBR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Liberia",
  			GU_A3: "LBR",
  			SU_DIF: 0,
  			SUBUNIT: "Liberia",
  			SU_A3: "LBR",
  			BRK_DIFF: 0,
  			NAME: "Liberia",
  			NAME_LONG: "Liberia",
  			BRK_A3: "LBR",
  			BRK_NAME: "Liberia",
  			BRK_GROUP: "",
  			ABBREV: "Liberia",
  			POSTAL: "LR",
  			FORMAL_EN: "Republic of Liberia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Liberia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Liberia",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 9,
  			POP_EST: 4689021,
  			POP_RANK: 12,
  			GDP_MD_EST: 3881,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2008,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LI",
  			ISO_A2: "LR",
  			ISO_A3: "LBR",
  			ISO_A3_EH: "LBR",
  			ISO_N3: "430",
  			UN_A3: "430",
  			WB_A2: "LR",
  			WB_A3: "LBR",
  			WOE_ID: 23424876,
  			WOE_ID_EH: 23424876,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LBR",
  			ADM0_A3_US: "LBR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 7,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321015,
  			WIKIDATAID: "Q1014",
  			NAME_AR: "ليبيريا",
  			NAME_BN: "লাইবেরিয়া",
  			NAME_DE: "Liberia",
  			NAME_EN: "Liberia",
  			NAME_ES: "Liberia",
  			NAME_FR: "Liberia",
  			NAME_EL: "Λιβερία",
  			NAME_HI: "लाइबेरिया",
  			NAME_HU: "Libéria",
  			NAME_ID: "Liberia",
  			NAME_IT: "Liberia",
  			NAME_JA: "リベリア",
  			NAME_KO: "라이베리아",
  			NAME_NL: "Liberia",
  			NAME_PL: "Liberia",
  			NAME_PT: "Libéria",
  			NAME_RU: "Либерия",
  			NAME_SV: "Liberia",
  			NAME_TR: "Liberya",
  			NAME_VI: "Liberia",
  			NAME_ZH: "利比里亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-13.246550258832515,
  						8.903048610871508
  					],
  					[
  						-12.425928514037565,
  						9.835834051955956
  					],
  					[
  						-11.11748124840733,
  						10.045872911006285
  					],
  					[
  						-10.23009355309128,
  						8.406205552601293
  					],
  					[
  						-11.438779466182055,
  						6.7859168563057475
  					],
  					[
  						-12.949049038128194,
  						7.798645738145738
  					],
  					[
  						-13.246550258832515,
  						8.903048610871508
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Sierra Leone",
  			SOV_A3: "SLE",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Sierra Leone",
  			ADM0_A3: "SLE",
  			GEOU_DIF: 0,
  			GEOUNIT: "Sierra Leone",
  			GU_A3: "SLE",
  			SU_DIF: 0,
  			SUBUNIT: "Sierra Leone",
  			SU_A3: "SLE",
  			BRK_DIFF: 0,
  			NAME: "Sierra Leone",
  			NAME_LONG: "Sierra Leone",
  			BRK_A3: "SLE",
  			BRK_NAME: "Sierra Leone",
  			BRK_GROUP: "",
  			ABBREV: "S.L.",
  			POSTAL: "SL",
  			FORMAL_EN: "Republic of Sierra Leone",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Sierra Leone",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Sierra Leone",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 7,
  			POP_EST: 6163195,
  			POP_RANK: 13,
  			GDP_MD_EST: 10640,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SL",
  			ISO_A2: "SL",
  			ISO_A3: "SLE",
  			ISO_A3_EH: "SLE",
  			ISO_N3: "694",
  			UN_A3: "694",
  			WB_A2: "SL",
  			WB_A3: "SLE",
  			WOE_ID: 23424946,
  			WOE_ID_EH: 23424946,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SLE",
  			ADM0_A3_US: "SLE",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 12,
  			LONG_LEN: 12,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321251,
  			WIKIDATAID: "Q1044",
  			NAME_AR: "سيراليون",
  			NAME_BN: "সিয়েরা লিওন",
  			NAME_DE: "Sierra Leone",
  			NAME_EN: "Sierra Leone",
  			NAME_ES: "Sierra Leona",
  			NAME_FR: "Sierra Leone",
  			NAME_EL: "Σιέρα Λεόνε",
  			NAME_HI: "सिएरा लियोन",
  			NAME_HU: "Sierra Leone",
  			NAME_ID: "Sierra Leone",
  			NAME_IT: "Sierra Leone",
  			NAME_JA: "シエラレオネ",
  			NAME_KO: "시에라리온",
  			NAME_NL: "Sierra Leone",
  			NAME_PL: "Sierra Leone",
  			NAME_PT: "Serra Leoa",
  			NAME_RU: "Сьерра-Леоне",
  			NAME_SV: "Sierra Leone",
  			NAME_TR: "Sierra Leone",
  			NAME_VI: "Sierra Leone",
  			NAME_ZH: "塞拉利昂"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-5.404341599946974,
  						10.370736802609146
  					],
  					[
  						-5.220941941743121,
  						11.713858954307227
  					],
  					[
  						-4.427166103523803,
  						12.542645575404295
  					],
  					[
  						-2.001035122068771,
  						14.559008287000893
  					],
  					[
  						-0.5158544580003479,
  						15.116157741755728
  					],
  					[
  						0.3748922054146817,
  						14.92890818934613
  					],
  					[
  						0.429927605805517,
  						13.988733018443924
  					],
  					[
  						1.0241032242974768,
  						12.851825669806574
  					],
  					[
  						2.177107781593776,
  						12.625017808477535
  					],
  					[
  						2.1544735042499212,
  						11.940150051313339
  					],
  					[
  						0.8995630224740694,
  						10.99733938236426
  					],
  					[
  						0.023802524423700785,
  						11.018681748900804
  					],
  					[
  						-2.9404093082704605,
  						10.962690334512558
  					],
  					[
  						-2.8274963037127065,
  						9.642460842319778
  					],
  					[
  						-4.3302469547603835,
  						9.610834865757141
  					],
  					[
  						-5.404341599946974,
  						10.370736802609146
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Burkina Faso",
  			SOV_A3: "BFA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Burkina Faso",
  			ADM0_A3: "BFA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Burkina Faso",
  			GU_A3: "BFA",
  			SU_DIF: 0,
  			SUBUNIT: "Burkina Faso",
  			SU_A3: "BFA",
  			BRK_DIFF: 0,
  			NAME: "Burkina Faso",
  			NAME_LONG: "Burkina Faso",
  			BRK_A3: "BFA",
  			BRK_NAME: "Burkina Faso",
  			BRK_GROUP: "",
  			ABBREV: "B.F.",
  			POSTAL: "BF",
  			FORMAL_EN: "Burkina Faso",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Burkina Faso",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Burkina Faso",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 11,
  			POP_EST: 20107509,
  			POP_RANK: 15,
  			GDP_MD_EST: 32990,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2006,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "UV",
  			ISO_A2: "BF",
  			ISO_A3: "BFA",
  			ISO_A3_EH: "BFA",
  			ISO_N3: "854",
  			UN_A3: "854",
  			WB_A2: "BF",
  			WB_A3: "BFA",
  			WOE_ID: 23424978,
  			WOE_ID_EH: 23424978,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BFA",
  			ADM0_A3_US: "BFA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Western Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 12,
  			LONG_LEN: 12,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320405,
  			WIKIDATAID: "Q965",
  			NAME_AR: "بوركينا فاسو",
  			NAME_BN: "বুর্কিনা ফাসো",
  			NAME_DE: "Burkina Faso",
  			NAME_EN: "Burkina Faso",
  			NAME_ES: "Burkina Faso",
  			NAME_FR: "Burkina Faso",
  			NAME_EL: "Μπουρκίνα Φάσο",
  			NAME_HI: "बुर्किना फासो",
  			NAME_HU: "Burkina Faso",
  			NAME_ID: "Burkina Faso",
  			NAME_IT: "Burkina Faso",
  			NAME_JA: "ブルキナファソ",
  			NAME_KO: "부르키나파소",
  			NAME_NL: "Burkina Faso",
  			NAME_PL: "Burkina Faso",
  			NAME_PT: "Burkina Faso",
  			NAME_RU: "Буркина-Фасо",
  			NAME_SV: "Burkina Faso",
  			NAME_TR: "Burkina Faso",
  			NAME_VI: "Burkina Faso",
  			NAME_ZH: "布吉納法索"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						27.37422610851749,
  						5.233944403500061
  					],
  					[
  						24.410531040146253,
  						5.10878408448913
  					],
  					[
  						22.405123732195538,
  						4.029160061047321
  					],
  					[
  						20.927591180106276,
  						4.322785549329737
  					],
  					[
  						19.46778364429315,
  						5.03152781821278
  					],
  					[
  						18.54298221199778,
  						4.201785183118318
  					],
  					[
  						18.45306521980993,
  						3.5043858911233485
  					],
  					[
  						17.133042433346304,
  						3.728196519379452
  					],
  					[
  						16.012852410555354,
  						2.267639675298085
  					],
  					[
  						14.47837243008047,
  						4.732605495620447
  					],
  					[
  						14.536560092841114,
  						6.2269587264206905
  					],
  					[
  						15.279460483469109,
  						7.421924546737969
  					],
  					[
  						16.705988396886255,
  						7.5083275415299795
  					],
  					[
  						17.964929640380888,
  						7.890914008002994
  					],
  					[
  						19.09400800952602,
  						9.07484691002584
  					],
  					[
  						20.05968549976427,
  						9.012706000194854
  					],
  					[
  						21.000868361096167,
  						9.475985215691509
  					],
  					[
  						21.723821648859456,
  						10.567055568885976
  					],
  					[
  						22.864165480244225,
  						11.142395127807546
  					],
  					[
  						23.554304233502194,
  						10.089255275915308
  					],
  					[
  						23.459012892355986,
  						8.954285793488893
  					],
  					[
  						24.567369012152085,
  						8.229187933785468
  					],
  					[
  						27.37422610851749,
  						5.233944403500061
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Central African Republic",
  			SOV_A3: "CAF",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Central African Republic",
  			ADM0_A3: "CAF",
  			GEOU_DIF: 0,
  			GEOUNIT: "Central African Republic",
  			GU_A3: "CAF",
  			SU_DIF: 0,
  			SUBUNIT: "Central African Republic",
  			SU_A3: "CAF",
  			BRK_DIFF: 0,
  			NAME: "Central African Rep.",
  			NAME_LONG: "Central African Republic",
  			BRK_A3: "CAF",
  			BRK_NAME: "Central African Rep.",
  			BRK_GROUP: "",
  			ABBREV: "C.A.R.",
  			POSTAL: "CF",
  			FORMAL_EN: "Central African Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Central African Republic",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Central African Republic",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 9,
  			POP_EST: 5625118,
  			POP_RANK: 13,
  			GDP_MD_EST: 3206,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2003,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CT",
  			ISO_A2: "CF",
  			ISO_A3: "CAF",
  			ISO_A3_EH: "CAF",
  			ISO_N3: "140",
  			UN_A3: "140",
  			WB_A2: "CF",
  			WB_A3: "CAF",
  			WOE_ID: 23424792,
  			WOE_ID_EH: 23424792,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "CAF",
  			ADM0_A3_US: "CAF",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Middle Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 20,
  			LONG_LEN: 24,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320463,
  			WIKIDATAID: "Q929",
  			NAME_AR: "جمهورية أفريقيا الوسطى",
  			NAME_BN: "মধ্য আফ্রিকান প্রজাতন্ত্র",
  			NAME_DE: "Zentralafrikanische Republik",
  			NAME_EN: "Central African Republic",
  			NAME_ES: "República Centroafricana",
  			NAME_FR: "République centrafricaine",
  			NAME_EL: "Κεντροαφρικανική Δημοκρατία",
  			NAME_HI: "मध्य अफ़्रीकी गणराज्य",
  			NAME_HU: "Közép-afrikai Köztársaság",
  			NAME_ID: "Republik Afrika Tengah",
  			NAME_IT: "Repubblica Centrafricana",
  			NAME_JA: "中央アフリカ共和国",
  			NAME_KO: "중앙아프리카 공화국",
  			NAME_NL: "Centraal-Afrikaanse Republiek",
  			NAME_PL: "Republika Środkowoafrykańska",
  			NAME_PT: "República Centro-Africana",
  			NAME_RU: "Центральноафриканская Республика",
  			NAME_SV: "Centralafrikanska republiken",
  			NAME_TR: "Orta Afrika Cumhuriyeti",
  			NAME_VI: "Cộng hòa Trung Phi",
  			NAME_ZH: "中非共和國"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						18.45306521980993,
  						3.5043858911233485
  					],
  					[
  						17.898835483479587,
  						1.7418319767282782
  					],
  					[
  						17.523716261472856,
  						-0.743830254726987
  					],
  					[
  						16.407091912510054,
  						-1.7409270157986825
  					],
  					[
  						16.0062895036543,
  						-3.535132744972529
  					],
  					[
  						14.582603794013181,
  						-4.97023894615014
  					],
  					[
  						14.144956088933299,
  						-4.510008640158716
  					],
  					[
  						12.995517205465177,
  						-4.781103203961884
  					],
  					[
  						11.91496300624209,
  						-5.037986748884791
  					],
  					[
  						11.093772820691925,
  						-3.978826592630547
  					],
  					[
  						11.855121697648116,
  						-3.4268706193210505
  					],
  					[
  						11.478038771214303,
  						-2.7656189917142413
  					],
  					[
  						12.495702752338161,
  						-2.391688327650243
  					],
  					[
  						13.99240726080771,
  						-2.4708049454890997
  					],
  					[
  						14.425455763413595,
  						-1.333406670744971
  					],
  					[
  						13.843320753645656,
  						0.038757635901149
  					],
  					[
  						14.276265903386957,
  						1.1969298364266194
  					],
  					[
  						13.282631463278818,
  						1.3141836612968805
  					],
  					[
  						13.075822381246752,
  						2.2670970727590145
  					],
  					[
  						14.33781253424658,
  						2.2278746606494906
  					],
  					[
  						15.940918816805066,
  						1.7276726342802957
  					],
  					[
  						16.012852410555354,
  						2.267639675298085
  					],
  					[
  						17.133042433346304,
  						3.728196519379452
  					],
  					[
  						18.45306521980993,
  						3.5043858911233485
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Republic of the Congo",
  			SOV_A3: "COG",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Republic of the Congo",
  			ADM0_A3: "COG",
  			GEOU_DIF: 0,
  			GEOUNIT: "Republic of the Congo",
  			GU_A3: "COG",
  			SU_DIF: 0,
  			SUBUNIT: "Republic of the Congo",
  			SU_A3: "COG",
  			BRK_DIFF: 0,
  			NAME: "Congo",
  			NAME_LONG: "Republic of the Congo",
  			BRK_A3: "COG",
  			BRK_NAME: "Republic of the Congo",
  			BRK_GROUP: "",
  			ABBREV: "Rep. Congo",
  			POSTAL: "CG",
  			FORMAL_EN: "Republic of the Congo",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Congo, Republic of the",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Congo, Rep.",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 10,
  			POP_EST: 4954674,
  			POP_RANK: 12,
  			GDP_MD_EST: 30270,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2007,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CF",
  			ISO_A2: "CG",
  			ISO_A3: "COG",
  			ISO_A3_EH: "COG",
  			ISO_N3: "178",
  			UN_A3: "178",
  			WB_A2: "CG",
  			WB_A3: "COG",
  			WOE_ID: 23424779,
  			WOE_ID_EH: 23424779,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "COG",
  			ADM0_A3_US: "COG",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Middle Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 21,
  			ABBREV_LEN: 10,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320515,
  			WIKIDATAID: "Q971",
  			NAME_AR: "جمهورية الكونغو",
  			NAME_BN: "কঙ্গো প্রজাতন্ত্র",
  			NAME_DE: "Republik Kongo",
  			NAME_EN: "Republic of the Congo",
  			NAME_ES: "República del Congo",
  			NAME_FR: "République du Congo",
  			NAME_EL: "Δημοκρατία του Κονγκό",
  			NAME_HI: "कांगो गणराज्य",
  			NAME_HU: "Kongói Köztársaság",
  			NAME_ID: "Republik Kongo",
  			NAME_IT: "Repubblica del Congo",
  			NAME_JA: "コンゴ共和国",
  			NAME_KO: "콩고 공화국",
  			NAME_NL: "Republiek Congo",
  			NAME_PL: "Kongo",
  			NAME_PT: "Congo",
  			NAME_RU: "Республика Конго",
  			NAME_SV: "Kongo-Brazzaville",
  			NAME_TR: "Kongo Cumhuriyeti",
  			NAME_VI: "Cộng hòa Congo",
  			NAME_ZH: "刚果共和国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						11.276449008843713,
  						2.261050930180872
  					],
  					[
  						13.075822381246752,
  						2.2670970727590145
  					],
  					[
  						13.282631463278818,
  						1.3141836612968805
  					],
  					[
  						14.276265903386957,
  						1.1969298364266194
  					],
  					[
  						13.843320753645656,
  						0.038757635901149
  					],
  					[
  						14.425455763413595,
  						-1.333406670744971
  					],
  					[
  						13.99240726080771,
  						-2.4708049454890997
  					],
  					[
  						12.495702752338161,
  						-2.391688327650243
  					],
  					[
  						11.478038771214303,
  						-2.7656189917142413
  					],
  					[
  						11.855121697648116,
  						-3.4268706193210505
  					],
  					[
  						11.093772820691925,
  						-3.978826592630547
  					],
  					[
  						9.40524539555497,
  						-2.144313246269043
  					],
  					[
  						8.79799563969317,
  						-1.111301364754496
  					],
  					[
  						9.492888624721985,
  						1.010119533691494
  					],
  					[
  						11.285078973036462,
  						1.0576618514000131
  					],
  					[
  						11.276449008843713,
  						2.261050930180872
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Gabon",
  			SOV_A3: "GAB",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Gabon",
  			ADM0_A3: "GAB",
  			GEOU_DIF: 0,
  			GEOUNIT: "Gabon",
  			GU_A3: "GAB",
  			SU_DIF: 0,
  			SUBUNIT: "Gabon",
  			SU_A3: "GAB",
  			BRK_DIFF: 0,
  			NAME: "Gabon",
  			NAME_LONG: "Gabon",
  			BRK_A3: "GAB",
  			BRK_NAME: "Gabon",
  			BRK_GROUP: "",
  			ABBREV: "Gabon",
  			POSTAL: "GA",
  			FORMAL_EN: "Gabonese Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Gabon",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Gabon",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 5,
  			POP_EST: 1772255,
  			POP_RANK: 12,
  			GDP_MD_EST: 35980,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2003,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GB",
  			ISO_A2: "GA",
  			ISO_A3: "GAB",
  			ISO_A3_EH: "GAB",
  			ISO_N3: "266",
  			UN_A3: "266",
  			WB_A2: "GA",
  			WB_A3: "GAB",
  			WOE_ID: 23424822,
  			WOE_ID_EH: 23424822,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GAB",
  			ADM0_A3_US: "GAB",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Middle Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: 3,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320693,
  			WIKIDATAID: "Q1000",
  			NAME_AR: "الغابون",
  			NAME_BN: "গ্যাবন",
  			NAME_DE: "Gabun",
  			NAME_EN: "Gabon",
  			NAME_ES: "Gabón",
  			NAME_FR: "Gabon",
  			NAME_EL: "Γκαμπόν",
  			NAME_HI: "गबॉन",
  			NAME_HU: "Gabon",
  			NAME_ID: "Gabon",
  			NAME_IT: "Gabon",
  			NAME_JA: "ガボン",
  			NAME_KO: "가봉",
  			NAME_NL: "Gabon",
  			NAME_PL: "Gabon",
  			NAME_PT: "Gabão",
  			NAME_RU: "Габон",
  			NAME_SV: "Gabon",
  			NAME_TR: "Gabon",
  			NAME_VI: "Gabon",
  			NAME_ZH: "加蓬"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						9.649158155972628,
  						2.2838660750377358
  					],
  					[
  						11.276449008843713,
  						2.261050930180872
  					],
  					[
  						11.285078973036462,
  						1.0576618514000131
  					],
  					[
  						9.492888624721985,
  						1.010119533691494
  					],
  					[
  						9.649158155972628,
  						2.2838660750377358
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Equatorial Guinea",
  			SOV_A3: "GNQ",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Equatorial Guinea",
  			ADM0_A3: "GNQ",
  			GEOU_DIF: 0,
  			GEOUNIT: "Equatorial Guinea",
  			GU_A3: "GNQ",
  			SU_DIF: 0,
  			SUBUNIT: "Equatorial Guinea",
  			SU_A3: "GNQ",
  			BRK_DIFF: 0,
  			NAME: "Eq. Guinea",
  			NAME_LONG: "Equatorial Guinea",
  			BRK_A3: "GNQ",
  			BRK_NAME: "Eq. Guinea",
  			BRK_GROUP: "",
  			ABBREV: "Eq. G.",
  			POSTAL: "GQ",
  			FORMAL_EN: "Republic of Equatorial Guinea",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Equatorial Guinea",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Equatorial Guinea",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 8,
  			POP_EST: 778358,
  			POP_RANK: 11,
  			GDP_MD_EST: 31770,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "EK",
  			ISO_A2: "GQ",
  			ISO_A3: "GNQ",
  			ISO_A3_EH: "GNQ",
  			ISO_N3: "226",
  			UN_A3: "226",
  			WB_A2: "GQ",
  			WB_A3: "GNQ",
  			WOE_ID: 23424804,
  			WOE_ID_EH: 23424804,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GNQ",
  			ADM0_A3_US: "GNQ",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Middle Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 10,
  			LONG_LEN: 17,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320801,
  			WIKIDATAID: "Q983",
  			NAME_AR: "غينيا الاستوائية",
  			NAME_BN: "বিষুবীয় গিনি",
  			NAME_DE: "Äquatorialguinea",
  			NAME_EN: "Equatorial Guinea",
  			NAME_ES: "Guinea Ecuatorial",
  			NAME_FR: "Guinée équatoriale",
  			NAME_EL: "Ισημερινή Γουινέα",
  			NAME_HI: "भूमध्यरेखीय गिनी",
  			NAME_HU: "Egyenlítői-Guinea",
  			NAME_ID: "Guinea Khatulistiwa",
  			NAME_IT: "Guinea Equatoriale",
  			NAME_JA: "赤道ギニア",
  			NAME_KO: "적도 기니",
  			NAME_NL: "Equatoriaal-Guinea",
  			NAME_PL: "Gwinea Równikowa",
  			NAME_PT: "Guiné Equatorial",
  			NAME_RU: "Экваториальная Гвинея",
  			NAME_SV: "Ekvatorialguinea",
  			NAME_TR: "Ekvator Ginesi",
  			NAME_VI: "Guinea Xích Đạo",
  			NAME_ZH: "赤道几内亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						30.740009731422095,
  						-8.34000593035372
  					],
  					[
  						32.75937544122132,
  						-9.23059905358906
  					],
  					[
  						33.48568769708359,
  						-10.525558770391115
  					],
  					[
  						33.114289178201915,
  						-11.607198174692314
  					],
  					[
  						33.306422153463075,
  						-12.435778090060218
  					],
  					[
  						32.68816531752313,
  						-13.712857761289277
  					],
  					[
  						33.214024692525214,
  						-13.971860039936153
  					],
  					[
  						30.17948123548183,
  						-14.796099134991529
  					],
  					[
  						30.27425581230511,
  						-15.507786960515213
  					],
  					[
  						29.516834344203147,
  						-15.644677829656388
  					],
  					[
  						27.044427117630732,
  						-17.938026218337434
  					],
  					[
  						25.264225701608012,
  						-17.736539808831417
  					],
  					[
  						25.08444339366457,
  						-17.661815687737374
  					],
  					[
  						24.033861525170778,
  						-17.295843194246324
  					],
  					[
  						23.215048455506064,
  						-17.523116143465984
  					],
  					[
  						21.887842644953874,
  						-16.08031015387688
  					],
  					[
  						21.933886346125917,
  						-12.898437188369359
  					],
  					[
  						24.016136508894675,
  						-12.911046237848574
  					],
  					[
  						23.912215203555718,
  						-10.926826267137514
  					],
  					[
  						25.418118116973204,
  						-11.330935967659961
  					],
  					[
  						25.752309604604733,
  						-11.784965101776358
  					],
  					[
  						28.155108676879987,
  						-12.272480564017897
  					],
  					[
  						28.934285922976837,
  						-13.248958428605135
  					],
  					[
  						29.34154788586909,
  						-12.360743910372413
  					],
  					[
  						28.372253045370428,
  						-11.793646742401393
  					],
  					[
  						28.734866570762502,
  						-8.526559340044578
  					],
  					[
  						30.740009731422095,
  						-8.34000593035372
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Zambia",
  			SOV_A3: "ZMB",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Zambia",
  			ADM0_A3: "ZMB",
  			GEOU_DIF: 0,
  			GEOUNIT: "Zambia",
  			GU_A3: "ZMB",
  			SU_DIF: 0,
  			SUBUNIT: "Zambia",
  			SU_A3: "ZMB",
  			BRK_DIFF: 0,
  			NAME: "Zambia",
  			NAME_LONG: "Zambia",
  			BRK_A3: "ZMB",
  			BRK_NAME: "Zambia",
  			BRK_GROUP: "",
  			ABBREV: "Zambia",
  			POSTAL: "ZM",
  			FORMAL_EN: "Republic of Zambia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Zambia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Zambia",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 8,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 13,
  			POP_EST: 15972000,
  			POP_RANK: 14,
  			GDP_MD_EST: 65170,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "ZA",
  			ISO_A2: "ZM",
  			ISO_A3: "ZMB",
  			ISO_A3_EH: "ZMB",
  			ISO_N3: "894",
  			UN_A3: "894",
  			WB_A2: "ZM",
  			WB_A3: "ZMB",
  			WOE_ID: 23425003,
  			WOE_ID_EH: 23425003,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ZMB",
  			ADM0_A3_US: "ZMB",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321439,
  			WIKIDATAID: "Q953",
  			NAME_AR: "زامبيا",
  			NAME_BN: "জাম্বিয়া",
  			NAME_DE: "Sambia",
  			NAME_EN: "Zambia",
  			NAME_ES: "Zambia",
  			NAME_FR: "Zambie",
  			NAME_EL: "Ζάμπια",
  			NAME_HI: "ज़ाम्बिया",
  			NAME_HU: "Zambia",
  			NAME_ID: "Zambia",
  			NAME_IT: "Zambia",
  			NAME_JA: "ザンビア",
  			NAME_KO: "잠비아",
  			NAME_NL: "Zambia",
  			NAME_PL: "Zambia",
  			NAME_PT: "Zâmbia",
  			NAME_RU: "Замбия",
  			NAME_SV: "Zambia",
  			NAME_TR: "Zambiya",
  			NAME_VI: "Zambia",
  			NAME_ZH: "赞比亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						32.75937544122132,
  						-9.23059905358906
  					],
  					[
  						33.73972000000009,
  						-9.417149999999992
  					],
  					[
  						34.27999999999997,
  						-10.160000000000025
  					],
  					[
  						34.55998904799935,
  						-11.520020033415925
  					],
  					[
  						34.28000613784198,
  						-12.280025323132506
  					],
  					[
  						34.55998904799935,
  						-13.579997653866876
  					],
  					[
  						35.68684533055594,
  						-14.611045830954332
  					],
  					[
  						35.77190473810836,
  						-15.896858819240727
  					],
  					[
  						35.033810255683534,
  						-16.801299737213093
  					],
  					[
  						34.38129194513405,
  						-16.183559665596043
  					],
  					[
  						34.45963341648854,
  						-14.613009535381423
  					],
  					[
  						33.214024692525214,
  						-13.971860039936153
  					],
  					[
  						32.68816531752313,
  						-13.712857761289277
  					],
  					[
  						33.306422153463075,
  						-12.435778090060218
  					],
  					[
  						33.114289178201915,
  						-11.607198174692314
  					],
  					[
  						33.48568769708359,
  						-10.525558770391115
  					],
  					[
  						32.75937544122132,
  						-9.23059905358906
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Malawi",
  			SOV_A3: "MWI",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Malawi",
  			ADM0_A3: "MWI",
  			GEOU_DIF: 0,
  			GEOUNIT: "Malawi",
  			GU_A3: "MWI",
  			SU_DIF: 0,
  			SUBUNIT: "Malawi",
  			SU_A3: "MWI",
  			BRK_DIFF: 0,
  			NAME: "Malawi",
  			NAME_LONG: "Malawi",
  			BRK_A3: "MWI",
  			BRK_NAME: "Malawi",
  			BRK_GROUP: "",
  			ABBREV: "Mal.",
  			POSTAL: "MW",
  			FORMAL_EN: "Republic of Malawi",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Malawi",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Malawi",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 5,
  			POP_EST: 19196246,
  			POP_RANK: 14,
  			GDP_MD_EST: 21200,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2008,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MI",
  			ISO_A2: "MW",
  			ISO_A3: "MWI",
  			ISO_A3_EH: "MWI",
  			ISO_N3: "454",
  			UN_A3: "454",
  			WB_A2: "MW",
  			WB_A3: "MWI",
  			WOE_ID: 23424889,
  			WOE_ID_EH: 23424889,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MWI",
  			ADM0_A3_US: "MWI",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321081,
  			WIKIDATAID: "Q1020",
  			NAME_AR: "مالاوي",
  			NAME_BN: "মালাউই",
  			NAME_DE: "Malawi",
  			NAME_EN: "Malawi",
  			NAME_ES: "Malaui",
  			NAME_FR: "Malawi",
  			NAME_EL: "Μαλάουι",
  			NAME_HI: "मलावी",
  			NAME_HU: "Malawi",
  			NAME_ID: "Malawi",
  			NAME_IT: "Malawi",
  			NAME_JA: "マラウイ",
  			NAME_KO: "말라위",
  			NAME_NL: "Malawi",
  			NAME_PL: "Malawi",
  			NAME_PT: "Malawi",
  			NAME_RU: "Малави",
  			NAME_SV: "Malawi",
  			NAME_TR: "Malavi",
  			NAME_VI: "Malawi",
  			NAME_ZH: "马拉维"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						34.55998904799935,
  						-11.520020033415925
  					],
  					[
  						36.51408165868426,
  						-11.720938002166735
  					],
  					[
  						39.52099999999996,
  						-10.89688000000001
  					],
  					[
  						40.316586229110854,
  						-10.317097752817492
  					],
  					[
  						40.47838748552303,
  						-10.765440769089993
  					],
  					[
  						40.59962039567975,
  						-14.201975192931862
  					],
  					[
  						40.775475294768995,
  						-14.691764418194241
  					],
  					[
  						40.08926395036522,
  						-16.10077402106446
  					],
  					[
  						39.45255862809705,
  						-16.72089120856694
  					],
  					[
  						37.41113284683888,
  						-17.586368096591237
  					],
  					[
  						34.78638349787005,
  						-19.784011732667736
  					],
  					[
  						34.70189253107284,
  						-20.49704314543101
  					],
  					[
  						35.562545536369086,
  						-22.090000000000003
  					],
  					[
  						35.45874555841962,
  						-24.12260995859655
  					],
  					[
  						32.574632195777866,
  						-25.727318210556092
  					],
  					[
  						32.830120477028885,
  						-26.742191664336197
  					],
  					[
  						32.07166548028107,
  						-26.73382008230491
  					],
  					[
  						31.83777794772806,
  						-25.84333180105135
  					],
  					[
  						31.930588820124253,
  						-24.36941659922254
  					],
  					[
  						31.19140913262129,
  						-22.2515096981724
  					],
  					[
  						32.244988234188014,
  						-21.116488539313693
  					],
  					[
  						32.772707960752626,
  						-19.715592136313298
  					],
  					[
  						32.847638787575846,
  						-16.713398125884616
  					],
  					[
  						30.27425581230511,
  						-15.507786960515213
  					],
  					[
  						30.17948123548183,
  						-14.796099134991529
  					],
  					[
  						33.214024692525214,
  						-13.971860039936153
  					],
  					[
  						34.45963341648854,
  						-14.613009535381423
  					],
  					[
  						34.38129194513405,
  						-16.183559665596043
  					],
  					[
  						35.033810255683534,
  						-16.801299737213093
  					],
  					[
  						35.77190473810836,
  						-15.896858819240727
  					],
  					[
  						35.68684533055594,
  						-14.611045830954332
  					],
  					[
  						34.55998904799935,
  						-13.579997653866876
  					],
  					[
  						34.28000613784198,
  						-12.280025323132506
  					],
  					[
  						34.55998904799935,
  						-11.520020033415925
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Mozambique",
  			SOV_A3: "MOZ",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Mozambique",
  			ADM0_A3: "MOZ",
  			GEOU_DIF: 0,
  			GEOUNIT: "Mozambique",
  			GU_A3: "MOZ",
  			SU_DIF: 0,
  			SUBUNIT: "Mozambique",
  			SU_A3: "MOZ",
  			BRK_DIFF: 0,
  			NAME: "Mozambique",
  			NAME_LONG: "Mozambique",
  			BRK_A3: "MOZ",
  			BRK_NAME: "Mozambique",
  			BRK_GROUP: "",
  			ABBREV: "Moz.",
  			POSTAL: "MZ",
  			FORMAL_EN: "Republic of Mozambique",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Mozambique",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Mozambique",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 4,
  			POP_EST: 26573706,
  			POP_RANK: 15,
  			GDP_MD_EST: 35010,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2007,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MZ",
  			ISO_A2: "MZ",
  			ISO_A3: "MOZ",
  			ISO_A3_EH: "MOZ",
  			ISO_N3: "508",
  			UN_A3: "508",
  			WB_A2: "MZ",
  			WB_A3: "MOZ",
  			WOE_ID: 23424902,
  			WOE_ID_EH: 23424902,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MOZ",
  			ADM0_A3_US: "MOZ",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321073,
  			WIKIDATAID: "Q1029",
  			NAME_AR: "موزمبيق",
  			NAME_BN: "মোজাম্বিক",
  			NAME_DE: "Mosambik",
  			NAME_EN: "Mozambique",
  			NAME_ES: "Mozambique",
  			NAME_FR: "Mozambique",
  			NAME_EL: "Μοζαμβίκη",
  			NAME_HI: "मोज़ाम्बीक",
  			NAME_HU: "Mozambik",
  			NAME_ID: "Mozambik",
  			NAME_IT: "Mozambico",
  			NAME_JA: "モザンビーク",
  			NAME_KO: "모잠비크",
  			NAME_NL: "Mozambique",
  			NAME_PL: "Mozambik",
  			NAME_PT: "Moçambique",
  			NAME_RU: "Мозамбик",
  			NAME_SV: "Moçambique",
  			NAME_TR: "Mozambik",
  			NAME_VI: "Mozambique",
  			NAME_ZH: "莫桑比克"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						32.07166548028107,
  						-26.73382008230491
  					],
  					[
  						31.28277306491333,
  						-27.285879408478998
  					],
  					[
  						30.68596194837448,
  						-26.743845310169533
  					],
  					[
  						31.04407962415715,
  						-25.731452325139443
  					],
  					[
  						31.83777794772806,
  						-25.84333180105135
  					],
  					[
  						32.07166548028107,
  						-26.73382008230491
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "eSwatini",
  			SOV_A3: "SWZ",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "eSwatini",
  			ADM0_A3: "SWZ",
  			GEOU_DIF: 0,
  			GEOUNIT: "eSwatini",
  			GU_A3: "SWZ",
  			SU_DIF: 0,
  			SUBUNIT: "eSwatini",
  			SU_A3: "SWZ",
  			BRK_DIFF: 0,
  			NAME: "eSwatini",
  			NAME_LONG: "eSwatini",
  			BRK_A3: "SWZ",
  			BRK_NAME: "eSwatini",
  			BRK_GROUP: "",
  			ABBREV: "eSw.",
  			POSTAL: "SW",
  			FORMAL_EN: "Kingdom of eSwatini",
  			FORMAL_FR: "",
  			NAME_CIAWF: "eSwatini",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "eSwatini",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 5,
  			POP_EST: 1467152,
  			POP_RANK: 12,
  			GDP_MD_EST: 11060,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2007,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "WZ",
  			ISO_A2: "SZ",
  			ISO_A3: "SWZ",
  			ISO_A3_EH: "SWZ",
  			ISO_N3: "748",
  			UN_A3: "748",
  			WB_A2: "SZ",
  			WB_A3: "SWZ",
  			WOE_ID: 23424993,
  			WOE_ID_EH: 23424993,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SWZ",
  			ADM0_A3_US: "SWZ",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Southern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321289,
  			WIKIDATAID: "Q1050",
  			NAME_AR: "سوازيلاند",
  			NAME_BN: "সোয়াজিল্যান্ড",
  			NAME_DE: "Swasiland",
  			NAME_EN: "eSwatini",
  			NAME_ES: "eSwatini",
  			NAME_FR: "Swaziland",
  			NAME_EL: "Σουαζιλάνδη",
  			NAME_HI: "स्वाज़ीलैण्ड",
  			NAME_HU: "Szváziföld",
  			NAME_ID: "Swaziland",
  			NAME_IT: "Swaziland",
  			NAME_JA: "スワジランド",
  			NAME_KO: "스와질란드",
  			NAME_NL: "Swaziland",
  			NAME_PL: "Suazi",
  			NAME_PT: "eSwatini",
  			NAME_RU: "Свазиленд",
  			NAME_SV: "Swaziland",
  			NAME_TR: "Svaziland",
  			NAME_VI: "Swaziland",
  			NAME_ZH: "斯威士兰"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						30.469673645761223,
  						-2.41385475710134
  					],
  					[
  						30.752240000000086,
  						-3.3593099999999936
  					],
  					[
  						29.339997592900346,
  						-4.4999834122940925
  					],
  					[
  						29.024926385216787,
  						-2.8392579077301576
  					],
  					[
  						30.469673645761223,
  						-2.41385475710134
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Burundi",
  			SOV_A3: "BDI",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Burundi",
  			ADM0_A3: "BDI",
  			GEOU_DIF: 0,
  			GEOUNIT: "Burundi",
  			GU_A3: "BDI",
  			SU_DIF: 0,
  			SUBUNIT: "Burundi",
  			SU_A3: "BDI",
  			BRK_DIFF: 0,
  			NAME: "Burundi",
  			NAME_LONG: "Burundi",
  			BRK_A3: "BDI",
  			BRK_NAME: "Burundi",
  			BRK_GROUP: "",
  			ABBREV: "Bur.",
  			POSTAL: "BI",
  			FORMAL_EN: "Republic of Burundi",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Burundi",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Burundi",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 8,
  			POP_EST: 11466756,
  			POP_RANK: 14,
  			GDP_MD_EST: 7892,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2008,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BY",
  			ISO_A2: "BI",
  			ISO_A3: "BDI",
  			ISO_A3_EH: "BDI",
  			ISO_N3: "108",
  			UN_A3: "108",
  			WB_A2: "BI",
  			WB_A3: "BDI",
  			WOE_ID: 23424774,
  			WOE_ID_EH: 23424774,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BDI",
  			ADM0_A3_US: "BDI",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320387,
  			WIKIDATAID: "Q967",
  			NAME_AR: "بوروندي",
  			NAME_BN: "বুরুন্ডি",
  			NAME_DE: "Burundi",
  			NAME_EN: "Burundi",
  			NAME_ES: "Burundi",
  			NAME_FR: "Burundi",
  			NAME_EL: "Μπουρούντι",
  			NAME_HI: "बुरुण्डी",
  			NAME_HU: "Burundi",
  			NAME_ID: "Burundi",
  			NAME_IT: "Burundi",
  			NAME_JA: "ブルンジ",
  			NAME_KO: "부룬디",
  			NAME_NL: "Burundi",
  			NAME_PL: "Burundi",
  			NAME_PT: "Burundi",
  			NAME_RU: "Бурунди",
  			NAME_SV: "Burundi",
  			NAME_TR: "Burundi",
  			NAME_VI: "Burundi",
  			NAME_ZH: "蒲隆地"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						35.71991824722275,
  						32.709192409794866
  					],
  					[
  						35.54566531753454,
  						32.393992011030576
  					],
  					[
  						35.397560662586045,
  						31.489086005167582
  					],
  					[
  						34.92260257339143,
  						29.501326198844524
  					],
  					[
  						34.823243288783814,
  						29.76108076171822
  					],
  					[
  						34.26543474464621,
  						31.21935730952032
  					],
  					[
  						35.126052687324545,
  						33.09090037691878
  					],
  					[
  						35.82110070165024,
  						33.2774264592763
  					],
  					[
  						35.71991824722275,
  						32.709192409794866
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Israel",
  			SOV_A3: "IS1",
  			ADM0_DIF: 1,
  			LEVEL: 2,
  			TYPE: "Country",
  			ADMIN: "Israel",
  			ADM0_A3: "ISR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Israel",
  			GU_A3: "ISR",
  			SU_DIF: 0,
  			SUBUNIT: "Israel",
  			SU_A3: "ISR",
  			BRK_DIFF: 0,
  			NAME: "Israel",
  			NAME_LONG: "Israel",
  			BRK_A3: "ISR",
  			BRK_NAME: "Israel",
  			BRK_GROUP: "",
  			ABBREV: "Isr.",
  			POSTAL: "IS",
  			FORMAL_EN: "State of Israel",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Israel",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Israel",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 9,
  			POP_EST: 8299706,
  			POP_RANK: 13,
  			GDP_MD_EST: 297000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "-99",
  			ISO_A2: "IL",
  			ISO_A3: "ISR",
  			ISO_A3_EH: "ISR",
  			ISO_N3: "376",
  			UN_A3: "376",
  			WB_A2: "IL",
  			WB_A3: "ISR",
  			WOE_ID: 23424852,
  			WOE_ID_EH: 23424852,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ISR",
  			ADM0_A3_US: "ISR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320895,
  			WIKIDATAID: "Q801",
  			NAME_AR: "إسرائيل",
  			NAME_BN: "ইসরায়েল",
  			NAME_DE: "Israel",
  			NAME_EN: "Israel",
  			NAME_ES: "Israel",
  			NAME_FR: "Israël",
  			NAME_EL: "Ισραήλ",
  			NAME_HI: "इज़राइल",
  			NAME_HU: "Izrael",
  			NAME_ID: "Israel",
  			NAME_IT: "Israele",
  			NAME_JA: "イスラエル",
  			NAME_KO: "이스라엘",
  			NAME_NL: "Israël",
  			NAME_PL: "Izrael",
  			NAME_PT: "Israel",
  			NAME_RU: "Израиль",
  			NAME_SV: "Israel",
  			NAME_TR: "İsrail",
  			NAME_VI: "Israel",
  			NAME_ZH: "以色列"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						35.82110070165024,
  						33.2774264592763
  					],
  					[
  						35.126052687324545,
  						33.09090037691878
  					],
  					[
  						35.99840254084364,
  						34.644914048800004
  					],
  					[
  						36.61175011571589,
  						34.20178864189718
  					],
  					[
  						35.82110070165024,
  						33.2774264592763
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Lebanon",
  			SOV_A3: "LBN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Lebanon",
  			ADM0_A3: "LBN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Lebanon",
  			GU_A3: "LBN",
  			SU_DIF: 0,
  			SUBUNIT: "Lebanon",
  			SU_A3: "LBN",
  			BRK_DIFF: 0,
  			NAME: "Lebanon",
  			NAME_LONG: "Lebanon",
  			BRK_A3: "LBN",
  			BRK_NAME: "Lebanon",
  			BRK_GROUP: "",
  			ABBREV: "Leb.",
  			POSTAL: "LB",
  			FORMAL_EN: "Lebanese Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Lebanon",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Lebanon",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 12,
  			POP_EST: 6229794,
  			POP_RANK: 13,
  			GDP_MD_EST: 85160,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1970,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LE",
  			ISO_A2: "LB",
  			ISO_A3: "LBN",
  			ISO_A3_EH: "LBN",
  			ISO_N3: "422",
  			UN_A3: "422",
  			WB_A2: "LB",
  			WB_A3: "LBN",
  			WOE_ID: 23424873,
  			WOE_ID_EH: 23424873,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LBN",
  			ADM0_A3_US: "LBN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: 4,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321013,
  			WIKIDATAID: "Q822",
  			NAME_AR: "لبنان",
  			NAME_BN: "লেবানন",
  			NAME_DE: "Libanon",
  			NAME_EN: "Lebanon",
  			NAME_ES: "Líbano",
  			NAME_FR: "Liban",
  			NAME_EL: "Λίβανος",
  			NAME_HI: "लेबनान",
  			NAME_HU: "Libanon",
  			NAME_ID: "Lebanon",
  			NAME_IT: "Libano",
  			NAME_JA: "レバノン",
  			NAME_KO: "레바논",
  			NAME_NL: "Libanon",
  			NAME_PL: "Liban",
  			NAME_PT: "Líbano",
  			NAME_RU: "Ливан",
  			NAME_SV: "Libanon",
  			NAME_TR: "Lübnan",
  			NAME_VI: "Liban",
  			NAME_ZH: "黎巴嫩"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						49.54351891459575,
  						-12.469832858940554
  					],
  					[
  						50.056510857957164,
  						-13.555761407121985
  					],
  					[
  						50.47653689962553,
  						-15.226512139550543
  					],
  					[
  						49.49861209493412,
  						-17.106035658438273
  					],
  					[
  						49.435618523970305,
  						-17.953064060134366
  					],
  					[
  						48.54854088724801,
  						-20.496888116134127
  					],
  					[
  						47.095761346226595,
  						-24.941629733990453
  					],
  					[
  						45.40950768411045,
  						-25.60143442149309
  					],
  					[
  						44.03972049334976,
  						-24.988345228782308
  					],
  					[
  						43.254187046081,
  						-22.057413018484123
  					],
  					[
  						43.43329756040464,
  						-21.33647511158019
  					],
  					[
  						44.37432539243966,
  						-20.07236622485639
  					],
  					[
  						44.46439741392439,
  						-19.435454196859048
  					],
  					[
  						43.96308434426091,
  						-17.409944756746782
  					],
  					[
  						44.4465173683514,
  						-16.216219170804507
  					],
  					[
  						46.31224327981721,
  						-15.780018405828798
  					],
  					[
  						47.70512983581236,
  						-14.594302666891764
  					],
  					[
  						49.54351891459575,
  						-12.469832858940554
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Madagascar",
  			SOV_A3: "MDG",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Madagascar",
  			ADM0_A3: "MDG",
  			GEOU_DIF: 0,
  			GEOUNIT: "Madagascar",
  			GU_A3: "MDG",
  			SU_DIF: 0,
  			SUBUNIT: "Madagascar",
  			SU_A3: "MDG",
  			BRK_DIFF: 0,
  			NAME: "Madagascar",
  			NAME_LONG: "Madagascar",
  			BRK_A3: "MDG",
  			BRK_NAME: "Madagascar",
  			BRK_GROUP: "",
  			ABBREV: "Mad.",
  			POSTAL: "MG",
  			FORMAL_EN: "Republic of Madagascar",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Madagascar",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Madagascar",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 3,
  			POP_EST: 25054161,
  			POP_RANK: 15,
  			GDP_MD_EST: 36860,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1993,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MA",
  			ISO_A2: "MG",
  			ISO_A3: "MDG",
  			ISO_A3_EH: "MDG",
  			ISO_N3: "450",
  			UN_A3: "450",
  			WB_A2: "MG",
  			WB_A3: "MDG",
  			WOE_ID: 23424883,
  			WOE_ID_EH: 23424883,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MDG",
  			ADM0_A3_US: "MDG",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159321051,
  			WIKIDATAID: "Q1019",
  			NAME_AR: "مدغشقر",
  			NAME_BN: "মাদাগাস্কার",
  			NAME_DE: "Madagaskar",
  			NAME_EN: "Madagascar",
  			NAME_ES: "Madagascar",
  			NAME_FR: "Madagascar",
  			NAME_EL: "Μαδαγασκάρη",
  			NAME_HI: "मेडागास्कर",
  			NAME_HU: "Madagaszkár",
  			NAME_ID: "Madagaskar",
  			NAME_IT: "Madagascar",
  			NAME_JA: "マダガスカル",
  			NAME_KO: "마다가스카르",
  			NAME_NL: "Madagaskar",
  			NAME_PL: "Madagaskar",
  			NAME_PT: "Madagáscar",
  			NAME_RU: "Мадагаскар",
  			NAME_SV: "Madagaskar",
  			NAME_TR: "Madagaskar",
  			NAME_VI: "Madagascar",
  			NAME_ZH: "马达加斯加"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						9.482139926805274,
  						30.307556057246188
  					],
  					[
  						9.05560265466815,
  						32.10269196220129
  					],
  					[
  						7.6126416357821824,
  						33.34411489514896
  					],
  					[
  						8.140981479534304,
  						34.65514598239379
  					],
  					[
  						8.420964389691676,
  						36.94642731378316
  					],
  					[
  						9.509993523810607,
  						37.349994411766545
  					],
  					[
  						10.939518670300687,
  						35.698984076473494
  					],
  					[
  						10.149592726287125,
  						34.33077301689771
  					],
  					[
  						11.488787469131012,
  						33.13699575452324
  					],
  					[
  						11.432253452203696,
  						32.368903103152874
  					],
  					[
  						9.950225050505082,
  						31.376069647745258
  					],
  					[
  						9.482139926805274,
  						30.307556057246188
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Tunisia",
  			SOV_A3: "TUN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Tunisia",
  			ADM0_A3: "TUN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Tunisia",
  			GU_A3: "TUN",
  			SU_DIF: 0,
  			SUBUNIT: "Tunisia",
  			SU_A3: "TUN",
  			BRK_DIFF: 0,
  			NAME: "Tunisia",
  			NAME_LONG: "Tunisia",
  			BRK_A3: "TUN",
  			BRK_NAME: "Tunisia",
  			BRK_GROUP: "",
  			ABBREV: "Tun.",
  			POSTAL: "TN",
  			FORMAL_EN: "Republic of Tunisia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Tunisia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Tunisia",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 2,
  			POP_EST: 11403800,
  			POP_RANK: 14,
  			GDP_MD_EST: 130800,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "TS",
  			ISO_A2: "TN",
  			ISO_A3: "TUN",
  			ISO_A3_EH: "TUN",
  			ISO_N3: "788",
  			UN_A3: "788",
  			WB_A2: "TN",
  			WB_A3: "TUN",
  			WOE_ID: 23424967,
  			WOE_ID_EH: 23424967,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "TUN",
  			ADM0_A3_US: "TUN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Northern Africa",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321327,
  			WIKIDATAID: "Q948",
  			NAME_AR: "تونس",
  			NAME_BN: "তিউনিসিয়া",
  			NAME_DE: "Tunesien",
  			NAME_EN: "Tunisia",
  			NAME_ES: "Túnez",
  			NAME_FR: "Tunisie",
  			NAME_EL: "Τυνησία",
  			NAME_HI: "ट्यूनिशिया",
  			NAME_HU: "Tunézia",
  			NAME_ID: "Tunisia",
  			NAME_IT: "Tunisia",
  			NAME_JA: "チュニジア",
  			NAME_KO: "튀니지",
  			NAME_NL: "Tunesië",
  			NAME_PL: "Tunezja",
  			NAME_PT: "Tunísia",
  			NAME_RU: "Тунис",
  			NAME_SV: "Tunisien",
  			NAME_TR: "Tunus",
  			NAME_VI: "Tunisia",
  			NAME_ZH: "突尼西亞"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-8.684399786809053,
  						27.395744126896005
  					],
  					[
  						-8.665589565454809,
  						27.656425889592356
  					],
  					[
  						-8.674116176782974,
  						28.84128896739658
  					],
  					[
  						-7.059227667661958,
  						29.5792284205246
  					],
  					[
  						-5.242129278982787,
  						30.00044302013559
  					],
  					[
  						-3.6904410465547244,
  						30.896951605751156
  					],
  					[
  						-3.647497931320146,
  						31.637294012980675
  					],
  					[
  						-1.30789913573787,
  						32.2628889023061
  					],
  					[
  						-1.792985805661715,
  						34.527918606091305
  					],
  					[
  						-2.169913702798624,
  						35.16839630791668
  					],
  					[
  						1.466918572606545,
  						36.605647081034405
  					],
  					[
  						4.81575809084913,
  						36.86503693292346
  					],
  					[
  						6.261819695672613,
  						37.11065501560674
  					],
  					[
  						8.420964389691676,
  						36.94642731378316
  					],
  					[
  						8.140981479534304,
  						34.65514598239379
  					],
  					[
  						7.6126416357821824,
  						33.34411489514896
  					],
  					[
  						9.05560265466815,
  						32.10269196220129
  					],
  					[
  						9.482139926805274,
  						30.307556057246188
  					],
  					[
  						9.859997999723447,
  						28.959989732371014
  					],
  					[
  						9.716285841519664,
  						26.512206325785655
  					],
  					[
  						9.319410841518163,
  						26.094324856057455
  					],
  					[
  						10.303846876678362,
  						24.379313259370917
  					],
  					[
  						10.771363559622927,
  						24.56253205006175
  					],
  					[
  						11.999505649471613,
  						23.47166840259645
  					],
  					[
  						8.572893100629784,
  						21.565660712159143
  					],
  					[
  						5.677565952180686,
  						19.601206976799716
  					],
  					[
  						4.267419467800039,
  						19.155265204337
  					],
  					[
  						3.1466610042539003,
  						19.693578599521445
  					],
  					[
  						-1.5500548974576134,
  						22.792665920497384
  					],
  					[
  						-4.923337368174231,
  						24.974574082941
  					],
  					[
  						-8.684399786809053,
  						27.395744126896005
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Algeria",
  			SOV_A3: "DZA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Algeria",
  			ADM0_A3: "DZA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Algeria",
  			GU_A3: "DZA",
  			SU_DIF: 0,
  			SUBUNIT: "Algeria",
  			SU_A3: "DZA",
  			BRK_DIFF: 0,
  			NAME: "Algeria",
  			NAME_LONG: "Algeria",
  			BRK_A3: "DZA",
  			BRK_NAME: "Algeria",
  			BRK_GROUP: "",
  			ABBREV: "Alg.",
  			POSTAL: "DZ",
  			FORMAL_EN: "People's Democratic Republic of Algeria",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Algeria",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Algeria",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 3,
  			POP_EST: 40969443,
  			POP_RANK: 15,
  			GDP_MD_EST: 609400,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2008,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "AG",
  			ISO_A2: "DZ",
  			ISO_A3: "DZA",
  			ISO_A3_EH: "DZA",
  			ISO_N3: "012",
  			UN_A3: "012",
  			WB_A2: "DZ",
  			WB_A3: "DZA",
  			WOE_ID: 23424740,
  			WOE_ID_EH: 23424740,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "DZA",
  			ADM0_A3_US: "DZA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Northern Africa",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159320565,
  			WIKIDATAID: "Q262",
  			NAME_AR: "الجزائر",
  			NAME_BN: "আলজেরিয়া",
  			NAME_DE: "Algerien",
  			NAME_EN: "Algeria",
  			NAME_ES: "Argelia",
  			NAME_FR: "Algérie",
  			NAME_EL: "Αλγερία",
  			NAME_HI: "अल्जीरिया",
  			NAME_HU: "Algéria",
  			NAME_ID: "Aljazair",
  			NAME_IT: "Algeria",
  			NAME_JA: "アルジェリア",
  			NAME_KO: "알제리",
  			NAME_NL: "Algerije",
  			NAME_PL: "Algieria",
  			NAME_PT: "Argélia",
  			NAME_RU: "Алжир",
  			NAME_SV: "Algeriet",
  			NAME_TR: "Cezayir",
  			NAME_VI: "Algérie",
  			NAME_ZH: "阿尔及利亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						35.54566531753454,
  						32.393992011030576
  					],
  					[
  						35.71991824722275,
  						32.709192409794866
  					],
  					[
  						36.834062127435544,
  						32.312937526980775
  					],
  					[
  						38.792340529136084,
  						33.378686428352225
  					],
  					[
  						39.19546837744497,
  						32.16100881604267
  					],
  					[
  						37.00216556168101,
  						31.508412990844747
  					],
  					[
  						37.998848911294374,
  						30.508499864213135
  					],
  					[
  						36.06894087092206,
  						29.197494615184453
  					],
  					[
  						34.95603722508426,
  						29.356554673778845
  					],
  					[
  						34.92260257339143,
  						29.501326198844524
  					],
  					[
  						35.397560662586045,
  						31.489086005167582
  					],
  					[
  						35.54566531753454,
  						32.393992011030576
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Jordan",
  			SOV_A3: "JOR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Jordan",
  			ADM0_A3: "JOR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Jordan",
  			GU_A3: "JOR",
  			SU_DIF: 0,
  			SUBUNIT: "Jordan",
  			SU_A3: "JOR",
  			BRK_DIFF: 0,
  			NAME: "Jordan",
  			NAME_LONG: "Jordan",
  			BRK_A3: "JOR",
  			BRK_NAME: "Jordan",
  			BRK_GROUP: "",
  			ABBREV: "Jord.",
  			POSTAL: "J",
  			FORMAL_EN: "Hashemite Kingdom of Jordan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Jordan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Jordan",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 4,
  			POP_EST: 10248069,
  			POP_RANK: 14,
  			GDP_MD_EST: 86190,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "JO",
  			ISO_A2: "JO",
  			ISO_A3: "JOR",
  			ISO_A3_EH: "JOR",
  			ISO_N3: "400",
  			UN_A3: "400",
  			WB_A2: "JO",
  			WB_A3: "JOR",
  			WOE_ID: 23424860,
  			WOE_ID_EH: 23424860,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "JOR",
  			ADM0_A3_US: "JOR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320935,
  			WIKIDATAID: "Q810",
  			NAME_AR: "الأردن",
  			NAME_BN: "জর্দান",
  			NAME_DE: "Jordanien",
  			NAME_EN: "Jordan",
  			NAME_ES: "Jordania",
  			NAME_FR: "Jordanie",
  			NAME_EL: "Ιορδανία",
  			NAME_HI: "जॉर्डन",
  			NAME_HU: "Jordánia",
  			NAME_ID: "Yordania",
  			NAME_IT: "Giordania",
  			NAME_JA: "ヨルダン",
  			NAME_KO: "요르단",
  			NAME_NL: "Jordanië",
  			NAME_PL: "Jordania",
  			NAME_PT: "Jordânia",
  			NAME_RU: "Иордания",
  			NAME_SV: "Jordanien",
  			NAME_TR: "Ürdün",
  			NAME_VI: "Jordan",
  			NAME_ZH: "约旦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						51.57951867046327,
  						24.245497137951105
  					],
  					[
  						54.00800092958758,
  						24.121757920828216
  					],
  					[
  						56.07082075381456,
  						26.05546417897398
  					],
  					[
  						56.261041701080956,
  						25.71460643157677
  					],
  					[
  						56.396847365144005,
  						24.924732163995486
  					],
  					[
  						55.804118686756226,
  						24.269604193615265
  					],
  					[
  						55.208341098863194,
  						22.708329982997046
  					],
  					[
  						55.006803012924905,
  						22.496947536707136
  					],
  					[
  						52.000733270074335,
  						23.00115448657894
  					],
  					[
  						51.57951867046327,
  						24.245497137951105
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "United Arab Emirates",
  			SOV_A3: "ARE",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "United Arab Emirates",
  			ADM0_A3: "ARE",
  			GEOU_DIF: 0,
  			GEOUNIT: "United Arab Emirates",
  			GU_A3: "ARE",
  			SU_DIF: 0,
  			SUBUNIT: "United Arab Emirates",
  			SU_A3: "ARE",
  			BRK_DIFF: 0,
  			NAME: "United Arab Emirates",
  			NAME_LONG: "United Arab Emirates",
  			BRK_A3: "ARE",
  			BRK_NAME: "United Arab Emirates",
  			BRK_GROUP: "",
  			ABBREV: "U.A.E.",
  			POSTAL: "AE",
  			FORMAL_EN: "United Arab Emirates",
  			FORMAL_FR: "",
  			NAME_CIAWF: "United Arab Emirates",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "United Arab Emirates",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 3,
  			POP_EST: 6072475,
  			POP_RANK: 13,
  			GDP_MD_EST: 667200,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "AE",
  			ISO_A2: "AE",
  			ISO_A3: "ARE",
  			ISO_A3_EH: "ARE",
  			ISO_N3: "784",
  			UN_A3: "784",
  			WB_A2: "AE",
  			WB_A3: "ARE",
  			WOE_ID: 23424738,
  			WOE_ID_EH: 23424738,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ARE",
  			ADM0_A3_US: "ARE",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 20,
  			LONG_LEN: 20,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320329,
  			WIKIDATAID: "Q878",
  			NAME_AR: "الإمارات العربية المتحدة",
  			NAME_BN: "সংযুক্ত আরব আমিরাত",
  			NAME_DE: "Vereinigte Arabische Emirate",
  			NAME_EN: "United Arab Emirates",
  			NAME_ES: "Emiratos Árabes Unidos",
  			NAME_FR: "Émirats arabes unis",
  			NAME_EL: "Ηνωμένα Αραβικά Εμιράτα",
  			NAME_HI: "संयुक्त अरब अमीरात",
  			NAME_HU: "Egyesült Arab Emírségek",
  			NAME_ID: "Uni Emirat Arab",
  			NAME_IT: "Emirati Arabi Uniti",
  			NAME_JA: "アラブ首長国連邦",
  			NAME_KO: "아랍에미리트",
  			NAME_NL: "Verenigde Arabische Emiraten",
  			NAME_PL: "Zjednoczone Emiraty Arabskie",
  			NAME_PT: "Emirados Árabes Unidos",
  			NAME_RU: "Объединённые Арабские Эмираты",
  			NAME_SV: "Förenade Arabemiraten",
  			NAME_TR: "Birleşik Arap Emirlikleri",
  			NAME_VI: "Các Tiểu vương quốc Ả Rập Thống nhất",
  			NAME_ZH: "阿拉伯联合酋长国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						47.974519077349896,
  						29.975819200148504
  					],
  					[
  						48.416094191283946,
  						28.55200429942667
  					],
  					[
  						46.568713413281756,
  						29.09902517345229
  					],
  					[
  						47.30262210469096,
  						30.059069932570722
  					],
  					[
  						47.974519077349896,
  						29.975819200148504
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Kuwait",
  			SOV_A3: "KWT",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Kuwait",
  			ADM0_A3: "KWT",
  			GEOU_DIF: 0,
  			GEOUNIT: "Kuwait",
  			GU_A3: "KWT",
  			SU_DIF: 0,
  			SUBUNIT: "Kuwait",
  			SU_A3: "KWT",
  			BRK_DIFF: 0,
  			NAME: "Kuwait",
  			NAME_LONG: "Kuwait",
  			BRK_A3: "KWT",
  			BRK_NAME: "Kuwait",
  			BRK_GROUP: "",
  			ABBREV: "Kwt.",
  			POSTAL: "KW",
  			FORMAL_EN: "State of Kuwait",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Kuwait",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Kuwait",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 2,
  			POP_EST: 2875422,
  			POP_RANK: 12,
  			GDP_MD_EST: 301100,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "KU",
  			ISO_A2: "KW",
  			ISO_A3: "KWT",
  			ISO_A3_EH: "KWT",
  			ISO_N3: "414",
  			UN_A3: "414",
  			WB_A2: "KW",
  			WB_A3: "KWT",
  			WOE_ID: 23424870,
  			WOE_ID_EH: 23424870,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "KWT",
  			ADM0_A3_US: "KWT",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321009,
  			WIKIDATAID: "Q817",
  			NAME_AR: "الكويت",
  			NAME_BN: "কুয়েত",
  			NAME_DE: "Kuwait",
  			NAME_EN: "Kuwait",
  			NAME_ES: "Kuwait",
  			NAME_FR: "Koweït",
  			NAME_EL: "Κουβέιτ",
  			NAME_HI: "कुवैत",
  			NAME_HU: "Kuvait",
  			NAME_ID: "Kuwait",
  			NAME_IT: "Kuwait",
  			NAME_JA: "クウェート",
  			NAME_KO: "쿠웨이트",
  			NAME_NL: "Koeweit",
  			NAME_PL: "Kuwejt",
  			NAME_PT: "Kuwait",
  			NAME_RU: "Кувейт",
  			NAME_SV: "Kuwait",
  			NAME_TR: "Kuveyt",
  			NAME_VI: "Kuwait",
  			NAME_ZH: "科威特"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						39.19546837744497,
  						32.16100881604267
  					],
  					[
  						38.792340529136084,
  						33.378686428352225
  					],
  					[
  						41.006158888519934,
  						34.41937226006212
  					],
  					[
  						41.289707472505455,
  						36.35881460219227
  					],
  					[
  						42.34959109881177,
  						37.2298725449041
  					],
  					[
  						44.77267710159504,
  						37.17043692561684
  					],
  					[
  						45.42061811705321,
  						35.977545884742824
  					],
  					[
  						46.0763403664048,
  						35.67738332777549
  					],
  					[
  						45.41669070819904,
  						33.967797756479584
  					],
  					[
  						46.10936160663932,
  						33.017287299119005
  					],
  					[
  						47.33466149271191,
  						32.46915538179911
  					],
  					[
  						47.8492037290421,
  						31.70917593029867
  					],
  					[
  						47.68528608581227,
  						30.984853217079632
  					],
  					[
  						48.567971225789755,
  						29.926778265903522
  					],
  					[
  						47.974519077349896,
  						29.975819200148504
  					],
  					[
  						47.30262210469096,
  						30.059069932570722
  					],
  					[
  						46.568713413281756,
  						29.09902517345229
  					],
  					[
  						44.70949873228474,
  						29.178891099559383
  					],
  					[
  						41.889980910007836,
  						31.19000865327837
  					],
  					[
  						39.19546837744497,
  						32.16100881604267
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Iraq",
  			SOV_A3: "IRQ",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Iraq",
  			ADM0_A3: "IRQ",
  			GEOU_DIF: 0,
  			GEOUNIT: "Iraq",
  			GU_A3: "IRQ",
  			SU_DIF: 0,
  			SUBUNIT: "Iraq",
  			SU_A3: "IRQ",
  			BRK_DIFF: 0,
  			NAME: "Iraq",
  			NAME_LONG: "Iraq",
  			BRK_A3: "IRQ",
  			BRK_NAME: "Iraq",
  			BRK_GROUP: "",
  			ABBREV: "Iraq",
  			POSTAL: "IRQ",
  			FORMAL_EN: "Republic of Iraq",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Iraq",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Iraq",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 1,
  			POP_EST: 39192111,
  			POP_RANK: 15,
  			GDP_MD_EST: 596700,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1997,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "IZ",
  			ISO_A2: "IQ",
  			ISO_A3: "IRQ",
  			ISO_A3_EH: "IRQ",
  			ISO_N3: "368",
  			UN_A3: "368",
  			WB_A2: "IQ",
  			WB_A3: "IRQ",
  			WOE_ID: 23424855,
  			WOE_ID_EH: 23424855,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "IRQ",
  			ADM0_A3_US: "IRQ",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 4,
  			LONG_LEN: 4,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7.5,
  			NE_ID: 1159320887,
  			WIKIDATAID: "Q796",
  			NAME_AR: "العراق",
  			NAME_BN: "ইরাক",
  			NAME_DE: "Irak",
  			NAME_EN: "Iraq",
  			NAME_ES: "Irak",
  			NAME_FR: "Irak",
  			NAME_EL: "Ιράκ",
  			NAME_HI: "इराक़",
  			NAME_HU: "Irak",
  			NAME_ID: "Irak",
  			NAME_IT: "Iraq",
  			NAME_JA: "イラク",
  			NAME_KO: "이라크",
  			NAME_NL: "Irak",
  			NAME_PL: "Irak",
  			NAME_PT: "Iraque",
  			NAME_RU: "Ирак",
  			NAME_SV: "Irak",
  			NAME_TR: "Irak",
  			NAME_VI: "Iraq",
  			NAME_ZH: "伊拉克"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						55.208341098863194,
  						22.708329982997046
  					],
  					[
  						55.804118686756226,
  						24.269604193615265
  					],
  					[
  						56.396847365144005,
  						24.924732163995486
  					],
  					[
  						57.4034525897574,
  						23.878594468678813
  					],
  					[
  						58.72921146020542,
  						23.56566783293536
  					],
  					[
  						59.806148309168066,
  						22.310524807214193
  					],
  					[
  						58.48798587426694,
  						20.428985907467094
  					],
  					[
  						57.665762160070955,
  						19.73600495043307
  					],
  					[
  						57.788700392493325,
  						19.067570298737678
  					],
  					[
  						56.60965091332193,
  						18.574267076079465
  					],
  					[
  						56.28352094912793,
  						17.876066799383963
  					],
  					[
  						55.27490034365513,
  						17.22835439703762
  					],
  					[
  						53.10857262554751,
  						16.651051133688952
  					],
  					[
  						52.00000980002224,
  						19.000003363516058
  					],
  					[
  						54.99998172386236,
  						19.999994004796108
  					],
  					[
  						55.666659376859826,
  						22.00000112557234
  					],
  					[
  						55.208341098863194,
  						22.708329982997046
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Oman",
  			SOV_A3: "OMN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Oman",
  			ADM0_A3: "OMN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Oman",
  			GU_A3: "OMN",
  			SU_DIF: 0,
  			SUBUNIT: "Oman",
  			SU_A3: "OMN",
  			BRK_DIFF: 0,
  			NAME: "Oman",
  			NAME_LONG: "Oman",
  			BRK_A3: "OMN",
  			BRK_NAME: "Oman",
  			BRK_GROUP: "",
  			ABBREV: "Oman",
  			POSTAL: "OM",
  			FORMAL_EN: "Sultanate of Oman",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Oman",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Oman",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 6,
  			POP_EST: 3424386,
  			POP_RANK: 12,
  			GDP_MD_EST: 173100,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MU",
  			ISO_A2: "OM",
  			ISO_A3: "OMN",
  			ISO_A3_EH: "OMN",
  			ISO_N3: "512",
  			UN_A3: "512",
  			WB_A2: "OM",
  			WB_A3: "OMN",
  			WOE_ID: 23424898,
  			WOE_ID_EH: 23424898,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "OMN",
  			ADM0_A3_US: "OMN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 4,
  			LONG_LEN: 4,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321151,
  			WIKIDATAID: "Q842",
  			NAME_AR: "سلطنة عمان",
  			NAME_BN: "ওমান",
  			NAME_DE: "Oman",
  			NAME_EN: "Oman",
  			NAME_ES: "Omán",
  			NAME_FR: "Oman",
  			NAME_EL: "Ομάν",
  			NAME_HI: "ओमान",
  			NAME_HU: "Omán",
  			NAME_ID: "Oman",
  			NAME_IT: "Oman",
  			NAME_JA: "オマーン",
  			NAME_KO: "오만",
  			NAME_NL: "Oman",
  			NAME_PL: "Oman",
  			NAME_PT: "Omã",
  			NAME_RU: "Оман",
  			NAME_SV: "Oman",
  			NAME_TR: "Umman",
  			NAME_VI: "Oman",
  			NAME_ZH: "阿曼"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						102.5849324890267,
  						12.186594956913282
  					],
  					[
  						102.34809939983302,
  						13.394247341358223
  					],
  					[
  						102.98842207236163,
  						14.225721136934467
  					],
  					[
  						105.21877689007889,
  						14.273211778210694
  					],
  					[
  						106.04394616091552,
  						13.881091009979956
  					],
  					[
  						106.49637332563088,
  						14.570583807834282
  					],
  					[
  						107.38272749230109,
  						14.202440904186972
  					],
  					[
  						107.49140302941089,
  						12.337205918827948
  					],
  					[
  						105.81052371625313,
  						11.567614650921229
  					],
  					[
  						104.33433475140347,
  						10.48654368737523
  					],
  					[
  						103.4972799011397,
  						10.632555446815928
  					],
  					[
  						102.5849324890267,
  						12.186594956913282
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Cambodia",
  			SOV_A3: "KHM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Cambodia",
  			ADM0_A3: "KHM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Cambodia",
  			GU_A3: "KHM",
  			SU_DIF: 0,
  			SUBUNIT: "Cambodia",
  			SU_A3: "KHM",
  			BRK_DIFF: 0,
  			NAME: "Cambodia",
  			NAME_LONG: "Cambodia",
  			BRK_A3: "KHM",
  			BRK_NAME: "Cambodia",
  			BRK_GROUP: "",
  			ABBREV: "Camb.",
  			POSTAL: "KH",
  			FORMAL_EN: "Kingdom of Cambodia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Cambodia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Cambodia",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 5,
  			POP_EST: 16204486,
  			POP_RANK: 14,
  			GDP_MD_EST: 58940,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2008,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CB",
  			ISO_A2: "KH",
  			ISO_A3: "KHM",
  			ISO_A3_EH: "KHM",
  			ISO_N3: "116",
  			UN_A3: "116",
  			WB_A2: "KH",
  			WB_A3: "KHM",
  			WOE_ID: 23424776,
  			WOE_ID_EH: 23424776,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "KHM",
  			ADM0_A3_US: "KHM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "South-Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320979,
  			WIKIDATAID: "Q424",
  			NAME_AR: "كمبوديا",
  			NAME_BN: "কম্বোডিয়া",
  			NAME_DE: "Kambodscha",
  			NAME_EN: "Cambodia",
  			NAME_ES: "Camboya",
  			NAME_FR: "Cambodge",
  			NAME_EL: "Καμπότζη",
  			NAME_HI: "कम्बोडिया",
  			NAME_HU: "Kambodzsa",
  			NAME_ID: "Kamboja",
  			NAME_IT: "Cambogia",
  			NAME_JA: "カンボジア",
  			NAME_KO: "캄보디아",
  			NAME_NL: "Cambodja",
  			NAME_PL: "Kambodża",
  			NAME_PT: "Camboja",
  			NAME_RU: "Камбоджа",
  			NAME_SV: "Kambodja",
  			NAME_TR: "Kamboçya",
  			NAME_VI: "Campuchia",
  			NAME_ZH: "柬埔寨"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						105.21877689007889,
  						14.273211778210694
  					],
  					[
  						102.98842207236163,
  						14.225721136934467
  					],
  					[
  						102.34809939983302,
  						13.394247341358223
  					],
  					[
  						102.5849324890267,
  						12.186594956913282
  					],
  					[
  						100.9784672383692,
  						13.412721665902566
  					],
  					[
  						100.09779747925111,
  						13.406856390837433
  					],
  					[
  						100.01873253784456,
  						12.307001044153354
  					],
  					[
  						99.15377241414316,
  						9.963061428258555
  					],
  					[
  						99.87383182169813,
  						9.20786204674512
  					],
  					[
  						100.45927412313276,
  						7.429572658717177
  					],
  					[
  						102.14118696493638,
  						6.221636053894628
  					],
  					[
  						101.81428185425798,
  						5.8108084171742425
  					],
  					[
  						100.0857568705271,
  						6.4644894474502905
  					],
  					[
  						98.503786248776,
  						8.382305202666288
  					],
  					[
  						98.55355065307305,
  						9.932959906448545
  					],
  					[
  						99.58728600463972,
  						11.892762762901697
  					],
  					[
  						99.09775516153876,
  						13.827502549693278
  					],
  					[
  						98.43081912637987,
  						14.622027696180837
  					],
  					[
  						98.90334842325676,
  						16.17782420497612
  					],
  					[
  						97.85912275593486,
  						17.567946071843664
  					],
  					[
  						97.79778283080441,
  						18.627080389881755
  					],
  					[
  						98.25372399291561,
  						19.708203029860044
  					],
  					[
  						100.11598758341785,
  						20.417849636308187
  					],
  					[
  						100.60629357300316,
  						19.508344427971224
  					],
  					[
  						101.2820146016517,
  						19.462584947176765
  					],
  					[
  						101.05954756063517,
  						17.51249725999449
  					],
  					[
  						102.11359175009248,
  						18.109101670804165
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
  						15.570316066952858
  					],
  					[
  						105.21877689007889,
  						14.273211778210694
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Thailand",
  			SOV_A3: "THA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Thailand",
  			ADM0_A3: "THA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Thailand",
  			GU_A3: "THA",
  			SU_DIF: 0,
  			SUBUNIT: "Thailand",
  			SU_A3: "THA",
  			BRK_DIFF: 0,
  			NAME: "Thailand",
  			NAME_LONG: "Thailand",
  			BRK_A3: "THA",
  			BRK_NAME: "Thailand",
  			BRK_GROUP: "",
  			ABBREV: "Thai.",
  			POSTAL: "TH",
  			FORMAL_EN: "Kingdom of Thailand",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Thailand",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Thailand",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 8,
  			MAPCOLOR13: 1,
  			POP_EST: 68414135,
  			POP_RANK: 16,
  			GDP_MD_EST: 1161000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "TH",
  			ISO_A2: "TH",
  			ISO_A3: "THA",
  			ISO_A3_EH: "THA",
  			ISO_N3: "764",
  			UN_A3: "764",
  			WB_A2: "TH",
  			WB_A3: "THA",
  			WOE_ID: 23424960,
  			WOE_ID_EH: 23424960,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "THA",
  			ADM0_A3_US: "THA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "South-Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321305,
  			WIKIDATAID: "Q869",
  			NAME_AR: "تايلاند",
  			NAME_BN: "থাইল্যান্ড",
  			NAME_DE: "Thailand",
  			NAME_EN: "Thailand",
  			NAME_ES: "Tailandia",
  			NAME_FR: "Thaïlande",
  			NAME_EL: "Ταϊλάνδη",
  			NAME_HI: "थाईलैण्ड",
  			NAME_HU: "Thaiföld",
  			NAME_ID: "Thailand",
  			NAME_IT: "Thailandia",
  			NAME_JA: "タイ王国",
  			NAME_KO: "태국",
  			NAME_NL: "Thailand",
  			NAME_PL: "Tajlandia",
  			NAME_PT: "Tailândia",
  			NAME_RU: "Таиланд",
  			NAME_SV: "Thailand",
  			NAME_TR: "Tayland",
  			NAME_VI: "Thái Lan",
  			NAME_ZH: "泰国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						107.38272749230109,
  						14.202440904186972
  					],
  					[
  						106.49637332563088,
  						14.570583807834282
  					],
  					[
  						106.04394616091552,
  						13.881091009979956
  					],
  					[
  						105.21877689007889,
  						14.273211778210694
  					],
  					[
  						105.58903852745016,
  						15.570316066952858
  					],
  					[
  						104.7793205098688,
  						16.44186493577145
  					],
  					[
  						104.7169470560925,
  						17.42885895433008
  					],
  					[
  						103.9564766784853,
  						18.24095408779688
  					],
  					[
  						102.11359175009248,
  						18.109101670804165
  					],
  					[
  						101.05954756063517,
  						17.51249725999449
  					],
  					[
  						101.2820146016517,
  						19.462584947176765
  					],
  					[
  						100.60629357300316,
  						19.508344427971224
  					],
  					[
  						100.11598758341785,
  						20.417849636308187
  					],
  					[
  						101.18000532430754,
  						21.436572984294028
  					],
  					[
  						102.17043582561358,
  						22.464753119389304
  					],
  					[
  						103.20386111858645,
  						20.76656220141375
  					],
  					[
  						104.43500044150805,
  						20.75873322192153
  					],
  					[
  						104.8225736836971,
  						19.886641750563882
  					],
  					[
  						103.89653201702671,
  						19.265180975821806
  					],
  					[
  						105.09459842328152,
  						18.66697459561108
  					],
  					[
  						107.5645251811039,
  						15.20217316330556
  					],
  					[
  						107.38272749230109,
  						14.202440904186972
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Laos",
  			SOV_A3: "LAO",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Laos",
  			ADM0_A3: "LAO",
  			GEOU_DIF: 0,
  			GEOUNIT: "Laos",
  			GU_A3: "LAO",
  			SU_DIF: 0,
  			SUBUNIT: "Laos",
  			SU_A3: "LAO",
  			BRK_DIFF: 0,
  			NAME: "Laos",
  			NAME_LONG: "Lao PDR",
  			BRK_A3: "LAO",
  			BRK_NAME: "Laos",
  			BRK_GROUP: "",
  			ABBREV: "Laos",
  			POSTAL: "LA",
  			FORMAL_EN: "Lao People's Democratic Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Laos",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Lao PDR",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 9,
  			POP_EST: 7126706,
  			POP_RANK: 13,
  			GDP_MD_EST: 40960,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2005,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LA",
  			ISO_A2: "LA",
  			ISO_A3: "LAO",
  			ISO_A3_EH: "LAO",
  			ISO_N3: "418",
  			UN_A3: "418",
  			WB_A2: "LA",
  			WB_A3: "LAO",
  			WOE_ID: 23424872,
  			WOE_ID_EH: 23424872,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LAO",
  			ADM0_A3_US: "LAO",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "South-Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 4,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321011,
  			WIKIDATAID: "Q819",
  			NAME_AR: "لاوس",
  			NAME_BN: "লাওস",
  			NAME_DE: "Laos",
  			NAME_EN: "Laos",
  			NAME_ES: "Laos",
  			NAME_FR: "Laos",
  			NAME_EL: "Λάος",
  			NAME_HI: "लाओस",
  			NAME_HU: "Laosz",
  			NAME_ID: "Laos",
  			NAME_IT: "Laos",
  			NAME_JA: "ラオス",
  			NAME_KO: "라오스",
  			NAME_NL: "Laos",
  			NAME_PL: "Laos",
  			NAME_PT: "Laos",
  			NAME_RU: "Лаос",
  			NAME_SV: "Laos",
  			NAME_TR: "Laos",
  			NAME_VI: "Lào",
  			NAME_ZH: "老挝"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						100.11598758341785,
  						20.417849636308187
  					],
  					[
  						98.25372399291561,
  						19.708203029860044
  					],
  					[
  						97.79778283080441,
  						18.627080389881755
  					],
  					[
  						97.85912275593486,
  						17.567946071843664
  					],
  					[
  						98.90334842325676,
  						16.17782420497612
  					],
  					[
  						98.43081912637987,
  						14.622027696180837
  					],
  					[
  						99.09775516153876,
  						13.827502549693278
  					],
  					[
  						99.58728600463972,
  						11.892762762901697
  					],
  					[
  						98.55355065307305,
  						9.932959906448545
  					],
  					[
  						98.76454552612078,
  						11.441291612183749
  					],
  					[
  						98.50957400919268,
  						13.122377631070677
  					],
  					[
  						98.1036039571077,
  						13.640459703012851
  					],
  					[
  						97.59707156778276,
  						16.10056793869977
  					],
  					[
  						97.1645398294998,
  						16.92873444260934
  					],
  					[
  						95.3693522481124,
  						15.7143899601826
  					],
  					[
  						94.18880415240454,
  						16.037936102762018
  					],
  					[
  						94.53348595579135,
  						17.277240301985728
  					],
  					[
  						94.32481652219676,
  						18.2135139022499
  					],
  					[
  						92.36855350135562,
  						20.670883287025347
  					],
  					[
  						92.67272098182556,
  						22.041238918541254
  					],
  					[
  						93.16612755734837,
  						22.278459580977103
  					],
  					[
  						93.3251876159428,
  						24.078556423432204
  					],
  					[
  						94.10674197792507,
  						23.85074087167348
  					],
  					[
  						95.1551534362626,
  						26.001307277932085
  					],
  					[
  						95.12476769407496,
  						26.5735720891323
  					],
  					[
  						97.0519885599681,
  						27.69905894623315
  					],
  					[
  						97.32711388549004,
  						28.26158274994634
  					],
  					[
  						97.91198774616944,
  						28.335945136014345
  					],
  					[
  						98.68269005737046,
  						27.50881216075062
  					],
  					[
  						98.67183800658916,
  						25.918702500913525
  					],
  					[
  						97.72460900267914,
  						25.083637193293
  					],
  					[
  						97.60471967976198,
  						23.897404690033042
  					],
  					[
  						98.66026248575577,
  						24.063286037689966
  					],
  					[
  						99.24089887898725,
  						22.11831431730458
  					],
  					[
  						101.18000532430754,
  						21.436572984294028
  					],
  					[
  						100.11598758341785,
  						20.417849636308187
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Myanmar",
  			SOV_A3: "MMR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Myanmar",
  			ADM0_A3: "MMR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Myanmar",
  			GU_A3: "MMR",
  			SU_DIF: 0,
  			SUBUNIT: "Myanmar",
  			SU_A3: "MMR",
  			BRK_DIFF: 0,
  			NAME: "Myanmar",
  			NAME_LONG: "Myanmar",
  			BRK_A3: "MMR",
  			BRK_NAME: "Myanmar",
  			BRK_GROUP: "",
  			ABBREV: "Myan.",
  			POSTAL: "MM",
  			FORMAL_EN: "Republic of the Union of Myanmar",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Burma",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Myanmar",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 13,
  			POP_EST: 55123814,
  			POP_RANK: 16,
  			GDP_MD_EST: 311100,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1983,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BM",
  			ISO_A2: "MM",
  			ISO_A3: "MMR",
  			ISO_A3_EH: "MMR",
  			ISO_N3: "104",
  			UN_A3: "104",
  			WB_A2: "MM",
  			WB_A3: "MMR",
  			WOE_ID: 23424763,
  			WOE_ID_EH: 23424763,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MMR",
  			ADM0_A3_US: "MMR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "South-Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321067,
  			WIKIDATAID: "Q836",
  			NAME_AR: "ميانمار",
  			NAME_BN: "মায়ানমার",
  			NAME_DE: "Myanmar",
  			NAME_EN: "Myanmar",
  			NAME_ES: "Birmania",
  			NAME_FR: "Birmanie",
  			NAME_EL: "Μιανμάρ",
  			NAME_HI: "म्यान्मार",
  			NAME_HU: "Mianmar",
  			NAME_ID: "Myanmar",
  			NAME_IT: "Birmania",
  			NAME_JA: "ミャンマー",
  			NAME_KO: "미얀마",
  			NAME_NL: "Myanmar",
  			NAME_PL: "Mjanma",
  			NAME_PT: "Mianmar",
  			NAME_RU: "Мьянма",
  			NAME_SV: "Burma",
  			NAME_TR: "Myanmar",
  			NAME_VI: "Myanma",
  			NAME_ZH: "缅甸"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						104.33433475140347,
  						10.48654368737523
  					],
  					[
  						105.81052371625313,
  						11.567614650921229
  					],
  					[
  						107.49140302941089,
  						12.337205918827948
  					],
  					[
  						107.38272749230109,
  						14.202440904186972
  					],
  					[
  						107.5645251811039,
  						15.20217316330556
  					],
  					[
  						105.09459842328152,
  						18.66697459561108
  					],
  					[
  						103.89653201702671,
  						19.265180975821806
  					],
  					[
  						104.8225736836971,
  						19.886641750563882
  					],
  					[
  						104.43500044150805,
  						20.75873322192153
  					],
  					[
  						103.20386111858645,
  						20.76656220141375
  					],
  					[
  						102.17043582561358,
  						22.464753119389304
  					],
  					[
  						104.47685835166448,
  						22.819150092046968
  					],
  					[
  						105.32920942588663,
  						23.352063300056912
  					],
  					[
  						106.72540327354847,
  						22.79426788989842
  					],
  					[
  						107.04342003787264,
  						21.811898912029914
  					],
  					[
  						108.05018029178294,
  						21.55237986906012
  					],
  					[
  						106.7150679870901,
  						20.69685069425202
  					],
  					[
  						105.66200564984631,
  						19.05816518806057
  					],
  					[
  						107.36195356651974,
  						16.697456569887052
  					],
  					[
  						108.87710656131748,
  						15.27669057867044
  					],
  					[
  						109.33526981001722,
  						13.426028347217724
  					],
  					[
  						109.20013593957398,
  						11.666859239137764
  					],
  					[
  						107.22092858279524,
  						10.364483954301832
  					],
  					[
  						105.15826378786511,
  						8.599759629750494
  					],
  					[
  						105.07620161338562,
  						9.918490505406808
  					],
  					[
  						104.33433475140347,
  						10.48654368737523
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Vietnam",
  			SOV_A3: "VNM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Vietnam",
  			ADM0_A3: "VNM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Vietnam",
  			GU_A3: "VNM",
  			SU_DIF: 0,
  			SUBUNIT: "Vietnam",
  			SU_A3: "VNM",
  			BRK_DIFF: 0,
  			NAME: "Vietnam",
  			NAME_LONG: "Vietnam",
  			BRK_A3: "VNM",
  			BRK_NAME: "Vietnam",
  			BRK_GROUP: "",
  			ABBREV: "Viet.",
  			POSTAL: "VN",
  			FORMAL_EN: "Socialist Republic of Vietnam",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Vietnam",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Vietnam",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 4,
  			POP_EST: 96160163,
  			POP_RANK: 16,
  			GDP_MD_EST: 594900,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "VM",
  			ISO_A2: "VN",
  			ISO_A3: "VNM",
  			ISO_A3_EH: "VNM",
  			ISO_N3: "704",
  			UN_A3: "704",
  			WB_A2: "VN",
  			WB_A3: "VNM",
  			WOE_ID: 23424984,
  			WOE_ID_EH: 23424984,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "VNM",
  			ADM0_A3_US: "VNM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "South-Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 5,
  			TINY: 2,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2,
  			MAX_LABEL: 7,
  			NE_ID: 1159321417,
  			WIKIDATAID: "Q881",
  			NAME_AR: "فيتنام",
  			NAME_BN: "ভিয়েতনাম",
  			NAME_DE: "Vietnam",
  			NAME_EN: "Vietnam",
  			NAME_ES: "Vietnam",
  			NAME_FR: "Viêt Nam",
  			NAME_EL: "Βιετνάμ",
  			NAME_HI: "वियतनाम",
  			NAME_HU: "Vietnám",
  			NAME_ID: "Vietnam",
  			NAME_IT: "Vietnam",
  			NAME_JA: "ベトナム",
  			NAME_KO: "베트남",
  			NAME_NL: "Vietnam",
  			NAME_PL: "Wietnam",
  			NAME_PT: "Vietname",
  			NAME_RU: "Вьетнам",
  			NAME_SV: "Vietnam",
  			NAME_TR: "Vietnam",
  			NAME_VI: "Việt Nam",
  			NAME_ZH: "越南"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						130.63999970690955,
  						42.39502427522179
  					],
  					[
  						130.77999231657833,
  						42.22000960427719
  					],
  					[
  						129.66736209525482,
  						41.60110443782523
  					],
  					[
  						129.70518924369247,
  						40.88282786718433
  					],
  					[
  						127.53343550019417,
  						39.7568500839767
  					],
  					[
  						128.34971642467661,
  						38.61224294692785
  					],
  					[
  						126.17475874237624,
  						37.74968577732804
  					],
  					[
  						124.71216067921938,
  						38.10834605564979
  					],
  					[
  						125.3865897970606,
  						39.387957872061165
  					],
  					[
  						124.26562462778531,
  						39.928493353834156
  					],
  					[
  						126.18204511932943,
  						41.10733612727637
  					],
  					[
  						126.86908328664987,
  						41.81656932226619
  					],
  					[
  						129.59666873587952,
  						42.42498179785456
  					],
  					[
  						130.63999970690955,
  						42.39502427522179
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "North Korea",
  			SOV_A3: "PRK",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "North Korea",
  			ADM0_A3: "PRK",
  			GEOU_DIF: 0,
  			GEOUNIT: "North Korea",
  			GU_A3: "PRK",
  			SU_DIF: 0,
  			SUBUNIT: "North Korea",
  			SU_A3: "PRK",
  			BRK_DIFF: 0,
  			NAME: "North Korea",
  			NAME_LONG: "Dem. Rep. Korea",
  			BRK_A3: "PRK",
  			BRK_NAME: "Dem. Rep. Korea",
  			BRK_GROUP: "",
  			ABBREV: "N.K.",
  			POSTAL: "KP",
  			FORMAL_EN: "Democratic People's Republic of Korea",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Korea, North",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Korea, Dem. Rep.",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 9,
  			POP_EST: 25248140,
  			POP_RANK: 15,
  			GDP_MD_EST: 40000,
  			POP_YEAR: 2013,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "KN",
  			ISO_A2: "KP",
  			ISO_A3: "PRK",
  			ISO_A3_EH: "PRK",
  			ISO_N3: "408",
  			UN_A3: "408",
  			WB_A2: "KP",
  			WB_A3: "PRK",
  			WOE_ID: 23424865,
  			WOE_ID_EH: 23424865,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "PRK",
  			ADM0_A3_US: "PRK",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 11,
  			LONG_LEN: 15,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321181,
  			WIKIDATAID: "Q423",
  			NAME_AR: "كوريا الشمالية",
  			NAME_BN: "উত্তর কোরিয়া",
  			NAME_DE: "Nordkorea",
  			NAME_EN: "North Korea",
  			NAME_ES: "Corea del Norte",
  			NAME_FR: "Corée du Nord",
  			NAME_EL: "Βόρεια Κορέα",
  			NAME_HI: "उत्तर कोरिया",
  			NAME_HU: "Észak-Korea",
  			NAME_ID: "Korea Utara",
  			NAME_IT: "Corea del Nord",
  			NAME_JA: "朝鮮民主主義人民共和国",
  			NAME_KO: "조선민주주의인민공화국",
  			NAME_NL: "Noord-Korea",
  			NAME_PL: "Korea Północna",
  			NAME_PT: "Coreia do Norte",
  			NAME_RU: "Корейская Народно-Демократическая Республика",
  			NAME_SV: "Nordkorea",
  			NAME_TR: "Kuzey Kore",
  			NAME_VI: "Cộng hòa Dân chủ Nhân dân Triều Tiên",
  			NAME_ZH: "朝鲜民主主义人民共和国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						126.17475874237624,
  						37.74968577732804
  					],
  					[
  						128.34971642467661,
  						38.61224294692785
  					],
  					[
  						129.46044966035817,
  						36.78418915460283
  					],
  					[
  						129.0913765809296,
  						35.082484239231434
  					],
  					[
  						126.48574751190876,
  						34.39004588473648
  					],
  					[
  						126.55923139862779,
  						35.6845405136479
  					],
  					[
  						126.11739790253229,
  						36.72548472751926
  					],
  					[
  						126.17475874237624,
  						37.74968577732804
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "South Korea",
  			SOV_A3: "KOR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "South Korea",
  			ADM0_A3: "KOR",
  			GEOU_DIF: 0,
  			GEOUNIT: "South Korea",
  			GU_A3: "KOR",
  			SU_DIF: 0,
  			SUBUNIT: "South Korea",
  			SU_A3: "KOR",
  			BRK_DIFF: 0,
  			NAME: "South Korea",
  			NAME_LONG: "Republic of Korea",
  			BRK_A3: "KOR",
  			BRK_NAME: "Republic of Korea",
  			BRK_GROUP: "",
  			ABBREV: "S.K.",
  			POSTAL: "KR",
  			FORMAL_EN: "Republic of Korea",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Korea, South",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Korea, Rep.",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 5,
  			POP_EST: 51181299,
  			POP_RANK: 16,
  			GDP_MD_EST: 1929000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "4. Emerging region: MIKT",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "KS",
  			ISO_A2: "KR",
  			ISO_A3: "KOR",
  			ISO_A3_EH: "KOR",
  			ISO_N3: "410",
  			UN_A3: "410",
  			WB_A2: "KR",
  			WB_A3: "KOR",
  			WOE_ID: 23424868,
  			WOE_ID_EH: 23424868,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "KOR",
  			ADM0_A3_US: "KOR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 11,
  			LONG_LEN: 17,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159320985,
  			WIKIDATAID: "Q884",
  			NAME_AR: "كوريا الجنوبية",
  			NAME_BN: "দক্ষিণ কোরিয়া",
  			NAME_DE: "Südkorea",
  			NAME_EN: "South Korea",
  			NAME_ES: "Corea del Sur",
  			NAME_FR: "Corée du Sud",
  			NAME_EL: "Νότια Κορέα",
  			NAME_HI: "दक्षिण कोरिया",
  			NAME_HU: "Dél-Korea",
  			NAME_ID: "Korea Selatan",
  			NAME_IT: "Corea del Sud",
  			NAME_JA: "大韓民国",
  			NAME_KO: "대한민국",
  			NAME_NL: "Zuid-Korea",
  			NAME_PL: "Korea Południowa",
  			NAME_PT: "Coreia do Sul",
  			NAME_RU: "Республика Корея",
  			NAME_SV: "Sydkorea",
  			NAME_TR: "Güney Kore",
  			NAME_VI: "Hàn Quốc",
  			NAME_ZH: "大韩民国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						87.75126427607671,
  						49.297197984405486
  					],
  					[
  						88.80556684769552,
  						49.47052073831242
  					],
  					[
  						92.23471154171968,
  						50.80217072204172
  					],
  					[
  						94.14756635943559,
  						50.48053660745717
  					],
  					[
  						94.81594933469873,
  						50.01343333597085
  					],
  					[
  						97.25976000000014,
  						49.72605000000004
  					],
  					[
  						98.23176150919156,
  						50.422400621128745
  					],
  					[
  						97.82573978067431,
  						51.01099518493318
  					],
  					[
  						98.86149051310034,
  						52.04736603454669
  					],
  					[
  						102.06521000000004,
  						51.25991000000005
  					],
  					[
  						102.25589000000008,
  						50.51056000000011
  					],
  					[
  						103.67654544476022,
  						50.089966132195116
  					],
  					[
  						106.8888041524553,
  						50.27429596618032
  					],
  					[
  						108.47516727095129,
  						49.28254771585074
  					],
  					[
  						110.66201053267878,
  						49.13012807880585
  					],
  					[
  						112.89773969935436,
  						49.54356537535699
  					],
  					[
  						114.36245649623527,
  						50.24830272073741
  					],
  					[
  						116.67880089728612,
  						49.888531399121405
  					],
  					[
  						115.48528201707306,
  						48.13538259540344
  					],
  					[
  						117.29550744025741,
  						47.69770905210743
  					],
  					[
  						118.06414269416672,
  						48.06673045510369
  					],
  					[
  						119.7728239278975,
  						47.04805878355013
  					],
  					[
  						117.42170128791419,
  						46.67273285581426
  					],
  					[
  						115.98509647020009,
  						45.727235012386004
  					],
  					[
  						113.46390669154417,
  						44.80889313412712
  					],
  					[
  						111.8733061056003,
  						45.10207937273506
  					],
  					[
  						111.34837690637946,
  						44.45744171811009
  					],
  					[
  						111.82958784388137,
  						43.74311839453952
  					],
  					[
  						110.41210330611528,
  						42.87123362891103
  					],
  					[
  						109.24359581913146,
  						42.5194463160841
  					],
  					[
  						106.12931562706169,
  						42.13432770442891
  					],
  					[
  						104.96499393109347,
  						41.59740957291635
  					],
  					[
  						103.31227827353482,
  						41.9074681666676
  					],
  					[
  						101.83304039917994,
  						42.51487295182628
  					],
  					[
  						99.51581749878004,
  						42.524691473961724
  					],
  					[
  						96.34939578652781,
  						42.725635280928685
  					],
  					[
  						95.30687544147153,
  						44.24133087826547
  					],
  					[
  						93.4807336771413,
  						44.975472113619965
  					],
  					[
  						90.9455395853343,
  						45.28607330991028
  					],
  					[
  						90.97080936072501,
  						46.88814606382293
  					],
  					[
  						90.28082563676392,
  						47.69354909930793
  					],
  					[
  						88.85429772334676,
  						48.069081732772965
  					],
  					[
  						87.75126427607671,
  						49.297197984405486
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Mongolia",
  			SOV_A3: "MNG",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Mongolia",
  			ADM0_A3: "MNG",
  			GEOU_DIF: 0,
  			GEOUNIT: "Mongolia",
  			GU_A3: "MNG",
  			SU_DIF: 0,
  			SUBUNIT: "Mongolia",
  			SU_A3: "MNG",
  			BRK_DIFF: 0,
  			NAME: "Mongolia",
  			NAME_LONG: "Mongolia",
  			BRK_A3: "MNG",
  			BRK_NAME: "Mongolia",
  			BRK_GROUP: "",
  			ABBREV: "Mong.",
  			POSTAL: "MN",
  			FORMAL_EN: "Mongolia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Mongolia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Mongolia",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 6,
  			POP_EST: 3068243,
  			POP_RANK: 12,
  			GDP_MD_EST: 37000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MG",
  			ISO_A2: "MN",
  			ISO_A3: "MNG",
  			ISO_A3_EH: "MNG",
  			ISO_N3: "496",
  			UN_A3: "496",
  			WB_A2: "MN",
  			WB_A3: "MNG",
  			WOE_ID: 23424887,
  			WOE_ID_EH: 23424887,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MNG",
  			ADM0_A3_US: "MNG",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159321071,
  			WIKIDATAID: "Q711",
  			NAME_AR: "منغوليا",
  			NAME_BN: "মঙ্গোলিয়া",
  			NAME_DE: "Mongolei",
  			NAME_EN: "Mongolia",
  			NAME_ES: "Mongolia",
  			NAME_FR: "Mongolie",
  			NAME_EL: "Μογγολία",
  			NAME_HI: "मंगोलिया",
  			NAME_HU: "Mongólia",
  			NAME_ID: "Mongolia",
  			NAME_IT: "Mongolia",
  			NAME_JA: "モンゴル国",
  			NAME_KO: "몽골",
  			NAME_NL: "Mongolië",
  			NAME_PL: "Mongolia",
  			NAME_PT: "Mongólia",
  			NAME_RU: "Монголия",
  			NAME_SV: "Mongoliet",
  			NAME_TR: "Moğolistan",
  			NAME_VI: "Mông Cổ",
  			NAME_ZH: "蒙古国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						97.32711388549004,
  						28.26158274994634
  					],
  					[
  						97.0519885599681,
  						27.69905894623315
  					],
  					[
  						95.12476769407496,
  						26.5735720891323
  					],
  					[
  						95.1551534362626,
  						26.001307277932085
  					],
  					[
  						94.10674197792507,
  						23.85074087167348
  					],
  					[
  						93.3251876159428,
  						24.078556423432204
  					],
  					[
  						93.16612755734837,
  						22.278459580977103
  					],
  					[
  						92.67272098182556,
  						22.041238918541254
  					],
  					[
  						91.91509280799443,
  						24.130413723237112
  					],
  					[
  						92.37620161333481,
  						24.976692816664965
  					],
  					[
  						89.92069258012185,
  						25.26974986419218
  					],
  					[
  						89.83248091019962,
  						25.96508209889548
  					],
  					[
  						88.56304935094977,
  						26.446525580342723
  					],
  					[
  						88.2097892598025,
  						25.768065700782714
  					],
  					[
  						88.93155398962308,
  						25.238692328384776
  					],
  					[
  						88.08442223506242,
  						24.501657212821925
  					],
  					[
  						89.03196129756623,
  						22.055708319582976
  					],
  					[
  						88.88876590368542,
  						21.690588487224748
  					],
  					[
  						86.97570438024027,
  						21.49556163175521
  					],
  					[
  						86.49935102737379,
  						20.151638495356607
  					],
  					[
  						85.0602657409097,
  						19.4785788029711
  					],
  					[
  						83.94100589390001,
  						18.302009792549725
  					],
  					[
  						82.19279218946592,
  						17.016636053937816
  					],
  					[
  						82.19124189649719,
  						16.556664130107848
  					],
  					[
  						80.32489586784388,
  						15.89918488205835
  					],
  					[
  						80.02506920768644,
  						15.136414903214147
  					],
  					[
  						80.28629357292186,
  						13.006260687710835
  					],
  					[
  						79.8625468281285,
  						12.056215318240888
  					],
  					[
  						79.85799930208682,
  						10.35727509199711
  					],
  					[
  						78.88534549348918,
  						9.546135972527722
  					],
  					[
  						77.53989790233794,
  						7.965534776232332
  					],
  					[
  						76.59297895702167,
  						8.89927623131419
  					],
  					[
  						75.7464673196485,
  						11.308250637248307
  					],
  					[
  						74.86481570831683,
  						12.741935736537897
  					],
  					[
  						74.44385949086723,
  						14.617221787977698
  					],
  					[
  						73.5341992532334,
  						15.99065216721496
  					],
  					[
  						72.82090945830865,
  						19.208233547436166
  					],
  					[
  						72.6305334817454,
  						21.356009426351008
  					],
  					[
  						71.17527347197395,
  						20.757441311114235
  					],
  					[
  						70.4704586119451,
  						20.877330634031384
  					],
  					[
  						69.16413008003883,
  						22.0892980005727
  					],
  					[
  						69.34959679553435,
  						22.84317963306269
  					],
  					[
  						68.1766451353734,
  						23.69196503345671
  					],
  					[
  						68.84259931831878,
  						24.35913361256094
  					],
  					[
  						71.04324018746823,
  						24.3565239527302
  					],
  					[
  						70.16892662952202,
  						26.491871649678842
  					],
  					[
  						69.51439293811313,
  						26.940965684511372
  					],
  					[
  						70.61649620960193,
  						27.989196275335868
  					],
  					[
  						71.77766564320032,
  						27.913180243434525
  					],
  					[
  						72.8237516620847,
  						28.961591701772054
  					],
  					[
  						74.42138024282028,
  						30.979814764931177
  					],
  					[
  						74.45155927927871,
  						32.7648996038055
  					],
  					[
  						73.74994835805197,
  						34.31769887952785
  					],
  					[
  						74.24020267120497,
  						34.748887030571254
  					],
  					[
  						75.75706098826834,
  						34.50492259372132
  					],
  					[
  						76.87172163280403,
  						34.65354401299274
  					],
  					[
  						77.83745079947457,
  						35.494009507787766
  					],
  					[
  						78.91226891471322,
  						34.32193634697579
  					],
  					[
  						78.45844648632601,
  						32.61816437431273
  					],
  					[
  						78.73889448437401,
  						31.515906073527063
  					],
  					[
  						81.11125613802932,
  						30.183480943313402
  					],
  					[
  						80.08842451367627,
  						28.79447011974014
  					],
  					[
  						83.30424889519955,
  						27.36450572357556
  					],
  					[
  						84.6750179381738,
  						27.234901231387536
  					],
  					[
  						85.25177859898338,
  						26.726198431906344
  					],
  					[
  						88.06023766474982,
  						26.41461538340249
  					],
  					[
  						88.12044070836987,
  						27.876541652939594
  					],
  					[
  						88.81424848832056,
  						27.299315904239364
  					],
  					[
  						89.74452762243885,
  						26.719402981059957
  					],
  					[
  						92.03348351437509,
  						26.83831045176356
  					],
  					[
  						91.69665652869668,
  						27.771741848251665
  					],
  					[
  						92.50311893104364,
  						27.89687632904645
  					],
  					[
  						94.56599043170294,
  						29.277438055939985
  					],
  					[
  						95.40480228066464,
  						29.03171662039213
  					],
  					[
  						96.11767866413103,
  						29.452802028922466
  					],
  					[
  						97.32711388549004,
  						28.26158274994634
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "India",
  			SOV_A3: "IND",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "India",
  			ADM0_A3: "IND",
  			GEOU_DIF: 0,
  			GEOUNIT: "India",
  			GU_A3: "IND",
  			SU_DIF: 0,
  			SUBUNIT: "India",
  			SU_A3: "IND",
  			BRK_DIFF: 0,
  			NAME: "India",
  			NAME_LONG: "India",
  			BRK_A3: "IND",
  			BRK_NAME: "India",
  			BRK_GROUP: "",
  			ABBREV: "India",
  			POSTAL: "IND",
  			FORMAL_EN: "Republic of India",
  			FORMAL_FR: "",
  			NAME_CIAWF: "India",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "India",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 2,
  			POP_EST: 1281935911,
  			POP_RANK: 18,
  			GDP_MD_EST: 8721000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "3. Emerging region: BRIC",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "IN",
  			ISO_A2: "IN",
  			ISO_A3: "IND",
  			ISO_A3_EH: "IND",
  			ISO_N3: "356",
  			UN_A3: "356",
  			WB_A2: "IN",
  			WB_A3: "IND",
  			WOE_ID: 23424848,
  			WOE_ID_EH: 23424848,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "IND",
  			ADM0_A3_US: "IND",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Southern Asia",
  			REGION_WB: "South Asia",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 1.7,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159320847,
  			WIKIDATAID: "Q668",
  			NAME_AR: "الهند",
  			NAME_BN: "ভারত",
  			NAME_DE: "Indien",
  			NAME_EN: "India",
  			NAME_ES: "India",
  			NAME_FR: "Inde",
  			NAME_EL: "Ινδία",
  			NAME_HI: "भारत",
  			NAME_HU: "India",
  			NAME_ID: "India",
  			NAME_IT: "India",
  			NAME_JA: "インド",
  			NAME_KO: "인도",
  			NAME_NL: "India",
  			NAME_PL: "Indie",
  			NAME_PT: "Índia",
  			NAME_RU: "Индия",
  			NAME_SV: "Indien",
  			NAME_TR: "Hindistan",
  			NAME_VI: "Ấn Độ",
  			NAME_ZH: "印度"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						92.67272098182556,
  						22.041238918541254
  					],
  					[
  						92.36855350135562,
  						20.670883287025347
  					],
  					[
  						91.41708702999766,
  						22.76501902922122
  					],
  					[
  						90.49600630082728,
  						22.80501658781513
  					],
  					[
  						90.27297081905556,
  						21.83636770272011
  					],
  					[
  						89.03196129756623,
  						22.055708319582976
  					],
  					[
  						88.08442223506242,
  						24.501657212821925
  					],
  					[
  						88.93155398962308,
  						25.238692328384776
  					],
  					[
  						88.2097892598025,
  						25.768065700782714
  					],
  					[
  						88.56304935094977,
  						26.446525580342723
  					],
  					[
  						89.83248091019962,
  						25.96508209889548
  					],
  					[
  						89.92069258012185,
  						25.26974986419218
  					],
  					[
  						92.37620161333481,
  						24.976692816664965
  					],
  					[
  						91.91509280799443,
  						24.130413723237112
  					],
  					[
  						92.67272098182556,
  						22.041238918541254
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Bangladesh",
  			SOV_A3: "BGD",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Bangladesh",
  			ADM0_A3: "BGD",
  			GEOU_DIF: 0,
  			GEOUNIT: "Bangladesh",
  			GU_A3: "BGD",
  			SU_DIF: 0,
  			SUBUNIT: "Bangladesh",
  			SU_A3: "BGD",
  			BRK_DIFF: 0,
  			NAME: "Bangladesh",
  			NAME_LONG: "Bangladesh",
  			BRK_A3: "BGD",
  			BRK_NAME: "Bangladesh",
  			BRK_GROUP: "",
  			ABBREV: "Bang.",
  			POSTAL: "BD",
  			FORMAL_EN: "People's Republic of Bangladesh",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Bangladesh",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Bangladesh",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 7,
  			POP_EST: 157826578,
  			POP_RANK: 17,
  			GDP_MD_EST: 628400,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BG",
  			ISO_A2: "BD",
  			ISO_A3: "BGD",
  			ISO_A3_EH: "BGD",
  			ISO_N3: "050",
  			UN_A3: "050",
  			WB_A2: "BD",
  			WB_A3: "BGD",
  			WOE_ID: 23424759,
  			WOE_ID_EH: 23424759,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BGD",
  			ADM0_A3_US: "BGD",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Southern Asia",
  			REGION_WB: "South Asia",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320407,
  			WIKIDATAID: "Q902",
  			NAME_AR: "بنغلاديش",
  			NAME_BN: "বাংলাদেশ",
  			NAME_DE: "Bangladesch",
  			NAME_EN: "Bangladesh",
  			NAME_ES: "Bangladés",
  			NAME_FR: "Bangladesh",
  			NAME_EL: "Μπανγκλαντές",
  			NAME_HI: "बांग्लादेश",
  			NAME_HU: "Banglades",
  			NAME_ID: "Bangladesh",
  			NAME_IT: "Bangladesh",
  			NAME_JA: "バングラデシュ",
  			NAME_KO: "방글라데시",
  			NAME_NL: "Bangladesh",
  			NAME_PL: "Bangladesz",
  			NAME_PT: "Bangladesh",
  			NAME_RU: "Бангладеш",
  			NAME_SV: "Bangladesh",
  			NAME_TR: "Bangladeş",
  			NAME_VI: "Bangladesh",
  			NAME_ZH: "孟加拉国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						91.69665652869668,
  						27.771741848251665
  					],
  					[
  						92.03348351437509,
  						26.83831045176356
  					],
  					[
  						89.74452762243885,
  						26.719402981059957
  					],
  					[
  						88.81424848832056,
  						27.299315904239364
  					],
  					[
  						90.01582889197118,
  						28.296438503527217
  					],
  					[
  						91.69665652869668,
  						27.771741848251665
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Bhutan",
  			SOV_A3: "BTN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Bhutan",
  			ADM0_A3: "BTN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Bhutan",
  			GU_A3: "BTN",
  			SU_DIF: 0,
  			SUBUNIT: "Bhutan",
  			SU_A3: "BTN",
  			BRK_DIFF: 0,
  			NAME: "Bhutan",
  			NAME_LONG: "Bhutan",
  			BRK_A3: "BTN",
  			BRK_NAME: "Bhutan",
  			BRK_GROUP: "",
  			ABBREV: "Bhutan",
  			POSTAL: "BT",
  			FORMAL_EN: "Kingdom of Bhutan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Bhutan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Bhutan",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 8,
  			POP_EST: 758288,
  			POP_RANK: 11,
  			GDP_MD_EST: 6432,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2005,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BT",
  			ISO_A2: "BT",
  			ISO_A3: "BTN",
  			ISO_A3_EH: "BTN",
  			ISO_N3: "064",
  			UN_A3: "064",
  			WB_A2: "BT",
  			WB_A3: "BTN",
  			WOE_ID: 23424770,
  			WOE_ID_EH: 23424770,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BTN",
  			ADM0_A3_US: "BTN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Southern Asia",
  			REGION_WB: "South Asia",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320453,
  			WIKIDATAID: "Q917",
  			NAME_AR: "بوتان",
  			NAME_BN: "ভূটান",
  			NAME_DE: "Bhutan",
  			NAME_EN: "Bhutan",
  			NAME_ES: "Bután",
  			NAME_FR: "Bhoutan",
  			NAME_EL: "Μπουτάν",
  			NAME_HI: "भूटान",
  			NAME_HU: "Bhután",
  			NAME_ID: "Bhutan",
  			NAME_IT: "Bhutan",
  			NAME_JA: "ブータン",
  			NAME_KO: "부탄",
  			NAME_NL: "Bhutan",
  			NAME_PL: "Bhutan",
  			NAME_PT: "Butão",
  			NAME_RU: "Бутан",
  			NAME_SV: "Bhutan",
  			NAME_TR: "Bhutan",
  			NAME_VI: "Bhutan",
  			NAME_ZH: "不丹"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						88.12044070836987,
  						27.876541652939594
  					],
  					[
  						88.06023766474982,
  						26.41461538340249
  					],
  					[
  						85.25177859898338,
  						26.726198431906344
  					],
  					[
  						84.6750179381738,
  						27.234901231387536
  					],
  					[
  						83.30424889519955,
  						27.36450572357556
  					],
  					[
  						80.08842451367627,
  						28.79447011974014
  					],
  					[
  						81.11125613802932,
  						30.183480943313402
  					],
  					[
  						82.32751264845088,
  						30.115268052688137
  					],
  					[
  						84.23457970575015,
  						28.839893703724698
  					],
  					[
  						85.82331994013151,
  						28.203575954698707
  					],
  					[
  						88.12044070836987,
  						27.876541652939594
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Nepal",
  			SOV_A3: "NPL",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Nepal",
  			ADM0_A3: "NPL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Nepal",
  			GU_A3: "NPL",
  			SU_DIF: 0,
  			SUBUNIT: "Nepal",
  			SU_A3: "NPL",
  			BRK_DIFF: 0,
  			NAME: "Nepal",
  			NAME_LONG: "Nepal",
  			BRK_A3: "NPL",
  			BRK_NAME: "Nepal",
  			BRK_GROUP: "",
  			ABBREV: "Nepal",
  			POSTAL: "NP",
  			FORMAL_EN: "Nepal",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Nepal",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Nepal",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 12,
  			POP_EST: 29384297,
  			POP_RANK: 15,
  			GDP_MD_EST: 71520,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "NP",
  			ISO_A2: "NP",
  			ISO_A3: "NPL",
  			ISO_A3_EH: "NPL",
  			ISO_N3: "524",
  			UN_A3: "524",
  			WB_A2: "NP",
  			WB_A3: "NPL",
  			WOE_ID: 23424911,
  			WOE_ID_EH: 23424911,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "NPL",
  			ADM0_A3_US: "NPL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Southern Asia",
  			REGION_WB: "South Asia",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321121,
  			WIKIDATAID: "Q837",
  			NAME_AR: "نيبال",
  			NAME_BN: "নেপাল",
  			NAME_DE: "Nepal",
  			NAME_EN: "Nepal",
  			NAME_ES: "Nepal",
  			NAME_FR: "Népal",
  			NAME_EL: "Νεπάλ",
  			NAME_HI: "नेपाल",
  			NAME_HU: "Nepál",
  			NAME_ID: "Nepal",
  			NAME_IT: "Nepal",
  			NAME_JA: "ネパール",
  			NAME_KO: "네팔",
  			NAME_NL: "Nepal",
  			NAME_PL: "Nepal",
  			NAME_PT: "Nepal",
  			NAME_RU: "Непал",
  			NAME_SV: "Nepal",
  			NAME_TR: "Nepal",
  			NAME_VI: "Nepal",
  			NAME_ZH: "尼泊尔"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						77.83745079947457,
  						35.494009507787766
  					],
  					[
  						76.87172163280403,
  						34.65354401299274
  					],
  					[
  						75.75706098826834,
  						34.50492259372132
  					],
  					[
  						74.24020267120497,
  						34.748887030571254
  					],
  					[
  						73.74994835805197,
  						34.31769887952785
  					],
  					[
  						74.45155927927871,
  						32.7648996038055
  					],
  					[
  						74.42138024282028,
  						30.979814764931177
  					],
  					[
  						72.8237516620847,
  						28.961591701772054
  					],
  					[
  						71.77766564320032,
  						27.913180243434525
  					],
  					[
  						70.61649620960193,
  						27.989196275335868
  					],
  					[
  						69.51439293811313,
  						26.940965684511372
  					],
  					[
  						70.16892662952202,
  						26.491871649678842
  					],
  					[
  						71.04324018746823,
  						24.3565239527302
  					],
  					[
  						68.84259931831878,
  						24.35913361256094
  					],
  					[
  						68.1766451353734,
  						23.69196503345671
  					],
  					[
  						67.44366661974547,
  						23.94484365487699
  					],
  					[
  						66.37282758979327,
  						25.42514089609385
  					],
  					[
  						64.53040774929113,
  						25.23703868255143
  					],
  					[
  						61.49736290878419,
  						25.0782370061185
  					],
  					[
  						61.87418745305655,
  						26.239974880472104
  					],
  					[
  						63.31663170761959,
  						26.756532497661667
  					],
  					[
  						62.75542565292986,
  						27.378923448184988
  					],
  					[
  						62.72783043808599,
  						28.25964488373539
  					],
  					[
  						61.77186811711863,
  						28.6993338078908
  					],
  					[
  						60.87424848820879,
  						29.829238999952608
  					],
  					[
  						62.54985680527278,
  						29.31857249604431
  					],
  					[
  						65.0468620136161,
  						29.472180691031905
  					],
  					[
  						66.34647260932442,
  						29.887943427036177
  					],
  					[
  						66.93889122911847,
  						31.304911200479353
  					],
  					[
  						68.92667687365767,
  						31.620189113892067
  					],
  					[
  						69.68714725126486,
  						33.105498969041236
  					],
  					[
  						70.8818030129884,
  						33.98885590263852
  					],
  					[
  						71.61307620635071,
  						35.153203436822864
  					],
  					[
  						71.26234826038575,
  						36.074387518857804
  					],
  					[
  						71.84629194528392,
  						36.50994232842986
  					],
  					[
  						75.15802778514092,
  						37.13303091078912
  					],
  					[
  						76.19284834178569,
  						35.89840342868783
  					],
  					[
  						77.83745079947457,
  						35.494009507787766
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Pakistan",
  			SOV_A3: "PAK",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Pakistan",
  			ADM0_A3: "PAK",
  			GEOU_DIF: 0,
  			GEOUNIT: "Pakistan",
  			GU_A3: "PAK",
  			SU_DIF: 0,
  			SUBUNIT: "Pakistan",
  			SU_A3: "PAK",
  			BRK_DIFF: 0,
  			NAME: "Pakistan",
  			NAME_LONG: "Pakistan",
  			BRK_A3: "PAK",
  			BRK_NAME: "Pakistan",
  			BRK_GROUP: "",
  			ABBREV: "Pak.",
  			POSTAL: "PK",
  			FORMAL_EN: "Islamic Republic of Pakistan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Pakistan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Pakistan",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 11,
  			POP_EST: 204924861,
  			POP_RANK: 17,
  			GDP_MD_EST: 988200,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1998,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "PK",
  			ISO_A2: "PK",
  			ISO_A3: "PAK",
  			ISO_A3_EH: "PAK",
  			ISO_N3: "586",
  			UN_A3: "586",
  			WB_A2: "PK",
  			WB_A3: "PAK",
  			WOE_ID: 23424922,
  			WOE_ID_EH: 23424922,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "PAK",
  			ADM0_A3_US: "PAK",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Southern Asia",
  			REGION_WB: "South Asia",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159321153,
  			WIKIDATAID: "Q843",
  			NAME_AR: "باكستان",
  			NAME_BN: "পাকিস্তান",
  			NAME_DE: "Pakistan",
  			NAME_EN: "Pakistan",
  			NAME_ES: "Pakistán",
  			NAME_FR: "Pakistan",
  			NAME_EL: "Πακιστάν",
  			NAME_HI: "पाकिस्तान",
  			NAME_HU: "Pakisztán",
  			NAME_ID: "Pakistan",
  			NAME_IT: "Pakistan",
  			NAME_JA: "パキスタン",
  			NAME_KO: "파키스탄",
  			NAME_NL: "Pakistan",
  			NAME_PL: "Pakistan",
  			NAME_PT: "Paquistão",
  			NAME_RU: "Пакистан",
  			NAME_SV: "Pakistan",
  			NAME_TR: "Pakistan",
  			NAME_VI: "Pakistan",
  			NAME_ZH: "巴基斯坦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						66.51860680528867,
  						37.36278432875879
  					],
  					[
  						67.82999962755952,
  						37.144994004864685
  					],
  					[
  						70.11657840361033,
  						37.58822276463209
  					],
  					[
  						70.80682050973289,
  						38.486281643216415
  					],
  					[
  						71.54191775908478,
  						37.905774441065645
  					],
  					[
  						71.8446382994506,
  						36.73817129164692
  					],
  					[
  						73.26005577992501,
  						37.495256862939
  					],
  					[
  						74.98000247589542,
  						37.419990139305895
  					],
  					[
  						75.15802778514092,
  						37.13303091078912
  					],
  					[
  						71.84629194528392,
  						36.50994232842986
  					],
  					[
  						71.26234826038575,
  						36.074387518857804
  					],
  					[
  						71.61307620635071,
  						35.153203436822864
  					],
  					[
  						70.8818030129884,
  						33.98885590263852
  					],
  					[
  						69.68714725126486,
  						33.105498969041236
  					],
  					[
  						68.92667687365767,
  						31.620189113892067
  					],
  					[
  						66.93889122911847,
  						31.304911200479353
  					],
  					[
  						66.34647260932442,
  						29.887943427036177
  					],
  					[
  						65.0468620136161,
  						29.472180691031905
  					],
  					[
  						62.54985680527278,
  						29.31857249604431
  					],
  					[
  						60.87424848820879,
  						29.829238999952608
  					],
  					[
  						61.781221551363444,
  						30.735850328081238
  					],
  					[
  						60.94194461451113,
  						31.548074652628753
  					],
  					[
  						60.52842980331158,
  						33.676446031218006
  					],
  					[
  						61.210817091725744,
  						35.650072333309225
  					],
  					[
  						62.230651483005886,
  						35.270663967422294
  					],
  					[
  						64.5464791197339,
  						36.31207326918427
  					],
  					[
  						64.7461051776774,
  						37.111817735333304
  					],
  					[
  						66.51860680528867,
  						37.36278432875879
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Afghanistan",
  			SOV_A3: "AFG",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Afghanistan",
  			ADM0_A3: "AFG",
  			GEOU_DIF: 0,
  			GEOUNIT: "Afghanistan",
  			GU_A3: "AFG",
  			SU_DIF: 0,
  			SUBUNIT: "Afghanistan",
  			SU_A3: "AFG",
  			BRK_DIFF: 0,
  			NAME: "Afghanistan",
  			NAME_LONG: "Afghanistan",
  			BRK_A3: "AFG",
  			BRK_NAME: "Afghanistan",
  			BRK_GROUP: "",
  			ABBREV: "Afg.",
  			POSTAL: "AF",
  			FORMAL_EN: "Islamic State of Afghanistan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Afghanistan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Afghanistan",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 8,
  			MAPCOLOR13: 7,
  			POP_EST: 34124811,
  			POP_RANK: 15,
  			GDP_MD_EST: 64080,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1979,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "AF",
  			ISO_A2: "AF",
  			ISO_A3: "AFG",
  			ISO_A3_EH: "AFG",
  			ISO_N3: "004",
  			UN_A3: "004",
  			WB_A2: "AF",
  			WB_A3: "AFG",
  			WOE_ID: 23424739,
  			WOE_ID_EH: 23424739,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "AFG",
  			ADM0_A3_US: "AFG",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Southern Asia",
  			REGION_WB: "South Asia",
  			NAME_LEN: 11,
  			LONG_LEN: 11,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159320319,
  			WIKIDATAID: "Q889",
  			NAME_AR: "أفغانستان",
  			NAME_BN: "আফগানিস্তান",
  			NAME_DE: "Afghanistan",
  			NAME_EN: "Afghanistan",
  			NAME_ES: "Afganistán",
  			NAME_FR: "Afghanistan",
  			NAME_EL: "Αφγανιστάν",
  			NAME_HI: "अफ़्गानिस्तान",
  			NAME_HU: "Afganisztán",
  			NAME_ID: "Afganistan",
  			NAME_IT: "Afghanistan",
  			NAME_JA: "アフガニスタン",
  			NAME_KO: "아프가니스탄",
  			NAME_NL: "Afghanistan",
  			NAME_PL: "Afganistan",
  			NAME_PT: "Afeganistão",
  			NAME_RU: "Афганистан",
  			NAME_SV: "Afghanistan",
  			NAME_TR: "Afganistan",
  			NAME_VI: "Afghanistan",
  			NAME_ZH: "阿富汗"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						67.82999962755952,
  						37.144994004864685
  					],
  					[
  						68.39203250516596,
  						38.15702525486874
  					],
  					[
  						68.17602501818592,
  						38.901553453113905
  					],
  					[
  						69.32949466337283,
  						40.72782440852485
  					],
  					[
  						70.66662234892505,
  						40.960213324541414
  					],
  					[
  						71.01419803252017,
  						40.24436554621823
  					],
  					[
  						71.784693637992,
  						39.27946320246437
  					],
  					[
  						73.6753792662548,
  						39.4312368841056
  					],
  					[
  						73.92885216664644,
  						38.50581533462274
  					],
  					[
  						74.86481570831683,
  						38.3788463404816
  					],
  					[
  						74.98000247589542,
  						37.419990139305895
  					],
  					[
  						73.26005577992501,
  						37.495256862939
  					],
  					[
  						71.8446382994506,
  						36.73817129164692
  					],
  					[
  						71.54191775908478,
  						37.905774441065645
  					],
  					[
  						70.80682050973289,
  						38.486281643216415
  					],
  					[
  						70.11657840361033,
  						37.58822276463209
  					],
  					[
  						67.82999962755952,
  						37.144994004864685
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Tajikistan",
  			SOV_A3: "TJK",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Tajikistan",
  			ADM0_A3: "TJK",
  			GEOU_DIF: 0,
  			GEOUNIT: "Tajikistan",
  			GU_A3: "TJK",
  			SU_DIF: 0,
  			SUBUNIT: "Tajikistan",
  			SU_A3: "TJK",
  			BRK_DIFF: 0,
  			NAME: "Tajikistan",
  			NAME_LONG: "Tajikistan",
  			BRK_A3: "TJK",
  			BRK_NAME: "Tajikistan",
  			BRK_GROUP: "",
  			ABBREV: "Tjk.",
  			POSTAL: "TJ",
  			FORMAL_EN: "Republic of Tajikistan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Tajikistan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Tajikistan",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 5,
  			POP_EST: 8468555,
  			POP_RANK: 13,
  			GDP_MD_EST: 25810,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "TI",
  			ISO_A2: "TJ",
  			ISO_A3: "TJK",
  			ISO_A3_EH: "TJK",
  			ISO_N3: "762",
  			UN_A3: "762",
  			WB_A2: "TJ",
  			WB_A3: "TJK",
  			WOE_ID: 23424961,
  			WOE_ID_EH: 23424961,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "TJK",
  			ADM0_A3_US: "TJK",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Central Asia",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321307,
  			WIKIDATAID: "Q863",
  			NAME_AR: "طاجيكستان",
  			NAME_BN: "তাজিকিস্তান",
  			NAME_DE: "Tadschikistan",
  			NAME_EN: "Tajikistan",
  			NAME_ES: "Tayikistán",
  			NAME_FR: "Tadjikistan",
  			NAME_EL: "Τατζικιστάν",
  			NAME_HI: "ताजिकिस्तान",
  			NAME_HU: "Tádzsikisztán",
  			NAME_ID: "Tajikistan",
  			NAME_IT: "Tagikistan",
  			NAME_JA: "タジキスタン",
  			NAME_KO: "타지키스탄",
  			NAME_NL: "Tadzjikistan",
  			NAME_PL: "Tadżykistan",
  			NAME_PT: "Tajiquistão",
  			NAME_RU: "Таджикистан",
  			NAME_SV: "Tadzjikistan",
  			NAME_TR: "Tacikistan",
  			NAME_VI: "Tajikistan",
  			NAME_ZH: "塔吉克斯坦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						70.96231489449914,
  						42.266154283205495
  					],
  					[
  						71.8446382994506,
  						42.8453954127651
  					],
  					[
  						73.48975752146237,
  						42.50089447689132
  					],
  					[
  						74.21286583852256,
  						43.29833934180337
  					],
  					[
  						76.00035363149846,
  						42.98802236589067
  					],
  					[
  						79.14217736197978,
  						42.85609243424952
  					],
  					[
  						80.2599902688853,
  						42.34999929459906
  					],
  					[
  						78.18719689322597,
  						41.18531586360481
  					],
  					[
  						76.90448449087708,
  						41.06648590754965
  					],
  					[
  						76.52636803579745,
  						40.42794607193512
  					],
  					[
  						75.4678279967307,
  						40.56207225194867
  					],
  					[
  						73.8222436868283,
  						39.893973497063186
  					],
  					[
  						73.6753792662548,
  						39.4312368841056
  					],
  					[
  						71.784693637992,
  						39.27946320246437
  					],
  					[
  						71.01419803252017,
  						40.24436554621823
  					],
  					[
  						71.77487511585656,
  						40.14584442805378
  					],
  					[
  						73.05541710804917,
  						40.866033026689465
  					],
  					[
  						71.87011478057047,
  						41.392900092121266
  					],
  					[
  						70.96231489449914,
  						42.266154283205495
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Kyrgyzstan",
  			SOV_A3: "KGZ",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Kyrgyzstan",
  			ADM0_A3: "KGZ",
  			GEOU_DIF: 0,
  			GEOUNIT: "Kyrgyzstan",
  			GU_A3: "KGZ",
  			SU_DIF: 0,
  			SUBUNIT: "Kyrgyzstan",
  			SU_A3: "KGZ",
  			BRK_DIFF: 0,
  			NAME: "Kyrgyzstan",
  			NAME_LONG: "Kyrgyzstan",
  			BRK_A3: "KGZ",
  			BRK_NAME: "Kyrgyzstan",
  			BRK_GROUP: "",
  			ABBREV: "Kgz.",
  			POSTAL: "KG",
  			FORMAL_EN: "Kyrgyz Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Kyrgyzstan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Kyrgyz Republic",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 7,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 6,
  			POP_EST: 5789122,
  			POP_RANK: 13,
  			GDP_MD_EST: 21010,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "KG",
  			ISO_A2: "KG",
  			ISO_A3: "KGZ",
  			ISO_A3_EH: "KGZ",
  			ISO_N3: "417",
  			UN_A3: "417",
  			WB_A2: "KG",
  			WB_A3: "KGZ",
  			WOE_ID: 23424864,
  			WOE_ID_EH: 23424864,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "KGZ",
  			ADM0_A3_US: "KGZ",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Central Asia",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320977,
  			WIKIDATAID: "Q813",
  			NAME_AR: "قيرغيزستان",
  			NAME_BN: "কির্গিজস্তান",
  			NAME_DE: "Kirgisistan",
  			NAME_EN: "Kyrgyzstan",
  			NAME_ES: "Kirguistán",
  			NAME_FR: "Kirghizistan",
  			NAME_EL: "Κιργιζία",
  			NAME_HI: "किर्गिज़स्तान",
  			NAME_HU: "Kirgizisztán",
  			NAME_ID: "Kirgizstan",
  			NAME_IT: "Kirghizistan",
  			NAME_JA: "キルギス",
  			NAME_KO: "키르기스스탄",
  			NAME_NL: "Kirgizië",
  			NAME_PL: "Kirgistan",
  			NAME_PT: "Quirguistão",
  			NAME_RU: "Киргизия",
  			NAME_SV: "Kirgizistan",
  			NAME_TR: "Kırgızistan",
  			NAME_VI: "Kyrgyzstan",
  			NAME_ZH: "吉尔吉斯斯坦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						52.50245975119615,
  						41.78331553808637
  					],
  					[
  						54.07941775901495,
  						42.32410940202083
  					],
  					[
  						55.45525109235377,
  						41.25985911718584
  					],
  					[
  						55.96819135928291,
  						41.30864166926936
  					],
  					[
  						58.62901085799146,
  						42.75155101172305
  					],
  					[
  						59.976422153569786,
  						42.22308197689021
  					],
  					[
  						60.083340691981675,
  						41.425146185871405
  					],
  					[
  						61.88271406438469,
  						41.084856879229406
  					],
  					[
  						62.374260288345006,
  						40.05388621679039
  					],
  					[
  						64.17022301621677,
  						38.892406724598246
  					],
  					[
  						66.54615034370022,
  						37.97468496352687
  					],
  					[
  						66.51860680528867,
  						37.36278432875879
  					],
  					[
  						64.7461051776774,
  						37.111817735333304
  					],
  					[
  						64.5464791197339,
  						36.31207326918427
  					],
  					[
  						62.230651483005886,
  						35.270663967422294
  					],
  					[
  						61.210817091725744,
  						35.650072333309225
  					],
  					[
  						59.23476199731681,
  						37.41298798273034
  					],
  					[
  						57.330433790928986,
  						38.02922943781094
  					],
  					[
  						55.51157840355191,
  						37.96411713312317
  					],
  					[
  						53.92159793479556,
  						37.19891836196126
  					],
  					[
  						53.880928582581845,
  						38.95209300389536
  					],
  					[
  						52.69397260926982,
  						40.03362905533197
  					],
  					[
  						54.73684533063215,
  						40.95101491959346
  					],
  					[
  						53.72171349469059,
  						42.12319143327003
  					],
  					[
  						52.50245975119615,
  						41.78331553808637
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Turkmenistan",
  			SOV_A3: "TKM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Turkmenistan",
  			ADM0_A3: "TKM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Turkmenistan",
  			GU_A3: "TKM",
  			SU_DIF: 0,
  			SUBUNIT: "Turkmenistan",
  			SU_A3: "TKM",
  			BRK_DIFF: 0,
  			NAME: "Turkmenistan",
  			NAME_LONG: "Turkmenistan",
  			BRK_A3: "TKM",
  			BRK_NAME: "Turkmenistan",
  			BRK_GROUP: "",
  			ABBREV: "Turkm.",
  			POSTAL: "TM",
  			FORMAL_EN: "Turkmenistan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Turkmenistan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Turkmenistan",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 9,
  			POP_EST: 5351277,
  			POP_RANK: 13,
  			GDP_MD_EST: 94720,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1995,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "TX",
  			ISO_A2: "TM",
  			ISO_A3: "TKM",
  			ISO_A3_EH: "TKM",
  			ISO_N3: "795",
  			UN_A3: "795",
  			WB_A2: "TM",
  			WB_A3: "TKM",
  			WOE_ID: 23424972,
  			WOE_ID_EH: 23424972,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "TKM",
  			ADM0_A3_US: "TKM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Central Asia",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 12,
  			LONG_LEN: 12,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321309,
  			WIKIDATAID: "Q874",
  			NAME_AR: "تركمانستان",
  			NAME_BN: "তুর্কমেনিস্তান",
  			NAME_DE: "Turkmenistan",
  			NAME_EN: "Turkmenistan",
  			NAME_ES: "Turkmenistán",
  			NAME_FR: "Turkménistan",
  			NAME_EL: "Τουρκμενιστάν",
  			NAME_HI: "तुर्कमेनिस्तान",
  			NAME_HU: "Türkmenisztán",
  			NAME_ID: "Turkmenistan",
  			NAME_IT: "Turkmenistan",
  			NAME_JA: "トルクメニスタン",
  			NAME_KO: "투르크메니스탄",
  			NAME_NL: "Turkmenistan",
  			NAME_PL: "Turkmenistan",
  			NAME_PT: "Turquemenistão",
  			NAME_RU: "Туркмения",
  			NAME_SV: "Turkmenistan",
  			NAME_TR: "Türkmenistan",
  			NAME_VI: "Turkmenistan",
  			NAME_ZH: "土库曼斯坦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						48.567971225789755,
  						29.926778265903522
  					],
  					[
  						47.68528608581227,
  						30.984853217079632
  					],
  					[
  						47.8492037290421,
  						31.70917593029867
  					],
  					[
  						47.33466149271191,
  						32.46915538179911
  					],
  					[
  						46.10936160663932,
  						33.017287299119005
  					],
  					[
  						45.41669070819904,
  						33.967797756479584
  					],
  					[
  						46.0763403664048,
  						35.67738332777549
  					],
  					[
  						45.42061811705321,
  						35.977545884742824
  					],
  					[
  						44.77267710159504,
  						37.17043692561684
  					],
  					[
  						44.10922529478234,
  						39.4281362981681
  					],
  					[
  						44.79398969908195,
  						39.71300263117705
  					],
  					[
  						46.14362308124882,
  						38.74120148371222
  					],
  					[
  						46.50571984231797,
  						38.770605373686294
  					],
  					[
  						47.685079380083096,
  						39.50836395930122
  					],
  					[
  						48.88324913920249,
  						38.32024526626262
  					],
  					[
  						49.19961225769334,
  						37.582874253889884
  					],
  					[
  						50.84235436381971,
  						36.8728142359834
  					],
  					[
  						52.264024692601424,
  						36.7004216578577
  					],
  					[
  						53.92159793479556,
  						37.19891836196126
  					],
  					[
  						55.51157840355191,
  						37.96411713312317
  					],
  					[
  						57.330433790928986,
  						38.02922943781094
  					],
  					[
  						59.23476199731681,
  						37.41298798273034
  					],
  					[
  						61.210817091725744,
  						35.650072333309225
  					],
  					[
  						60.52842980331158,
  						33.676446031218006
  					],
  					[
  						60.94194461451113,
  						31.548074652628753
  					],
  					[
  						61.781221551363444,
  						30.735850328081238
  					],
  					[
  						60.87424848820879,
  						29.829238999952608
  					],
  					[
  						61.77186811711863,
  						28.6993338078908
  					],
  					[
  						62.72783043808599,
  						28.25964488373539
  					],
  					[
  						62.75542565292986,
  						27.378923448184988
  					],
  					[
  						63.31663170761959,
  						26.756532497661667
  					],
  					[
  						61.87418745305655,
  						26.239974880472104
  					],
  					[
  						61.49736290878419,
  						25.0782370061185
  					],
  					[
  						57.39725141788239,
  						25.73990204518364
  					],
  					[
  						56.970765822177555,
  						26.966106268821363
  					],
  					[
  						56.492138706290206,
  						27.143304755150197
  					],
  					[
  						54.71508955263727,
  						26.480657863871514
  					],
  					[
  						53.49309695823135,
  						26.81236888275305
  					],
  					[
  						52.48359785340961,
  						27.580849107365495
  					],
  					[
  						51.52076256694742,
  						27.865689602158298
  					],
  					[
  						50.115008579311585,
  						30.147772528599717
  					],
  					[
  						48.567971225789755,
  						29.926778265903522
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Iran",
  			SOV_A3: "IRN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Iran",
  			ADM0_A3: "IRN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Iran",
  			GU_A3: "IRN",
  			SU_DIF: 0,
  			SUBUNIT: "Iran",
  			SU_A3: "IRN",
  			BRK_DIFF: 0,
  			NAME: "Iran",
  			NAME_LONG: "Iran",
  			BRK_A3: "IRN",
  			BRK_NAME: "Iran",
  			BRK_GROUP: "",
  			ABBREV: "Iran",
  			POSTAL: "IRN",
  			FORMAL_EN: "Islamic Republic of Iran",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Iran",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Iran, Islamic Rep.",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 13,
  			POP_EST: 82021564,
  			POP_RANK: 16,
  			GDP_MD_EST: 1459000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2006,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "IR",
  			ISO_A2: "IR",
  			ISO_A3: "IRN",
  			ISO_A3_EH: "IRN",
  			ISO_N3: "364",
  			UN_A3: "364",
  			WB_A2: "IR",
  			WB_A3: "IRN",
  			WOE_ID: 23424851,
  			WOE_ID_EH: 23424851,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "IRN",
  			ADM0_A3_US: "IRN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Southern Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 4,
  			LONG_LEN: 4,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2.5,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159320881,
  			WIKIDATAID: "Q794",
  			NAME_AR: "إيران",
  			NAME_BN: "ইরান",
  			NAME_DE: "Iran",
  			NAME_EN: "Iran",
  			NAME_ES: "Irán",
  			NAME_FR: "Iran",
  			NAME_EL: "Ιράν",
  			NAME_HI: "ईरान",
  			NAME_HU: "Irán",
  			NAME_ID: "Iran",
  			NAME_IT: "Iran",
  			NAME_JA: "イラン",
  			NAME_KO: "이란",
  			NAME_NL: "Iran",
  			NAME_PL: "Iran",
  			NAME_PT: "Irão",
  			NAME_RU: "Иран",
  			NAME_SV: "Iran",
  			NAME_TR: "İran",
  			NAME_VI: "Iran",
  			NAME_ZH: "伊朗"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						35.71991824722275,
  						32.709192409794866
  					],
  					[
  						35.82110070165024,
  						33.2774264592763
  					],
  					[
  						36.61175011571589,
  						34.20178864189718
  					],
  					[
  						35.99840254084364,
  						34.644914048800004
  					],
  					[
  						36.149762811026534,
  						35.82153473565367
  					],
  					[
  						37.06676110204583,
  						36.62303620050062
  					],
  					[
  						38.1677274920242,
  						36.90121043552777
  					],
  					[
  						39.52258019385255,
  						36.71605377862599
  					],
  					[
  						42.34959109881177,
  						37.2298725449041
  					],
  					[
  						41.289707472505455,
  						36.35881460219227
  					],
  					[
  						41.006158888519934,
  						34.41937226006212
  					],
  					[
  						38.792340529136084,
  						33.378686428352225
  					],
  					[
  						36.834062127435544,
  						32.312937526980775
  					],
  					[
  						35.71991824722275,
  						32.709192409794866
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Syria",
  			SOV_A3: "SYR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Syria",
  			ADM0_A3: "SYR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Syria",
  			GU_A3: "SYR",
  			SU_DIF: 0,
  			SUBUNIT: "Syria",
  			SU_A3: "SYR",
  			BRK_DIFF: 0,
  			NAME: "Syria",
  			NAME_LONG: "Syria",
  			BRK_A3: "SYR",
  			BRK_NAME: "Syria",
  			BRK_GROUP: "",
  			ABBREV: "Syria",
  			POSTAL: "SYR",
  			FORMAL_EN: "Syrian Arab Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Syria",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Syrian Arab Republic",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 6,
  			POP_EST: 18028549,
  			POP_RANK: 14,
  			GDP_MD_EST: 50280,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2015,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SY",
  			ISO_A2: "SY",
  			ISO_A3: "SYR",
  			ISO_A3_EH: "SYR",
  			ISO_N3: "760",
  			UN_A3: "760",
  			WB_A2: "SY",
  			WB_A3: "SYR",
  			WOE_ID: 23424956,
  			WOE_ID_EH: 23424956,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SYR",
  			ADM0_A3_US: "SYR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321295,
  			WIKIDATAID: "Q858",
  			NAME_AR: "سوريا",
  			NAME_BN: "সিরিয়া",
  			NAME_DE: "Syrien",
  			NAME_EN: "Syria",
  			NAME_ES: "Siria",
  			NAME_FR: "Syrie",
  			NAME_EL: "Συρία",
  			NAME_HI: "सीरिया",
  			NAME_HU: "Szíria",
  			NAME_ID: "Suriah",
  			NAME_IT: "Siria",
  			NAME_JA: "シリア",
  			NAME_KO: "시리아",
  			NAME_NL: "Syrië",
  			NAME_PL: "Syria",
  			NAME_PT: "Síria",
  			NAME_RU: "Сирия",
  			NAME_SV: "Syrien",
  			NAME_TR: "Suriye",
  			NAME_VI: "Syria",
  			NAME_ZH: "叙利亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						46.50571984231797,
  						38.770605373686294
  					],
  					[
  						46.14362308124882,
  						38.74120148371222
  					],
  					[
  						44.79398969908195,
  						39.71300263117705
  					],
  					[
  						43.65643639504094,
  						40.253563951166186
  					],
  					[
  						43.58274580259273,
  						41.09214325618257
  					],
  					[
  						44.97248009621808,
  						41.248128567055595
  					],
  					[
  						46.48349897643246,
  						39.464154771475535
  					],
  					[
  						46.50571984231797,
  						38.770605373686294
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Armenia",
  			SOV_A3: "ARM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Armenia",
  			ADM0_A3: "ARM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Armenia",
  			GU_A3: "ARM",
  			SU_DIF: 0,
  			SUBUNIT: "Armenia",
  			SU_A3: "ARM",
  			BRK_DIFF: 0,
  			NAME: "Armenia",
  			NAME_LONG: "Armenia",
  			BRK_A3: "ARM",
  			BRK_NAME: "Armenia",
  			BRK_GROUP: "",
  			ABBREV: "Arm.",
  			POSTAL: "ARM",
  			FORMAL_EN: "Republic of Armenia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Armenia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Armenia",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 10,
  			POP_EST: 3045191,
  			POP_RANK: 12,
  			GDP_MD_EST: 26300,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "AM",
  			ISO_A2: "AM",
  			ISO_A3: "ARM",
  			ISO_A3_EH: "ARM",
  			ISO_N3: "051",
  			UN_A3: "051",
  			WB_A2: "AM",
  			WB_A3: "ARM",
  			WOE_ID: 23424743,
  			WOE_ID_EH: 23424743,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ARM",
  			ADM0_A3_US: "ARM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159320333,
  			WIKIDATAID: "Q399",
  			NAME_AR: "أرمينيا",
  			NAME_BN: "আর্মেনিয়া",
  			NAME_DE: "Armenien",
  			NAME_EN: "Armenia",
  			NAME_ES: "Armenia",
  			NAME_FR: "Arménie",
  			NAME_EL: "Αρμενία",
  			NAME_HI: "आर्मीनिया",
  			NAME_HU: "Örményország",
  			NAME_ID: "Armenia",
  			NAME_IT: "Armenia",
  			NAME_JA: "アルメニア",
  			NAME_KO: "아르메니아",
  			NAME_NL: "Armenië",
  			NAME_PL: "Armenia",
  			NAME_PT: "Arménia",
  			NAME_RU: "Армения",
  			NAME_SV: "Armenien",
  			NAME_TR: "Ermenistan",
  			NAME_VI: "Armenia",
  			NAME_ZH: "亞美尼亞"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						11.027368605196868,
  						58.85614940045936
  					],
  					[
  						12.3003658382749,
  						60.11793284773003
  					],
  					[
  						12.631146681375185,
  						61.293571682370136
  					],
  					[
  						11.930569288794231,
  						63.12831757267698
  					],
  					[
  						15.108411492583002,
  						66.19386688909547
  					],
  					[
  						16.768878614985482,
  						68.0139366726314
  					],
  					[
  						20.645592889089528,
  						69.10624726020087
  					],
  					[
  						23.53947309743444,
  						67.93600861273525
  					],
  					[
  						23.903378533633802,
  						66.00692739527962
  					],
  					[
  						22.18317345550193,
  						65.72374054632017
  					],
  					[
  						21.369631381930958,
  						64.41358795842429
  					],
  					[
  						17.84777916837521,
  						62.74940013289681
  					],
  					[
  						17.119554884518124,
  						61.34116567651097
  					],
  					[
  						18.78772179533209,
  						60.081914374422595
  					],
  					[
  						17.86922488777634,
  						58.9537661810587
  					],
  					[
  						16.829185011470088,
  						58.71982697207339
  					],
  					[
  						15.879785597403783,
  						56.10430186626866
  					],
  					[
  						14.666681349352075,
  						56.200885118222175
  					],
  					[
  						14.100721062891465,
  						55.40778107362265
  					],
  					[
  						12.942910597392057,
  						55.36173737245058
  					],
  					[
  						11.027368605196868,
  						58.85614940045936
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Sweden",
  			SOV_A3: "SWE",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Sweden",
  			ADM0_A3: "SWE",
  			GEOU_DIF: 0,
  			GEOUNIT: "Sweden",
  			GU_A3: "SWE",
  			SU_DIF: 0,
  			SUBUNIT: "Sweden",
  			SU_A3: "SWE",
  			BRK_DIFF: 0,
  			NAME: "Sweden",
  			NAME_LONG: "Sweden",
  			BRK_A3: "SWE",
  			BRK_NAME: "Sweden",
  			BRK_GROUP: "",
  			ABBREV: "Swe.",
  			POSTAL: "S",
  			FORMAL_EN: "Kingdom of Sweden",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Sweden",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Sweden",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 4,
  			POP_EST: 9960487,
  			POP_RANK: 13,
  			GDP_MD_EST: 498100,
  			POP_YEAR: 2017,
  			LASTCENSUS: -99,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SW",
  			ISO_A2: "SE",
  			ISO_A3: "SWE",
  			ISO_A3_EH: "SWE",
  			ISO_N3: "752",
  			UN_A3: "752",
  			WB_A2: "SE",
  			WB_A3: "SWE",
  			WOE_ID: 23424954,
  			WOE_ID_EH: 23424954,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SWE",
  			ADM0_A3_US: "SWE",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Northern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159321287,
  			WIKIDATAID: "Q34",
  			NAME_AR: "السويد",
  			NAME_BN: "সুইডেন",
  			NAME_DE: "Schweden",
  			NAME_EN: "Sweden",
  			NAME_ES: "Suecia",
  			NAME_FR: "Suède",
  			NAME_EL: "Σουηδία",
  			NAME_HI: "स्वीडन",
  			NAME_HU: "Svédország",
  			NAME_ID: "Swedia",
  			NAME_IT: "Svezia",
  			NAME_JA: "スウェーデン",
  			NAME_KO: "스웨덴",
  			NAME_NL: "Zweden",
  			NAME_PL: "Szwecja",
  			NAME_PT: "Suécia",
  			NAME_RU: "Швеция",
  			NAME_SV: "Sverige",
  			NAME_TR: "İsveç",
  			NAME_VI: "Thụy Điển",
  			NAME_ZH: "瑞典"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						28.17670942557794,
  						56.16912995057879
  					],
  					[
  						30.87390913262001,
  						55.55097646750341
  					],
  					[
  						30.75753380709872,
  						54.81177094178432
  					],
  					[
  						31.731272820774507,
  						53.79402944601202
  					],
  					[
  						31.78599244755525,
  						52.1016775699397
  					],
  					[
  						29.25493818534784,
  						51.36823436136689
  					],
  					[
  						24.553106316839518,
  						51.888461005249184
  					],
  					[
  						23.52707075368437,
  						51.57845408793031
  					],
  					[
  						23.79919884613338,
  						52.69109935160657
  					],
  					[
  						23.48412763844985,
  						53.91249766704114
  					],
  					[
  						25.536353794056993,
  						54.28242340760253
  					],
  					[
  						26.494331495883756,
  						55.615106919977634
  					],
  					[
  						28.17670942557794,
  						56.16912995057879
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Belarus",
  			SOV_A3: "BLR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Belarus",
  			ADM0_A3: "BLR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Belarus",
  			GU_A3: "BLR",
  			SU_DIF: 0,
  			SUBUNIT: "Belarus",
  			SU_A3: "BLR",
  			BRK_DIFF: 0,
  			NAME: "Belarus",
  			NAME_LONG: "Belarus",
  			BRK_A3: "BLR",
  			BRK_NAME: "Belarus",
  			BRK_GROUP: "",
  			ABBREV: "Bela.",
  			POSTAL: "BY",
  			FORMAL_EN: "Republic of Belarus",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Belarus",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Belarus",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 11,
  			POP_EST: 9549747,
  			POP_RANK: 13,
  			GDP_MD_EST: 165400,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BO",
  			ISO_A2: "BY",
  			ISO_A3: "BLR",
  			ISO_A3_EH: "BLR",
  			ISO_N3: "112",
  			UN_A3: "112",
  			WB_A2: "BY",
  			WB_A3: "BLR",
  			WOE_ID: 23424765,
  			WOE_ID_EH: 23424765,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BLR",
  			ADM0_A3_US: "BLR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320427,
  			WIKIDATAID: "Q184",
  			NAME_AR: "روسيا البيضاء",
  			NAME_BN: "বেলারুশ",
  			NAME_DE: "Weißrussland",
  			NAME_EN: "Belarus",
  			NAME_ES: "Bielorrusia",
  			NAME_FR: "Biélorussie",
  			NAME_EL: "Λευκορωσία",
  			NAME_HI: "बेलारूस",
  			NAME_HU: "Fehéroroszország",
  			NAME_ID: "Belarus",
  			NAME_IT: "Bielorussia",
  			NAME_JA: "ベラルーシ",
  			NAME_KO: "벨라루스",
  			NAME_NL: "Wit-Rusland",
  			NAME_PL: "Białoruś",
  			NAME_PT: "Bielorrússia",
  			NAME_RU: "Белоруссия",
  			NAME_SV: "Vitryssland",
  			NAME_TR: "Beyaz Rusya",
  			NAME_VI: "Belarus",
  			NAME_ZH: "白罗斯"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						31.78599244755525,
  						52.1016775699397
  					],
  					[
  						33.75269982273579,
  						52.3350745713318
  					],
  					[
  						35.356116163887975,
  						50.57719737405904
  					],
  					[
  						38.01063113785693,
  						49.9156615260747
  					],
  					[
  						40.06904000000014,
  						49.60104999999999
  					],
  					[
  						39.738277622238854,
  						47.89893707945197
  					],
  					[
  						38.223538038899335,
  						47.10218984637595
  					],
  					[
  						34.96234174982385,
  						46.27319651954974
  					],
  					[
  						35.01265897004737,
  						45.73772519982549
  					],
  					[
  						33.435988094713366,
  						45.971917370797485
  					],
  					[
  						30.74874881360921,
  						46.583100084004116
  					],
  					[
  						29.603289015427436,
  						45.293308010431126
  					],
  					[
  						28.23355350109904,
  						45.48828318946829
  					],
  					[
  						29.759971958136394,
  						46.34998769793536
  					],
  					[
  						29.12269819511303,
  						47.849095160506465
  					],
  					[
  						27.522537469195157,
  						48.467119452501116
  					],
  					[
  						26.619336785597795,
  						48.22072622333347
  					],
  					[
  						24.866317172960578,
  						47.737525743188314
  					],
  					[
  						22.710531447040495,
  						47.88219391538941
  					],
  					[
  						22.085608351334855,
  						48.42226430927179
  					],
  					[
  						22.558137648211755,
  						49.085738023467144
  					],
  					[
  						24.029985792748903,
  						50.70540660257518
  					],
  					[
  						23.52707075368437,
  						51.57845408793031
  					],
  					[
  						24.553106316839518,
  						51.888461005249184
  					],
  					[
  						29.25493818534784,
  						51.36823436136689
  					],
  					[
  						31.78599244755525,
  						52.1016775699397
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Ukraine",
  			SOV_A3: "UKR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Ukraine",
  			ADM0_A3: "UKR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Ukraine",
  			GU_A3: "UKR",
  			SU_DIF: 0,
  			SUBUNIT: "Ukraine",
  			SU_A3: "UKR",
  			BRK_DIFF: 0,
  			NAME: "Ukraine",
  			NAME_LONG: "Ukraine",
  			BRK_A3: "UKR",
  			BRK_NAME: "Ukraine",
  			BRK_GROUP: "",
  			ABBREV: "Ukr.",
  			POSTAL: "UA",
  			FORMAL_EN: "Ukraine",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Ukraine",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Ukraine",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 3,
  			POP_EST: 44033874,
  			POP_RANK: 15,
  			GDP_MD_EST: 352600,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "UP",
  			ISO_A2: "UA",
  			ISO_A3: "UKR",
  			ISO_A3_EH: "UKR",
  			ISO_N3: "804",
  			UN_A3: "804",
  			WB_A2: "UA",
  			WB_A3: "UKR",
  			WOE_ID: 23424976,
  			WOE_ID_EH: 23424976,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "UKR",
  			ADM0_A3_US: "UKR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159321345,
  			WIKIDATAID: "Q212",
  			NAME_AR: "أوكرانيا",
  			NAME_BN: "ইউক্রেন",
  			NAME_DE: "Ukraine",
  			NAME_EN: "Ukraine",
  			NAME_ES: "Ucrania",
  			NAME_FR: "Ukraine",
  			NAME_EL: "Ουκρανία",
  			NAME_HI: "युक्रेन",
  			NAME_HU: "Ukrajna",
  			NAME_ID: "Ukraina",
  			NAME_IT: "Ucraina",
  			NAME_JA: "ウクライナ",
  			NAME_KO: "우크라이나",
  			NAME_NL: "Oekraïne",
  			NAME_PL: "Ukraina",
  			NAME_PT: "Ucrânia",
  			NAME_RU: "Украина",
  			NAME_SV: "Ukraina",
  			NAME_TR: "Ukrayna",
  			NAME_VI: "Ukraina",
  			NAME_ZH: "乌克兰"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						23.48412763844985,
  						53.91249766704114
  					],
  					[
  						23.79919884613338,
  						52.69109935160657
  					],
  					[
  						23.52707075368437,
  						51.57845408793031
  					],
  					[
  						24.029985792748903,
  						50.70540660257518
  					],
  					[
  						22.558137648211755,
  						49.085738023467144
  					],
  					[
  						21.607808058364213,
  						49.47010732685409
  					],
  					[
  						19.825022820726872,
  						49.21712535256923
  					],
  					[
  						18.853144158613617,
  						49.49622976337764
  					],
  					[
  						17.55456709155112,
  						50.36214590107642
  					],
  					[
  						15.01699588385867,
  						51.10667409932158
  					],
  					[
  						14.074521111719434,
  						52.98126251892535
  					],
  					[
  						14.119686313542559,
  						53.75702912049104
  					],
  					[
  						17.622831658608675,
  						54.85153595643291
  					],
  					[
  						19.660640089606403,
  						54.42608388937393
  					],
  					[
  						22.731098667092652,
  						54.327536932993326
  					],
  					[
  						23.48412763844985,
  						53.91249766704114
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Poland",
  			SOV_A3: "POL",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Poland",
  			ADM0_A3: "POL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Poland",
  			GU_A3: "POL",
  			SU_DIF: 0,
  			SUBUNIT: "Poland",
  			SU_A3: "POL",
  			BRK_DIFF: 0,
  			NAME: "Poland",
  			NAME_LONG: "Poland",
  			BRK_A3: "POL",
  			BRK_NAME: "Poland",
  			BRK_GROUP: "",
  			ABBREV: "Pol.",
  			POSTAL: "PL",
  			FORMAL_EN: "Republic of Poland",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Poland",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Poland",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 7,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 2,
  			POP_EST: 38476269,
  			POP_RANK: 15,
  			GDP_MD_EST: 1052000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "PL",
  			ISO_A2: "PL",
  			ISO_A3: "POL",
  			ISO_A3_EH: "POL",
  			ISO_N3: "616",
  			UN_A3: "616",
  			WB_A2: "PL",
  			WB_A3: "POL",
  			WOE_ID: 23424923,
  			WOE_ID_EH: 23424923,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "POL",
  			ADM0_A3_US: "POL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 7,
  			NE_ID: 1159321179,
  			WIKIDATAID: "Q36",
  			NAME_AR: "بولندا",
  			NAME_BN: "পোল্যান্ড",
  			NAME_DE: "Polen",
  			NAME_EN: "Poland",
  			NAME_ES: "Polonia",
  			NAME_FR: "Pologne",
  			NAME_EL: "Πολωνία",
  			NAME_HI: "पोलैंड",
  			NAME_HU: "Lengyelország",
  			NAME_ID: "Polandia",
  			NAME_IT: "Polonia",
  			NAME_JA: "ポーランド",
  			NAME_KO: "폴란드",
  			NAME_NL: "Polen",
  			NAME_PL: "Polska",
  			NAME_PT: "Polónia",
  			NAME_RU: "Польша",
  			NAME_SV: "Polen",
  			NAME_TR: "Polonya",
  			NAME_VI: "Ba Lan",
  			NAME_ZH: "波兰"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						16.979666782304037,
  						48.123497015976305
  					],
  					[
  						16.202298211337364,
  						46.85238597267696
  					],
  					[
  						13.806475457421527,
  						46.509306138691215
  					],
  					[
  						12.153088006243054,
  						47.11539317482645
  					],
  					[
  						10.44270145024663,
  						46.89354625099743
  					],
  					[
  						9.59422610844635,
  						47.52505809182027
  					],
  					[
  						13.02585127122049,
  						47.63758352313583
  					],
  					[
  						13.595945672264437,
  						48.87717194273715
  					],
  					[
  						15.253415561593982,
  						49.03907420510758
  					],
  					[
  						16.960288120194576,
  						48.5969823268506
  					],
  					[
  						16.979666782304037,
  						48.123497015976305
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Austria",
  			SOV_A3: "AUT",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Austria",
  			ADM0_A3: "AUT",
  			GEOU_DIF: 0,
  			GEOUNIT: "Austria",
  			GU_A3: "AUT",
  			SU_DIF: 0,
  			SUBUNIT: "Austria",
  			SU_A3: "AUT",
  			BRK_DIFF: 0,
  			NAME: "Austria",
  			NAME_LONG: "Austria",
  			BRK_A3: "AUT",
  			BRK_NAME: "Austria",
  			BRK_GROUP: "",
  			ABBREV: "Aust.",
  			POSTAL: "A",
  			FORMAL_EN: "Republic of Austria",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Austria",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Austria",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 4,
  			POP_EST: 8754413,
  			POP_RANK: 13,
  			GDP_MD_EST: 416600,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "AU",
  			ISO_A2: "AT",
  			ISO_A3: "AUT",
  			ISO_A3_EH: "AUT",
  			ISO_N3: "040",
  			UN_A3: "040",
  			WB_A2: "AT",
  			WB_A3: "AUT",
  			WOE_ID: 23424750,
  			WOE_ID_EH: 23424750,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "AUT",
  			ADM0_A3_US: "AUT",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Western Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320379,
  			WIKIDATAID: "Q40",
  			NAME_AR: "النمسا",
  			NAME_BN: "অস্ট্রিয়া",
  			NAME_DE: "Österreich",
  			NAME_EN: "Austria",
  			NAME_ES: "Austria",
  			NAME_FR: "Autriche",
  			NAME_EL: "Αυστρία",
  			NAME_HI: "ऑस्ट्रिया",
  			NAME_HU: "Ausztria",
  			NAME_ID: "Austria",
  			NAME_IT: "Austria",
  			NAME_JA: "オーストリア",
  			NAME_KO: "오스트리아",
  			NAME_NL: "Oostenrijk",
  			NAME_PL: "Austria",
  			NAME_PT: "Áustria",
  			NAME_RU: "Австрия",
  			NAME_SV: "Österrike",
  			NAME_TR: "Avusturya",
  			NAME_VI: "Áo",
  			NAME_ZH: "奥地利"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						22.085608351334855,
  						48.42226430927179
  					],
  					[
  						22.710531447040495,
  						47.88219391538941
  					],
  					[
  						21.02195234547125,
  						46.3160879583519
  					],
  					[
  						20.220192498462836,
  						46.127468980486555
  					],
  					[
  						18.829824792873946,
  						45.908872358025285
  					],
  					[
  						17.630066359129557,
  						45.95176911069419
  					],
  					[
  						16.564808383864857,
  						46.50375092221983
  					],
  					[
  						16.202298211337364,
  						46.85238597267696
  					],
  					[
  						16.979666782304037,
  						48.123497015976305
  					],
  					[
  						17.857132602620027,
  						47.75842886005037
  					],
  					[
  						20.801293979584926,
  						48.623854071642384
  					],
  					[
  						22.085608351334855,
  						48.42226430927179
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Hungary",
  			SOV_A3: "HUN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Hungary",
  			ADM0_A3: "HUN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Hungary",
  			GU_A3: "HUN",
  			SU_DIF: 0,
  			SUBUNIT: "Hungary",
  			SU_A3: "HUN",
  			BRK_DIFF: 0,
  			NAME: "Hungary",
  			NAME_LONG: "Hungary",
  			BRK_A3: "HUN",
  			BRK_NAME: "Hungary",
  			BRK_GROUP: "",
  			ABBREV: "Hun.",
  			POSTAL: "HU",
  			FORMAL_EN: "Republic of Hungary",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Hungary",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Hungary",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 5,
  			POP_EST: 9850845,
  			POP_RANK: 13,
  			GDP_MD_EST: 267600,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "HU",
  			ISO_A2: "HU",
  			ISO_A3: "HUN",
  			ISO_A3_EH: "HUN",
  			ISO_N3: "348",
  			UN_A3: "348",
  			WB_A2: "HU",
  			WB_A3: "HUN",
  			WOE_ID: 23424844,
  			WOE_ID_EH: 23424844,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "HUN",
  			ADM0_A3_US: "HUN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320841,
  			WIKIDATAID: "Q28",
  			NAME_AR: "المجر",
  			NAME_BN: "হাঙ্গেরি",
  			NAME_DE: "Ungarn",
  			NAME_EN: "Hungary",
  			NAME_ES: "Hungría",
  			NAME_FR: "Hongrie",
  			NAME_EL: "Ουγγαρία",
  			NAME_HI: "हंगरी",
  			NAME_HU: "Magyarország",
  			NAME_ID: "Hongaria",
  			NAME_IT: "Ungheria",
  			NAME_JA: "ハンガリー",
  			NAME_KO: "헝가리",
  			NAME_NL: "Hongarije",
  			NAME_PL: "Węgry",
  			NAME_PT: "Hungria",
  			NAME_RU: "Венгрия",
  			NAME_SV: "Ungern",
  			NAME_TR: "Macaristan",
  			NAME_VI: "Hungary",
  			NAME_ZH: "匈牙利"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						26.619336785597795,
  						48.22072622333347
  					],
  					[
  						27.522537469195157,
  						48.467119452501116
  					],
  					[
  						29.12269819511303,
  						47.849095160506465
  					],
  					[
  						29.759971958136394,
  						46.34998769793536
  					],
  					[
  						28.23355350109904,
  						45.48828318946829
  					],
  					[
  						28.128030226359044,
  						46.810476386088254
  					],
  					[
  						26.619336785597795,
  						48.22072622333347
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Moldova",
  			SOV_A3: "MDA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Moldova",
  			ADM0_A3: "MDA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Moldova",
  			GU_A3: "MDA",
  			SU_DIF: 0,
  			SUBUNIT: "Moldova",
  			SU_A3: "MDA",
  			BRK_DIFF: 0,
  			NAME: "Moldova",
  			NAME_LONG: "Moldova",
  			BRK_A3: "MDA",
  			BRK_NAME: "Moldova",
  			BRK_GROUP: "",
  			ABBREV: "Mda.",
  			POSTAL: "MD",
  			FORMAL_EN: "Republic of Moldova",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Moldova",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Moldova",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 12,
  			POP_EST: 3474121,
  			POP_RANK: 12,
  			GDP_MD_EST: 18540,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MD",
  			ISO_A2: "MD",
  			ISO_A3: "MDA",
  			ISO_A3_EH: "MDA",
  			ISO_N3: "498",
  			UN_A3: "498",
  			WB_A2: "MD",
  			WB_A3: "MDA",
  			WOE_ID: 23424885,
  			WOE_ID_EH: 23424885,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MDA",
  			ADM0_A3_US: "MDA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321045,
  			WIKIDATAID: "Q217",
  			NAME_AR: "مولدافيا",
  			NAME_BN: "মলদোভা",
  			NAME_DE: "Republik Moldau",
  			NAME_EN: "Moldova",
  			NAME_ES: "Moldavia",
  			NAME_FR: "Moldavie",
  			NAME_EL: "Μολδαβία",
  			NAME_HI: "मॉल्डोवा",
  			NAME_HU: "Moldova",
  			NAME_ID: "Moldova",
  			NAME_IT: "Moldavia",
  			NAME_JA: "モルドバ",
  			NAME_KO: "몰도바",
  			NAME_NL: "Moldavië",
  			NAME_PL: "Mołdawia",
  			NAME_PT: "Moldávia",
  			NAME_RU: "Молдавия",
  			NAME_SV: "Moldavien",
  			NAME_TR: "Moldova",
  			NAME_VI: "Moldova",
  			NAME_ZH: "摩尔多瓦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						28.23355350109904,
  						45.48828318946829
  					],
  					[
  						29.603289015427436,
  						45.293308010431126
  					],
  					[
  						28.8378577003202,
  						44.913873806328056
  					],
  					[
  						28.558081495891997,
  						43.70746165625813
  					],
  					[
  						27.242399529740908,
  						44.175986029632405
  					],
  					[
  						25.569271681426926,
  						43.68844472917472
  					],
  					[
  						22.944832391051847,
  						43.82378530534713
  					],
  					[
  						22.65714969248299,
  						44.23492300066128
  					],
  					[
  						21.56202273935361,
  						44.7689472519655
  					],
  					[
  						20.220192498462836,
  						46.127468980486555
  					],
  					[
  						21.02195234547125,
  						46.3160879583519
  					],
  					[
  						22.710531447040495,
  						47.88219391538941
  					],
  					[
  						24.866317172960578,
  						47.737525743188314
  					],
  					[
  						26.619336785597795,
  						48.22072622333347
  					],
  					[
  						28.128030226359044,
  						46.810476386088254
  					],
  					[
  						28.23355350109904,
  						45.48828318946829
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Romania",
  			SOV_A3: "ROU",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Romania",
  			ADM0_A3: "ROU",
  			GEOU_DIF: 0,
  			GEOUNIT: "Romania",
  			GU_A3: "ROU",
  			SU_DIF: 0,
  			SUBUNIT: "Romania",
  			SU_A3: "ROU",
  			BRK_DIFF: 0,
  			NAME: "Romania",
  			NAME_LONG: "Romania",
  			BRK_A3: "ROU",
  			BRK_NAME: "Romania",
  			BRK_GROUP: "",
  			ABBREV: "Rom.",
  			POSTAL: "RO",
  			FORMAL_EN: "Romania",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Romania",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Romania",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 13,
  			POP_EST: 21529967,
  			POP_RANK: 15,
  			GDP_MD_EST: 441000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "RO",
  			ISO_A2: "RO",
  			ISO_A3: "ROU",
  			ISO_A3_EH: "ROU",
  			ISO_N3: "642",
  			UN_A3: "642",
  			WB_A2: "RO",
  			WB_A3: "ROM",
  			WOE_ID: 23424933,
  			WOE_ID_EH: 23424933,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ROU",
  			ADM0_A3_US: "ROU",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321199,
  			WIKIDATAID: "Q218",
  			NAME_AR: "رومانيا",
  			NAME_BN: "রোমানিয়া",
  			NAME_DE: "Rumänien",
  			NAME_EN: "Romania",
  			NAME_ES: "Rumania",
  			NAME_FR: "Roumanie",
  			NAME_EL: "Ρουμανία",
  			NAME_HI: "रोमानिया",
  			NAME_HU: "Románia",
  			NAME_ID: "Rumania",
  			NAME_IT: "Romania",
  			NAME_JA: "ルーマニア",
  			NAME_KO: "루마니아",
  			NAME_NL: "Roemenië",
  			NAME_PL: "Rumunia",
  			NAME_PT: "Roménia",
  			NAME_RU: "Румыния",
  			NAME_SV: "Rumänien",
  			NAME_TR: "Romanya",
  			NAME_VI: "Romania",
  			NAME_ZH: "羅馬尼亞"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						26.494331495883756,
  						55.615106919977634
  					],
  					[
  						25.536353794056993,
  						54.28242340760253
  					],
  					[
  						23.48412763844985,
  						53.91249766704114
  					],
  					[
  						22.731098667092652,
  						54.327536932993326
  					],
  					[
  						21.268448927503467,
  						55.190481675835315
  					],
  					[
  						21.055800408622417,
  						56.031076361711065
  					],
  					[
  						22.201156853939494,
  						56.33780182557949
  					],
  					[
  						24.86068444184076,
  						56.37252838807963
  					],
  					[
  						26.494331495883756,
  						55.615106919977634
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Lithuania",
  			SOV_A3: "LTU",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Lithuania",
  			ADM0_A3: "LTU",
  			GEOU_DIF: 0,
  			GEOUNIT: "Lithuania",
  			GU_A3: "LTU",
  			SU_DIF: 0,
  			SUBUNIT: "Lithuania",
  			SU_A3: "LTU",
  			BRK_DIFF: 0,
  			NAME: "Lithuania",
  			NAME_LONG: "Lithuania",
  			BRK_A3: "LTU",
  			BRK_NAME: "Lithuania",
  			BRK_GROUP: "",
  			ABBREV: "Lith.",
  			POSTAL: "LT",
  			FORMAL_EN: "Republic of Lithuania",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Lithuania",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Lithuania",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 9,
  			POP_EST: 2823859,
  			POP_RANK: 12,
  			GDP_MD_EST: 85620,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LH",
  			ISO_A2: "LT",
  			ISO_A3: "LTU",
  			ISO_A3_EH: "LTU",
  			ISO_N3: "440",
  			UN_A3: "440",
  			WB_A2: "LT",
  			WB_A3: "LTU",
  			WOE_ID: 23424875,
  			WOE_ID_EH: 23424875,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LTU",
  			ADM0_A3_US: "LTU",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Northern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 9,
  			LONG_LEN: 9,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321029,
  			WIKIDATAID: "Q37",
  			NAME_AR: "ليتوانيا",
  			NAME_BN: "লিথুয়ানিয়া",
  			NAME_DE: "Litauen",
  			NAME_EN: "Lithuania",
  			NAME_ES: "Lituania",
  			NAME_FR: "Lituanie",
  			NAME_EL: "Λιθουανία",
  			NAME_HI: "लिथुआनिया",
  			NAME_HU: "Litvánia",
  			NAME_ID: "Lituania",
  			NAME_IT: "Lituania",
  			NAME_JA: "リトアニア",
  			NAME_KO: "리투아니아",
  			NAME_NL: "Litouwen",
  			NAME_PL: "Litwa",
  			NAME_PT: "Lituânia",
  			NAME_RU: "Литва",
  			NAME_SV: "Litauen",
  			NAME_TR: "Litvanya",
  			NAME_VI: "Litva",
  			NAME_ZH: "立陶宛"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						27.288184848751513,
  						57.47452830670383
  					],
  					[
  						28.17670942557794,
  						56.16912995057879
  					],
  					[
  						26.494331495883756,
  						55.615106919977634
  					],
  					[
  						24.86068444184076,
  						56.37252838807963
  					],
  					[
  						22.201156853939494,
  						56.33780182557949
  					],
  					[
  						21.055800408622417,
  						56.031076361711065
  					],
  					[
  						21.581866489353672,
  						57.411870632549935
  					],
  					[
  						23.318452996522097,
  						57.00623647727487
  					],
  					[
  						24.312862583114622,
  						57.79342357037697
  					],
  					[
  						27.288184848751513,
  						57.47452830670383
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Latvia",
  			SOV_A3: "LVA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Latvia",
  			ADM0_A3: "LVA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Latvia",
  			GU_A3: "LVA",
  			SU_DIF: 0,
  			SUBUNIT: "Latvia",
  			SU_A3: "LVA",
  			BRK_DIFF: 0,
  			NAME: "Latvia",
  			NAME_LONG: "Latvia",
  			BRK_A3: "LVA",
  			BRK_NAME: "Latvia",
  			BRK_GROUP: "",
  			ABBREV: "Lat.",
  			POSTAL: "LV",
  			FORMAL_EN: "Republic of Latvia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Latvia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Latvia",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 7,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 13,
  			POP_EST: 1944643,
  			POP_RANK: 12,
  			GDP_MD_EST: 50650,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LG",
  			ISO_A2: "LV",
  			ISO_A3: "LVA",
  			ISO_A3_EH: "LVA",
  			ISO_N3: "428",
  			UN_A3: "428",
  			WB_A2: "LV",
  			WB_A3: "LVA",
  			WOE_ID: 23424874,
  			WOE_ID_EH: 23424874,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LVA",
  			ADM0_A3_US: "LVA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Northern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321033,
  			WIKIDATAID: "Q211",
  			NAME_AR: "لاتفيا",
  			NAME_BN: "লাতভিয়া",
  			NAME_DE: "Lettland",
  			NAME_EN: "Latvia",
  			NAME_ES: "Letonia",
  			NAME_FR: "Lettonie",
  			NAME_EL: "Λετονία",
  			NAME_HI: "लातविया",
  			NAME_HU: "Lettország",
  			NAME_ID: "Latvia",
  			NAME_IT: "Lettonia",
  			NAME_JA: "ラトビア",
  			NAME_KO: "라트비아",
  			NAME_NL: "Letland",
  			NAME_PL: "Łotwa",
  			NAME_PT: "Letónia",
  			NAME_RU: "Латвия",
  			NAME_SV: "Lettland",
  			NAME_TR: "Letonya",
  			NAME_VI: "Latvia",
  			NAME_ZH: "拉脫維亞"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						27.981126857000987,
  						59.47537333432527
  					],
  					[
  						27.288184848751513,
  						57.47452830670383
  					],
  					[
  						24.312862583114622,
  						57.79342357037697
  					],
  					[
  						23.339795363058645,
  						59.187240302153384
  					],
  					[
  						25.86418908051664,
  						59.61109039981133
  					],
  					[
  						27.981126857000987,
  						59.47537333432527
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Estonia",
  			SOV_A3: "EST",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Estonia",
  			ADM0_A3: "EST",
  			GEOU_DIF: 0,
  			GEOUNIT: "Estonia",
  			GU_A3: "EST",
  			SU_DIF: 0,
  			SUBUNIT: "Estonia",
  			SU_A3: "EST",
  			BRK_DIFF: 0,
  			NAME: "Estonia",
  			NAME_LONG: "Estonia",
  			BRK_A3: "EST",
  			BRK_NAME: "Estonia",
  			BRK_GROUP: "",
  			ABBREV: "Est.",
  			POSTAL: "EST",
  			FORMAL_EN: "Republic of Estonia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Estonia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Estonia",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 10,
  			POP_EST: 1251581,
  			POP_RANK: 12,
  			GDP_MD_EST: 38700,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2000,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "EN",
  			ISO_A2: "EE",
  			ISO_A3: "EST",
  			ISO_A3_EH: "EST",
  			ISO_N3: "233",
  			UN_A3: "233",
  			WB_A2: "EE",
  			WB_A3: "EST",
  			WOE_ID: 23424805,
  			WOE_ID_EH: 23424805,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "EST",
  			ADM0_A3_US: "EST",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Northern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320615,
  			WIKIDATAID: "Q191",
  			NAME_AR: "إستونيا",
  			NAME_BN: "এস্তোনিয়া",
  			NAME_DE: "Estland",
  			NAME_EN: "Estonia",
  			NAME_ES: "Estonia",
  			NAME_FR: "Estonie",
  			NAME_EL: "Εσθονία",
  			NAME_HI: "एस्टोनिया",
  			NAME_HU: "Észtország",
  			NAME_ID: "Estonia",
  			NAME_IT: "Estonia",
  			NAME_JA: "エストニア",
  			NAME_KO: "에스토니아",
  			NAME_NL: "Estland",
  			NAME_PL: "Estonia",
  			NAME_PT: "Estónia",
  			NAME_RU: "Эстония",
  			NAME_SV: "Estland",
  			NAME_TR: "Estonya",
  			NAME_VI: "Estonia",
  			NAME_ZH: "爱沙尼亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						14.119686313542559,
  						53.75702912049104
  					],
  					[
  						14.074521111719434,
  						52.98126251892535
  					],
  					[
  						15.01699588385867,
  						51.10667409932158
  					],
  					[
  						12.240111118222558,
  						50.266337795607285
  					],
  					[
  						13.595945672264437,
  						48.87717194273715
  					],
  					[
  						13.02585127122049,
  						47.63758352313583
  					],
  					[
  						9.59422610844635,
  						47.52505809182027
  					],
  					[
  						7.466759067422231,
  						47.62058197691181
  					],
  					[
  						8.099278598674744,
  						49.01778351500333
  					],
  					[
  						6.186320428094177,
  						49.463802802114515
  					],
  					[
  						6.043073357781111,
  						50.128051662794235
  					],
  					[
  						6.15665815595878,
  						50.80372101501058
  					],
  					[
  						7.092053256873896,
  						53.144043280644894
  					],
  					[
  						6.905139601274129,
  						53.48216217713065
  					],
  					[
  						8.800734490604668,
  						54.020785630908904
  					],
  					[
  						8.526229282270208,
  						54.96274363872516
  					],
  					[
  						9.921906365609118,
  						54.98310415304803
  					],
  					[
  						11.956252475643282,
  						54.19648550070116
  					],
  					[
  						14.119686313542559,
  						53.75702912049104
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Germany",
  			SOV_A3: "DEU",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Germany",
  			ADM0_A3: "DEU",
  			GEOU_DIF: 0,
  			GEOUNIT: "Germany",
  			GU_A3: "DEU",
  			SU_DIF: 0,
  			SUBUNIT: "Germany",
  			SU_A3: "DEU",
  			BRK_DIFF: 0,
  			NAME: "Germany",
  			NAME_LONG: "Germany",
  			BRK_A3: "DEU",
  			BRK_NAME: "Germany",
  			BRK_GROUP: "",
  			ABBREV: "Ger.",
  			POSTAL: "D",
  			FORMAL_EN: "Federal Republic of Germany",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Germany",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Germany",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 1,
  			POP_EST: 80594017,
  			POP_RANK: 16,
  			GDP_MD_EST: 3979000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "1. Developed region: G7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GM",
  			ISO_A2: "DE",
  			ISO_A3: "DEU",
  			ISO_A3_EH: "DEU",
  			ISO_N3: "276",
  			UN_A3: "276",
  			WB_A2: "DE",
  			WB_A3: "DEU",
  			WOE_ID: 23424829,
  			WOE_ID_EH: 23424829,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "DEU",
  			ADM0_A3_US: "DEU",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Western Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 1.7,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159320539,
  			WIKIDATAID: "Q183",
  			NAME_AR: "ألمانيا",
  			NAME_BN: "জার্মানি",
  			NAME_DE: "Deutschland",
  			NAME_EN: "Germany",
  			NAME_ES: "Alemania",
  			NAME_FR: "Allemagne",
  			NAME_EL: "Γερμανία",
  			NAME_HI: "जर्मनी",
  			NAME_HU: "Németország",
  			NAME_ID: "Jerman",
  			NAME_IT: "Germania",
  			NAME_JA: "ドイツ",
  			NAME_KO: "독일",
  			NAME_NL: "Duitsland",
  			NAME_PL: "Niemcy",
  			NAME_PT: "Alemanha",
  			NAME_RU: "Германия",
  			NAME_SV: "Tyskland",
  			NAME_TR: "Almanya",
  			NAME_VI: "Đức",
  			NAME_ZH: "德国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						22.65714969248299,
  						44.23492300066128
  					],
  					[
  						22.944832391051847,
  						43.82378530534713
  					],
  					[
  						25.569271681426926,
  						43.68844472917472
  					],
  					[
  						27.242399529740908,
  						44.175986029632405
  					],
  					[
  						28.558081495891997,
  						43.70746165625813
  					],
  					[
  						27.67389773937805,
  						42.57789236100622
  					],
  					[
  						27.99672041190539,
  						42.00735871028779
  					],
  					[
  						26.1170418637208,
  						41.82690460872456
  					],
  					[
  						25.197201368925448,
  						41.23448598893053
  					],
  					[
  						24.492644891057978,
  						41.58389618587205
  					],
  					[
  						22.952377150166452,
  						41.33799388281115
  					],
  					[
  						22.380525750424592,
  						42.32025950781509
  					],
  					[
  						22.986018507588483,
  						43.2111612005271
  					],
  					[
  						22.65714969248299,
  						44.23492300066128
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Bulgaria",
  			SOV_A3: "BGR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Bulgaria",
  			ADM0_A3: "BGR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Bulgaria",
  			GU_A3: "BGR",
  			SU_DIF: 0,
  			SUBUNIT: "Bulgaria",
  			SU_A3: "BGR",
  			BRK_DIFF: 0,
  			NAME: "Bulgaria",
  			NAME_LONG: "Bulgaria",
  			BRK_A3: "BGR",
  			BRK_NAME: "Bulgaria",
  			BRK_GROUP: "",
  			ABBREV: "Bulg.",
  			POSTAL: "BG",
  			FORMAL_EN: "Republic of Bulgaria",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Bulgaria",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Bulgaria",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 8,
  			POP_EST: 7101510,
  			POP_RANK: 13,
  			GDP_MD_EST: 143100,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BU",
  			ISO_A2: "BG",
  			ISO_A3: "BGR",
  			ISO_A3_EH: "BGR",
  			ISO_N3: "100",
  			UN_A3: "100",
  			WB_A2: "BG",
  			WB_A3: "BGR",
  			WOE_ID: 23424771,
  			WOE_ID_EH: 23424771,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BGR",
  			ADM0_A3_US: "BGR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320409,
  			WIKIDATAID: "Q219",
  			NAME_AR: "بلغاريا",
  			NAME_BN: "বুলগেরিয়া",
  			NAME_DE: "Bulgarien",
  			NAME_EN: "Bulgaria",
  			NAME_ES: "Bulgaria",
  			NAME_FR: "Bulgarie",
  			NAME_EL: "Βουλγαρία",
  			NAME_HI: "बुल्गारिया",
  			NAME_HU: "Bulgária",
  			NAME_ID: "Bulgaria",
  			NAME_IT: "Bulgaria",
  			NAME_JA: "ブルガリア",
  			NAME_KO: "불가리아",
  			NAME_NL: "Bulgarije",
  			NAME_PL: "Bułgaria",
  			NAME_PT: "Bulgária",
  			NAME_RU: "Болгария",
  			NAME_SV: "Bulgarien",
  			NAME_TR: "Bulgaristan",
  			NAME_VI: "Bulgaria",
  			NAME_ZH: "保加利亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						22.952377150166452,
  						41.33799388281115
  					],
  					[
  						24.492644891057978,
  						41.58389618587205
  					],
  					[
  						25.197201368925448,
  						41.23448598893053
  					],
  					[
  						26.1170418637208,
  						41.82690460872456
  					],
  					[
  						26.05694217296534,
  						40.82412344010076
  					],
  					[
  						24.92584842296094,
  						40.947061672523205
  					],
  					[
  						24.40799889496401,
  						40.12499298762407
  					],
  					[
  						22.84974775563478,
  						39.659310818025745
  					],
  					[
  						22.973099399515547,
  						38.97090322524963
  					],
  					[
  						24.025024855248887,
  						38.21999298761642
  					],
  					[
  						24.040011020613576,
  						37.655014553369426
  					],
  					[
  						21.67002648284364,
  						36.8449864771942
  					],
  					[
  						21.120034213961333,
  						38.31032339126273
  					],
  					[
  						20.15001590341052,
  						39.62499766698397
  					],
  					[
  						21.0200403174764,
  						40.84272695572588
  					],
  					[
  						22.952377150166452,
  						41.33799388281115
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Greece",
  			SOV_A3: "GRC",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Greece",
  			ADM0_A3: "GRC",
  			GEOU_DIF: 0,
  			GEOUNIT: "Greece",
  			GU_A3: "GRC",
  			SU_DIF: 0,
  			SUBUNIT: "Greece",
  			SU_A3: "GRC",
  			BRK_DIFF: 0,
  			NAME: "Greece",
  			NAME_LONG: "Greece",
  			BRK_A3: "GRC",
  			BRK_NAME: "Greece",
  			BRK_GROUP: "",
  			ABBREV: "Greece",
  			POSTAL: "GR",
  			FORMAL_EN: "Hellenic Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Greece",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Greece",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 9,
  			POP_EST: 10768477,
  			POP_RANK: 14,
  			GDP_MD_EST: 290500,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GR",
  			ISO_A2: "GR",
  			ISO_A3: "GRC",
  			ISO_A3_EH: "GRC",
  			ISO_N3: "300",
  			UN_A3: "300",
  			WB_A2: "GR",
  			WB_A3: "GRC",
  			WOE_ID: 23424833,
  			WOE_ID_EH: 23424833,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GRC",
  			ADM0_A3_US: "GRC",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320811,
  			WIKIDATAID: "Q41",
  			NAME_AR: "اليونان",
  			NAME_BN: "গ্রিস",
  			NAME_DE: "Griechenland",
  			NAME_EN: "Greece",
  			NAME_ES: "Grecia",
  			NAME_FR: "Grèce",
  			NAME_EL: "Ελλάδα",
  			NAME_HI: "यूनान",
  			NAME_HU: "Görögország",
  			NAME_ID: "Yunani",
  			NAME_IT: "Grecia",
  			NAME_JA: "ギリシャ",
  			NAME_KO: "그리스",
  			NAME_NL: "Griekenland",
  			NAME_PL: "Grecja",
  			NAME_PT: "Grécia",
  			NAME_RU: "Греция",
  			NAME_SV: "Grekland",
  			NAME_TR: "Yunanistan",
  			NAME_VI: "Hy Lạp",
  			NAME_ZH: "希腊"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						21.0200403174764,
  						40.84272695572588
  					],
  					[
  						20.15001590341052,
  						39.62499766698397
  					],
  					[
  						19.406081984136733,
  						40.250773423822466
  					],
  					[
  						19.37176816334725,
  						41.877550679783496
  					],
  					[
  						20.070700000000045,
  						42.58863000000008
  					],
  					[
  						20.590246546680227,
  						41.855408919283626
  					],
  					[
  						21.0200403174764,
  						40.84272695572588
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Albania",
  			SOV_A3: "ALB",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Albania",
  			ADM0_A3: "ALB",
  			GEOU_DIF: 0,
  			GEOUNIT: "Albania",
  			GU_A3: "ALB",
  			SU_DIF: 0,
  			SUBUNIT: "Albania",
  			SU_A3: "ALB",
  			BRK_DIFF: 0,
  			NAME: "Albania",
  			NAME_LONG: "Albania",
  			BRK_A3: "ALB",
  			BRK_NAME: "Albania",
  			BRK_GROUP: "",
  			ABBREV: "Alb.",
  			POSTAL: "AL",
  			FORMAL_EN: "Republic of Albania",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Albania",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Albania",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 6,
  			POP_EST: 3047987,
  			POP_RANK: 12,
  			GDP_MD_EST: 33900,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "AL",
  			ISO_A2: "AL",
  			ISO_A3: "ALB",
  			ISO_A3_EH: "ALB",
  			ISO_N3: "008",
  			UN_A3: "008",
  			WB_A2: "AL",
  			WB_A3: "ALB",
  			WOE_ID: 23424742,
  			WOE_ID_EH: 23424742,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ALB",
  			ADM0_A3_US: "ALB",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159320325,
  			WIKIDATAID: "Q222",
  			NAME_AR: "ألبانيا",
  			NAME_BN: "আলবেনিয়া",
  			NAME_DE: "Albanien",
  			NAME_EN: "Albania",
  			NAME_ES: "Albania",
  			NAME_FR: "Albanie",
  			NAME_EL: "Αλβανία",
  			NAME_HI: "अल्बानिया",
  			NAME_HU: "Albánia",
  			NAME_ID: "Albania",
  			NAME_IT: "Albania",
  			NAME_JA: "アルバニア",
  			NAME_KO: "알바니아",
  			NAME_NL: "Albanië",
  			NAME_PL: "Albania",
  			NAME_PT: "Albânia",
  			NAME_RU: "Албания",
  			NAME_SV: "Albanien",
  			NAME_TR: "Arnavutluk",
  			NAME_VI: "Albania",
  			NAME_ZH: "阿尔巴尼亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						16.564808383864857,
  						46.50375092221983
  					],
  					[
  						17.630066359129557,
  						45.95176911069419
  					],
  					[
  						18.829824792873946,
  						45.908872358025285
  					],
  					[
  						19.005484597557594,
  						44.86023449354299
  					],
  					[
  						15.959367303133376,
  						45.23377676043094
  					],
  					[
  						15.750026075918981,
  						44.818711656262565
  					],
  					[
  						17.674921502358984,
  						43.02856252702361
  					],
  					[
  						18.559999999999945,
  						42.64999999999998
  					],
  					[
  						18.45001688302086,
  						42.47999224531218
  					],
  					[
  						16.015384555737683,
  						43.50721548112722
  					],
  					[
  						14.901602410550879,
  						45.07606028907611
  					],
  					[
  						13.715059848697223,
  						45.500323798192376
  					],
  					[
  						15.327674594797429,
  						45.45231639259333
  					],
  					[
  						16.564808383864857,
  						46.50375092221983
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Croatia",
  			SOV_A3: "HRV",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Croatia",
  			ADM0_A3: "HRV",
  			GEOU_DIF: 0,
  			GEOUNIT: "Croatia",
  			GU_A3: "HRV",
  			SU_DIF: 0,
  			SUBUNIT: "Croatia",
  			SU_A3: "HRV",
  			BRK_DIFF: 0,
  			NAME: "Croatia",
  			NAME_LONG: "Croatia",
  			BRK_A3: "HRV",
  			BRK_NAME: "Croatia",
  			BRK_GROUP: "",
  			ABBREV: "Cro.",
  			POSTAL: "HR",
  			FORMAL_EN: "Republic of Croatia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Croatia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Croatia",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 1,
  			POP_EST: 4292095,
  			POP_RANK: 12,
  			GDP_MD_EST: 94240,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "HR",
  			ISO_A2: "HR",
  			ISO_A3: "HRV",
  			ISO_A3_EH: "HRV",
  			ISO_N3: "191",
  			UN_A3: "191",
  			WB_A2: "HR",
  			WB_A3: "HRV",
  			WOE_ID: 23424843,
  			WOE_ID_EH: 23424843,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "HRV",
  			ADM0_A3_US: "HRV",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320833,
  			WIKIDATAID: "Q224",
  			NAME_AR: "كرواتيا",
  			NAME_BN: "ক্রোয়েশিয়া",
  			NAME_DE: "Kroatien",
  			NAME_EN: "Croatia",
  			NAME_ES: "Croacia",
  			NAME_FR: "Croatie",
  			NAME_EL: "Κροατία",
  			NAME_HI: "क्रोएशिया",
  			NAME_HU: "Horvátország",
  			NAME_ID: "Kroasia",
  			NAME_IT: "Croazia",
  			NAME_JA: "クロアチア",
  			NAME_KO: "크로아티아",
  			NAME_NL: "Kroatië",
  			NAME_PL: "Chorwacja",
  			NAME_PT: "Croácia",
  			NAME_RU: "Хорватия",
  			NAME_SV: "Kroatien",
  			NAME_TR: "Hırvatistan",
  			NAME_VI: "Croatia",
  			NAME_ZH: "克罗地亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						9.59422610844635,
  						47.52505809182027
  					],
  					[
  						10.44270145024663,
  						46.89354625099743
  					],
  					[
  						7.7559920589598335,
  						45.82449005795931
  					],
  					[
  						6.843592970414505,
  						45.99114655210061
  					],
  					[
  						6.037388950229001,
  						46.725778713561866
  					],
  					[
  						7.466759067422231,
  						47.62058197691181
  					],
  					[
  						9.59422610844635,
  						47.52505809182027
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Switzerland",
  			SOV_A3: "CHE",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Switzerland",
  			ADM0_A3: "CHE",
  			GEOU_DIF: 0,
  			GEOUNIT: "Switzerland",
  			GU_A3: "CHE",
  			SU_DIF: 0,
  			SUBUNIT: "Switzerland",
  			SU_A3: "CHE",
  			BRK_DIFF: 0,
  			NAME: "Switzerland",
  			NAME_LONG: "Switzerland",
  			BRK_A3: "CHE",
  			BRK_NAME: "Switzerland",
  			BRK_GROUP: "",
  			ABBREV: "Switz.",
  			POSTAL: "CH",
  			FORMAL_EN: "Swiss Confederation",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Switzerland",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Switzerland",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 3,
  			POP_EST: 8236303,
  			POP_RANK: 13,
  			GDP_MD_EST: 496300,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SZ",
  			ISO_A2: "CH",
  			ISO_A3: "CHE",
  			ISO_A3_EH: "CHE",
  			ISO_N3: "756",
  			UN_A3: "756",
  			WB_A2: "CH",
  			WB_A3: "CHE",
  			WOE_ID: 23424957,
  			WOE_ID_EH: 23424957,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "CHE",
  			ADM0_A3_US: "CHE",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Western Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 11,
  			LONG_LEN: 11,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320491,
  			WIKIDATAID: "Q39",
  			NAME_AR: "سويسرا",
  			NAME_BN: "সুইজারল্যান্ড",
  			NAME_DE: "Schweiz",
  			NAME_EN: "Switzerland",
  			NAME_ES: "Suiza",
  			NAME_FR: "Suisse",
  			NAME_EL: "Ελβετία",
  			NAME_HI: "स्विट्ज़रलैण्ड",
  			NAME_HU: "Svájc",
  			NAME_ID: "Swiss",
  			NAME_IT: "Svizzera",
  			NAME_JA: "スイス",
  			NAME_KO: "스위스",
  			NAME_NL: "Zwitserland",
  			NAME_PL: "Szwajcaria",
  			NAME_PT: "Suíça",
  			NAME_RU: "Швейцария",
  			NAME_SV: "Schweiz",
  			NAME_TR: "İsviçre",
  			NAME_VI: "Thụy Sĩ",
  			NAME_ZH: "瑞士"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						6.043073357781111,
  						50.128051662794235
  					],
  					[
  						6.186320428094177,
  						49.463802802114515
  					],
  					[
  						5.674051954784829,
  						49.529483547557504
  					],
  					[
  						6.043073357781111,
  						50.128051662794235
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Luxembourg",
  			SOV_A3: "LUX",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Luxembourg",
  			ADM0_A3: "LUX",
  			GEOU_DIF: 0,
  			GEOUNIT: "Luxembourg",
  			GU_A3: "LUX",
  			SU_DIF: 0,
  			SUBUNIT: "Luxembourg",
  			SU_A3: "LUX",
  			BRK_DIFF: 0,
  			NAME: "Luxembourg",
  			NAME_LONG: "Luxembourg",
  			BRK_A3: "LUX",
  			BRK_NAME: "Luxembourg",
  			BRK_GROUP: "",
  			ABBREV: "Lux.",
  			POSTAL: "L",
  			FORMAL_EN: "Grand Duchy of Luxembourg",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Luxembourg",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Luxembourg",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 7,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 7,
  			POP_EST: 594130,
  			POP_RANK: 11,
  			GDP_MD_EST: 58740,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LU",
  			ISO_A2: "LU",
  			ISO_A3: "LUX",
  			ISO_A3_EH: "LUX",
  			ISO_N3: "442",
  			UN_A3: "442",
  			WB_A2: "LU",
  			WB_A3: "LUX",
  			WOE_ID: 23424881,
  			WOE_ID_EH: 23424881,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LUX",
  			ADM0_A3_US: "LUX",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Western Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: 5,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5.7,
  			MAX_LABEL: 10,
  			NE_ID: 1159321031,
  			WIKIDATAID: "Q32",
  			NAME_AR: "لوكسمبورغ",
  			NAME_BN: "লুক্সেমবুর্গ",
  			NAME_DE: "Luxemburg",
  			NAME_EN: "Luxembourg",
  			NAME_ES: "Luxemburgo",
  			NAME_FR: "Luxembourg",
  			NAME_EL: "Λουξεμβούργο",
  			NAME_HI: "लक्ज़मबर्ग",
  			NAME_HU: "Luxemburg",
  			NAME_ID: "Luksemburg",
  			NAME_IT: "Lussemburgo",
  			NAME_JA: "ルクセンブルク",
  			NAME_KO: "룩셈부르크",
  			NAME_NL: "Luxemburg",
  			NAME_PL: "Luksemburg",
  			NAME_PT: "Luxemburgo",
  			NAME_RU: "Люксембург",
  			NAME_SV: "Luxemburg",
  			NAME_TR: "Lüksemburg",
  			NAME_VI: "Luxembourg",
  			NAME_ZH: "卢森堡"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						6.15665815595878,
  						50.80372101501058
  					],
  					[
  						6.043073357781111,
  						50.128051662794235
  					],
  					[
  						5.674051954784829,
  						49.529483547557504
  					],
  					[
  						4.2860229834250845,
  						49.907496649772554
  					],
  					[
  						2.5135730322461427,
  						51.14850617126183
  					],
  					[
  						3.3150114849641596,
  						51.34577662473805
  					],
  					[
  						4.973991326526914,
  						51.47502370869813
  					],
  					[
  						6.15665815595878,
  						50.80372101501058
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Belgium",
  			SOV_A3: "BEL",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Belgium",
  			ADM0_A3: "BEL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Belgium",
  			GU_A3: "BEL",
  			SU_DIF: 0,
  			SUBUNIT: "Belgium",
  			SU_A3: "BEL",
  			BRK_DIFF: 0,
  			NAME: "Belgium",
  			NAME_LONG: "Belgium",
  			BRK_A3: "BEL",
  			BRK_NAME: "Belgium",
  			BRK_GROUP: "",
  			ABBREV: "Belg.",
  			POSTAL: "B",
  			FORMAL_EN: "Kingdom of Belgium",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Belgium",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Belgium",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 8,
  			POP_EST: 11491346,
  			POP_RANK: 14,
  			GDP_MD_EST: 508600,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BE",
  			ISO_A2: "BE",
  			ISO_A3: "BEL",
  			ISO_A3_EH: "BEL",
  			ISO_N3: "056",
  			UN_A3: "056",
  			WB_A2: "BE",
  			WB_A3: "BEL",
  			WOE_ID: 23424757,
  			WOE_ID_EH: 23424757,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BEL",
  			ADM0_A3_US: "BEL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Western Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320389,
  			WIKIDATAID: "Q31",
  			NAME_AR: "بلجيكا",
  			NAME_BN: "বেলজিয়াম",
  			NAME_DE: "Belgien",
  			NAME_EN: "Belgium",
  			NAME_ES: "Bélgica",
  			NAME_FR: "Belgique",
  			NAME_EL: "Βέλγιο",
  			NAME_HI: "बेल्जियम",
  			NAME_HU: "Belgium",
  			NAME_ID: "Belgia",
  			NAME_IT: "Belgio",
  			NAME_JA: "ベルギー",
  			NAME_KO: "벨기에",
  			NAME_NL: "België",
  			NAME_PL: "Belgia",
  			NAME_PT: "Bélgica",
  			NAME_RU: "Бельгия",
  			NAME_SV: "Belgien",
  			NAME_TR: "Belçika",
  			NAME_VI: "Bỉ",
  			NAME_ZH: "比利时"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						6.905139601274129,
  						53.48216217713065
  					],
  					[
  						7.092053256873896,
  						53.144043280644894
  					],
  					[
  						6.15665815595878,
  						50.80372101501058
  					],
  					[
  						4.973991326526914,
  						51.47502370869813
  					],
  					[
  						3.3150114849641596,
  						51.34577662473805
  					],
  					[
  						4.705997348661185,
  						53.091798407597764
  					],
  					[
  						6.905139601274129,
  						53.48216217713065
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Netherlands",
  			SOV_A3: "NL1",
  			ADM0_DIF: 1,
  			LEVEL: 2,
  			TYPE: "Country",
  			ADMIN: "Netherlands",
  			ADM0_A3: "NLD",
  			GEOU_DIF: 0,
  			GEOUNIT: "Netherlands",
  			GU_A3: "NLD",
  			SU_DIF: 0,
  			SUBUNIT: "Netherlands",
  			SU_A3: "NLD",
  			BRK_DIFF: 0,
  			NAME: "Netherlands",
  			NAME_LONG: "Netherlands",
  			BRK_A3: "NLD",
  			BRK_NAME: "Netherlands",
  			BRK_GROUP: "",
  			ABBREV: "Neth.",
  			POSTAL: "NL",
  			FORMAL_EN: "Kingdom of the Netherlands",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Netherlands",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Netherlands",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 9,
  			POP_EST: 17084719,
  			POP_RANK: 14,
  			GDP_MD_EST: 870800,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "NL",
  			ISO_A2: "NL",
  			ISO_A3: "NLD",
  			ISO_A3_EH: "NLD",
  			ISO_N3: "528",
  			UN_A3: "528",
  			WB_A2: "NL",
  			WB_A3: "NLD",
  			WOE_ID: -90,
  			WOE_ID_EH: 23424909,
  			WOE_NOTE: "Doesn't include new former units of Netherlands Antilles (24549811, 24549808, and 24549809)",
  			ADM0_A3_IS: "NLD",
  			ADM0_A3_US: "NLD",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Western Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 11,
  			LONG_LEN: 11,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321101,
  			WIKIDATAID: "Q55",
  			NAME_AR: "هولندا",
  			NAME_BN: "নেদারল্যান্ডস",
  			NAME_DE: "Niederlande",
  			NAME_EN: "Netherlands",
  			NAME_ES: "Países Bajos",
  			NAME_FR: "Pays-Bas",
  			NAME_EL: "Ολλανδία",
  			NAME_HI: "नीदरलैण्ड",
  			NAME_HU: "Hollandia",
  			NAME_ID: "Belanda",
  			NAME_IT: "Paesi Bassi",
  			NAME_JA: "オランダ",
  			NAME_KO: "네덜란드",
  			NAME_NL: "Nederland",
  			NAME_PL: "Holandia",
  			NAME_PT: "Países Baixos",
  			NAME_RU: "Нидерланды",
  			NAME_SV: "Nederländerna",
  			NAME_TR: "Hollanda",
  			NAME_VI: "Hà Lan",
  			NAME_ZH: "荷蘭"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-9.034817674180246,
  						41.880570583659676
  					],
  					[
  						-6.6686055159676565,
  						41.883386949219584
  					],
  					[
  						-7.453725551778092,
  						37.09778758396607
  					],
  					[
  						-8.898856980820327,
  						36.86880931248078
  					],
  					[
  						-8.83999752443988,
  						38.266243394517616
  					],
  					[
  						-9.526570603869715,
  						38.73742910415491
  					],
  					[
  						-8.768684047877102,
  						40.76063894303019
  					],
  					[
  						-9.034817674180246,
  						41.880570583659676
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Portugal",
  			SOV_A3: "PRT",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Portugal",
  			ADM0_A3: "PRT",
  			GEOU_DIF: 0,
  			GEOUNIT: "Portugal",
  			GU_A3: "PRT",
  			SU_DIF: 1,
  			SUBUNIT: "Portugal",
  			SU_A3: "PR1",
  			BRK_DIFF: 0,
  			NAME: "Portugal",
  			NAME_LONG: "Portugal",
  			BRK_A3: "PR1",
  			BRK_NAME: "Portugal",
  			BRK_GROUP: "",
  			ABBREV: "Port.",
  			POSTAL: "P",
  			FORMAL_EN: "Portuguese Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Portugal",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Portugal",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 7,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 4,
  			POP_EST: 10839514,
  			POP_RANK: 14,
  			GDP_MD_EST: 297100,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "PO",
  			ISO_A2: "PT",
  			ISO_A3: "PRT",
  			ISO_A3_EH: "PRT",
  			ISO_N3: "620",
  			UN_A3: "620",
  			WB_A2: "PT",
  			WB_A3: "PRT",
  			WOE_ID: 23424925,
  			WOE_ID_EH: 23424925,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "PRT",
  			ADM0_A3_US: "PRT",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321187,
  			WIKIDATAID: "Q45",
  			NAME_AR: "البرتغال",
  			NAME_BN: "পর্তুগাল",
  			NAME_DE: "Portugal",
  			NAME_EN: "Portugal",
  			NAME_ES: "Portugal",
  			NAME_FR: "Portugal",
  			NAME_EL: "Πορτογαλία",
  			NAME_HI: "पुर्तगाल",
  			NAME_HU: "Portugália",
  			NAME_ID: "Portugal",
  			NAME_IT: "Portogallo",
  			NAME_JA: "ポルトガル",
  			NAME_KO: "포르투갈",
  			NAME_NL: "Portugal",
  			NAME_PL: "Portugalia",
  			NAME_PT: "Portugal",
  			NAME_RU: "Португалия",
  			NAME_SV: "Portugal",
  			NAME_TR: "Portekiz",
  			NAME_VI: "Bồ Đào Nha",
  			NAME_ZH: "葡萄牙"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-7.453725551778092,
  						37.09778758396607
  					],
  					[
  						-6.6686055159676565,
  						41.883386949219584
  					],
  					[
  						-9.034817674180246,
  						41.880570583659676
  					],
  					[
  						-9.392883673530648,
  						43.0266246608127
  					],
  					[
  						-7.97818966310831,
  						43.74833771420099
  					],
  					[
  						-4.3478427799557835,
  						43.40344920508504
  					],
  					[
  						-1.901351284177764,
  						43.42280202897834
  					],
  					[
  						-1.502770961910528,
  						43.03401439063043
  					],
  					[
  						1.8267932470871528,
  						42.34338471126569
  					],
  					[
  						2.9859989762584576,
  						42.47301504166986
  					],
  					[
  						2.0918416683121848,
  						41.226088568683096
  					],
  					[
  						0.8105245296351882,
  						41.01473196060934
  					],
  					[
  						-0.27871131021294104,
  						39.30997813573272
  					],
  					[
  						0.11129072429383768,
  						38.73851430923304
  					],
  					[
  						-0.6833894514905978,
  						37.642353827457825
  					],
  					[
  						-2.146452602538119,
  						36.67414419203729
  					],
  					[
  						-4.368900926114719,
  						36.677839056946155
  					],
  					[
  						-5.3771597965614575,
  						35.946850083961465
  					],
  					[
  						-6.520190802425404,
  						36.94291331638732
  					],
  					[
  						-7.453725551778092,
  						37.09778758396607
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Spain",
  			SOV_A3: "ESP",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Spain",
  			ADM0_A3: "ESP",
  			GEOU_DIF: 0,
  			GEOUNIT: "Spain",
  			GU_A3: "ESP",
  			SU_DIF: 0,
  			SUBUNIT: "Spain",
  			SU_A3: "ESP",
  			BRK_DIFF: 0,
  			NAME: "Spain",
  			NAME_LONG: "Spain",
  			BRK_A3: "ESP",
  			BRK_NAME: "Spain",
  			BRK_GROUP: "",
  			ABBREV: "Sp.",
  			POSTAL: "E",
  			FORMAL_EN: "Kingdom of Spain",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Spain",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Spain",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 5,
  			POP_EST: 48958159,
  			POP_RANK: 15,
  			GDP_MD_EST: 1690000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SP",
  			ISO_A2: "ES",
  			ISO_A3: "ESP",
  			ISO_A3_EH: "ESP",
  			ISO_N3: "724",
  			UN_A3: "724",
  			WB_A2: "ES",
  			WB_A3: "ESP",
  			WOE_ID: 23424950,
  			WOE_ID_EH: 23424950,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ESP",
  			ADM0_A3_US: "ESP",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 3,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2,
  			MAX_LABEL: 7,
  			NE_ID: 1159320587,
  			WIKIDATAID: "Q29",
  			NAME_AR: "إسبانيا",
  			NAME_BN: "স্পেন",
  			NAME_DE: "Spanien",
  			NAME_EN: "Spain",
  			NAME_ES: "España",
  			NAME_FR: "Espagne",
  			NAME_EL: "Ισπανία",
  			NAME_HI: "स्पेन",
  			NAME_HU: "Spanyolország",
  			NAME_ID: "Spanyol",
  			NAME_IT: "Spagna",
  			NAME_JA: "スペイン",
  			NAME_KO: "스페인",
  			NAME_NL: "Spanje",
  			NAME_PL: "Hiszpania",
  			NAME_PT: "Espanha",
  			NAME_RU: "Испания",
  			NAME_SV: "Spanien",
  			NAME_TR: "İspanya",
  			NAME_VI: "Tây Ban Nha",
  			NAME_ZH: "西班牙"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-6.197884894220991,
  						53.867565009163364
  					],
  					[
  						-6.032985398777611,
  						53.15316417094435
  					],
  					[
  						-6.788856573910849,
  						52.260117906292336
  					],
  					[
  						-8.56161658368356,
  						51.669301255899356
  					],
  					[
  						-9.977085740590269,
  						51.82045482035308
  					],
  					[
  						-9.166282517930782,
  						52.86462881124268
  					],
  					[
  						-9.688524542672454,
  						53.8813626165853
  					],
  					[
  						-7.572167934591064,
  						55.13162221945487
  					],
  					[
  						-7.572167934591064,
  						54.059956366586
  					],
  					[
  						-6.197884894220991,
  						53.867565009163364
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Ireland",
  			SOV_A3: "IRL",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Ireland",
  			ADM0_A3: "IRL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Ireland",
  			GU_A3: "IRL",
  			SU_DIF: 0,
  			SUBUNIT: "Ireland",
  			SU_A3: "IRL",
  			BRK_DIFF: 0,
  			NAME: "Ireland",
  			NAME_LONG: "Ireland",
  			BRK_A3: "IRL",
  			BRK_NAME: "Ireland",
  			BRK_GROUP: "",
  			ABBREV: "Ire.",
  			POSTAL: "IRL",
  			FORMAL_EN: "Ireland",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Ireland",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Ireland",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 2,
  			POP_EST: 5011102,
  			POP_RANK: 13,
  			GDP_MD_EST: 322000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "EI",
  			ISO_A2: "IE",
  			ISO_A3: "IRL",
  			ISO_A3_EH: "IRL",
  			ISO_N3: "372",
  			UN_A3: "372",
  			WB_A2: "IE",
  			WB_A3: "IRL",
  			WOE_ID: 23424803,
  			WOE_ID_EH: 23424803,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "IRL",
  			ADM0_A3_US: "IRL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Northern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320877,
  			WIKIDATAID: "Q27",
  			NAME_AR: "جمهورية أيرلندا",
  			NAME_BN: "প্রজাতন্ত্রী আয়ারল্যান্ড",
  			NAME_DE: "Irland",
  			NAME_EN: "Ireland",
  			NAME_ES: "Irlanda",
  			NAME_FR: "Irlande",
  			NAME_EL: "Δημοκρατία της Ιρλανδίας",
  			NAME_HI: "आयरलैण्ड",
  			NAME_HU: "Írország",
  			NAME_ID: "Republik Irlandia",
  			NAME_IT: "Irlanda",
  			NAME_JA: "アイルランド",
  			NAME_KO: "아일랜드",
  			NAME_NL: "Ierland",
  			NAME_PL: "Irlandia",
  			NAME_PT: "República da Irlanda",
  			NAME_RU: "Ирландия",
  			NAME_SV: "Irland",
  			NAME_TR: "İrlanda",
  			NAME_VI: "Cộng hòa Ireland",
  			NAME_ZH: "爱尔兰共和国"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						165.77998986232637,
  						-21.08000497811563
  					],
  					[
  						165.47437544175222,
  						-21.679606621998232
  					],
  					[
  						164.16799523341365,
  						-20.444746595951628
  					],
  					[
  						164.45996707586272,
  						-20.1200118954295
  					],
  					[
  						165.77998986232637,
  						-21.08000497811563
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "France",
  			SOV_A3: "FR1",
  			ADM0_DIF: 1,
  			LEVEL: 2,
  			TYPE: "Dependency",
  			ADMIN: "New Caledonia",
  			ADM0_A3: "NCL",
  			GEOU_DIF: 0,
  			GEOUNIT: "New Caledonia",
  			GU_A3: "NCL",
  			SU_DIF: 0,
  			SUBUNIT: "New Caledonia",
  			SU_A3: "NCL",
  			BRK_DIFF: 0,
  			NAME: "New Caledonia",
  			NAME_LONG: "New Caledonia",
  			BRK_A3: "NCL",
  			BRK_NAME: "New Caledonia",
  			BRK_GROUP: "",
  			ABBREV: "New C.",
  			POSTAL: "NC",
  			FORMAL_EN: "New Caledonia",
  			FORMAL_FR: "Nouvelle-Calédonie",
  			NAME_CIAWF: "New Caledonia",
  			NOTE_ADM0: "Fr.",
  			NOTE_BRK: "",
  			NAME_SORT: "New Caledonia",
  			NAME_ALT: "",
  			MAPCOLOR7: 7,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 9,
  			MAPCOLOR13: 11,
  			POP_EST: 279070,
  			POP_RANK: 10,
  			GDP_MD_EST: 10770,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "NC",
  			ISO_A2: "NC",
  			ISO_A3: "NCL",
  			ISO_A3_EH: "NCL",
  			ISO_N3: "540",
  			UN_A3: "540",
  			WB_A2: "NC",
  			WB_A3: "NCL",
  			WOE_ID: 23424903,
  			WOE_ID_EH: 23424903,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "NCL",
  			ADM0_A3_US: "NCL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Oceania",
  			REGION_UN: "Oceania",
  			SUBREGION: "Melanesia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 13,
  			LONG_LEN: 13,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: -99,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4.6,
  			MAX_LABEL: 8,
  			NE_ID: 1159320641,
  			WIKIDATAID: "Q33788",
  			NAME_AR: "كاليدونيا الجديدة",
  			NAME_BN: "নিউ ক্যালিডোনিয়া",
  			NAME_DE: "Neukaledonien",
  			NAME_EN: "New Caledonia",
  			NAME_ES: "Nueva Caledonia",
  			NAME_FR: "Nouvelle-Calédonie",
  			NAME_EL: "Νέα Καληδονία",
  			NAME_HI: "नया कैलेडोनिया",
  			NAME_HU: "Új-Kaledónia",
  			NAME_ID: "Kaledonia Baru",
  			NAME_IT: "Nuova Caledonia",
  			NAME_JA: "ニューカレドニア",
  			NAME_KO: "누벨칼레도니",
  			NAME_NL: "Nieuw-Caledonië",
  			NAME_PL: "Nowa Kaledonia",
  			NAME_PT: "Nova Caledónia",
  			NAME_RU: "Новая Каледония",
  			NAME_SV: "Nya Kaledonien",
  			NAME_TR: "Yeni Kaledonya",
  			NAME_VI: "Nouvelle-Calédonie",
  			NAME_ZH: "新喀里多尼亞"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						81.7879590188914,
  						7.523055324733164
  					],
  					[
  						81.63732221876059,
  						6.481775214051922
  					],
  					[
  						80.34835696810441,
  						5.968369859232155
  					],
  					[
  						79.87246870312853,
  						6.76346344647493
  					],
  					[
  						79.69516686393513,
  						8.200843410673386
  					],
  					[
  						80.14780073437964,
  						9.824077663609557
  					],
  					[
  						80.83881798698656,
  						9.268426825391188
  					],
  					[
  						81.7879590188914,
  						7.523055324733164
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Sri Lanka",
  			SOV_A3: "LKA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Sri Lanka",
  			ADM0_A3: "LKA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Sri Lanka",
  			GU_A3: "LKA",
  			SU_DIF: 0,
  			SUBUNIT: "Sri Lanka",
  			SU_A3: "LKA",
  			BRK_DIFF: 0,
  			NAME: "Sri Lanka",
  			NAME_LONG: "Sri Lanka",
  			BRK_A3: "LKA",
  			BRK_NAME: "Sri Lanka",
  			BRK_GROUP: "",
  			ABBREV: "Sri L.",
  			POSTAL: "LK",
  			FORMAL_EN: "Democratic Socialist Republic of Sri Lanka",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Sri Lanka",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Sri Lanka",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 9,
  			POP_EST: 22409381,
  			POP_RANK: 15,
  			GDP_MD_EST: 236700,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "CE",
  			ISO_A2: "LK",
  			ISO_A3: "LKA",
  			ISO_A3_EH: "LKA",
  			ISO_N3: "144",
  			UN_A3: "144",
  			WB_A2: "LK",
  			WB_A3: "LKA",
  			WOE_ID: 23424778,
  			WOE_ID_EH: 23424778,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LKA",
  			ADM0_A3_US: "LKA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Southern Asia",
  			REGION_WB: "South Asia",
  			NAME_LEN: 9,
  			LONG_LEN: 9,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321025,
  			WIKIDATAID: "Q854",
  			NAME_AR: "سريلانكا",
  			NAME_BN: "শ্রীলঙ্কা",
  			NAME_DE: "Sri Lanka",
  			NAME_EN: "Sri Lanka",
  			NAME_ES: "Sri Lanka",
  			NAME_FR: "Sri Lanka",
  			NAME_EL: "Σρι Λάνκα",
  			NAME_HI: "श्रीलंका",
  			NAME_HU: "Srí Lanka",
  			NAME_ID: "Sri Lanka",
  			NAME_IT: "Sri Lanka",
  			NAME_JA: "スリランカ",
  			NAME_KO: "스리랑카",
  			NAME_NL: "Sri Lanka",
  			NAME_PL: "Sri Lanka",
  			NAME_PT: "Sri Lanka",
  			NAME_RU: "Шри-Ланка",
  			NAME_SV: "Sri Lanka",
  			NAME_TR: "Sri Lanka",
  			NAME_VI: "Sri Lanka",
  			NAME_ZH: "斯里蘭卡"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						121.77781782438993,
  						24.3942735865194
  					],
  					[
  						120.74707970589623,
  						21.970571397382113
  					],
  					[
  						120.1061885926124,
  						23.556262722258236
  					],
  					[
  						121.49504438688878,
  						25.295458889257386
  					],
  					[
  						121.77781782438993,
  						24.3942735865194
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Taiwan",
  			SOV_A3: "TWN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Taiwan",
  			ADM0_A3: "TWN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Taiwan",
  			GU_A3: "TWN",
  			SU_DIF: 0,
  			SUBUNIT: "Taiwan",
  			SU_A3: "TWN",
  			BRK_DIFF: 1,
  			NAME: "Taiwan",
  			NAME_LONG: "Taiwan",
  			BRK_A3: "B77",
  			BRK_NAME: "Taiwan",
  			BRK_GROUP: "",
  			ABBREV: "Taiwan",
  			POSTAL: "TW",
  			FORMAL_EN: "",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Taiwan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "Self admin.; Claimed by China",
  			NAME_SORT: "Taiwan",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 5,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 2,
  			POP_EST: 23508428,
  			POP_RANK: 15,
  			GDP_MD_EST: 1127000,
  			POP_YEAR: 2017,
  			LASTCENSUS: -99,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "TW",
  			ISO_A2: "TW",
  			ISO_A3: "TWN",
  			ISO_A3_EH: "TWN",
  			ISO_N3: "158",
  			UN_A3: "-099",
  			WB_A2: "-99",
  			WB_A3: "-99",
  			WOE_ID: 23424971,
  			WOE_ID_EH: 23424971,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "TWN",
  			ADM0_A3_US: "TWN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321335,
  			WIKIDATAID: "Q865",
  			NAME_AR: "تايوان",
  			NAME_BN: "তাইওয়ান",
  			NAME_DE: "Taiwan",
  			NAME_EN: "Taiwan",
  			NAME_ES: "Taiwán",
  			NAME_FR: "Taïwan",
  			NAME_EL: "Δημοκρατία της Κίνας",
  			NAME_HI: "चीनी गणराज्य",
  			NAME_HU: "Kínai Köztársaság",
  			NAME_ID: "Republik Tiongkok",
  			NAME_IT: "Taiwan",
  			NAME_JA: "中華民国",
  			NAME_KO: "중화민국",
  			NAME_NL: "Taiwan",
  			NAME_PL: "Republika Chińska",
  			NAME_PT: "Taiwan",
  			NAME_RU: "Китайская Республика",
  			NAME_SV: "Taiwan",
  			NAME_TR: "Çin Cumhuriyeti",
  			NAME_VI: "Đài Loan",
  			NAME_ZH: "中華民國"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						9.921906365609118,
  						54.98310415304803
  					],
  					[
  						8.526229282270208,
  						54.96274363872516
  					],
  					[
  						8.08997684086222,
  						56.54001170513759
  					],
  					[
  						8.543437534223415,
  						57.11000275331695
  					],
  					[
  						10.250000034230226,
  						56.89001618105044
  					],
  					[
  						9.921906365609118,
  						54.98310415304803
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Denmark",
  			SOV_A3: "DN1",
  			ADM0_DIF: 1,
  			LEVEL: 2,
  			TYPE: "Country",
  			ADMIN: "Denmark",
  			ADM0_A3: "DNK",
  			GEOU_DIF: 0,
  			GEOUNIT: "Denmark",
  			GU_A3: "DNK",
  			SU_DIF: 0,
  			SUBUNIT: "Denmark",
  			SU_A3: "DNK",
  			BRK_DIFF: 0,
  			NAME: "Denmark",
  			NAME_LONG: "Denmark",
  			BRK_A3: "DNK",
  			BRK_NAME: "Denmark",
  			BRK_GROUP: "",
  			ABBREV: "Den.",
  			POSTAL: "DK",
  			FORMAL_EN: "Kingdom of Denmark",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Denmark",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Denmark",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 12,
  			POP_EST: 5605948,
  			POP_RANK: 13,
  			GDP_MD_EST: 264800,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "DA",
  			ISO_A2: "DK",
  			ISO_A3: "DNK",
  			ISO_A3_EH: "DNK",
  			ISO_N3: "208",
  			UN_A3: "208",
  			WB_A2: "DK",
  			WB_A3: "DNK",
  			WOE_ID: 23424796,
  			WOE_ID_EH: 23424796,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "DNK",
  			ADM0_A3_US: "DNK",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Northern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320547,
  			WIKIDATAID: "Q35",
  			NAME_AR: "الدنمارك",
  			NAME_BN: "ডেনমার্ক",
  			NAME_DE: "Dänemark",
  			NAME_EN: "Denmark",
  			NAME_ES: "Dinamarca",
  			NAME_FR: "Danemark",
  			NAME_EL: "Δανία",
  			NAME_HI: "डेनमार्क",
  			NAME_HU: "Dánia",
  			NAME_ID: "Denmark",
  			NAME_IT: "Danimarca",
  			NAME_JA: "デンマーク",
  			NAME_KO: "덴마크",
  			NAME_NL: "Denemarken",
  			NAME_PL: "Dania",
  			NAME_PT: "Dinamarca",
  			NAME_RU: "Дания",
  			NAME_SV: "Danmark",
  			NAME_TR: "Danimarka",
  			NAME_VI: "Đan Mạch",
  			NAME_ZH: "丹麦"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-14.508695441129234,
  						66.45589223903143
  					],
  					[
  						-13.60973222497981,
  						65.12667104761987
  					],
  					[
  						-14.909833746794902,
  						64.36408193628868
  					],
  					[
  						-18.656245896874992,
  						63.49638296167582
  					],
  					[
  						-22.762971971110158,
  						63.960178941495386
  					],
  					[
  						-23.95504391121911,
  						64.8911298692335
  					],
  					[
  						-23.65051469572309,
  						66.26251902939522
  					],
  					[
  						-22.134922451250887,
  						66.41046865504687
  					],
  					[
  						-20.57628373867955,
  						65.73211212835143
  					],
  					[
  						-14.508695441129234,
  						66.45589223903143
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Iceland",
  			SOV_A3: "ISL",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Iceland",
  			ADM0_A3: "ISL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Iceland",
  			GU_A3: "ISL",
  			SU_DIF: 0,
  			SUBUNIT: "Iceland",
  			SU_A3: "ISL",
  			BRK_DIFF: 0,
  			NAME: "Iceland",
  			NAME_LONG: "Iceland",
  			BRK_A3: "ISL",
  			BRK_NAME: "Iceland",
  			BRK_GROUP: "",
  			ABBREV: "Iceland",
  			POSTAL: "IS",
  			FORMAL_EN: "Republic of Iceland",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Iceland",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Iceland",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 9,
  			POP_EST: 339747,
  			POP_RANK: 10,
  			GDP_MD_EST: 16150,
  			POP_YEAR: 2017,
  			LASTCENSUS: -99,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "IC",
  			ISO_A2: "IS",
  			ISO_A3: "ISL",
  			ISO_A3_EH: "ISL",
  			ISO_N3: "352",
  			UN_A3: "352",
  			WB_A2: "IS",
  			WB_A3: "ISL",
  			WOE_ID: 23424845,
  			WOE_ID_EH: 23424845,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ISL",
  			ADM0_A3_US: "ISL",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Northern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 7,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2,
  			MAX_LABEL: 7,
  			NE_ID: 1159320917,
  			WIKIDATAID: "Q189",
  			NAME_AR: "آيسلندا",
  			NAME_BN: "আইসল্যান্ড",
  			NAME_DE: "Island",
  			NAME_EN: "Iceland",
  			NAME_ES: "Islandia",
  			NAME_FR: "Islande",
  			NAME_EL: "Ισλανδία",
  			NAME_HI: "आइसलैण्ड",
  			NAME_HU: "Izland",
  			NAME_ID: "Islandia",
  			NAME_IT: "Islanda",
  			NAME_JA: "アイスランド",
  			NAME_KO: "아이슬란드",
  			NAME_NL: "IJsland",
  			NAME_PL: "Islandia",
  			NAME_PT: "Islândia",
  			NAME_RU: "Исландия",
  			NAME_SV: "Island",
  			NAME_TR: "İzlanda",
  			NAME_VI: "Iceland",
  			NAME_ZH: "冰岛"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						46.404950799348825,
  						41.860675157227305
  					],
  					[
  						47.81566572448463,
  						41.15141612402135
  					],
  					[
  						48.58435339611342,
  						41.80886879162067
  					],
  					[
  						49.6189148293096,
  						40.57292430272996
  					],
  					[
  						48.88324913920249,
  						38.32024526626262
  					],
  					[
  						47.685079380083096,
  						39.50836395930122
  					],
  					[
  						46.50571984231797,
  						38.770605373686294
  					],
  					[
  						46.48349897643246,
  						39.464154771475535
  					],
  					[
  						44.97248009621808,
  						41.248128567055595
  					],
  					[
  						46.63790815612058,
  						41.181672675128226
  					],
  					[
  						46.404950799348825,
  						41.860675157227305
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Azerbaijan",
  			SOV_A3: "AZE",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Azerbaijan",
  			ADM0_A3: "AZE",
  			GEOU_DIF: 0,
  			GEOUNIT: "Azerbaijan",
  			GU_A3: "AZE",
  			SU_DIF: 0,
  			SUBUNIT: "Azerbaijan",
  			SU_A3: "AZE",
  			BRK_DIFF: 0,
  			NAME: "Azerbaijan",
  			NAME_LONG: "Azerbaijan",
  			BRK_A3: "AZE",
  			BRK_NAME: "Azerbaijan",
  			BRK_GROUP: "",
  			ABBREV: "Aze.",
  			POSTAL: "AZ",
  			FORMAL_EN: "Republic of Azerbaijan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Azerbaijan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Azerbaijan",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 8,
  			POP_EST: 9961396,
  			POP_RANK: 13,
  			GDP_MD_EST: 167900,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "AJ",
  			ISO_A2: "AZ",
  			ISO_A3: "AZE",
  			ISO_A3_EH: "AZE",
  			ISO_N3: "031",
  			UN_A3: "031",
  			WB_A2: "AZ",
  			WB_A3: "AZE",
  			WOE_ID: 23424741,
  			WOE_ID_EH: 23424741,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "AZE",
  			ADM0_A3_US: "AZE",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320381,
  			WIKIDATAID: "Q227",
  			NAME_AR: "أذربيجان",
  			NAME_BN: "আজারবাইজান",
  			NAME_DE: "Aserbaidschan",
  			NAME_EN: "Azerbaijan",
  			NAME_ES: "Azerbaiyán",
  			NAME_FR: "Azerbaïdjan",
  			NAME_EL: "Αζερμπαϊτζάν",
  			NAME_HI: "अज़रबैजान",
  			NAME_HU: "Azerbajdzsán",
  			NAME_ID: "Azerbaijan",
  			NAME_IT: "Azerbaigian",
  			NAME_JA: "アゼルバイジャン",
  			NAME_KO: "아제르바이잔",
  			NAME_NL: "Azerbeidzjan",
  			NAME_PL: "Azerbejdżan",
  			NAME_PT: "Azerbaijão",
  			NAME_RU: "Азербайджан",
  			NAME_SV: "Azerbajdzjan",
  			NAME_TR: "Azerbaycan",
  			NAME_VI: "Azerbaijan",
  			NAME_ZH: "阿塞拜疆"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						39.955008579270924,
  						43.43499766699922
  					],
  					[
  						42.39440000000013,
  						43.220300000000066
  					],
  					[
  						43.75599000000011,
  						42.740830000000074
  					],
  					[
  						45.47027916848572,
  						42.50278066666998
  					],
  					[
  						46.404950799348825,
  						41.860675157227305
  					],
  					[
  						46.63790815612058,
  						41.181672675128226
  					],
  					[
  						44.97248009621808,
  						41.248128567055595
  					],
  					[
  						43.58274580259273,
  						41.09214325618257
  					],
  					[
  						42.61954878110449,
  						41.58317271581994
  					],
  					[
  						41.55408410011066,
  						41.53565623632757
  					],
  					[
  						41.45347008643839,
  						42.64512339941794
  					],
  					[
  						39.955008579270924,
  						43.43499766699922
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Georgia",
  			SOV_A3: "GEO",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Georgia",
  			ADM0_A3: "GEO",
  			GEOU_DIF: 0,
  			GEOUNIT: "Georgia",
  			GU_A3: "GEO",
  			SU_DIF: 0,
  			SUBUNIT: "Georgia",
  			SU_A3: "GEO",
  			BRK_DIFF: 0,
  			NAME: "Georgia",
  			NAME_LONG: "Georgia",
  			BRK_A3: "GEO",
  			BRK_NAME: "Georgia",
  			BRK_GROUP: "",
  			ABBREV: "Geo.",
  			POSTAL: "GE",
  			FORMAL_EN: "Georgia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Georgia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Georgia",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 2,
  			POP_EST: 4926330,
  			POP_RANK: 12,
  			GDP_MD_EST: 37270,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "GG",
  			ISO_A2: "GE",
  			ISO_A3: "GEO",
  			ISO_A3_EH: "GEO",
  			ISO_N3: "268",
  			UN_A3: "268",
  			WB_A2: "GE",
  			WB_A3: "GEO",
  			WOE_ID: 23424823,
  			WOE_ID_EH: 23424823,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "GEO",
  			ADM0_A3_US: "GEO",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320779,
  			WIKIDATAID: "Q230",
  			NAME_AR: "جورجيا",
  			NAME_BN: "জর্জিয়া",
  			NAME_DE: "Georgien",
  			NAME_EN: "Georgia",
  			NAME_ES: "Georgia",
  			NAME_FR: "Géorgie",
  			NAME_EL: "Γεωργία",
  			NAME_HI: "जॉर्जिया",
  			NAME_HU: "Grúzia",
  			NAME_ID: "Georgia",
  			NAME_IT: "Georgia",
  			NAME_JA: "ジョージア",
  			NAME_KO: "조지아",
  			NAME_NL: "Georgië",
  			NAME_PL: "Gruzja",
  			NAME_PT: "Geórgia",
  			NAME_RU: "Грузия",
  			NAME_SV: "Georgien",
  			NAME_TR: "Gürcistan",
  			NAME_VI: "Gruzia",
  			NAME_ZH: "格鲁吉亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						115.45071048386981,
  						5.447729803891534
  					],
  					[
  						115.34746097215066,
  						4.316636053887009
  					],
  					[
  						114.20401655482837,
  						4.5258739282368055
  					],
  					[
  						115.45071048386981,
  						5.447729803891534
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Brunei",
  			SOV_A3: "BRN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Brunei",
  			ADM0_A3: "BRN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Brunei",
  			GU_A3: "BRN",
  			SU_DIF: 0,
  			SUBUNIT: "Brunei",
  			SU_A3: "BRN",
  			BRK_DIFF: 0,
  			NAME: "Brunei",
  			NAME_LONG: "Brunei Darussalam",
  			BRK_A3: "BRN",
  			BRK_NAME: "Brunei",
  			BRK_GROUP: "",
  			ABBREV: "Brunei",
  			POSTAL: "BN",
  			FORMAL_EN: "Negara Brunei Darussalam",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Brunei",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Brunei",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 12,
  			POP_EST: 443593,
  			POP_RANK: 10,
  			GDP_MD_EST: 33730,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2001,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BX",
  			ISO_A2: "BN",
  			ISO_A3: "BRN",
  			ISO_A3_EH: "BRN",
  			ISO_N3: "096",
  			UN_A3: "096",
  			WB_A2: "BN",
  			WB_A3: "BRN",
  			WOE_ID: 23424773,
  			WOE_ID_EH: 23424773,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BRN",
  			ADM0_A3_US: "BRN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "South-Eastern Asia",
  			REGION_WB: "East Asia & Pacific",
  			NAME_LEN: 6,
  			LONG_LEN: 17,
  			ABBREV_LEN: 6,
  			TINY: 2,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320451,
  			WIKIDATAID: "Q921",
  			NAME_AR: "بروناي",
  			NAME_BN: "ব্রুনাই",
  			NAME_DE: "Brunei",
  			NAME_EN: "Brunei",
  			NAME_ES: "Brunéi",
  			NAME_FR: "Brunei",
  			NAME_EL: "Μπρουνέι",
  			NAME_HI: "ब्रुनेई",
  			NAME_HU: "Brunei",
  			NAME_ID: "Brunei Darussalam",
  			NAME_IT: "Brunei",
  			NAME_JA: "ブルネイ",
  			NAME_KO: "브루나이",
  			NAME_NL: "Brunei",
  			NAME_PL: "Brunei",
  			NAME_PT: "Brunei",
  			NAME_RU: "Бруней",
  			NAME_SV: "Brunei",
  			NAME_TR: "Brunei",
  			NAME_VI: "Brunei",
  			NAME_ZH: "文莱"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						13.806475457421527,
  						46.509306138691215
  					],
  					[
  						16.202298211337364,
  						46.85238597267696
  					],
  					[
  						16.564808383864857,
  						46.50375092221983
  					],
  					[
  						15.327674594797429,
  						45.45231639259333
  					],
  					[
  						13.715059848697223,
  						45.500323798192376
  					],
  					[
  						13.937630242578308,
  						45.59101593686462
  					],
  					[
  						13.806475457421527,
  						46.509306138691215
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Slovenia",
  			SOV_A3: "SVN",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Slovenia",
  			ADM0_A3: "SVN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Slovenia",
  			GU_A3: "SVN",
  			SU_DIF: 0,
  			SUBUNIT: "Slovenia",
  			SU_A3: "SVN",
  			BRK_DIFF: 0,
  			NAME: "Slovenia",
  			NAME_LONG: "Slovenia",
  			BRK_A3: "SVN",
  			BRK_NAME: "Slovenia",
  			BRK_GROUP: "",
  			ABBREV: "Slo.",
  			POSTAL: "SLO",
  			FORMAL_EN: "Republic of Slovenia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Slovenia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Slovenia",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 12,
  			POP_EST: 1972126,
  			POP_RANK: 12,
  			GDP_MD_EST: 68350,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SI",
  			ISO_A2: "SI",
  			ISO_A3: "SVN",
  			ISO_A3_EH: "SVN",
  			ISO_N3: "705",
  			UN_A3: "705",
  			WB_A2: "SI",
  			WB_A3: "SVN",
  			WOE_ID: 23424945,
  			WOE_ID_EH: 23424945,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SVN",
  			ADM0_A3_US: "SVN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321285,
  			WIKIDATAID: "Q215",
  			NAME_AR: "سلوفينيا",
  			NAME_BN: "স্লোভেনিয়া",
  			NAME_DE: "Slowenien",
  			NAME_EN: "Slovenia",
  			NAME_ES: "Eslovenia",
  			NAME_FR: "Slovénie",
  			NAME_EL: "Σλοβενία",
  			NAME_HI: "स्लोवेनिया",
  			NAME_HU: "Szlovénia",
  			NAME_ID: "Slovenia",
  			NAME_IT: "Slovenia",
  			NAME_JA: "スロベニア",
  			NAME_KO: "슬로베니아",
  			NAME_NL: "Slovenië",
  			NAME_PL: "Słowenia",
  			NAME_PT: "Eslovénia",
  			NAME_RU: "Словения",
  			NAME_SV: "Slovenien",
  			NAME_TR: "Slovenya",
  			NAME_VI: "Slovenia",
  			NAME_ZH: "斯洛文尼亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						28.591929559043194,
  						69.06477692328666
  					],
  					[
  						28.445943637818658,
  						68.36461294216404
  					],
  					[
  						29.97742638522061,
  						67.69829702419275
  					],
  					[
  						29.054588657352326,
  						66.94428620062206
  					],
  					[
  						30.217650000000003,
  						65.80598
  					],
  					[
  						29.54442955904699,
  						64.94867157659048
  					],
  					[
  						30.035872430142717,
  						63.55281362573855
  					],
  					[
  						31.139991082490894,
  						62.35769277612441
  					],
  					[
  						28.070001921525666,
  						60.50351912796823
  					],
  					[
  						22.869694858499457,
  						59.846373196036225
  					],
  					[
  						21.322244093519316,
  						60.720169989659524
  					],
  					[
  						21.05921105315369,
  						62.60739329695874
  					],
  					[
  						22.442744174903993,
  						63.81781037053129
  					],
  					[
  						25.398067661243942,
  						65.11142650009374
  					],
  					[
  						23.903378533633802,
  						66.00692739527962
  					],
  					[
  						23.53947309743444,
  						67.93600861273525
  					],
  					[
  						20.645592889089528,
  						69.10624726020087
  					],
  					[
  						24.735679152126725,
  						68.64955678982146
  					],
  					[
  						26.179622023226244,
  						69.82529897732614
  					],
  					[
  						28.591929559043194,
  						69.06477692328666
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Finland",
  			SOV_A3: "FI1",
  			ADM0_DIF: 1,
  			LEVEL: 2,
  			TYPE: "Country",
  			ADMIN: "Finland",
  			ADM0_A3: "FIN",
  			GEOU_DIF: 0,
  			GEOUNIT: "Finland",
  			GU_A3: "FIN",
  			SU_DIF: 0,
  			SUBUNIT: "Finland",
  			SU_A3: "FIN",
  			BRK_DIFF: 0,
  			NAME: "Finland",
  			NAME_LONG: "Finland",
  			BRK_A3: "FIN",
  			BRK_NAME: "Finland",
  			BRK_GROUP: "",
  			ABBREV: "Fin.",
  			POSTAL: "FIN",
  			FORMAL_EN: "Republic of Finland",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Finland",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Finland",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 6,
  			POP_EST: 5491218,
  			POP_RANK: 13,
  			GDP_MD_EST: 224137,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "FI",
  			ISO_A2: "FI",
  			ISO_A3: "FIN",
  			ISO_A3_EH: "FIN",
  			ISO_N3: "246",
  			UN_A3: "246",
  			WB_A2: "FI",
  			WB_A3: "FIN",
  			WOE_ID: 23424812,
  			WOE_ID_EH: 23424812,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "FIN",
  			ADM0_A3_US: "FIN",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Northern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159320623,
  			WIKIDATAID: "Q33",
  			NAME_AR: "فنلندا",
  			NAME_BN: "ফিনল্যান্ড",
  			NAME_DE: "Finnland",
  			NAME_EN: "Finland",
  			NAME_ES: "Finlandia",
  			NAME_FR: "Finlande",
  			NAME_EL: "Φινλανδία",
  			NAME_HI: "फ़िनलैण्ड",
  			NAME_HU: "Finnország",
  			NAME_ID: "Finlandia",
  			NAME_IT: "Finlandia",
  			NAME_JA: "フィンランド",
  			NAME_KO: "핀란드",
  			NAME_NL: "Finland",
  			NAME_PL: "Finlandia",
  			NAME_PT: "Finlândia",
  			NAME_RU: "Финляндия",
  			NAME_SV: "Finland",
  			NAME_TR: "Finlandiya",
  			NAME_VI: "Phần Lan",
  			NAME_ZH: "芬兰"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						22.558137648211755,
  						49.085738023467144
  					],
  					[
  						22.085608351334855,
  						48.42226430927179
  					],
  					[
  						20.801293979584926,
  						48.623854071642384
  					],
  					[
  						17.857132602620027,
  						47.75842886005037
  					],
  					[
  						16.979666782304037,
  						48.123497015976305
  					],
  					[
  						16.960288120194576,
  						48.5969823268506
  					],
  					[
  						18.853144158613617,
  						49.49622976337764
  					],
  					[
  						19.825022820726872,
  						49.21712535256923
  					],
  					[
  						21.607808058364213,
  						49.47010732685409
  					],
  					[
  						22.558137648211755,
  						49.085738023467144
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Slovakia",
  			SOV_A3: "SVK",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Slovakia",
  			ADM0_A3: "SVK",
  			GEOU_DIF: 0,
  			GEOUNIT: "Slovakia",
  			GU_A3: "SVK",
  			SU_DIF: 0,
  			SUBUNIT: "Slovakia",
  			SU_A3: "SVK",
  			BRK_DIFF: 0,
  			NAME: "Slovakia",
  			NAME_LONG: "Slovakia",
  			BRK_A3: "SVK",
  			BRK_NAME: "Slovakia",
  			BRK_GROUP: "",
  			ABBREV: "Svk.",
  			POSTAL: "SK",
  			FORMAL_EN: "Slovak Republic",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Slovakia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Slovak Republic",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 9,
  			POP_EST: 5445829,
  			POP_RANK: 13,
  			GDP_MD_EST: 168800,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LO",
  			ISO_A2: "SK",
  			ISO_A3: "SVK",
  			ISO_A3_EH: "SVK",
  			ISO_N3: "703",
  			UN_A3: "703",
  			WB_A2: "SK",
  			WB_A3: "SVK",
  			WOE_ID: 23424877,
  			WOE_ID_EH: 23424877,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SVK",
  			ADM0_A3_US: "SVK",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159321283,
  			WIKIDATAID: "Q214",
  			NAME_AR: "سلوفاكيا",
  			NAME_BN: "স্লোভাকিয়া",
  			NAME_DE: "Slowakei",
  			NAME_EN: "Slovakia",
  			NAME_ES: "Eslovaquia",
  			NAME_FR: "Slovaquie",
  			NAME_EL: "Σλοβακία",
  			NAME_HI: "स्लोवाकिया",
  			NAME_HU: "Szlovákia",
  			NAME_ID: "Slowakia",
  			NAME_IT: "Slovacchia",
  			NAME_JA: "スロバキア",
  			NAME_KO: "슬로바키아",
  			NAME_NL: "Slowakije",
  			NAME_PL: "Słowacja",
  			NAME_PT: "Eslováquia",
  			NAME_RU: "Словакия",
  			NAME_SV: "Slovakien",
  			NAME_TR: "Slovakya",
  			NAME_VI: "Slovakia",
  			NAME_ZH: "斯洛伐克"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						15.01699588385867,
  						51.10667409932158
  					],
  					[
  						17.55456709155112,
  						50.36214590107642
  					],
  					[
  						18.853144158613617,
  						49.49622976337764
  					],
  					[
  						16.960288120194576,
  						48.5969823268506
  					],
  					[
  						15.253415561593982,
  						49.03907420510758
  					],
  					[
  						13.595945672264437,
  						48.87717194273715
  					],
  					[
  						12.240111118222558,
  						50.266337795607285
  					],
  					[
  						15.01699588385867,
  						51.10667409932158
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Czechia",
  			SOV_A3: "CZE",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Czechia",
  			ADM0_A3: "CZE",
  			GEOU_DIF: 0,
  			GEOUNIT: "Czechia",
  			GU_A3: "CZE",
  			SU_DIF: 0,
  			SUBUNIT: "Czechia",
  			SU_A3: "CZE",
  			BRK_DIFF: 0,
  			NAME: "Czechia",
  			NAME_LONG: "Czech Republic",
  			BRK_A3: "CZE",
  			BRK_NAME: "Czechia",
  			BRK_GROUP: "",
  			ABBREV: "Cz.",
  			POSTAL: "CZ",
  			FORMAL_EN: "Czech Republic",
  			FORMAL_FR: "la République tchèque",
  			NAME_CIAWF: "Czechia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Czechia",
  			NAME_ALT: "Česko",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 6,
  			POP_EST: 10674723,
  			POP_RANK: 14,
  			GDP_MD_EST: 350900,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "1. High income: OECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "EZ",
  			ISO_A2: "CZ",
  			ISO_A3: "CZE",
  			ISO_A3_EH: "CZE",
  			ISO_N3: "203",
  			UN_A3: "203",
  			WB_A2: "CZ",
  			WB_A3: "CZE",
  			WOE_ID: 23424810,
  			WOE_ID_EH: 23424810,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "CZE",
  			ADM0_A3_US: "CZE",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Eastern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 7,
  			LONG_LEN: 14,
  			ABBREV_LEN: 3,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320535,
  			WIKIDATAID: "Q213",
  			NAME_AR: "التشيك",
  			NAME_BN: "চেক প্রজাতন্ত্র",
  			NAME_DE: "Tschechien",
  			NAME_EN: "Czech Republic",
  			NAME_ES: "República Checa",
  			NAME_FR: "République tchèque",
  			NAME_EL: "Τσεχία",
  			NAME_HI: "चेक गणराज्य",
  			NAME_HU: "Csehország",
  			NAME_ID: "Republik Ceko",
  			NAME_IT: "Repubblica Ceca",
  			NAME_JA: "チェコ",
  			NAME_KO: "체코",
  			NAME_NL: "Tsjechië",
  			NAME_PL: "Czechy",
  			NAME_PT: "República Checa",
  			NAME_RU: "Чехия",
  			NAME_SV: "Tjeckien",
  			NAME_TR: "Çek Cumhuriyeti",
  			NAME_VI: "Cộng hòa Séc",
  			NAME_ZH: "捷克"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						36.42951000000005,
  						14.422110000000032
  					],
  					[
  						36.32321999999999,
  						14.822490000000016
  					],
  					[
  						36.852530000000115,
  						16.956549999999993
  					],
  					[
  						38.410089959473225,
  						17.998307399970315
  					],
  					[
  						39.26611006038803,
  						15.92272349696725
  					],
  					[
  						41.17927493669765,
  						14.491079616753211
  					],
  					[
  						43.08122602720016,
  						12.699638576707116
  					],
  					[
  						42.35156000000012,
  						12.542230000000131
  					],
  					[
  						40.896600000000035,
  						14.118640000000141
  					],
  					[
  						39.0994,
  						14.740640000000042
  					],
  					[
  						37.59377000000006,
  						14.213099999999997
  					],
  					[
  						36.42951000000005,
  						14.422110000000032
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Eritrea",
  			SOV_A3: "ERI",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Eritrea",
  			ADM0_A3: "ERI",
  			GEOU_DIF: 0,
  			GEOUNIT: "Eritrea",
  			GU_A3: "ERI",
  			SU_DIF: 0,
  			SUBUNIT: "Eritrea",
  			SU_A3: "ERI",
  			BRK_DIFF: 0,
  			NAME: "Eritrea",
  			NAME_LONG: "Eritrea",
  			BRK_A3: "ERI",
  			BRK_NAME: "Eritrea",
  			BRK_GROUP: "",
  			ABBREV: "Erit.",
  			POSTAL: "ER",
  			FORMAL_EN: "State of Eritrea",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Eritrea",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Eritrea",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 12,
  			POP_EST: 5918919,
  			POP_RANK: 13,
  			GDP_MD_EST: 9169,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1984,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "ER",
  			ISO_A2: "ER",
  			ISO_A3: "ERI",
  			ISO_A3_EH: "ERI",
  			ISO_N3: "232",
  			UN_A3: "232",
  			WB_A2: "ER",
  			WB_A3: "ERI",
  			WOE_ID: 23424806,
  			WOE_ID_EH: 23424806,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ERI",
  			ADM0_A3_US: "ERI",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320581,
  			WIKIDATAID: "Q986",
  			NAME_AR: "إرتريا",
  			NAME_BN: "ইরিত্রিয়া",
  			NAME_DE: "Eritrea",
  			NAME_EN: "Eritrea",
  			NAME_ES: "Eritrea",
  			NAME_FR: "Érythrée",
  			NAME_EL: "Ερυθραία",
  			NAME_HI: "इरित्रिया",
  			NAME_HU: "Eritrea",
  			NAME_ID: "Eritrea",
  			NAME_IT: "Eritrea",
  			NAME_JA: "エリトリア",
  			NAME_KO: "에리트레아",
  			NAME_NL: "Eritrea",
  			NAME_PL: "Erytrea",
  			NAME_PT: "Eritreia",
  			NAME_RU: "Эритрея",
  			NAME_SV: "Eritrea",
  			NAME_TR: "Eritre",
  			NAME_VI: "Eritrea",
  			NAME_ZH: "厄立特里亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-58.166392381408045,
  						-20.176700941653678
  					],
  					[
  						-57.8706739976178,
  						-20.73268767668195
  					],
  					[
  						-57.937155727761294,
  						-22.090175876557172
  					],
  					[
  						-56.47331743022939,
  						-22.086300144135283
  					],
  					[
  						-55.610682745981144,
  						-22.655619398694846
  					],
  					[
  						-55.40074723979542,
  						-23.956935316668805
  					],
  					[
  						-54.29347632507745,
  						-24.570799655863965
  					],
  					[
  						-54.625290696823576,
  						-25.739255466415514
  					],
  					[
  						-54.78879492859505,
  						-26.621785577096134
  					],
  					[
  						-55.69584550639816,
  						-27.387837009390864
  					],
  					[
  						-56.486701626192996,
  						-27.548499037386293
  					],
  					[
  						-58.61817359071975,
  						-27.123718763947096
  					],
  					[
  						-57.63366004091113,
  						-25.60365650808164
  					],
  					[
  						-57.77721716981794,
  						-25.16233977630904
  					],
  					[
  						-60.02896603050403,
  						-24.032796319273274
  					],
  					[
  						-60.846564704009914,
  						-23.880712579038292
  					],
  					[
  						-62.685057135657885,
  						-22.249029229422387
  					],
  					[
  						-62.2659612697708,
  						-20.513734633061276
  					],
  					[
  						-61.78632646345377,
  						-19.633736667562964
  					],
  					[
  						-59.11504248720611,
  						-19.3569060197754
  					],
  					[
  						-58.166392381408045,
  						-20.176700941653678
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 4,
  			SOVEREIGNT: "Paraguay",
  			SOV_A3: "PRY",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Paraguay",
  			ADM0_A3: "PRY",
  			GEOU_DIF: 0,
  			GEOUNIT: "Paraguay",
  			GU_A3: "PRY",
  			SU_DIF: 0,
  			SUBUNIT: "Paraguay",
  			SU_A3: "PRY",
  			BRK_DIFF: 0,
  			NAME: "Paraguay",
  			NAME_LONG: "Paraguay",
  			BRK_A3: "PRY",
  			BRK_NAME: "Paraguay",
  			BRK_GROUP: "",
  			ABBREV: "Para.",
  			POSTAL: "PY",
  			FORMAL_EN: "Republic of Paraguay",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Paraguay",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Paraguay",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 2,
  			POP_EST: 6943739,
  			POP_RANK: 13,
  			GDP_MD_EST: 64670,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "PA",
  			ISO_A2: "PY",
  			ISO_A3: "PRY",
  			ISO_A3_EH: "PRY",
  			ISO_N3: "600",
  			UN_A3: "600",
  			WB_A2: "PY",
  			WB_A3: "PRY",
  			WOE_ID: 23424917,
  			WOE_ID_EH: 23424917,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "PRY",
  			ADM0_A3_US: "PRY",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "South America",
  			REGION_UN: "Americas",
  			SUBREGION: "South America",
  			REGION_WB: "Latin America & Caribbean",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321195,
  			WIKIDATAID: "Q733",
  			NAME_AR: "باراغواي",
  			NAME_BN: "প্যারাগুয়ে",
  			NAME_DE: "Paraguay",
  			NAME_EN: "Paraguay",
  			NAME_ES: "Paraguay",
  			NAME_FR: "Paraguay",
  			NAME_EL: "Παραγουάη",
  			NAME_HI: "पैराग्वे",
  			NAME_HU: "Paraguay",
  			NAME_ID: "Paraguay",
  			NAME_IT: "Paraguay",
  			NAME_JA: "パラグアイ",
  			NAME_KO: "파라과이",
  			NAME_NL: "Paraguay",
  			NAME_PL: "Paragwaj",
  			NAME_PT: "Paraguai",
  			NAME_RU: "Парагвай",
  			NAME_SV: "Paraguay",
  			NAME_TR: "Paraguay",
  			NAME_VI: "Paraguay",
  			NAME_ZH: "巴拉圭"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						52.00000980002224,
  						19.000003363516058
  					],
  					[
  						53.10857262554751,
  						16.651051133688952
  					],
  					[
  						52.38520592632588,
  						16.382411200419654
  					],
  					[
  						52.1681649107,
  						15.597420355689948
  					],
  					[
  						49.57457645040315,
  						14.708766587782748
  					],
  					[
  						48.67923058451416,
  						14.00320241948566
  					],
  					[
  						45.62505008319988,
  						13.290946153206763
  					],
  					[
  						44.989533318874415,
  						12.69958690027471
  					],
  					[
  						43.48295861183713,
  						12.636800035040084
  					],
  					[
  						42.70243777850066,
  						15.718885809791999
  					],
  					[
  						42.77933230975097,
  						16.347891343648683
  					],
  					[
  						43.380794305196105,
  						17.57998668056767
  					],
  					[
  						45.21665123879719,
  						17.433328965723334
  					],
  					[
  						47.000004917189756,
  						16.949999294497445
  					],
  					[
  						48.18334354024134,
  						18.166669216377315
  					],
  					[
  						49.11667158386487,
  						18.616667588774945
  					],
  					[
  						52.00000980002224,
  						19.000003363516058
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Yemen",
  			SOV_A3: "YEM",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Yemen",
  			ADM0_A3: "YEM",
  			GEOU_DIF: 0,
  			GEOUNIT: "Yemen",
  			GU_A3: "YEM",
  			SU_DIF: 0,
  			SUBUNIT: "Yemen",
  			SU_A3: "YEM",
  			BRK_DIFF: 0,
  			NAME: "Yemen",
  			NAME_LONG: "Yemen",
  			BRK_A3: "YEM",
  			BRK_NAME: "Yemen",
  			BRK_GROUP: "",
  			ABBREV: "Yem.",
  			POSTAL: "YE",
  			FORMAL_EN: "Republic of Yemen",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Yemen",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Yemen, Rep.",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 11,
  			POP_EST: 28036829,
  			POP_RANK: 15,
  			GDP_MD_EST: 73450,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "YM",
  			ISO_A2: "YE",
  			ISO_A3: "YEM",
  			ISO_A3_EH: "YEM",
  			ISO_N3: "887",
  			UN_A3: "887",
  			WB_A2: "RY",
  			WB_A3: "YEM",
  			WOE_ID: 23425002,
  			WOE_ID_EH: 23425002,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "YEM",
  			ADM0_A3_US: "YEM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321425,
  			WIKIDATAID: "Q805",
  			NAME_AR: "اليمن",
  			NAME_BN: "ইয়েমেন",
  			NAME_DE: "Jemen",
  			NAME_EN: "Yemen",
  			NAME_ES: "Yemen",
  			NAME_FR: "Yémen",
  			NAME_EL: "Υεμένη",
  			NAME_HI: "यमन",
  			NAME_HU: "Jemen",
  			NAME_ID: "Yaman",
  			NAME_IT: "Yemen",
  			NAME_JA: "イエメン",
  			NAME_KO: "예멘",
  			NAME_NL: "Jemen",
  			NAME_PL: "Jemen",
  			NAME_PT: "Iémen",
  			NAME_RU: "Йемен",
  			NAME_SV: "Jemen",
  			NAME_TR: "Yemen",
  			NAME_VI: "Yemen",
  			NAME_ZH: "也门"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						34.95603722508426,
  						29.356554673778845
  					],
  					[
  						36.06894087092206,
  						29.197494615184453
  					],
  					[
  						37.998848911294374,
  						30.508499864213135
  					],
  					[
  						37.00216556168101,
  						31.508412990844747
  					],
  					[
  						39.19546837744497,
  						32.16100881604267
  					],
  					[
  						41.889980910007836,
  						31.19000865327837
  					],
  					[
  						44.70949873228474,
  						29.178891099559383
  					],
  					[
  						46.568713413281756,
  						29.09902517345229
  					],
  					[
  						48.416094191283946,
  						28.55200429942667
  					],
  					[
  						48.80759484232718,
  						27.689627997339883
  					],
  					[
  						50.15242231629088,
  						26.689663194275997
  					],
  					[
  						50.11330325704594,
  						25.94397227630425
  					],
  					[
  						50.81010827006958,
  						24.754742539971378
  					],
  					[
  						51.38960778179063,
  						24.62738597258806
  					],
  					[
  						51.57951867046327,
  						24.245497137951105
  					],
  					[
  						52.000733270074335,
  						23.00115448657894
  					],
  					[
  						55.006803012924905,
  						22.496947536707136
  					],
  					[
  						55.208341098863194,
  						22.708329982997046
  					],
  					[
  						55.666659376859826,
  						22.00000112557234
  					],
  					[
  						54.99998172386236,
  						19.999994004796108
  					],
  					[
  						52.00000980002224,
  						19.000003363516058
  					],
  					[
  						49.11667158386487,
  						18.616667588774945
  					],
  					[
  						48.18334354024134,
  						18.166669216377315
  					],
  					[
  						47.000004917189756,
  						16.949999294497445
  					],
  					[
  						45.21665123879719,
  						17.433328965723334
  					],
  					[
  						43.380794305196105,
  						17.57998668056767
  					],
  					[
  						42.77933230975097,
  						16.347891343648683
  					],
  					[
  						41.75438195167396,
  						17.833046169500975
  					],
  					[
  						40.93934126156654,
  						19.486485297111756
  					],
  					[
  						39.80168460466095,
  						20.338862209550058
  					],
  					[
  						39.139399448408284,
  						21.291904812092934
  					],
  					[
  						39.06632897314759,
  						22.57965566659027
  					],
  					[
  						38.49277225114008,
  						23.688451036060854
  					],
  					[
  						37.483634881344386,
  						24.285494696545015
  					],
  					[
  						36.93162723160259,
  						25.60295949961018
  					],
  					[
  						35.13018680190788,
  						28.06335195567472
  					],
  					[
  						34.95603722508426,
  						29.356554673778845
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Saudi Arabia",
  			SOV_A3: "SAU",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Saudi Arabia",
  			ADM0_A3: "SAU",
  			GEOU_DIF: 0,
  			GEOUNIT: "Saudi Arabia",
  			GU_A3: "SAU",
  			SU_DIF: 0,
  			SUBUNIT: "Saudi Arabia",
  			SU_A3: "SAU",
  			BRK_DIFF: 0,
  			NAME: "Saudi Arabia",
  			NAME_LONG: "Saudi Arabia",
  			BRK_A3: "SAU",
  			BRK_NAME: "Saudi Arabia",
  			BRK_GROUP: "",
  			ABBREV: "Saud.",
  			POSTAL: "SA",
  			FORMAL_EN: "Kingdom of Saudi Arabia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Saudi Arabia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Saudi Arabia",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 7,
  			POP_EST: 28571770,
  			POP_RANK: 15,
  			GDP_MD_EST: 1731000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "2. Developed region: nonG7",
  			INCOME_GRP: "2. High income: nonOECD",
  			WIKIPEDIA: -99,
  			FIPS_10_: "SA",
  			ISO_A2: "SA",
  			ISO_A3: "SAU",
  			ISO_A3_EH: "SAU",
  			ISO_N3: "682",
  			UN_A3: "682",
  			WB_A2: "SA",
  			WB_A3: "SAU",
  			WOE_ID: 23424938,
  			WOE_ID_EH: 23424938,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "SAU",
  			ADM0_A3_US: "SAU",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Asia",
  			REGION_UN: "Asia",
  			SUBREGION: "Western Asia",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 12,
  			LONG_LEN: 12,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2.7,
  			MAX_LABEL: 7,
  			NE_ID: 1159321225,
  			WIKIDATAID: "Q851",
  			NAME_AR: "المملكة العربية السعودية",
  			NAME_BN: "সৌদি আরব",
  			NAME_DE: "Saudi-Arabien",
  			NAME_EN: "Saudi Arabia",
  			NAME_ES: "Arabia Saudita",
  			NAME_FR: "Arabie saoudite",
  			NAME_EL: "Σαουδική Αραβία",
  			NAME_HI: "सउदी अरब",
  			NAME_HU: "Szaúd-Arábia",
  			NAME_ID: "Arab Saudi",
  			NAME_IT: "Arabia Saudita",
  			NAME_JA: "サウジアラビア",
  			NAME_KO: "사우디아라비아",
  			NAME_NL: "Saoedi-Arabië",
  			NAME_PL: "Arabia Saudyjska",
  			NAME_PT: "Arábia Saudita",
  			NAME_RU: "Саудовская Аравия",
  			NAME_SV: "Saudiarabien",
  			NAME_TR: "Suudi Arabistan",
  			NAME_VI: "Ả Rập Saudi",
  			NAME_ZH: "沙特阿拉伯"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						-2.169913702798624,
  						35.16839630791668
  					],
  					[
  						-1.792985805661715,
  						34.527918606091305
  					],
  					[
  						-1.30789913573787,
  						32.2628889023061
  					],
  					[
  						-3.647497931320146,
  						31.637294012980675
  					],
  					[
  						-3.6904410465547244,
  						30.896951605751156
  					],
  					[
  						-5.242129278982787,
  						30.00044302013559
  					],
  					[
  						-7.059227667661958,
  						29.5792284205246
  					],
  					[
  						-8.674116176782974,
  						28.84128896739658
  					],
  					[
  						-8.665589565454809,
  						27.656425889592356
  					],
  					[
  						-9.735343390328879,
  						26.860944729107405
  					],
  					[
  						-11.392554897497007,
  						26.883423977154393
  					],
  					[
  						-12.50096269372537,
  						24.7701162785782
  					],
  					[
  						-13.891110398809047,
  						23.691009019459305
  					],
  					[
  						-14.221167771857253,
  						22.31016307218816
  					],
  					[
  						-14.750954555713534,
  						21.500600083903663
  					],
  					[
  						-17.02042843267577,
  						21.422310288981578
  					],
  					[
  						-16.261921759495635,
  						22.679339504481277
  					],
  					[
  						-15.982610642958036,
  						23.723358466074046
  					],
  					[
  						-15.089331834360735,
  						24.520260728447
  					],
  					[
  						-14.439939947964831,
  						26.254418443297652
  					],
  					[
  						-13.773804897506466,
  						26.618892320252314
  					],
  					[
  						-12.618836635783111,
  						28.03818553314869
  					],
  					[
  						-11.688919236690765,
  						28.148643907172527
  					],
  					[
  						-9.564811163765683,
  						29.93357371674989
  					],
  					[
  						-9.814718390329176,
  						31.17773550060906
  					],
  					[
  						-9.300692918321886,
  						32.564679266890664
  					],
  					[
  						-8.657476365585012,
  						33.240245266242425
  					],
  					[
  						-6.912544114601417,
  						34.110476386037476
  					],
  					[
  						-5.92999426921989,
  						35.75998810479399
  					],
  					[
  						-4.591006232105144,
  						35.330711981745594
  					],
  					[
  						-2.169913702798624,
  						35.16839630791668
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Morocco",
  			SOV_A3: "MAR",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Morocco",
  			ADM0_A3: "MAR",
  			GEOU_DIF: 0,
  			GEOUNIT: "Morocco",
  			GU_A3: "MAR",
  			SU_DIF: 0,
  			SUBUNIT: "Morocco",
  			SU_A3: "MAR",
  			BRK_DIFF: 0,
  			NAME: "Morocco",
  			NAME_LONG: "Morocco",
  			BRK_A3: "MAR",
  			BRK_NAME: "Morocco",
  			BRK_GROUP: "",
  			ABBREV: "Mor.",
  			POSTAL: "MA",
  			FORMAL_EN: "Kingdom of Morocco",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Morocco",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Morocco",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 9,
  			POP_EST: 33986655,
  			POP_RANK: 15,
  			GDP_MD_EST: 282800,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2004,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MO",
  			ISO_A2: "MA",
  			ISO_A3: "MAR",
  			ISO_A3_EH: "MAR",
  			ISO_N3: "504",
  			UN_A3: "504",
  			WB_A2: "MA",
  			WB_A3: "MAR",
  			WOE_ID: 23424893,
  			WOE_ID_EH: 23424893,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MAR",
  			ADM0_A3_US: "MAR",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Northern Africa",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 7,
  			LONG_LEN: 7,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321035,
  			WIKIDATAID: "Q1028",
  			NAME_AR: "المغرب",
  			NAME_BN: "মরক্কো",
  			NAME_DE: "Marokko",
  			NAME_EN: "Morocco",
  			NAME_ES: "Marruecos",
  			NAME_FR: "Maroc",
  			NAME_EL: "Μαρόκο",
  			NAME_HI: "मोरक्को",
  			NAME_HU: "Marokkó",
  			NAME_ID: "Maroko",
  			NAME_IT: "Marocco",
  			NAME_JA: "モロッコ",
  			NAME_KO: "모로코",
  			NAME_NL: "Marokko",
  			NAME_PL: "Maroko",
  			NAME_PT: "Marrocos",
  			NAME_RU: "Марокко",
  			NAME_SV: "Marocko",
  			NAME_TR: "Fas",
  			NAME_VI: "Maroc",
  			NAME_ZH: "摩洛哥"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						36.86622999999997,
  						22
  					],
  					[
  						32.89999999999998,
  						22
  					],
  					[
  						29.019999999999982,
  						22
  					],
  					[
  						25,
  						22
  					],
  					[
  						25,
  						25.682499996361
  					],
  					[
  						25,
  						29.23865452953346
  					],
  					[
  						24.70007,
  						30.044190000000004
  					],
  					[
  						25.16482,
  						31.56915
  					],
  					[
  						26.49533,
  						31.58568
  					],
  					[
  						28.913529999999998,
  						30.87005
  					],
  					[
  						30.976930000000003,
  						31.55586
  					],
  					[
  						32.99392,
  						31.024070000000002
  					],
  					[
  						34.26543474464621,
  						31.21935730952032
  					],
  					[
  						34.823243288783814,
  						29.76108076171822
  					],
  					[
  						34.42655,
  						28.343989999999998
  					],
  					[
  						33.34876,
  						27.69989
  					],
  					[
  						34.10455,
  						26.14227
  					],
  					[
  						35.69241,
  						23.92671
  					],
  					[
  						35.52598,
  						23.10244
  					],
  					[
  						36.86622999999997,
  						22
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Egypt",
  			SOV_A3: "EGY",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Egypt",
  			ADM0_A3: "EGY",
  			GEOU_DIF: 0,
  			GEOUNIT: "Egypt",
  			GU_A3: "EGY",
  			SU_DIF: 0,
  			SUBUNIT: "Egypt",
  			SU_A3: "EGY",
  			BRK_DIFF: 0,
  			NAME: "Egypt",
  			NAME_LONG: "Egypt",
  			BRK_A3: "EGY",
  			BRK_NAME: "Egypt",
  			BRK_GROUP: "",
  			ABBREV: "Egypt",
  			POSTAL: "EG",
  			FORMAL_EN: "Arab Republic of Egypt",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Egypt",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Egypt, Arab Rep.",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 2,
  			POP_EST: 97041072,
  			POP_RANK: 16,
  			GDP_MD_EST: 1105000,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2006,
  			GDP_YEAR: 2016,
  			ECONOMY: "5. Emerging region: G20",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "EG",
  			ISO_A2: "EG",
  			ISO_A3: "EGY",
  			ISO_A3_EH: "EGY",
  			ISO_N3: "818",
  			UN_A3: "818",
  			WB_A2: "EG",
  			WB_A3: "EGY",
  			WOE_ID: 23424802,
  			WOE_ID_EH: 23424802,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "EGY",
  			ADM0_A3_US: "EGY",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Northern Africa",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 1.7,
  			MAX_LABEL: 6.7,
  			NE_ID: 1159320575,
  			WIKIDATAID: "Q79",
  			NAME_AR: "مصر",
  			NAME_BN: "মিশর",
  			NAME_DE: "Ägypten",
  			NAME_EN: "Egypt",
  			NAME_ES: "Egipto",
  			NAME_FR: "Égypte",
  			NAME_EL: "Αίγυπτος",
  			NAME_HI: "मिस्र",
  			NAME_HU: "Egyiptom",
  			NAME_ID: "Mesir",
  			NAME_IT: "Egitto",
  			NAME_JA: "エジプト",
  			NAME_KO: "이집트",
  			NAME_NL: "Egypte",
  			NAME_PL: "Egipt",
  			NAME_PT: "Egito",
  			NAME_RU: "Египет",
  			NAME_SV: "Egypten",
  			NAME_TR: "Mısır",
  			NAME_VI: "Ai Cập",
  			NAME_ZH: "埃及"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						25,
  						22
  					],
  					[
  						25.000000000000114,
  						20.003040000000055
  					],
  					[
  						23.83766000000014,
  						19.580470000000105
  					],
  					[
  						19.849260000000072,
  						21.49509000000006
  					],
  					[
  						15.860850000000084,
  						23.409719999999993
  					],
  					[
  						14.851300000000037,
  						22.862950000000126
  					],
  					[
  						11.999505649471613,
  						23.47166840259645
  					],
  					[
  						10.771363559622927,
  						24.56253205006175
  					],
  					[
  						10.303846876678362,
  						24.379313259370917
  					],
  					[
  						9.319410841518163,
  						26.094324856057455
  					],
  					[
  						9.716285841519664,
  						26.512206325785655
  					],
  					[
  						9.859997999723447,
  						28.959989732371014
  					],
  					[
  						9.482139926805274,
  						30.307556057246188
  					],
  					[
  						9.950225050505082,
  						31.376069647745258
  					],
  					[
  						11.432253452203696,
  						32.368903103152874
  					],
  					[
  						11.488787469131012,
  						33.13699575452324
  					],
  					[
  						13.918679999999995,
  						32.71196000000009
  					],
  					[
  						15.245630000000006,
  						32.26508000000007
  					],
  					[
  						15.713939999999923,
  						31.376259999999945
  					],
  					[
  						18.02108999999996,
  						30.76356999999996
  					],
  					[
  						19.08641,
  						30.26639
  					],
  					[
  						20.053349999999966,
  						30.985760000000028
  					],
  					[
  						19.82033000000007,
  						31.751790000000142
  					],
  					[
  						20.854520000000093,
  						32.70679999999999
  					],
  					[
  						22.895760000000053,
  						32.63857999999999
  					],
  					[
  						23.236800000000017,
  						32.191490000000044
  					],
  					[
  						25.16482,
  						31.56915
  					],
  					[
  						24.70007,
  						30.044190000000004
  					],
  					[
  						25,
  						29.23865452953346
  					],
  					[
  						25,
  						25.682499996361
  					],
  					[
  						25,
  						22
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Libya",
  			SOV_A3: "LBY",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Libya",
  			ADM0_A3: "LBY",
  			GEOU_DIF: 0,
  			GEOUNIT: "Libya",
  			GU_A3: "LBY",
  			SU_DIF: 0,
  			SUBUNIT: "Libya",
  			SU_A3: "LBY",
  			BRK_DIFF: 0,
  			NAME: "Libya",
  			NAME_LONG: "Libya",
  			BRK_A3: "LBY",
  			BRK_NAME: "Libya",
  			BRK_GROUP: "",
  			ABBREV: "Libya",
  			POSTAL: "LY",
  			FORMAL_EN: "Libya",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Libya",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Libya",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 11,
  			POP_EST: 6653210,
  			POP_RANK: 13,
  			GDP_MD_EST: 90890,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2006,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "LY",
  			ISO_A2: "LY",
  			ISO_A3: "LBY",
  			ISO_A3_EH: "LBY",
  			ISO_N3: "434",
  			UN_A3: "434",
  			WB_A2: "LY",
  			WB_A3: "LBY",
  			WOE_ID: 23424882,
  			WOE_ID_EH: 23424882,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "LBY",
  			ADM0_A3_US: "LBY",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Northern Africa",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 5,
  			LONG_LEN: 5,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321017,
  			WIKIDATAID: "Q1016",
  			NAME_AR: "ليبيا",
  			NAME_BN: "লিবিয়া",
  			NAME_DE: "Libyen",
  			NAME_EN: "Libya",
  			NAME_ES: "Libia",
  			NAME_FR: "Libye",
  			NAME_EL: "Λιβύη",
  			NAME_HI: "लीबिया",
  			NAME_HU: "Líbia",
  			NAME_ID: "Libya",
  			NAME_IT: "Libia",
  			NAME_JA: "リビア",
  			NAME_KO: "리비아",
  			NAME_NL: "Libië",
  			NAME_PL: "Libia",
  			NAME_PT: "Líbia",
  			NAME_RU: "Ливия",
  			NAME_SV: "Libyen",
  			NAME_TR: "Libya",
  			NAME_VI: "Libya",
  			NAME_ZH: "利比亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						47.78942,
  						8.003
  					],
  					[
  						44.96360000000001,
  						5.00162
  					],
  					[
  						43.66086999999999,
  						4.957550000000083
  					],
  					[
  						41.85508309264397,
  						3.918911920483727
  					],
  					[
  						40.76848,
  						4.257020000000001
  					],
  					[
  						39.55938425876585,
  						3.42206
  					],
  					[
  						38.120915,
  						3.598605
  					],
  					[
  						36.85509323800812,
  						4.447864127672769
  					],
  					[
  						36.159078632855646,
  						4.447864127672769
  					],
  					[
  						35.29800711823298,
  						5.506
  					],
  					[
  						33.29480000000012,
  						8.354580000000055
  					],
  					[
  						33.97498000000007,
  						8.68455999999992
  					],
  					[
  						34.25745000000006,
  						10.630089999999996
  					],
  					[
  						35.86363,
  						12.578280000000063
  					],
  					[
  						36.42951000000005,
  						14.422110000000032
  					],
  					[
  						37.59377000000006,
  						14.213099999999997
  					],
  					[
  						39.0994,
  						14.740640000000042
  					],
  					[
  						40.896600000000035,
  						14.118640000000141
  					],
  					[
  						42.35156000000012,
  						12.542230000000131
  					],
  					[
  						41.66176000000013,
  						11.631199999999978
  					],
  					[
  						41.755570000000205,
  						11.050910000000101
  					],
  					[
  						42.77685184100096,
  						10.92687856693442
  					],
  					[
  						42.55875999999995,
  						10.57258000000013
  					],
  					[
  						43.678750000000036,
  						9.18358000000012
  					],
  					[
  						46.94834000000009,
  						7.99688000000009
  					],
  					[
  						47.78942,
  						8.003
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 2,
  			SOVEREIGNT: "Ethiopia",
  			SOV_A3: "ETH",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Ethiopia",
  			ADM0_A3: "ETH",
  			GEOU_DIF: 0,
  			GEOUNIT: "Ethiopia",
  			GU_A3: "ETH",
  			SU_DIF: 0,
  			SUBUNIT: "Ethiopia",
  			SU_A3: "ETH",
  			BRK_DIFF: 0,
  			NAME: "Ethiopia",
  			NAME_LONG: "Ethiopia",
  			BRK_A3: "ETH",
  			BRK_NAME: "Ethiopia",
  			BRK_GROUP: "",
  			ABBREV: "Eth.",
  			POSTAL: "ET",
  			FORMAL_EN: "Federal Democratic Republic of Ethiopia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Ethiopia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Ethiopia",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 4,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 13,
  			POP_EST: 105350020,
  			POP_RANK: 17,
  			GDP_MD_EST: 174700,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2007,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "ET",
  			ISO_A2: "ET",
  			ISO_A3: "ETH",
  			ISO_A3_EH: "ETH",
  			ISO_N3: "231",
  			UN_A3: "231",
  			WB_A2: "ET",
  			WB_A3: "ETH",
  			WOE_ID: 23424808,
  			WOE_ID_EH: 23424808,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "ETH",
  			ADM0_A3_US: "ETH",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 2,
  			MAX_LABEL: 7,
  			NE_ID: 1159320617,
  			WIKIDATAID: "Q115",
  			NAME_AR: "إثيوبيا",
  			NAME_BN: "ইথিওপিয়া",
  			NAME_DE: "Äthiopien",
  			NAME_EN: "Ethiopia",
  			NAME_ES: "Etiopía",
  			NAME_FR: "Éthiopie",
  			NAME_EL: "Αιθιοπία",
  			NAME_HI: "इथियोपिया",
  			NAME_HU: "Etiópia",
  			NAME_ID: "Ethiopia",
  			NAME_IT: "Etiopia",
  			NAME_JA: "エチオピア",
  			NAME_KO: "에티오피아",
  			NAME_NL: "Ethiopië",
  			NAME_PL: "Etiopia",
  			NAME_PT: "Etiópia",
  			NAME_RU: "Эфиопия",
  			NAME_SV: "Etiopien",
  			NAME_TR: "Etiyopya",
  			NAME_VI: "Ethiopia",
  			NAME_ZH: "埃塞俄比亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						42.35156000000012,
  						12.542230000000131
  					],
  					[
  						43.08122602720016,
  						12.699638576707116
  					],
  					[
  						43.14530480324214,
  						11.462039699748857
  					],
  					[
  						42.77685184100096,
  						10.92687856693442
  					],
  					[
  						41.755570000000205,
  						11.050910000000101
  					],
  					[
  						41.66176000000013,
  						11.631199999999978
  					],
  					[
  						42.35156000000012,
  						12.542230000000131
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Djibouti",
  			SOV_A3: "DJI",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Djibouti",
  			ADM0_A3: "DJI",
  			GEOU_DIF: 0,
  			GEOUNIT: "Djibouti",
  			GU_A3: "DJI",
  			SU_DIF: 0,
  			SUBUNIT: "Djibouti",
  			SU_A3: "DJI",
  			BRK_DIFF: 0,
  			NAME: "Djibouti",
  			NAME_LONG: "Djibouti",
  			BRK_A3: "DJI",
  			BRK_NAME: "Djibouti",
  			BRK_GROUP: "",
  			ABBREV: "Dji.",
  			POSTAL: "DJ",
  			FORMAL_EN: "Republic of Djibouti",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Djibouti",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Djibouti",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 8,
  			POP_EST: 865267,
  			POP_RANK: 11,
  			GDP_MD_EST: 3345,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2009,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "DJ",
  			ISO_A2: "DJ",
  			ISO_A3: "DJI",
  			ISO_A3_EH: "DJI",
  			ISO_N3: "262",
  			UN_A3: "262",
  			WB_A2: "DJ",
  			WB_A3: "DJI",
  			WOE_ID: 23424797,
  			WOE_ID_EH: 23424797,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "DJI",
  			ADM0_A3_US: "DJI",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Middle East & North Africa",
  			NAME_LEN: 8,
  			LONG_LEN: 8,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 9,
  			NE_ID: 1159320541,
  			WIKIDATAID: "Q977",
  			NAME_AR: "جيبوتي",
  			NAME_BN: "জিবুতি",
  			NAME_DE: "Dschibuti",
  			NAME_EN: "Djibouti",
  			NAME_ES: "Yibuti",
  			NAME_FR: "Djibouti",
  			NAME_EL: "Τζιμπουτί",
  			NAME_HI: "जिबूती",
  			NAME_HU: "Dzsibuti",
  			NAME_ID: "Djibouti",
  			NAME_IT: "Gibuti",
  			NAME_JA: "ジブチ",
  			NAME_KO: "지부티",
  			NAME_NL: "Djibouti",
  			NAME_PL: "Dżibuti",
  			NAME_PT: "Djibouti",
  			NAME_RU: "Джибути",
  			NAME_SV: "Djibouti",
  			NAME_TR: "Cibuti",
  			NAME_VI: "Djibouti",
  			NAME_ZH: "吉布提"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						48.94820475850985,
  						11.41061728169797
  					],
  					[
  						48.93812951029645,
  						9.451748968946617
  					],
  					[
  						47.78942,
  						8.003
  					],
  					[
  						46.94834000000009,
  						7.99688000000009
  					],
  					[
  						43.678750000000036,
  						9.18358000000012
  					],
  					[
  						42.55875999999995,
  						10.57258000000013
  					],
  					[
  						42.77685184100096,
  						10.92687856693442
  					],
  					[
  						43.14530480324214,
  						11.462039699748857
  					],
  					[
  						44.11780358254282,
  						10.445538438351605
  					],
  					[
  						46.645401238803004,
  						10.816549383991173
  					],
  					[
  						48.94820475850985,
  						11.41061728169797
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Somaliland",
  			SOV_A3: "SOL",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Indeterminate",
  			ADMIN: "Somaliland",
  			ADM0_A3: "SOL",
  			GEOU_DIF: 0,
  			GEOUNIT: "Somaliland",
  			GU_A3: "SOL",
  			SU_DIF: 0,
  			SUBUNIT: "Somaliland",
  			SU_A3: "SOL",
  			BRK_DIFF: 1,
  			NAME: "Somaliland",
  			NAME_LONG: "Somaliland",
  			BRK_A3: "B30",
  			BRK_NAME: "Somaliland",
  			BRK_GROUP: "",
  			ABBREV: "Solnd.",
  			POSTAL: "SL",
  			FORMAL_EN: "Republic of Somaliland",
  			FORMAL_FR: "",
  			NAME_CIAWF: "",
  			NOTE_ADM0: "Self admin.",
  			NOTE_BRK: "Self admin.; Claimed by Somalia",
  			NAME_SORT: "Somaliland",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 6,
  			MAPCOLOR9: 5,
  			MAPCOLOR13: 2,
  			POP_EST: 3500000,
  			POP_RANK: 12,
  			GDP_MD_EST: 12250,
  			POP_YEAR: 2013,
  			LASTCENSUS: -99,
  			GDP_YEAR: 2013,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "-99",
  			ISO_A2: "-99",
  			ISO_A3: "-99",
  			ISO_A3_EH: "-99",
  			ISO_N3: "-99",
  			UN_A3: "-099",
  			WB_A2: "-99",
  			WB_A3: "-99",
  			WOE_ID: -99,
  			WOE_ID_EH: -99,
  			WOE_NOTE: "Includes old states of 2347021, 2347020, 2347017 and portion of 2347016.",
  			ADM0_A3_IS: "SOM",
  			ADM0_A3_US: "SOM",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 6,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 4,
  			MIN_LABEL: 4.5,
  			MAX_LABEL: 9,
  			NE_ID: 1159321259,
  			WIKIDATAID: "Q34754",
  			NAME_AR: "صوماليلاند",
  			NAME_BN: "সোমালিল্যান্ড",
  			NAME_DE: "Somaliland",
  			NAME_EN: "Somaliland",
  			NAME_ES: "Somalilandia",
  			NAME_FR: "Somaliland",
  			NAME_EL: "Σομαλιλάνδη",
  			NAME_HI: "सोमालीदेश",
  			NAME_HU: "Szomáliföld",
  			NAME_ID: "Somaliland",
  			NAME_IT: "Somaliland",
  			NAME_JA: "ソマリランド",
  			NAME_KO: "소말릴란드",
  			NAME_NL: "Somaliland",
  			NAME_PL: "Somaliland",
  			NAME_PT: "Somalilândia",
  			NAME_RU: "Сомалиленд",
  			NAME_SV: "Somaliland",
  			NAME_TR: "Somaliland",
  			NAME_VI: "Somaliland",
  			NAME_ZH: "索马里兰"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						33.90371119710453,
  						-0.9500000000000001
  					],
  					[
  						30.419104852019245,
  						-1.1346591121504161
  					],
  					[
  						29.579466180140884,
  						-1.3413131648856265
  					],
  					[
  						29.875778842902434,
  						0.5973798689763612
  					],
  					[
  						30.77334679538004,
  						2.339883327642127
  					],
  					[
  						30.833852421715427,
  						3.5091716042224625
  					],
  					[
  						33.3900000000001,
  						3.7899999999999636
  					],
  					[
  						34.005,
  						4.249884947362048
  					],
  					[
  						34.47913,
  						3.5556000000000836
  					],
  					[
  						35.03599,
  						1.90584
  					],
  					[
  						33.893568969666944,
  						0.1098135378618963
  					],
  					[
  						33.90371119710453,
  						-0.9500000000000001
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Uganda",
  			SOV_A3: "UGA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Uganda",
  			ADM0_A3: "UGA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Uganda",
  			GU_A3: "UGA",
  			SU_DIF: 0,
  			SUBUNIT: "Uganda",
  			SU_A3: "UGA",
  			BRK_DIFF: 0,
  			NAME: "Uganda",
  			NAME_LONG: "Uganda",
  			BRK_A3: "UGA",
  			BRK_NAME: "Uganda",
  			BRK_GROUP: "",
  			ABBREV: "Uga.",
  			POSTAL: "UG",
  			FORMAL_EN: "Republic of Uganda",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Uganda",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Uganda",
  			NAME_ALT: "",
  			MAPCOLOR7: 6,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 6,
  			MAPCOLOR13: 4,
  			POP_EST: 39570125,
  			POP_RANK: 15,
  			GDP_MD_EST: 84930,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "UG",
  			ISO_A2: "UG",
  			ISO_A3: "UGA",
  			ISO_A3_EH: "UGA",
  			ISO_N3: "800",
  			UN_A3: "800",
  			WB_A2: "UG",
  			WB_A3: "UGA",
  			WOE_ID: 23424974,
  			WOE_ID_EH: 23424974,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "UGA",
  			ADM0_A3_US: "UGA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321343,
  			WIKIDATAID: "Q1036",
  			NAME_AR: "أوغندا",
  			NAME_BN: "উগান্ডা",
  			NAME_DE: "Uganda",
  			NAME_EN: "Uganda",
  			NAME_ES: "Uganda",
  			NAME_FR: "Ouganda",
  			NAME_EL: "Ουγκάντα",
  			NAME_HI: "युगाण्डा",
  			NAME_HU: "Uganda",
  			NAME_ID: "Uganda",
  			NAME_IT: "Uganda",
  			NAME_JA: "ウガンダ",
  			NAME_KO: "우간다",
  			NAME_NL: "Oeganda",
  			NAME_PL: "Uganda",
  			NAME_PT: "Uganda",
  			NAME_RU: "Уганда",
  			NAME_SV: "Uganda",
  			NAME_TR: "Uganda",
  			NAME_VI: "Uganda",
  			NAME_ZH: "乌干达"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						30.419104852019245,
  						-1.1346591121504161
  					],
  					[
  						30.469673645761223,
  						-2.41385475710134
  					],
  					[
  						29.024926385216787,
  						-2.8392579077301576
  					],
  					[
  						29.579466180140884,
  						-1.3413131648856265
  					],
  					[
  						30.419104852019245,
  						-1.1346591121504161
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "Rwanda",
  			SOV_A3: "RWA",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Rwanda",
  			ADM0_A3: "RWA",
  			GEOU_DIF: 0,
  			GEOUNIT: "Rwanda",
  			GU_A3: "RWA",
  			SU_DIF: 0,
  			SUBUNIT: "Rwanda",
  			SU_A3: "RWA",
  			BRK_DIFF: 0,
  			NAME: "Rwanda",
  			NAME_LONG: "Rwanda",
  			BRK_A3: "RWA",
  			BRK_NAME: "Rwanda",
  			BRK_GROUP: "",
  			ABBREV: "Rwa.",
  			POSTAL: "RW",
  			FORMAL_EN: "Republic of Rwanda",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Rwanda",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Rwanda",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 10,
  			POP_EST: 11901484,
  			POP_RANK: 14,
  			GDP_MD_EST: 21970,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2002,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "RW",
  			ISO_A2: "RW",
  			ISO_A3: "RWA",
  			ISO_A3_EH: "RWA",
  			ISO_N3: "646",
  			UN_A3: "646",
  			WB_A2: "RW",
  			WB_A3: "RWA",
  			WOE_ID: 23424937,
  			WOE_ID_EH: 23424937,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "RWA",
  			ADM0_A3_US: "RWA",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321219,
  			WIKIDATAID: "Q1037",
  			NAME_AR: "رواندا",
  			NAME_BN: "রুয়ান্ডা",
  			NAME_DE: "Ruanda",
  			NAME_EN: "Rwanda",
  			NAME_ES: "Ruanda",
  			NAME_FR: "Rwanda",
  			NAME_EL: "Ρουάντα",
  			NAME_HI: "रवाण्डा",
  			NAME_HU: "Ruanda",
  			NAME_ID: "Rwanda",
  			NAME_IT: "Ruanda",
  			NAME_JA: "ルワンダ",
  			NAME_KO: "르완다",
  			NAME_NL: "Rwanda",
  			NAME_PL: "Rwanda",
  			NAME_PT: "Ruanda",
  			NAME_RU: "Руанда",
  			NAME_SV: "Rwanda",
  			NAME_TR: "Ruanda",
  			NAME_VI: "Rwanda",
  			NAME_ZH: "卢旺达"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						18.559999999999945,
  						42.64999999999998
  					],
  					[
  						17.674921502358984,
  						43.02856252702361
  					],
  					[
  						15.750026075918981,
  						44.818711656262565
  					],
  					[
  						15.959367303133376,
  						45.23377676043094
  					],
  					[
  						19.005484597557594,
  						44.86023449354299
  					],
  					[
  						19.218519999999955,
  						43.52384000000001
  					],
  					[
  						18.559999999999945,
  						42.64999999999998
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Bosnia and Herzegovina",
  			SOV_A3: "BIH",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Bosnia and Herzegovina",
  			ADM0_A3: "BIH",
  			GEOU_DIF: 0,
  			GEOUNIT: "Bosnia and Herzegovina",
  			GU_A3: "BIH",
  			SU_DIF: 0,
  			SUBUNIT: "Bosnia and Herzegovina",
  			SU_A3: "BIH",
  			BRK_DIFF: 0,
  			NAME: "Bosnia and Herz.",
  			NAME_LONG: "Bosnia and Herzegovina",
  			BRK_A3: "BIH",
  			BRK_NAME: "Bosnia and Herz.",
  			BRK_GROUP: "",
  			ABBREV: "B.H.",
  			POSTAL: "BiH",
  			FORMAL_EN: "Bosnia and Herzegovina",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Bosnia and Herzegovina",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Bosnia and Herzegovina",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 1,
  			MAPCOLOR13: 2,
  			POP_EST: 3856181,
  			POP_RANK: 12,
  			GDP_MD_EST: 42530,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1991,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "BK",
  			ISO_A2: "BA",
  			ISO_A3: "BIH",
  			ISO_A3_EH: "BIH",
  			ISO_N3: "070",
  			UN_A3: "070",
  			WB_A2: "BA",
  			WB_A3: "BIH",
  			WOE_ID: 23424761,
  			WOE_ID_EH: 23424761,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "BIH",
  			ADM0_A3_US: "BIH",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 16,
  			LONG_LEN: 22,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4.5,
  			MAX_LABEL: 9.5,
  			NE_ID: 1159320417,
  			WIKIDATAID: "Q225",
  			NAME_AR: "البوسنة والهرسك",
  			NAME_BN: "বসনিয়া ও হার্জেগোভিনা",
  			NAME_DE: "Bosnien und Herzegowina",
  			NAME_EN: "Bosnia and Herzegovina",
  			NAME_ES: "Bosnia y Herzegovina",
  			NAME_FR: "Bosnie-Herzégovine",
  			NAME_EL: "Βοσνία και Ερζεγοβίνη",
  			NAME_HI: "बॉस्निया और हर्ज़ेगोविना",
  			NAME_HU: "Bosznia-Hercegovina",
  			NAME_ID: "Bosnia dan Herzegovina",
  			NAME_IT: "Bosnia ed Erzegovina",
  			NAME_JA: "ボスニア・ヘルツェゴビナ",
  			NAME_KO: "보스니아 헤르체고비나",
  			NAME_NL: "Bosnië en Herzegovina",
  			NAME_PL: "Bośnia i Hercegowina",
  			NAME_PT: "Bósnia e Herzegovina",
  			NAME_RU: "Босния и Герцеговина",
  			NAME_SV: "Bosnien och Hercegovina",
  			NAME_TR: "Bosna-Hersek",
  			NAME_VI: "Bosna và Hercegovina",
  			NAME_ZH: "波斯尼亚和黑塞哥维那"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						22.380525750424592,
  						42.32025950781509
  					],
  					[
  						22.952377150166452,
  						41.33799388281115
  					],
  					[
  						21.0200403174764,
  						40.84272695572588
  					],
  					[
  						20.590246546680227,
  						41.855408919283626
  					],
  					[
  						21.57663598940212,
  						42.24522439706186
  					],
  					[
  						22.380525750424592,
  						42.32025950781509
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Macedonia",
  			SOV_A3: "MKD",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Macedonia",
  			ADM0_A3: "MKD",
  			GEOU_DIF: 0,
  			GEOUNIT: "Macedonia",
  			GU_A3: "MKD",
  			SU_DIF: 0,
  			SUBUNIT: "Macedonia",
  			SU_A3: "MKD",
  			BRK_DIFF: 0,
  			NAME: "Macedonia",
  			NAME_LONG: "Macedonia",
  			BRK_A3: "MKD",
  			BRK_NAME: "Macedonia",
  			BRK_GROUP: "",
  			ABBREV: "Mkd.",
  			POSTAL: "MK",
  			FORMAL_EN: "Former Yugoslav Republic of Macedonia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Macedonia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Macedonia, FYR",
  			NAME_ALT: "",
  			MAPCOLOR7: 5,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 7,
  			MAPCOLOR13: 3,
  			POP_EST: 2103721,
  			POP_RANK: 12,
  			GDP_MD_EST: 29520,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2010,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MK",
  			ISO_A2: "MK",
  			ISO_A3: "MKD",
  			ISO_A3_EH: "MKD",
  			ISO_N3: "807",
  			UN_A3: "807",
  			WB_A2: "MK",
  			WB_A3: "MKD",
  			WOE_ID: 23424890,
  			WOE_ID_EH: 23424890,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MKD",
  			ADM0_A3_US: "MKD",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 9,
  			LONG_LEN: 9,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321061,
  			WIKIDATAID: "Q221",
  			NAME_AR: "جمهورية مقدونيا",
  			NAME_BN: "ম্যাসেডোনিয়া প্রজাতন্ত্র",
  			NAME_DE: "Mazedonien",
  			NAME_EN: "Republic of Macedonia",
  			NAME_ES: "República de Macedonia",
  			NAME_FR: "République de Macédoine",
  			NAME_EL: "πρώην Γιουγκοσλαβική Δημοκρατία της Μακεδονίας",
  			NAME_HI: "मैसिडोनिया",
  			NAME_HU: "Macedónia",
  			NAME_ID: "Republik Makedonia",
  			NAME_IT: "Repubblica di Macedonia",
  			NAME_JA: "マケドニア共和国",
  			NAME_KO: "마케도니아 공화국",
  			NAME_NL: "Macedonië",
  			NAME_PL: "Macedonia",
  			NAME_PT: "República da Macedónia",
  			NAME_RU: "Республика Македония",
  			NAME_SV: "Makedonien",
  			NAME_TR: "Makedonya Cumhuriyeti",
  			NAME_VI: "Cộng hòa Macedonia",
  			NAME_ZH: "馬其頓共和國"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						18.829824792873946,
  						45.908872358025285
  					],
  					[
  						20.220192498462836,
  						46.127468980486555
  					],
  					[
  						21.56202273935361,
  						44.7689472519655
  					],
  					[
  						22.65714969248299,
  						44.23492300066128
  					],
  					[
  						22.986018507588483,
  						43.2111612005271
  					],
  					[
  						22.380525750424592,
  						42.32025950781509
  					],
  					[
  						21.57663598940212,
  						42.24522439706186
  					],
  					[
  						20.257580000000075,
  						42.81275000000011
  					],
  					[
  						19.218519999999955,
  						43.52384000000001
  					],
  					[
  						19.005484597557594,
  						44.86023449354299
  					],
  					[
  						18.829824792873946,
  						45.908872358025285
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 5,
  			SOVEREIGNT: "Republic of Serbia",
  			SOV_A3: "SRB",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Republic of Serbia",
  			ADM0_A3: "SRB",
  			GEOU_DIF: 0,
  			GEOUNIT: "Republic of Serbia",
  			GU_A3: "SRB",
  			SU_DIF: 0,
  			SUBUNIT: "Republic of Serbia",
  			SU_A3: "SRB",
  			BRK_DIFF: 0,
  			NAME: "Serbia",
  			NAME_LONG: "Serbia",
  			BRK_A3: "SRB",
  			BRK_NAME: "Serbia",
  			BRK_GROUP: "",
  			ABBREV: "Serb.",
  			POSTAL: "RS",
  			FORMAL_EN: "Republic of Serbia",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Serbia",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Serbia",
  			NAME_ALT: "",
  			MAPCOLOR7: 3,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 2,
  			MAPCOLOR13: 10,
  			POP_EST: 7111024,
  			POP_RANK: 13,
  			GDP_MD_EST: 101800,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "RI",
  			ISO_A2: "RS",
  			ISO_A3: "SRB",
  			ISO_A3_EH: "SRB",
  			ISO_N3: "688",
  			UN_A3: "688",
  			WB_A2: "YF",
  			WB_A3: "SRB",
  			WOE_ID: -90,
  			WOE_ID_EH: 20069818,
  			WOE_NOTE: "Expired WOE also contains Kosovo.",
  			ADM0_A3_IS: "SRB",
  			ADM0_A3_US: "SRB",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 4,
  			MAX_LABEL: 7,
  			NE_ID: 1159321267,
  			WIKIDATAID: "Q403",
  			NAME_AR: "صربيا",
  			NAME_BN: "সার্বিয়া",
  			NAME_DE: "Serbien",
  			NAME_EN: "Serbia",
  			NAME_ES: "Serbia",
  			NAME_FR: "Serbie",
  			NAME_EL: "Σερβία",
  			NAME_HI: "सर्बिया",
  			NAME_HU: "Szerbia",
  			NAME_ID: "Serbia",
  			NAME_IT: "Serbia",
  			NAME_JA: "セルビア",
  			NAME_KO: "세르비아",
  			NAME_NL: "Servië",
  			NAME_PL: "Serbia",
  			NAME_PT: "Sérvia",
  			NAME_RU: "Сербия",
  			NAME_SV: "Serbien",
  			NAME_TR: "Sırbistan",
  			NAME_VI: "Serbia",
  			NAME_ZH: "塞尔维亚"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						20.070700000000045,
  						42.58863000000008
  					],
  					[
  						19.37176816334725,
  						41.877550679783496
  					],
  					[
  						18.45001688302086,
  						42.47999224531218
  					],
  					[
  						18.559999999999945,
  						42.64999999999998
  					],
  					[
  						19.218519999999955,
  						43.52384000000001
  					],
  					[
  						20.257580000000075,
  						42.81275000000011
  					],
  					[
  						20.070700000000045,
  						42.58863000000008
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Montenegro",
  			SOV_A3: "MNE",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Montenegro",
  			ADM0_A3: "MNE",
  			GEOU_DIF: 0,
  			GEOUNIT: "Montenegro",
  			GU_A3: "MNE",
  			SU_DIF: 0,
  			SUBUNIT: "Montenegro",
  			SU_A3: "MNE",
  			BRK_DIFF: 0,
  			NAME: "Montenegro",
  			NAME_LONG: "Montenegro",
  			BRK_A3: "MNE",
  			BRK_NAME: "Montenegro",
  			BRK_GROUP: "",
  			ABBREV: "Mont.",
  			POSTAL: "ME",
  			FORMAL_EN: "Montenegro",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Montenegro",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Montenegro",
  			NAME_ALT: "",
  			MAPCOLOR7: 4,
  			MAPCOLOR8: 1,
  			MAPCOLOR9: 4,
  			MAPCOLOR13: 5,
  			POP_EST: 642550,
  			POP_RANK: 11,
  			GDP_MD_EST: 10610,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2011,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "3. Upper middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "MJ",
  			ISO_A2: "ME",
  			ISO_A3: "MNE",
  			ISO_A3_EH: "MNE",
  			ISO_N3: "499",
  			UN_A3: "499",
  			WB_A2: "ME",
  			WB_A3: "MNE",
  			WOE_ID: 20069817,
  			WOE_ID_EH: 20069817,
  			WOE_NOTE: "Exact WOE match as country",
  			ADM0_A3_IS: "MNE",
  			ADM0_A3_US: "MNE",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 10,
  			LONG_LEN: 10,
  			ABBREV_LEN: 5,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321069,
  			WIKIDATAID: "Q236",
  			NAME_AR: "الجبل الأسود",
  			NAME_BN: "মন্টিনিগ্রো",
  			NAME_DE: "Montenegro",
  			NAME_EN: "Montenegro",
  			NAME_ES: "Montenegro",
  			NAME_FR: "Monténégro",
  			NAME_EL: "Μαυροβούνιο",
  			NAME_HI: "मॉन्टेनीग्रो",
  			NAME_HU: "Montenegró",
  			NAME_ID: "Montenegro",
  			NAME_IT: "Montenegro",
  			NAME_JA: "モンテネグロ",
  			NAME_KO: "몬테네그로",
  			NAME_NL: "Montenegro",
  			NAME_PL: "Czarnogóra",
  			NAME_PT: "Montenegro",
  			NAME_RU: "Черногория",
  			NAME_SV: "Montenegro",
  			NAME_TR: "Karadağ",
  			NAME_VI: "Montenegro",
  			NAME_ZH: "蒙特內哥羅"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						20.590246546680227,
  						41.855408919283626
  					],
  					[
  						20.070700000000045,
  						42.58863000000008
  					],
  					[
  						20.257580000000075,
  						42.81275000000011
  					],
  					[
  						21.57663598940212,
  						42.24522439706186
  					],
  					[
  						20.590246546680227,
  						41.855408919283626
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 6,
  			SOVEREIGNT: "Kosovo",
  			SOV_A3: "KOS",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "Kosovo",
  			ADM0_A3: "KOS",
  			GEOU_DIF: 0,
  			GEOUNIT: "Kosovo",
  			GU_A3: "KOS",
  			SU_DIF: 0,
  			SUBUNIT: "Kosovo",
  			SU_A3: "KOS",
  			BRK_DIFF: 0,
  			NAME: "Kosovo",
  			NAME_LONG: "Kosovo",
  			BRK_A3: "KOS",
  			BRK_NAME: "Kosovo",
  			BRK_GROUP: "",
  			ABBREV: "Kos.",
  			POSTAL: "KO",
  			FORMAL_EN: "Republic of Kosovo",
  			FORMAL_FR: "",
  			NAME_CIAWF: "Kosovo",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "Kosovo",
  			NAME_ALT: "",
  			MAPCOLOR7: 2,
  			MAPCOLOR8: 2,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 11,
  			POP_EST: 1895250,
  			POP_RANK: 12,
  			GDP_MD_EST: 18490,
  			POP_YEAR: 2017,
  			LASTCENSUS: 1981,
  			GDP_YEAR: 2016,
  			ECONOMY: "6. Developing region",
  			INCOME_GRP: "4. Lower middle income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "KV",
  			ISO_A2: "XK",
  			ISO_A3: "-99",
  			ISO_A3_EH: "-99",
  			ISO_N3: "-99",
  			UN_A3: "-099",
  			WB_A2: "KV",
  			WB_A3: "KSV",
  			WOE_ID: -90,
  			WOE_ID_EH: 29389201,
  			WOE_NOTE: "Subunit of Serbia in WOE still; should include 29389201, 29389207, 29389218, 29389209 and 29389214.",
  			ADM0_A3_IS: "KOS",
  			ADM0_A3_US: "KOS",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Europe",
  			REGION_UN: "Europe",
  			SUBREGION: "Southern Europe",
  			REGION_WB: "Europe & Central Asia",
  			NAME_LEN: 6,
  			LONG_LEN: 6,
  			ABBREV_LEN: 4,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 5,
  			MAX_LABEL: 10,
  			NE_ID: 1159321007,
  			WIKIDATAID: "Q1246",
  			NAME_AR: "كوسوفو",
  			NAME_BN: "কসোভো",
  			NAME_DE: "Kosovo",
  			NAME_EN: "Kosovo",
  			NAME_ES: "Kosovo",
  			NAME_FR: "Kosovo",
  			NAME_EL: "Κοσσυφοπέδιο",
  			NAME_HI: "कोसोवो गणराज्य",
  			NAME_HU: "Koszovó",
  			NAME_ID: "Kosovo",
  			NAME_IT: "Kosovo",
  			NAME_JA: "コソボ共和国",
  			NAME_KO: "코소보",
  			NAME_NL: "Kosovo",
  			NAME_PL: "Kosowo",
  			NAME_PT: "Kosovo",
  			NAME_RU: "Республика Косово",
  			NAME_SV: "Kosovo",
  			NAME_TR: "Kosova",
  			NAME_VI: "Kosovo",
  			NAME_ZH: "科索沃"
  		}
  	},
  	{
  		type: "Feature",
  		geometry: {
  			type: "Polygon",
  			coordinates: [
  				[
  					[
  						30.833852421715427,
  						3.5091716042224625
  					],
  					[
  						29.71599531425602,
  						4.600804755060153
  					],
  					[
  						28.428993768026913,
  						4.287154649264494
  					],
  					[
  						27.37422610851749,
  						5.233944403500061
  					],
  					[
  						24.567369012152085,
  						8.229187933785468
  					],
  					[
  						24.53741516360202,
  						8.91753756573172
  					],
  					[
  						25.069603699343986,
  						10.273759963267992
  					],
  					[
  						25.790633328413946,
  						10.411098940233728
  					],
  					[
  						26.477328213242515,
  						9.552730334198088
  					],
  					[
  						28.966597170745786,
  						9.398223985111656
  					],
  					[
  						29.996639497988554,
  						10.290927335388687
  					],
  					[
  						31.35286189552488,
  						9.810240916008695
  					],
  					[
  						32.400071594888345,
  						11.080626452941488
  					],
  					[
  						32.31423473428475,
  						11.68148447716652
  					],
  					[
  						33.206938084561784,
  						12.179338268667095
  					],
  					[
  						33.206938084561784,
  						10.720111638406593
  					],
  					[
  						33.72195924818311,
  						10.325262079630193
  					],
  					[
  						33.97498000000007,
  						8.68455999999992
  					],
  					[
  						33.29480000000012,
  						8.354580000000055
  					],
  					[
  						35.29800711823298,
  						5.506
  					],
  					[
  						34.005,
  						4.249884947362048
  					],
  					[
  						33.3900000000001,
  						3.7899999999999636
  					],
  					[
  						30.833852421715427,
  						3.5091716042224625
  					]
  				]
  			]
  		},
  		properties: {
  			featurecla: "Admin-0 country",
  			scalerank: 1,
  			LABELRANK: 3,
  			SOVEREIGNT: "South Sudan",
  			SOV_A3: "SDS",
  			ADM0_DIF: 0,
  			LEVEL: 2,
  			TYPE: "Sovereign country",
  			ADMIN: "South Sudan",
  			ADM0_A3: "SDS",
  			GEOU_DIF: 0,
  			GEOUNIT: "South Sudan",
  			GU_A3: "SDS",
  			SU_DIF: 0,
  			SUBUNIT: "South Sudan",
  			SU_A3: "SDS",
  			BRK_DIFF: 0,
  			NAME: "S. Sudan",
  			NAME_LONG: "South Sudan",
  			BRK_A3: "SDS",
  			BRK_NAME: "S. Sudan",
  			BRK_GROUP: "",
  			ABBREV: "S. Sud.",
  			POSTAL: "SS",
  			FORMAL_EN: "Republic of South Sudan",
  			FORMAL_FR: "",
  			NAME_CIAWF: "South Sudan",
  			NOTE_ADM0: "",
  			NOTE_BRK: "",
  			NAME_SORT: "South Sudan",
  			NAME_ALT: "",
  			MAPCOLOR7: 1,
  			MAPCOLOR8: 3,
  			MAPCOLOR9: 3,
  			MAPCOLOR13: 5,
  			POP_EST: 13026129,
  			POP_RANK: 14,
  			GDP_MD_EST: 20880,
  			POP_YEAR: 2017,
  			LASTCENSUS: 2008,
  			GDP_YEAR: 2016,
  			ECONOMY: "7. Least developed region",
  			INCOME_GRP: "5. Low income",
  			WIKIPEDIA: -99,
  			FIPS_10_: "-99",
  			ISO_A2: "SS",
  			ISO_A3: "SSD",
  			ISO_A3_EH: "SSD",
  			ISO_N3: "728",
  			UN_A3: "728",
  			WB_A2: "SS",
  			WB_A3: "SSD",
  			WOE_ID: -99,
  			WOE_ID_EH: -99,
  			WOE_NOTE: "Includes states of 20069899, 20069897, 20069898, 20069901, 20069909, and 20069908 but maybe more?",
  			ADM0_A3_IS: "SSD",
  			ADM0_A3_US: "SDS",
  			ADM0_A3_UN: -99,
  			ADM0_A3_WB: -99,
  			CONTINENT: "Africa",
  			REGION_UN: "Africa",
  			SUBREGION: "Eastern Africa",
  			REGION_WB: "Sub-Saharan Africa",
  			NAME_LEN: 8,
  			LONG_LEN: 11,
  			ABBREV_LEN: 7,
  			TINY: -99,
  			HOMEPART: 1,
  			MIN_ZOOM: 0,
  			MIN_LABEL: 3,
  			MAX_LABEL: 8,
  			NE_ID: 1159321235,
  			WIKIDATAID: "Q958",
  			NAME_AR: "جنوب السودان",
  			NAME_BN: "দক্ষিণ সুদান",
  			NAME_DE: "Südsudan",
  			NAME_EN: "South Sudan",
  			NAME_ES: "Sudán del Sur",
  			NAME_FR: "Soudan du Sud",
  			NAME_EL: "Νότιο Σουδάν",
  			NAME_HI: "दक्षिण सूडान",
  			NAME_HU: "Dél-Szudán",
  			NAME_ID: "Sudan Selatan",
  			NAME_IT: "Sudan del Sud",
  			NAME_JA: "南スーダン",
  			NAME_KO: "남수단",
  			NAME_NL: "Zuid-Soedan",
  			NAME_PL: "Sudan Południowy",
  			NAME_PT: "Sudão do Sul",
  			NAME_RU: "Южный Судан",
  			NAME_SV: "Sydsudan",
  			NAME_TR: "Güney Sudan",
  			NAME_VI: "Nam Sudan",
  			NAME_ZH: "南苏丹"
  		}
  	}
  ];
  var collection = {
  	type: type,
  	features: features
  };

  const WIDTH = 1000;
    const HEIGHT = 700;
    
    const svg = select('#graph1').append('svg')
      .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

    svg.append('circle')
      .attr('cx', '500')
      .attr('cy', '390')
      .attr('r', '395')
      // .attr('stroke', '#5458B0')
      .attr('fill', '#121563')
      .attr('opacity', '0.2');
    
    const g_country = svg.append('g');
     
    const paths = g_country.selectAll('path')
      .data(collection.features)
      .enter()
      .append('path')
      .attr('fill', '#121563');
      // .attr('transform', `translate(${500 - 3})`)
      // .attr('stroke', '#121563')


    let rotate = [0, 0, 0];
    
    const tick = () => {
      rotate = [rotate[0] + 0.1, -10, -15];
      const projection = geoOrthographic()
        .fitExtent([[0, 0], [WIDTH, HEIGHT]], collection)
        .rotate(rotate);
      const pathCreator = geoPath().projection(projection);
      paths.attr('d', pathCreator);
    };
    
    timer(tick);

  const DATA=[
      {"nom":"England","valeur":1496},
      {"nom":"Germany","valeur":1138},
      {"nom":"Spain","valeur":1055},
      {"nom":"Argentina","valeur":970},
      {"nom":"France","valeur":948}
  ];

    bb.generate({
      title: {
          text: "Les 5 pays les plus représentés sur FIFA21"
      },
      bindto: "#graph2",
      size: {
          // width: 500,
          heigth: 200
      },
      data: {
        json: {
            Joueurs_FIFA21 : DATA.map(({valeur}) => valeur),
        },
        type: 'bar',
        labels: {
          colors: "#121563",
          right: true
        },
      },
      bar: {
          // padding: 1,
          radius: {
              ratio: 0.5
          },
          width: {
              ratio: 0.7,
              max: 80
          }
      },
      axis: {
          y: {
              label: "Nbr de joueurs FIFA21"
          },
          x: {
              type: 'category',
              categories: DATA.map(({nom}) => nom),
          },
          rotated: true
      },
      legend:{
        show: false
      },
      color:{
          pattern: ["#121563"]
      },
  });

}());
