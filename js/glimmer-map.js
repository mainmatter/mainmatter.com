(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

class Container {
    constructor(registry, resolver = null) {
        this._registry = registry;
        this._resolver = resolver;
        this._lookups = {};
        this._factoryDefinitionLookups = {};
    }
    factoryFor(specifier) {
        let factoryDefinition = this._factoryDefinitionLookups[specifier];
        if (!factoryDefinition) {
            if (this._resolver) {
                factoryDefinition = this._resolver.retrieve(specifier);
            }
            if (!factoryDefinition) {
                factoryDefinition = this._registry.registration(specifier);
            }
            if (factoryDefinition) {
                this._factoryDefinitionLookups[specifier] = factoryDefinition;
            }
        }
        if (!factoryDefinition) {
            return;
        }
        return this.buildFactory(specifier, factoryDefinition);
    }
    lookup(specifier) {
        let singleton = this._registry.registeredOption(specifier, 'singleton') !== false;
        if (singleton && this._lookups[specifier]) {
            return this._lookups[specifier];
        }
        let factory = this.factoryFor(specifier);
        if (!factory) {
            return;
        }
        if (this._registry.registeredOption(specifier, 'instantiate') === false) {
            return factory.class;
        }
        let object = factory.create();
        if (singleton && object) {
            this._lookups[specifier] = object;
        }
        return object;
    }
    defaultInjections(specifier) {
        return {};
    }
    buildInjections(specifier) {
        let hash = this.defaultInjections(specifier);
        let injections = this._registry.registeredInjections(specifier);
        let injection;
        for (let i = 0; i < injections.length; i++) {
            injection = injections[i];
            hash[injection.property] = this.lookup(injection.source);
        }
        return hash;
    }
    buildFactory(specifier, factoryDefinition) {
        let injections = this.buildInjections(specifier);
        return {
            class: factoryDefinition,
            create(options) {
                let mergedOptions = Object.assign({}, injections, options);
                return factoryDefinition.create(mergedOptions);
            }
        };
    }
}

class Registry {
    constructor(options) {
        this._registrations = {};
        this._registeredOptions = {};
        this._registeredInjections = {};
        if (options && options.fallback) {
            this._fallback = options.fallback;
        }
    }
    register(specifier, factoryDefinition, options) {
        this._registrations[specifier] = factoryDefinition;
        if (options) {
            this._registeredOptions[specifier] = options;
        }
    }
    registration(specifier) {
        let registration = this._registrations[specifier];
        if (registration === undefined && this._fallback) {
            registration = this._fallback.registration(specifier);
        }
        return registration;
    }
    unregister(specifier) {
        delete this._registrations[specifier];
        delete this._registeredOptions[specifier];
        delete this._registeredInjections[specifier];
    }
    registerOption(specifier, option, value) {
        let options = this._registeredOptions[specifier];
        if (!options) {
            options = {};
            this._registeredOptions[specifier] = options;
        }
        options[option] = value;
    }
    registeredOption(specifier, option) {
        let result;
        let options = this.registeredOptions(specifier);
        if (options) {
            result = options[option];
        }
        if (result === undefined && this._fallback !== undefined) {
            result = this._fallback.registeredOption(specifier, option);
        }
        return result;
    }
    registeredOptions(specifier) {
        let options = this._registeredOptions[specifier];
        if (options === undefined) {
            var _specifier$split = specifier.split(':');

            let type = _specifier$split[0];

            options = this._registeredOptions[type];
        }
        return options;
    }
    unregisterOption(specifier, option) {
        let options = this._registeredOptions[specifier];
        if (options) {
            delete options[option];
        }
    }
    registerInjection(specifier, property, source) {
        let injections = this._registeredInjections[specifier];
        if (injections === undefined) {
            this._registeredInjections[specifier] = injections = [];
        }
        injections.push({
            property,
            source
        });
    }
    registeredInjections(specifier) {
        var _specifier$split2 = specifier.split(':');

        let type = _specifier$split2[0];

        let injections = this._fallback ? this._fallback.registeredInjections(specifier) : [];
        Array.prototype.push.apply(injections, this._registeredInjections[type]);
        Array.prototype.push.apply(injections, this._registeredInjections[specifier]);
        return injections;
    }
}

// TODO - use symbol
const OWNER = '__owner__';
function getOwner(object) {
    return object[OWNER];
}
function setOwner(object, owner) {
    object[OWNER] = owner;
}

// There is a small whitelist of namespaced attributes specially
// enumerated in
// https://www.w3.org/TR/html/syntax.html#attributes-0
//
// > When a foreign element has one of the namespaced attributes given by
// > the local name and namespace of the first and second cells of a row
// > from the following table, it must be written using the name given by
// > the third cell from the same row.
//
// In all other cases, colons are interpreted as a regular character
// with no special meaning:
//
// > No other namespaced attribute can be expressed in the HTML syntax.

function unwrap(val) {
    if (val === null || val === undefined) throw new Error('Expected value to be present');
    return val;
}

function unreachable() {
    return new Error('unreachable');
}
function typePos(lastOperand) {
    return lastOperand - 4;
}

// import Logger from './logger';
// let alreadyWarned = false;
function debugAssert(test, msg) {
    // if (!alreadyWarned) {
    //   alreadyWarned = true;
    //   Logger.warn("Don't leave debug assertions on in public builds");
    // }
    if (!test) {
        throw new Error(msg || "assertion failure");
    }
}

function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Error"] = 3] = "Error";
})(LogLevel || (LogLevel = {}));

var NullConsole = function () {
    function NullConsole() {
        _classCallCheck$1(this, NullConsole);
    }

    NullConsole.prototype.log = function log(_message) {};

    NullConsole.prototype.warn = function warn(_message) {};

    NullConsole.prototype.error = function error(_message) {};

    NullConsole.prototype.trace = function trace() {};

    return NullConsole;
}();

var ALWAYS = void 0;
var Logger = function () {
    function Logger(_ref) {
        var console = _ref.console,
            level = _ref.level;

        _classCallCheck$1(this, Logger);

        this.f = ALWAYS;
        this.force = ALWAYS;
        this.console = console;
        this.level = level;
    }

    Logger.prototype.skipped = function skipped(level) {
        return level < this.level;
    };

    Logger.prototype.trace = function trace(message) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$stackTrace = _ref2.stackTrace,
            stackTrace = _ref2$stackTrace === undefined ? false : _ref2$stackTrace;

        if (this.skipped(LogLevel.Trace)) return;
        this.console.log(message);
        if (stackTrace) this.console.trace();
    };

    Logger.prototype.debug = function debug(message) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref3$stackTrace = _ref3.stackTrace,
            stackTrace = _ref3$stackTrace === undefined ? false : _ref3$stackTrace;

        if (this.skipped(LogLevel.Debug)) return;
        this.console.log(message);
        if (stackTrace) this.console.trace();
    };

    Logger.prototype.warn = function warn(message) {
        var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref4$stackTrace = _ref4.stackTrace,
            stackTrace = _ref4$stackTrace === undefined ? false : _ref4$stackTrace;

        if (this.skipped(LogLevel.Warn)) return;
        this.console.warn(message);
        if (stackTrace) this.console.trace();
    };

    Logger.prototype.error = function error(message) {
        if (this.skipped(LogLevel.Error)) return;
        this.console.error(message);
    };

    return Logger;
}();
var _console = typeof console === 'undefined' ? new NullConsole() : console;
ALWAYS = new Logger({ console: _console, level: LogLevel.Trace });
var LOG_LEVEL = LogLevel.Debug;
new Logger({ console: _console, level: LOG_LEVEL });

var objKeys = Object.keys;

function assign(obj) {
    for (var i = 1; i < arguments.length; i++) {
        var assignment = arguments[i];
        if (assignment === null || typeof assignment !== 'object') continue;
        var keys = objKeys(assignment);
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            obj[key] = assignment[key];
        }
    }
    return obj;
}
function fillNulls(count) {
    var arr = new Array(count);
    for (var i = 0; i < count; i++) {
        arr[i] = null;
    }
    return arr;
}

var GUID = 0;
function initializeGuid(object) {
    return object._guid = ++GUID;
}
function ensureGuid(object) {
    return object._guid || initializeGuid(object);
}

function _classCallCheck$2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var proto = Object.create(null, {
    // without this, we will always still end up with (new
    // EmptyObject()).constructor === Object
    constructor: {
        value: undefined,
        enumerable: false,
        writable: true
    }
});
function EmptyObject() {}
EmptyObject.prototype = proto;
function dict() {
    // let d = Object.create(null);
    // d.x = 1;
    // delete d.x;
    // return d;
    return new EmptyObject();
}
var DictSet = function () {
    function DictSet() {
        _classCallCheck$2(this, DictSet);

        this.dict = dict();
    }

    DictSet.prototype.add = function add(obj) {
        if (typeof obj === 'string') this.dict[obj] = obj;else this.dict[ensureGuid(obj)] = obj;
        return this;
    };

    DictSet.prototype.delete = function _delete(obj) {
        if (typeof obj === 'string') delete this.dict[obj];else if (obj._guid) delete this.dict[obj._guid];
    };

    DictSet.prototype.forEach = function forEach(callback) {
        var dict = this.dict;

        var dictKeys = Object.keys(dict);
        for (var i = 0; dictKeys.length; i++) {
            callback(dict[dictKeys[i]]);
        }
    };

    DictSet.prototype.toArray = function toArray() {
        return Object.keys(this.dict);
    };

    return DictSet;
}();
var Stack = function () {
    function Stack() {
        _classCallCheck$2(this, Stack);

        this.stack = [];
        this.current = null;
    }

    Stack.prototype.toArray = function toArray() {
        return this.stack;
    };

    Stack.prototype.push = function push(item) {
        this.current = item;
        this.stack.push(item);
    };

    Stack.prototype.pop = function pop() {
        var item = this.stack.pop();
        var len = this.stack.length;
        this.current = len === 0 ? null : this.stack[len - 1];
        return item === undefined ? null : item;
    };

    Stack.prototype.isEmpty = function isEmpty() {
        return this.stack.length === 0;
    };

    return Stack;
}();

function _classCallCheck$3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ListNode = function ListNode(value) {
    _classCallCheck$3(this, ListNode);

    this.next = null;
    this.prev = null;
    this.value = value;
};
var LinkedList = function () {
    function LinkedList() {
        _classCallCheck$3(this, LinkedList);

        this.clear();
    }

    LinkedList.fromSlice = function fromSlice(slice) {
        var list = new LinkedList();
        slice.forEachNode(function (n) {
            return list.append(n.clone());
        });
        return list;
    };

    LinkedList.prototype.head = function head() {
        return this._head;
    };

    LinkedList.prototype.tail = function tail() {
        return this._tail;
    };

    LinkedList.prototype.clear = function clear() {
        this._head = this._tail = null;
    };

    LinkedList.prototype.isEmpty = function isEmpty() {
        return this._head === null;
    };

    LinkedList.prototype.toArray = function toArray() {
        var out = [];
        this.forEachNode(function (n) {
            return out.push(n);
        });
        return out;
    };

    LinkedList.prototype.splice = function splice(start, end, reference) {
        var before = void 0;
        if (reference === null) {
            before = this._tail;
            this._tail = end;
        } else {
            before = reference.prev;
            end.next = reference;
            reference.prev = end;
        }
        if (before) {
            before.next = start;
            start.prev = before;
        }
    };

    LinkedList.prototype.nextNode = function nextNode(node) {
        return node.next;
    };

    LinkedList.prototype.prevNode = function prevNode(node) {
        return node.prev;
    };

    LinkedList.prototype.forEachNode = function forEachNode(callback) {
        var node = this._head;
        while (node !== null) {
            callback(node);
            node = node.next;
        }
    };

    LinkedList.prototype.contains = function contains(needle) {
        var node = this._head;
        while (node !== null) {
            if (node === needle) return true;
            node = node.next;
        }
        return false;
    };

    LinkedList.prototype.insertBefore = function insertBefore(node) {
        var reference = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (reference === null) return this.append(node);
        if (reference.prev) reference.prev.next = node;else this._head = node;
        node.prev = reference.prev;
        node.next = reference;
        reference.prev = node;
        return node;
    };

    LinkedList.prototype.append = function append(node) {
        var tail = this._tail;
        if (tail) {
            tail.next = node;
            node.prev = tail;
            node.next = null;
        } else {
            this._head = node;
        }
        return this._tail = node;
    };

    LinkedList.prototype.pop = function pop() {
        if (this._tail) return this.remove(this._tail);
        return null;
    };

    LinkedList.prototype.prepend = function prepend(node) {
        if (this._head) return this.insertBefore(node, this._head);
        return this._head = this._tail = node;
    };

    LinkedList.prototype.remove = function remove(node) {
        if (node.prev) node.prev.next = node.next;else this._head = node.next;
        if (node.next) node.next.prev = node.prev;else this._tail = node.prev;
        return node;
    };

    return LinkedList;
}();
var ListSlice = function () {
    function ListSlice(head, tail) {
        _classCallCheck$3(this, ListSlice);

        this._head = head;
        this._tail = tail;
    }

    ListSlice.toList = function toList(slice) {
        var list = new LinkedList();
        slice.forEachNode(function (n) {
            return list.append(n.clone());
        });
        return list;
    };

    ListSlice.prototype.forEachNode = function forEachNode(callback) {
        var node = this._head;
        while (node !== null) {
            callback(node);
            node = this.nextNode(node);
        }
    };

    ListSlice.prototype.contains = function contains(needle) {
        var node = this._head;
        while (node !== null) {
            if (node === needle) return true;
            node = node.next;
        }
        return false;
    };

    ListSlice.prototype.head = function head() {
        return this._head;
    };

    ListSlice.prototype.tail = function tail() {
        return this._tail;
    };

    ListSlice.prototype.toArray = function toArray() {
        var out = [];
        this.forEachNode(function (n) {
            return out.push(n);
        });
        return out;
    };

    ListSlice.prototype.nextNode = function nextNode(node) {
        if (node === this._tail) return null;
        return node.next;
    };

    ListSlice.prototype.prevNode = function prevNode(node) {
        if (node === this._head) return null;
        return node.prev;
    };

    ListSlice.prototype.isEmpty = function isEmpty() {
        return false;
    };

    return ListSlice;
}();
var EMPTY_SLICE = new ListSlice(null, null);

var HAS_NATIVE_WEAKMAP = function () {
    // detect if `WeakMap` is even present
    var hasWeakMap = typeof WeakMap === 'function';
    if (!hasWeakMap) {
        return false;
    }
    var instance = new WeakMap();
    // use `Object`'s `.toString` directly to prevent us from detecting
    // polyfills as native weakmaps
    return Object.prototype.toString.call(instance) === '[object WeakMap]';
}();

var HAS_TYPED_ARRAYS = typeof Uint32Array !== 'undefined';
var A = void 0;
if (HAS_TYPED_ARRAYS) {
    A = Uint32Array;
} else {
    A = Array;
}
var EMPTY_ARRAY = HAS_NATIVE_WEAKMAP ? Object.freeze([]) : [];

function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Registers
 *
 * For the most part, these follows MIPS naming conventions, however the
 * register numbers are different.
 */
var Register;
(function (Register) {
    // $0 or $pc (program counter): pointer into `program` for the next insturction; -1 means exit
    Register[Register["pc"] = 0] = "pc";
    // $1 or $ra (return address): pointer into `program` for the return
    Register[Register["ra"] = 1] = "ra";
    // $2 or $fp (frame pointer): pointer into the `evalStack` for the base of the stack
    Register[Register["fp"] = 2] = "fp";
    // $3 or $sp (stack pointer): pointer into the `evalStack` for the top of the stack
    Register[Register["sp"] = 3] = "sp";
    // $4-$5 or $s0-$s1 (saved): callee saved general-purpose registers
    Register[Register["s0"] = 4] = "s0";
    Register[Register["s1"] = 5] = "s1";
    // $6-$7 or $t0-$t1 (temporaries): caller saved general-purpose registers
    Register[Register["t0"] = 6] = "t0";
    Register[Register["t1"] = 7] = "t1";
})(Register || (Register = {}));

var AppendOpcodes = function () {
    function AppendOpcodes() {
        _classCallCheck(this, AppendOpcodes);

        this.evaluateOpcode = fillNulls(72 /* Size */).slice();
    }

    AppendOpcodes.prototype.add = function add(name, evaluate) {
        this.evaluateOpcode[name] = evaluate;
    };

    AppendOpcodes.prototype.evaluate = function evaluate(vm, opcode, type) {
        var func = this.evaluateOpcode[type];
        func(vm, opcode);
        
    };

    return AppendOpcodes;
}();
var APPEND_OPCODES = new AppendOpcodes();
var AbstractOpcode = function () {
    function AbstractOpcode() {
        _classCallCheck(this, AbstractOpcode);

        initializeGuid(this);
    }

    AbstractOpcode.prototype.toJSON = function toJSON() {
        return { guid: this._guid, type: this.type };
    };

    return AbstractOpcode;
}();
var UpdatingOpcode = function (_AbstractOpcode) {
    _inherits(UpdatingOpcode, _AbstractOpcode);

    function UpdatingOpcode() {
        _classCallCheck(this, UpdatingOpcode);

        var _this = _possibleConstructorReturn(this, _AbstractOpcode.apply(this, arguments));

        _this.next = null;
        _this.prev = null;
        return _this;
    }

    return UpdatingOpcode;
}(AbstractOpcode);

function _defaults$2(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn$2(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$2(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$2(subClass, superClass);
}

function _classCallCheck$6(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CONSTANT = 0;
var INITIAL = 1;
var VOLATILE = NaN;
var RevisionTag = function () {
    function RevisionTag() {
        _classCallCheck$6(this, RevisionTag);
    }

    RevisionTag.prototype.validate = function validate(snapshot) {
        return this.value() === snapshot;
    };

    return RevisionTag;
}();
RevisionTag.id = 0;
var VALUE = [];
var VALIDATE = [];
var TagWrapper = function () {
    function TagWrapper(type, inner) {
        _classCallCheck$6(this, TagWrapper);

        this.type = type;
        this.inner = inner;
    }

    TagWrapper.prototype.value = function value() {
        var func = VALUE[this.type];
        return func(this.inner);
    };

    TagWrapper.prototype.validate = function validate(snapshot) {
        var func = VALIDATE[this.type];
        return func(this.inner, snapshot);
    };

    return TagWrapper;
}();
function register(Type) {
    var type = VALUE.length;
    VALUE.push(function (tag) {
        return tag.value();
    });
    VALIDATE.push(function (tag, snapshot) {
        return tag.validate(snapshot);
    });
    Type.id = type;
}
///
// CONSTANT: 0
VALUE.push(function () {
    return CONSTANT;
});
VALIDATE.push(function (_tag, snapshot) {
    return snapshot === CONSTANT;
});
var CONSTANT_TAG = new TagWrapper(0, null);
// VOLATILE: 1
VALUE.push(function () {
    return VOLATILE;
});
VALIDATE.push(function (_tag, snapshot) {
    return snapshot === VOLATILE;
});
var VOLATILE_TAG = new TagWrapper(1, null);
// CURRENT: 2
VALUE.push(function () {
    return $REVISION;
});
VALIDATE.push(function (_tag, snapshot) {
    return snapshot === $REVISION;
});
var CURRENT_TAG = new TagWrapper(2, null);


function isConst(_ref2) {
    var tag = _ref2.tag;

    return tag === CONSTANT_TAG;
}
function isConstTag(tag) {
    return tag === CONSTANT_TAG;
}
///
var $REVISION = INITIAL;
var DirtyableTag = function (_RevisionTag) {
    _inherits$2(DirtyableTag, _RevisionTag);

    DirtyableTag.create = function create() {
        var revision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $REVISION;

        return new TagWrapper(this.id, new DirtyableTag(revision));
    };

    function DirtyableTag() {
        var revision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $REVISION;

        _classCallCheck$6(this, DirtyableTag);

        var _this = _possibleConstructorReturn$2(this, _RevisionTag.call(this));

        _this.revision = revision;
        return _this;
    }

    DirtyableTag.prototype.value = function value() {
        return this.revision;
    };

    DirtyableTag.prototype.dirty = function dirty() {
        this.revision = ++$REVISION;
    };

    return DirtyableTag;
}(RevisionTag);
register(DirtyableTag);
function combineTagged(tagged) {
    var optimized = [];
    for (var i = 0, l = tagged.length; i < l; i++) {
        var tag = tagged[i].tag;
        if (tag === VOLATILE_TAG) return VOLATILE_TAG;
        if (tag === CONSTANT_TAG) continue;
        optimized.push(tag);
    }
    return _combine(optimized);
}
function combineSlice(slice) {
    var optimized = [];
    var node = slice.head();
    while (node !== null) {
        var tag = node.tag;
        if (tag === VOLATILE_TAG) return VOLATILE_TAG;
        if (tag !== CONSTANT_TAG) optimized.push(tag);
        node = slice.nextNode(node);
    }
    return _combine(optimized);
}
function combine(tags) {
    var optimized = [];
    for (var i = 0, l = tags.length; i < l; i++) {
        var tag = tags[i];
        if (tag === VOLATILE_TAG) return VOLATILE_TAG;
        if (tag === CONSTANT_TAG) continue;
        optimized.push(tag);
    }
    return _combine(optimized);
}
function _combine(tags) {
    switch (tags.length) {
        case 0:
            return CONSTANT_TAG;
        case 1:
            return tags[0];
        case 2:
            return TagsPair.create(tags[0], tags[1]);
        default:
            return TagsCombinator.create(tags);
    }
    
}
var CachedTag = function (_RevisionTag2) {
    _inherits$2(CachedTag, _RevisionTag2);

    function CachedTag() {
        _classCallCheck$6(this, CachedTag);

        var _this2 = _possibleConstructorReturn$2(this, _RevisionTag2.apply(this, arguments));

        _this2.lastChecked = null;
        _this2.lastValue = null;
        return _this2;
    }

    CachedTag.prototype.value = function value() {
        var lastChecked = this.lastChecked,
            lastValue = this.lastValue;

        if (lastChecked !== $REVISION) {
            this.lastChecked = $REVISION;
            this.lastValue = lastValue = this.compute();
        }
        return this.lastValue;
    };

    CachedTag.prototype.invalidate = function invalidate() {
        this.lastChecked = null;
    };

    return CachedTag;
}(RevisionTag);

var TagsPair = function (_CachedTag) {
    _inherits$2(TagsPair, _CachedTag);

    TagsPair.create = function create(first, second) {
        return new TagWrapper(this.id, new TagsPair(first, second));
    };

    function TagsPair(first, second) {
        _classCallCheck$6(this, TagsPair);

        var _this3 = _possibleConstructorReturn$2(this, _CachedTag.call(this));

        _this3.first = first;
        _this3.second = second;
        return _this3;
    }

    TagsPair.prototype.compute = function compute() {
        return Math.max(this.first.value(), this.second.value());
    };

    return TagsPair;
}(CachedTag);

register(TagsPair);

var TagsCombinator = function (_CachedTag2) {
    _inherits$2(TagsCombinator, _CachedTag2);

    TagsCombinator.create = function create(tags) {
        return new TagWrapper(this.id, new TagsCombinator(tags));
    };

    function TagsCombinator(tags) {
        _classCallCheck$6(this, TagsCombinator);

        var _this4 = _possibleConstructorReturn$2(this, _CachedTag2.call(this));

        _this4.tags = tags;
        return _this4;
    }

    TagsCombinator.prototype.compute = function compute() {
        var tags = this.tags;

        var max = -1;
        for (var i = 0; i < tags.length; i++) {
            var value = tags[i].value();
            max = Math.max(value, max);
        }
        return max;
    };

    return TagsCombinator;
}(CachedTag);

register(TagsCombinator);
var UpdatableTag = function (_CachedTag3) {
    _inherits$2(UpdatableTag, _CachedTag3);

    UpdatableTag.create = function create(tag) {
        return new TagWrapper(this.id, new UpdatableTag(tag));
    };

    function UpdatableTag(tag) {
        _classCallCheck$6(this, UpdatableTag);

        var _this5 = _possibleConstructorReturn$2(this, _CachedTag3.call(this));

        _this5.tag = tag;
        _this5.lastUpdated = INITIAL;
        return _this5;
    }

    UpdatableTag.prototype.compute = function compute() {
        return Math.max(this.lastUpdated, this.tag.value());
    };

    UpdatableTag.prototype.update = function update(tag) {
        if (tag !== this.tag) {
            this.tag = tag;
            this.lastUpdated = $REVISION;
            this.invalidate();
        }
    };

    return UpdatableTag;
}(CachedTag);
register(UpdatableTag);
var CachedReference = function () {
    function CachedReference() {
        _classCallCheck$6(this, CachedReference);

        this.lastRevision = null;
        this.lastValue = null;
    }

    CachedReference.prototype.value = function value() {
        var tag = this.tag,
            lastRevision = this.lastRevision,
            lastValue = this.lastValue;

        if (!lastRevision || !tag.validate(lastRevision)) {
            lastValue = this.lastValue = this.compute();
            this.lastRevision = tag.value();
        }
        return lastValue;
    };

    CachedReference.prototype.invalidate = function invalidate() {
        this.lastRevision = null;
    };

    return CachedReference;
}();

var MapperReference = function (_CachedReference) {
    _inherits$2(MapperReference, _CachedReference);

    function MapperReference(reference, mapper) {
        _classCallCheck$6(this, MapperReference);

        var _this6 = _possibleConstructorReturn$2(this, _CachedReference.call(this));

        _this6.tag = reference.tag;
        _this6.reference = reference;
        _this6.mapper = mapper;
        return _this6;
    }

    MapperReference.prototype.compute = function compute() {
        var reference = this.reference,
            mapper = this.mapper;

        return mapper(reference.value());
    };

    return MapperReference;
}(CachedReference);

function map(reference, mapper) {
    return new MapperReference(reference, mapper);
}
//////////
var ReferenceCache = function () {
    function ReferenceCache(reference) {
        _classCallCheck$6(this, ReferenceCache);

        this.lastValue = null;
        this.lastRevision = null;
        this.initialized = false;
        this.tag = reference.tag;
        this.reference = reference;
    }

    ReferenceCache.prototype.peek = function peek() {
        if (!this.initialized) {
            return this.initialize();
        }
        return this.lastValue;
    };

    ReferenceCache.prototype.revalidate = function revalidate() {
        if (!this.initialized) {
            return this.initialize();
        }
        var reference = this.reference,
            lastRevision = this.lastRevision;

        var tag = reference.tag;
        if (tag.validate(lastRevision)) return NOT_MODIFIED;
        this.lastRevision = tag.value();
        var lastValue = this.lastValue;

        var value = reference.value();
        if (value === lastValue) return NOT_MODIFIED;
        this.lastValue = value;
        return value;
    };

    ReferenceCache.prototype.initialize = function initialize() {
        var reference = this.reference;

        var value = this.lastValue = reference.value();
        this.lastRevision = reference.tag.value();
        this.initialized = true;
        return value;
    };

    return ReferenceCache;
}();
var NOT_MODIFIED = "adb3b78e-3d22-4e4b-877a-6317c2c5c145";
function isModified(value) {
    return value !== NOT_MODIFIED;
}

function _classCallCheck$5(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ConstReference = function () {
    function ConstReference(inner) {
        _classCallCheck$5(this, ConstReference);

        this.inner = inner;
        this.tag = CONSTANT_TAG;
    }

    ConstReference.prototype.value = function value() {
        return this.inner;
    };

    return ConstReference;
}();

function _defaults$3(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$7(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$3(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$3(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$3(subClass, superClass);
}

var ListItem = function (_ListNode) {
    _inherits$3(ListItem, _ListNode);

    function ListItem(iterable, result) {
        _classCallCheck$7(this, ListItem);

        var _this = _possibleConstructorReturn$3(this, _ListNode.call(this, iterable.valueReferenceFor(result)));

        _this.retained = false;
        _this.seen = false;
        _this.key = result.key;
        _this.iterable = iterable;
        _this.memo = iterable.memoReferenceFor(result);
        return _this;
    }

    ListItem.prototype.update = function update(item) {
        this.retained = true;
        this.iterable.updateValueReference(this.value, item);
        this.iterable.updateMemoReference(this.memo, item);
    };

    ListItem.prototype.shouldRemove = function shouldRemove() {
        return !this.retained;
    };

    ListItem.prototype.reset = function reset() {
        this.retained = false;
        this.seen = false;
    };

    return ListItem;
}(ListNode);
var IterationArtifacts = function () {
    function IterationArtifacts(iterable) {
        _classCallCheck$7(this, IterationArtifacts);

        this.map = dict();
        this.list = new LinkedList();
        this.tag = iterable.tag;
        this.iterable = iterable;
    }

    IterationArtifacts.prototype.isEmpty = function isEmpty() {
        var iterator = this.iterator = this.iterable.iterate();
        return iterator.isEmpty();
    };

    IterationArtifacts.prototype.iterate = function iterate() {
        var iterator = this.iterator || this.iterable.iterate();
        this.iterator = null;
        return iterator;
    };

    IterationArtifacts.prototype.has = function has(key) {
        return !!this.map[key];
    };

    IterationArtifacts.prototype.get = function get(key) {
        return this.map[key];
    };

    IterationArtifacts.prototype.wasSeen = function wasSeen(key) {
        var node = this.map[key];
        return node && node.seen;
    };

    IterationArtifacts.prototype.append = function append(item) {
        var map = this.map,
            list = this.list,
            iterable = this.iterable;

        var node = map[item.key] = new ListItem(iterable, item);
        list.append(node);
        return node;
    };

    IterationArtifacts.prototype.insertBefore = function insertBefore(item, reference) {
        var map = this.map,
            list = this.list,
            iterable = this.iterable;

        var node = map[item.key] = new ListItem(iterable, item);
        node.retained = true;
        list.insertBefore(node, reference);
        return node;
    };

    IterationArtifacts.prototype.move = function move(item, reference) {
        var list = this.list;

        item.retained = true;
        list.remove(item);
        list.insertBefore(item, reference);
    };

    IterationArtifacts.prototype.remove = function remove(item) {
        var list = this.list;

        list.remove(item);
        delete this.map[item.key];
    };

    IterationArtifacts.prototype.nextNode = function nextNode(item) {
        return this.list.nextNode(item);
    };

    IterationArtifacts.prototype.head = function head() {
        return this.list.head();
    };

    return IterationArtifacts;
}();
var ReferenceIterator = function () {
    // if anyone needs to construct this object with something other than
    // an iterable, let @wycats know.
    function ReferenceIterator(iterable) {
        _classCallCheck$7(this, ReferenceIterator);

        this.iterator = null;
        var artifacts = new IterationArtifacts(iterable);
        this.artifacts = artifacts;
    }

    ReferenceIterator.prototype.next = function next() {
        var artifacts = this.artifacts;

        var iterator = this.iterator = this.iterator || artifacts.iterate();
        var item = iterator.next();
        if (!item) return null;
        return artifacts.append(item);
    };

    return ReferenceIterator;
}();
var Phase;
(function (Phase) {
    Phase[Phase["Append"] = 0] = "Append";
    Phase[Phase["Prune"] = 1] = "Prune";
    Phase[Phase["Done"] = 2] = "Done";
})(Phase || (Phase = {}));
var IteratorSynchronizer = function () {
    function IteratorSynchronizer(_ref) {
        var target = _ref.target,
            artifacts = _ref.artifacts;

        _classCallCheck$7(this, IteratorSynchronizer);

        this.target = target;
        this.artifacts = artifacts;
        this.iterator = artifacts.iterate();
        this.current = artifacts.head();
    }

    IteratorSynchronizer.prototype.sync = function sync() {
        var phase = Phase.Append;
        while (true) {
            switch (phase) {
                case Phase.Append:
                    phase = this.nextAppend();
                    break;
                case Phase.Prune:
                    phase = this.nextPrune();
                    break;
                case Phase.Done:
                    this.nextDone();
                    return;
            }
        }
    };

    IteratorSynchronizer.prototype.advanceToKey = function advanceToKey(key) {
        var current = this.current,
            artifacts = this.artifacts;

        var seek = current;
        while (seek && seek.key !== key) {
            seek.seen = true;
            seek = artifacts.nextNode(seek);
        }
        this.current = seek && artifacts.nextNode(seek);
    };

    IteratorSynchronizer.prototype.nextAppend = function nextAppend() {
        var iterator = this.iterator,
            current = this.current,
            artifacts = this.artifacts;

        var item = iterator.next();
        if (item === null) {
            return this.startPrune();
        }
        var key = item.key;

        if (current && current.key === key) {
            this.nextRetain(item);
        } else if (artifacts.has(key)) {
            this.nextMove(item);
        } else {
            this.nextInsert(item);
        }
        return Phase.Append;
    };

    IteratorSynchronizer.prototype.nextRetain = function nextRetain(item) {
        var artifacts = this.artifacts,
            current = this.current;

        current = current;
        current.update(item);
        this.current = artifacts.nextNode(current);
        this.target.retain(item.key, current.value, current.memo);
    };

    IteratorSynchronizer.prototype.nextMove = function nextMove(item) {
        var current = this.current,
            artifacts = this.artifacts,
            target = this.target;
        var key = item.key;

        var found = artifacts.get(item.key);
        found.update(item);
        if (artifacts.wasSeen(item.key)) {
            artifacts.move(found, current);
            target.move(found.key, found.value, found.memo, current ? current.key : null);
        } else {
            this.advanceToKey(key);
        }
    };

    IteratorSynchronizer.prototype.nextInsert = function nextInsert(item) {
        var artifacts = this.artifacts,
            target = this.target,
            current = this.current;

        var node = artifacts.insertBefore(item, current);
        target.insert(node.key, node.value, node.memo, current ? current.key : null);
    };

    IteratorSynchronizer.prototype.startPrune = function startPrune() {
        this.current = this.artifacts.head();
        return Phase.Prune;
    };

    IteratorSynchronizer.prototype.nextPrune = function nextPrune() {
        var artifacts = this.artifacts,
            target = this.target,
            current = this.current;

        if (current === null) {
            return Phase.Done;
        }
        var node = current;
        this.current = artifacts.nextNode(node);
        if (node.shouldRemove()) {
            artifacts.remove(node);
            target.delete(node.key);
        } else {
            node.reset();
        }
        return Phase.Prune;
    };

    IteratorSynchronizer.prototype.nextDone = function nextDone() {
        this.target.done();
    };

    return IteratorSynchronizer;
}();

function _defaults$1(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$4(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$1(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$1(subClass, superClass);
}

var PrimitiveReference = function (_ConstReference) {
    _inherits$1(PrimitiveReference, _ConstReference);

    function PrimitiveReference(value) {
        _classCallCheck$4(this, PrimitiveReference);

        return _possibleConstructorReturn$1(this, _ConstReference.call(this, value));
    }

    PrimitiveReference.create = function create(value) {
        if (value === undefined) {
            return UNDEFINED_REFERENCE;
        } else if (value === null) {
            return NULL_REFERENCE;
        } else if (value === true) {
            return TRUE_REFERENCE;
        } else if (value === false) {
            return FALSE_REFERENCE;
        } else if (typeof value === 'number') {
            return new ValueReference(value);
        } else {
            return new StringReference(value);
        }
    };

    PrimitiveReference.prototype.get = function get(_key) {
        return UNDEFINED_REFERENCE;
    };

    return PrimitiveReference;
}(ConstReference);

var StringReference = function (_PrimitiveReference) {
    _inherits$1(StringReference, _PrimitiveReference);

    function StringReference() {
        _classCallCheck$4(this, StringReference);

        var _this2 = _possibleConstructorReturn$1(this, _PrimitiveReference.apply(this, arguments));

        _this2.lengthReference = null;
        return _this2;
    }

    StringReference.prototype.get = function get(key) {
        if (key === 'length') {
            var lengthReference = this.lengthReference;

            if (lengthReference === null) {
                lengthReference = this.lengthReference = new ValueReference(this.inner.length);
            }
            return lengthReference;
        } else {
            return _PrimitiveReference.prototype.get.call(this, key);
        }
    };

    return StringReference;
}(PrimitiveReference);

var ValueReference = function (_PrimitiveReference2) {
    _inherits$1(ValueReference, _PrimitiveReference2);

    function ValueReference(value) {
        _classCallCheck$4(this, ValueReference);

        return _possibleConstructorReturn$1(this, _PrimitiveReference2.call(this, value));
    }

    return ValueReference;
}(PrimitiveReference);

var UNDEFINED_REFERENCE = new ValueReference(undefined);
var NULL_REFERENCE = new ValueReference(null);
var TRUE_REFERENCE = new ValueReference(true);
var FALSE_REFERENCE = new ValueReference(false);
var ConditionalReference = function () {
    function ConditionalReference(inner) {
        _classCallCheck$4(this, ConditionalReference);

        this.inner = inner;
        this.tag = inner.tag;
    }

    ConditionalReference.prototype.value = function value() {
        return this.toBool(this.inner.value());
    };

    ConditionalReference.prototype.toBool = function toBool(value) {
        return !!value;
    };

    return ConditionalReference;
}();

function _defaults$4(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$8(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$4(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$4(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$4(subClass, superClass);
}

var ConcatReference = function (_CachedReference) {
    _inherits$4(ConcatReference, _CachedReference);

    function ConcatReference(parts) {
        _classCallCheck$8(this, ConcatReference);

        var _this = _possibleConstructorReturn$4(this, _CachedReference.call(this));

        _this.parts = parts;
        _this.tag = combineTagged(parts);
        return _this;
    }

    ConcatReference.prototype.compute = function compute() {
        var parts = new Array();
        for (var i = 0; i < this.parts.length; i++) {
            var value = this.parts[i].value();
            if (value !== null && value !== undefined) {
                parts[i] = castToString(value);
            }
        }
        if (parts.length > 0) {
            return parts.join('');
        }
        return null;
    };

    return ConcatReference;
}(CachedReference);
function castToString(value) {
    if (typeof value.toString !== 'function') {
        return '';
    }
    return String(value);
}

APPEND_OPCODES.add(1 /* Helper */, function (vm, _ref) {
    var _helper = _ref.op1;

    var stack = vm.stack;
    var helper = vm.constants.getFunction(_helper);
    var args = stack.pop();
    var value = helper(vm, args);
    args.clear();
    vm.stack.push(value);
});
APPEND_OPCODES.add(2 /* Function */, function (vm, _ref2) {
    var _function = _ref2.op1;

    var func = vm.constants.getFunction(_function);
    vm.stack.push(func(vm));
});
APPEND_OPCODES.add(5 /* GetVariable */, function (vm, _ref3) {
    var symbol = _ref3.op1;

    var expr = vm.referenceForSymbol(symbol);
    vm.stack.push(expr);
});
APPEND_OPCODES.add(4 /* SetVariable */, function (vm, _ref4) {
    var symbol = _ref4.op1;

    var expr = vm.stack.pop();
    vm.scope().bindSymbol(symbol, expr);
});
APPEND_OPCODES.add(70 /* ResolveMaybeLocal */, function (vm, _ref5) {
    var _name = _ref5.op1;

    var name = vm.constants.getString(_name);
    var locals = vm.scope().getPartialMap();
    var ref = locals[name];
    if (ref === undefined) {
        ref = vm.getSelf().get(name);
    }
    vm.stack.push(ref);
});
APPEND_OPCODES.add(19 /* RootScope */, function (vm, _ref6) {
    var symbols = _ref6.op1,
        bindCallerScope = _ref6.op2;

    vm.pushRootScope(symbols, !!bindCallerScope);
});
APPEND_OPCODES.add(6 /* GetProperty */, function (vm, _ref7) {
    var _key = _ref7.op1;

    var key = vm.constants.getString(_key);
    var expr = vm.stack.pop();
    vm.stack.push(expr.get(key));
});
APPEND_OPCODES.add(7 /* PushBlock */, function (vm, _ref8) {
    var _block = _ref8.op1;

    var block = _block ? vm.constants.getBlock(_block) : null;
    vm.stack.push(block);
});
APPEND_OPCODES.add(8 /* GetBlock */, function (vm, _ref9) {
    var _block = _ref9.op1;

    vm.stack.push(vm.scope().getBlock(_block));
});
APPEND_OPCODES.add(9 /* HasBlock */, function (vm, _ref10) {
    var _block = _ref10.op1;

    var hasBlock = !!vm.scope().getBlock(_block);
    vm.stack.push(hasBlock ? TRUE_REFERENCE : FALSE_REFERENCE);
});
APPEND_OPCODES.add(10 /* HasBlockParams */, function (vm, _ref11) {
    var _block = _ref11.op1;

    var block = vm.scope().getBlock(_block);
    var hasBlockParams = block && block.symbolTable.parameters.length;
    vm.stack.push(hasBlockParams ? TRUE_REFERENCE : FALSE_REFERENCE);
});
APPEND_OPCODES.add(11 /* Concat */, function (vm, _ref12) {
    var count = _ref12.op1;

    var out = [];
    for (var i = count; i > 0; i--) {
        out.push(vm.stack.pop());
    }
    vm.stack.push(new ConcatReference(out.reverse()));
});

function normalizeStringValue(value) {
    if (isEmpty(value)) {
        return '';
    }
    return String(value);
}
function normalizeTrustedValue(value) {
    if (isEmpty(value)) {
        return '';
    }
    if (isString(value)) {
        return value;
    }
    if (isSafeString(value)) {
        return value.toHTML();
    }
    if (isNode(value)) {
        return value;
    }
    return String(value);
}
function isEmpty(value) {
    return value === null || value === undefined || typeof value.toString !== 'function';
}
function isSafeString(value) {
    return typeof value === 'object' && value !== null && typeof value.toHTML === 'function';
}
function isNode(value) {
    return typeof value === 'object' && value !== null && typeof value.nodeType === 'number';
}
function isFragment(value) {
    return isNode(value) && value.nodeType === 11;
}
function isString(value) {
    return typeof value === 'string';
}

function _defaults$7(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$11(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$7(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$7(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$7(subClass, superClass);
}

APPEND_OPCODES.add(20 /* ChildScope */, function (vm) {
    return vm.pushChildScope();
});
APPEND_OPCODES.add(21 /* PopScope */, function (vm) {
    return vm.popScope();
});
APPEND_OPCODES.add(39 /* PushDynamicScope */, function (vm) {
    return vm.pushDynamicScope();
});
APPEND_OPCODES.add(40 /* PopDynamicScope */, function (vm) {
    return vm.popDynamicScope();
});
APPEND_OPCODES.add(12 /* Immediate */, function (vm, _ref) {
    var number = _ref.op1;

    vm.stack.push(number);
});
APPEND_OPCODES.add(13 /* Constant */, function (vm, _ref2) {
    var other = _ref2.op1;

    vm.stack.push(vm.constants.getOther(other));
});
APPEND_OPCODES.add(14 /* PrimitiveReference */, function (vm, _ref3) {
    var primitive = _ref3.op1;

    var stack = vm.stack;
    var flag = (primitive & 3 << 30) >>> 30;
    var value = primitive & ~(3 << 30);
    switch (flag) {
        case 0:
            stack.push(PrimitiveReference.create(value));
            break;
        case 1:
            stack.push(PrimitiveReference.create(vm.constants.getString(value)));
            break;
        case 2:
            switch (value) {
                case 0:
                    stack.push(FALSE_REFERENCE);
                    break;
                case 1:
                    stack.push(TRUE_REFERENCE);
                    break;
                case 2:
                    stack.push(NULL_REFERENCE);
                    break;
                case 3:
                    stack.push(UNDEFINED_REFERENCE);
                    break;
            }
            break;
    }
});
APPEND_OPCODES.add(15 /* Dup */, function (vm, _ref4) {
    var register = _ref4.op1,
        offset = _ref4.op2;

    var position = vm.fetchValue(register) - offset;
    vm.stack.dup(position);
});
APPEND_OPCODES.add(16 /* Pop */, function (vm, _ref5) {
    var count = _ref5.op1;
    return vm.stack.pop(count);
});
APPEND_OPCODES.add(17 /* Load */, function (vm, _ref6) {
    var register = _ref6.op1;
    return vm.load(register);
});
APPEND_OPCODES.add(18 /* Fetch */, function (vm, _ref7) {
    var register = _ref7.op1;
    return vm.fetch(register);
});
APPEND_OPCODES.add(38 /* BindDynamicScope */, function (vm, _ref8) {
    var _names = _ref8.op1;

    var names = vm.constants.getArray(_names);
    vm.bindDynamicScope(names);
});
APPEND_OPCODES.add(47 /* PushFrame */, function (vm) {
    return vm.pushFrame();
});
APPEND_OPCODES.add(48 /* PopFrame */, function (vm) {
    return vm.popFrame();
});
APPEND_OPCODES.add(49 /* Enter */, function (vm, _ref9) {
    var args = _ref9.op1;
    return vm.enter(args);
});
APPEND_OPCODES.add(50 /* Exit */, function (vm) {
    return vm.exit();
});
APPEND_OPCODES.add(41 /* CompileDynamicBlock */, function (vm) {
    var stack = vm.stack;
    var block = stack.pop();
    stack.push(block ? block.compileDynamic(vm.env) : null);
});
APPEND_OPCODES.add(42 /* InvokeStatic */, function (vm, _ref10) {
    var _block = _ref10.op1;

    var block = vm.constants.getBlock(_block);
    var compiled = block.compileStatic(vm.env);
    vm.call(compiled.handle);
});
APPEND_OPCODES.add(43 /* InvokeDynamic */, function (vm, _ref11) {
    var _invoker = _ref11.op1;

    var invoker = vm.constants.getOther(_invoker);
    var block = vm.stack.pop();
    invoker.invoke(vm, block);
});
APPEND_OPCODES.add(44 /* Jump */, function (vm, _ref12) {
    var target = _ref12.op1;
    return vm.goto(target);
});
APPEND_OPCODES.add(45 /* JumpIf */, function (vm, _ref13) {
    var target = _ref13.op1;

    var reference = vm.stack.pop();
    if (isConst(reference)) {
        if (reference.value()) {
            vm.goto(target);
        }
    } else {
        var cache = new ReferenceCache(reference);
        if (cache.peek()) {
            vm.goto(target);
        }
        vm.updateWith(new Assert(cache));
    }
});
APPEND_OPCODES.add(46 /* JumpUnless */, function (vm, _ref14) {
    var target = _ref14.op1;

    var reference = vm.stack.pop();
    if (isConst(reference)) {
        if (!reference.value()) {
            vm.goto(target);
        }
    } else {
        var cache = new ReferenceCache(reference);
        if (!cache.peek()) {
            vm.goto(target);
        }
        vm.updateWith(new Assert(cache));
    }
});
APPEND_OPCODES.add(22 /* Return */, function (vm) {
    return vm.return();
});
APPEND_OPCODES.add(23 /* ReturnTo */, function (vm, _ref15) {
    var relative = _ref15.op1;

    vm.returnTo(relative);
});
var ConstTest = function ConstTest(ref, _env) {
    return new ConstReference(!!ref.value());
};
var SimpleTest = function SimpleTest(ref, _env) {
    return ref;
};
var EnvironmentTest = function EnvironmentTest(ref, env) {
    return env.toConditionalReference(ref);
};
APPEND_OPCODES.add(51 /* Test */, function (vm, _ref16) {
    var _func = _ref16.op1;

    var stack = vm.stack;
    var operand = stack.pop();
    var func = vm.constants.getFunction(_func);
    stack.push(func(operand, vm.env));
});
var Assert = function (_UpdatingOpcode) {
    _inherits$7(Assert, _UpdatingOpcode);

    function Assert(cache) {
        _classCallCheck$11(this, Assert);

        var _this = _possibleConstructorReturn$7(this, _UpdatingOpcode.call(this));

        _this.type = 'assert';
        _this.tag = cache.tag;
        _this.cache = cache;
        return _this;
    }

    Assert.prototype.evaluate = function evaluate(vm) {
        var cache = this.cache;

        if (isModified(cache.revalidate())) {
            vm.throw();
        }
    };

    Assert.prototype.toJSON = function toJSON() {
        var type = this.type,
            _guid = this._guid,
            cache = this.cache;

        var expected = void 0;
        try {
            expected = JSON.stringify(cache.peek());
        } catch (e) {
            expected = String(cache.peek());
        }
        return {
            args: [],
            details: { expected: expected },
            guid: _guid,
            type: type
        };
    };

    return Assert;
}(UpdatingOpcode);
var JumpIfNotModifiedOpcode = function (_UpdatingOpcode2) {
    _inherits$7(JumpIfNotModifiedOpcode, _UpdatingOpcode2);

    function JumpIfNotModifiedOpcode(tag, target) {
        _classCallCheck$11(this, JumpIfNotModifiedOpcode);

        var _this2 = _possibleConstructorReturn$7(this, _UpdatingOpcode2.call(this));

        _this2.target = target;
        _this2.type = 'jump-if-not-modified';
        _this2.tag = tag;
        _this2.lastRevision = tag.value();
        return _this2;
    }

    JumpIfNotModifiedOpcode.prototype.evaluate = function evaluate(vm) {
        var tag = this.tag,
            target = this.target,
            lastRevision = this.lastRevision;

        if (!vm.alwaysRevalidate && tag.validate(lastRevision)) {
            vm.goto(target);
        }
    };

    JumpIfNotModifiedOpcode.prototype.didModify = function didModify() {
        this.lastRevision = this.tag.value();
    };

    JumpIfNotModifiedOpcode.prototype.toJSON = function toJSON() {
        return {
            args: [JSON.stringify(this.target.inspect())],
            guid: this._guid,
            type: this.type
        };
    };

    return JumpIfNotModifiedOpcode;
}(UpdatingOpcode);
var DidModifyOpcode = function (_UpdatingOpcode3) {
    _inherits$7(DidModifyOpcode, _UpdatingOpcode3);

    function DidModifyOpcode(target) {
        _classCallCheck$11(this, DidModifyOpcode);

        var _this3 = _possibleConstructorReturn$7(this, _UpdatingOpcode3.call(this));

        _this3.target = target;
        _this3.type = 'did-modify';
        _this3.tag = CONSTANT_TAG;
        return _this3;
    }

    DidModifyOpcode.prototype.evaluate = function evaluate() {
        this.target.didModify();
    };

    return DidModifyOpcode;
}(UpdatingOpcode);
var LabelOpcode = function () {
    function LabelOpcode(label) {
        _classCallCheck$11(this, LabelOpcode);

        this.tag = CONSTANT_TAG;
        this.type = 'label';
        this.label = null;
        this.prev = null;
        this.next = null;
        initializeGuid(this);
        this.label = label;
    }

    LabelOpcode.prototype.evaluate = function evaluate() {};

    LabelOpcode.prototype.inspect = function inspect$$1() {
        return this.label + ' [' + this._guid + ']';
    };

    LabelOpcode.prototype.toJSON = function toJSON() {
        return {
            args: [JSON.stringify(this.inspect())],
            guid: this._guid,
            type: this.type
        };
    };

    return LabelOpcode;
}();

function _defaults$6(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$10(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$6(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$6(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$6(subClass, superClass);
}

APPEND_OPCODES.add(24 /* Text */, function (vm, _ref) {
    var text = _ref.op1;

    vm.elements().appendText(vm.constants.getString(text));
});
APPEND_OPCODES.add(25 /* Comment */, function (vm, _ref2) {
    var text = _ref2.op1;

    vm.elements().appendComment(vm.constants.getString(text));
});
APPEND_OPCODES.add(27 /* OpenElement */, function (vm, _ref3) {
    var tag = _ref3.op1;

    vm.elements().openElement(vm.constants.getString(tag));
});
APPEND_OPCODES.add(28 /* OpenElementWithOperations */, function (vm, _ref4) {
    var tag = _ref4.op1;

    var tagName = vm.constants.getString(tag);
    vm.elements().openElement(tagName);
});
APPEND_OPCODES.add(29 /* OpenDynamicElement */, function (vm) {
    var tagName = vm.stack.pop().value();
    vm.elements().openElement(tagName);
});
APPEND_OPCODES.add(36 /* PushRemoteElement */, function (vm) {
    var elementRef = vm.stack.pop();
    var nextSiblingRef = vm.stack.pop();
    var element = void 0;
    var nextSibling = void 0;
    if (isConst(elementRef)) {
        element = elementRef.value();
    } else {
        var cache = new ReferenceCache(elementRef);
        element = cache.peek();
        vm.updateWith(new Assert(cache));
    }
    if (isConst(nextSiblingRef)) {
        nextSibling = nextSiblingRef.value();
    } else {
        var _cache = new ReferenceCache(nextSiblingRef);
        nextSibling = _cache.peek();
        vm.updateWith(new Assert(_cache));
    }
    vm.elements().pushRemoteElement(element, nextSibling);
});
APPEND_OPCODES.add(37 /* PopRemoteElement */, function (vm) {
    return vm.elements().popRemoteElement();
});
APPEND_OPCODES.add(33 /* FlushElement */, function (vm) {
    var operations = vm.fetchValue(Register.t0);
    if (operations) {
        operations.flush(vm);
        vm.loadValue(Register.t0, null);
    }
    vm.elements().flushElement();
});
APPEND_OPCODES.add(34 /* CloseElement */, function (vm) {
    return vm.elements().closeElement();
});
APPEND_OPCODES.add(35 /* Modifier */, function (vm, _ref5) {
    var _manager = _ref5.op1;

    var manager = vm.constants.getOther(_manager);
    var stack = vm.stack;
    var args = stack.pop();

    var _vm$elements = vm.elements(),
        element = _vm$elements.constructing,
        updateOperations = _vm$elements.updateOperations;

    var dynamicScope = vm.dynamicScope();
    var modifier = manager.create(element, args, dynamicScope, updateOperations);
    args.clear();
    vm.env.scheduleInstallModifier(modifier, manager);
    var destructor = manager.getDestructor(modifier);
    if (destructor) {
        vm.newDestroyable(destructor);
    }
    var tag = manager.getTag(modifier);
    if (!isConstTag(tag)) {
        vm.updateWith(new UpdateModifierOpcode(tag, manager, modifier));
    }
});
var UpdateModifierOpcode = function (_UpdatingOpcode) {
    _inherits$6(UpdateModifierOpcode, _UpdatingOpcode);

    function UpdateModifierOpcode(tag, manager, modifier) {
        _classCallCheck$10(this, UpdateModifierOpcode);

        var _this = _possibleConstructorReturn$6(this, _UpdatingOpcode.call(this));

        _this.tag = tag;
        _this.manager = manager;
        _this.modifier = modifier;
        _this.type = 'update-modifier';
        _this.lastUpdated = tag.value();
        return _this;
    }

    UpdateModifierOpcode.prototype.evaluate = function evaluate(vm) {
        var manager = this.manager,
            modifier = this.modifier,
            tag = this.tag,
            lastUpdated = this.lastUpdated;

        if (!tag.validate(lastUpdated)) {
            vm.env.scheduleUpdateModifier(modifier, manager);
            this.lastUpdated = tag.value();
        }
    };

    UpdateModifierOpcode.prototype.toJSON = function toJSON() {
        return {
            guid: this._guid,
            type: this.type
        };
    };

    return UpdateModifierOpcode;
}(UpdatingOpcode);
// APPEND_OPCODES.add(Op.ComponentAttr, )
APPEND_OPCODES.add(30 /* StaticAttr */, function (vm, _ref6) {
    var _name = _ref6.op1,
        _value = _ref6.op2,
        _namespace = _ref6.op3;

    var name = vm.constants.getString(_name);
    var value = vm.constants.getString(_value);
    var namespace = _namespace ? vm.constants.getString(_namespace) : null;
    vm.elements().setStaticAttribute(name, value, namespace);
});
APPEND_OPCODES.add(31 /* DynamicAttr */, function (vm, _ref7) {
    var _name = _ref7.op1,
        trusting = _ref7.op2,
        _namespace = _ref7.op3;

    var name = vm.constants.getString(_name);
    var reference = vm.stack.pop();
    var value = reference.value();
    var namespace = _namespace ? vm.constants.getString(_namespace) : null;
    var attribute = vm.elements().setDynamicAttribute(name, value, !!trusting, namespace);
    if (!isConst(reference)) {
        vm.updateWith(new UpdateDynamicAttributeOpcode(reference, attribute));
    }
});
var UpdateDynamicAttributeOpcode = function (_UpdatingOpcode2) {
    _inherits$6(UpdateDynamicAttributeOpcode, _UpdatingOpcode2);

    function UpdateDynamicAttributeOpcode(reference, attribute) {
        _classCallCheck$10(this, UpdateDynamicAttributeOpcode);

        var _this2 = _possibleConstructorReturn$6(this, _UpdatingOpcode2.call(this));

        _this2.reference = reference;
        _this2.attribute = attribute;
        _this2.type = 'patch-element';
        _this2.tag = reference.tag;
        return _this2;
    }

    UpdateDynamicAttributeOpcode.prototype.evaluate = function evaluate(vm) {
        var attribute = this.attribute,
            reference = this.reference;

        attribute.update(reference.value(), vm.env);
    };

    return UpdateDynamicAttributeOpcode;
}(UpdatingOpcode);

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck$12(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Arguments = function () {
    function Arguments() {
        _classCallCheck$12(this, Arguments);

        this.stack = null;
        this.positional = new PositionalArguments();
        this.named = new NamedArguments();
    }

    Arguments.prototype.empty = function empty() {
        this.setup(null, true);
        return this;
    };

    Arguments.prototype.setup = function setup(stack, synthetic) {
        this.stack = stack;
        var names = stack.fromTop(0);
        var namedCount = names.length;
        var positionalCount = stack.fromTop(namedCount + 1);
        var start = positionalCount + namedCount + 2;
        var positional = this.positional;
        positional.setup(stack, start, positionalCount);
        var named = this.named;
        named.setup(stack, namedCount, names, synthetic);
    };

    Arguments.prototype.at = function at(pos) {
        return this.positional.at(pos);
    };

    Arguments.prototype.get = function get(name) {
        return this.named.get(name);
    };

    Arguments.prototype.capture = function capture() {
        return {
            tag: this.tag,
            length: this.length,
            positional: this.positional.capture(),
            named: this.named.capture()
        };
    };

    Arguments.prototype.clear = function clear() {
        var stack = this.stack,
            length = this.length;

        stack.pop(length + 2);
    };

    _createClass(Arguments, [{
        key: 'tag',
        get: function get() {
            return combineTagged([this.positional, this.named]);
        }
    }, {
        key: 'length',
        get: function get() {
            return this.positional.length + this.named.length;
        }
    }]);

    return Arguments;
}();

var PositionalArguments = function () {
    function PositionalArguments() {
        _classCallCheck$12(this, PositionalArguments);

        this.length = 0;
        this.stack = null;
        this.start = 0;
        this._tag = null;
        this._references = null;
    }

    PositionalArguments.prototype.setup = function setup(stack, start, length) {
        this.stack = stack;
        this.start = start;
        this.length = length;
        this._tag = null;
        this._references = null;
    };

    PositionalArguments.prototype.at = function at(position) {
        var start = this.start,
            length = this.length;

        if (position < 0 || position >= length) {
            return UNDEFINED_REFERENCE;
        }
        // stack: pos1, pos2, pos3, named1, named2
        // start: 4 (top - 4)
        //
        // at(0) === pos1 === top - start
        // at(1) === pos2 === top - (start - 1)
        // at(2) === pos3 === top - (start - 2)
        var fromTop = start - position - 1;
        return this.stack.fromTop(fromTop);
    };

    PositionalArguments.prototype.capture = function capture() {
        return new CapturedPositionalArguments(this.tag, this.references);
    };

    _createClass(PositionalArguments, [{
        key: 'tag',
        get: function get() {
            var tag = this._tag;
            if (!tag) {
                tag = this._tag = combineTagged(this.references);
            }
            return tag;
        }
    }, {
        key: 'references',
        get: function get() {
            var references = this._references;
            if (!references) {
                var length = this.length;

                references = this._references = new Array(length);
                for (var i = 0; i < length; i++) {
                    references[i] = this.at(i);
                }
            }
            return references;
        }
    }]);

    return PositionalArguments;
}();

var CapturedPositionalArguments = function () {
    function CapturedPositionalArguments(tag, references) {
        var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : references.length;

        _classCallCheck$12(this, CapturedPositionalArguments);

        this.tag = tag;
        this.references = references;
        this.length = length;
    }

    CapturedPositionalArguments.prototype.at = function at(position) {
        return this.references[position];
    };

    CapturedPositionalArguments.prototype.value = function value() {
        return this.references.map(this.valueOf);
    };

    CapturedPositionalArguments.prototype.get = function get(name) {
        var references = this.references,
            length = this.length;

        if (name === 'length') {
            return PrimitiveReference.create(length);
        } else {
            var idx = parseInt(name, 10);
            if (idx < 0 || idx >= length) {
                return UNDEFINED_REFERENCE;
            } else {
                return references[idx];
            }
        }
    };

    CapturedPositionalArguments.prototype.valueOf = function valueOf(reference) {
        return reference.value();
    };

    return CapturedPositionalArguments;
}();

var NamedArguments = function () {
    function NamedArguments() {
        _classCallCheck$12(this, NamedArguments);

        this.length = 0;
        this._tag = null;
        this._references = null;
        this._names = null;
        this._realNames = EMPTY_ARRAY;
    }

    NamedArguments.prototype.setup = function setup(stack, length, names, synthetic) {
        this.stack = stack;
        this.length = length;
        this._tag = null;
        this._references = null;
        if (synthetic) {
            this._names = names;
            this._realNames = EMPTY_ARRAY;
        } else {
            this._names = null;
            this._realNames = names;
        }
    };

    NamedArguments.prototype.has = function has(name) {
        return this.names.indexOf(name) !== -1;
    };

    NamedArguments.prototype.get = function get(name) {
        var names = this.names,
            length = this.length;

        var idx = names.indexOf(name);
        if (idx === -1) {
            return UNDEFINED_REFERENCE;
        }
        // stack: pos1, pos2, pos3, named1, named2
        // start: 4 (top - 4)
        // namedDict: { named1: 1, named2: 0 };
        //
        // get('named1') === named1 === top - (start - 1)
        // get('named2') === named2 === top - start
        var fromTop = length - idx;
        return this.stack.fromTop(fromTop);
    };

    NamedArguments.prototype.capture = function capture() {
        return new CapturedNamedArguments(this.tag, this.names, this.references);
    };

    NamedArguments.prototype.sliceName = function sliceName(name) {
        return name.slice(1);
    };

    _createClass(NamedArguments, [{
        key: 'tag',
        get: function get() {
            return combineTagged(this.references);
        }
    }, {
        key: 'names',
        get: function get() {
            var names = this._names;
            if (!names) {
                names = this._names = this._realNames.map(this.sliceName);
            }
            return names;
        }
    }, {
        key: 'references',
        get: function get() {
            var references = this._references;
            if (!references) {
                var names = this.names,
                    length = this.length;

                references = this._references = [];
                for (var i = 0; i < length; i++) {
                    references[i] = this.get(names[i]);
                }
            }
            return references;
        }
    }]);

    return NamedArguments;
}();

var CapturedNamedArguments = function () {
    function CapturedNamedArguments(tag, names, references) {
        _classCallCheck$12(this, CapturedNamedArguments);

        this.tag = tag;
        this.names = names;
        this.references = references;
        this.length = names.length;
        this._map = null;
    }

    CapturedNamedArguments.prototype.has = function has(name) {
        return this.names.indexOf(name) !== -1;
    };

    CapturedNamedArguments.prototype.get = function get(name) {
        var names = this.names,
            references = this.references;

        var idx = names.indexOf(name);
        if (idx === -1) {
            return UNDEFINED_REFERENCE;
        } else {
            return references[idx];
        }
    };

    CapturedNamedArguments.prototype.value = function value() {
        var names = this.names,
            references = this.references;

        var out = dict();
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            out[name] = references[i].value();
        }
        return out;
    };

    _createClass(CapturedNamedArguments, [{
        key: 'map',
        get: function get() {
            var map$$1 = this._map;
            if (!map$$1) {
                var names = this.names,
                    references = this.references;

                map$$1 = this._map = dict();
                for (var i = 0; i < names.length; i++) {
                    var name = names[i];
                    map$$1[name] = references[i];
                }
            }
            return map$$1;
        }
    }]);

    return CapturedNamedArguments;
}();

var ARGS = new Arguments();

function _defaults$5(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn$5(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$5(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$5(subClass, superClass);
}

function _classCallCheck$9(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

APPEND_OPCODES.add(56 /* PushComponentManager */, function (vm, _ref) {
    var _definition = _ref.op1;

    var definition = vm.constants.getOther(_definition);
    var stack = vm.stack;
    stack.push({ definition: definition, manager: definition.manager, component: null });
});
APPEND_OPCODES.add(57 /* PushDynamicComponentManager */, function (vm) {
    var stack = vm.stack;
    var reference = stack.pop();
    var cache = isConst(reference) ? undefined : new ReferenceCache(reference);
    var definition = cache ? cache.peek() : reference.value();
    stack.push({ definition: definition, manager: definition.manager, component: null });
    if (cache) {
        vm.updateWith(new Assert(cache));
    }
});
APPEND_OPCODES.add(58 /* PushArgs */, function (vm, _ref2) {
    var synthetic = _ref2.op1;

    var stack = vm.stack;
    ARGS.setup(stack, !!synthetic);
    stack.push(ARGS);
});
APPEND_OPCODES.add(59 /* PrepareArgs */, function (vm, _ref3) {
    var _state = _ref3.op1;

    var stack = vm.stack;

    var _vm$fetchValue = vm.fetchValue(_state),
        definition = _vm$fetchValue.definition,
        manager = _vm$fetchValue.manager;

    var args = stack.pop();
    var preparedArgs = manager.prepareArgs(definition, args);
    if (preparedArgs) {
        args.clear();
        var positional = preparedArgs.positional,
            named = preparedArgs.named;

        var positionalCount = positional.length;
        for (var i = 0; i < positionalCount; i++) {
            stack.push(positional[i]);
        }
        stack.push(positionalCount);
        var names = Object.keys(named);
        var namedCount = names.length;
        var atNames = [];
        for (var _i = 0; _i < namedCount; _i++) {
            var value = named[names[_i]];
            var atName = '@' + names[_i];
            stack.push(value);
            atNames.push(atName);
        }
        stack.push(atNames);
        args.setup(stack, false);
    }
    stack.push(args);
});
APPEND_OPCODES.add(60 /* CreateComponent */, function (vm, _ref4) {
    var _vm$fetchValue2;

    var flags = _ref4.op1,
        _state = _ref4.op2;

    var definition = void 0;
    var manager = void 0;
    var args = vm.stack.pop();
    var dynamicScope = vm.dynamicScope();
    var state = (_vm$fetchValue2 = vm.fetchValue(_state), definition = _vm$fetchValue2.definition, manager = _vm$fetchValue2.manager, _vm$fetchValue2);
    var hasDefaultBlock = flags & 1;
    var component = manager.create(vm.env, definition, args, dynamicScope, vm.getSelf(), !!hasDefaultBlock);
    state.component = component;
    var tag = manager.getTag(component);
    if (!isConstTag(tag)) {
        vm.updateWith(new UpdateComponentOpcode(tag, definition.name, component, manager, dynamicScope));
    }
});
APPEND_OPCODES.add(61 /* RegisterComponentDestructor */, function (vm, _ref5) {
    var _state = _ref5.op1;

    var _vm$fetchValue3 = vm.fetchValue(_state),
        manager = _vm$fetchValue3.manager,
        component = _vm$fetchValue3.component;

    var destructor = manager.getDestructor(component);
    if (destructor) vm.newDestroyable(destructor);
});
APPEND_OPCODES.add(65 /* BeginComponentTransaction */, function (vm) {
    vm.beginCacheGroup();
    vm.elements().pushSimpleBlock();
});
APPEND_OPCODES.add(62 /* PutComponentOperations */, function (vm) {
    vm.loadValue(Register.t0, new ComponentElementOperations());
});
APPEND_OPCODES.add(32 /* ComponentAttr */, function (vm, _ref6) {
    var _name = _ref6.op1,
        trusting = _ref6.op2,
        _namespace = _ref6.op3;

    var name = vm.constants.getString(_name);
    var reference = vm.stack.pop();
    var namespace = _namespace ? vm.constants.getString(_namespace) : null;
    vm.fetchValue(Register.t0).setAttribute(name, reference, !!trusting, namespace);
});
var ComponentElementOperations = function () {
    function ComponentElementOperations() {
        _classCallCheck$9(this, ComponentElementOperations);

        this.attributes = dict();
        this.classes = [];
    }

    ComponentElementOperations.prototype.setAttribute = function setAttribute(name, value, trusting, namespace) {
        var deferred = { value: value, namespace: namespace, trusting: trusting };
        if (name === 'class') {
            this.classes.push(value);
        }
        this.attributes[name] = deferred;
    };

    ComponentElementOperations.prototype.flush = function flush(vm) {
        for (var name in this.attributes) {
            var attr = this.attributes[name];
            var reference = attr.value,
                namespace = attr.namespace,
                trusting = attr.trusting;

            if (name === 'class') {
                reference = new ClassListReference(this.classes);
            }
            var attribute = vm.elements().setDynamicAttribute(name, reference.value(), trusting, namespace);
            if (!isConst(reference)) {
                vm.updateWith(new UpdateDynamicAttributeOpcode(reference, attribute));
            }
        }
    };

    return ComponentElementOperations;
}();

var ClassListReference = function () {
    function ClassListReference(list) {
        _classCallCheck$9(this, ClassListReference);

        this.list = list;
        this.tag = combineTagged(list);
        this.list = list;
    }

    ClassListReference.prototype.value = function value() {
        var ret = [];
        var list = this.list;

        for (var i = 0; i < list.length; i++) {
            var value = normalizeStringValue(list[i].value());
            if (value) ret.push(value);
        }
        return ret.length === 0 ? null : ret.join(' ');
    };

    return ClassListReference;
}();

APPEND_OPCODES.add(67 /* DidCreateElement */, function (vm, _ref7) {
    var _state = _ref7.op1;

    var _vm$fetchValue4 = vm.fetchValue(_state),
        manager = _vm$fetchValue4.manager,
        component = _vm$fetchValue4.component;

    var operations = vm.fetchValue(Register.t0);
    var action = 'DidCreateElementOpcode#evaluate';
    manager.didCreateElement(component, vm.elements().expectConstructing(action), operations);
});
APPEND_OPCODES.add(63 /* GetComponentSelf */, function (vm, _ref8) {
    var _state = _ref8.op1;

    var state = vm.fetchValue(_state);
    vm.stack.push(state.manager.getSelf(state.component));
});
APPEND_OPCODES.add(64 /* GetComponentLayout */, function (vm, _ref9) {
    var _state = _ref9.op1;

    var _vm$fetchValue5 = vm.fetchValue(_state),
        manager = _vm$fetchValue5.manager,
        definition = _vm$fetchValue5.definition,
        component = _vm$fetchValue5.component;

    vm.stack.push(manager.layoutFor(definition, component, vm.env));
});
APPEND_OPCODES.add(68 /* DidRenderLayout */, function (vm, _ref10) {
    var _state = _ref10.op1;

    var _vm$fetchValue6 = vm.fetchValue(_state),
        manager = _vm$fetchValue6.manager,
        component = _vm$fetchValue6.component;

    var bounds = vm.elements().popBlock();
    manager.didRenderLayout(component, bounds);
    vm.env.didCreate(component, manager);
    vm.updateWith(new DidUpdateLayoutOpcode(manager, component, bounds));
});
APPEND_OPCODES.add(66 /* CommitComponentTransaction */, function (vm) {
    return vm.commitCacheGroup();
});
var UpdateComponentOpcode = function (_UpdatingOpcode) {
    _inherits$5(UpdateComponentOpcode, _UpdatingOpcode);

    function UpdateComponentOpcode(tag, name, component, manager, dynamicScope) {
        _classCallCheck$9(this, UpdateComponentOpcode);

        var _this = _possibleConstructorReturn$5(this, _UpdatingOpcode.call(this));

        _this.tag = tag;
        _this.name = name;
        _this.component = component;
        _this.manager = manager;
        _this.dynamicScope = dynamicScope;
        _this.type = 'update-component';
        return _this;
    }

    UpdateComponentOpcode.prototype.evaluate = function evaluate(_vm) {
        var component = this.component,
            manager = this.manager,
            dynamicScope = this.dynamicScope;

        manager.update(component, dynamicScope);
    };

    UpdateComponentOpcode.prototype.toJSON = function toJSON() {
        return {
            args: [JSON.stringify(this.name)],
            guid: this._guid,
            type: this.type
        };
    };

    return UpdateComponentOpcode;
}(UpdatingOpcode);
var DidUpdateLayoutOpcode = function (_UpdatingOpcode2) {
    _inherits$5(DidUpdateLayoutOpcode, _UpdatingOpcode2);

    function DidUpdateLayoutOpcode(manager, component, bounds) {
        _classCallCheck$9(this, DidUpdateLayoutOpcode);

        var _this2 = _possibleConstructorReturn$5(this, _UpdatingOpcode2.call(this));

        _this2.manager = manager;
        _this2.component = component;
        _this2.bounds = bounds;
        _this2.type = 'did-update-layout';
        _this2.tag = CONSTANT_TAG;
        return _this2;
    }

    DidUpdateLayoutOpcode.prototype.evaluate = function evaluate(vm) {
        var manager = this.manager,
            component = this.component,
            bounds = this.bounds;

        manager.didUpdateLayout(component, bounds);
        vm.env.didUpdate(component, manager);
    };

    return DidUpdateLayoutOpcode;
}(UpdatingOpcode);

function _classCallCheck$14(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var COMPONENT_DEFINITION_BRAND = 'COMPONENT DEFINITION [id=e59c754e-61eb-4392-8c4a-2c0ac72bfcd4]';
function isComponentDefinition(obj) {
    return typeof obj === 'object' && obj !== null && obj[COMPONENT_DEFINITION_BRAND];
}
var ComponentDefinition = function ComponentDefinition(name, manager, ComponentClass) {
    _classCallCheck$14(this, ComponentDefinition);

    this[COMPONENT_DEFINITION_BRAND] = true;
    this.name = name;
    this.manager = manager;
    this.ComponentClass = ComponentClass;
};

function _defaults$8(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$13(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$8(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$8(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$8(subClass, superClass);
}

var IsComponentDefinitionReference = function (_ConditionalReference) {
    _inherits$8(IsComponentDefinitionReference, _ConditionalReference);

    function IsComponentDefinitionReference() {
        _classCallCheck$13(this, IsComponentDefinitionReference);

        return _possibleConstructorReturn$8(this, _ConditionalReference.apply(this, arguments));
    }

    IsComponentDefinitionReference.create = function create(inner) {
        return new IsComponentDefinitionReference(inner);
    };

    IsComponentDefinitionReference.prototype.toBool = function toBool(value) {
        return isComponentDefinition(value);
    };

    return IsComponentDefinitionReference;
}(ConditionalReference);
APPEND_OPCODES.add(26 /* DynamicContent */, function (vm, _ref) {
    var isTrusting = _ref.op1;

    var reference = vm.stack.pop();
    var value = reference.value();
    var content = void 0;
    if (isTrusting) {
        content = vm.elements().appendTrustingDynamicContent(value);
    } else {
        content = vm.elements().appendCautiousDynamicContent(value);
    }
    if (!isConst(reference)) {
        vm.updateWith(new UpdateDynamicContentOpcode(reference, content));
    }
});

var UpdateDynamicContentOpcode = function (_UpdatingOpcode) {
    _inherits$8(UpdateDynamicContentOpcode, _UpdatingOpcode);

    function UpdateDynamicContentOpcode(reference, content) {
        _classCallCheck$13(this, UpdateDynamicContentOpcode);

        var _this2 = _possibleConstructorReturn$8(this, _UpdatingOpcode.call(this));

        _this2.reference = reference;
        _this2.content = content;
        _this2.tag = reference.tag;
        return _this2;
    }

    UpdateDynamicContentOpcode.prototype.evaluate = function evaluate(vm) {
        var content = this.content,
            reference = this.reference;

        content.update(vm.env, reference.value());
    };

    return UpdateDynamicContentOpcode;
}(UpdatingOpcode);

function _classCallCheck$15(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/* tslint:disable */
function debugCallback(context, get) {
    console.info('Use `context`, and `get(<path>)` to debug this template.');
    // for example...
    context === get('this');
    debugger;
}
/* tslint:enable */
var callback = debugCallback;
// For testing purposes



var ScopeInspector = function () {
    function ScopeInspector(scope, symbols, evalInfo) {
        _classCallCheck$15(this, ScopeInspector);

        this.scope = scope;
        this.locals = dict();
        for (var i = 0; i < evalInfo.length; i++) {
            var slot = evalInfo[i];
            var name = symbols[slot - 1];
            var ref = scope.getSymbol(slot);
            this.locals[name] = ref;
        }
    }

    ScopeInspector.prototype.get = function get(path) {
        var scope = this.scope,
            locals = this.locals;

        var parts = path.split('.');

        var _path$split = path.split('.'),
            head = _path$split[0],
            tail = _path$split.slice(1);

        var evalScope = scope.getEvalScope();
        var ref = void 0;
        if (head === 'this') {
            ref = scope.getSelf();
        } else if (locals[head]) {
            ref = locals[head];
        } else if (head.indexOf('@') === 0 && evalScope[head]) {
            ref = evalScope[head];
        } else {
            ref = this.scope.getSelf();
            tail = parts;
        }
        return tail.reduce(function (r, part) {
            return r.get(part);
        }, ref);
    };

    return ScopeInspector;
}();

APPEND_OPCODES.add(71 /* Debugger */, function (vm, _ref) {
    var _symbols = _ref.op1,
        _evalInfo = _ref.op2;

    var symbols = vm.constants.getOther(_symbols);
    var evalInfo = vm.constants.getArray(_evalInfo);
    var inspector = new ScopeInspector(vm.scope(), symbols, evalInfo);
    callback(vm.getSelf().value(), function (path) {
        return inspector.get(path).value();
    });
});

APPEND_OPCODES.add(69 /* GetPartialTemplate */, function (vm) {
    var stack = vm.stack;
    var definition = stack.pop();
    stack.push(definition.value().template.asPartial());
});

function _classCallCheck$16(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var IterablePresenceReference = function () {
    function IterablePresenceReference(artifacts) {
        _classCallCheck$16(this, IterablePresenceReference);

        this.tag = artifacts.tag;
        this.artifacts = artifacts;
    }

    IterablePresenceReference.prototype.value = function value() {
        return !this.artifacts.isEmpty();
    };

    return IterablePresenceReference;
}();

APPEND_OPCODES.add(54 /* PutIterator */, function (vm) {
    var stack = vm.stack;
    var listRef = stack.pop();
    var key = stack.pop();
    var iterable = vm.env.iterableFor(listRef, key.value());
    var iterator = new ReferenceIterator(iterable);
    stack.push(iterator);
    stack.push(new IterablePresenceReference(iterator.artifacts));
});
APPEND_OPCODES.add(52 /* EnterList */, function (vm, _ref) {
    var relativeStart = _ref.op1;

    vm.enterList(relativeStart);
});
APPEND_OPCODES.add(53 /* ExitList */, function (vm) {
    return vm.exitList();
});
APPEND_OPCODES.add(55 /* Iterate */, function (vm, _ref2) {
    var breaks = _ref2.op1;

    var stack = vm.stack;
    var item = stack.peek().next();
    if (item) {
        var tryOpcode = vm.iterate(item.memo, item.value);
        vm.enterItem(item.key, tryOpcode);
    } else {
        vm.goto(breaks);
    }
});

function _classCallCheck$19(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Cursor = function Cursor(element, nextSibling) {
    _classCallCheck$19(this, Cursor);

    this.element = element;
    this.nextSibling = nextSibling;
};
function currentNode(cursor) {
    var element = cursor.element,
        nextSibling = cursor.nextSibling;

    if (nextSibling === null) {
        return element.lastChild;
    } else {
        return nextSibling.previousSibling;
    }
}

var ConcreteBounds = function () {
    function ConcreteBounds(parentNode, first, last) {
        _classCallCheck$19(this, ConcreteBounds);

        this.parentNode = parentNode;
        this.first = first;
        this.last = last;
    }

    ConcreteBounds.prototype.parentElement = function parentElement() {
        return this.parentNode;
    };

    ConcreteBounds.prototype.firstNode = function firstNode() {
        return this.first;
    };

    ConcreteBounds.prototype.lastNode = function lastNode() {
        return this.last;
    };

    return ConcreteBounds;
}();
var SingleNodeBounds = function () {
    function SingleNodeBounds(parentNode, node) {
        _classCallCheck$19(this, SingleNodeBounds);

        this.parentNode = parentNode;
        this.node = node;
    }

    SingleNodeBounds.prototype.parentElement = function parentElement() {
        return this.parentNode;
    };

    SingleNodeBounds.prototype.firstNode = function firstNode() {
        return this.node;
    };

    SingleNodeBounds.prototype.lastNode = function lastNode() {
        return this.node;
    };

    return SingleNodeBounds;
}();
function bounds(parent, first, last) {
    return new ConcreteBounds(parent, first, last);
}
function single(parent, node) {
    return new SingleNodeBounds(parent, node);
}
function move(bounds, reference) {
    var parent = bounds.parentElement();
    var first = bounds.firstNode();
    var last = bounds.lastNode();
    var node = first;
    while (node) {
        var next = node.nextSibling;
        parent.insertBefore(node, reference);
        if (node === last) return next;
        node = next;
    }
    return null;
}
function clear(bounds) {
    var parent = bounds.parentElement();
    var first = bounds.firstNode();
    var last = bounds.lastNode();
    var node = first;
    while (node) {
        var next = node.nextSibling;
        parent.removeChild(node);
        if (node === last) return next;
        node = next;
    }
    return null;
}

function _classCallCheck$20(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var DynamicContentBase = function () {
    function DynamicContentBase(trusting) {
        _classCallCheck$20(this, DynamicContentBase);

        this.trusting = trusting;
    }

    DynamicContentBase.prototype.retry = function retry(env, value) {
        var bounds$$1 = this.bounds;

        var parentElement = bounds$$1.parentElement();
        var nextSibling = clear(bounds$$1);
        var stack = NewElementBuilder.forInitialRender(env, parentElement, nextSibling);
        if (this.trusting) {
            return stack.__appendTrustingDynamicContent(value);
        } else {
            return stack.__appendCautiousDynamicContent(value);
        }
    };

    return DynamicContentBase;
}();

var DynamicContentWrapper = function () {
    function DynamicContentWrapper(inner) {
        _classCallCheck$20(this, DynamicContentWrapper);

        this.inner = inner;
        this.bounds = inner.bounds;
    }

    DynamicContentWrapper.prototype.parentElement = function parentElement() {
        return this.bounds.parentElement();
    };

    DynamicContentWrapper.prototype.firstNode = function firstNode() {
        return this.bounds.firstNode();
    };

    DynamicContentWrapper.prototype.lastNode = function lastNode() {
        return this.bounds.lastNode();
    };

    DynamicContentWrapper.prototype.update = function update(env, value) {
        var inner = this.inner = this.inner.update(env, value);
        this.bounds = inner.bounds;
        return this;
    };

    return DynamicContentWrapper;
}();

function _defaults$10(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$21(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$10(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$10(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$10(subClass, superClass);
}

var DynamicTextContent = function (_DynamicContentBase) {
    _inherits$10(DynamicTextContent, _DynamicContentBase);

    function DynamicTextContent(bounds, lastValue, trusted) {
        _classCallCheck$21(this, DynamicTextContent);

        var _this = _possibleConstructorReturn$10(this, _DynamicContentBase.call(this, trusted));

        _this.bounds = bounds;
        _this.lastValue = lastValue;
        return _this;
    }

    DynamicTextContent.prototype.update = function update(env, value) {
        var lastValue = this.lastValue;

        if (value === lastValue) return this;
        if (isNode(value) || isSafeString(value)) return this.retry(env, value);
        var normalized = void 0;
        if (isEmpty(value)) {
            normalized = '';
        } else if (isString(value)) {
            normalized = value;
        } else {
            normalized = String(value);
        }
        if (normalized !== lastValue) {
            var textNode = this.bounds.firstNode();
            textNode.nodeValue = this.lastValue = normalized;
        }
        return this;
    };

    return DynamicTextContent;
}(DynamicContentBase);

function _defaults$11(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$22(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$11(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$11(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$11(subClass, superClass);
}

var DynamicNodeContent = function (_DynamicContentBase) {
    _inherits$11(DynamicNodeContent, _DynamicContentBase);

    function DynamicNodeContent(bounds, lastValue, trusting) {
        _classCallCheck$22(this, DynamicNodeContent);

        var _this = _possibleConstructorReturn$11(this, _DynamicContentBase.call(this, trusting));

        _this.bounds = bounds;
        _this.lastValue = lastValue;
        return _this;
    }

    DynamicNodeContent.prototype.update = function update(env, value) {
        var lastValue = this.lastValue;

        if (value === lastValue) return this;
        return this.retry(env, value);
    };

    return DynamicNodeContent;
}(DynamicContentBase);

function _defaults$12(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$23(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$12(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$12(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$12(subClass, superClass);
}

var DynamicHTMLContent = function (_DynamicContentBase) {
    _inherits$12(DynamicHTMLContent, _DynamicContentBase);

    function DynamicHTMLContent(bounds, lastValue, trusted) {
        _classCallCheck$23(this, DynamicHTMLContent);

        var _this = _possibleConstructorReturn$12(this, _DynamicContentBase.call(this, trusted));

        _this.bounds = bounds;
        _this.lastValue = lastValue;
        return _this;
    }

    DynamicHTMLContent.prototype.update = function update(env, value) {
        var lastValue = this.lastValue;

        if (value === lastValue) return this;
        if (isSafeString(value) && value.toHTML() === lastValue.toHTML()) {
            this.lastValue = value;
            return this;
        }
        return this.retry(env, value);
    };

    return DynamicHTMLContent;
}(DynamicContentBase);

var DynamicTrustedHTMLContent = function (_DynamicContentBase2) {
    _inherits$12(DynamicTrustedHTMLContent, _DynamicContentBase2);

    function DynamicTrustedHTMLContent(bounds, lastValue, trusted) {
        _classCallCheck$23(this, DynamicTrustedHTMLContent);

        var _this2 = _possibleConstructorReturn$12(this, _DynamicContentBase2.call(this, trusted));

        _this2.bounds = bounds;
        _this2.lastValue = lastValue;
        return _this2;
    }

    DynamicTrustedHTMLContent.prototype.update = function update(env, value) {
        var lastValue = this.lastValue;

        if (value === lastValue) return this;
        var newValue = normalizeTrustedValue(value);
        if (newValue === lastValue) return this;
        return this.retry(env, value);
    };

    return DynamicTrustedHTMLContent;
}(DynamicContentBase);

var _createClass$1 = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _defaults$9(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn$9(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$9(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$9(subClass, superClass);
}

function _classCallCheck$18(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var First = function () {
    function First(node) {
        _classCallCheck$18(this, First);

        this.node = node;
    }

    First.prototype.firstNode = function firstNode() {
        return this.node;
    };

    return First;
}();

var Last = function () {
    function Last(node) {
        _classCallCheck$18(this, Last);

        this.node = node;
    }

    Last.prototype.lastNode = function lastNode() {
        return this.node;
    };

    return Last;
}();


var NewElementBuilder = function () {
    function NewElementBuilder(env, parentNode, nextSibling) {
        _classCallCheck$18(this, NewElementBuilder);

        this.constructing = null;
        this.operations = null;
        this.cursorStack = new Stack();
        this.blockStack = new Stack();
        this.cursorStack.push(new Cursor(parentNode, nextSibling));
        this.env = env;
        this.dom = env.getAppendOperations();
        this.updateOperations = env.getDOM();
    }

    NewElementBuilder.forInitialRender = function forInitialRender(env, parentNode, nextSibling) {
        var builder = new this(env, parentNode, nextSibling);
        builder.pushSimpleBlock();
        return builder;
    };

    NewElementBuilder.resume = function resume(env, tracker, nextSibling) {
        var parentNode = tracker.parentElement();
        var stack = new this(env, parentNode, nextSibling);
        stack.pushSimpleBlock();
        stack.pushBlockTracker(tracker);
        return stack;
    };

    NewElementBuilder.prototype.expectConstructing = function expectConstructing(method) {
        return this.constructing;
    };

    NewElementBuilder.prototype.expectOperations = function expectOperations(method) {
        return this.operations;
    };

    NewElementBuilder.prototype.block = function block() {
        return this.blockStack.current;
    };

    NewElementBuilder.prototype.popElement = function popElement() {
        this.cursorStack.pop();
        this.cursorStack.current;
    };

    NewElementBuilder.prototype.pushSimpleBlock = function pushSimpleBlock() {
        return this.pushBlockTracker(new SimpleBlockTracker(this.element));
    };

    NewElementBuilder.prototype.pushUpdatableBlock = function pushUpdatableBlock() {
        return this.pushBlockTracker(new UpdatableBlockTracker(this.element));
    };

    NewElementBuilder.prototype.pushBlockList = function pushBlockList(list) {
        return this.pushBlockTracker(new BlockListTracker(this.element, list));
    };

    NewElementBuilder.prototype.pushBlockTracker = function pushBlockTracker(tracker) {
        var isRemote = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var current = this.blockStack.current;
        if (current !== null) {
            current.newDestroyable(tracker);
            if (!isRemote) {
                current.didAppendBounds(tracker);
            }
        }
        this.__openBlock();
        this.blockStack.push(tracker);
        return tracker;
    };

    NewElementBuilder.prototype.popBlock = function popBlock() {
        this.block().finalize(this);
        this.__closeBlock();
        return this.blockStack.pop();
    };

    NewElementBuilder.prototype.__openBlock = function __openBlock() {};

    NewElementBuilder.prototype.__closeBlock = function __closeBlock() {};

    NewElementBuilder.prototype.openElement = function openElement(tag) {
        var element = this.__openElement(tag);
        this.constructing = element;
        return element;
    };

    NewElementBuilder.prototype.__openElement = function __openElement(tag) {
        return this.dom.createElement(tag, this.element);
    };

    NewElementBuilder.prototype.flushElement = function flushElement() {
        var parent = this.element;
        var element = this.constructing;
        this.__flushElement(parent, element);
        this.constructing = null;
        this.operations = null;
        this.pushElement(element, null);
        this.didOpenElement(element);
    };

    NewElementBuilder.prototype.__flushElement = function __flushElement(parent, constructing) {
        this.dom.insertBefore(parent, constructing, this.nextSibling);
    };

    NewElementBuilder.prototype.closeElement = function closeElement() {
        this.willCloseElement();
        this.popElement();
    };

    NewElementBuilder.prototype.pushRemoteElement = function pushRemoteElement(element) {
        var nextSibling = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        this.pushElement(element, nextSibling);
        var tracker = new RemoteBlockTracker(element);
        this.pushBlockTracker(tracker, true);
    };

    NewElementBuilder.prototype.popRemoteElement = function popRemoteElement() {
        this.popBlock();
        this.popElement();
    };

    NewElementBuilder.prototype.pushElement = function pushElement(element, nextSibling) {
        this.cursorStack.push(new Cursor(element, nextSibling));
    };

    NewElementBuilder.prototype.didAddDestroyable = function didAddDestroyable(d) {
        this.block().newDestroyable(d);
    };

    NewElementBuilder.prototype.didAppendBounds = function didAppendBounds(bounds$$1) {
        this.block().didAppendBounds(bounds$$1);
        return bounds$$1;
    };

    NewElementBuilder.prototype.didAppendNode = function didAppendNode(node) {
        this.block().didAppendNode(node);
        return node;
    };

    NewElementBuilder.prototype.didOpenElement = function didOpenElement(element) {
        this.block().openElement(element);
        return element;
    };

    NewElementBuilder.prototype.willCloseElement = function willCloseElement() {
        this.block().closeElement();
    };

    NewElementBuilder.prototype.appendText = function appendText(string) {
        return this.didAppendNode(this.__appendText(string));
    };

    NewElementBuilder.prototype.__appendText = function __appendText(text) {
        var dom = this.dom,
            element = this.element,
            nextSibling = this.nextSibling;

        var node = dom.createTextNode(text);
        dom.insertBefore(element, node, nextSibling);
        return node;
    };

    NewElementBuilder.prototype.appendNode = function appendNode(node) {
        return this.didAppendNode(this.__appendNode(node));
    };

    NewElementBuilder.prototype.__appendNode = function __appendNode(node) {
        this.dom.insertBefore(this.element, node, this.nextSibling);
        return node;
    };

    NewElementBuilder.prototype.appendFragment = function appendFragment(fragment) {
        return this.didAppendBounds(this.__appendFragment(fragment));
    };

    NewElementBuilder.prototype.__appendFragment = function __appendFragment(fragment) {
        var first = fragment.firstChild;
        if (first) {
            var ret = bounds(this.element, first, fragment.lastChild);
            this.dom.insertBefore(this.element, fragment, this.nextSibling);
            return ret;
        } else {
            return single(this.element, this.__appendComment(''));
        }
    };

    NewElementBuilder.prototype.appendHTML = function appendHTML(html) {
        return this.didAppendBounds(this.__appendHTML(html));
    };

    NewElementBuilder.prototype.__appendHTML = function __appendHTML(html) {
        return this.dom.insertHTMLBefore(this.element, this.nextSibling, html);
    };

    NewElementBuilder.prototype.appendTrustingDynamicContent = function appendTrustingDynamicContent(value) {
        var wrapper = new DynamicContentWrapper(this.__appendTrustingDynamicContent(value));
        this.didAppendBounds(wrapper);
        return wrapper;
    };

    NewElementBuilder.prototype.__appendTrustingDynamicContent = function __appendTrustingDynamicContent(value) {
        if (isFragment(value)) {
            var _bounds2 = this.__appendFragment(value);
            return new DynamicNodeContent(_bounds2, value, true);
        } else if (isNode(value)) {
            var node = this.__appendNode(value);
            return new DynamicNodeContent(single(this.element, node), node, true);
        } else {
            var normalized = void 0;
            if (isEmpty(value)) {
                normalized = '';
            } else if (isSafeString(value)) {
                normalized = value.toHTML();
            } else if (isString(value)) {
                normalized = value;
            } else {
                normalized = String(value);
            }
            var _bounds3 = this.__appendHTML(normalized);
            return new DynamicTrustedHTMLContent(_bounds3, normalized, true);
        }
    };

    NewElementBuilder.prototype.appendCautiousDynamicContent = function appendCautiousDynamicContent(value) {
        var wrapper = new DynamicContentWrapper(this.__appendCautiousDynamicContent(value));
        this.didAppendBounds(wrapper.bounds);
        return wrapper;
    };

    NewElementBuilder.prototype.__appendCautiousDynamicContent = function __appendCautiousDynamicContent(value) {
        if (isFragment(value)) {
            var _bounds4 = this.__appendFragment(value);
            return new DynamicNodeContent(_bounds4, value, false);
        } else if (isNode(value)) {
            var node = this.__appendNode(value);
            return new DynamicNodeContent(single(this.element, node), node, false);
        } else if (isSafeString(value)) {
            var normalized = value.toHTML();
            var _bounds5 = this.__appendHTML(normalized);
            // let bounds = this.dom.insertHTMLBefore(this.element, this.nextSibling, normalized);
            return new DynamicHTMLContent(_bounds5, value, false);
        } else {
            var _normalized = void 0;
            if (isEmpty(value)) {
                _normalized = '';
            } else if (isString(value)) {
                _normalized = value;
            } else {
                _normalized = String(value);
            }
            var textNode = this.__appendText(_normalized);
            var _bounds6 = single(this.element, textNode);
            return new DynamicTextContent(_bounds6, _normalized, false);
        }
    };

    NewElementBuilder.prototype.appendComment = function appendComment(string) {
        return this.didAppendNode(this.__appendComment(string));
    };

    NewElementBuilder.prototype.__appendComment = function __appendComment(string) {
        var dom = this.dom,
            element = this.element,
            nextSibling = this.nextSibling;

        var node = dom.createComment(string);
        dom.insertBefore(element, node, nextSibling);
        return node;
    };

    NewElementBuilder.prototype.__setAttribute = function __setAttribute(name, value, namespace) {
        this.dom.setAttribute(this.constructing, name, value, namespace);
    };

    NewElementBuilder.prototype.__setProperty = function __setProperty(name, value) {
        this.constructing[name] = value;
    };

    NewElementBuilder.prototype.setStaticAttribute = function setStaticAttribute(name, value, namespace) {
        this.__setAttribute(name, value, namespace);
    };

    NewElementBuilder.prototype.setDynamicAttribute = function setDynamicAttribute(name, value, trusting, namespace) {
        var element = this.constructing;
        var DynamicAttribute = this.env.attributeFor(element, name, trusting, namespace);
        var attribute = new DynamicAttribute({ element: element, name: name, namespace: namespace || null });
        attribute.set(this, value, this.env);
        return attribute;
    };

    _createClass$1(NewElementBuilder, [{
        key: 'element',
        get: function get() {
            return this.cursorStack.current.element;
        }
    }, {
        key: 'nextSibling',
        get: function get() {
            return this.cursorStack.current.nextSibling;
        }
    }]);

    return NewElementBuilder;
}();
var SimpleBlockTracker = function () {
    function SimpleBlockTracker(parent) {
        _classCallCheck$18(this, SimpleBlockTracker);

        this.parent = parent;
        this.first = null;
        this.last = null;
        this.destroyables = null;
        this.nesting = 0;
    }

    SimpleBlockTracker.prototype.destroy = function destroy() {
        var destroyables = this.destroyables;

        if (destroyables && destroyables.length) {
            for (var i = 0; i < destroyables.length; i++) {
                destroyables[i].destroy();
            }
        }
    };

    SimpleBlockTracker.prototype.parentElement = function parentElement() {
        return this.parent;
    };

    SimpleBlockTracker.prototype.firstNode = function firstNode() {
        return this.first && this.first.firstNode();
    };

    SimpleBlockTracker.prototype.lastNode = function lastNode() {
        return this.last && this.last.lastNode();
    };

    SimpleBlockTracker.prototype.openElement = function openElement(element) {
        this.didAppendNode(element);
        this.nesting++;
    };

    SimpleBlockTracker.prototype.closeElement = function closeElement() {
        this.nesting--;
    };

    SimpleBlockTracker.prototype.didAppendNode = function didAppendNode(node) {
        if (this.nesting !== 0) return;
        if (!this.first) {
            this.first = new First(node);
        }
        this.last = new Last(node);
    };

    SimpleBlockTracker.prototype.didAppendBounds = function didAppendBounds(bounds$$1) {
        if (this.nesting !== 0) return;
        if (!this.first) {
            this.first = bounds$$1;
        }
        this.last = bounds$$1;
    };

    SimpleBlockTracker.prototype.newDestroyable = function newDestroyable(d) {
        this.destroyables = this.destroyables || [];
        this.destroyables.push(d);
    };

    SimpleBlockTracker.prototype.finalize = function finalize(stack) {
        if (!this.first) {
            stack.appendComment('');
        }
    };

    return SimpleBlockTracker;
}();

var RemoteBlockTracker = function (_SimpleBlockTracker) {
    _inherits$9(RemoteBlockTracker, _SimpleBlockTracker);

    function RemoteBlockTracker() {
        _classCallCheck$18(this, RemoteBlockTracker);

        return _possibleConstructorReturn$9(this, _SimpleBlockTracker.apply(this, arguments));
    }

    RemoteBlockTracker.prototype.destroy = function destroy() {
        _SimpleBlockTracker.prototype.destroy.call(this);
        clear(this);
    };

    return RemoteBlockTracker;
}(SimpleBlockTracker);

var UpdatableBlockTracker = function (_SimpleBlockTracker2) {
    _inherits$9(UpdatableBlockTracker, _SimpleBlockTracker2);

    function UpdatableBlockTracker() {
        _classCallCheck$18(this, UpdatableBlockTracker);

        return _possibleConstructorReturn$9(this, _SimpleBlockTracker2.apply(this, arguments));
    }

    UpdatableBlockTracker.prototype.reset = function reset(env) {
        var destroyables = this.destroyables;

        if (destroyables && destroyables.length) {
            for (var i = 0; i < destroyables.length; i++) {
                env.didDestroy(destroyables[i]);
            }
        }
        var nextSibling = clear(this);
        this.first = null;
        this.last = null;
        this.destroyables = null;
        this.nesting = 0;
        return nextSibling;
    };

    return UpdatableBlockTracker;
}(SimpleBlockTracker);

var BlockListTracker = function () {
    function BlockListTracker(parent, boundList) {
        _classCallCheck$18(this, BlockListTracker);

        this.parent = parent;
        this.boundList = boundList;
        this.parent = parent;
        this.boundList = boundList;
    }

    BlockListTracker.prototype.destroy = function destroy() {
        this.boundList.forEachNode(function (node) {
            return node.destroy();
        });
    };

    BlockListTracker.prototype.parentElement = function parentElement() {
        return this.parent;
    };

    BlockListTracker.prototype.firstNode = function firstNode() {
        var head = this.boundList.head();
        return head && head.firstNode();
    };

    BlockListTracker.prototype.lastNode = function lastNode() {
        var tail = this.boundList.tail();
        return tail && tail.lastNode();
    };

    BlockListTracker.prototype.openElement = function openElement(_element) {
        debugAssert(false, 'Cannot openElement directly inside a block list');
    };

    BlockListTracker.prototype.closeElement = function closeElement() {
        debugAssert(false, 'Cannot closeElement directly inside a block list');
    };

    BlockListTracker.prototype.didAppendNode = function didAppendNode(_node) {
        debugAssert(false, 'Cannot create a new node directly inside a block list');
    };

    BlockListTracker.prototype.didAppendBounds = function didAppendBounds(_bounds) {};

    BlockListTracker.prototype.newDestroyable = function newDestroyable(_d) {};

    BlockListTracker.prototype.finalize = function finalize(_stack) {};

    return BlockListTracker;
}();

var _createClass$2 = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _defaults$13(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$24(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$13(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$13(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$13(subClass, superClass);
}

var RehydrateBuilder = function (_NewElementBuilder) {
    _inherits$13(RehydrateBuilder, _NewElementBuilder);

    function RehydrateBuilder(env, parentNode, nextSibling) {
        _classCallCheck$24(this, RehydrateBuilder);

        // The last node that matched
        var _this = _possibleConstructorReturn$13(this, _NewElementBuilder.call(this, env, parentNode, nextSibling));

        _this.lastMatchedNode = null;
        _this.unmatchedAttributes = null;
        _this.blockDepth = 0;
        if (nextSibling) throw new Error("Rehydration with nextSibling not supported");
        _this._candidate = parentNode.firstChild;
        return _this;
    }

    RehydrateBuilder.prototype.clearMismatch = function clearMismatch(candidate) {
        if (isComment(candidate)) {
            var depth = getOpenBoundsDepth(candidate);
            if (depth !== null) {
                this.clearBlock(depth);
                return;
            }
        }
        var current = candidate;
        var until = this.nextSibling;
        while (current && current !== until) {
            current = remove(current);
        }
        this._candidate = null;
    };

    RehydrateBuilder.prototype.clearBlock = function clearBlock(depth) {
        var current = this._candidate;
        while (current && !(isComment(current) && getCloseBoundsDepth(current) === depth)) {
            current = remove(current);
        }
        debugAssert(current && isComment(current) && getCloseBoundsDepth(current) === depth, 'An opening block should be paired with a closing block comment');
        this._candidate = remove(current);
    };

    RehydrateBuilder.prototype.__openBlock = function __openBlock() {
        var candidate = this.candidate;

        if (candidate) {
            if (isComment(candidate)) {
                var depth = getOpenBoundsDepth(candidate);
                if (depth !== null) this.blockDepth = depth;
                this._candidate = remove(candidate);
                return;
            } else {
                this.clearMismatch(candidate);
            }
        }
    };

    RehydrateBuilder.prototype.__closeBlock = function __closeBlock() {
        var candidate = this._candidate;

        if (candidate) {
            if (isComment(candidate)) {
                var depth = getCloseBoundsDepth(candidate);
                if (depth !== null) this.blockDepth = depth - 1;
                this._candidate = remove(candidate);
                return;
            } else {
                this.clearMismatch(candidate);
            }
        }
    };

    RehydrateBuilder.prototype.__appendNode = function __appendNode(node) {
        var candidate = this.candidate;
        // This code path is only used when inserting precisely one node. It needs more
        // comparison logic, but we can probably lean on the cases where this code path
        // is actually used.

        if (candidate) {
            return candidate;
        } else {
            return _NewElementBuilder.prototype.__appendNode.call(this, node);
        }
    };

    RehydrateBuilder.prototype.__appendHTML = function __appendHTML(html) {
        var candidateBounds = this.markerBounds();
        if (candidateBounds) {
            var first = candidateBounds.firstNode();
            var last = candidateBounds.lastNode();
            var newBounds = bounds(this.element, first.nextSibling, last.previousSibling);
            remove(first);
            remove(last);
            return newBounds;
        } else {
            return _NewElementBuilder.prototype.__appendHTML.call(this, html);
        }
    };

    RehydrateBuilder.prototype.markerBounds = function markerBounds() {
        var _candidate = this._candidate;

        if (_candidate && isMarker(_candidate)) {
            var first = _candidate;
            var last = first.nextSibling;
            while (last && !isMarker(last)) {
                last = last.nextSibling;
            }
            return bounds(this.element, first, last);
        } else {
            return null;
        }
    };

    RehydrateBuilder.prototype.__appendText = function __appendText(string) {
        var candidate = this.candidate;

        if (candidate) {
            if (isEmpty$1(candidate)) {
                var next = this._candidate = remove(candidate);
                var text = this.dom.createTextNode(string);
                this.dom.insertBefore(this.element, text, next);
                return text;
            }
            if (isTextNode(candidate)) {
                candidate.nodeValue = string;
                this.lastMatchedNode = candidate;
                this._candidate = candidate.nextSibling;
                return candidate;
            } else if (candidate && (isSeparator(candidate) || isEmpty$1(candidate))) {
                this._candidate = candidate.nextSibling;
                remove(candidate);
                return this.__appendText(string);
            } else {
                this.clearMismatch(candidate);
                return _NewElementBuilder.prototype.__appendText.call(this, string);
            }
        } else {
            return _NewElementBuilder.prototype.__appendText.call(this, string);
        }
    };

    RehydrateBuilder.prototype.__appendComment = function __appendComment(string) {
        var _candidate = this._candidate;

        if (_candidate && isComment(_candidate)) {
            _candidate.nodeValue = string;
            this.lastMatchedNode = _candidate;
            this._candidate = _candidate.nextSibling;
            return _candidate;
        } else if (_candidate) {
            this.clearMismatch(_candidate);
        }
        return _NewElementBuilder.prototype.__appendComment.call(this, string);
    };

    RehydrateBuilder.prototype.__openElement = function __openElement(tag, _operations) {
        var _candidate = this._candidate;

        if (_candidate && isElement(_candidate) && _candidate.tagName === tag.toUpperCase()) {
            this.unmatchedAttributes = [].slice.call(_candidate.attributes);
            this._candidate = _candidate.firstChild;
            return _candidate;
        } else if (_candidate) {
            this.clearMismatch(_candidate);
        }
        return _NewElementBuilder.prototype.__openElement.call(this, tag);
    };

    RehydrateBuilder.prototype.__setAttribute = function __setAttribute(name, value, namespace) {
        var unmatched = this.unmatchedAttributes;
        if (unmatched) {
            var attr = findByName(unmatched, name);
            if (attr) {
                attr.value = value;
                unmatched.splice(unmatched.indexOf(attr), 1);
                return;
            }
        }
        return _NewElementBuilder.prototype.__setAttribute.call(this, name, value, namespace);
    };

    RehydrateBuilder.prototype.__setProperty = function __setProperty(name, value) {
        var unmatched = this.unmatchedAttributes;
        if (unmatched) {
            var attr = findByName(unmatched, name);
            if (attr) {
                attr.value = value;
                unmatched.splice(unmatched.indexOf(attr), 1);
                return;
            }
        }
        return _NewElementBuilder.prototype.__setProperty.call(this, name, value);
    };

    RehydrateBuilder.prototype.__flushElement = function __flushElement(parent, constructing) {
        var unmatched = this.unmatchedAttributes;

        if (unmatched) {
            for (var i = 0; i < unmatched.length; i++) {
                this.constructing.removeAttribute(unmatched[i].name);
            }
            this.unmatchedAttributes = null;
        } else {
            _NewElementBuilder.prototype.__flushElement.call(this, parent, constructing);
        }
    };

    RehydrateBuilder.prototype.appendCautiousDynamicContent = function appendCautiousDynamicContent(value) {
        var content = _NewElementBuilder.prototype.appendCautiousDynamicContent.call(this, value);
        content.update(this.env, value);
        return content;
    };

    RehydrateBuilder.prototype.willCloseElement = function willCloseElement() {
        var candidate = this.candidate;

        if (candidate) {
            this.clearMismatch(candidate);
        }
        this._candidate = this.element.nextSibling;
        this.lastMatchedNode = this.element;
        _NewElementBuilder.prototype.willCloseElement.call(this);
    };

    RehydrateBuilder.prototype.pushRemoteElement = function pushRemoteElement(_element) {
        var _nextSibling = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        throw unimplemented();
    };

    RehydrateBuilder.prototype.popRemoteElement = function popRemoteElement() {
        throw unimplemented();
    };

    RehydrateBuilder.prototype.didAppendBounds = function didAppendBounds(bounds$$1) {
        _NewElementBuilder.prototype.didAppendBounds.call(this, bounds$$1);
        var last = bounds$$1.lastNode();
        this._candidate = last && last.nextSibling;
        return bounds$$1;
    };

    RehydrateBuilder.prototype.didOpenElement = function didOpenElement(element) {
        _NewElementBuilder.prototype.didOpenElement.call(this, element);
        this._candidate = element.firstChild;
        return element;
    };

    _createClass$2(RehydrateBuilder, [{
        key: "candidate",
        get: function get() {
            var candidate = this._candidate;
            if (!candidate) return null;
            if (isComment(candidate) && getCloseBoundsDepth(candidate) === this.blockDepth) {
                return null;
            } else {
                return candidate;
            }
        }
    }]);

    return RehydrateBuilder;
}(NewElementBuilder);
function isTextNode(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
function getOpenBoundsDepth(node) {
    var boundsDepth = node.nodeValue.match(/^%\+bounds:(\d+)%$/);
    if (boundsDepth && boundsDepth[1]) {
        return Number(boundsDepth[1]);
    } else {
        return null;
    }
}
function getCloseBoundsDepth(node) {
    var boundsDepth = node.nodeValue.match(/^%\-bounds:(\d+)%$/);
    if (boundsDepth && boundsDepth[1]) {
        return Number(boundsDepth[1]);
    } else {
        return null;
    }
}
function isElement(node) {
    return node.nodeType === 1;
}
function isMarker(node) {
    return node.nodeType === 8 && node.nodeValue === '%glimmer%';
}
function isSeparator(node) {
    return node.nodeType === 8 && node.nodeValue === '%sep%';
}
function isEmpty$1(node) {
    return node.nodeType === 8 && node.nodeValue === '%empty%';
}
function remove(node) {
    var element = node.parentNode;
    var next = node.nextSibling;
    element.removeChild(node);
    return next;
}
function findByName(array, name) {
    for (var i = 0; i < array.length; i++) {
        var attr = array[i];
        if (attr.name === name) return attr;
    }
    return undefined;
}
function unimplemented() {
    return new Error('Not implemented');
}

function _defaults$14(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$25(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$14(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$14(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$14(subClass, superClass);
}

var SerializeBuilder = function (_NewElementBuilder) {
    _inherits$14(SerializeBuilder, _NewElementBuilder);

    function SerializeBuilder() {
        _classCallCheck$25(this, SerializeBuilder);

        var _this = _possibleConstructorReturn$14(this, _NewElementBuilder.apply(this, arguments));

        _this.serializeBlockDepth = 0;
        return _this;
    }

    SerializeBuilder.prototype.__openBlock = function __openBlock() {
        var depth = this.serializeBlockDepth++;
        this.__appendComment('%+block:' + depth + '%');
        _NewElementBuilder.prototype.__openBlock.call(this);
    };

    SerializeBuilder.prototype.__closeBlock = function __closeBlock() {
        _NewElementBuilder.prototype.__closeBlock.call(this);
        this.__appendComment('%-block:' + --this.serializeBlockDepth + '%');
    };

    SerializeBuilder.prototype.__appendHTML = function __appendHTML(html) {
        var first = this.__appendComment('%glimmer%');
        _NewElementBuilder.prototype.__appendHTML.call(this, html);
        var last = this.__appendComment('%glimmer%');
        return bounds(this.element, first, last);
    };

    SerializeBuilder.prototype.__appendText = function __appendText(string) {
        var current = currentNode(this);
        if (string === '') {
            return this.__appendComment('%empty%');
        } else if (current && current.nodeType === Node.TEXT_NODE) {
            this.__appendComment('%sep%');
        }
        return _NewElementBuilder.prototype.__appendText.call(this, string);
    };

    return SerializeBuilder;
}(NewElementBuilder);

var Opcodes;
(function (Opcodes) {
    // Statements
    Opcodes[Opcodes["Text"] = 0] = "Text";
    Opcodes[Opcodes["Append"] = 1] = "Append";
    Opcodes[Opcodes["Comment"] = 2] = "Comment";
    Opcodes[Opcodes["Modifier"] = 3] = "Modifier";
    Opcodes[Opcodes["Block"] = 4] = "Block";
    Opcodes[Opcodes["Component"] = 5] = "Component";
    Opcodes[Opcodes["OpenElement"] = 6] = "OpenElement";
    Opcodes[Opcodes["FlushElement"] = 7] = "FlushElement";
    Opcodes[Opcodes["CloseElement"] = 8] = "CloseElement";
    Opcodes[Opcodes["StaticAttr"] = 9] = "StaticAttr";
    Opcodes[Opcodes["DynamicAttr"] = 10] = "DynamicAttr";
    Opcodes[Opcodes["Yield"] = 11] = "Yield";
    Opcodes[Opcodes["Partial"] = 12] = "Partial";
    Opcodes[Opcodes["DynamicArg"] = 13] = "DynamicArg";
    Opcodes[Opcodes["StaticArg"] = 14] = "StaticArg";
    Opcodes[Opcodes["TrustingAttr"] = 15] = "TrustingAttr";
    Opcodes[Opcodes["Debugger"] = 16] = "Debugger";
    Opcodes[Opcodes["ClientSideStatement"] = 17] = "ClientSideStatement";
    // Expressions
    Opcodes[Opcodes["Unknown"] = 18] = "Unknown";
    Opcodes[Opcodes["Get"] = 19] = "Get";
    Opcodes[Opcodes["MaybeLocal"] = 20] = "MaybeLocal";
    Opcodes[Opcodes["FixThisBeforeWeMerge"] = 21] = "FixThisBeforeWeMerge";
    Opcodes[Opcodes["HasBlock"] = 22] = "HasBlock";
    Opcodes[Opcodes["HasBlockParams"] = 23] = "HasBlockParams";
    Opcodes[Opcodes["Undefined"] = 24] = "Undefined";
    Opcodes[Opcodes["Helper"] = 25] = "Helper";
    Opcodes[Opcodes["Concat"] = 26] = "Concat";
    Opcodes[Opcodes["ClientSideExpression"] = 27] = "ClientSideExpression";
})(Opcodes || (Opcodes = {}));

function is(variant) {
    return function (value) {
        return Array.isArray(value) && value[0] === variant;
    };
}
var Expressions;
(function (Expressions) {
    Expressions.isUnknown = is(Opcodes.Unknown);
    Expressions.isGet = is(Opcodes.Get);
    Expressions.isConcat = is(Opcodes.Concat);
    Expressions.isHelper = is(Opcodes.Helper);
    Expressions.isHasBlock = is(Opcodes.HasBlock);
    Expressions.isHasBlockParams = is(Opcodes.HasBlockParams);
    Expressions.isUndefined = is(Opcodes.Undefined);
    Expressions.isClientSide = is(Opcodes.ClientSideExpression);
    Expressions.isMaybeLocal = is(Opcodes.MaybeLocal);
    function isPrimitiveValue(value) {
        if (value === null) {
            return true;
        }
        return typeof value !== 'object';
    }
    Expressions.isPrimitiveValue = isPrimitiveValue;
})(Expressions || (Expressions = {}));
var Statements;
(function (Statements) {
    Statements.isText = is(Opcodes.Text);
    Statements.isAppend = is(Opcodes.Append);
    Statements.isComment = is(Opcodes.Comment);
    Statements.isModifier = is(Opcodes.Modifier);
    Statements.isBlock = is(Opcodes.Block);
    Statements.isComponent = is(Opcodes.Component);
    Statements.isOpenElement = is(Opcodes.OpenElement);
    Statements.isFlushElement = is(Opcodes.FlushElement);
    Statements.isCloseElement = is(Opcodes.CloseElement);
    Statements.isStaticAttr = is(Opcodes.StaticAttr);
    Statements.isDynamicAttr = is(Opcodes.DynamicAttr);
    Statements.isYield = is(Opcodes.Yield);
    Statements.isPartial = is(Opcodes.Partial);
    Statements.isDynamicArg = is(Opcodes.DynamicArg);
    Statements.isStaticArg = is(Opcodes.StaticArg);
    Statements.isTrustingAttr = is(Opcodes.TrustingAttr);
    Statements.isDebugger = is(Opcodes.Debugger);
    Statements.isClientSide = is(Opcodes.ClientSideStatement);
    function isAttribute(val) {
        return val[0] === Opcodes.StaticAttr || val[0] === Opcodes.DynamicAttr || val[0] === Opcodes.TrustingAttr;
    }
    Statements.isAttribute = isAttribute;
    function isArgument(val) {
        return val[0] === Opcodes.StaticArg || val[0] === Opcodes.DynamicArg;
    }
    Statements.isArgument = isArgument;
    function isParameter(val) {
        return isAttribute(val) || isArgument(val);
    }
    Statements.isParameter = isParameter;
    function getParameterName(s) {
        return s[1];
    }
    Statements.getParameterName = getParameterName;
})(Statements || (Statements = {}));

var Ops$1;
(function (Ops) {
    Ops[Ops["OpenComponentElement"] = 0] = "OpenComponentElement";
    Ops[Ops["DidCreateElement"] = 1] = "DidCreateElement";
    Ops[Ops["SetComponentAttrs"] = 2] = "SetComponentAttrs";
    Ops[Ops["DidRenderLayout"] = 3] = "DidRenderLayout";
    Ops[Ops["FunctionExpression"] = 4] = "FunctionExpression";
    Ops[Ops["Debugger"] = 5] = "Debugger";
})(Ops$1 || (Ops$1 = {}));

function _classCallCheck$28(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CompiledStaticTemplate = function CompiledStaticTemplate(handle) {
    _classCallCheck$28(this, CompiledStaticTemplate);

    this.handle = handle;
};
var CompiledDynamicTemplate = function CompiledDynamicTemplate(handle, symbolTable) {
    _classCallCheck$28(this, CompiledDynamicTemplate);

    this.handle = handle;
    this.symbolTable = symbolTable;
};

var _createClass$4 = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck$31(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function compileLayout(compilable, env) {
    var builder = new ComponentLayoutBuilder(env);
    compilable.compile(builder);
    return builder.compile();
}

var ComponentLayoutBuilder = function () {
    function ComponentLayoutBuilder(env) {
        _classCallCheck$31(this, ComponentLayoutBuilder);

        this.env = env;
    }

    ComponentLayoutBuilder.prototype.wrapLayout = function wrapLayout(layout) {
        this.inner = new WrappedBuilder(this.env, layout);
    };

    ComponentLayoutBuilder.prototype.fromLayout = function fromLayout(componentName, layout) {
        this.inner = new UnwrappedBuilder(this.env, componentName, layout);
    };

    ComponentLayoutBuilder.prototype.compile = function compile() {
        return this.inner.compile();
    };

    _createClass$4(ComponentLayoutBuilder, [{
        key: 'tag',
        get: function get() {
            return this.inner.tag;
        }
    }, {
        key: 'attrs',
        get: function get() {
            return this.inner.attrs;
        }
    }]);

    return ComponentLayoutBuilder;
}();

var WrappedBuilder = function () {
    function WrappedBuilder(env, layout) {
        _classCallCheck$31(this, WrappedBuilder);

        this.env = env;
        this.layout = layout;
        this.tag = new ComponentTagBuilder();
        this.attrs = new ComponentAttrsBuilder();
    }

    WrappedBuilder.prototype.compile = function compile() {
        //========DYNAMIC
        //        PutValue(TagExpr)
        //        Test
        //        JumpUnless(BODY)
        //        OpenDynamicPrimitiveElement
        //        DidCreateElement
        //        ...attr statements...
        //        FlushElement
        // BODY:  Noop
        //        ...body statements...
        //        PutValue(TagExpr)
        //        Test
        //        JumpUnless(END)
        //        CloseElement
        // END:   Noop
        //        DidRenderLayout
        //        Exit
        //
        //========STATIC
        //        OpenPrimitiveElementOpcode
        //        DidCreateElement
        //        ...attr statements...
        //        FlushElement
        //        ...body statements...
        //        CloseElement
        //        DidRenderLayout
        //        Exit
        var env = this.env,
            layout = this.layout;

        var meta = { templateMeta: layout.meta, symbols: layout.symbols, asPartial: false };
        var dynamicTag = this.tag.getDynamic();
        var staticTag = this.tag.getStatic();
        var b = builder(env, meta);
        b.startLabels();
        if (dynamicTag) {
            b.fetch(Register.s1);
            expr(dynamicTag, b);
            b.dup();
            b.load(Register.s1);
            b.test('simple');
            b.jumpUnless('BODY');
            b.fetch(Register.s1);
            b.putComponentOperations();
            b.openDynamicElement();
        } else if (staticTag) {
            b.putComponentOperations();
            b.openElementWithOperations(staticTag);
        }
        if (dynamicTag || staticTag) {
            b.didCreateElement(Register.s0);
            var attrs = this.attrs.buffer;
            b.setComponentAttrs(true);
            for (var i = 0; i < attrs.length; i++) {
                compileStatement(attrs[i], b);
            }
            b.setComponentAttrs(false);
            b.flushElement();
        }
        b.label('BODY');
        b.invokeStatic(layout.asBlock());
        if (dynamicTag) {
            b.fetch(Register.s1);
            b.test('simple');
            b.jumpUnless('END');
            b.closeElement();
        } else if (staticTag) {
            b.closeElement();
        }
        b.label('END');
        b.didRenderLayout(Register.s0);
        if (dynamicTag) {
            b.load(Register.s1);
        }
        b.stopLabels();
        var start = b.start;
        var end = b.finalize();
        return new CompiledDynamicTemplate(start, {
            meta: meta,
            hasEval: layout.hasEval,
            symbols: layout.symbols.concat([ATTRS_BLOCK])
        });
    };

    return WrappedBuilder;
}();

var UnwrappedBuilder = function () {
    function UnwrappedBuilder(env, componentName, layout) {
        _classCallCheck$31(this, UnwrappedBuilder);

        this.env = env;
        this.componentName = componentName;
        this.layout = layout;
        this.attrs = new ComponentAttrsBuilder();
    }

    UnwrappedBuilder.prototype.compile = function compile() {
        var env = this.env,
            layout = this.layout;

        return layout.asLayout(this.componentName, this.attrs.buffer).compileDynamic(env);
    };

    _createClass$4(UnwrappedBuilder, [{
        key: 'tag',
        get: function get() {
            throw new Error('BUG: Cannot call `tag` on an UnwrappedBuilder');
        }
    }]);

    return UnwrappedBuilder;
}();

var ComponentTagBuilder = function () {
    function ComponentTagBuilder() {
        _classCallCheck$31(this, ComponentTagBuilder);

        this.isDynamic = null;
        this.isStatic = null;
        this.staticTagName = null;
        this.dynamicTagName = null;
    }

    ComponentTagBuilder.prototype.getDynamic = function getDynamic() {
        if (this.isDynamic) {
            return this.dynamicTagName;
        }
    };

    ComponentTagBuilder.prototype.getStatic = function getStatic() {
        if (this.isStatic) {
            return this.staticTagName;
        }
    };

    ComponentTagBuilder.prototype.static = function _static(tagName) {
        this.isStatic = true;
        this.staticTagName = tagName;
    };

    ComponentTagBuilder.prototype.dynamic = function dynamic(tagName) {
        this.isDynamic = true;
        this.dynamicTagName = [Opcodes.ClientSideExpression, Ops$1.FunctionExpression, tagName];
    };

    return ComponentTagBuilder;
}();

var ComponentAttrsBuilder = function () {
    function ComponentAttrsBuilder() {
        _classCallCheck$31(this, ComponentAttrsBuilder);

        this.buffer = [];
    }

    ComponentAttrsBuilder.prototype.static = function _static(name, value) {
        this.buffer.push([Opcodes.StaticAttr, name, value, null]);
    };

    ComponentAttrsBuilder.prototype.dynamic = function dynamic(name, value) {
        this.buffer.push([Opcodes.DynamicAttr, name, [Opcodes.ClientSideExpression, Ops$1.FunctionExpression, value], null]);
    };

    return ComponentAttrsBuilder;
}();

var ComponentBuilder = function () {
    function ComponentBuilder(builder) {
        _classCallCheck$31(this, ComponentBuilder);

        this.builder = builder;
        this.env = builder.env;
    }

    ComponentBuilder.prototype.static = function _static(definition, args) {
        var params = args[0],
            hash = args[1],
            _default = args[2],
            inverse = args[3];
        var builder = this.builder;

        builder.pushComponentManager(definition);
        builder.invokeComponent(null, params, hash, _default, inverse);
    };

    ComponentBuilder.prototype.dynamic = function dynamic(definitionArgs, getDefinition, args) {
        var params = args[0],
            hash = args[1],
            block = args[2],
            inverse = args[3];
        var builder = this.builder;

        if (!definitionArgs || definitionArgs.length === 0) {
            throw new Error("Dynamic syntax without an argument");
        }
        var meta = this.builder.meta.templateMeta;
        function helper(vm, a) {
            return getDefinition(vm, a, meta);
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        builder.compileArgs(definitionArgs[0], definitionArgs[1], true);
        builder.helper(helper);
        builder.dup();
        builder.test('simple');
        builder.enter(2);
        builder.jumpUnless('ELSE');
        builder.pushDynamicComponentManager();
        builder.invokeComponent(null, params, hash, block, inverse);
        builder.label('ELSE');
        builder.exit();
        builder.return();
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    };

    return ComponentBuilder;
}();
function builder(env, meta) {
    return new OpcodeBuilder(env, meta);
}

function _classCallCheck$32(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var RawInlineBlock = function () {
    function RawInlineBlock(meta, statements, parameters) {
        _classCallCheck$32(this, RawInlineBlock);

        this.meta = meta;
        this.statements = statements;
        this.parameters = parameters;
    }

    RawInlineBlock.prototype.scan = function scan() {
        return new CompilableTemplate(this.statements, { parameters: this.parameters, meta: this.meta });
    };

    return RawInlineBlock;
}();

var _createClass$3 = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _defaults$15(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn$15(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$15(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$15(subClass, superClass);
}

function _classCallCheck$30(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Labels = function () {
    function Labels() {
        _classCallCheck$30(this, Labels);

        this.labels = dict();
        this.targets = [];
    }

    Labels.prototype.label = function label(name, index) {
        this.labels[name] = index;
    };

    Labels.prototype.target = function target(at, Target, _target) {
        this.targets.push({ at: at, Target: Target, target: _target });
    };

    Labels.prototype.patch = function patch(program) {
        var targets = this.targets,
            labels = this.labels;

        for (var i = 0; i < targets.length; i++) {
            var _targets$i = targets[i],
                at = _targets$i.at,
                target = _targets$i.target;

            var goto = labels[target] - at;
            program.heap.setbyaddr(at + 1, goto);
        }
    };

    return Labels;
}();

var BasicOpcodeBuilder = function () {
    function BasicOpcodeBuilder(env, meta, program) {
        _classCallCheck$30(this, BasicOpcodeBuilder);

        this.env = env;
        this.meta = meta;
        this.program = program;
        this.labelsStack = new Stack();
        this.isComponentAttrs = false;
        this.constants = program.constants;
        this.heap = program.heap;
        this.start = this.heap.malloc();
    }

    BasicOpcodeBuilder.prototype.upvars = function upvars(count) {
        return fillNulls(count);
    };

    BasicOpcodeBuilder.prototype.reserve = function reserve(name) {
        this.push(name, 0, 0, 0);
    };

    BasicOpcodeBuilder.prototype.push = function push(name) {
        var op1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var op2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var op3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        this.heap.push(name);
        this.heap.push(op1);
        this.heap.push(op2);
        this.heap.push(op3);
    };

    BasicOpcodeBuilder.prototype.finalize = function finalize() {
        this.push(22 /* Return */);
        this.heap.finishMalloc(this.start);
        return this.start;
    };

    BasicOpcodeBuilder.prototype.setComponentAttrs = function setComponentAttrs(enabled) {
        this.isComponentAttrs = enabled;
    };
    // args


    BasicOpcodeBuilder.prototype.pushArgs = function pushArgs(synthetic) {
        this.push(58 /* PushArgs */, synthetic === true ? 1 : 0);
    };
    // helpers


    BasicOpcodeBuilder.prototype.startLabels = function startLabels() {
        this.labelsStack.push(new Labels());
    };

    BasicOpcodeBuilder.prototype.stopLabels = function stopLabels() {
        var label = this.labelsStack.pop();
        label.patch(this.program);
    };
    // components


    BasicOpcodeBuilder.prototype.pushComponentManager = function pushComponentManager(definition) {
        this.push(56 /* PushComponentManager */, this.other(definition));
    };

    BasicOpcodeBuilder.prototype.pushDynamicComponentManager = function pushDynamicComponentManager() {
        this.push(57 /* PushDynamicComponentManager */);
    };

    BasicOpcodeBuilder.prototype.prepareArgs = function prepareArgs(state) {
        this.push(59 /* PrepareArgs */, state);
    };

    BasicOpcodeBuilder.prototype.createComponent = function createComponent(state, hasDefault, hasInverse) {
        var flag = (hasDefault === true ? 1 : 0) | (hasInverse === true ? 1 : 0) << 1;
        this.push(60 /* CreateComponent */, flag, state);
    };

    BasicOpcodeBuilder.prototype.registerComponentDestructor = function registerComponentDestructor(state) {
        this.push(61 /* RegisterComponentDestructor */, state);
    };

    BasicOpcodeBuilder.prototype.beginComponentTransaction = function beginComponentTransaction() {
        this.push(65 /* BeginComponentTransaction */);
    };

    BasicOpcodeBuilder.prototype.commitComponentTransaction = function commitComponentTransaction() {
        this.push(66 /* CommitComponentTransaction */);
    };

    BasicOpcodeBuilder.prototype.putComponentOperations = function putComponentOperations() {
        this.push(62 /* PutComponentOperations */);
    };

    BasicOpcodeBuilder.prototype.getComponentSelf = function getComponentSelf(state) {
        this.push(63 /* GetComponentSelf */, state);
    };

    BasicOpcodeBuilder.prototype.getComponentLayout = function getComponentLayout(state) {
        this.push(64 /* GetComponentLayout */, state);
    };

    BasicOpcodeBuilder.prototype.didCreateElement = function didCreateElement(state) {
        this.push(67 /* DidCreateElement */, state);
    };

    BasicOpcodeBuilder.prototype.didRenderLayout = function didRenderLayout(state) {
        this.push(68 /* DidRenderLayout */, state);
    };
    // partial


    BasicOpcodeBuilder.prototype.getPartialTemplate = function getPartialTemplate() {
        this.push(69 /* GetPartialTemplate */);
    };

    BasicOpcodeBuilder.prototype.resolveMaybeLocal = function resolveMaybeLocal(name) {
        this.push(70 /* ResolveMaybeLocal */, this.string(name));
    };
    // debugger


    BasicOpcodeBuilder.prototype.debugger = function _debugger(symbols, evalInfo) {
        this.push(71 /* Debugger */, this.constants.other(symbols), this.constants.array(evalInfo));
    };
    // content


    BasicOpcodeBuilder.prototype.dynamicContent = function dynamicContent(isTrusting) {
        this.push(26 /* DynamicContent */, isTrusting ? 1 : 0);
    };
    // dom


    BasicOpcodeBuilder.prototype.text = function text(_text) {
        this.push(24 /* Text */, this.constants.string(_text));
    };

    BasicOpcodeBuilder.prototype.openPrimitiveElement = function openPrimitiveElement(tag) {
        this.push(27 /* OpenElement */, this.constants.string(tag));
    };

    BasicOpcodeBuilder.prototype.openElementWithOperations = function openElementWithOperations(tag) {
        this.push(28 /* OpenElementWithOperations */, this.constants.string(tag));
    };

    BasicOpcodeBuilder.prototype.openDynamicElement = function openDynamicElement() {
        this.push(29 /* OpenDynamicElement */);
    };

    BasicOpcodeBuilder.prototype.flushElement = function flushElement() {
        this.push(33 /* FlushElement */);
    };

    BasicOpcodeBuilder.prototype.closeElement = function closeElement() {
        this.push(34 /* CloseElement */);
    };

    BasicOpcodeBuilder.prototype.staticAttr = function staticAttr(_name, _namespace, _value) {
        var name = this.constants.string(_name);
        var namespace = _namespace ? this.constants.string(_namespace) : 0;
        if (this.isComponentAttrs) {
            this.primitive(_value);
            this.push(32 /* ComponentAttr */, name, 1, namespace);
        } else {
            var value = this.constants.string(_value);
            this.push(30 /* StaticAttr */, name, value, namespace);
        }
    };

    BasicOpcodeBuilder.prototype.dynamicAttr = function dynamicAttr(_name, _namespace, trusting) {
        var name = this.constants.string(_name);
        var namespace = _namespace ? this.constants.string(_namespace) : 0;
        if (this.isComponentAttrs) {
            this.push(32 /* ComponentAttr */, name, trusting === true ? 1 : 0, namespace);
        } else {
            this.push(31 /* DynamicAttr */, name, trusting === true ? 1 : 0, namespace);
        }
    };

    BasicOpcodeBuilder.prototype.comment = function comment(_comment) {
        var comment = this.constants.string(_comment);
        this.push(25 /* Comment */, comment);
    };

    BasicOpcodeBuilder.prototype.modifier = function modifier(_definition) {
        this.push(35 /* Modifier */, this.other(_definition));
    };
    // lists


    BasicOpcodeBuilder.prototype.putIterator = function putIterator() {
        this.push(54 /* PutIterator */);
    };

    BasicOpcodeBuilder.prototype.enterList = function enterList(start) {
        this.reserve(52 /* EnterList */);
        this.labels.target(this.pos, 52 /* EnterList */, start);
    };

    BasicOpcodeBuilder.prototype.exitList = function exitList() {
        this.push(53 /* ExitList */);
    };

    BasicOpcodeBuilder.prototype.iterate = function iterate(breaks) {
        this.reserve(55 /* Iterate */);
        this.labels.target(this.pos, 55 /* Iterate */, breaks);
    };
    // expressions


    BasicOpcodeBuilder.prototype.setVariable = function setVariable(symbol) {
        this.push(4 /* SetVariable */, symbol);
    };

    BasicOpcodeBuilder.prototype.getVariable = function getVariable(symbol) {
        this.push(5 /* GetVariable */, symbol);
    };

    BasicOpcodeBuilder.prototype.getProperty = function getProperty(key) {
        this.push(6 /* GetProperty */, this.string(key));
    };

    BasicOpcodeBuilder.prototype.getBlock = function getBlock(symbol) {
        this.push(8 /* GetBlock */, symbol);
    };

    BasicOpcodeBuilder.prototype.hasBlock = function hasBlock(symbol) {
        this.push(9 /* HasBlock */, symbol);
    };

    BasicOpcodeBuilder.prototype.hasBlockParams = function hasBlockParams(symbol) {
        this.push(10 /* HasBlockParams */, symbol);
    };

    BasicOpcodeBuilder.prototype.concat = function concat(size) {
        this.push(11 /* Concat */, size);
    };

    BasicOpcodeBuilder.prototype.function = function _function(f) {
        this.push(2 /* Function */, this.func(f));
    };

    BasicOpcodeBuilder.prototype.load = function load(register) {
        this.push(17 /* Load */, register);
    };

    BasicOpcodeBuilder.prototype.fetch = function fetch(register) {
        this.push(18 /* Fetch */, register);
    };

    BasicOpcodeBuilder.prototype.dup = function dup() {
        var register = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Register.sp;
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        return this.push(15 /* Dup */, register, offset);
    };

    BasicOpcodeBuilder.prototype.pop = function pop() {
        var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        return this.push(16 /* Pop */, count);
    };
    // vm


    BasicOpcodeBuilder.prototype.pushRemoteElement = function pushRemoteElement() {
        this.push(36 /* PushRemoteElement */);
    };

    BasicOpcodeBuilder.prototype.popRemoteElement = function popRemoteElement() {
        this.push(37 /* PopRemoteElement */);
    };

    BasicOpcodeBuilder.prototype.label = function label(name) {
        this.labels.label(name, this.nextPos);
    };

    BasicOpcodeBuilder.prototype.pushRootScope = function pushRootScope(symbols, bindCallerScope) {
        this.push(19 /* RootScope */, symbols, bindCallerScope ? 1 : 0);
    };

    BasicOpcodeBuilder.prototype.pushChildScope = function pushChildScope() {
        this.push(20 /* ChildScope */);
    };

    BasicOpcodeBuilder.prototype.popScope = function popScope() {
        this.push(21 /* PopScope */);
    };

    BasicOpcodeBuilder.prototype.returnTo = function returnTo(label) {
        this.reserve(23 /* ReturnTo */);
        this.labels.target(this.pos, 23 /* ReturnTo */, label);
    };

    BasicOpcodeBuilder.prototype.pushDynamicScope = function pushDynamicScope() {
        this.push(39 /* PushDynamicScope */);
    };

    BasicOpcodeBuilder.prototype.popDynamicScope = function popDynamicScope() {
        this.push(40 /* PopDynamicScope */);
    };

    BasicOpcodeBuilder.prototype.pushImmediate = function pushImmediate(value) {
        this.push(13 /* Constant */, this.other(value));
    };

    BasicOpcodeBuilder.prototype.primitive = function primitive(_primitive) {
        var flag = 0;
        var primitive = void 0;
        switch (typeof _primitive) {
            case 'number':
                primitive = _primitive;
                break;
            case 'string':
                primitive = this.string(_primitive);
                flag = 1;
                break;
            case 'boolean':
                primitive = _primitive | 0;
                flag = 2;
                break;
            case 'object':
                // assume null
                primitive = 2;
                flag = 2;
                break;
            case 'undefined':
                primitive = 3;
                flag = 2;
                break;
            default:
                throw new Error('Invalid primitive passed to pushPrimitive');
        }
        this.push(14 /* PrimitiveReference */, flag << 30 | primitive);
    };

    BasicOpcodeBuilder.prototype.helper = function helper(func) {
        this.push(1 /* Helper */, this.func(func));
    };

    BasicOpcodeBuilder.prototype.pushBlock = function pushBlock(block) {
        this.push(7 /* PushBlock */, this.block(block));
    };

    BasicOpcodeBuilder.prototype.bindDynamicScope = function bindDynamicScope(_names) {
        this.push(38 /* BindDynamicScope */, this.names(_names));
    };

    BasicOpcodeBuilder.prototype.enter = function enter(args) {
        this.push(49 /* Enter */, args);
    };

    BasicOpcodeBuilder.prototype.exit = function exit() {
        this.push(50 /* Exit */);
    };

    BasicOpcodeBuilder.prototype.return = function _return() {
        this.push(22 /* Return */);
    };

    BasicOpcodeBuilder.prototype.pushFrame = function pushFrame() {
        this.push(47 /* PushFrame */);
    };

    BasicOpcodeBuilder.prototype.popFrame = function popFrame() {
        this.push(48 /* PopFrame */);
    };

    BasicOpcodeBuilder.prototype.compileDynamicBlock = function compileDynamicBlock() {
        this.push(41 /* CompileDynamicBlock */);
    };

    BasicOpcodeBuilder.prototype.invokeDynamic = function invokeDynamic(invoker) {
        this.push(43 /* InvokeDynamic */, this.other(invoker));
    };

    BasicOpcodeBuilder.prototype.invokeStatic = function invokeStatic(block) {
        var callerCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var parameters = block.symbolTable.parameters;

        var calleeCount = parameters.length;
        var count = Math.min(callerCount, calleeCount);
        this.pushFrame();
        if (count) {
            this.pushChildScope();
            for (var i = 0; i < count; i++) {
                this.dup(Register.fp, callerCount - i);
                this.setVariable(parameters[i]);
            }
        }
        var _block = this.constants.block(block);
        this.push(42 /* InvokeStatic */, _block);
        if (count) {
            this.popScope();
        }
        this.popFrame();
    };

    BasicOpcodeBuilder.prototype.test = function test(testFunc) {
        var _func = void 0;
        if (testFunc === 'const') {
            _func = ConstTest;
        } else if (testFunc === 'simple') {
            _func = SimpleTest;
        } else if (testFunc === 'environment') {
            _func = EnvironmentTest;
        } else if (typeof testFunc === 'function') {
            _func = testFunc;
        } else {
            throw new Error('unreachable');
        }
        var func = this.constants.function(_func);
        this.push(51 /* Test */, func);
    };

    BasicOpcodeBuilder.prototype.jump = function jump(target) {
        this.reserve(44 /* Jump */);
        this.labels.target(this.pos, 44 /* Jump */, target);
    };

    BasicOpcodeBuilder.prototype.jumpIf = function jumpIf(target) {
        this.reserve(45 /* JumpIf */);
        this.labels.target(this.pos, 45 /* JumpIf */, target);
    };

    BasicOpcodeBuilder.prototype.jumpUnless = function jumpUnless(target) {
        this.reserve(46 /* JumpUnless */);
        this.labels.target(this.pos, 46 /* JumpUnless */, target);
    };

    BasicOpcodeBuilder.prototype.string = function string(_string) {
        return this.constants.string(_string);
    };

    BasicOpcodeBuilder.prototype.names = function names(_names) {
        var names = [];
        for (var i = 0; i < _names.length; i++) {
            var n = _names[i];
            names[i] = this.constants.string(n);
        }
        return this.constants.array(names);
    };

    BasicOpcodeBuilder.prototype.symbols = function symbols(_symbols) {
        return this.constants.array(_symbols);
    };

    BasicOpcodeBuilder.prototype.other = function other(value) {
        return this.constants.other(value);
    };

    BasicOpcodeBuilder.prototype.block = function block(_block2) {
        return _block2 ? this.constants.block(_block2) : 0;
    };

    BasicOpcodeBuilder.prototype.func = function func(_func2) {
        return this.constants.function(_func2);
    };

    _createClass$3(BasicOpcodeBuilder, [{
        key: 'pos',
        get: function get() {
            return typePos(this.heap.size());
        }
    }, {
        key: 'nextPos',
        get: function get() {
            return this.heap.size();
        }
    }, {
        key: 'labels',
        get: function get() {
            return this.labelsStack.current;
        }
    }]);

    return BasicOpcodeBuilder;
}();

function isCompilableExpression(expr$$1) {
    return typeof expr$$1 === 'object' && expr$$1 !== null && typeof expr$$1.compile === 'function';
}

var OpcodeBuilder = function (_BasicOpcodeBuilder) {
    _inherits$15(OpcodeBuilder, _BasicOpcodeBuilder);

    function OpcodeBuilder(env, meta) {
        var program = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : env.program;

        _classCallCheck$30(this, OpcodeBuilder);

        var _this = _possibleConstructorReturn$15(this, _BasicOpcodeBuilder.call(this, env, meta, program));

        _this.component = new ComponentBuilder(_this);
        return _this;
    }

    OpcodeBuilder.prototype.compileArgs = function compileArgs(params, hash, synthetic) {
        var positional = 0;
        if (params) {
            for (var i = 0; i < params.length; i++) {
                expr(params[i], this);
            }
            positional = params.length;
        }
        this.pushImmediate(positional);
        var names = EMPTY_ARRAY;
        if (hash) {
            names = hash[0];
            var val = hash[1];
            for (var _i = 0; _i < val.length; _i++) {
                expr(val[_i], this);
            }
        }
        this.pushImmediate(names);
        this.pushArgs(synthetic);
    };

    OpcodeBuilder.prototype.compile = function compile(expr$$1) {
        if (isCompilableExpression(expr$$1)) {
            return expr$$1.compile(this);
        } else {
            return expr$$1;
        }
    };

    OpcodeBuilder.prototype.guardedAppend = function guardedAppend(expression, trusting) {
        this.startLabels();
        this.pushFrame();
        this.returnTo('END');
        expr(expression, this);
        this.dup();
        this.test(function (reference) {
            return IsComponentDefinitionReference.create(reference);
        });
        this.enter(2);
        this.jumpUnless('ELSE');
        this.pushDynamicComponentManager();
        this.invokeComponent(null, null, null, null, null);
        this.exit();
        this.return();
        this.label('ELSE');
        this.dynamicContent(trusting);
        this.exit();
        this.return();
        this.label('END');
        this.popFrame();
        this.stopLabels();
    };

    OpcodeBuilder.prototype.invokeComponent = function invokeComponent(attrs, params, hash, block) {
        var inverse = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        this.fetch(Register.s0);
        this.dup(Register.sp, 1);
        this.load(Register.s0);
        this.pushBlock(block);
        this.pushBlock(inverse);
        this.compileArgs(params, hash, false);
        this.prepareArgs(Register.s0);
        this.beginComponentTransaction();
        this.pushDynamicScope();
        this.createComponent(Register.s0, block !== null, inverse !== null);
        this.registerComponentDestructor(Register.s0);
        this.getComponentSelf(Register.s0);
        this.getComponentLayout(Register.s0);
        this.invokeDynamic(new InvokeDynamicLayout(attrs && attrs.scan()));
        this.popFrame();
        this.popScope();
        this.popDynamicScope();
        this.commitComponentTransaction();
        this.load(Register.s0);
    };

    OpcodeBuilder.prototype.template = function template(block) {
        if (!block) return null;
        return new RawInlineBlock(this.meta, block.statements, block.parameters);
    };

    return OpcodeBuilder;
}(BasicOpcodeBuilder);

function _classCallCheck$29(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Ops$2 = Opcodes;
var ATTRS_BLOCK = '&attrs';

var Compilers = function () {
    function Compilers() {
        var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        _classCallCheck$29(this, Compilers);

        this.offset = offset;
        this.names = dict();
        this.funcs = [];
    }

    Compilers.prototype.add = function add(name, func) {
        this.funcs.push(func);
        this.names[name] = this.funcs.length - 1;
    };

    Compilers.prototype.compile = function compile(sexp, builder) {
        var name = sexp[this.offset];
        var index = this.names[name];
        var func = this.funcs[index];
        debugAssert(!!func, 'expected an implementation for ' + (this.offset === 0 ? Ops$2[sexp[0]] : Ops$1[sexp[1]]));
        func(sexp, builder);
    };

    return Compilers;
}();

var STATEMENTS = new Compilers();
var CLIENT_SIDE = new Compilers(1);
STATEMENTS.add(Ops$2.Text, function (sexp, builder) {
    builder.text(sexp[1]);
});
STATEMENTS.add(Ops$2.Comment, function (sexp, builder) {
    builder.comment(sexp[1]);
});
STATEMENTS.add(Ops$2.CloseElement, function (_sexp, builder) {
    builder.closeElement();
});
STATEMENTS.add(Ops$2.FlushElement, function (_sexp, builder) {
    builder.flushElement();
});
STATEMENTS.add(Ops$2.Modifier, function (sexp, builder) {
    var env = builder.env,
        meta = builder.meta;
    var name = sexp[1],
        params = sexp[2],
        hash = sexp[3];

    if (env.hasModifier(name, meta.templateMeta)) {
        builder.compileArgs(params, hash, true);
        builder.modifier(env.lookupModifier(name, meta.templateMeta));
    } else {
        throw new Error('Compile Error ' + name + ' is not a modifier: Helpers may not be used in the element form.');
    }
});
STATEMENTS.add(Ops$2.StaticAttr, function (sexp, builder) {
    var name = sexp[1],
        value = sexp[2],
        namespace = sexp[3];

    builder.staticAttr(name, namespace, value);
});
STATEMENTS.add(Ops$2.DynamicAttr, function (sexp, builder) {
    dynamicAttr(sexp, false, builder);
});
STATEMENTS.add(Ops$2.TrustingAttr, function (sexp, builder) {
    dynamicAttr(sexp, true, builder);
});
function dynamicAttr(sexp, trusting, builder) {
    var name = sexp[1],
        value = sexp[2],
        namespace = sexp[3];

    expr(value, builder);
    if (namespace) {
        builder.dynamicAttr(name, namespace, trusting);
    } else {
        builder.dynamicAttr(name, null, trusting);
    }
}
STATEMENTS.add(Ops$2.OpenElement, function (sexp, builder) {
    builder.openPrimitiveElement(sexp[1]);
});
CLIENT_SIDE.add(Ops$1.OpenComponentElement, function (sexp, builder) {
    builder.putComponentOperations();
    builder.openElementWithOperations(sexp[2]);
});
CLIENT_SIDE.add(Ops$1.DidCreateElement, function (_sexp, builder) {
    builder.didCreateElement(Register.s0);
});
CLIENT_SIDE.add(Ops$1.SetComponentAttrs, function (sexp, builder) {
    builder.setComponentAttrs(sexp[2]);
});
CLIENT_SIDE.add(Ops$1.Debugger, function () {
    // tslint:disable-next-line:no-debugger
    debugger;
});
CLIENT_SIDE.add(Ops$1.DidRenderLayout, function (_sexp, builder) {
    builder.didRenderLayout(Register.s0);
});
STATEMENTS.add(Ops$2.Append, function (sexp, builder) {
    var value = sexp[1],
        trusting = sexp[2];

    var _builder$env$macros = builder.env.macros(),
        inlines = _builder$env$macros.inlines;

    var returned = inlines.compile(sexp, builder) || value;
    if (returned === true) return;
    var isGet = E.isGet(value);
    var isMaybeLocal = E.isMaybeLocal(value);
    if (trusting) {
        builder.guardedAppend(value, true);
    } else {
        if (isGet || isMaybeLocal) {
            builder.guardedAppend(value, false);
        } else {
            expr(value, builder);
            builder.dynamicContent(false);
        }
    }
});
STATEMENTS.add(Ops$2.Block, function (sexp, builder) {
    var name = sexp[1],
        params = sexp[2],
        hash = sexp[3],
        _template = sexp[4],
        _inverse = sexp[5];

    var template = builder.template(_template);
    var inverse = builder.template(_inverse);
    var templateBlock = template && template.scan();
    var inverseBlock = inverse && inverse.scan();

    var _builder$env$macros2 = builder.env.macros(),
        blocks = _builder$env$macros2.blocks;

    blocks.compile(name, params, hash, templateBlock, inverseBlock, builder);
});
var InvokeDynamicLayout = function () {
    function InvokeDynamicLayout(attrs) {
        _classCallCheck$29(this, InvokeDynamicLayout);

        this.attrs = attrs;
    }

    InvokeDynamicLayout.prototype.invoke = function invoke(vm, layout) {
        var _layout$symbolTable = layout.symbolTable,
            symbols = _layout$symbolTable.symbols,
            hasEval = _layout$symbolTable.hasEval;

        var stack = vm.stack;
        var scope = vm.pushRootScope(symbols.length + 1, true);
        scope.bindSelf(stack.pop());
        scope.bindBlock(symbols.indexOf(ATTRS_BLOCK) + 1, this.attrs);
        var lookup = null;
        var $eval = -1;
        if (hasEval) {
            $eval = symbols.indexOf('$eval') + 1;
            lookup = dict();
        }
        var callerNames = stack.pop();
        for (var i = callerNames.length - 1; i >= 0; i--) {
            var symbol = symbols.indexOf(callerNames[i]);
            var value = stack.pop();
            if (symbol !== -1) scope.bindSymbol(symbol + 1, value);
            if (hasEval) lookup[callerNames[i]] = value;
        }
        var numPositionalArgs = stack.pop();
        debugAssert(typeof numPositionalArgs === 'number', '[BUG] Incorrect value of positional argument count found during invoke-dynamic-layout.');
        // Currently we don't support accessing positional args in templates, so just throw them away
        stack.pop(numPositionalArgs);
        var inverseSymbol = symbols.indexOf('&inverse');
        var inverse = stack.pop();
        if (inverseSymbol !== -1) {
            scope.bindBlock(inverseSymbol + 1, inverse);
        }
        if (lookup) lookup['&inverse'] = inverse;
        var defaultSymbol = symbols.indexOf('&default');
        var defaultBlock = stack.pop();
        if (defaultSymbol !== -1) {
            scope.bindBlock(defaultSymbol + 1, defaultBlock);
        }
        if (lookup) lookup['&default'] = defaultBlock;
        if (lookup) scope.bindEvalScope(lookup);
        vm.pushFrame();
        vm.call(layout.handle);
    };

    InvokeDynamicLayout.prototype.toJSON = function toJSON() {
        return { GlimmerDebug: '<invoke-dynamic-layout>' };
    };

    return InvokeDynamicLayout;
}();
STATEMENTS.add(Ops$2.Component, function (sexp, builder) {
    var tag = sexp[1],
        _attrs = sexp[2],
        args = sexp[3],
        block = sexp[4];

    if (builder.env.hasComponentDefinition(tag, builder.meta.templateMeta)) {
        var child = builder.template(block);
        var attrs = [[Ops$2.ClientSideStatement, Ops$1.SetComponentAttrs, true]].concat(_attrs, [[Ops$2.ClientSideStatement, Ops$1.SetComponentAttrs, false]]);
        var attrsBlock = new RawInlineBlock(builder.meta, attrs, EMPTY_ARRAY);
        var definition = builder.env.getComponentDefinition(tag, builder.meta.templateMeta);
        builder.pushComponentManager(definition);
        builder.invokeComponent(attrsBlock, null, args, child && child.scan());
    } else if (block && block.parameters.length) {
        throw new Error('Compile Error: Cannot find component ' + tag);
    } else {
        builder.openPrimitiveElement(tag);
        for (var i = 0; i < _attrs.length; i++) {
            STATEMENTS.compile(_attrs[i], builder);
        }
        builder.flushElement();
        if (block) {
            var stmts = block.statements;
            for (var _i = 0; _i < stmts.length; _i++) {
                STATEMENTS.compile(stmts[_i], builder);
            }
        }
        builder.closeElement();
    }
});
var PartialInvoker = function () {
    function PartialInvoker(outerSymbols, evalInfo) {
        _classCallCheck$29(this, PartialInvoker);

        this.outerSymbols = outerSymbols;
        this.evalInfo = evalInfo;
    }

    PartialInvoker.prototype.invoke = function invoke(vm, _partial) {
        var partial = _partial;
        var partialSymbols = partial.symbolTable.symbols;
        var outerScope = vm.scope();
        var partialScope = vm.pushRootScope(partialSymbols.length, false);
        partialScope.bindCallerScope(outerScope.getCallerScope());
        partialScope.bindEvalScope(outerScope.getEvalScope());
        partialScope.bindSelf(outerScope.getSelf());
        var evalInfo = this.evalInfo,
            outerSymbols = this.outerSymbols;

        var locals = dict();
        for (var i = 0; i < evalInfo.length; i++) {
            var slot = evalInfo[i];
            var name = outerSymbols[slot - 1];
            var ref = outerScope.getSymbol(slot);
            locals[name] = ref;
        }
        var evalScope = outerScope.getEvalScope();
        for (var _i2 = 0; _i2 < partialSymbols.length; _i2++) {
            var _name = partialSymbols[_i2];
            var symbol = _i2 + 1;
            var value = evalScope[_name];
            if (value !== undefined) partialScope.bind(symbol, value);
        }
        partialScope.bindPartialMap(locals);
        vm.pushFrame();
        vm.call(partial.handle);
    };

    return PartialInvoker;
}();
STATEMENTS.add(Ops$2.Partial, function (sexp, builder) {
    var name = sexp[1],
        evalInfo = sexp[2];
    var _builder$meta = builder.meta,
        templateMeta = _builder$meta.templateMeta,
        symbols = _builder$meta.symbols;

    function helper(vm, args) {
        var env = vm.env;

        var nameRef = args.positional.at(0);
        return map(nameRef, function (n) {
            if (typeof n === 'string' && n) {
                if (!env.hasPartial(n, templateMeta)) {
                    throw new Error('Could not find a partial named "' + n + '"');
                }
                return env.lookupPartial(n, templateMeta);
            } else if (n) {
                throw new Error('Could not find a partial named "' + String(n) + '"');
            } else {
                return null;
            }
        });
    }
    builder.startLabels();
    builder.pushFrame();
    builder.returnTo('END');
    expr(name, builder);
    builder.pushImmediate(1);
    builder.pushImmediate(EMPTY_ARRAY);
    builder.pushArgs(true);
    builder.helper(helper);
    builder.dup();
    builder.test('simple');
    builder.enter(2);
    builder.jumpUnless('ELSE');
    builder.getPartialTemplate();
    builder.compileDynamicBlock();
    builder.invokeDynamic(new PartialInvoker(symbols, evalInfo));
    builder.popScope();
    builder.popFrame();
    builder.label('ELSE');
    builder.exit();
    builder.return();
    builder.label('END');
    builder.popFrame();
    builder.stopLabels();
});

var InvokeDynamicYield = function () {
    function InvokeDynamicYield(callerCount) {
        _classCallCheck$29(this, InvokeDynamicYield);

        this.callerCount = callerCount;
    }

    InvokeDynamicYield.prototype.invoke = function invoke(vm, block) {
        var callerCount = this.callerCount;

        var stack = vm.stack;
        if (!block) {
            // To balance the pop{Frame,Scope}
            vm.pushFrame();
            vm.pushCallerScope();
            return;
        }
        var table = block.symbolTable;
        var locals = table.parameters; // always present in inline blocks
        var calleeCount = locals ? locals.length : 0;
        var count = Math.min(callerCount, calleeCount);
        vm.pushFrame();
        vm.pushCallerScope(calleeCount > 0);
        var scope = vm.scope();
        for (var i = 0; i < count; i++) {
            scope.bindSymbol(locals[i], stack.fromBase(callerCount - i));
        }
        vm.call(block.handle);
    };

    InvokeDynamicYield.prototype.toJSON = function toJSON() {
        return { GlimmerDebug: '<invoke-dynamic-yield caller-count=' + this.callerCount + '>' };
    };

    return InvokeDynamicYield;
}();

STATEMENTS.add(Ops$2.Yield, function (sexp, builder) {
    var to = sexp[1],
        params = sexp[2];

    var count = compileList(params, builder);
    builder.getBlock(to);
    builder.compileDynamicBlock();
    builder.invokeDynamic(new InvokeDynamicYield(count));
    builder.popScope();
    builder.popFrame();
    if (count) {
        builder.pop(count);
    }
});
STATEMENTS.add(Ops$2.Debugger, function (sexp, builder) {
    var evalInfo = sexp[1];

    builder.debugger(builder.meta.symbols, evalInfo);
});
STATEMENTS.add(Ops$2.ClientSideStatement, function (sexp, builder) {
    CLIENT_SIDE.compile(sexp, builder);
});
var EXPRESSIONS = new Compilers();
var CLIENT_SIDE_EXPRS = new Compilers(1);
var E = Expressions;
function expr(expression, builder) {
    if (Array.isArray(expression)) {
        EXPRESSIONS.compile(expression, builder);
    } else {
        builder.primitive(expression);
    }
}
EXPRESSIONS.add(Ops$2.Unknown, function (sexp, builder) {
    var name = sexp[1];
    if (builder.env.hasHelper(name, builder.meta.templateMeta)) {
        EXPRESSIONS.compile([Ops$2.Helper, name, EMPTY_ARRAY, null], builder);
    } else if (builder.meta.asPartial) {
        builder.resolveMaybeLocal(name);
    } else {
        builder.getVariable(0);
        builder.getProperty(name);
    }
});
EXPRESSIONS.add(Ops$2.Concat, function (sexp, builder) {
    var parts = sexp[1];
    for (var i = 0; i < parts.length; i++) {
        expr(parts[i], builder);
    }
    builder.concat(parts.length);
});
CLIENT_SIDE_EXPRS.add(Ops$1.FunctionExpression, function (sexp, builder) {
    builder.function(sexp[2]);
});
EXPRESSIONS.add(Ops$2.Helper, function (sexp, builder) {
    var env = builder.env,
        meta = builder.meta;
    var name = sexp[1],
        params = sexp[2],
        hash = sexp[3];

    if (env.hasHelper(name, meta.templateMeta)) {
        builder.compileArgs(params, hash, true);
        builder.helper(env.lookupHelper(name, meta.templateMeta));
    } else {
        throw new Error('Compile Error: ' + name + ' is not a helper');
    }
});
EXPRESSIONS.add(Ops$2.Get, function (sexp, builder) {
    var head = sexp[1],
        path = sexp[2];

    builder.getVariable(head);
    for (var i = 0; i < path.length; i++) {
        builder.getProperty(path[i]);
    }
});
EXPRESSIONS.add(Ops$2.MaybeLocal, function (sexp, builder) {
    var path = sexp[1];

    if (builder.meta.asPartial) {
        var head = path[0];
        path = path.slice(1);
        builder.resolveMaybeLocal(head);
    } else {
        builder.getVariable(0);
    }
    for (var i = 0; i < path.length; i++) {
        builder.getProperty(path[i]);
    }
});
EXPRESSIONS.add(Ops$2.Undefined, function (_sexp, builder) {
    return builder.primitive(undefined);
});
EXPRESSIONS.add(Ops$2.HasBlock, function (sexp, builder) {
    builder.hasBlock(sexp[1]);
});
EXPRESSIONS.add(Ops$2.HasBlockParams, function (sexp, builder) {
    builder.hasBlockParams(sexp[1]);
});
EXPRESSIONS.add(Ops$2.ClientSideExpression, function (sexp, builder) {
    CLIENT_SIDE_EXPRS.compile(sexp, builder);
});
function compileList(params, builder) {
    if (!params) return 0;
    for (var i = 0; i < params.length; i++) {
        expr(params[i], builder);
    }
    return params.length;
}
var Blocks = function () {
    function Blocks() {
        _classCallCheck$29(this, Blocks);

        this.names = dict();
        this.funcs = [];
    }

    Blocks.prototype.add = function add(name, func) {
        this.funcs.push(func);
        this.names[name] = this.funcs.length - 1;
    };

    Blocks.prototype.addMissing = function addMissing(func) {
        this.missing = func;
    };

    Blocks.prototype.compile = function compile(name, params, hash, template, inverse, builder) {
        var index = this.names[name];
        if (index === undefined) {
            debugAssert(!!this.missing, name + ' not found, and no catch-all block handler was registered');
            var func = this.missing;
            var handled = func(name, params, hash, template, inverse, builder);
            debugAssert(!!handled, name + ' not found, and the catch-all block handler didn\'t handle it');
        } else {
            var _func = this.funcs[index];
            _func(params, hash, template, inverse, builder);
        }
    };

    return Blocks;
}();
var BLOCKS = new Blocks();
var Inlines = function () {
    function Inlines() {
        _classCallCheck$29(this, Inlines);

        this.names = dict();
        this.funcs = [];
    }

    Inlines.prototype.add = function add(name, func) {
        this.funcs.push(func);
        this.names[name] = this.funcs.length - 1;
    };

    Inlines.prototype.addMissing = function addMissing(func) {
        this.missing = func;
    };

    Inlines.prototype.compile = function compile(sexp, builder) {
        var value = sexp[1];
        // TODO: Fix this so that expression macros can return
        // things like components, so that {{component foo}}
        // is the same as {{(component foo)}}
        if (!Array.isArray(value)) return ['expr', value];
        var name = void 0;
        var params = void 0;
        var hash = void 0;
        if (value[0] === Ops$2.Helper) {
            name = value[1];
            params = value[2];
            hash = value[3];
        } else if (value[0] === Ops$2.Unknown) {
            name = value[1];
            params = hash = null;
        } else {
            return ['expr', value];
        }
        var index = this.names[name];
        if (index === undefined && this.missing) {
            var func = this.missing;
            var returned = func(name, params, hash, builder);
            return returned === false ? ['expr', value] : returned;
        } else if (index !== undefined) {
            var _func2 = this.funcs[index];
            var _returned = _func2(name, params, hash, builder);
            return _returned === false ? ['expr', value] : _returned;
        } else {
            return ['expr', value];
        }
    };

    return Inlines;
}();
var INLINES = new Inlines();
populateBuiltins(BLOCKS, INLINES);
function populateBuiltins() {
    var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Blocks();
    var inlines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Inlines();

    blocks.add('if', function (params, _hash, template, inverse, builder) {
        //        PutArgs
        //        Test(Environment)
        //        Enter(BEGIN, END)
        // BEGIN: Noop
        //        JumpUnless(ELSE)
        //        Evaluate(default)
        //        Jump(END)
        // ELSE:  Noop
        //        Evalulate(inverse)
        // END:   Noop
        //        Exit
        if (!params || params.length !== 1) {
            throw new Error('SYNTAX ERROR: #if requires a single argument');
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        expr(params[0], builder);
        builder.test('environment');
        builder.enter(1);
        builder.jumpUnless('ELSE');
        builder.invokeStatic(template);
        if (inverse) {
            builder.jump('EXIT');
            builder.label('ELSE');
            builder.invokeStatic(inverse);
            builder.label('EXIT');
            builder.exit();
            builder.return();
        } else {
            builder.label('ELSE');
            builder.exit();
            builder.return();
        }
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('unless', function (params, _hash, template, inverse, builder) {
        //        PutArgs
        //        Test(Environment)
        //        Enter(BEGIN, END)
        // BEGIN: Noop
        //        JumpUnless(ELSE)
        //        Evaluate(default)
        //        Jump(END)
        // ELSE:  Noop
        //        Evalulate(inverse)
        // END:   Noop
        //        Exit
        if (!params || params.length !== 1) {
            throw new Error('SYNTAX ERROR: #unless requires a single argument');
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        expr(params[0], builder);
        builder.test('environment');
        builder.enter(1);
        builder.jumpIf('ELSE');
        builder.invokeStatic(template);
        if (inverse) {
            builder.jump('EXIT');
            builder.label('ELSE');
            builder.invokeStatic(inverse);
            builder.label('EXIT');
            builder.exit();
            builder.return();
        } else {
            builder.label('ELSE');
            builder.exit();
            builder.return();
        }
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('with', function (params, _hash, template, inverse, builder) {
        //        PutArgs
        //        Test(Environment)
        //        Enter(BEGIN, END)
        // BEGIN: Noop
        //        JumpUnless(ELSE)
        //        Evaluate(default)
        //        Jump(END)
        // ELSE:  Noop
        //        Evalulate(inverse)
        // END:   Noop
        //        Exit
        if (!params || params.length !== 1) {
            throw new Error('SYNTAX ERROR: #with requires a single argument');
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        expr(params[0], builder);
        builder.dup();
        builder.test('environment');
        builder.enter(2);
        builder.jumpUnless('ELSE');
        builder.invokeStatic(template, 1);
        if (inverse) {
            builder.jump('EXIT');
            builder.label('ELSE');
            builder.invokeStatic(inverse);
            builder.label('EXIT');
            builder.exit();
            builder.return();
        } else {
            builder.label('ELSE');
            builder.exit();
            builder.return();
        }
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('each', function (params, hash, template, inverse, builder) {
        //         Enter(BEGIN, END)
        // BEGIN:  Noop
        //         PutArgs
        //         PutIterable
        //         JumpUnless(ELSE)
        //         EnterList(BEGIN2, END2)
        // ITER:   Noop
        //         NextIter(BREAK)
        // BEGIN2: Noop
        //         PushChildScope
        //         Evaluate(default)
        //         PopScope
        // END2:   Noop
        //         Exit
        //         Jump(ITER)
        // BREAK:  Noop
        //         ExitList
        //         Jump(END)
        // ELSE:   Noop
        //         Evalulate(inverse)
        // END:    Noop
        //         Exit
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        if (hash && hash[0][0] === 'key') {
            expr(hash[1][0], builder);
        } else {
            builder.primitive(null);
        }
        expr(params[0], builder);
        builder.enter(2);
        builder.putIterator();
        builder.jumpUnless('ELSE');
        builder.pushFrame();
        builder.returnTo('ITER');
        builder.dup(Register.fp, 1);
        builder.enterList('BODY');
        builder.label('ITER');
        builder.iterate('BREAK');
        builder.label('BODY');
        builder.invokeStatic(template, 2);
        builder.pop(2);
        builder.exit();
        builder.return();
        builder.label('BREAK');
        builder.exitList();
        builder.popFrame();
        if (inverse) {
            builder.jump('EXIT');
            builder.label('ELSE');
            builder.invokeStatic(inverse);
            builder.label('EXIT');
            builder.exit();
            builder.return();
        } else {
            builder.label('ELSE');
            builder.exit();
            builder.return();
        }
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('-in-element', function (params, hash, template, _inverse, builder) {
        if (!params || params.length !== 1) {
            throw new Error('SYNTAX ERROR: #-in-element requires a single argument');
        }
        builder.startLabels();
        builder.pushFrame();
        builder.returnTo('END');
        if (hash && hash[0].length) {
            var keys = hash[0],
                values = hash[1];

            if (keys.length === 1 && keys[0] === 'nextSibling') {
                expr(values[0], builder);
            } else {
                throw new Error('SYNTAX ERROR: #-in-element does not take a `' + keys[0] + '` option');
            }
        } else {
            expr(null, builder);
        }
        expr(params[0], builder);
        builder.dup();
        builder.test('simple');
        builder.enter(3);
        builder.jumpUnless('ELSE');
        builder.pushRemoteElement();
        builder.invokeStatic(template);
        builder.popRemoteElement();
        builder.label('ELSE');
        builder.exit();
        builder.return();
        builder.label('END');
        builder.popFrame();
        builder.stopLabels();
    });
    blocks.add('-with-dynamic-vars', function (_params, hash, template, _inverse, builder) {
        if (hash) {
            var names = hash[0],
                expressions = hash[1];

            compileList(expressions, builder);
            builder.pushDynamicScope();
            builder.bindDynamicScope(names);
            builder.invokeStatic(template);
            builder.popDynamicScope();
        } else {
            builder.invokeStatic(template);
        }
    });
    return { blocks: blocks, inlines: inlines };
}
function compileStatement(statement, builder) {
    STATEMENTS.compile(statement, builder);
}
function compileStatements(statements, meta, env) {
    var b = new OpcodeBuilder(env, meta);
    for (var i = 0; i < statements.length; i++) {
        compileStatement(statements[i], b);
    }
    return b;
}

function _classCallCheck$27(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CompilableTemplate = function () {
    function CompilableTemplate(statements, symbolTable) {
        _classCallCheck$27(this, CompilableTemplate);

        this.statements = statements;
        this.symbolTable = symbolTable;
        this.compiledStatic = null;
        this.compiledDynamic = null;
    }

    CompilableTemplate.prototype.compileStatic = function compileStatic(env) {
        var compiledStatic = this.compiledStatic;

        if (!compiledStatic) {
            var builder = compileStatements(this.statements, this.symbolTable.meta, env);
            builder.finalize();
            var handle = builder.start;
            compiledStatic = this.compiledStatic = new CompiledStaticTemplate(handle);
        }
        return compiledStatic;
    };

    CompilableTemplate.prototype.compileDynamic = function compileDynamic(env) {
        var compiledDynamic = this.compiledDynamic;

        if (!compiledDynamic) {
            var staticBlock = this.compileStatic(env);
            compiledDynamic = new CompiledDynamicTemplate(staticBlock.handle, this.symbolTable);
        }
        return compiledDynamic;
    };

    return CompilableTemplate;
}();

function _classCallCheck$26(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Ops$$1 = Opcodes;

var Scanner = function () {
    function Scanner(block, env) {
        _classCallCheck$26(this, Scanner);

        this.block = block;
        this.env = env;
    }

    Scanner.prototype.scanEntryPoint = function scanEntryPoint(meta) {
        var block = this.block;
        var statements = block.statements,
            symbols = block.symbols,
            hasEval = block.hasEval;

        return new CompilableTemplate(statements, { meta: meta, symbols: symbols, hasEval: hasEval });
    };

    Scanner.prototype.scanBlock = function scanBlock(meta) {
        var block = this.block;
        var statements = block.statements;

        return new CompilableTemplate(statements, { meta: meta, parameters: EMPTY_ARRAY });
    };

    Scanner.prototype.scanLayout = function scanLayout(meta, attrs, componentName) {
        var block = this.block;
        var symbols = block.symbols,
            hasEval = block.hasEval;

        var scanner = new LayoutScanner(block, this.env, meta, attrs, componentName);
        return new CompilableTemplate(scanner.scan(), { meta: meta, hasEval: hasEval, symbols: symbols });
    };

    return Scanner;
}();

var LayoutScanner = function () {
    function LayoutScanner(block, env, meta, attrs, componentName) {
        _classCallCheck$26(this, LayoutScanner);

        this.env = env;
        this.attrs = attrs;
        this.componentName = componentName;
        this.state = 0 /* BeforeTopLevel */;
        var statements = block.statements,
            symbols = block.symbols;

        this.statements = statements;
        this.symbols = symbols;
        this.meta = meta.templateMeta;
    }

    LayoutScanner.prototype.scan = function scan() {
        var statements = this.statements;

        this.state = 0 /* BeforeTopLevel */;
        var buffer = [];
        for (var i = 0; i < statements.length; i++) {
            this.processStatement(this.statements[i], buffer);
        }
        buffer.push([Ops$$1.ClientSideStatement, Ops$1.DidRenderLayout]);
        return buffer;
    };

    LayoutScanner.prototype.processStatement = function processStatement(statement, buffer) {
        switch (this.state) {
            case 0 /* BeforeTopLevel */:
                this.processBeforeTopLevel(statement, buffer);
                break;
            case 1 /* InTopLevel */:
                this.processInTopLevel(statement, buffer);
                break;
            case 2 /* AfterFlush */:
                buffer.push(statement);
                break;
            default:
                throw unreachable();
        }
    };

    LayoutScanner.prototype.processBeforeTopLevel = function processBeforeTopLevel(statement, buffer) {
        if (Statements.isComponent(statement)) {
            this.processTopLevelComponent(statement, buffer);
        } else if (Statements.isOpenElement(statement)) {
            this.processIsOpenElement(statement, buffer);
        } else {
            // Should be whitespace
            buffer.push(statement);
        }
    };

    LayoutScanner.prototype.processTopLevelComponent = function processTopLevelComponent(statement, buffer) {
        var tagName = statement[1],
            attrs = statement[2],
            block = statement[4];

        if (this.env.hasComponentDefinition(tagName, this.meta) && tagName !== this.componentName) {
            buffer.push(statement);
            this.state = 2 /* AfterFlush */;
            return;
        }
        debugAssert(!this.env.hasComponentDefinition(tagName, this.meta) || tagName === this.componentName, 'Cannot use a component (<' + tagName + '>) as the top-level element in the layout of <' + this.componentName + '>');
        this.state = 1 /* InTopLevel */;
        buffer.push([Ops$$1.ClientSideStatement, Ops$1.SetComponentAttrs, true]);
        buffer.push([Ops$$1.ClientSideStatement, Ops$1.OpenComponentElement, tagName]);
        buffer.push([Ops$$1.ClientSideStatement, Ops$1.DidCreateElement]);
        for (var i = 0; i < attrs.length; i++) {
            this.processStatement(attrs[i], buffer);
        }
        this.processStatement([Ops$$1.FlushElement], buffer);
        if (block) {
            var statements = block.statements;

            for (var _i = 0; _i < statements.length; _i++) {
                this.processStatement(statements[_i], buffer);
            }
        }
        this.processStatement([Ops$$1.CloseElement], buffer);
    };

    LayoutScanner.prototype.processIsOpenElement = function processIsOpenElement(statement, buffer) {
        var tagName = statement[1];

        this.state = 1 /* InTopLevel */;
        buffer.push([Ops$$1.ClientSideStatement, Ops$1.SetComponentAttrs, true]);
        buffer.push([Ops$$1.ClientSideStatement, Ops$1.OpenComponentElement, tagName]);
        buffer.push([Ops$$1.ClientSideStatement, Ops$1.DidCreateElement]);
    };

    LayoutScanner.prototype.processInTopLevel = function processInTopLevel(statement, buffer) {
        debugAssert(!Statements.isModifier(statement), 'Cannot use element modifiers ({{' + statement[1] + ' ...}}) in the top-level element in the layout of <' + this.componentName + '>');
        if (Statements.isFlushElement(statement)) {
            var symbols = this.symbols,
                attrs = this.attrs;

            this.state = 2 /* AfterFlush */;
            var attrsSymbol = symbols.push(ATTRS_BLOCK);
            buffer.push.apply(buffer, attrs);
            buffer.push([Ops$$1.Yield, attrsSymbol, EMPTY_ARRAY]);
            buffer.push([Ops$$1.ClientSideStatement, Ops$1.SetComponentAttrs, false]);
        }
        buffer.push(statement);
    };

    return LayoutScanner;
}();

function _classCallCheck$35(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Constants = function () {
    function Constants() {
        _classCallCheck$35(this, Constants);

        // `0` means NULL
        this.references = [];
        this.strings = [];
        this.expressions = [];
        this.arrays = [];
        this.blocks = [];
        this.functions = [];
        this.others = [];
    }

    Constants.prototype.getReference = function getReference(value) {
        return this.references[value - 1];
    };

    Constants.prototype.reference = function reference(value) {
        var index = this.references.length;
        this.references.push(value);
        return index + 1;
    };

    Constants.prototype.getString = function getString(value) {
        return this.strings[value - 1];
    };

    Constants.prototype.string = function string(value) {
        var index = this.strings.length;
        this.strings.push(value);
        return index + 1;
    };

    Constants.prototype.getExpression = function getExpression(value) {
        return this.expressions[value - 1];
    };

    Constants.prototype.getArray = function getArray(value) {
        return this.arrays[value - 1];
    };

    Constants.prototype.getNames = function getNames(value) {
        var _names = [];
        var names = this.getArray(value);
        for (var i = 0; i < names.length; i++) {
            var n = names[i];
            _names[i] = this.getString(n);
        }
        return _names;
    };

    Constants.prototype.array = function array(values) {
        var index = this.arrays.length;
        this.arrays.push(values);
        return index + 1;
    };

    Constants.prototype.getBlock = function getBlock(value) {
        return this.blocks[value - 1];
    };

    Constants.prototype.block = function block(_block) {
        var index = this.blocks.length;
        this.blocks.push(_block);
        return index + 1;
    };

    Constants.prototype.getFunction = function getFunction(value) {
        return this.functions[value - 1];
    };

    Constants.prototype.function = function _function(f) {
        var index = this.functions.length;
        this.functions.push(f);
        return index + 1;
    };

    Constants.prototype.getOther = function getOther(value) {
        return this.others[value - 1];
    };

    Constants.prototype.other = function other(_other) {
        var index = this.others.length;
        this.others.push(_other);
        return index + 1;
    };

    return Constants;
}();

var badProtocols = ['javascript:', 'vbscript:'];
var badTags = ['A', 'BODY', 'LINK', 'IMG', 'IFRAME', 'BASE', 'FORM'];
var badTagsForDataURI = ['EMBED'];
var badAttributes = ['href', 'src', 'background', 'action'];
var badAttributesForDataURI = ['src'];
function has(array, item) {
    return array.indexOf(item) !== -1;
}
function checkURI(tagName, attribute) {
    return (tagName === null || has(badTags, tagName)) && has(badAttributes, attribute);
}
function checkDataURI(tagName, attribute) {
    if (tagName === null) return false;
    return has(badTagsForDataURI, tagName) && has(badAttributesForDataURI, attribute);
}
function requiresSanitization(tagName, attribute) {
    return checkURI(tagName, attribute) || checkDataURI(tagName, attribute);
}
function sanitizeAttributeValue(env, element, attribute, value) {
    var tagName = null;
    if (value === null || value === undefined) {
        return value;
    }
    if (isSafeString(value)) {
        return value.toHTML();
    }
    if (!element) {
        tagName = null;
    } else {
        tagName = element.tagName.toUpperCase();
    }
    var str = normalizeStringValue(value);
    if (checkURI(tagName, attribute)) {
        var protocol = env.protocolForURL(str);
        if (has(badProtocols, protocol)) {
            return 'unsafe:' + str;
        }
    }
    if (checkDataURI(tagName, attribute)) {
        return 'unsafe:' + str;
    }
    return str;
}

/*
 * @method normalizeProperty
 * @param element {HTMLElement}
 * @param slotName {String}
 * @returns {Object} { name, type }
 */
function normalizeProperty(element, slotName) {
    var type = void 0,
        normalized = void 0;
    if (slotName in element) {
        normalized = slotName;
        type = 'prop';
    } else {
        var lower = slotName.toLowerCase();
        if (lower in element) {
            type = 'prop';
            normalized = lower;
        } else {
            type = 'attr';
            normalized = slotName;
        }
    }
    if (type === 'prop' && (normalized.toLowerCase() === 'style' || preferAttr(element.tagName, normalized))) {
        type = 'attr';
    }
    return { normalized: normalized, type: type };
}

// properties that MUST be set as attributes, due to:
// * browser bug
// * strange spec outlier
var ATTR_OVERRIDES = {
    // phantomjs < 2.0 lets you set it as a prop but won't reflect it
    // back to the attribute. button.getAttribute('type') === null
    BUTTON: { type: true, form: true },
    INPUT: {
        // Some version of IE (like IE9) actually throw an exception
        // if you set input.type = 'something-unknown'
        type: true,
        form: true,
        // Chrome 46.0.2464.0: 'autocorrect' in document.createElement('input') === false
        // Safari 8.0.7: 'autocorrect' in document.createElement('input') === false
        // Mobile Safari (iOS 8.4 simulator): 'autocorrect' in document.createElement('input') === true
        autocorrect: true,
        // Chrome 54.0.2840.98: 'list' in document.createElement('input') === true
        // Safari 9.1.3: 'list' in document.createElement('input') === false
        list: true
    },
    // element.form is actually a legitimate readOnly property, that is to be
    // mutated, but must be mutated by setAttribute...
    SELECT: { form: true },
    OPTION: { form: true },
    TEXTAREA: { form: true },
    LABEL: { form: true },
    FIELDSET: { form: true },
    LEGEND: { form: true },
    OBJECT: { form: true }
};
function preferAttr(tagName, propName) {
    var tag = ATTR_OVERRIDES[tagName.toUpperCase()];
    return tag && tag[propName.toLowerCase()] || false;
}

function _defaults$18(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$38(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$18(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$18(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$18(subClass, superClass);
}

var innerHTMLWrapper = {
    colgroup: { depth: 2, before: '<table><colgroup>', after: '</colgroup></table>' },
    table: { depth: 1, before: '<table>', after: '</table>' },
    tbody: { depth: 2, before: '<table><tbody>', after: '</tbody></table>' },
    tfoot: { depth: 2, before: '<table><tfoot>', after: '</tfoot></table>' },
    thead: { depth: 2, before: '<table><thead>', after: '</thead></table>' },
    tr: { depth: 3, before: '<table><tbody><tr>', after: '</tr></tbody></table>' }
};
// Patch:    innerHTML Fix
// Browsers: IE9
// Reason:   IE9 don't allow us to set innerHTML on col, colgroup, frameset,
//           html, style, table, tbody, tfoot, thead, title, tr.
// Fix:      Wrap the innerHTML we are about to set in its parents, apply the
//           wrapped innerHTML on a div, then move the unwrapped nodes into the
//           target position.
function domChanges(document, DOMChangesClass) {
    if (!document) return DOMChangesClass;
    if (!shouldApplyFix(document)) {
        return DOMChangesClass;
    }
    var div = document.createElement('div');
    return function (_DOMChangesClass) {
        _inherits$18(DOMChangesWithInnerHTMLFix, _DOMChangesClass);

        function DOMChangesWithInnerHTMLFix() {
            _classCallCheck$38(this, DOMChangesWithInnerHTMLFix);

            return _possibleConstructorReturn$18(this, _DOMChangesClass.apply(this, arguments));
        }

        DOMChangesWithInnerHTMLFix.prototype.insertHTMLBefore = function insertHTMLBefore$$1(parent, nextSibling, html) {
            if (html === null || html === '') {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            var parentTag = parent.tagName.toLowerCase();
            var wrapper = innerHTMLWrapper[parentTag];
            if (wrapper === undefined) {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            return fixInnerHTML(parent, wrapper, div, html, nextSibling);
        };

        return DOMChangesWithInnerHTMLFix;
    }(DOMChangesClass);
}
function treeConstruction(document, DOMTreeConstructionClass) {
    if (!document) return DOMTreeConstructionClass;
    if (!shouldApplyFix(document)) {
        return DOMTreeConstructionClass;
    }
    var div = document.createElement('div');
    return function (_DOMTreeConstructionC) {
        _inherits$18(DOMTreeConstructionWithInnerHTMLFix, _DOMTreeConstructionC);

        function DOMTreeConstructionWithInnerHTMLFix() {
            _classCallCheck$38(this, DOMTreeConstructionWithInnerHTMLFix);

            return _possibleConstructorReturn$18(this, _DOMTreeConstructionC.apply(this, arguments));
        }

        DOMTreeConstructionWithInnerHTMLFix.prototype.insertHTMLBefore = function insertHTMLBefore$$1(parent, referenceNode, html) {
            if (html === null || html === '') {
                return _DOMTreeConstructionC.prototype.insertHTMLBefore.call(this, parent, referenceNode, html);
            }
            var parentTag = parent.tagName.toLowerCase();
            var wrapper = innerHTMLWrapper[parentTag];
            if (wrapper === undefined) {
                return _DOMTreeConstructionC.prototype.insertHTMLBefore.call(this, parent, referenceNode, html);
            }
            return fixInnerHTML(parent, wrapper, div, html, referenceNode);
        };

        return DOMTreeConstructionWithInnerHTMLFix;
    }(DOMTreeConstructionClass);
}
function fixInnerHTML(parent, wrapper, div, html, reference) {
    var wrappedHtml = wrapper.before + html + wrapper.after;
    div.innerHTML = wrappedHtml;
    var parentNode = div;
    for (var i = 0; i < wrapper.depth; i++) {
        parentNode = parentNode.childNodes[0];
    }

    var _moveNodesBefore = moveNodesBefore(parentNode, parent, reference),
        first = _moveNodesBefore[0],
        last = _moveNodesBefore[1];

    return new ConcreteBounds(parent, first, last);
}
function shouldApplyFix(document) {
    var table = document.createElement('table');
    try {
        table.innerHTML = '<tbody></tbody>';
    } catch (e) {} finally {
        if (table.childNodes.length !== 0) {
            // It worked as expected, no fix required
            return false;
        }
    }
    return true;
}

function _defaults$19(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$39(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$19(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$19(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$19(subClass, superClass);
}

var SVG_NAMESPACE$1 = 'http://www.w3.org/2000/svg';
// Patch:    insertAdjacentHTML on SVG Fix
// Browsers: Safari, IE, Edge, Firefox ~33-34
// Reason:   insertAdjacentHTML does not exist on SVG elements in Safari. It is
//           present but throws an exception on IE and Edge. Old versions of
//           Firefox create nodes in the incorrect namespace.
// Fix:      Since IE and Edge silently fail to create SVG nodes using
//           innerHTML, and because Firefox may create nodes in the incorrect
//           namespace using innerHTML on SVG elements, an HTML-string wrapping
//           approach is used. A pre/post SVG tag is added to the string, then
//           that whole string is added to a div. The created nodes are plucked
//           out and applied to the target location on DOM.
function domChanges$1(document, DOMChangesClass, svgNamespace) {
    if (!document) return DOMChangesClass;
    if (!shouldApplyFix$1(document, svgNamespace)) {
        return DOMChangesClass;
    }
    var div = document.createElement('div');
    return function (_DOMChangesClass) {
        _inherits$19(DOMChangesWithSVGInnerHTMLFix, _DOMChangesClass);

        function DOMChangesWithSVGInnerHTMLFix() {
            _classCallCheck$39(this, DOMChangesWithSVGInnerHTMLFix);

            return _possibleConstructorReturn$19(this, _DOMChangesClass.apply(this, arguments));
        }

        DOMChangesWithSVGInnerHTMLFix.prototype.insertHTMLBefore = function insertHTMLBefore$$1(parent, nextSibling, html) {
            if (html === null || html === '') {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            if (parent.namespaceURI !== svgNamespace) {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            return fixSVG(parent, div, html, nextSibling);
        };

        return DOMChangesWithSVGInnerHTMLFix;
    }(DOMChangesClass);
}
function treeConstruction$1(document, TreeConstructionClass, svgNamespace) {
    if (!document) return TreeConstructionClass;
    if (!shouldApplyFix$1(document, svgNamespace)) {
        return TreeConstructionClass;
    }
    var div = document.createElement('div');
    return function (_TreeConstructionClas) {
        _inherits$19(TreeConstructionWithSVGInnerHTMLFix, _TreeConstructionClas);

        function TreeConstructionWithSVGInnerHTMLFix() {
            _classCallCheck$39(this, TreeConstructionWithSVGInnerHTMLFix);

            return _possibleConstructorReturn$19(this, _TreeConstructionClas.apply(this, arguments));
        }

        TreeConstructionWithSVGInnerHTMLFix.prototype.insertHTMLBefore = function insertHTMLBefore$$1(parent, reference, html) {
            if (html === null || html === '') {
                return _TreeConstructionClas.prototype.insertHTMLBefore.call(this, parent, reference, html);
            }
            if (parent.namespaceURI !== svgNamespace) {
                return _TreeConstructionClas.prototype.insertHTMLBefore.call(this, parent, reference, html);
            }
            return fixSVG(parent, div, html, reference);
        };

        return TreeConstructionWithSVGInnerHTMLFix;
    }(TreeConstructionClass);
}
function fixSVG(parent, div, html, reference) {
    // IE, Edge: also do not correctly support using `innerHTML` on SVG
    // namespaced elements. So here a wrapper is used.
    var wrappedHtml = '<svg>' + html + '</svg>';
    div.innerHTML = wrappedHtml;

    var _moveNodesBefore = moveNodesBefore(div.firstChild, parent, reference),
        first = _moveNodesBefore[0],
        last = _moveNodesBefore[1];

    return new ConcreteBounds(parent, first, last);
}
function shouldApplyFix$1(document, svgNamespace) {
    var svg = document.createElementNS(svgNamespace, 'svg');
    try {
        svg['insertAdjacentHTML']('beforeend', '<circle></circle>');
    } catch (e) {
        // IE, Edge: Will throw, insertAdjacentHTML is unsupported on SVG
        // Safari: Will throw, insertAdjacentHTML is not present on SVG
    } finally {
        // FF: Old versions will create a node in the wrong namespace
        if (svg.childNodes.length === 1 && svg.firstChild.namespaceURI === SVG_NAMESPACE$1) {
            // The test worked as expected, no fix required
            return false;
        }
        return true;
    }
}

function _defaults$20(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _classCallCheck$40(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn$20(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$20(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$20(subClass, superClass);
}

// Patch:    Adjacent text node merging fix
// Browsers: IE, Edge, Firefox w/o inspector open
// Reason:   These browsers will merge adjacent text nodes. For exmaple given
//           <div>Hello</div> with div.insertAdjacentHTML(' world') browsers
//           with proper behavior will populate div.childNodes with two items.
//           These browsers will populate it with one merged node instead.
// Fix:      Add these nodes to a wrapper element, then iterate the childNodes
//           of that wrapper and move the nodes to their target location. Note
//           that potential SVG bugs will have been handled before this fix.
//           Note that this fix must only apply to the previous text node, as
//           the base implementation of `insertHTMLBefore` already handles
//           following text nodes correctly.
function domChanges$2(document, DOMChangesClass) {
    if (!document) return DOMChangesClass;
    if (!shouldApplyFix$2(document)) {
        return DOMChangesClass;
    }
    return function (_DOMChangesClass) {
        _inherits$20(DOMChangesWithTextNodeMergingFix, _DOMChangesClass);

        function DOMChangesWithTextNodeMergingFix(document) {
            _classCallCheck$40(this, DOMChangesWithTextNodeMergingFix);

            var _this = _possibleConstructorReturn$20(this, _DOMChangesClass.call(this, document));

            _this.uselessComment = document.createComment('');
            return _this;
        }

        DOMChangesWithTextNodeMergingFix.prototype.insertHTMLBefore = function insertHTMLBefore(parent, nextSibling, html) {
            if (html === null) {
                return _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            }
            var didSetUselessComment = false;
            var nextPrevious = nextSibling ? nextSibling.previousSibling : parent.lastChild;
            if (nextPrevious && nextPrevious instanceof Text) {
                didSetUselessComment = true;
                parent.insertBefore(this.uselessComment, nextSibling);
            }
            var bounds = _DOMChangesClass.prototype.insertHTMLBefore.call(this, parent, nextSibling, html);
            if (didSetUselessComment) {
                parent.removeChild(this.uselessComment);
            }
            return bounds;
        };

        return DOMChangesWithTextNodeMergingFix;
    }(DOMChangesClass);
}
function treeConstruction$2(document, TreeConstructionClass) {
    if (!document) return TreeConstructionClass;
    if (!shouldApplyFix$2(document)) {
        return TreeConstructionClass;
    }
    return function (_TreeConstructionClas) {
        _inherits$20(TreeConstructionWithTextNodeMergingFix, _TreeConstructionClas);

        function TreeConstructionWithTextNodeMergingFix(document) {
            _classCallCheck$40(this, TreeConstructionWithTextNodeMergingFix);

            var _this2 = _possibleConstructorReturn$20(this, _TreeConstructionClas.call(this, document));

            _this2.uselessComment = _this2.createComment('');
            return _this2;
        }

        TreeConstructionWithTextNodeMergingFix.prototype.insertHTMLBefore = function insertHTMLBefore(parent, reference, html) {
            if (html === null) {
                return _TreeConstructionClas.prototype.insertHTMLBefore.call(this, parent, reference, html);
            }
            var didSetUselessComment = false;
            var nextPrevious = reference ? reference.previousSibling : parent.lastChild;
            if (nextPrevious && nextPrevious instanceof Text) {
                didSetUselessComment = true;
                parent.insertBefore(this.uselessComment, reference);
            }
            var bounds = _TreeConstructionClas.prototype.insertHTMLBefore.call(this, parent, reference, html);
            if (didSetUselessComment) {
                parent.removeChild(this.uselessComment);
            }
            return bounds;
        };

        return TreeConstructionWithTextNodeMergingFix;
    }(TreeConstructionClass);
}
function shouldApplyFix$2(document) {
    var mergingTextDiv = document.createElement('div');
    mergingTextDiv.innerHTML = 'first';
    mergingTextDiv.insertAdjacentHTML('beforeend', 'second');
    if (mergingTextDiv.childNodes.length === 2) {
        // It worked as expected, no fix required
        return false;
    }
    return true;
}

function _defaults$17(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn$17(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$17(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$17(subClass, superClass);
}

function _classCallCheck$37(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var SVG_NAMESPACE$$1 = 'http://www.w3.org/2000/svg';
// http://www.w3.org/TR/html/syntax.html#html-integration-point
var SVG_INTEGRATION_POINTS = { foreignObject: 1, desc: 1, title: 1 };
// http://www.w3.org/TR/html/syntax.html#adjust-svg-attributes
// TODO: Adjust SVG attributes
// http://www.w3.org/TR/html/syntax.html#parsing-main-inforeign
// TODO: Adjust SVG elements
// http://www.w3.org/TR/html/syntax.html#parsing-main-inforeign
var BLACKLIST_TABLE = Object.create(null);
["b", "big", "blockquote", "body", "br", "center", "code", "dd", "div", "dl", "dt", "em", "embed", "h1", "h2", "h3", "h4", "h5", "h6", "head", "hr", "i", "img", "li", "listing", "main", "meta", "nobr", "ol", "p", "pre", "ruby", "s", "small", "span", "strong", "strike", "sub", "sup", "table", "tt", "u", "ul", "var"].forEach(function (tag) {
    return BLACKLIST_TABLE[tag] = 1;
});
var doc = typeof document === 'undefined' ? null : document;

function moveNodesBefore(source, target, nextSibling) {
    var first = source.firstChild;
    var last = null;
    var current = first;
    while (current) {
        last = current;
        current = current.nextSibling;
        target.insertBefore(last, nextSibling);
    }
    return [first, last];
}
var DOMOperations = function () {
    function DOMOperations(document) {
        _classCallCheck$37(this, DOMOperations);

        this.document = document;
        this.setupUselessElement();
    }
    // split into seperate method so that NodeDOMTreeConstruction
    // can override it.


    DOMOperations.prototype.setupUselessElement = function setupUselessElement() {
        this.uselessElement = this.document.createElement('div');
    };

    DOMOperations.prototype.createElement = function createElement(tag, context) {
        var isElementInSVGNamespace = void 0,
            isHTMLIntegrationPoint = void 0;
        if (context) {
            isElementInSVGNamespace = context.namespaceURI === SVG_NAMESPACE$$1 || tag === 'svg';
            isHTMLIntegrationPoint = SVG_INTEGRATION_POINTS[context.tagName];
        } else {
            isElementInSVGNamespace = tag === 'svg';
            isHTMLIntegrationPoint = false;
        }
        if (isElementInSVGNamespace && !isHTMLIntegrationPoint) {
            // FIXME: This does not properly handle <font> with color, face, or
            // size attributes, which is also disallowed by the spec. We should fix
            // this.
            if (BLACKLIST_TABLE[tag]) {
                throw new Error('Cannot create a ' + tag + ' inside an SVG context');
            }
            return this.document.createElementNS(SVG_NAMESPACE$$1, tag);
        } else {
            return this.document.createElement(tag);
        }
    };

    DOMOperations.prototype.insertBefore = function insertBefore(parent, node, reference) {
        parent.insertBefore(node, reference);
    };

    DOMOperations.prototype.insertHTMLBefore = function insertHTMLBefore(_parent, nextSibling, html) {
        return _insertHTMLBefore(this.uselessElement, _parent, nextSibling, html);
    };

    DOMOperations.prototype.createTextNode = function createTextNode(text) {
        return this.document.createTextNode(text);
    };

    DOMOperations.prototype.createComment = function createComment(data) {
        return this.document.createComment(data);
    };

    return DOMOperations;
}();
var DOM;
(function (DOM) {
    var TreeConstruction = function (_DOMOperations) {
        _inherits$17(TreeConstruction, _DOMOperations);

        function TreeConstruction() {
            _classCallCheck$37(this, TreeConstruction);

            return _possibleConstructorReturn$17(this, _DOMOperations.apply(this, arguments));
        }

        TreeConstruction.prototype.createElementNS = function createElementNS(namespace, tag) {
            return this.document.createElementNS(namespace, tag);
        };

        TreeConstruction.prototype.setAttribute = function setAttribute(element, name, value) {
            var namespace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            if (namespace) {
                element.setAttributeNS(namespace, name, value);
            } else {
                element.setAttribute(name, value);
            }
        };

        return TreeConstruction;
    }(DOMOperations);

    DOM.TreeConstruction = TreeConstruction;
    var appliedTreeContruction = TreeConstruction;
    appliedTreeContruction = treeConstruction$2(doc, appliedTreeContruction);
    appliedTreeContruction = treeConstruction(doc, appliedTreeContruction);
    appliedTreeContruction = treeConstruction$1(doc, appliedTreeContruction, SVG_NAMESPACE$$1);
    DOM.DOMTreeConstruction = appliedTreeContruction;
})(DOM || (DOM = {}));
var DOMChanges = function (_DOMOperations2) {
    _inherits$17(DOMChanges, _DOMOperations2);

    function DOMChanges(document) {
        _classCallCheck$37(this, DOMChanges);

        var _this2 = _possibleConstructorReturn$17(this, _DOMOperations2.call(this, document));

        _this2.document = document;
        _this2.namespace = null;
        return _this2;
    }

    DOMChanges.prototype.setAttribute = function setAttribute(element, name, value) {
        element.setAttribute(name, value);
    };

    DOMChanges.prototype.setAttributeNS = function setAttributeNS(element, namespace, name, value) {
        element.setAttributeNS(namespace, name, value);
    };

    DOMChanges.prototype.removeAttribute = function removeAttribute(element, name) {
        element.removeAttribute(name);
    };

    DOMChanges.prototype.removeAttributeNS = function removeAttributeNS(element, namespace, name) {
        element.removeAttributeNS(namespace, name);
    };

    DOMChanges.prototype.insertNodeBefore = function insertNodeBefore(parent, node, reference) {
        if (isDocumentFragment(node)) {
            var firstChild = node.firstChild,
                lastChild = node.lastChild;

            this.insertBefore(parent, node, reference);
            return new ConcreteBounds(parent, firstChild, lastChild);
        } else {
            this.insertBefore(parent, node, reference);
            return new SingleNodeBounds(parent, node);
        }
    };

    DOMChanges.prototype.insertTextBefore = function insertTextBefore(parent, nextSibling, text) {
        var textNode = this.createTextNode(text);
        this.insertBefore(parent, textNode, nextSibling);
        return textNode;
    };

    DOMChanges.prototype.insertBefore = function insertBefore(element, node, reference) {
        element.insertBefore(node, reference);
    };

    DOMChanges.prototype.insertAfter = function insertAfter(element, node, reference) {
        this.insertBefore(element, node, reference.nextSibling);
    };

    return DOMChanges;
}(DOMOperations);
function _insertHTMLBefore(_useless, _parent, _nextSibling, html) {
    // TypeScript vendored an old version of the DOM spec where `insertAdjacentHTML`
    // only exists on `HTMLElement` but not on `Element`. We actually work with the
    // newer version of the DOM API here (and monkey-patch this method in `./compat`
    // when we detect older browsers). This is a hack to work around this limitation.
    var parent = _parent;
    var useless = _useless;
    var nextSibling = _nextSibling;
    var prev = nextSibling ? nextSibling.previousSibling : parent.lastChild;
    var last = void 0;
    if (html === null || html === '') {
        return new ConcreteBounds(parent, null, null);
    }
    if (nextSibling === null) {
        parent.insertAdjacentHTML('beforeend', html);
        last = parent.lastChild;
    } else if (nextSibling instanceof HTMLElement) {
        nextSibling.insertAdjacentHTML('beforebegin', html);
        last = nextSibling.previousSibling;
    } else {
        // Non-element nodes do not support insertAdjacentHTML, so add an
        // element and call it on that element. Then remove the element.
        //
        // This also protects Edge, IE and Firefox w/o the inspector open
        // from merging adjacent text nodes. See ./compat/text-node-merging-fix.ts
        parent.insertBefore(useless, nextSibling);
        useless.insertAdjacentHTML('beforebegin', html);
        last = useless.previousSibling;
        parent.removeChild(useless);
    }
    var first = prev ? prev.nextSibling : parent.firstChild;
    return new ConcreteBounds(parent, first, last);
}
function isDocumentFragment(node) {
    return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
var helper = DOMChanges;
helper = domChanges$2(doc, helper);
helper = domChanges(doc, helper);
helper = domChanges$1(doc, helper, SVG_NAMESPACE$$1);
var DOMChanges$1 = helper;
var DOMTreeConstruction = DOM.DOMTreeConstruction;

function _defaults$16(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

function _possibleConstructorReturn$16(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$16(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$16(subClass, superClass);
}

function _classCallCheck$36(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function defaultDynamicAttributes(element, attr) {
    var tagName = element.tagName,
        namespaceURI = element.namespaceURI;

    if (namespaceURI === SVG_NAMESPACE$$1) {
        return defaultDynamicAttribute(tagName, attr);
    }

    var _normalizeProperty = normalizeProperty(element, attr),
        type = _normalizeProperty.type,
        normalized = _normalizeProperty.normalized;

    if (type === 'attr') {
        return defaultDynamicAttribute(tagName, normalized);
    } else {
        return defaultDynamicProperty(tagName, normalized);
    }
}
function defaultDynamicAttribute(tagName, name) {
    if (requiresSanitization(tagName, name)) {
        return SafeDynamicAttribute;
    } else {
        return SimpleDynamicAttribute;
    }
}
function defaultDynamicProperty(tagName, name) {
    if (requiresSanitization(tagName, name)) {
        return SafeDynamicProperty;
    }
    if (isUserInputValue(tagName, name)) {
        return InputValueDynamicAttribute;
    }
    if (isOptionSelected(tagName, name)) {
        return OptionSelectedDynamicAttribute;
    }
    return DefaultDynamicProperty;
}
var DynamicAttribute = function DynamicAttribute(attribute) {
    _classCallCheck$36(this, DynamicAttribute);

    this.attribute = attribute;
};
var SimpleDynamicAttribute = function (_DynamicAttribute) {
    _inherits$16(SimpleDynamicAttribute, _DynamicAttribute);

    function SimpleDynamicAttribute() {
        _classCallCheck$36(this, SimpleDynamicAttribute);

        return _possibleConstructorReturn$16(this, _DynamicAttribute.apply(this, arguments));
    }

    SimpleDynamicAttribute.prototype.set = function set(dom, value, _env) {
        var normalizedValue = normalizeValue(value);
        if (normalizedValue !== null) {
            var _attribute = this.attribute,
                name = _attribute.name,
                namespace = _attribute.namespace;

            dom.__setAttribute(name, normalizedValue, namespace);
        }
    };

    SimpleDynamicAttribute.prototype.update = function update(value, _env) {
        var normalizedValue = normalizeValue(value);
        var _attribute2 = this.attribute,
            element = _attribute2.element,
            name = _attribute2.name;

        if (normalizedValue === null) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, normalizedValue);
        }
    };

    return SimpleDynamicAttribute;
}(DynamicAttribute);
var DefaultDynamicProperty = function (_DynamicAttribute2) {
    _inherits$16(DefaultDynamicProperty, _DynamicAttribute2);

    function DefaultDynamicProperty() {
        _classCallCheck$36(this, DefaultDynamicProperty);

        return _possibleConstructorReturn$16(this, _DynamicAttribute2.apply(this, arguments));
    }

    DefaultDynamicProperty.prototype.set = function set(dom, value, _env) {
        if (value !== null && value !== undefined) {
            var name = this.attribute.name;

            dom.__setProperty(name, value);
        }
    };

    DefaultDynamicProperty.prototype.update = function update(value, _env) {
        var _attribute3 = this.attribute,
            element = _attribute3.element,
            name = _attribute3.name;

        element[name] = value;
        if (value === null || value === undefined) {
            this.removeAttribute();
        }
    };

    DefaultDynamicProperty.prototype.removeAttribute = function removeAttribute() {
        // TODO this sucks but to preserve properties first and to meet current
        // semantics we must do this.
        var _attribute4 = this.attribute,
            element = _attribute4.element,
            name = _attribute4.name,
            namespace = _attribute4.namespace;

        if (namespace) {
            element.removeAttributeNS(namespace, name);
        } else {
            element.removeAttribute(name);
        }
    };

    return DefaultDynamicProperty;
}(DynamicAttribute);
var SafeDynamicProperty = function (_DefaultDynamicProper) {
    _inherits$16(SafeDynamicProperty, _DefaultDynamicProper);

    function SafeDynamicProperty() {
        _classCallCheck$36(this, SafeDynamicProperty);

        return _possibleConstructorReturn$16(this, _DefaultDynamicProper.apply(this, arguments));
    }

    SafeDynamicProperty.prototype.set = function set(dom, value, env) {
        var _attribute5 = this.attribute,
            element = _attribute5.element,
            name = _attribute5.name;

        var sanitized = sanitizeAttributeValue(env, element, name, value);
        _DefaultDynamicProper.prototype.set.call(this, dom, sanitized, env);
    };

    SafeDynamicProperty.prototype.update = function update(value, env) {
        var _attribute6 = this.attribute,
            element = _attribute6.element,
            name = _attribute6.name;

        var sanitized = sanitizeAttributeValue(env, element, name, value);
        _DefaultDynamicProper.prototype.update.call(this, sanitized, env);
    };

    return SafeDynamicProperty;
}(DefaultDynamicProperty);
var SafeDynamicAttribute = function (_SimpleDynamicAttribu) {
    _inherits$16(SafeDynamicAttribute, _SimpleDynamicAttribu);

    function SafeDynamicAttribute() {
        _classCallCheck$36(this, SafeDynamicAttribute);

        return _possibleConstructorReturn$16(this, _SimpleDynamicAttribu.apply(this, arguments));
    }

    SafeDynamicAttribute.prototype.set = function set(dom, value, env) {
        var _attribute7 = this.attribute,
            element = _attribute7.element,
            name = _attribute7.name;

        var sanitized = sanitizeAttributeValue(env, element, name, value);
        _SimpleDynamicAttribu.prototype.set.call(this, dom, sanitized, env);
    };

    SafeDynamicAttribute.prototype.update = function update(value, env) {
        var _attribute8 = this.attribute,
            element = _attribute8.element,
            name = _attribute8.name;

        var sanitized = sanitizeAttributeValue(env, element, name, value);
        _SimpleDynamicAttribu.prototype.update.call(this, sanitized, env);
    };

    return SafeDynamicAttribute;
}(SimpleDynamicAttribute);
var InputValueDynamicAttribute = function (_DefaultDynamicProper2) {
    _inherits$16(InputValueDynamicAttribute, _DefaultDynamicProper2);

    function InputValueDynamicAttribute() {
        _classCallCheck$36(this, InputValueDynamicAttribute);

        return _possibleConstructorReturn$16(this, _DefaultDynamicProper2.apply(this, arguments));
    }

    InputValueDynamicAttribute.prototype.set = function set(dom, value) {
        dom.__setProperty('value', normalizeStringValue(value));
    };

    InputValueDynamicAttribute.prototype.update = function update(value) {
        var input = this.attribute.element;
        var currentValue = input.value;
        var normalizedValue = normalizeStringValue(value);
        if (currentValue !== normalizedValue) {
            input.value = normalizedValue;
        }
    };

    return InputValueDynamicAttribute;
}(DefaultDynamicProperty);
var OptionSelectedDynamicAttribute = function (_DefaultDynamicProper3) {
    _inherits$16(OptionSelectedDynamicAttribute, _DefaultDynamicProper3);

    function OptionSelectedDynamicAttribute() {
        _classCallCheck$36(this, OptionSelectedDynamicAttribute);

        return _possibleConstructorReturn$16(this, _DefaultDynamicProper3.apply(this, arguments));
    }

    OptionSelectedDynamicAttribute.prototype.set = function set(dom, value) {
        if (value !== null && value !== undefined && value !== false) {
            dom.__setProperty('selected', true);
        }
    };

    OptionSelectedDynamicAttribute.prototype.update = function update(value) {
        var option = this.attribute.element;
        if (value) {
            option.selected = true;
        } else {
            option.selected = false;
        }
    };

    return OptionSelectedDynamicAttribute;
}(DefaultDynamicProperty);
function isOptionSelected(tagName, attribute) {
    return tagName === 'OPTION' && attribute === 'selected';
}
function isUserInputValue(tagName, attribute) {
    return (tagName === 'INPUT' || tagName === 'TEXTAREA') && attribute === 'value';
}
function normalizeValue(value) {
    if (value === false || value === undefined || value === null || typeof value.toString === 'undefined') {
        return null;
    }
    if (value === true) {
        return '';
    }
    // onclick function etc in SSR
    if (typeof value === 'function') {
        return null;
    }
    return String(value);
}

var _createClass$6 = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck$34(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Scope = function () {
    function Scope(
    // the 0th slot is `self`
    slots, callerScope,
    // named arguments and blocks passed to a layout that uses eval
    evalScope,
    // locals in scope when the partial was invoked
    partialMap) {
        _classCallCheck$34(this, Scope);

        this.slots = slots;
        this.callerScope = callerScope;
        this.evalScope = evalScope;
        this.partialMap = partialMap;
    }

    Scope.root = function root(self) {
        var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var refs = new Array(size + 1);
        for (var i = 0; i <= size; i++) {
            refs[i] = UNDEFINED_REFERENCE;
        }
        return new Scope(refs, null, null, null).init({ self: self });
    };

    Scope.sized = function sized() {
        var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var refs = new Array(size + 1);
        for (var i = 0; i <= size; i++) {
            refs[i] = UNDEFINED_REFERENCE;
        }
        return new Scope(refs, null, null, null);
    };

    Scope.prototype.init = function init(_ref) {
        var self = _ref.self;

        this.slots[0] = self;
        return this;
    };

    Scope.prototype.getSelf = function getSelf() {
        return this.get(0);
    };

    Scope.prototype.getSymbol = function getSymbol(symbol) {
        return this.get(symbol);
    };

    Scope.prototype.getBlock = function getBlock(symbol) {
        return this.get(symbol);
    };

    Scope.prototype.getEvalScope = function getEvalScope() {
        return this.evalScope;
    };

    Scope.prototype.getPartialMap = function getPartialMap() {
        return this.partialMap;
    };

    Scope.prototype.bind = function bind(symbol, value) {
        this.set(symbol, value);
    };

    Scope.prototype.bindSelf = function bindSelf(self) {
        this.set(0, self);
    };

    Scope.prototype.bindSymbol = function bindSymbol(symbol, value) {
        this.set(symbol, value);
    };

    Scope.prototype.bindBlock = function bindBlock(symbol, value) {
        this.set(symbol, value);
    };

    Scope.prototype.bindEvalScope = function bindEvalScope(map) {
        this.evalScope = map;
    };

    Scope.prototype.bindPartialMap = function bindPartialMap(map) {
        this.partialMap = map;
    };

    Scope.prototype.bindCallerScope = function bindCallerScope(scope) {
        this.callerScope = scope;
    };

    Scope.prototype.getCallerScope = function getCallerScope() {
        return this.callerScope;
    };

    Scope.prototype.child = function child() {
        return new Scope(this.slots.slice(), this.callerScope, this.evalScope, this.partialMap);
    };

    Scope.prototype.get = function get(index) {
        if (index >= this.slots.length) {
            throw new RangeError('BUG: cannot get $' + index + ' from scope; length=' + this.slots.length);
        }
        return this.slots[index];
    };

    Scope.prototype.set = function set(index, value) {
        if (index >= this.slots.length) {
            throw new RangeError('BUG: cannot get $' + index + ' from scope; length=' + this.slots.length);
        }
        this.slots[index] = value;
    };

    return Scope;
}();

var Transaction = function () {
    function Transaction() {
        _classCallCheck$34(this, Transaction);

        this.scheduledInstallManagers = [];
        this.scheduledInstallModifiers = [];
        this.scheduledUpdateModifierManagers = [];
        this.scheduledUpdateModifiers = [];
        this.createdComponents = [];
        this.createdManagers = [];
        this.updatedComponents = [];
        this.updatedManagers = [];
        this.destructors = [];
    }

    Transaction.prototype.didCreate = function didCreate(component, manager) {
        this.createdComponents.push(component);
        this.createdManagers.push(manager);
    };

    Transaction.prototype.didUpdate = function didUpdate(component, manager) {
        this.updatedComponents.push(component);
        this.updatedManagers.push(manager);
    };

    Transaction.prototype.scheduleInstallModifier = function scheduleInstallModifier(modifier, manager) {
        this.scheduledInstallManagers.push(manager);
        this.scheduledInstallModifiers.push(modifier);
    };

    Transaction.prototype.scheduleUpdateModifier = function scheduleUpdateModifier(modifier, manager) {
        this.scheduledUpdateModifierManagers.push(manager);
        this.scheduledUpdateModifiers.push(modifier);
    };

    Transaction.prototype.didDestroy = function didDestroy(d) {
        this.destructors.push(d);
    };

    Transaction.prototype.commit = function commit() {
        var createdComponents = this.createdComponents,
            createdManagers = this.createdManagers;

        for (var i = 0; i < createdComponents.length; i++) {
            var component = createdComponents[i];
            var manager = createdManagers[i];
            manager.didCreate(component);
        }
        var updatedComponents = this.updatedComponents,
            updatedManagers = this.updatedManagers;

        for (var _i = 0; _i < updatedComponents.length; _i++) {
            var _component = updatedComponents[_i];
            var _manager = updatedManagers[_i];
            _manager.didUpdate(_component);
        }
        var destructors = this.destructors;

        for (var _i2 = 0; _i2 < destructors.length; _i2++) {
            destructors[_i2].destroy();
        }
        var scheduledInstallManagers = this.scheduledInstallManagers,
            scheduledInstallModifiers = this.scheduledInstallModifiers;

        for (var _i3 = 0; _i3 < scheduledInstallManagers.length; _i3++) {
            var _manager2 = scheduledInstallManagers[_i3];
            var modifier = scheduledInstallModifiers[_i3];
            _manager2.install(modifier);
        }
        var scheduledUpdateModifierManagers = this.scheduledUpdateModifierManagers,
            scheduledUpdateModifiers = this.scheduledUpdateModifiers;

        for (var _i4 = 0; _i4 < scheduledUpdateModifierManagers.length; _i4++) {
            var _manager3 = scheduledUpdateModifierManagers[_i4];
            var _modifier = scheduledUpdateModifiers[_i4];
            _manager3.update(_modifier);
        }
    };

    return Transaction;
}();

var Opcode = function () {
    function Opcode(heap) {
        _classCallCheck$34(this, Opcode);

        this.heap = heap;
        this.offset = 0;
    }

    _createClass$6(Opcode, [{
        key: 'type',
        get: function get() {
            return this.heap.getbyaddr(this.offset);
        }
    }, {
        key: 'op1',
        get: function get() {
            return this.heap.getbyaddr(this.offset + 1);
        }
    }, {
        key: 'op2',
        get: function get() {
            return this.heap.getbyaddr(this.offset + 2);
        }
    }, {
        key: 'op3',
        get: function get() {
            return this.heap.getbyaddr(this.offset + 3);
        }
    }]);

    return Opcode;
}();
var TableSlotState;
(function (TableSlotState) {
    TableSlotState[TableSlotState["Allocated"] = 0] = "Allocated";
    TableSlotState[TableSlotState["Freed"] = 1] = "Freed";
    TableSlotState[TableSlotState["Purged"] = 2] = "Purged";
    TableSlotState[TableSlotState["Pointer"] = 3] = "Pointer";
})(TableSlotState || (TableSlotState = {}));
var Heap = function () {
    function Heap() {
        _classCallCheck$34(this, Heap);

        this.heap = [];
        this.offset = 0;
        this.handle = 0;
        /**
         * layout:
         *
         * - pointer into heap
         * - size
         * - freed (0 or 1)
         */
        this.table = [];
    }

    Heap.prototype.push = function push(item) {
        this.heap[this.offset++] = item;
    };

    Heap.prototype.getbyaddr = function getbyaddr(address) {
        return this.heap[address];
    };

    Heap.prototype.setbyaddr = function setbyaddr(address, value) {
        this.heap[address] = value;
    };

    Heap.prototype.malloc = function malloc() {
        this.table.push(this.offset, 0, 0);
        var handle = this.handle;
        this.handle += 3;
        return handle;
    };

    Heap.prototype.finishMalloc = function finishMalloc(handle) {
        var start = this.table[handle];
        var finish = this.offset;
        this.table[handle + 1] = finish - start;
    };

    Heap.prototype.size = function size() {
        return this.offset;
    };
    // It is illegal to close over this address, as compaction
    // may move it. However, it is legal to use this address
    // multiple times between compactions.


    Heap.prototype.getaddr = function getaddr(handle) {
        return this.table[handle];
    };

    Heap.prototype.gethandle = function gethandle(address) {
        this.table.push(address, 0, TableSlotState.Pointer);
        var handle = this.handle;
        this.handle += 3;
        return handle;
    };

    Heap.prototype.sizeof = function sizeof(handle) {
        return -1;
    };

    Heap.prototype.free = function free(handle) {
        this.table[handle + 2] = 1;
    };

    Heap.prototype.compact = function compact() {
        var compactedSize = 0;
        var table = this.table,
            length = this.table.length,
            heap = this.heap;

        for (var i = 0; i < length; i += 3) {
            var offset = table[i];
            var size = table[i + 1];
            var state = table[i + 2];
            if (state === TableSlotState.Purged) {
                continue;
            } else if (state === TableSlotState.Freed) {
                // transition to "already freed"
                // a good improvement would be to reuse
                // these slots
                table[i + 2] = 2;
                compactedSize += size;
            } else if (state === TableSlotState.Allocated) {
                for (var j = offset; j <= i + size; j++) {
                    heap[j - compactedSize] = heap[j];
                }
                table[i] = offset - compactedSize;
            } else if (state === TableSlotState.Pointer) {
                table[i] = offset - compactedSize;
            }
        }
        this.offset = this.offset - compactedSize;
    };

    return Heap;
}();
var Program = function () {
    function Program() {
        _classCallCheck$34(this, Program);

        this.heap = new Heap();
        this._opcode = new Opcode(this.heap);
        this.constants = new Constants();
    }

    Program.prototype.opcode = function opcode(offset) {
        this._opcode.offset = offset;
        return this._opcode;
    };

    return Program;
}();
var Environment = function () {
    function Environment(_ref2) {
        var appendOperations = _ref2.appendOperations,
            updateOperations = _ref2.updateOperations;

        _classCallCheck$34(this, Environment);

        this._macros = null;
        this._transaction = null;
        this.program = new Program();
        this.appendOperations = appendOperations;
        this.updateOperations = updateOperations;
    }

    Environment.prototype.toConditionalReference = function toConditionalReference(reference) {
        return new ConditionalReference(reference);
    };

    Environment.prototype.getAppendOperations = function getAppendOperations() {
        return this.appendOperations;
    };

    Environment.prototype.getDOM = function getDOM() {
        return this.updateOperations;
    };

    Environment.prototype.getIdentity = function getIdentity(object) {
        return ensureGuid(object) + '';
    };

    Environment.prototype.begin = function begin() {
        debugAssert(!this._transaction, 'a glimmer transaction was begun, but one already exists. You may have a nested transaction');
        this._transaction = new Transaction();
    };

    Environment.prototype.didCreate = function didCreate(component, manager) {
        this.transaction.didCreate(component, manager);
    };

    Environment.prototype.didUpdate = function didUpdate(component, manager) {
        this.transaction.didUpdate(component, manager);
    };

    Environment.prototype.scheduleInstallModifier = function scheduleInstallModifier(modifier, manager) {
        this.transaction.scheduleInstallModifier(modifier, manager);
    };

    Environment.prototype.scheduleUpdateModifier = function scheduleUpdateModifier(modifier, manager) {
        this.transaction.scheduleUpdateModifier(modifier, manager);
    };

    Environment.prototype.didDestroy = function didDestroy(d) {
        this.transaction.didDestroy(d);
    };

    Environment.prototype.commit = function commit() {
        var transaction = this.transaction;
        this._transaction = null;
        transaction.commit();
    };

    Environment.prototype.attributeFor = function attributeFor(element, attr, _isTrusting) {
        var _namespace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        return defaultDynamicAttributes(element, attr);
    };

    Environment.prototype.macros = function macros() {
        var macros = this._macros;
        if (!macros) {
            this._macros = macros = this.populateBuiltins();
        }
        return macros;
    };

    Environment.prototype.populateBuiltins = function populateBuiltins$$1() {
        return populateBuiltins();
    };

    _createClass$6(Environment, [{
        key: 'transaction',
        get: function get() {
            return this._transaction;
        }
    }]);

    return Environment;
}();

function _defaults$21(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);for (var i = 0; i < keys.length; i++) {
        var key = keys[i];var value = Object.getOwnPropertyDescriptor(defaults, key);if (value && value.configurable && obj[key] === undefined) {
            Object.defineProperty(obj, key, value);
        }
    }return obj;
}

var _createClass$7 = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _possibleConstructorReturn$21(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits$21(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults$21(subClass, superClass);
}

function _classCallCheck$41(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var UpdatingVM = function () {
    function UpdatingVM(env, _ref) {
        var _ref$alwaysRevalidate = _ref.alwaysRevalidate,
            alwaysRevalidate = _ref$alwaysRevalidate === undefined ? false : _ref$alwaysRevalidate;

        _classCallCheck$41(this, UpdatingVM);

        this.frameStack = new Stack();
        this.env = env;
        this.constants = env.program.constants;
        this.dom = env.getDOM();
        this.alwaysRevalidate = alwaysRevalidate;
    }

    UpdatingVM.prototype.execute = function execute(opcodes, handler) {
        var frameStack = this.frameStack;

        this.try(opcodes, handler);
        while (true) {
            if (frameStack.isEmpty()) break;
            var opcode = this.frame.nextStatement();
            if (opcode === null) {
                this.frameStack.pop();
                continue;
            }
            opcode.evaluate(this);
        }
    };

    UpdatingVM.prototype.goto = function goto(op) {
        this.frame.goto(op);
    };

    UpdatingVM.prototype.try = function _try(ops, handler) {
        this.frameStack.push(new UpdatingVMFrame(this, ops, handler));
    };

    UpdatingVM.prototype.throw = function _throw() {
        this.frame.handleException();
        this.frameStack.pop();
    };

    UpdatingVM.prototype.evaluateOpcode = function evaluateOpcode(opcode) {
        opcode.evaluate(this);
    };

    _createClass$7(UpdatingVM, [{
        key: 'frame',
        get: function get() {
            return this.frameStack.current;
        }
    }]);

    return UpdatingVM;
}();

var BlockOpcode = function (_UpdatingOpcode) {
    _inherits$21(BlockOpcode, _UpdatingOpcode);

    function BlockOpcode(start, state, bounds$$1, children) {
        _classCallCheck$41(this, BlockOpcode);

        var _this = _possibleConstructorReturn$21(this, _UpdatingOpcode.call(this));

        _this.start = start;
        _this.type = "block";
        _this.next = null;
        _this.prev = null;
        var env = state.env,
            scope = state.scope,
            dynamicScope = state.dynamicScope,
            stack = state.stack;

        _this.children = children;
        _this.env = env;
        _this.scope = scope;
        _this.dynamicScope = dynamicScope;
        _this.stack = stack;
        _this.bounds = bounds$$1;
        return _this;
    }

    BlockOpcode.prototype.parentElement = function parentElement() {
        return this.bounds.parentElement();
    };

    BlockOpcode.prototype.firstNode = function firstNode() {
        return this.bounds.firstNode();
    };

    BlockOpcode.prototype.lastNode = function lastNode() {
        return this.bounds.lastNode();
    };

    BlockOpcode.prototype.evaluate = function evaluate(vm) {
        vm.try(this.children, null);
    };

    BlockOpcode.prototype.destroy = function destroy() {
        this.bounds.destroy();
    };

    BlockOpcode.prototype.didDestroy = function didDestroy() {
        this.env.didDestroy(this.bounds);
    };

    BlockOpcode.prototype.toJSON = function toJSON() {
        var details = dict();
        details["guid"] = '' + this._guid;
        return {
            guid: this._guid,
            type: this.type,
            details: details,
            children: this.children.toArray().map(function (op) {
                return op.toJSON();
            })
        };
    };

    return BlockOpcode;
}(UpdatingOpcode);
var TryOpcode = function (_BlockOpcode) {
    _inherits$21(TryOpcode, _BlockOpcode);

    function TryOpcode(start, state, bounds$$1, children) {
        _classCallCheck$41(this, TryOpcode);

        var _this2 = _possibleConstructorReturn$21(this, _BlockOpcode.call(this, start, state, bounds$$1, children));

        _this2.type = "try";
        _this2.tag = _this2._tag = UpdatableTag.create(CONSTANT_TAG);
        return _this2;
    }

    TryOpcode.prototype.didInitializeChildren = function didInitializeChildren() {
        this._tag.inner.update(combineSlice(this.children));
    };

    TryOpcode.prototype.evaluate = function evaluate(vm) {
        vm.try(this.children, this);
    };

    TryOpcode.prototype.handleException = function handleException() {
        var _this3 = this;

        var env = this.env,
            bounds$$1 = this.bounds,
            children = this.children,
            scope = this.scope,
            dynamicScope = this.dynamicScope,
            start = this.start,
            stack = this.stack,
            prev = this.prev,
            next = this.next;

        children.clear();
        var elementStack = NewElementBuilder.resume(env, bounds$$1, bounds$$1.reset(env));
        var vm = new VM(env, scope, dynamicScope, elementStack);
        var updating = new LinkedList();
        vm.execute(start, function (vm) {
            vm.stack = EvaluationStack.restore(stack);
            vm.updatingOpcodeStack.push(updating);
            vm.updateWith(_this3);
            vm.updatingOpcodeStack.push(children);
        });
        this.prev = prev;
        this.next = next;
    };

    TryOpcode.prototype.toJSON = function toJSON() {
        var json = _BlockOpcode.prototype.toJSON.call(this);
        var details = json["details"];
        if (!details) {
            details = json["details"] = {};
        }
        return _BlockOpcode.prototype.toJSON.call(this);
    };

    return TryOpcode;
}(BlockOpcode);

var ListRevalidationDelegate = function () {
    function ListRevalidationDelegate(opcode, marker) {
        _classCallCheck$41(this, ListRevalidationDelegate);

        this.opcode = opcode;
        this.marker = marker;
        this.didInsert = false;
        this.didDelete = false;
        this.map = opcode.map;
        this.updating = opcode['children'];
    }

    ListRevalidationDelegate.prototype.insert = function insert(key, item, memo, before) {
        var map$$1 = this.map,
            opcode = this.opcode,
            updating = this.updating;

        var nextSibling = null;
        var reference = null;
        if (before) {
            reference = map$$1[before];
            nextSibling = reference['bounds'].firstNode();
        } else {
            nextSibling = this.marker;
        }
        var vm = opcode.vmForInsertion(nextSibling);
        var tryOpcode = null;
        var start = opcode.start;

        vm.execute(start, function (vm) {
            map$$1[key] = tryOpcode = vm.iterate(memo, item);
            vm.updatingOpcodeStack.push(new LinkedList());
            vm.updateWith(tryOpcode);
            vm.updatingOpcodeStack.push(tryOpcode.children);
        });
        updating.insertBefore(tryOpcode, reference);
        this.didInsert = true;
    };

    ListRevalidationDelegate.prototype.retain = function retain(_key, _item, _memo) {};

    ListRevalidationDelegate.prototype.move = function move$$1(key, _item, _memo, before) {
        var map$$1 = this.map,
            updating = this.updating;

        var entry = map$$1[key];
        var reference = map$$1[before] || null;
        if (before) {
            move(entry, reference.firstNode());
        } else {
            move(entry, this.marker);
        }
        updating.remove(entry);
        updating.insertBefore(entry, reference);
    };

    ListRevalidationDelegate.prototype.delete = function _delete(key) {
        var map$$1 = this.map;

        var opcode = map$$1[key];
        opcode.didDestroy();
        clear(opcode);
        this.updating.remove(opcode);
        delete map$$1[key];
        this.didDelete = true;
    };

    ListRevalidationDelegate.prototype.done = function done() {
        this.opcode.didInitializeChildren(this.didInsert || this.didDelete);
    };

    return ListRevalidationDelegate;
}();

var ListBlockOpcode = function (_BlockOpcode2) {
    _inherits$21(ListBlockOpcode, _BlockOpcode2);

    function ListBlockOpcode(start, state, bounds$$1, children, artifacts) {
        _classCallCheck$41(this, ListBlockOpcode);

        var _this4 = _possibleConstructorReturn$21(this, _BlockOpcode2.call(this, start, state, bounds$$1, children));

        _this4.type = "list-block";
        _this4.map = dict();
        _this4.lastIterated = INITIAL;
        _this4.artifacts = artifacts;
        var _tag = _this4._tag = UpdatableTag.create(CONSTANT_TAG);
        _this4.tag = combine([artifacts.tag, _tag]);
        return _this4;
    }

    ListBlockOpcode.prototype.didInitializeChildren = function didInitializeChildren() {
        var listDidChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        this.lastIterated = this.artifacts.tag.value();
        if (listDidChange) {
            this._tag.inner.update(combineSlice(this.children));
        }
    };

    ListBlockOpcode.prototype.evaluate = function evaluate(vm) {
        var artifacts = this.artifacts,
            lastIterated = this.lastIterated;

        if (!artifacts.tag.validate(lastIterated)) {
            var bounds$$1 = this.bounds;
            var dom = vm.dom;

            var marker = dom.createComment('');
            dom.insertAfter(bounds$$1.parentElement(), marker, bounds$$1.lastNode());
            var target = new ListRevalidationDelegate(this, marker);
            var synchronizer = new IteratorSynchronizer({ target: target, artifacts: artifacts });
            synchronizer.sync();
            this.parentElement().removeChild(marker);
        }
        // Run now-updated updating opcodes
        _BlockOpcode2.prototype.evaluate.call(this, vm);
    };

    ListBlockOpcode.prototype.vmForInsertion = function vmForInsertion(nextSibling) {
        var env = this.env,
            scope = this.scope,
            dynamicScope = this.dynamicScope;

        var elementStack = NewElementBuilder.forInitialRender(this.env, this.bounds.parentElement(), nextSibling);
        return new VM(env, scope, dynamicScope, elementStack);
    };

    ListBlockOpcode.prototype.toJSON = function toJSON() {
        var json = _BlockOpcode2.prototype.toJSON.call(this);
        var map$$1 = this.map;
        var inner = Object.keys(map$$1).map(function (key) {
            return JSON.stringify(key) + ': ' + map$$1[key]._guid;
        }).join(", ");
        var details = json["details"];
        if (!details) {
            details = json["details"] = {};
        }
        details["map"] = '{' + inner + '}';
        return json;
    };

    return ListBlockOpcode;
}(BlockOpcode);

var UpdatingVMFrame = function () {
    function UpdatingVMFrame(vm, ops, exceptionHandler) {
        _classCallCheck$41(this, UpdatingVMFrame);

        this.vm = vm;
        this.ops = ops;
        this.exceptionHandler = exceptionHandler;
        this.vm = vm;
        this.ops = ops;
        this.current = ops.head();
    }

    UpdatingVMFrame.prototype.goto = function goto(op) {
        this.current = op;
    };

    UpdatingVMFrame.prototype.nextStatement = function nextStatement() {
        var current = this.current,
            ops = this.ops;

        if (current) this.current = ops.nextNode(current);
        return current;
    };

    UpdatingVMFrame.prototype.handleException = function handleException() {
        if (this.exceptionHandler) {
            this.exceptionHandler.handleException();
        }
    };

    return UpdatingVMFrame;
}();

function _classCallCheck$42(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var RenderResult = function () {
    function RenderResult(env, updating, bounds$$1) {
        _classCallCheck$42(this, RenderResult);

        this.env = env;
        this.updating = updating;
        this.bounds = bounds$$1;
    }

    RenderResult.prototype.rerender = function rerender() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { alwaysRevalidate: false },
            _ref$alwaysRevalidate = _ref.alwaysRevalidate,
            alwaysRevalidate = _ref$alwaysRevalidate === undefined ? false : _ref$alwaysRevalidate;

        var env = this.env,
            updating = this.updating;

        var vm = new UpdatingVM(env, { alwaysRevalidate: alwaysRevalidate });
        vm.execute(updating, this);
    };

    RenderResult.prototype.parentElement = function parentElement() {
        return this.bounds.parentElement();
    };

    RenderResult.prototype.firstNode = function firstNode() {
        return this.bounds.firstNode();
    };

    RenderResult.prototype.lastNode = function lastNode() {
        return this.bounds.lastNode();
    };

    RenderResult.prototype.opcodes = function opcodes() {
        return this.updating;
    };

    RenderResult.prototype.handleException = function handleException() {
        throw "this should never happen";
    };

    RenderResult.prototype.destroy = function destroy() {
        this.bounds.destroy();
        clear(this.bounds);
    };

    return RenderResult;
}();

var _createClass$5 = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck$33(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var EvaluationStack = function () {
    function EvaluationStack(stack, fp, sp) {
        _classCallCheck$33(this, EvaluationStack);

        this.stack = stack;
        this.fp = fp;
        this.sp = sp;
        
    }

    EvaluationStack.empty = function empty() {
        return new this([], 0, -1);
    };

    EvaluationStack.restore = function restore(snapshot) {
        return new this(snapshot.slice(), 0, snapshot.length - 1);
    };

    EvaluationStack.prototype.isEmpty = function isEmpty() {
        return this.sp === -1;
    };

    EvaluationStack.prototype.push = function push(value) {
        this.stack[++this.sp] = value;
    };

    EvaluationStack.prototype.dup = function dup() {
        var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.sp;

        this.push(this.stack[position]);
    };

    EvaluationStack.prototype.pop = function pop() {
        var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        var top = this.stack[this.sp];
        this.sp -= n;
        return top;
    };

    EvaluationStack.prototype.peek = function peek() {
        return this.stack[this.sp];
    };

    EvaluationStack.prototype.fromBase = function fromBase(offset) {
        return this.stack[this.fp - offset];
    };

    EvaluationStack.prototype.fromTop = function fromTop(offset) {
        return this.stack[this.sp - offset];
    };

    EvaluationStack.prototype.capture = function capture(items) {
        var end = this.sp + 1;
        var start = end - items;
        return this.stack.slice(start, end);
    };

    EvaluationStack.prototype.reset = function reset() {
        this.stack.length = 0;
    };

    EvaluationStack.prototype.toArray = function toArray() {
        return this.stack.slice(this.fp, this.sp + 1);
    };

    return EvaluationStack;
}();

var VM = function () {
    function VM(env, scope, dynamicScope, elementStack) {
        _classCallCheck$33(this, VM);

        this.env = env;
        this.elementStack = elementStack;
        this.dynamicScopeStack = new Stack();
        this.scopeStack = new Stack();
        this.updatingOpcodeStack = new Stack();
        this.cacheGroups = new Stack();
        this.listBlockStack = new Stack();
        this.stack = EvaluationStack.empty();
        /* Registers */
        this.pc = -1;
        this.ra = -1;
        this.s0 = null;
        this.s1 = null;
        this.t0 = null;
        this.t1 = null;
        this.env = env;
        this.heap = env.program.heap;
        this.constants = env.program.constants;
        this.elementStack = elementStack;
        this.scopeStack.push(scope);
        this.dynamicScopeStack.push(dynamicScope);
    }

    // Fetch a value from a register onto the stack
    VM.prototype.fetch = function fetch(register) {
        this.stack.push(this[Register[register]]);
    };
    // Load a value from the stack into a register


    VM.prototype.load = function load(register) {
        this[Register[register]] = this.stack.pop();
    };
    // Fetch a value from a register


    VM.prototype.fetchValue = function fetchValue(register) {
        return this[Register[register]];
    };
    // Load a value into a register


    VM.prototype.loadValue = function loadValue(register, value) {
        this[Register[register]] = value;
    };
    // Start a new frame and save $ra and $fp on the stack


    VM.prototype.pushFrame = function pushFrame() {
        this.stack.push(this.ra);
        this.stack.push(this.fp);
        this.fp = this.sp - 1;
    };
    // Restore $ra, $sp and $fp


    VM.prototype.popFrame = function popFrame() {
        this.sp = this.fp - 1;
        this.ra = this.stack.fromBase(0);
        this.fp = this.stack.fromBase(-1);
    };
    // Jump to an address in `program`


    VM.prototype.goto = function goto(offset) {
        this.pc = typePos(this.pc + offset);
    };
    // Save $pc into $ra, then jump to a new address in `program` (jal in MIPS)


    VM.prototype.call = function call(handle) {
        var pc = this.heap.getaddr(handle);
        this.ra = this.pc;
        this.pc = pc;
    };
    // Put a specific `program` address in $ra


    VM.prototype.returnTo = function returnTo(offset) {
        this.ra = typePos(this.pc + offset);
    };
    // Return to the `program` address stored in $ra


    VM.prototype.return = function _return() {
        this.pc = this.ra;
    };

    VM.initial = function initial(env, self, dynamicScope, elementStack, program) {
        var scope = Scope.root(self, program.symbolTable.symbols.length);
        var vm = new VM(env, scope, dynamicScope, elementStack);
        vm.pc = vm.heap.getaddr(program.handle);
        vm.updatingOpcodeStack.push(new LinkedList());
        return vm;
    };

    VM.prototype.capture = function capture(args) {
        return {
            dynamicScope: this.dynamicScope(),
            env: this.env,
            scope: this.scope(),
            stack: this.stack.capture(args)
        };
    };

    VM.prototype.beginCacheGroup = function beginCacheGroup() {
        this.cacheGroups.push(this.updating().tail());
    };

    VM.prototype.commitCacheGroup = function commitCacheGroup() {
        //        JumpIfNotModified(END)
        //        (head)
        //        (....)
        //        (tail)
        //        DidModify
        // END:   Noop
        var END = new LabelOpcode("END");
        var opcodes = this.updating();
        var marker = this.cacheGroups.pop();
        var head = marker ? opcodes.nextNode(marker) : opcodes.head();
        var tail = opcodes.tail();
        var tag = combineSlice(new ListSlice(head, tail));
        var guard = new JumpIfNotModifiedOpcode(tag, END);
        opcodes.insertBefore(guard, head);
        opcodes.append(new DidModifyOpcode(guard));
        opcodes.append(END);
    };

    VM.prototype.enter = function enter(args) {
        var updating = new LinkedList();
        var state = this.capture(args);
        var tracker = this.elements().pushUpdatableBlock();
        var tryOpcode = new TryOpcode(this.heap.gethandle(this.pc), state, tracker, updating);
        this.didEnter(tryOpcode);
    };

    VM.prototype.iterate = function iterate(memo, value) {
        var stack = this.stack;
        stack.push(value);
        stack.push(memo);
        var state = this.capture(2);
        var tracker = this.elements().pushUpdatableBlock();
        // let ip = this.ip;
        // this.ip = end + 4;
        // this.frames.push(ip);
        return new TryOpcode(this.heap.gethandle(this.pc), state, tracker, new LinkedList());
    };

    VM.prototype.enterItem = function enterItem(key, opcode) {
        this.listBlock().map[key] = opcode;
        this.didEnter(opcode);
    };

    VM.prototype.enterList = function enterList(relativeStart) {
        var updating = new LinkedList();
        var state = this.capture(0);
        var tracker = this.elements().pushBlockList(updating);
        var artifacts = this.stack.peek().artifacts;
        var start = this.heap.gethandle(typePos(this.pc + relativeStart));
        var opcode = new ListBlockOpcode(start, state, tracker, updating, artifacts);
        this.listBlockStack.push(opcode);
        this.didEnter(opcode);
    };

    VM.prototype.didEnter = function didEnter(opcode) {
        this.updateWith(opcode);
        this.updatingOpcodeStack.push(opcode.children);
    };

    VM.prototype.exit = function exit() {
        this.elements().popBlock();
        this.updatingOpcodeStack.pop();
        var parent = this.updating().tail();
        parent.didInitializeChildren();
    };

    VM.prototype.exitList = function exitList() {
        this.exit();
        this.listBlockStack.pop();
    };

    VM.prototype.updateWith = function updateWith(opcode) {
        this.updating().append(opcode);
    };

    VM.prototype.listBlock = function listBlock() {
        return this.listBlockStack.current;
    };

    VM.prototype.updating = function updating() {
        return this.updatingOpcodeStack.current;
    };

    VM.prototype.elements = function elements() {
        return this.elementStack;
    };

    VM.prototype.scope = function scope() {
        return this.scopeStack.current;
    };

    VM.prototype.dynamicScope = function dynamicScope() {
        return this.dynamicScopeStack.current;
    };

    VM.prototype.pushChildScope = function pushChildScope() {
        this.scopeStack.push(this.scope().child());
    };

    VM.prototype.pushCallerScope = function pushCallerScope() {
        var childScope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var callerScope = this.scope().getCallerScope();
        this.scopeStack.push(childScope ? callerScope.child() : callerScope);
    };

    VM.prototype.pushDynamicScope = function pushDynamicScope() {
        var child = this.dynamicScope().child();
        this.dynamicScopeStack.push(child);
        return child;
    };

    VM.prototype.pushRootScope = function pushRootScope(size, bindCaller) {
        var scope = Scope.sized(size);
        if (bindCaller) scope.bindCallerScope(this.scope());
        this.scopeStack.push(scope);
        return scope;
    };

    VM.prototype.popScope = function popScope() {
        this.scopeStack.pop();
    };

    VM.prototype.popDynamicScope = function popDynamicScope() {
        this.dynamicScopeStack.pop();
    };

    VM.prototype.newDestroyable = function newDestroyable(d) {
        this.elements().didAddDestroyable(d);
    };
    /// SCOPE HELPERS


    VM.prototype.getSelf = function getSelf() {
        return this.scope().getSelf();
    };

    VM.prototype.referenceForSymbol = function referenceForSymbol(symbol) {
        return this.scope().getSymbol(symbol);
    };
    /// EXECUTION


    VM.prototype.execute = function execute(start, initialize) {
        this.pc = this.heap.getaddr(start);
        if (initialize) initialize(this);
        var result = void 0;
        while (true) {
            result = this.next();
            if (result.done) break;
        }
        return result.value;
    };

    VM.prototype.next = function next() {
        var env = this.env,
            updatingOpcodeStack = this.updatingOpcodeStack,
            elementStack = this.elementStack;

        var opcode = this.nextStatement(env);
        var result = void 0;
        if (opcode !== null) {
            APPEND_OPCODES.evaluate(this, opcode, opcode.type);
            result = { done: false, value: null };
        } else {
            // Unload the stack
            this.stack.reset();
            result = {
                done: true,
                value: new RenderResult(env, updatingOpcodeStack.pop(), elementStack.popBlock())
            };
        }
        return result;
    };

    VM.prototype.nextStatement = function nextStatement(env) {
        var pc = this.pc;

        if (pc === -1) {
            return null;
        }
        var program = env.program;
        this.pc += 4;
        return program.opcode(pc);
    };

    VM.prototype.evaluateOpcode = function evaluateOpcode(opcode) {
        APPEND_OPCODES.evaluate(this, opcode, opcode.type);
    };

    VM.prototype.bindDynamicScope = function bindDynamicScope(names) {
        var scope = this.dynamicScope();
        for (var i = names.length - 1; i >= 0; i--) {
            var name = this.constants.getString(names[i]);
            scope.set(name, this.stack.pop());
        }
    };

    _createClass$5(VM, [{
        key: 'fp',
        get: function get() {
            return this.stack.fp;
        },
        set: function set(fp) {
            this.stack.fp = fp;
        }
    }, {
        key: 'sp',
        get: function get() {
            return this.stack.sp;
        },
        set: function set(sp) {
            this.stack.sp = sp;
        }
    }]);

    return VM;
}();

function _classCallCheck$17(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var TemplateIterator = function () {
    function TemplateIterator(vm) {
        _classCallCheck$17(this, TemplateIterator);

        this.vm = vm;
    }

    TemplateIterator.prototype.next = function next() {
        return this.vm.next();
    };

    return TemplateIterator;
}();
var clientId = 0;
function templateFactory(_ref) {
    var templateId = _ref.id,
        meta = _ref.meta,
        block = _ref.block;

    var parsedBlock = void 0;
    var id = templateId || 'client-' + clientId++;
    var create = function create(env, envMeta) {
        var newMeta = envMeta ? assign({}, envMeta, meta) : meta;
        if (!parsedBlock) {
            parsedBlock = JSON.parse(block);
        }
        return new ScannableTemplate(id, newMeta, env, parsedBlock);
    };
    return { id: id, meta: meta, create: create };
}

var ScannableTemplate = function () {
    function ScannableTemplate(id, meta, env, rawBlock) {
        _classCallCheck$17(this, ScannableTemplate);

        this.id = id;
        this.meta = meta;
        this.env = env;
        this.entryPoint = null;
        this.layout = null;
        this.partial = null;
        this.block = null;
        this.scanner = new Scanner(rawBlock, env);
        this.symbols = rawBlock.symbols;
        this.hasEval = rawBlock.hasEval;
    }

    ScannableTemplate.prototype.render = function render(_ref2) {
        var self = _ref2.self,
            parentNode = _ref2.parentNode,
            dynamicScope = _ref2.dynamicScope,
            mode = _ref2.mode;
        var env = this.env;

        var elementBuilder = void 0;
        switch (mode) {
            case undefined:
                elementBuilder = NewElementBuilder.forInitialRender(env, parentNode, null);
                break;
            case 'rehydrate':
                elementBuilder = RehydrateBuilder.forInitialRender(env, parentNode, null);
                break;
            case 'serialize':
                elementBuilder = SerializeBuilder.forInitialRender(env, parentNode, null);
                break;
            default:
                throw new Error('unreachable');
        }
        var compiled = this.asEntryPoint().compileDynamic(env);
        var vm = VM.initial(env, self, dynamicScope, elementBuilder, compiled);
        return new TemplateIterator(vm);
    };

    ScannableTemplate.prototype.asEntryPoint = function asEntryPoint() {
        if (!this.entryPoint) this.entryPoint = this.scanner.scanEntryPoint(this.compilationMeta());
        return this.entryPoint;
    };

    ScannableTemplate.prototype.asLayout = function asLayout(componentName, attrs) {
        if (!this.layout) this.layout = this.scanner.scanLayout(this.compilationMeta(), attrs || EMPTY_ARRAY, componentName);
        return this.layout;
    };

    ScannableTemplate.prototype.asPartial = function asPartial() {
        if (!this.partial) this.partial = this.scanner.scanEntryPoint(this.compilationMeta(true));
        return this.partial;
    };

    ScannableTemplate.prototype.asBlock = function asBlock() {
        if (!this.block) this.block = this.scanner.scanBlock(this.compilationMeta());
        return this.block;
    };

    ScannableTemplate.prototype.compilationMeta = function compilationMeta() {
        var asPartial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return { templateMeta: this.meta, symbols: this.symbols, asPartial: asPartial };
    };

    return ScannableTemplate;
}();

function EMPTY_CACHE() {}

function _classCallCheck$48(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var PathReference = function () {
    function PathReference(parent, property) {
        _classCallCheck$48(this, PathReference);

        this.cache = EMPTY_CACHE;
        this.inner = null;
        this.chains = null;
        this.lastParentValue = EMPTY_CACHE;
        this._guid = 0;
        this.tag = VOLATILE_TAG;
        this.parent = parent;
        this.property = property;
    }

    PathReference.prototype.value = function value() {
        var lastParentValue = this.lastParentValue,
            property = this.property,
            inner = this.inner;

        var parentValue = this._parentValue();
        if (parentValue === null || parentValue === undefined) {
            return this.cache = undefined;
        }
        if (lastParentValue === parentValue) {
            inner = this.inner;
        } else {
            var ReferenceType = typeof parentValue === 'object' ? Meta.for(parentValue).referenceTypeFor(property) : PropertyReference;
            inner = this.inner = new ReferenceType(parentValue, property, this);
        }
        // if (typeof parentValue === 'object') {
        //   Meta.for(parentValue).addReference(property, this);
        // }
        return this.cache = inner.value();
    };

    PathReference.prototype.get = function get(prop) {
        var chains = this._getChains();
        if (prop in chains) return chains[prop];
        return chains[prop] = new PathReference(this, prop);
    };

    PathReference.prototype.label = function label() {
        return '[reference Direct]';
    };

    PathReference.prototype._getChains = function _getChains() {
        if (this.chains) return this.chains;
        return this.chains = dict();
    };

    PathReference.prototype._parentValue = function _parentValue() {
        var parent = this.parent.value();
        this.lastParentValue = parent;
        return parent;
    };

    return PathReference;
}();

function _classCallCheck$47(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var RootReference = function () {
    function RootReference(object) {
        _classCallCheck$47(this, RootReference);

        this.chains = dict();
        this.tag = VOLATILE_TAG;
        this.object = object;
    }

    RootReference.prototype.value = function value() {
        return this.object;
    };

    RootReference.prototype.update = function update(object) {
        this.object = object;
        // this.notify();
    };

    RootReference.prototype.get = function get(prop) {
        var chains = this.chains;
        if (prop in chains) return chains[prop];
        return chains[prop] = new PathReference(this, prop);
    };

    RootReference.prototype.chainFor = function chainFor(prop) {
        var chains = this.chains;
        if (prop in chains) return chains[prop];
        return null;
    };

    RootReference.prototype.path = function path(string) {
        return string.split('.').reduce(function (ref, part) {
            return ref.get(part);
        }, this);
    };

    RootReference.prototype.referenceFromParts = function referenceFromParts$$1(parts) {
        return parts.reduce(function (ref, part) {
            return ref.get(part);
        }, this);
    };

    RootReference.prototype.label = function label() {
        return '[reference Root]';
    };

    return RootReference;
}();

function _classCallCheck$46(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var NOOP_DESTROY = {
    destroy: function destroy() {}
};

var ConstPath = function () {
    function ConstPath(parent, _property) {
        _classCallCheck$46(this, ConstPath);

        this.tag = VOLATILE_TAG;
        this.parent = parent;
    }

    ConstPath.prototype.chain = function chain() {
        return NOOP_DESTROY;
    };

    ConstPath.prototype.notify = function notify() {};

    ConstPath.prototype.value = function value() {
        return this.parent[this.property];
    };

    ConstPath.prototype.get = function get(prop) {
        return new ConstPath(this.parent[this.property], prop);
    };

    return ConstPath;
}();

var ConstRoot = function () {
    function ConstRoot(value) {
        _classCallCheck$46(this, ConstRoot);

        this.tag = VOLATILE_TAG;
        this.inner = value;
    }

    ConstRoot.prototype.update = function update(inner) {
        this.inner = inner;
    };

    ConstRoot.prototype.chain = function chain() {
        return NOOP_DESTROY;
    };

    ConstRoot.prototype.notify = function notify() {};

    ConstRoot.prototype.value = function value() {
        return this.inner;
    };

    ConstRoot.prototype.referenceFromParts = function referenceFromParts$$1(_parts) {
        throw new Error("Not implemented");
    };

    ConstRoot.prototype.chainFor = function chainFor(_prop) {
        throw new Error("Not implemented");
    };

    ConstRoot.prototype.get = function get(prop) {
        return new ConstPath(this.inner, prop);
    };

    return ConstRoot;
}();

var ConstMeta /*implements IMeta*/ = function () {
    function ConstMeta(object) {
        _classCallCheck$46(this, ConstMeta);

        this.object = object;
    }

    ConstMeta.prototype.root = function root() {
        return new ConstRoot(this.object);
    };

    return ConstMeta;
}();

var CLASS_META = "df8be4c8-4e89-44e2-a8f9-550c8dacdca7";
var hasOwnProperty = Object.hasOwnProperty;

var Meta = function () {
    function Meta(object, _ref) {
        var RootReferenceFactory = _ref.RootReferenceFactory,
            DefaultPathReferenceFactory = _ref.DefaultPathReferenceFactory;

        _classCallCheck$46(this, Meta);

        this.references = null;
        this.slots = null;
        this.referenceTypes = null;
        this.propertyMetadata = null;
        this.object = object;
        this.RootReferenceFactory = RootReferenceFactory || RootReference;
        this.DefaultPathReferenceFactory = DefaultPathReferenceFactory || PropertyReference;
    }

    Meta.for = function _for(obj) {
        if (obj === null || obj === undefined) return new Meta(obj, {});
        if (hasOwnProperty.call(obj, '_meta') && obj._meta) return obj._meta;
        if (!Object.isExtensible(obj)) return new ConstMeta(obj);
        var MetaToUse = Meta;
        if (obj.constructor && obj.constructor[CLASS_META]) {
            var classMeta = obj.constructor[CLASS_META];
            MetaToUse = classMeta.InstanceMetaConstructor;
        } else if (obj[CLASS_META]) {
            MetaToUse = obj[CLASS_META].InstanceMetaConstructor;
        }
        return obj._meta = new MetaToUse(obj, {});
    };

    Meta.exists = function exists(obj) {
        return typeof obj === 'object' && obj._meta;
    };

    Meta.metadataForProperty = function metadataForProperty(_key) {
        return null;
    };

    Meta.prototype.addReference = function addReference(property, reference) {
        var refs = this.references = this.references || dict();
        var set = refs[property] = refs[property] || new DictSet();
        set.add(reference);
    };

    Meta.prototype.addReferenceTypeFor = function addReferenceTypeFor(property, type) {
        this.referenceTypes = this.referenceTypes || dict();
        this.referenceTypes[property] = type;
    };

    Meta.prototype.referenceTypeFor = function referenceTypeFor(property) {
        if (!this.referenceTypes) return PropertyReference;
        return this.referenceTypes[property] || PropertyReference;
    };

    Meta.prototype.removeReference = function removeReference(property, reference) {
        if (!this.references) return;
        var set = this.references[property];
        set.delete(reference);
    };

    Meta.prototype.getReferenceTypes = function getReferenceTypes() {
        this.referenceTypes = this.referenceTypes || dict();
        return this.referenceTypes;
    };

    Meta.prototype.referencesFor = function referencesFor(property) {
        if (!this.references) return null;
        return this.references[property];
    };

    Meta.prototype.getSlots = function getSlots() {
        return this.slots = this.slots || dict();
    };

    Meta.prototype.root = function root() {
        return this.rootCache = this.rootCache || new this.RootReferenceFactory(this.object);
    };

    return Meta;
}();

function _classCallCheck$45(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var PropertyReference = function () {
    function PropertyReference(object, property, _outer) {
        _classCallCheck$45(this, PropertyReference);

        this.tag = VOLATILE_TAG;
        this.object = object;
        this.property = property;
    }

    PropertyReference.prototype.value = function value() {
        return this.object[this.property];
    };

    PropertyReference.prototype.label = function label() {
        return '[reference Property]';
    };

    return PropertyReference;
}();

// import { metaFor } from './meta';
// import { intern } from '@glimmer/util';

function isTypeSpecifier(specifier) {
    return specifier.indexOf(':') === -1;
}
class ApplicationRegistry {
    constructor(registry, resolver) {
        this._registry = registry;
        this._resolver = resolver;
    }
    register(specifier, factory, options) {
        let normalizedSpecifier = this._toAbsoluteSpecifier(specifier);
        this._registry.register(normalizedSpecifier, factory, options);
    }
    registration(specifier) {
        let normalizedSpecifier = this._toAbsoluteSpecifier(specifier);
        return this._registry.registration(normalizedSpecifier);
    }
    unregister(specifier) {
        let normalizedSpecifier = this._toAbsoluteSpecifier(specifier);
        this._registry.unregister(normalizedSpecifier);
    }
    registerOption(specifier, option, value) {
        let normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        this._registry.registerOption(normalizedSpecifier, option, value);
    }
    registeredOption(specifier, option) {
        let normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        return this._registry.registeredOption(normalizedSpecifier, option);
    }
    registeredOptions(specifier) {
        let normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        return this._registry.registeredOptions(normalizedSpecifier);
    }
    unregisterOption(specifier, option) {
        let normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        this._registry.unregisterOption(normalizedSpecifier, option);
    }
    registerInjection(specifier, property, injection) {
        let normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        let normalizedInjection = this._toAbsoluteSpecifier(injection);
        this._registry.registerInjection(normalizedSpecifier, property, normalizedInjection);
    }
    registeredInjections(specifier) {
        let normalizedSpecifier = this._toAbsoluteOrTypeSpecifier(specifier);
        return this._registry.registeredInjections(normalizedSpecifier);
    }
    _toAbsoluteSpecifier(specifier, referrer) {
        return this._resolver.identify(specifier, referrer);
    }
    _toAbsoluteOrTypeSpecifier(specifier) {
        if (isTypeSpecifier(specifier)) {
            return specifier;
        } else {
            return this._toAbsoluteSpecifier(specifier);
        }
    }
}

class DynamicScope {
    constructor(bucket = null) {
        if (bucket) {
            this.bucket = assign({}, bucket);
        } else {
            this.bucket = {};
        }
    }
    get(key) {
        return this.bucket[key];
    }
    set(key, reference) {
        return this.bucket[key] = reference;
    }
    child() {
        return new DynamicScope(this.bucket);
    }
}

class ArrayIterator {
    constructor(array, keyFor) {
        this.position = 0;
        this.array = array;
        this.keyFor = keyFor;
    }
    isEmpty() {
        return this.array.length === 0;
    }
    next() {
        let position = this.position,
            array = this.array,
            keyFor = this.keyFor;

        if (position >= array.length) return null;
        let value = array[position];
        let key = keyFor(value, position);
        let memo = position;
        this.position++;
        return { key, value, memo };
    }
}
class ObjectKeysIterator {
    constructor(keys, values, keyFor) {
        this.position = 0;
        this.keys = keys;
        this.values = values;
        this.keyFor = keyFor;
    }
    isEmpty() {
        return this.keys.length === 0;
    }
    next() {
        let position = this.position,
            keys = this.keys,
            values = this.values,
            keyFor = this.keyFor;

        if (position >= keys.length) return null;
        let value = values[position];
        let memo = keys[position];
        let key = keyFor(value, memo);
        this.position++;
        return { key, value, memo };
    }
}
class EmptyIterator {
    isEmpty() {
        return true;
    }
    next() {
        throw new Error(`Cannot call next() on an empty iterator`);
    }
}
const EMPTY_ITERATOR = new EmptyIterator();
class Iterable {
    constructor(ref, keyFor) {
        this.tag = ref.tag;
        this.ref = ref;
        this.keyFor = keyFor;
    }
    iterate() {
        let ref = this.ref,
            keyFor = this.keyFor;

        let iterable = ref.value();
        if (Array.isArray(iterable)) {
            return iterable.length > 0 ? new ArrayIterator(iterable, keyFor) : EMPTY_ITERATOR;
        } else if (iterable === undefined || iterable === null) {
            return EMPTY_ITERATOR;
        } else if (iterable.forEach !== undefined) {
            let array = [];
            iterable.forEach(function (item) {
                array.push(item);
            });
            return array.length > 0 ? new ArrayIterator(array, keyFor) : EMPTY_ITERATOR;
        } else if (typeof iterable === 'object') {
            let keys = Object.keys(iterable);
            return keys.length > 0 ? new ObjectKeysIterator(keys, keys.map(key => iterable[key]), keyFor) : EMPTY_ITERATOR;
        } else {
            throw new Error(`Don't know how to {{#each ${iterable}}}`);
        }
    }
    valueReferenceFor(item) {
        return new RootReference(item.value);
    }
    updateValueReference(reference, item) {
        reference.update(item.value);
    }
    memoReferenceFor(item) {
        return new RootReference(item.memo);
    }
    updateMemoReference(reference, item) {
        reference.update(item.memo);
    }
}

function blockComponentMacro(params, hash, template, inverse, builder) {
    let definitionArgs = [params.slice(0, 1), null, null, null];
    let args = [params.slice(1), hashToArgs(hash), template, inverse];
    builder.component.dynamic(definitionArgs, dynamicComponentFor, args);
    return true;
}
function inlineComponentMacro(_name, params, hash, builder) {
    let definitionArgs = [params.slice(0, 1), null, null, null];
    let args = [params.slice(1), hashToArgs(hash), null, null];
    builder.component.dynamic(definitionArgs, dynamicComponentFor, args);
    return true;
}
function dynamicComponentFor(vm, args, meta) {
    let nameRef = args.positional.at(0);
    let env = vm.env;
    return new DynamicComponentReference(nameRef, env, meta);
}
class DynamicComponentReference {
    constructor(nameRef, env, meta) {
        this.nameRef = nameRef;
        this.env = env;
        this.meta = meta;
        this.tag = nameRef.tag;
    }
    value() {
        let env = this.env,
            nameRef = this.nameRef;

        let nameOrDef = nameRef.value();
        if (typeof nameOrDef === 'string') {
            return env.getComponentDefinition(nameOrDef, this.meta);
        }
        return null;
    }
    get() {
        return UNDEFINED_REFERENCE;
    }
}
function hashToArgs(hash) {
    if (hash === null) return null;
    let names = hash[0].map(key => `@${key}`);
    return [names, hash[1]];
}

function buildAction(vm, _args) {
    let componentRef = vm.getSelf();
    let args = _args.capture();
    let actionFunc = args.positional.at(0).value();
    if (typeof actionFunc !== 'function') {
        throwNoActionError(actionFunc, args.positional.at(0));
    }
    return new ConstReference(function action(...invokedArgs) {
        let curriedArgs = args.positional.value();
        // Consume the action function that was already captured above.
        curriedArgs.shift();
        curriedArgs.push(...invokedArgs);
        // Invoke the function with the component as the context, the curried
        // arguments passed to `{{action}}`, and the arguments the bound function
        // was invoked with.
        actionFunc.apply(componentRef && componentRef.value(), curriedArgs);
    });
}
function throwNoActionError(actionFunc, actionFuncReference) {
    let referenceInfo = debugInfoForReference(actionFuncReference);
    throw new Error(`You tried to create an action with the {{action}} helper, but the first argument ${referenceInfo}was ${typeof actionFunc} instead of a function.`);
}
function debugInfoForReference(reference) {
    let message = '';
    let parent;
    let property;
    if (reference === null || reference === undefined) {
        return message;
    }
    if ('parent' in reference && 'property' in reference) {
        parent = reference['parent'].value();
        property = reference['property'];
    } else if ('_parentValue' in reference && '_propertyKey' in reference) {
        parent = reference['_parentValue'];
        property = reference['_propertyKey'];
    }
    if (property !== undefined) {
        message += `('${property}' on ${debugName(parent)}) `;
    }
    return message;
}
function debugName(obj) {
    let objType = typeof obj;
    if (obj === null || obj === undefined) {
        return objType;
    } else if (objType === 'number' || objType === 'boolean') {
        return obj.toString();
    } else {
        if (obj['debugName']) {
            return obj['debugName'];
        }
        try {
            return JSON.stringify(obj);
        } catch (e) {}
        return obj.toString();
    }
}

function buildUserHelper(helperFunc) {
    return (_vm, args) => new HelperReference(helperFunc, args);
}
class SimplePathReference {
    constructor(parent, property) {
        this.tag = VOLATILE_TAG;
        this.parent = parent;
        this.property = property;
    }
    value() {
        return this.parent.value()[this.property];
    }
    get(prop) {
        return new SimplePathReference(this, prop);
    }
}
class HelperReference {
    constructor(helper, args) {
        this.tag = VOLATILE_TAG;
        this.helper = helper;
        this.args = args.capture();
    }
    value() {
        let helper = this.helper,
            args = this.args;

        return helper(args.positional.value(), args.named.value());
    }
    get(prop) {
        return new SimplePathReference(this, prop);
    }
}

class DefaultComponentDefinition extends ComponentDefinition {
    toJSON() {
        return `<default-component-definition name=${this.name}>`;
    }
}
const DEFAULT_MANAGER = 'main';
const DEFAULT_HELPERS = {
    action: buildAction
};
class Environment$1 extends Environment {
    constructor(options) {
        super({ appendOperations: options.appendOperations, updateOperations: new DOMChanges$1(options.document || document) });
        this.helpers = dict();
        this.modifiers = dict();
        this.components = dict();
        this.managers = dict();
        setOwner(this, getOwner(options));
        // TODO - required for `protocolForURL` - seek alternative approach
        // e.g. see `installPlatformSpecificProtocolForURL` in Ember
        this.uselessAnchor = options.document.createElement('a');
    }
    static create(options = {}) {
        options.document = options.document || self.document;
        options.appendOperations = options.appendOperations || new DOMTreeConstruction(options.document);
        return new Environment$1(options);
    }
    protocolForURL(url) {
        // TODO - investigate alternative approaches
        // e.g. see `installPlatformSpecificProtocolForURL` in Ember
        this.uselessAnchor.href = url;
        return this.uselessAnchor.protocol;
    }
    hasPartial() {
        return false;
    }
    lookupPartial() {}
    managerFor(managerId = DEFAULT_MANAGER) {
        let manager;
        manager = this.managers[managerId];
        if (!manager) {
            let app = getOwner(this);
            manager = this.managers[managerId] = getOwner(this).lookup(`component-manager:/${app.rootName}/component-managers/${managerId}`);
            if (!manager) {
                throw new Error(`No component manager found for ID ${managerId}.`);
            }
        }
        return manager;
    }
    hasComponentDefinition(name, meta) {
        return !!this.identifyComponent(name, meta);
    }
    getComponentDefinition(name, meta) {
        let owner = getOwner(this);
        let specifier = unwrap(this.identifyComponent(name, meta));
        if (!this.components[specifier]) {
            return this.registerComponent(name, specifier, meta, owner);
        }
        return this.components[specifier];
    }
    registerComponent(name, templateSpecifier, meta, owner) {
        let serializedTemplate = owner.lookup('template', templateSpecifier);
        let componentSpecifier = owner.identify('component', templateSpecifier);
        let componentFactory = null;
        if (componentSpecifier) {
            componentFactory = owner.factoryFor(componentSpecifier);
        }
        let template = templateFactory(serializedTemplate).create(this);
        let manager = this.managerFor(serializedTemplate.meta.managerId);
        let definition;
        if (canCreateComponentDefinition(manager)) {
            definition = manager.createComponentDefinition(name, template, componentFactory);
        } else {
            definition = new DefaultComponentDefinition(name, manager, componentFactory);
        }
        this.components[templateSpecifier] = definition;
        return definition;
    }
    hasHelper(name, meta) {
        return !!this.lookupHelper(name, meta);
    }
    lookupHelper(name, meta) {
        if (DEFAULT_HELPERS[name]) {
            return DEFAULT_HELPERS[name];
        }
        let owner = getOwner(this);
        let relSpecifier = `helper:${name}`;
        let referrer = meta.specifier;
        let specifier = owner.identify(relSpecifier, referrer);
        if (specifier === undefined) {
            return;
        }
        if (!this.helpers[specifier]) {
            return this.registerHelper(specifier, owner);
        }
        return this.helpers[specifier];
    }
    registerHelper(specifier, owner) {
        let helperFunc = owner.lookup(specifier);
        let userHelper = buildUserHelper(helperFunc);
        this.helpers[specifier] = userHelper;
        return userHelper;
    }
    hasModifier(modifierName, blockMeta) {
        return modifierName.length === 1 && modifierName in this.modifiers;
    }
    lookupModifier(modifierName, blockMeta) {
        let modifier = this.modifiers[modifierName];
        if (!modifier) throw new Error(`Modifier for ${modifierName} not found.`);
        return modifier;
    }
    iterableFor(ref, keyPath) {
        let keyFor;
        if (!keyPath) {
            throw new Error('Must specify a key for #each');
        }
        switch (keyPath) {
            case '@index':
                keyFor = (_, index) => String(index);
                break;
            case '@primitive':
                keyFor = item => String(item);
                break;
            default:
                keyFor = item => item[keyPath];
                break;
        }
        return new Iterable(ref, keyFor);
    }
    macros() {
        let macros = super.macros();
        populateMacros(macros.blocks, macros.inlines);
        return macros;
    }
    identifyComponent(name, meta) {
        let owner = getOwner(this);
        let relSpecifier = `template:${name}`;
        let referrer = meta.specifier;
        let specifier = owner.identify(relSpecifier, referrer);
        if (specifier === undefined && owner.identify(`component:${name}`, referrer)) {
            throw new Error(`The component '${name}' is missing a template. All components must have a template. Make sure there is a template.hbs in the component directory.`);
        }
        return specifier;
    }
}
function populateMacros(blocks, inlines) {
    blocks.add('component', blockComponentMacro);
    inlines.add('component', inlineComponentMacro);
}
function canCreateComponentDefinition(manager) {
    return manager.createComponentDefinition !== undefined;
}

var mainTemplate = { "id": "UN61+JFU", "block": "{\"symbols\":[\"root\"],\"statements\":[[4,\"each\",[[19,0,[\"roots\"]]],[[\"key\"],[\"id\"]],{\"statements\":[[4,\"-in-element\",[[19,1,[\"parent\"]]],[[\"nextSibling\"],[[19,1,[\"nextSibling\"]]]],{\"statements\":[[1,[25,\"component\",[[19,1,[\"component\"]]],null],false]],\"parameters\":[]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "specifier": "template:/-application/templates/main" } };

function NOOP() {}
class Application {
    constructor(options) {
        this._roots = [];
        this._rootsIndex = 0;
        this._initializers = [];
        this._initialized = false;
        this._rendering = false;
        this._rendered = false;
        this._scheduled = false;
        this._rerender = NOOP;
        this.rootName = options.rootName;
        this.resolver = options.resolver;
        this.document = options.document || window.document;
    }
    /** @hidden */
    registerInitializer(initializer) {
        this._initializers.push(initializer);
    }
    /** @hidden */
    initRegistry() {
        let registry = this._registry = new Registry();
        // Create ApplicationRegistry as a proxy to the underlying registry
        // that will only be available during `initialize`.
        let appRegistry = new ApplicationRegistry(this._registry, this.resolver);
        registry.register(`environment:/${this.rootName}/main/main`, Environment$1);
        registry.registerOption('helper', 'instantiate', false);
        registry.registerOption('template', 'instantiate', false);
        registry.register(`document:/${this.rootName}/main/main`, this.document);
        registry.registerOption('document', 'instantiate', false);
        registry.registerInjection('environment', 'document', `document:/${this.rootName}/main/main`);
        registry.registerInjection('component-manager', 'env', `environment:/${this.rootName}/main/main`);
        let initializers = this._initializers;
        for (let i = 0; i < initializers.length; i++) {
            initializers[i].initialize(appRegistry);
        }
        this._initialized = true;
    }
    /** @hidden */
    initContainer() {
        this._container = new Container(this._registry, this.resolver);
        // Inject `this` (the app) as the "owner" of every object instantiated
        // by its container.
        this._container.defaultInjections = specifier => {
            let hash = {};
            setOwner(hash, this);
            return hash;
        };
    }
    /** @hidden */
    initialize() {
        this.initRegistry();
        this.initContainer();
    }
    /** @hidden */
    boot() {
        this.initialize();
        this.env = this.lookup(`environment:/${this.rootName}/main/main`);
        this.render();
    }
    /** @hidden */
    render() {
        this.env.begin();
        let mainLayout = templateFactory(mainTemplate).create(this.env);
        let self = new RootReference({ roots: this._roots });
        let doc = this.document; // TODO FixReification
        let parentNode = doc.body;
        let dynamicScope = new DynamicScope();
        let templateIterator = mainLayout.render({ self, parentNode, dynamicScope });
        let result;
        do {
            result = templateIterator.next();
        } while (!result.done);
        this.env.commit();
        let renderResult = result.value;
        this._rerender = () => {
            this.env.begin();
            renderResult.rerender();
            this.env.commit();
            this._didRender();
        };
        this._didRender();
    }
    _didRender() {
        this._rendered = true;
    }
    renderComponent(component, parent, nextSibling = null) {
        this._roots.push({ id: this._rootsIndex++, component, parent, nextSibling });
        this.scheduleRerender();
    }
    scheduleRerender() {
        if (this._scheduled || !this._rendered) return;
        this._rendering = true;
        this._scheduled = true;
        requestAnimationFrame(() => {
            this._scheduled = false;
            this._rerender();
            this._rendering = false;
        });
    }
    /**
     * Owner interface implementation
     *
     * @hidden
     */
    identify(specifier, referrer) {
        return this.resolver.identify(specifier, referrer);
    }
    /** @hidden */
    factoryFor(specifier, referrer) {
        return this._container.factoryFor(this.identify(specifier, referrer));
    }
    /** @hidden */
    lookup(specifier, referrer) {
        return this._container.lookup(this.identify(specifier, referrer));
    }
}

// TODO - use symbol

function isSpecifierStringAbsolute$1(specifier) {
    var _specifier$split = specifier.split(':');

    let type = _specifier$split[0],
        path = _specifier$split[1];

    return !!(type && path && path.indexOf('/') === 0 && path.split('/').length > 3);
}
function isSpecifierObjectAbsolute$1(specifier) {
    return specifier.rootName !== undefined && specifier.collection !== undefined && specifier.name !== undefined && specifier.type !== undefined;
}
function serializeSpecifier$1(specifier) {
    let type = specifier.type;
    let path = serializeSpecifierPath$1(specifier);
    if (path) {
        return type + ':' + path;
    } else {
        return type;
    }
}
function serializeSpecifierPath$1(specifier) {
    let path = [];
    if (specifier.rootName) {
        path.push(specifier.rootName);
    }
    if (specifier.collection) {
        path.push(specifier.collection);
    }
    if (specifier.namespace) {
        path.push(specifier.namespace);
    }
    if (specifier.name) {
        path.push(specifier.name);
    }
    if (path.length > 0) {
        let fullPath = path.join('/');
        if (isSpecifierObjectAbsolute$1(specifier)) {
            fullPath = '/' + fullPath;
        }
        return fullPath;
    }
}
function deserializeSpecifier$1(specifier) {
    let obj = {};
    if (specifier.indexOf(':') > -1) {
        var _specifier$split2 = specifier.split(':');

        let type = _specifier$split2[0],
            path = _specifier$split2[1];

        obj.type = type;
        let pathSegments;
        if (path.indexOf('/') === 0) {
            pathSegments = path.substr(1).split('/');
            obj.rootName = pathSegments.shift();
            obj.collection = pathSegments.shift();
        } else {
            pathSegments = path.split('/');
        }
        if (pathSegments.length > 0) {
            obj.name = pathSegments.pop();
            if (pathSegments.length > 0) {
                obj.namespace = pathSegments.join('/');
            }
        }
    } else {
        obj.type = specifier;
    }
    return obj;
}

function assert$1(description, test) {
    if (!test) {
        throw new Error('Assertion Failed: ' + description);
    }
}

class Resolver {
    constructor(config, registry) {
        this.config = config;
        this.registry = registry;
    }
    identify(specifier, referrer) {
        if (isSpecifierStringAbsolute$1(specifier)) {
            return specifier;
        }
        let s = deserializeSpecifier$1(specifier);
        let result;
        if (referrer) {
            let r = deserializeSpecifier$1(referrer);
            if (isSpecifierObjectAbsolute$1(r)) {
                assert$1('Specifier must not include a rootName, collection, or namespace when combined with an absolute referrer', s.rootName === undefined && s.collection === undefined && s.namespace === undefined);
                // Look locally in the referrer's namespace
                s.rootName = r.rootName;
                s.collection = r.collection;
                if (s.name) {
                    s.namespace = r.namespace ? r.namespace + '/' + r.name : r.name;
                } else {
                    s.namespace = r.namespace;
                    s.name = r.name;
                }
                if (result = this._serializeAndVerify(s)) {
                    return result;
                }
                // Look for a private collection in the referrer's namespace
                let privateCollection = this._definitiveCollection(s.type);
                if (privateCollection) {
                    s.namespace += '/-' + privateCollection;
                    if (result = this._serializeAndVerify(s)) {
                        return result;
                    }
                }
                // Because local and private resolution has failed, clear all but `name` and `type`
                // to proceed with top-level resolution
                s.rootName = s.collection = s.namespace = undefined;
            } else {
                assert$1('Referrer must either be "absolute" or include a `type` to determine the associated type', r.type);
                // Look in the definitive collection for the associated type
                s.collection = this._definitiveCollection(r.type);
                assert$1(`'${r.type}' does not have a definitive collection`, s.collection);
            }
        }
        // If the collection is unspecified, use the definitive collection for the `type`
        if (!s.collection) {
            s.collection = this._definitiveCollection(s.type);
            assert$1(`'${s.type}' does not have a definitive collection`, s.collection);
        }
        if (!s.rootName) {
            // If the root name is unspecified, try the app's `rootName` first
            s.rootName = this.config.app.rootName || 'app';
            if (result = this._serializeAndVerify(s)) {
                return result;
            }
            // Then look for an addon with a matching `rootName`
            let addonDef;
            if (s.namespace) {
                addonDef = this.config.addons && this.config.addons[s.namespace];
                s.rootName = s.namespace;
                s.namespace = undefined;
            } else {
                addonDef = this.config.addons && this.config.addons[s.name];
                s.rootName = s.name;
                s.name = 'main';
            }
        }
        if (result = this._serializeAndVerify(s)) {
            return result;
        }
    }
    retrieve(specifier) {
        return this.registry.get(specifier);
    }
    resolve(specifier, referrer) {
        let id = this.identify(specifier, referrer);
        if (id) {
            return this.retrieve(id);
        }
    }
    _definitiveCollection(type) {
        let typeDef = this.config.types[type];
        assert$1(`'${type}' is not a recognized type`, typeDef);
        return typeDef.definitiveCollection;
    }
    _serializeAndVerify(specifier) {
        let serialized = serializeSpecifier$1(specifier);
        if (this.registry.has(serialized)) {
            return serialized;
        }
    }
}

class BasicRegistry {
    constructor(entries = {}) {
        this._entries = entries;
    }
    has(specifier) {
        return specifier in this._entries;
    }
    get(specifier) {
        return this._entries[specifier];
    }
}

function tracked(...dependencies) {
    let target = dependencies[0],
        key = dependencies[1],
        descriptor = dependencies[2];

    if (typeof target === "string") {
        return function (target, key, descriptor) {
            return descriptorForTrackedComputedProperty(target, key, descriptor, dependencies);
        };
    } else {
        if (descriptor) {
            return descriptorForTrackedComputedProperty(target, key, descriptor, []);
        } else {
            installTrackedProperty(target, key);
        }
    }
}
function descriptorForTrackedComputedProperty(target, key, descriptor, dependencies) {
    let meta = metaFor$1(target);
    meta.trackedProperties[key] = true;
    meta.trackedPropertyDependencies[key] = dependencies || [];
    return {
        enumerable: true,
        configurable: false,
        get: descriptor.get,
        set: function set() {
            metaFor$1(this).dirtyableTagFor(key).inner.dirty();
            descriptor.set.apply(this, arguments);
            propertyDidChange();
        }
    };
}
/**
  Installs a getter/setter for change tracking. The accessor
  acts just like a normal property, but it triggers the `propertyDidChange`
  hook when written to.

  Values are saved on the object using a "shadow key," or a symbol based on the
  tracked property name. Sets write the value to the shadow key, and gets read
  from it.
 */
function installTrackedProperty(target, key) {
    let value;
    let shadowKey = Symbol(key);
    let meta = metaFor$1(target);
    meta.trackedProperties[key] = true;
    if (target[key] !== undefined) {
        value = target[key];
    }
    Object.defineProperty(target, key, {
        configurable: true,
        get() {
            return this[shadowKey];
        },
        set(newValue) {
            metaFor$1(this).dirtyableTagFor(key).inner.dirty();
            this[shadowKey] = newValue;
            propertyDidChange();
        }
    });
}
/**
 * Stores bookkeeping information about tracked properties on the target object
 * and includes helper methods for manipulating and retrieving that data.
 *
 * Computed properties (i.e., tracked getters/setters) deserve some explanation.
 * A computed property is invalidated when either it is set, or one of its
 * dependencies is invalidated. Therefore, we store two tags for each computed
 * property:
 *
 * 1. The dirtyable tag that we invalidate when the setter is invoked.
 * 2. A union tag (tag combinator) of the dirtyable tag and all of the computed
 *    property's dependencies' tags, used by Glimmer to determine "does this
 *    computed property need to be recomputed?"
 */
class Meta$2 {
    constructor(parent) {
        this.tags = dict();
        this.computedPropertyTags = dict();
        this.trackedProperties = parent ? Object.create(parent.trackedProperties) : dict();
        this.trackedPropertyDependencies = parent ? Object.create(parent.trackedPropertyDependencies) : dict();
    }
    /**
     * The tag representing whether the given property should be recomputed. Used
     * by e.g. Glimmer VM to detect when a property should be re-rendered. Think
     * of this as the "public-facing" tag.
     *
     * For static tracked properties, this is a single DirtyableTag. For computed
     * properties, it is a combinator of the property's DirtyableTag as well as
     * all of its dependencies' tags.
     */
    tagFor(key) {
        let tag = this.tags[key];
        if (tag) {
            return tag;
        }
        let dependencies;
        if (dependencies = this.trackedPropertyDependencies[key]) {
            return this.tags[key] = combinatorForComputedProperties(this, key, dependencies);
        }
        return this.tags[key] = DirtyableTag.create();
    }
    /**
     * The tag used internally to invalidate when a tracked property is set. For
     * static properties, this is the same DirtyableTag returned from `tagFor`.
     * For computed properties, it is the DirtyableTag used as one of the tags in
     * the tag combinator of the CP and its dependencies.
    */
    dirtyableTagFor(key) {
        let dependencies = this.trackedPropertyDependencies[key];
        let tag;
        if (dependencies) {
            // The key is for a computed property.
            tag = this.computedPropertyTags[key];
            if (tag) {
                return tag;
            }
            return this.computedPropertyTags[key] = DirtyableTag.create();
        } else {
            // The key is for a static property.
            tag = this.tags[key];
            if (tag) {
                return tag;
            }
            return this.tags[key] = DirtyableTag.create();
        }
    }
}
function combinatorForComputedProperties(meta, key, dependencies) {
    // Start off with the tag for the CP's own dirty state.
    let tags = [meta.dirtyableTagFor(key)];
    // Next, add in all of the tags for its dependencies.
    if (dependencies && dependencies.length) {
        for (let i = 0; i < dependencies.length; i++) {
            tags.push(meta.tagFor(dependencies[i]));
        }
    }
    // Return a combinator across the CP's tags and its dependencies' tags.
    return combine(tags);
}
let META = Symbol("ember-object");
function metaFor$1(obj) {
    let meta = obj[META];
    if (meta && hasOwnProperty$1(obj, META)) {
        return meta;
    }
    return obj[META] = new Meta$2(meta);
}
let hOP = Object.prototype.hasOwnProperty;
function hasOwnProperty$1(obj, key) {
    return hOP.call(obj, key);
}
let propertyDidChange = function propertyDidChange() {};
function setPropertyDidChange(cb) {
    propertyDidChange = cb;
}
function hasTag(obj, key) {
    let meta = obj[META];
    if (!obj[META]) {
        return false;
    }
    if (!meta.trackedProperties[key]) {
        return false;
    }
    return true;
}
class UntrackedPropertyError extends Error {
    constructor(target, key, message) {
        super(message);
        this.target = target;
        this.key = key;
    }
    static for(obj, key) {
        return new UntrackedPropertyError(obj, key, `The property '${key}' on ${obj} was changed after being rendered. If you want to change a property used in a template after the component has rendered, mark the property as a tracked property with the @tracked decorator.`);
    }
}
function defaultErrorThrower(obj, key) {
    throw UntrackedPropertyError.for(obj, key);
}
function tagForProperty(obj, key, throwError = defaultErrorThrower) {
    if (typeof obj === "object" && obj) {
        if (true && !hasTag(obj, key)) {
            installDevModeErrorInterceptor(obj, key, throwError);
        }
        let meta = metaFor$1(obj);
        return meta.tagFor(key);
    } else {
        return CONSTANT_TAG;
    }
}
/**
 * In development mode only, we install an ad hoc setter on properties where a
 * tag is requested (i.e., it was used in a template) without being tracked. In
 * cases where the property is set, we raise an error.
 */
function installDevModeErrorInterceptor(obj, key, throwError) {
    let target = obj;
    let descriptor;
    // Find the descriptor for the current property. We may need to walk the
    // prototype chain to do so. If the property is undefined, we may never get a
    // descriptor here.
    let hasOwnDescriptor = true;
    while (target) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
        if (descriptor) {
            break;
        }
        hasOwnDescriptor = false;
        target = Object.getPrototypeOf(target);
    }
    // If possible, define a property descriptor that passes through the current
    // value on reads but throws an exception on writes.
    if (descriptor) {
        if (descriptor.configurable || !hasOwnDescriptor) {
            Object.defineProperty(obj, key, {
                configurable: descriptor.configurable,
                enumerable: descriptor.enumerable,
                get() {
                    if (descriptor.get) {
                        return descriptor.get.call(this);
                    } else {
                        return descriptor.value;
                    }
                },
                set() {
                    throwError(this, key);
                }
            });
        }
    } else {
        Object.defineProperty(obj, key, {
            set() {
                throwError(this, key);
            }
        });
    }
}

/**
 * The `Component` class defines an encapsulated UI element that is rendered to
 * the DOM. A component is made up of a template and, optionally, this component
 * object.
 *
 * ## Defining a Component
 *
 * To define a component, subclass `Component` and add your own properties,
 * methods and lifecycle hooks:
 *
 * ```ts
 * import Component from '@glimmer/component';
 *
 * export default class extends Component {
 * }
 * ```
 *
 * ## Lifecycle Hooks
 *
 * Lifecycle hooks allow you to respond to changes to a component, such as when
 * it gets created, rendered, updated or destroyed. To add a lifecycle hook to a
 * component, implement the hook as a method on your component subclass.
 *
 * For example, to be notified when Glimmer has rendered your component so you
 * can attach a legacy jQuery plugin, implement the `didInsertElement()` method:
 *
 * ```ts
 * import Component from '@glimmer/component';
 *
 * export default class extends Component {
 *   didInsertElement() {
 *     $(this.element).pickadate();
 *   }
 * }
 * ```
 *
 * ## Data for Templates
 *
 * `Component`s have two different kinds of data, or state, that can be
 * displayed in templates:
 *
 * 1. Arguments
 * 2. Properties
 *
 * Arguments are data that is passed in to a component from its parent
 * component. For example, if I have a `user-greeting` component, I can pass it
 * a name and greeting to use:
 *
 * ```hbs
 * <user-greeting @name="Ricardo" @greeting="Olá">
 * ```
 *
 * Inside my `user-greeting` template, I can access the `@name` and `@greeting`
 * arguments that I've been given:
 *
 * ```hbs
 * {{@greeting}}, {{@name}}!
 * ```
 *
 * Arguments are also available inside my component:
 *
 * ```ts
 * console.log(this.args.greeting); // prints "Olá"
 * ```
 *
 * Properties, on the other hand, are internal to the component and declared in
 * the class. You can use properties to store data that you want to show in the
 * template, or pass to another component as an argument.
 *
 * ```ts
 * import Component from '@glimmer/component';
 *
 * export default class extends Component {
 *   user = {
 *     name: 'Robbie'
 *   }
 * }
 * ```
 *
 * In the above example, we've defined a component with a `user` property that
 * contains an object with its own `name` property.
 *
 * We can render that property in our template:
 *
 * ```hbs
 * Hello, {{user.name}}!
 * ```
 *
 * We can also take that property and pass it as an argument to the
 * `user-greeting` component we defined above:
 *
 * ```hbs
 * <user-greeting @greeting="Hello" @name={{user.name}} />
 * ```
 *
 * ## Arguments vs. Properties
 *
 * Remember, arguments are data that was given to your component by its parent
 * component, and properties are data your component has defined for itself.
 *
 * You can tell the difference between arguments and properties in templates
 * because arguments always start with an `@` sign (think "A is for arguments"):
 *
 * ```hbs
 * {{@firstName}}
 * ```
 *
 * We know that `@firstName` came from the parent component, not the current
 * component, because it starts with `@` and is therefore an argument.
 *
 * On the other hand, if we see:
 *
 * ```hbs
 * {{name}}
 * ```
 *
 * We know that `name` is a property on the component. If we want to know where
 * the data is coming from, we can go look at our component class to find out.
 *
 * Inside the component itself, arguments always show up inside the component's
 * `args` property. For example, if `{{@firstName}}` is `Tom` in the template,
 * inside the component `this.args.firstName` would also be `Tom`.
 */
class Component {
  /**
   * Constructs a new component and assigns itself the passed properties. You
   * should not construct new components yourself. Instead, Glimmer will
   * instantiate new components automatically as it renders.
   *
   * @param options
   */
  constructor(options) {
    /**
     * The element corresponding to the top-level element of the component's template.
     * You should not try to access this property until after the component's `didInsertElement()`
     * lifecycle hook is called.
     */
    this.element = null;
    /**
     * Development-mode only name of the component, useful for debugging.
     */
    this.debugName = null;
    /** @private
     * Slot on the component to save Arguments object passed to the `args` setter.
     */
    this.__args__ = null;
    Object.assign(this, options);
  }
  /**
   * Named arguments passed to the component from its parent component.
   * They can be accessed in JavaScript via `this.args.argumentName` and in the template via `@argumentName`.
   *
   * Say you have the following component, which will have two `args`, `firstName` and `lastName`:
   *
   * ```hbs
   * <my-component @firstName="Arthur" @lastName="Dent" />
   * ```
   *
   * If you needed to calculate `fullName` by combining both of them, you would do:
   *
   * ```ts
   * didInsertElement() {
   *   console.log(`Hi, my full name is ${this.args.firstName} ${this.args.lastName}`);
   * }
   * ```
   *
   * While in the template you could do:
   *
   * ```hbs
   * <p>Welcome, {{@firstName}} {{@lastName}}!</p>
   * ```
   *
   */
  get args() {
    return this.__args__;
  }
  set args(args) {
    this.__args__ = args;
    metaFor$1(this).dirtyableTagFor("args").inner.dirty();
  }
  static create(injections) {
    return new this(injections);
  }
  /**
   * Called when the component has been inserted into the DOM.
   * Override this function to do any set up that requires an element in the document body.
   */
  didInsertElement() {}
  /**
   * Called when the component has updated and rerendered itself.
   * Called only during a rerender, not during an initial render.
   */
  didUpdate() {}
  /**
   * Called before the component has been removed from the DOM.
   */
  willDestroy() {}
  destroy() {
    this.willDestroy();
  }
  toString() {
    return `${this.debugName} component`;
  }
}

class ComponentDefinition$1 extends ComponentDefinition {
    constructor(name, manager, template, componentFactory) {
        super(name, manager, componentFactory);
        this.template = template;
        this.componentFactory = componentFactory;
    }
    toJSON() {
        return { GlimmerDebug: `<component-definition name="${this.name}">` };
    }
}

/**
 * The base PathReference.
 */
class ComponentPathReference {
    get(key) {
        return PropertyReference$1.create(this, key);
    }
}
class CachedReference$1 extends ComponentPathReference {
    constructor() {
        super(...arguments);
        this._lastRevision = null;
        this._lastValue = null;
    }
    value() {
        let tag = this.tag,
            _lastRevision = this._lastRevision,
            _lastValue = this._lastValue;

        if (!_lastRevision || !tag.validate(_lastRevision)) {
            _lastValue = this._lastValue = this.compute();
            this._lastRevision = tag.value();
        }
        return _lastValue;
    }
}
class RootReference$1 extends ConstReference {
    constructor() {
        super(...arguments);
        this.children = dict();
    }
    get(propertyKey) {
        let ref = this.children[propertyKey];
        if (!ref) {
            ref = this.children[propertyKey] = new RootPropertyReference(this.inner, propertyKey);
        }
        return ref;
    }
}
class PropertyReference$1 extends CachedReference$1 {
    static create(parentReference, propertyKey) {
        if (isConst(parentReference)) {
            return new RootPropertyReference(parentReference.value(), propertyKey);
        } else {
            return new NestedPropertyReference(parentReference, propertyKey);
        }
    }
    get(key) {
        return new NestedPropertyReference(this, key);
    }
}
function buildError(obj, key) {
    let message = `The '${key}' property on the ${obj} was changed after it had been rendered. Properties that change after being rendered must be tracked. Use the @tracked decorator to mark this as a tracked property.`;
    throw new UntrackedPropertyError(obj, key, message);
}
class RootPropertyReference extends PropertyReference$1 {
    constructor(parentValue, propertyKey) {
        super();
        this._parentValue = parentValue;
        this._propertyKey = propertyKey;
        this.tag = tagForProperty(parentValue, propertyKey, buildError);
    }
    compute() {
        return this._parentValue[this._propertyKey];
    }
}
class NestedPropertyReference extends PropertyReference$1 {
    constructor(parentReference, propertyKey) {
        super();
        let parentReferenceTag = parentReference.tag;
        let parentObjectTag = UpdatableTag.create(CONSTANT_TAG);
        this._parentReference = parentReference;
        this._parentObjectTag = parentObjectTag;
        this._propertyKey = propertyKey;
        this.tag = combine([parentReferenceTag, parentObjectTag]);
    }
    compute() {
        let _parentReference = this._parentReference,
            _parentObjectTag = this._parentObjectTag,
            _propertyKey = this._propertyKey;

        let parentValue = _parentReference.value();
        _parentObjectTag.inner.update(tagForProperty(parentValue, _propertyKey));
        if (typeof parentValue === "string" && _propertyKey === "length") {
            return parentValue.length;
        }
        if (typeof parentValue === "object" && parentValue) {
            return parentValue[_propertyKey];
        } else {
            return undefined;
        }
    }
}

class ComponentStateBucket {
    constructor(definition, args, owner) {
        let componentFactory = definition.componentFactory;
        let name = definition.name;
        this.args = args;
        let injections = {
            debugName: name,
            args: this.namedArgsSnapshot()
        };
        setOwner(injections, owner);
        this.component = componentFactory.create(injections);
    }
    get tag() {
        return this.args.tag;
    }
    namedArgsSnapshot() {
        return Object.freeze(this.args.named.value());
    }
}
class LayoutCompiler {
    constructor(name, template) {
        this.template = template;
        this.name = name;
    }
    compile(builder) {
        builder.fromLayout(this.name, this.template);
    }
}
class ComponentManager {
    static create(options) {
        return new ComponentManager(options);
    }
    constructor(options) {
        this.env = options.env;
    }
    prepareArgs(definition, args) {
        return null;
    }
    create(environment, definition, volatileArgs) {
        let owner = getOwner(this.env);
        return new ComponentStateBucket(definition, volatileArgs.capture(), owner);
    }
    createComponentDefinition(name, template, componentFactory) {
        if (!componentFactory) {
            componentFactory = {
                class: Component,
                create(injections) {
                    return this.class.create(injections);
                }
            };
        }
        return new ComponentDefinition$1(name, this, template, componentFactory);
    }
    layoutFor(definition, bucket, env) {
        let template = definition.template;
        return compileLayout(new LayoutCompiler(definition.name, template), this.env);
    }
    getSelf(bucket) {
        return new RootReference$1(bucket.component);
    }
    didCreateElement(bucket, element) {
        if (!bucket) {
            return;
        }
        bucket.component.element = element;
    }
    didRenderLayout(bucket, bounds) {}
    didCreate(bucket) {
        bucket && bucket.component.didInsertElement();
    }
    getTag({ tag }) {
        return tag;
    }
    update(bucket, scope) {}
    didUpdateLayout() {}
    didUpdate(bucket) {
        if (!bucket) {
            return;
        }
        // TODO: This should be moved to `didUpdate`, but there's currently a
        // Glimmer bug that causes it not to be called if the layout doesn't update.
        let component = bucket.component;

        component.args = bucket.namedArgsSnapshot();
        component.didUpdate();
    }
    getDestructor(bucket) {
        return bucket.component;
    }
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var leafletSrc = createCommonjsModule(function (module, exports) {
	/* @preserve
  * Leaflet 1.2.0, a JS library for interactive maps. http://leafletjs.com
  * (c) 2010-2017 Vladimir Agafonkin, (c) 2010-2011 CloudMade
  */
	(function (global, factory) {
		factory(exports);
	})(commonjsGlobal, function (exports) {
		'use strict';

		var version = "1.2.0";

		/*
   * @namespace Util
   *
   * Various utility functions, used by Leaflet internally.
   */

		var freeze = Object.freeze;
		Object.freeze = function (obj) {
			return obj;
		};

		// @function extend(dest: Object, src?: Object): Object
		// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
		function extend(dest) {
			var i, j, len, src;

			for (j = 1, len = arguments.length; j < len; j++) {
				src = arguments[j];
				for (i in src) {
					dest[i] = src[i];
				}
			}
			return dest;
		}

		// @function create(proto: Object, properties?: Object): Object
		// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
		var create = Object.create || function () {
			function F() {}
			return function (proto) {
				F.prototype = proto;
				return new F();
			};
		}();

		// @function bind(fn: Function, …): Function
		// Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
		// Has a `L.bind()` shortcut.
		function bind(fn, obj) {
			var slice = Array.prototype.slice;

			if (fn.bind) {
				return fn.bind.apply(fn, slice.call(arguments, 1));
			}

			var args = slice.call(arguments, 2);

			return function () {
				return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
			};
		}

		// @property lastId: Number
		// Last unique ID used by [`stamp()`](#util-stamp)
		var lastId = 0;

		// @function stamp(obj: Object): Number
		// Returns the unique ID of an object, assiging it one if it doesn't have it.
		function stamp(obj) {
			/*eslint-disable */
			obj._leaflet_id = obj._leaflet_id || ++lastId;
			return obj._leaflet_id;
			/*eslint-enable */
		}

		// @function throttle(fn: Function, time: Number, context: Object): Function
		// Returns a function which executes function `fn` with the given scope `context`
		// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
		// `fn` will be called no more than one time per given amount of `time`. The arguments
		// received by the bound function will be any arguments passed when binding the
		// function, followed by any arguments passed when invoking the bound function.
		// Has an `L.throttle` shortcut.
		function throttle(fn, time, context) {
			var lock, args, wrapperFn, later;

			later = function later() {
				// reset lock and call if queued
				lock = false;
				if (args) {
					wrapperFn.apply(context, args);
					args = false;
				}
			};

			wrapperFn = function wrapperFn() {
				if (lock) {
					// called too soon, queue to call later
					args = arguments;
				} else {
					// call and lock until later
					fn.apply(context, arguments);
					setTimeout(later, time);
					lock = true;
				}
			};

			return wrapperFn;
		}

		// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
		// Returns the number `num` modulo `range` in such a way so it lies within
		// `range[0]` and `range[1]`. The returned value will be always smaller than
		// `range[1]` unless `includeMax` is set to `true`.
		function wrapNum(x, range, includeMax) {
			var max = range[1],
			    min = range[0],
			    d = max - min;
			return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
		}

		// @function falseFn(): Function
		// Returns a function which always returns `false`.
		function falseFn() {
			return false;
		}

		// @function formatNum(num: Number, digits?: Number): Number
		// Returns the number `num` rounded to `digits` decimals, or to 5 decimals by default.
		function formatNum(num, digits) {
			var pow = Math.pow(10, digits || 5);
			return Math.round(num * pow) / pow;
		}

		// @function trim(str: String): String
		// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
		function trim(str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
		}

		// @function splitWords(str: String): String[]
		// Trims and splits the string on whitespace and returns the array of parts.
		function splitWords(str) {
			return trim(str).split(/\s+/);
		}

		// @function setOptions(obj: Object, options: Object): Object
		// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
		function setOptions(obj, options) {
			if (!obj.hasOwnProperty('options')) {
				obj.options = obj.options ? create(obj.options) : {};
			}
			for (var i in options) {
				obj.options[i] = options[i];
			}
			return obj.options;
		}

		// @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
		// Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
		// translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
		// be appended at the end. If `uppercase` is `true`, the parameter names will
		// be uppercased (e.g. `'?A=foo&B=bar'`)
		function getParamString(obj, existingUrl, uppercase) {
			var params = [];
			for (var i in obj) {
				params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
			}
			return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
		}

		var templateRe = /\{ *([\w_\-]+) *\}/g;

		// @function template(str: String, data: Object): String
		// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
		// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
		// `('Hello foo, bar')`. You can also specify functions instead of strings for
		// data values — they will be evaluated passing `data` as an argument.
		function template(str, data) {
			return str.replace(templateRe, function (str, key) {
				var value = data[key];

				if (value === undefined) {
					throw new Error('No value provided for variable ' + str);
				} else if (typeof value === 'function') {
					value = value(data);
				}
				return value;
			});
		}

		// @function isArray(obj): Boolean
		// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
		var isArray = Array.isArray || function (obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		};

		// @function indexOf(array: Array, el: Object): Number
		// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
		function indexOf(array, el) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] === el) {
					return i;
				}
			}
			return -1;
		}

		// @property emptyImageUrl: String
		// Data URI string containing a base64-encoded empty GIF image.
		// Used as a hack to free memory from unused images on WebKit-powered
		// mobile devices (by setting image `src` to this string).
		var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

		// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

		function getPrefixed(name) {
			return window['webkit' + name] || window['moz' + name] || window['ms' + name];
		}

		var lastTime = 0;

		// fallback for IE 7-8
		function timeoutDefer(fn) {
			var time = +new Date(),
			    timeToCall = Math.max(0, 16 - (time - lastTime));

			lastTime = time + timeToCall;
			return window.setTimeout(fn, timeToCall);
		}

		var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
		var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') || getPrefixed('CancelRequestAnimationFrame') || function (id) {
			window.clearTimeout(id);
		};

		// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
		// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
		// `context` if given. When `immediate` is set, `fn` is called immediately if
		// the browser doesn't have native support for
		// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
		// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
		function requestAnimFrame(fn, context, immediate) {
			if (immediate && requestFn === timeoutDefer) {
				fn.call(context);
			} else {
				return requestFn.call(window, bind(fn, context));
			}
		}

		// @function cancelAnimFrame(id: Number): undefined
		// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
		function cancelAnimFrame(id) {
			if (id) {
				cancelFn.call(window, id);
			}
		}

		var Util = (Object.freeze || Object)({
			freeze: freeze,
			extend: extend,
			create: create,
			bind: bind,
			lastId: lastId,
			stamp: stamp,
			throttle: throttle,
			wrapNum: wrapNum,
			falseFn: falseFn,
			formatNum: formatNum,
			trim: trim,
			splitWords: splitWords,
			setOptions: setOptions,
			getParamString: getParamString,
			template: template,
			isArray: isArray,
			indexOf: indexOf,
			emptyImageUrl: emptyImageUrl,
			requestFn: requestFn,
			cancelFn: cancelFn,
			requestAnimFrame: requestAnimFrame,
			cancelAnimFrame: cancelAnimFrame
		});

		// @class Class
		// @aka L.Class

		// @section
		// @uninheritable

		// Thanks to John Resig and Dean Edwards for inspiration!

		function Class() {}

		Class.extend = function (props) {

			// @function extend(props: Object): Function
			// [Extends the current class](#class-inheritance) given the properties to be included.
			// Returns a Javascript function that is a class constructor (to be called with `new`).
			var NewClass = function NewClass() {

				// call the constructor
				if (this.initialize) {
					this.initialize.apply(this, arguments);
				}

				// call all constructor hooks
				this.callInitHooks();
			};

			var parentProto = NewClass.__super__ = this.prototype;

			var proto = create(parentProto);
			proto.constructor = NewClass;

			NewClass.prototype = proto;

			// inherit parent's statics
			for (var i in this) {
				if (this.hasOwnProperty(i) && i !== 'prototype' && i !== '__super__') {
					NewClass[i] = this[i];
				}
			}

			// mix static properties into the class
			if (props.statics) {
				extend(NewClass, props.statics);
				delete props.statics;
			}

			// mix includes into the prototype
			if (props.includes) {
				checkDeprecatedMixinEvents(props.includes);
				extend.apply(null, [proto].concat(props.includes));
				delete props.includes;
			}

			// merge options
			if (proto.options) {
				props.options = extend(create(proto.options), props.options);
			}

			// mix given properties into the prototype
			extend(proto, props);

			proto._initHooks = [];

			// add method for calling all hooks
			proto.callInitHooks = function () {

				if (this._initHooksCalled) {
					return;
				}

				if (parentProto.callInitHooks) {
					parentProto.callInitHooks.call(this);
				}

				this._initHooksCalled = true;

				for (var i = 0, len = proto._initHooks.length; i < len; i++) {
					proto._initHooks[i].call(this);
				}
			};

			return NewClass;
		};

		// @function include(properties: Object): this
		// [Includes a mixin](#class-includes) into the current class.
		Class.include = function (props) {
			extend(this.prototype, props);
			return this;
		};

		// @function mergeOptions(options: Object): this
		// [Merges `options`](#class-options) into the defaults of the class.
		Class.mergeOptions = function (options) {
			extend(this.prototype.options, options);
			return this;
		};

		// @function addInitHook(fn: Function): this
		// Adds a [constructor hook](#class-constructor-hooks) to the class.
		Class.addInitHook = function (fn) {
			// (Function) || (String, args...)
			var args = Array.prototype.slice.call(arguments, 1);

			var init = typeof fn === 'function' ? fn : function () {
				this[fn].apply(this, args);
			};

			this.prototype._initHooks = this.prototype._initHooks || [];
			this.prototype._initHooks.push(init);
			return this;
		};

		function checkDeprecatedMixinEvents(includes) {
			if (!L || !L.Mixin) {
				return;
			}

			includes = isArray(includes) ? includes : [includes];

			for (var i = 0; i < includes.length; i++) {
				if (includes[i] === L.Mixin.Events) {
					console.warn('Deprecated include of L.Mixin.Events: ' + 'this property will be removed in future releases, ' + 'please inherit from L.Evented instead.', new Error().stack);
				}
			}
		}

		/*
   * @class Evented
   * @aka L.Evented
   * @inherits Class
   *
   * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
   *
   * @example
   *
   * ```js
   * map.on('click', function(e) {
   * 	alert(e.latlng);
   * } );
   * ```
   *
   * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
   *
   * ```js
   * function onClick(e) { ... }
   *
   * map.on('click', onClick);
   * map.off('click', onClick);
   * ```
   */

		var Events = {
			/* @method on(type: String, fn: Function, context?: Object): this
    * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
    *
    * @alternative
    * @method on(eventMap: Object): this
    * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
    */
			on: function on(types, fn, context) {

				// types can be a map of types/handlers
				if (typeof types === 'object') {
					for (var type in types) {
						// we don't process space-separated events here for performance;
						// it's a hot path since Layer uses the on(obj) syntax
						this._on(type, types[type], fn);
					}
				} else {
					// types can be a string of space-separated words
					types = splitWords(types);

					for (var i = 0, len = types.length; i < len; i++) {
						this._on(types[i], fn, context);
					}
				}

				return this;
			},

			/* @method off(type: String, fn?: Function, context?: Object): this
    * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
    *
    * @alternative
    * @method off(eventMap: Object): this
    * Removes a set of type/listener pairs.
    *
    * @alternative
    * @method off: this
    * Removes all listeners to all events on the object.
    */
			off: function off(types, fn, context) {

				if (!types) {
					// clear all listeners if called without arguments
					delete this._events;
				} else if (typeof types === 'object') {
					for (var type in types) {
						this._off(type, types[type], fn);
					}
				} else {
					types = splitWords(types);

					for (var i = 0, len = types.length; i < len; i++) {
						this._off(types[i], fn, context);
					}
				}

				return this;
			},

			// attach listener (without syntactic sugar now)
			_on: function _on(type, fn, context) {
				this._events = this._events || {};

				/* get/init listeners for type */
				var typeListeners = this._events[type];
				if (!typeListeners) {
					typeListeners = [];
					this._events[type] = typeListeners;
				}

				if (context === this) {
					// Less memory footprint.
					context = undefined;
				}
				var newListener = { fn: fn, ctx: context },
				    listeners = typeListeners;

				// check if fn already there
				for (var i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i].fn === fn && listeners[i].ctx === context) {
						return;
					}
				}

				listeners.push(newListener);
			},

			_off: function _off(type, fn, context) {
				var listeners, i, len;

				if (!this._events) {
					return;
				}

				listeners = this._events[type];

				if (!listeners) {
					return;
				}

				if (!fn) {
					// Set all removed listeners to noop so they are not called if remove happens in fire
					for (i = 0, len = listeners.length; i < len; i++) {
						listeners[i].fn = falseFn;
					}
					// clear all listeners for a type if function isn't specified
					delete this._events[type];
					return;
				}

				if (context === this) {
					context = undefined;
				}

				if (listeners) {

					// find fn and remove it
					for (i = 0, len = listeners.length; i < len; i++) {
						var l = listeners[i];
						if (l.ctx !== context) {
							continue;
						}
						if (l.fn === fn) {

							// set the removed listener to noop so that's not called if remove happens in fire
							l.fn = falseFn;

							if (this._firingCount) {
								/* copy array in case events are being fired */
								this._events[type] = listeners = listeners.slice();
							}
							listeners.splice(i, 1);

							return;
						}
					}
				}
			},

			// @method fire(type: String, data?: Object, propagate?: Boolean): this
			// Fires an event of the specified type. You can optionally provide an data
			// object — the first argument of the listener function will contain its
			// properties. The event can optionally be propagated to event parents.
			fire: function fire(type, data, propagate) {
				if (!this.listens(type, propagate)) {
					return this;
				}

				var event = extend({}, data, { type: type, target: this });

				if (this._events) {
					var listeners = this._events[type];

					if (listeners) {
						this._firingCount = this._firingCount + 1 || 1;
						for (var i = 0, len = listeners.length; i < len; i++) {
							var l = listeners[i];
							l.fn.call(l.ctx || this, event);
						}

						this._firingCount--;
					}
				}

				if (propagate) {
					// propagate the event to parents (set with addEventParent)
					this._propagateEvent(event);
				}

				return this;
			},

			// @method listens(type: String): Boolean
			// Returns `true` if a particular event type has any listeners attached to it.
			listens: function listens(type, propagate) {
				var listeners = this._events && this._events[type];
				if (listeners && listeners.length) {
					return true;
				}

				if (propagate) {
					// also check parents for listeners if event propagates
					for (var id in this._eventParents) {
						if (this._eventParents[id].listens(type, propagate)) {
							return true;
						}
					}
				}
				return false;
			},

			// @method once(…): this
			// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
			once: function once(types, fn, context) {

				if (typeof types === 'object') {
					for (var type in types) {
						this.once(type, types[type], fn);
					}
					return this;
				}

				var handler = bind(function () {
					this.off(types, fn, context).off(types, handler, context);
				}, this);

				// add a listener that's executed once and removed after that
				return this.on(types, fn, context).on(types, handler, context);
			},

			// @method addEventParent(obj: Evented): this
			// Adds an event parent - an `Evented` that will receive propagated events
			addEventParent: function addEventParent(obj) {
				this._eventParents = this._eventParents || {};
				this._eventParents[stamp(obj)] = obj;
				return this;
			},

			// @method removeEventParent(obj: Evented): this
			// Removes an event parent, so it will stop receiving propagated events
			removeEventParent: function removeEventParent(obj) {
				if (this._eventParents) {
					delete this._eventParents[stamp(obj)];
				}
				return this;
			},

			_propagateEvent: function _propagateEvent(e) {
				for (var id in this._eventParents) {
					this._eventParents[id].fire(e.type, extend({ layer: e.target }, e), true);
				}
			}
		};

		// aliases; we should ditch those eventually

		// @method addEventListener(…): this
		// Alias to [`on(…)`](#evented-on)
		Events.addEventListener = Events.on;

		// @method removeEventListener(…): this
		// Alias to [`off(…)`](#evented-off)

		// @method clearAllEventListeners(…): this
		// Alias to [`off()`](#evented-off)
		Events.removeEventListener = Events.clearAllEventListeners = Events.off;

		// @method addOneTimeEventListener(…): this
		// Alias to [`once(…)`](#evented-once)
		Events.addOneTimeEventListener = Events.once;

		// @method fireEvent(…): this
		// Alias to [`fire(…)`](#evented-fire)
		Events.fireEvent = Events.fire;

		// @method hasEventListeners(…): Boolean
		// Alias to [`listens(…)`](#evented-listens)
		Events.hasEventListeners = Events.listens;

		var Evented = Class.extend(Events);

		/*
   * @class Point
   * @aka L.Point
   *
   * Represents a point with `x` and `y` coordinates in pixels.
   *
   * @example
   *
   * ```js
   * var point = L.point(200, 300);
   * ```
   *
   * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
   *
   * ```js
   * map.panBy([200, 300]);
   * map.panBy(L.point(200, 300));
   * ```
   */

		function Point(x, y, round) {
			// @property x: Number; The `x` coordinate of the point
			this.x = round ? Math.round(x) : x;
			// @property y: Number; The `y` coordinate of the point
			this.y = round ? Math.round(y) : y;
		}

		Point.prototype = {

			// @method clone(): Point
			// Returns a copy of the current point.
			clone: function clone() {
				return new Point(this.x, this.y);
			},

			// @method add(otherPoint: Point): Point
			// Returns the result of addition of the current and the given points.
			add: function add(point) {
				// non-destructive, returns a new point
				return this.clone()._add(toPoint(point));
			},

			_add: function _add(point) {
				// destructive, used directly for performance in situations where it's safe to modify existing point
				this.x += point.x;
				this.y += point.y;
				return this;
			},

			// @method subtract(otherPoint: Point): Point
			// Returns the result of subtraction of the given point from the current.
			subtract: function subtract(point) {
				return this.clone()._subtract(toPoint(point));
			},

			_subtract: function _subtract(point) {
				this.x -= point.x;
				this.y -= point.y;
				return this;
			},

			// @method divideBy(num: Number): Point
			// Returns the result of division of the current point by the given number.
			divideBy: function divideBy(num) {
				return this.clone()._divideBy(num);
			},

			_divideBy: function _divideBy(num) {
				this.x /= num;
				this.y /= num;
				return this;
			},

			// @method multiplyBy(num: Number): Point
			// Returns the result of multiplication of the current point by the given number.
			multiplyBy: function multiplyBy(num) {
				return this.clone()._multiplyBy(num);
			},

			_multiplyBy: function _multiplyBy(num) {
				this.x *= num;
				this.y *= num;
				return this;
			},

			// @method scaleBy(scale: Point): Point
			// Multiply each coordinate of the current point by each coordinate of
			// `scale`. In linear algebra terms, multiply the point by the
			// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
			// defined by `scale`.
			scaleBy: function scaleBy(point) {
				return new Point(this.x * point.x, this.y * point.y);
			},

			// @method unscaleBy(scale: Point): Point
			// Inverse of `scaleBy`. Divide each coordinate of the current point by
			// each coordinate of `scale`.
			unscaleBy: function unscaleBy(point) {
				return new Point(this.x / point.x, this.y / point.y);
			},

			// @method round(): Point
			// Returns a copy of the current point with rounded coordinates.
			round: function round() {
				return this.clone()._round();
			},

			_round: function _round() {
				this.x = Math.round(this.x);
				this.y = Math.round(this.y);
				return this;
			},

			// @method floor(): Point
			// Returns a copy of the current point with floored coordinates (rounded down).
			floor: function floor() {
				return this.clone()._floor();
			},

			_floor: function _floor() {
				this.x = Math.floor(this.x);
				this.y = Math.floor(this.y);
				return this;
			},

			// @method ceil(): Point
			// Returns a copy of the current point with ceiled coordinates (rounded up).
			ceil: function ceil() {
				return this.clone()._ceil();
			},

			_ceil: function _ceil() {
				this.x = Math.ceil(this.x);
				this.y = Math.ceil(this.y);
				return this;
			},

			// @method distanceTo(otherPoint: Point): Number
			// Returns the cartesian distance between the current and the given points.
			distanceTo: function distanceTo(point) {
				point = toPoint(point);

				var x = point.x - this.x,
				    y = point.y - this.y;

				return Math.sqrt(x * x + y * y);
			},

			// @method equals(otherPoint: Point): Boolean
			// Returns `true` if the given point has the same coordinates.
			equals: function equals(point) {
				point = toPoint(point);

				return point.x === this.x && point.y === this.y;
			},

			// @method contains(otherPoint: Point): Boolean
			// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
			contains: function contains(point) {
				point = toPoint(point);

				return Math.abs(point.x) <= Math.abs(this.x) && Math.abs(point.y) <= Math.abs(this.y);
			},

			// @method toString(): String
			// Returns a string representation of the point for debugging purposes.
			toString: function toString() {
				return 'Point(' + formatNum(this.x) + ', ' + formatNum(this.y) + ')';
			}
		};

		// @factory L.point(x: Number, y: Number, round?: Boolean)
		// Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

		// @alternative
		// @factory L.point(coords: Number[])
		// Expects an array of the form `[x, y]` instead.

		// @alternative
		// @factory L.point(coords: Object)
		// Expects a plain object of the form `{x: Number, y: Number}` instead.
		function toPoint(x, y, round) {
			if (x instanceof Point) {
				return x;
			}
			if (isArray(x)) {
				return new Point(x[0], x[1]);
			}
			if (x === undefined || x === null) {
				return x;
			}
			if (typeof x === 'object' && 'x' in x && 'y' in x) {
				return new Point(x.x, x.y);
			}
			return new Point(x, y, round);
		}

		/*
   * @class Bounds
   * @aka L.Bounds
   *
   * Represents a rectangular area in pixel coordinates.
   *
   * @example
   *
   * ```js
   * var p1 = L.point(10, 10),
   * p2 = L.point(40, 60),
   * bounds = L.bounds(p1, p2);
   * ```
   *
   * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
   *
   * ```js
   * otherBounds.intersects([[10, 10], [40, 60]]);
   * ```
   */

		function Bounds(a, b) {
			if (!a) {
				return;
			}

			var points = b ? [a, b] : a;

			for (var i = 0, len = points.length; i < len; i++) {
				this.extend(points[i]);
			}
		}

		Bounds.prototype = {
			// @method extend(point: Point): this
			// Extends the bounds to contain the given point.
			extend: function extend(point) {
				// (Point)
				point = toPoint(point);

				// @property min: Point
				// The top left corner of the rectangle.
				// @property max: Point
				// The bottom right corner of the rectangle.
				if (!this.min && !this.max) {
					this.min = point.clone();
					this.max = point.clone();
				} else {
					this.min.x = Math.min(point.x, this.min.x);
					this.max.x = Math.max(point.x, this.max.x);
					this.min.y = Math.min(point.y, this.min.y);
					this.max.y = Math.max(point.y, this.max.y);
				}
				return this;
			},

			// @method getCenter(round?: Boolean): Point
			// Returns the center point of the bounds.
			getCenter: function getCenter(round) {
				return new Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, round);
			},

			// @method getBottomLeft(): Point
			// Returns the bottom-left point of the bounds.
			getBottomLeft: function getBottomLeft() {
				return new Point(this.min.x, this.max.y);
			},

			// @method getTopRight(): Point
			// Returns the top-right point of the bounds.
			getTopRight: function getTopRight() {
				// -> Point
				return new Point(this.max.x, this.min.y);
			},

			// @method getTopLeft(): Point
			// Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
			getTopLeft: function getTopLeft() {
				return this.min; // left, top
			},

			// @method getBottomRight(): Point
			// Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
			getBottomRight: function getBottomRight() {
				return this.max; // right, bottom
			},

			// @method getSize(): Point
			// Returns the size of the given bounds
			getSize: function getSize() {
				return this.max.subtract(this.min);
			},

			// @method contains(otherBounds: Bounds): Boolean
			// Returns `true` if the rectangle contains the given one.
			// @alternative
			// @method contains(point: Point): Boolean
			// Returns `true` if the rectangle contains the given point.
			contains: function contains(obj) {
				var min, max;

				if (typeof obj[0] === 'number' || obj instanceof Point) {
					obj = toPoint(obj);
				} else {
					obj = toBounds(obj);
				}

				if (obj instanceof Bounds) {
					min = obj.min;
					max = obj.max;
				} else {
					min = max = obj;
				}

				return min.x >= this.min.x && max.x <= this.max.x && min.y >= this.min.y && max.y <= this.max.y;
			},

			// @method intersects(otherBounds: Bounds): Boolean
			// Returns `true` if the rectangle intersects the given bounds. Two bounds
			// intersect if they have at least one point in common.
			intersects: function intersects(bounds) {
				// (Bounds) -> Boolean
				bounds = toBounds(bounds);

				var min = this.min,
				    max = this.max,
				    min2 = bounds.min,
				    max2 = bounds.max,
				    xIntersects = max2.x >= min.x && min2.x <= max.x,
				    yIntersects = max2.y >= min.y && min2.y <= max.y;

				return xIntersects && yIntersects;
			},

			// @method overlaps(otherBounds: Bounds): Boolean
			// Returns `true` if the rectangle overlaps the given bounds. Two bounds
			// overlap if their intersection is an area.
			overlaps: function overlaps(bounds) {
				// (Bounds) -> Boolean
				bounds = toBounds(bounds);

				var min = this.min,
				    max = this.max,
				    min2 = bounds.min,
				    max2 = bounds.max,
				    xOverlaps = max2.x > min.x && min2.x < max.x,
				    yOverlaps = max2.y > min.y && min2.y < max.y;

				return xOverlaps && yOverlaps;
			},

			isValid: function isValid() {
				return !!(this.min && this.max);
			}
		};

		// @factory L.bounds(corner1: Point, corner2: Point)
		// Creates a Bounds object from two corners coordinate pairs.
		// @alternative
		// @factory L.bounds(points: Point[])
		// Creates a Bounds object from the given array of points.
		function toBounds(a, b) {
			if (!a || a instanceof Bounds) {
				return a;
			}
			return new Bounds(a, b);
		}

		/*
   * @class LatLngBounds
   * @aka L.LatLngBounds
   *
   * Represents a rectangular geographical area on a map.
   *
   * @example
   *
   * ```js
   * var corner1 = L.latLng(40.712, -74.227),
   * corner2 = L.latLng(40.774, -74.125),
   * bounds = L.latLngBounds(corner1, corner2);
   * ```
   *
   * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
   *
   * ```js
   * map.fitBounds([
   * 	[40.712, -74.227],
   * 	[40.774, -74.125]
   * ]);
   * ```
   *
   * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
   */

		function LatLngBounds(corner1, corner2) {
			// (LatLng, LatLng) or (LatLng[])
			if (!corner1) {
				return;
			}

			var latlngs = corner2 ? [corner1, corner2] : corner1;

			for (var i = 0, len = latlngs.length; i < len; i++) {
				this.extend(latlngs[i]);
			}
		}

		LatLngBounds.prototype = {

			// @method extend(latlng: LatLng): this
			// Extend the bounds to contain the given point

			// @alternative
			// @method extend(otherBounds: LatLngBounds): this
			// Extend the bounds to contain the given bounds
			extend: function extend(obj) {
				var sw = this._southWest,
				    ne = this._northEast,
				    sw2,
				    ne2;

				if (obj instanceof LatLng) {
					sw2 = obj;
					ne2 = obj;
				} else if (obj instanceof LatLngBounds) {
					sw2 = obj._southWest;
					ne2 = obj._northEast;

					if (!sw2 || !ne2) {
						return this;
					}
				} else {
					return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
				}

				if (!sw && !ne) {
					this._southWest = new LatLng(sw2.lat, sw2.lng);
					this._northEast = new LatLng(ne2.lat, ne2.lng);
				} else {
					sw.lat = Math.min(sw2.lat, sw.lat);
					sw.lng = Math.min(sw2.lng, sw.lng);
					ne.lat = Math.max(ne2.lat, ne.lat);
					ne.lng = Math.max(ne2.lng, ne.lng);
				}

				return this;
			},

			// @method pad(bufferRatio: Number): LatLngBounds
			// Returns bigger bounds created by extending the current bounds by a given percentage in each direction.
			pad: function pad(bufferRatio) {
				var sw = this._southWest,
				    ne = this._northEast,
				    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
				    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

				return new LatLngBounds(new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer), new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
			},

			// @method getCenter(): LatLng
			// Returns the center point of the bounds.
			getCenter: function getCenter() {
				return new LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
			},

			// @method getSouthWest(): LatLng
			// Returns the south-west point of the bounds.
			getSouthWest: function getSouthWest() {
				return this._southWest;
			},

			// @method getNorthEast(): LatLng
			// Returns the north-east point of the bounds.
			getNorthEast: function getNorthEast() {
				return this._northEast;
			},

			// @method getNorthWest(): LatLng
			// Returns the north-west point of the bounds.
			getNorthWest: function getNorthWest() {
				return new LatLng(this.getNorth(), this.getWest());
			},

			// @method getSouthEast(): LatLng
			// Returns the south-east point of the bounds.
			getSouthEast: function getSouthEast() {
				return new LatLng(this.getSouth(), this.getEast());
			},

			// @method getWest(): Number
			// Returns the west longitude of the bounds
			getWest: function getWest() {
				return this._southWest.lng;
			},

			// @method getSouth(): Number
			// Returns the south latitude of the bounds
			getSouth: function getSouth() {
				return this._southWest.lat;
			},

			// @method getEast(): Number
			// Returns the east longitude of the bounds
			getEast: function getEast() {
				return this._northEast.lng;
			},

			// @method getNorth(): Number
			// Returns the north latitude of the bounds
			getNorth: function getNorth() {
				return this._northEast.lat;
			},

			// @method contains(otherBounds: LatLngBounds): Boolean
			// Returns `true` if the rectangle contains the given one.

			// @alternative
			// @method contains (latlng: LatLng): Boolean
			// Returns `true` if the rectangle contains the given point.
			contains: function contains(obj) {
				// (LatLngBounds) or (LatLng) -> Boolean
				if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
					obj = toLatLng(obj);
				} else {
					obj = toLatLngBounds(obj);
				}

				var sw = this._southWest,
				    ne = this._northEast,
				    sw2,
				    ne2;

				if (obj instanceof LatLngBounds) {
					sw2 = obj.getSouthWest();
					ne2 = obj.getNorthEast();
				} else {
					sw2 = ne2 = obj;
				}

				return sw2.lat >= sw.lat && ne2.lat <= ne.lat && sw2.lng >= sw.lng && ne2.lng <= ne.lng;
			},

			// @method intersects(otherBounds: LatLngBounds): Boolean
			// Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
			intersects: function intersects(bounds) {
				bounds = toLatLngBounds(bounds);

				var sw = this._southWest,
				    ne = this._northEast,
				    sw2 = bounds.getSouthWest(),
				    ne2 = bounds.getNorthEast(),
				    latIntersects = ne2.lat >= sw.lat && sw2.lat <= ne.lat,
				    lngIntersects = ne2.lng >= sw.lng && sw2.lng <= ne.lng;

				return latIntersects && lngIntersects;
			},

			// @method overlaps(otherBounds: Bounds): Boolean
			// Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
			overlaps: function overlaps(bounds) {
				bounds = toLatLngBounds(bounds);

				var sw = this._southWest,
				    ne = this._northEast,
				    sw2 = bounds.getSouthWest(),
				    ne2 = bounds.getNorthEast(),
				    latOverlaps = ne2.lat > sw.lat && sw2.lat < ne.lat,
				    lngOverlaps = ne2.lng > sw.lng && sw2.lng < ne.lng;

				return latOverlaps && lngOverlaps;
			},

			// @method toBBoxString(): String
			// Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
			toBBoxString: function toBBoxString() {
				return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
			},

			// @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
			// Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overriden by setting `maxMargin` to a small number.
			equals: function equals(bounds, maxMargin) {
				if (!bounds) {
					return false;
				}

				bounds = toLatLngBounds(bounds);

				return this._southWest.equals(bounds.getSouthWest(), maxMargin) && this._northEast.equals(bounds.getNorthEast(), maxMargin);
			},

			// @method isValid(): Boolean
			// Returns `true` if the bounds are properly initialized.
			isValid: function isValid() {
				return !!(this._southWest && this._northEast);
			}
		};

		// TODO International date line?

		// @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
		// Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

		// @alternative
		// @factory L.latLngBounds(latlngs: LatLng[])
		// Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
		function toLatLngBounds(a, b) {
			if (a instanceof LatLngBounds) {
				return a;
			}
			return new LatLngBounds(a, b);
		}

		/* @class LatLng
   * @aka L.LatLng
   *
   * Represents a geographical point with a certain latitude and longitude.
   *
   * @example
   *
   * ```
   * var latlng = L.latLng(50.5, 30.5);
   * ```
   *
   * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
   *
   * ```
   * map.panTo([50, 30]);
   * map.panTo({lon: 30, lat: 50});
   * map.panTo({lat: 50, lng: 30});
   * map.panTo(L.latLng(50, 30));
   * ```
   */

		function LatLng(lat, lng, alt) {
			if (isNaN(lat) || isNaN(lng)) {
				throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
			}

			// @property lat: Number
			// Latitude in degrees
			this.lat = +lat;

			// @property lng: Number
			// Longitude in degrees
			this.lng = +lng;

			// @property alt: Number
			// Altitude in meters (optional)
			if (alt !== undefined) {
				this.alt = +alt;
			}
		}

		LatLng.prototype = {
			// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
			// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overriden by setting `maxMargin` to a small number.
			equals: function equals(obj, maxMargin) {
				if (!obj) {
					return false;
				}

				obj = toLatLng(obj);

				var margin = Math.max(Math.abs(this.lat - obj.lat), Math.abs(this.lng - obj.lng));

				return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
			},

			// @method toString(): String
			// Returns a string representation of the point (for debugging purposes).
			toString: function toString(precision) {
				return 'LatLng(' + formatNum(this.lat, precision) + ', ' + formatNum(this.lng, precision) + ')';
			},

			// @method distanceTo(otherLatLng: LatLng): Number
			// Returns the distance (in meters) to the given `LatLng` calculated using the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula).
			distanceTo: function distanceTo(other) {
				return Earth.distance(this, toLatLng(other));
			},

			// @method wrap(): LatLng
			// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
			wrap: function wrap() {
				return Earth.wrapLatLng(this);
			},

			// @method toBounds(sizeInMeters: Number): LatLngBounds
			// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
			toBounds: function toBounds(sizeInMeters) {
				var latAccuracy = 180 * sizeInMeters / 40075017,
				    lngAccuracy = latAccuracy / Math.cos(Math.PI / 180 * this.lat);

				return toLatLngBounds([this.lat - latAccuracy, this.lng - lngAccuracy], [this.lat + latAccuracy, this.lng + lngAccuracy]);
			},

			clone: function clone() {
				return new LatLng(this.lat, this.lng, this.alt);
			}
		};

		// @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
		// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

		// @alternative
		// @factory L.latLng(coords: Array): LatLng
		// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

		// @alternative
		// @factory L.latLng(coords: Object): LatLng
		// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

		function toLatLng(a, b, c) {
			if (a instanceof LatLng) {
				return a;
			}
			if (isArray(a) && typeof a[0] !== 'object') {
				if (a.length === 3) {
					return new LatLng(a[0], a[1], a[2]);
				}
				if (a.length === 2) {
					return new LatLng(a[0], a[1]);
				}
				return null;
			}
			if (a === undefined || a === null) {
				return a;
			}
			if (typeof a === 'object' && 'lat' in a) {
				return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
			}
			if (b === undefined) {
				return null;
			}
			return new LatLng(a, b, c);
		}

		/*
   * @namespace CRS
   * @crs L.CRS.Base
   * Object that defines coordinate reference systems for projecting
   * geographical points into pixel (screen) coordinates and back (and to
   * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
   * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
   *
   * Leaflet defines the most usual CRSs by default. If you want to use a
   * CRS not defined by default, take a look at the
   * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
   */

		var CRS = {
			// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
			// Projects geographical coordinates into pixel coordinates for a given zoom.
			latLngToPoint: function latLngToPoint(latlng, zoom) {
				var projectedPoint = this.projection.project(latlng),
				    scale = this.scale(zoom);

				return this.transformation._transform(projectedPoint, scale);
			},

			// @method pointToLatLng(point: Point, zoom: Number): LatLng
			// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
			// zoom into geographical coordinates.
			pointToLatLng: function pointToLatLng(point, zoom) {
				var scale = this.scale(zoom),
				    untransformedPoint = this.transformation.untransform(point, scale);

				return this.projection.unproject(untransformedPoint);
			},

			// @method project(latlng: LatLng): Point
			// Projects geographical coordinates into coordinates in units accepted for
			// this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
			project: function project(latlng) {
				return this.projection.project(latlng);
			},

			// @method unproject(point: Point): LatLng
			// Given a projected coordinate returns the corresponding LatLng.
			// The inverse of `project`.
			unproject: function unproject(point) {
				return this.projection.unproject(point);
			},

			// @method scale(zoom: Number): Number
			// Returns the scale used when transforming projected coordinates into
			// pixel coordinates for a particular zoom. For example, it returns
			// `256 * 2^zoom` for Mercator-based CRS.
			scale: function scale(zoom) {
				return 256 * Math.pow(2, zoom);
			},

			// @method zoom(scale: Number): Number
			// Inverse of `scale()`, returns the zoom level corresponding to a scale
			// factor of `scale`.
			zoom: function zoom(scale) {
				return Math.log(scale / 256) / Math.LN2;
			},

			// @method getProjectedBounds(zoom: Number): Bounds
			// Returns the projection's bounds scaled and transformed for the provided `zoom`.
			getProjectedBounds: function getProjectedBounds(zoom) {
				if (this.infinite) {
					return null;
				}

				var b = this.projection.bounds,
				    s = this.scale(zoom),
				    min = this.transformation.transform(b.min, s),
				    max = this.transformation.transform(b.max, s);

				return new Bounds(min, max);
			},

			// @method distance(latlng1: LatLng, latlng2: LatLng): Number
			// Returns the distance between two geographical coordinates.

			// @property code: String
			// Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
			//
			// @property wrapLng: Number[]
			// An array of two numbers defining whether the longitude (horizontal) coordinate
			// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
			// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
			//
			// @property wrapLat: Number[]
			// Like `wrapLng`, but for the latitude (vertical) axis.

			// wrapLng: [min, max],
			// wrapLat: [min, max],

			// @property infinite: Boolean
			// If true, the coordinate space will be unbounded (infinite in both axes)
			infinite: false,

			// @method wrapLatLng(latlng: LatLng): LatLng
			// Returns a `LatLng` where lat and lng has been wrapped according to the
			// CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
			wrapLatLng: function wrapLatLng(latlng) {
				var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
				    lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
				    alt = latlng.alt;

				return new LatLng(lat, lng, alt);
			},

			// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
			// Returns a `LatLngBounds` with the same size as the given one, ensuring
			// that its center is within the CRS's bounds.
			// Only accepts actual `L.LatLngBounds` instances, not arrays.
			wrapLatLngBounds: function wrapLatLngBounds(bounds) {
				var center = bounds.getCenter(),
				    newCenter = this.wrapLatLng(center),
				    latShift = center.lat - newCenter.lat,
				    lngShift = center.lng - newCenter.lng;

				if (latShift === 0 && lngShift === 0) {
					return bounds;
				}

				var sw = bounds.getSouthWest(),
				    ne = bounds.getNorthEast(),
				    newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
				    newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

				return new LatLngBounds(newSw, newNe);
			}
		};

		/*
   * @namespace CRS
   * @crs L.CRS.Earth
   *
   * Serves as the base for CRS that are global such that they cover the earth.
   * Can only be used as the base for other CRS and cannot be used directly,
   * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
   * meters.
   */

		var Earth = extend({}, CRS, {
			wrapLng: [-180, 180],

			// Mean Earth Radius, as recommended for use by
			// the International Union of Geodesy and Geophysics,
			// see http://rosettacode.org/wiki/Haversine_formula
			R: 6371000,

			// distance between two geographical points using spherical law of cosines approximation
			distance: function distance(latlng1, latlng2) {
				var rad = Math.PI / 180,
				    lat1 = latlng1.lat * rad,
				    lat2 = latlng2.lat * rad,
				    a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);

				return this.R * Math.acos(Math.min(a, 1));
			}
		});

		/*
   * @namespace Projection
   * @projection L.Projection.SphericalMercator
   *
   * Spherical Mercator projection — the most common projection for online maps,
   * used by almost all free and commercial tile providers. Assumes that Earth is
   * a sphere. Used by the `EPSG:3857` CRS.
   */

		var SphericalMercator = {

			R: 6378137,
			MAX_LATITUDE: 85.0511287798,

			project: function project(latlng) {
				var d = Math.PI / 180,
				    max = this.MAX_LATITUDE,
				    lat = Math.max(Math.min(max, latlng.lat), -max),
				    sin = Math.sin(lat * d);

				return new Point(this.R * latlng.lng * d, this.R * Math.log((1 + sin) / (1 - sin)) / 2);
			},

			unproject: function unproject(point) {
				var d = 180 / Math.PI;

				return new LatLng((2 * Math.atan(Math.exp(point.y / this.R)) - Math.PI / 2) * d, point.x * d / this.R);
			},

			bounds: function () {
				var d = 6378137 * Math.PI;
				return new Bounds([-d, -d], [d, d]);
			}()
		};

		/*
   * @class Transformation
   * @aka L.Transformation
   *
   * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
   * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
   * the reverse. Used by Leaflet in its projections code.
   *
   * @example
   *
   * ```js
   * var transformation = L.transformation(2, 5, -1, 10),
   * 	p = L.point(1, 2),
   * 	p2 = transformation.transform(p), //  L.point(7, 8)
   * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
   * ```
   */

		// factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
		// Creates a `Transformation` object with the given coefficients.
		function Transformation(a, b, c, d) {
			if (isArray(a)) {
				// use array properties
				this._a = a[0];
				this._b = a[1];
				this._c = a[2];
				this._d = a[3];
				return;
			}
			this._a = a;
			this._b = b;
			this._c = c;
			this._d = d;
		}

		Transformation.prototype = {
			// @method transform(point: Point, scale?: Number): Point
			// Returns a transformed point, optionally multiplied by the given scale.
			// Only accepts actual `L.Point` instances, not arrays.
			transform: function transform(point, scale) {
				// (Point, Number) -> Point
				return this._transform(point.clone(), scale);
			},

			// destructive transform (faster)
			_transform: function _transform(point, scale) {
				scale = scale || 1;
				point.x = scale * (this._a * point.x + this._b);
				point.y = scale * (this._c * point.y + this._d);
				return point;
			},

			// @method untransform(point: Point, scale?: Number): Point
			// Returns the reverse transformation of the given point, optionally divided
			// by the given scale. Only accepts actual `L.Point` instances, not arrays.
			untransform: function untransform(point, scale) {
				scale = scale || 1;
				return new Point((point.x / scale - this._b) / this._a, (point.y / scale - this._d) / this._c);
			}
		};

		// factory L.transformation(a: Number, b: Number, c: Number, d: Number)

		// @factory L.transformation(a: Number, b: Number, c: Number, d: Number)
		// Instantiates a Transformation object with the given coefficients.

		// @alternative
		// @factory L.transformation(coefficients: Array): Transformation
		// Expects an coeficients array of the form
		// `[a: Number, b: Number, c: Number, d: Number]`.

		function toTransformation(a, b, c, d) {
			return new Transformation(a, b, c, d);
		}

		/*
   * @namespace CRS
   * @crs L.CRS.EPSG3857
   *
   * The most common CRS for online maps, used by almost all free and commercial
   * tile providers. Uses Spherical Mercator projection. Set in by default in
   * Map's `crs` option.
   */

		var EPSG3857 = extend({}, Earth, {
			code: 'EPSG:3857',
			projection: SphericalMercator,

			transformation: function () {
				var scale = 0.5 / (Math.PI * SphericalMercator.R);
				return toTransformation(scale, 0.5, -scale, 0.5);
			}()
		});

		var EPSG900913 = extend({}, EPSG3857, {
			code: 'EPSG:900913'
		});

		// @namespace SVG; @section
		// There are several static functions which can be called without instantiating L.SVG:

		// @function create(name: String): SVGElement
		// Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
		// corresponding to the class name passed. For example, using 'line' will return
		// an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
		function svgCreate(name) {
			return document.createElementNS('http://www.w3.org/2000/svg', name);
		}

		// @function pointsToPath(rings: Point[], closed: Boolean): String
		// Generates a SVG path string for multiple rings, with each ring turning
		// into "M..L..L.." instructions
		function pointsToPath(rings, closed) {
			var str = '',
			    i,
			    j,
			    len,
			    len2,
			    points,
			    p;

			for (i = 0, len = rings.length; i < len; i++) {
				points = rings[i];

				for (j = 0, len2 = points.length; j < len2; j++) {
					p = points[j];
					str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
				}

				// closes the ring for polygons; "x" is VML syntax
				str += closed ? svg ? 'z' : 'x' : '';
			}

			// SVG complains about empty path strings
			return str || 'M0 0';
		}

		/*
   * @namespace Browser
   * @aka L.Browser
   *
   * A namespace with static properties for browser/feature detection used by Leaflet internally.
   *
   * @example
   *
   * ```js
   * if (L.Browser.ielt9) {
   *   alert('Upgrade your browser, dude!');
   * }
   * ```
   */

		var style$1 = document.documentElement.style;

		// @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
		var ie = 'ActiveXObject' in window;

		// @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
		var ielt9 = ie && !document.addEventListener;

		// @property edge: Boolean; `true` for the Edge web browser.
		var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

		// @property webkit: Boolean;
		// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
		var webkit = userAgentContains('webkit');

		// @property android: Boolean
		// `true` for any browser running on an Android platform.
		var android = userAgentContains('android');

		// @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
		var android23 = userAgentContains('android 2') || userAgentContains('android 3');

		// @property opera: Boolean; `true` for the Opera browser
		var opera = !!window.opera;

		// @property chrome: Boolean; `true` for the Chrome browser.
		var chrome = userAgentContains('chrome');

		// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
		var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

		// @property safari: Boolean; `true` for the Safari browser.
		var safari = !chrome && userAgentContains('safari');

		var phantom = userAgentContains('phantom');

		// @property opera12: Boolean
		// `true` for the Opera browser supporting CSS transforms (version 12 or later).
		var opera12 = 'OTransition' in style$1;

		// @property win: Boolean; `true` when the browser is running in a Windows platform
		var win = navigator.platform.indexOf('Win') === 0;

		// @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
		var ie3d = ie && 'transition' in style$1;

		// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
		var webkit3d = 'WebKitCSSMatrix' in window && 'm11' in new window.WebKitCSSMatrix() && !android23;

		// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
		var gecko3d = 'MozPerspective' in style$1;

		// @property any3d: Boolean
		// `true` for all browsers supporting CSS transforms.
		var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

		// @property mobile: Boolean; `true` for all browsers running in a mobile device.
		var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

		// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
		var mobileWebkit = mobile && webkit;

		// @property mobileWebkit3d: Boolean
		// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
		var mobileWebkit3d = mobile && webkit3d;

		// @property msPointer: Boolean
		// `true` for browsers implementing the Microsoft touch events model (notably IE10).
		var msPointer = !window.PointerEvent && window.MSPointerEvent;

		// @property pointer: Boolean
		// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
		var pointer = !!(window.PointerEvent || msPointer);

		// @property touch: Boolean
		// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
		// This does not necessarily mean that the browser is running in a computer with
		// a touchscreen, it only means that the browser is capable of understanding
		// touch events.
		var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);

		// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
		var mobileOpera = mobile && opera;

		// @property mobileGecko: Boolean
		// `true` for gecko-based browsers running in a mobile device.
		var mobileGecko = mobile && gecko;

		// @property retina: Boolean
		// `true` for browsers on a high-resolution "retina" screen.
		var retina = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1;

		// @property canvas: Boolean
		// `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
		var canvas = function () {
			return !!document.createElement('canvas').getContext;
		}();

		// @property svg: Boolean
		// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
		var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

		// @property vml: Boolean
		// `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
		var vml = !svg && function () {
			try {
				var div = document.createElement('div');
				div.innerHTML = '<v:shape adj="1"/>';

				var shape = div.firstChild;
				shape.style.behavior = 'url(#default#VML)';

				return shape && typeof shape.adj === 'object';
			} catch (e) {
				return false;
			}
		}();

		function userAgentContains(str) {
			return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
		}

		var Browser = (Object.freeze || Object)({
			ie: ie,
			ielt9: ielt9,
			edge: edge,
			webkit: webkit,
			android: android,
			android23: android23,
			opera: opera,
			chrome: chrome,
			gecko: gecko,
			safari: safari,
			phantom: phantom,
			opera12: opera12,
			win: win,
			ie3d: ie3d,
			webkit3d: webkit3d,
			gecko3d: gecko3d,
			any3d: any3d,
			mobile: mobile,
			mobileWebkit: mobileWebkit,
			mobileWebkit3d: mobileWebkit3d,
			msPointer: msPointer,
			pointer: pointer,
			touch: touch,
			mobileOpera: mobileOpera,
			mobileGecko: mobileGecko,
			retina: retina,
			canvas: canvas,
			svg: svg,
			vml: vml
		});

		/*
   * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
   */

		var POINTER_DOWN = msPointer ? 'MSPointerDown' : 'pointerdown';
		var POINTER_MOVE = msPointer ? 'MSPointerMove' : 'pointermove';
		var POINTER_UP = msPointer ? 'MSPointerUp' : 'pointerup';
		var POINTER_CANCEL = msPointer ? 'MSPointerCancel' : 'pointercancel';
		var TAG_WHITE_LIST = ['INPUT', 'SELECT', 'OPTION'];
		var _pointers = {};
		var _pointerDocListener = false;

		// DomEvent.DoubleTap needs to know about this
		var _pointersCount = 0;

		// Provides a touch events wrapper for (ms)pointer events.
		// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

		function addPointerListener(obj, type, handler, id) {
			if (type === 'touchstart') {
				_addPointerStart(obj, handler, id);
			} else if (type === 'touchmove') {
				_addPointerMove(obj, handler, id);
			} else if (type === 'touchend') {
				_addPointerEnd(obj, handler, id);
			}

			return this;
		}

		function removePointerListener(obj, type, id) {
			var handler = obj['_leaflet_' + type + id];

			if (type === 'touchstart') {
				obj.removeEventListener(POINTER_DOWN, handler, false);
			} else if (type === 'touchmove') {
				obj.removeEventListener(POINTER_MOVE, handler, false);
			} else if (type === 'touchend') {
				obj.removeEventListener(POINTER_UP, handler, false);
				obj.removeEventListener(POINTER_CANCEL, handler, false);
			}

			return this;
		}

		function _addPointerStart(obj, handler, id) {
			var onDown = bind(function (e) {
				if (e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
					// In IE11, some touch events needs to fire for form controls, or
					// the controls will stop working. We keep a whitelist of tag names that
					// need these events. For other target tags, we prevent default on the event.
					if (TAG_WHITE_LIST.indexOf(e.target.tagName) < 0) {
						preventDefault(e);
					} else {
						return;
					}
				}

				_handlePointer(e, handler);
			});

			obj['_leaflet_touchstart' + id] = onDown;
			obj.addEventListener(POINTER_DOWN, onDown, false);

			// need to keep track of what pointers and how many are active to provide e.touches emulation
			if (!_pointerDocListener) {
				// we listen documentElement as any drags that end by moving the touch off the screen get fired there
				document.documentElement.addEventListener(POINTER_DOWN, _globalPointerDown, true);
				document.documentElement.addEventListener(POINTER_MOVE, _globalPointerMove, true);
				document.documentElement.addEventListener(POINTER_UP, _globalPointerUp, true);
				document.documentElement.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

				_pointerDocListener = true;
			}
		}

		function _globalPointerDown(e) {
			_pointers[e.pointerId] = e;
			_pointersCount++;
		}

		function _globalPointerMove(e) {
			if (_pointers[e.pointerId]) {
				_pointers[e.pointerId] = e;
			}
		}

		function _globalPointerUp(e) {
			delete _pointers[e.pointerId];
			_pointersCount--;
		}

		function _handlePointer(e, handler) {
			e.touches = [];
			for (var i in _pointers) {
				e.touches.push(_pointers[i]);
			}
			e.changedTouches = [e];

			handler(e);
		}

		function _addPointerMove(obj, handler, id) {
			var onMove = function onMove(e) {
				// don't fire touch moves when mouse isn't down
				if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) {
					return;
				}

				_handlePointer(e, handler);
			};

			obj['_leaflet_touchmove' + id] = onMove;
			obj.addEventListener(POINTER_MOVE, onMove, false);
		}

		function _addPointerEnd(obj, handler, id) {
			var onUp = function onUp(e) {
				_handlePointer(e, handler);
			};

			obj['_leaflet_touchend' + id] = onUp;
			obj.addEventListener(POINTER_UP, onUp, false);
			obj.addEventListener(POINTER_CANCEL, onUp, false);
		}

		/*
   * Extends the event handling code with double tap support for mobile browsers.
   */

		var _touchstart = msPointer ? 'MSPointerDown' : pointer ? 'pointerdown' : 'touchstart';
		var _touchend = msPointer ? 'MSPointerUp' : pointer ? 'pointerup' : 'touchend';
		var _pre = '_leaflet_';

		// inspired by Zepto touch code by Thomas Fuchs
		function addDoubleTapListener(obj, handler, id) {
			var last,
			    touch$$1,
			    doubleTap = false,
			    delay = 250;

			function onTouchStart(e) {
				var count;

				if (pointer) {
					if (!edge || e.pointerType === 'mouse') {
						return;
					}
					count = _pointersCount;
				} else {
					count = e.touches.length;
				}

				if (count > 1) {
					return;
				}

				var now = Date.now(),
				    delta = now - (last || now);

				touch$$1 = e.touches ? e.touches[0] : e;
				doubleTap = delta > 0 && delta <= delay;
				last = now;
			}

			function onTouchEnd(e) {
				if (doubleTap && !touch$$1.cancelBubble) {
					if (pointer) {
						if (!edge || e.pointerType === 'mouse') {
							return;
						}
						// work around .type being readonly with MSPointer* events
						var newTouch = {},
						    prop,
						    i;

						for (i in touch$$1) {
							prop = touch$$1[i];
							newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
						}
						touch$$1 = newTouch;
					}
					touch$$1.type = 'dblclick';
					handler(touch$$1);
					last = null;
				}
			}

			obj[_pre + _touchstart + id] = onTouchStart;
			obj[_pre + _touchend + id] = onTouchEnd;
			obj[_pre + 'dblclick' + id] = handler;

			obj.addEventListener(_touchstart, onTouchStart, false);
			obj.addEventListener(_touchend, onTouchEnd, false);

			// On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
			// the browser doesn't fire touchend/pointerup events but does fire
			// native dblclicks. See #4127.
			// Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
			obj.addEventListener('dblclick', handler, false);

			return this;
		}

		function removeDoubleTapListener(obj, id) {
			var touchstart = obj[_pre + _touchstart + id],
			    touchend = obj[_pre + _touchend + id],
			    dblclick = obj[_pre + 'dblclick' + id];

			obj.removeEventListener(_touchstart, touchstart, false);
			obj.removeEventListener(_touchend, touchend, false);
			if (!edge) {
				obj.removeEventListener('dblclick', dblclick, false);
			}

			return this;
		}

		/*
   * @namespace DomEvent
   * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
   */

		// Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

		// @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
		// Adds a listener function (`fn`) to a particular DOM event type of the
		// element `el`. You can optionally specify the context of the listener
		// (object the `this` keyword will point to). You can also pass several
		// space-separated types (e.g. `'click dblclick'`).

		// @alternative
		// @function on(el: HTMLElement, eventMap: Object, context?: Object): this
		// Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
		function on(obj, types, fn, context) {

			if (typeof types === 'object') {
				for (var type in types) {
					addOne(obj, type, types[type], fn);
				}
			} else {
				types = splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					addOne(obj, types[i], fn, context);
				}
			}

			return this;
		}

		var eventsKey = '_leaflet_events';

		// @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
		// Removes a previously added listener function. If no function is specified,
		// it will remove all the listeners of that particular DOM event from the element.
		// Note that if you passed a custom context to on, you must pass the same
		// context to `off` in order to remove the listener.

		// @alternative
		// @function off(el: HTMLElement, eventMap: Object, context?: Object): this
		// Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`

		// @alternative
		// @function off(el: HTMLElement): this
		// Removes all known event listeners
		function off(obj, types, fn, context) {

			if (typeof types === 'object') {
				for (var type in types) {
					removeOne(obj, type, types[type], fn);
				}
			} else if (types) {
				types = splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					removeOne(obj, types[i], fn, context);
				}
			} else {
				for (var j in obj[eventsKey]) {
					removeOne(obj, j, obj[eventsKey][j]);
				}
				delete obj[eventsKey];
			}

			return this;
		}

		function addOne(obj, type, fn, context) {
			var id = type + stamp(fn) + (context ? '_' + stamp(context) : '');

			if (obj[eventsKey] && obj[eventsKey][id]) {
				return this;
			}

			var handler = function handler(e) {
				return fn.call(context || obj, e || window.event);
			};

			var originalHandler = handler;

			if (pointer && type.indexOf('touch') === 0) {
				// Needs DomEvent.Pointer.js
				addPointerListener(obj, type, handler, id);
			} else if (touch && type === 'dblclick' && addDoubleTapListener && !(pointer && chrome)) {
				// Chrome >55 does not need the synthetic dblclicks from addDoubleTapListener
				// See #5180
				addDoubleTapListener(obj, handler, id);
			} else if ('addEventListener' in obj) {

				if (type === 'mousewheel') {
					obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);
				} else if (type === 'mouseenter' || type === 'mouseleave') {
					handler = function handler(e) {
						e = e || window.event;
						if (isExternalTarget(obj, e)) {
							originalHandler(e);
						}
					};
					obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);
				} else {
					if (type === 'click' && android) {
						handler = function handler(e) {
							filterClick(e, originalHandler);
						};
					}
					obj.addEventListener(type, handler, false);
				}
			} else if ('attachEvent' in obj) {
				obj.attachEvent('on' + type, handler);
			}

			obj[eventsKey] = obj[eventsKey] || {};
			obj[eventsKey][id] = handler;
		}

		function removeOne(obj, type, fn, context) {

			var id = type + stamp(fn) + (context ? '_' + stamp(context) : ''),
			    handler = obj[eventsKey] && obj[eventsKey][id];

			if (!handler) {
				return this;
			}

			if (pointer && type.indexOf('touch') === 0) {
				removePointerListener(obj, type, id);
			} else if (touch && type === 'dblclick' && removeDoubleTapListener) {
				removeDoubleTapListener(obj, id);
			} else if ('removeEventListener' in obj) {

				if (type === 'mousewheel') {
					obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);
				} else {
					obj.removeEventListener(type === 'mouseenter' ? 'mouseover' : type === 'mouseleave' ? 'mouseout' : type, handler, false);
				}
			} else if ('detachEvent' in obj) {
				obj.detachEvent('on' + type, handler);
			}

			obj[eventsKey][id] = null;
		}

		// @function stopPropagation(ev: DOMEvent): this
		// Stop the given event from propagation to parent elements. Used inside the listener functions:
		// ```js
		// L.DomEvent.on(div, 'click', function (ev) {
		// 	L.DomEvent.stopPropagation(ev);
		// });
		// ```
		function stopPropagation(e) {

			if (e.stopPropagation) {
				e.stopPropagation();
			} else if (e.originalEvent) {
				// In case of Leaflet event.
				e.originalEvent._stopped = true;
			} else {
				e.cancelBubble = true;
			}
			skipped(e);

			return this;
		}

		// @function disableScrollPropagation(el: HTMLElement): this
		// Adds `stopPropagation` to the element's `'mousewheel'` events (plus browser variants).
		function disableScrollPropagation(el) {
			addOne(el, 'mousewheel', stopPropagation);
			return this;
		}

		// @function disableClickPropagation(el: HTMLElement): this
		// Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
		// `'mousedown'` and `'touchstart'` events (plus browser variants).
		function disableClickPropagation(el) {
			on(el, 'mousedown touchstart dblclick', stopPropagation);
			addOne(el, 'click', fakeStop);
			return this;
		}

		// @function preventDefault(ev: DOMEvent): this
		// Prevents the default action of the DOM Event `ev` from happening (such as
		// following a link in the href of the a element, or doing a POST request
		// with page reload when a `<form>` is submitted).
		// Use it inside listener functions.
		function preventDefault(e) {
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return this;
		}

		// @function stop(ev): this
		// Does `stopPropagation` and `preventDefault` at the same time.
		function stop(e) {
			preventDefault(e);
			stopPropagation(e);
			return this;
		}

		// @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
		// Gets normalized mouse position from a DOM event relative to the
		// `container` or to the whole page if not specified.
		function getMousePosition(e, container) {
			if (!container) {
				return new Point(e.clientX, e.clientY);
			}

			var rect = container.getBoundingClientRect();

			return new Point(e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop);
		}

		// Chrome on Win scrolls double the pixels as in other platforms (see #4538),
		// and Firefox scrolls device pixels, not CSS pixels
		var wheelPxFactor = win && chrome ? 2 * window.devicePixelRatio : gecko ? window.devicePixelRatio : 1;

		// @function getWheelDelta(ev: DOMEvent): Number
		// Gets normalized wheel delta from a mousewheel DOM event, in vertical
		// pixels scrolled (negative if scrolling down).
		// Events from pointing devices without precise scrolling are mapped to
		// a best guess of 60 pixels.
		function getWheelDelta(e) {
			return edge ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
			e.deltaY && e.deltaMode === 0 ? -e.deltaY / wheelPxFactor : // Pixels
			e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : // Lines
			e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : // Pages
			e.deltaX || e.deltaZ ? 0 : // Skip horizontal/depth wheel events
			e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
			e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : // Legacy Moz lines
			e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
			0;
		}

		var skipEvents = {};

		function fakeStop(e) {
			// fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
			skipEvents[e.type] = true;
		}

		function skipped(e) {
			var events = skipEvents[e.type];
			// reset when checking, as it's only used in map container and propagates outside of the map
			skipEvents[e.type] = false;
			return events;
		}

		// check if element really left/entered the event target (for mouseenter/mouseleave)
		function isExternalTarget(el, e) {

			var related = e.relatedTarget;

			if (!related) {
				return true;
			}

			try {
				while (related && related !== el) {
					related = related.parentNode;
				}
			} catch (err) {
				return false;
			}
			return related !== el;
		}

		var lastClick;

		// this is a horrible workaround for a bug in Android where a single touch triggers two click events
		function filterClick(e, handler) {
			var timeStamp = e.timeStamp || e.originalEvent && e.originalEvent.timeStamp,
			    elapsed = lastClick && timeStamp - lastClick;

			// are they closer together than 500ms yet more than 100ms?
			// Android typically triggers them ~300ms apart while multiple listeners
			// on the same event should be triggered far faster;
			// or check if click is simulated on the element, and if it is, reject any non-simulated events

			if (elapsed && elapsed > 100 && elapsed < 500 || e.target._simulatedClick && !e._simulated) {
				stop(e);
				return;
			}
			lastClick = timeStamp;

			handler(e);
		}

		var DomEvent = (Object.freeze || Object)({
			on: on,
			off: off,
			stopPropagation: stopPropagation,
			disableScrollPropagation: disableScrollPropagation,
			disableClickPropagation: disableClickPropagation,
			preventDefault: preventDefault,
			stop: stop,
			getMousePosition: getMousePosition,
			getWheelDelta: getWheelDelta,
			fakeStop: fakeStop,
			skipped: skipped,
			isExternalTarget: isExternalTarget,
			addListener: on,
			removeListener: off
		});

		/*
   * @namespace DomUtil
   *
   * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
   * tree, used by Leaflet internally.
   *
   * Most functions expecting or returning a `HTMLElement` also work for
   * SVG elements. The only difference is that classes refer to CSS classes
   * in HTML and SVG classes in SVG.
   */

		// @property TRANSFORM: String
		// Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
		var TRANSFORM = testProp(['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

		// webkitTransition comes first because some browser versions that drop vendor prefix don't do
		// the same for the transitionend event, in particular the Android 4.1 stock browser

		// @property TRANSITION: String
		// Vendor-prefixed transition style name.
		var TRANSITION = testProp(['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

		// @property TRANSITION_END: String
		// Vendor-prefixed transitionend event name.
		var TRANSITION_END = TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';

		// @function get(id: String|HTMLElement): HTMLElement
		// Returns an element given its DOM id, or returns the element itself
		// if it was passed directly.
		function get(id) {
			return typeof id === 'string' ? document.getElementById(id) : id;
		}

		// @function getStyle(el: HTMLElement, styleAttrib: String): String
		// Returns the value for a certain style attribute on an element,
		// including computed values or values set through CSS.
		function getStyle(el, style) {
			var value = el.style[style] || el.currentStyle && el.currentStyle[style];

			if ((!value || value === 'auto') && document.defaultView) {
				var css = document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}
			return value === 'auto' ? null : value;
		}

		// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
		// Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
		function create$1(tagName, className, container) {
			var el = document.createElement(tagName);
			el.className = className || '';

			if (container) {
				container.appendChild(el);
			}
			return el;
		}

		// @function remove(el: HTMLElement)
		// Removes `el` from its parent element
		function _remove(el) {
			var parent = el.parentNode;
			if (parent) {
				parent.removeChild(el);
			}
		}

		// @function empty(el: HTMLElement)
		// Removes all of `el`'s children elements from `el`
		function empty(el) {
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		}

		// @function toFront(el: HTMLElement)
		// Makes `el` the last child of its parent, so it renders in front of the other children.
		function toFront(el) {
			var parent = el.parentNode;
			if (parent.lastChild !== el) {
				parent.appendChild(el);
			}
		}

		// @function toBack(el: HTMLElement)
		// Makes `el` the first child of its parent, so it renders behind the other children.
		function toBack(el) {
			var parent = el.parentNode;
			if (parent.firstChild !== el) {
				parent.insertBefore(el, parent.firstChild);
			}
		}

		// @function hasClass(el: HTMLElement, name: String): Boolean
		// Returns `true` if the element's class attribute contains `name`.
		function hasClass(el, name) {
			if (el.classList !== undefined) {
				return el.classList.contains(name);
			}
			var className = getClass(el);
			return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
		}

		// @function addClass(el: HTMLElement, name: String)
		// Adds `name` to the element's class attribute.
		function addClass(el, name) {
			if (el.classList !== undefined) {
				var classes = splitWords(name);
				for (var i = 0, len = classes.length; i < len; i++) {
					el.classList.add(classes[i]);
				}
			} else if (!hasClass(el, name)) {
				var className = getClass(el);
				setClass(el, (className ? className + ' ' : '') + name);
			}
		}

		// @function removeClass(el: HTMLElement, name: String)
		// Removes `name` from the element's class attribute.
		function removeClass(el, name) {
			if (el.classList !== undefined) {
				el.classList.remove(name);
			} else {
				setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
			}
		}

		// @function setClass(el: HTMLElement, name: String)
		// Sets the element's class.
		function setClass(el, name) {
			if (el.className.baseVal === undefined) {
				el.className = name;
			} else {
				// in case of SVG element
				el.className.baseVal = name;
			}
		}

		// @function getClass(el: HTMLElement): String
		// Returns the element's class.
		function getClass(el) {
			return el.className.baseVal === undefined ? el.className : el.className.baseVal;
		}

		// @function setOpacity(el: HTMLElement, opacity: Number)
		// Set the opacity of an element (including old IE support).
		// `opacity` must be a number from `0` to `1`.
		function _setOpacity(el, value) {
			if ('opacity' in el.style) {
				el.style.opacity = value;
			} else if ('filter' in el.style) {
				_setOpacityIE(el, value);
			}
		}

		function _setOpacityIE(el, value) {
			var filter = false,
			    filterName = 'DXImageTransform.Microsoft.Alpha';

			// filters collection throws an error if we try to retrieve a filter that doesn't exist
			try {
				filter = el.filters.item(filterName);
			} catch (e) {
				// don't set opacity to 1 if we haven't already set an opacity,
				// it isn't needed and breaks transparent pngs.
				if (value === 1) {
					return;
				}
			}

			value = Math.round(value * 100);

			if (filter) {
				filter.Enabled = value !== 100;
				filter.Opacity = value;
			} else {
				el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
			}
		}

		// @function testProp(props: String[]): String|false
		// Goes through the array of style names and returns the first name
		// that is a valid style name for an element. If no such name is found,
		// it returns false. Useful for vendor-prefixed styles like `transform`.
		function testProp(props) {
			var style = document.documentElement.style;

			for (var i = 0; i < props.length; i++) {
				if (props[i] in style) {
					return props[i];
				}
			}
			return false;
		}

		// @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
		// Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
		// and optionally scaled by `scale`. Does not have an effect if the
		// browser doesn't support 3D CSS transforms.
		function setTransform(el, offset, scale) {
			var pos = offset || new Point(0, 0);

			el.style[TRANSFORM] = (ie3d ? 'translate(' + pos.x + 'px,' + pos.y + 'px)' : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') + (scale ? ' scale(' + scale + ')' : '');
		}

		// @function setPosition(el: HTMLElement, position: Point)
		// Sets the position of `el` to coordinates specified by `position`,
		// using CSS translate or top/left positioning depending on the browser
		// (used by Leaflet internally to position its layers).
		function setPosition(el, point) {

			/*eslint-disable */
			el._leaflet_pos = point;
			/*eslint-enable */

			if (any3d) {
				setTransform(el, point);
			} else {
				el.style.left = point.x + 'px';
				el.style.top = point.y + 'px';
			}
		}

		// @function getPosition(el: HTMLElement): Point
		// Returns the coordinates of an element previously positioned with setPosition.
		function getPosition(el) {
			// this method is only used for elements previously positioned using setPosition,
			// so it's safe to cache the position for performance

			return el._leaflet_pos || new Point(0, 0);
		}

		// @function disableTextSelection()
		// Prevents the user from generating `selectstart` DOM events, usually generated
		// when the user drags the mouse through a page with text. Used internally
		// by Leaflet to override the behaviour of any click-and-drag interaction on
		// the map. Affects drag interactions on the whole document.

		// @function enableTextSelection()
		// Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
		var disableTextSelection;
		var enableTextSelection;
		var _userSelect;
		if ('onselectstart' in document) {
			disableTextSelection = function disableTextSelection() {
				on(window, 'selectstart', preventDefault);
			};
			enableTextSelection = function enableTextSelection() {
				off(window, 'selectstart', preventDefault);
			};
		} else {
			var userSelectProperty = testProp(['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

			disableTextSelection = function disableTextSelection() {
				if (userSelectProperty) {
					var style = document.documentElement.style;
					_userSelect = style[userSelectProperty];
					style[userSelectProperty] = 'none';
				}
			};
			enableTextSelection = function enableTextSelection() {
				if (userSelectProperty) {
					document.documentElement.style[userSelectProperty] = _userSelect;
					_userSelect = undefined;
				}
			};
		}

		// @function disableImageDrag()
		// As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
		// for `dragstart` DOM events, usually generated when the user drags an image.
		function disableImageDrag() {
			on(window, 'dragstart', preventDefault);
		}

		// @function enableImageDrag()
		// Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
		function enableImageDrag() {
			off(window, 'dragstart', preventDefault);
		}

		var _outlineElement;
		var _outlineStyle;
		// @function preventOutline(el: HTMLElement)
		// Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
		// of the element `el` invisible. Used internally by Leaflet to prevent
		// focusable elements from displaying an outline when the user performs a
		// drag interaction on them.
		function preventOutline(element) {
			while (element.tabIndex === -1) {
				element = element.parentNode;
			}
			if (!element.style) {
				return;
			}
			restoreOutline();
			_outlineElement = element;
			_outlineStyle = element.style.outline;
			element.style.outline = 'none';
			on(window, 'keydown', restoreOutline);
		}

		// @function restoreOutline()
		// Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
		function restoreOutline() {
			if (!_outlineElement) {
				return;
			}
			_outlineElement.style.outline = _outlineStyle;
			_outlineElement = undefined;
			_outlineStyle = undefined;
			off(window, 'keydown', restoreOutline);
		}

		var DomUtil = (Object.freeze || Object)({
			TRANSFORM: TRANSFORM,
			TRANSITION: TRANSITION,
			TRANSITION_END: TRANSITION_END,
			get: get,
			getStyle: getStyle,
			create: create$1,
			remove: _remove,
			empty: empty,
			toFront: toFront,
			toBack: toBack,
			hasClass: hasClass,
			addClass: addClass,
			removeClass: removeClass,
			setClass: setClass,
			getClass: getClass,
			setOpacity: _setOpacity,
			testProp: testProp,
			setTransform: setTransform,
			setPosition: setPosition,
			getPosition: getPosition,
			disableTextSelection: disableTextSelection,
			enableTextSelection: enableTextSelection,
			disableImageDrag: disableImageDrag,
			enableImageDrag: enableImageDrag,
			preventOutline: preventOutline,
			restoreOutline: restoreOutline
		});

		/*
   * @class PosAnimation
   * @aka L.PosAnimation
   * @inherits Evented
   * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
   *
   * @example
   * ```js
   * var fx = new L.PosAnimation();
   * fx.run(el, [300, 500], 0.5);
   * ```
   *
   * @constructor L.PosAnimation()
   * Creates a `PosAnimation` object.
   *
   */

		var PosAnimation = Evented.extend({

			// @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
			// Run an animation of a given element to a new position, optionally setting
			// duration in seconds (`0.25` by default) and easing linearity factor (3rd
			// argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
			// `0.5` by default).
			run: function run(el, newPos, duration, easeLinearity) {
				this.stop();

				this._el = el;
				this._inProgress = true;
				this._duration = duration || 0.25;
				this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

				this._startPos = getPosition(el);
				this._offset = newPos.subtract(this._startPos);
				this._startTime = +new Date();

				// @event start: Event
				// Fired when the animation starts
				this.fire('start');

				this._animate();
			},

			// @method stop()
			// Stops the animation (if currently running).
			stop: function stop() {
				if (!this._inProgress) {
					return;
				}

				this._step(true);
				this._complete();
			},

			_animate: function _animate() {
				// animation loop
				this._animId = requestAnimFrame(this._animate, this);
				this._step();
			},

			_step: function _step(round) {
				var elapsed = +new Date() - this._startTime,
				    duration = this._duration * 1000;

				if (elapsed < duration) {
					this._runFrame(this._easeOut(elapsed / duration), round);
				} else {
					this._runFrame(1);
					this._complete();
				}
			},

			_runFrame: function _runFrame(progress, round) {
				var pos = this._startPos.add(this._offset.multiplyBy(progress));
				if (round) {
					pos._round();
				}
				setPosition(this._el, pos);

				// @event step: Event
				// Fired continuously during the animation.
				this.fire('step');
			},

			_complete: function _complete() {
				cancelAnimFrame(this._animId);

				this._inProgress = false;
				// @event end: Event
				// Fired when the animation ends.
				this.fire('end');
			},

			_easeOut: function _easeOut(t) {
				return 1 - Math.pow(1 - t, this._easeOutPower);
			}
		});

		/*
   * @class Map
   * @aka L.Map
   * @inherits Evented
   *
   * The central class of the API — it is used to create a map on a page and manipulate it.
   *
   * @example
   *
   * ```js
   * // initialize the map on the "map" div with a given center and zoom
   * var map = L.map('map', {
   * 	center: [51.505, -0.09],
   * 	zoom: 13
   * });
   * ```
   *
   */

		var Map = Evented.extend({

			options: {
				// @section Map State Options
				// @option crs: CRS = L.CRS.EPSG3857
				// The [Coordinate Reference System](#crs) to use. Don't change this if you're not
				// sure what it means.
				crs: EPSG3857,

				// @option center: LatLng = undefined
				// Initial geographic center of the map
				center: undefined,

				// @option zoom: Number = undefined
				// Initial map zoom level
				zoom: undefined,

				// @option minZoom: Number = *
				// Minimum zoom level of the map.
				// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
				// the lowest of their `minZoom` options will be used instead.
				minZoom: undefined,

				// @option maxZoom: Number = *
				// Maximum zoom level of the map.
				// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
				// the highest of their `maxZoom` options will be used instead.
				maxZoom: undefined,

				// @option layers: Layer[] = []
				// Array of layers that will be added to the map initially
				layers: [],

				// @option maxBounds: LatLngBounds = null
				// When this option is set, the map restricts the view to the given
				// geographical bounds, bouncing the user back if the user tries to pan
				// outside the view. To set the restriction dynamically, use
				// [`setMaxBounds`](#map-setmaxbounds) method.
				maxBounds: undefined,

				// @option renderer: Renderer = *
				// The default method for drawing vector layers on the map. `L.SVG`
				// or `L.Canvas` by default depending on browser support.
				renderer: undefined,

				// @section Animation Options
				// @option zoomAnimation: Boolean = true
				// Whether the map zoom animation is enabled. By default it's enabled
				// in all browsers that support CSS3 Transitions except Android.
				zoomAnimation: true,

				// @option zoomAnimationThreshold: Number = 4
				// Won't animate zoom if the zoom difference exceeds this value.
				zoomAnimationThreshold: 4,

				// @option fadeAnimation: Boolean = true
				// Whether the tile fade animation is enabled. By default it's enabled
				// in all browsers that support CSS3 Transitions except Android.
				fadeAnimation: true,

				// @option markerZoomAnimation: Boolean = true
				// Whether markers animate their zoom with the zoom animation, if disabled
				// they will disappear for the length of the animation. By default it's
				// enabled in all browsers that support CSS3 Transitions except Android.
				markerZoomAnimation: true,

				// @option transform3DLimit: Number = 2^23
				// Defines the maximum size of a CSS translation transform. The default
				// value should not be changed unless a web browser positions layers in
				// the wrong place after doing a large `panBy`.
				transform3DLimit: 8388608, // Precision limit of a 32-bit float

				// @section Interaction Options
				// @option zoomSnap: Number = 1
				// Forces the map's zoom level to always be a multiple of this, particularly
				// right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
				// By default, the zoom level snaps to the nearest integer; lower values
				// (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
				// means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
				zoomSnap: 1,

				// @option zoomDelta: Number = 1
				// Controls how much the map's zoom level will change after a
				// [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
				// or `-` on the keyboard, or using the [zoom controls](#control-zoom).
				// Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
				zoomDelta: 1,

				// @option trackResize: Boolean = true
				// Whether the map automatically handles browser window resize to update itself.
				trackResize: true
			},

			initialize: function initialize(id, options) {
				// (HTMLElement or String, Object)
				options = setOptions(this, options);

				this._initContainer(id);
				this._initLayout();

				// hack for https://github.com/Leaflet/Leaflet/issues/1980
				this._onResize = bind(this._onResize, this);

				this._initEvents();

				if (options.maxBounds) {
					this.setMaxBounds(options.maxBounds);
				}

				if (options.zoom !== undefined) {
					this._zoom = this._limitZoom(options.zoom);
				}

				if (options.center && options.zoom !== undefined) {
					this.setView(toLatLng(options.center), options.zoom, { reset: true });
				}

				this._handlers = [];
				this._layers = {};
				this._zoomBoundLayers = {};
				this._sizeChanged = true;

				this.callInitHooks();

				// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
				this._zoomAnimated = TRANSITION && any3d && !mobileOpera && this.options.zoomAnimation;

				// zoom transitions run with the same duration for all layers, so if one of transitionend events
				// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
				if (this._zoomAnimated) {
					this._createAnimProxy();
					on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
				}

				this._addLayers(this.options.layers);
			},

			// @section Methods for modifying map state

			// @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
			// Sets the view of the map (geographical center and zoom) with the given
			// animation options.
			setView: function setView(center, zoom, options) {

				zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
				center = this._limitCenter(toLatLng(center), zoom, this.options.maxBounds);
				options = options || {};

				this._stop();

				if (this._loaded && !options.reset && options !== true) {

					if (options.animate !== undefined) {
						options.zoom = extend({ animate: options.animate }, options.zoom);
						options.pan = extend({ animate: options.animate, duration: options.duration }, options.pan);
					}

					// try animating pan or zoom
					var moved = this._zoom !== zoom ? this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) : this._tryAnimatedPan(center, options.pan);

					if (moved) {
						// prevent resize handler call, the view will refresh after animation anyway
						clearTimeout(this._sizeTimer);
						return this;
					}
				}

				// animation didn't start, just reset the map view
				this._resetView(center, zoom);

				return this;
			},

			// @method setZoom(zoom: Number, options?: Zoom/pan options): this
			// Sets the zoom of the map.
			setZoom: function setZoom(zoom, options) {
				if (!this._loaded) {
					this._zoom = zoom;
					return this;
				}
				return this.setView(this.getCenter(), zoom, { zoom: options });
			},

			// @method zoomIn(delta?: Number, options?: Zoom options): this
			// Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
			zoomIn: function zoomIn(delta, options) {
				delta = delta || (any3d ? this.options.zoomDelta : 1);
				return this.setZoom(this._zoom + delta, options);
			},

			// @method zoomOut(delta?: Number, options?: Zoom options): this
			// Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
			zoomOut: function zoomOut(delta, options) {
				delta = delta || (any3d ? this.options.zoomDelta : 1);
				return this.setZoom(this._zoom - delta, options);
			},

			// @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
			// Zooms the map while keeping a specified geographical point on the map
			// stationary (e.g. used internally for scroll zoom and double-click zoom).
			// @alternative
			// @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
			// Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
			setZoomAround: function setZoomAround(latlng, zoom, options) {
				var scale = this.getZoomScale(zoom),
				    viewHalf = this.getSize().divideBy(2),
				    containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng),
				    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
				    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

				return this.setView(newCenter, zoom, { zoom: options });
			},

			_getBoundsCenterZoom: function _getBoundsCenterZoom(bounds, options) {

				options = options || {};
				bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);

				var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
				    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),
				    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

				zoom = typeof options.maxZoom === 'number' ? Math.min(options.maxZoom, zoom) : zoom;

				if (zoom === Infinity) {
					return {
						center: bounds.getCenter(),
						zoom: zoom
					};
				}

				var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),
				    swPoint = this.project(bounds.getSouthWest(), zoom),
				    nePoint = this.project(bounds.getNorthEast(), zoom),
				    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

				return {
					center: center,
					zoom: zoom
				};
			},

			// @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
			// Sets a map view that contains the given geographical bounds with the
			// maximum zoom level possible.
			fitBounds: function fitBounds(bounds, options) {

				bounds = toLatLngBounds(bounds);

				if (!bounds.isValid()) {
					throw new Error('Bounds are not valid.');
				}

				var target = this._getBoundsCenterZoom(bounds, options);
				return this.setView(target.center, target.zoom, options);
			},

			// @method fitWorld(options?: fitBounds options): this
			// Sets a map view that mostly contains the whole world with the maximum
			// zoom level possible.
			fitWorld: function fitWorld(options) {
				return this.fitBounds([[-90, -180], [90, 180]], options);
			},

			// @method panTo(latlng: LatLng, options?: Pan options): this
			// Pans the map to a given center.
			panTo: function panTo(center, options) {
				// (LatLng)
				return this.setView(center, this._zoom, { pan: options });
			},

			// @method panBy(offset: Point, options?: Pan options): this
			// Pans the map by a given number of pixels (animated).
			panBy: function panBy(offset, options) {
				offset = toPoint(offset).round();
				options = options || {};

				if (!offset.x && !offset.y) {
					return this.fire('moveend');
				}
				// If we pan too far, Chrome gets issues with tiles
				// and makes them disappear or appear in the wrong place (slightly offset) #2602
				if (options.animate !== true && !this.getSize().contains(offset)) {
					this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
					return this;
				}

				if (!this._panAnim) {
					this._panAnim = new PosAnimation();

					this._panAnim.on({
						'step': this._onPanTransitionStep,
						'end': this._onPanTransitionEnd
					}, this);
				}

				// don't fire movestart if animating inertia
				if (!options.noMoveStart) {
					this.fire('movestart');
				}

				// animate pan unless animate: false specified
				if (options.animate !== false) {
					addClass(this._mapPane, 'leaflet-pan-anim');

					var newPos = this._getMapPanePos().subtract(offset).round();
					this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
				} else {
					this._rawPanBy(offset);
					this.fire('move').fire('moveend');
				}

				return this;
			},

			// @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
			// Sets the view of the map (geographical center and zoom) performing a smooth
			// pan-zoom animation.
			flyTo: function flyTo(targetCenter, targetZoom, options) {

				options = options || {};
				if (options.animate === false || !any3d) {
					return this.setView(targetCenter, targetZoom, options);
				}

				this._stop();

				var from = this.project(this.getCenter()),
				    to = this.project(targetCenter),
				    size = this.getSize(),
				    startZoom = this._zoom;

				targetCenter = toLatLng(targetCenter);
				targetZoom = targetZoom === undefined ? startZoom : targetZoom;

				var w0 = Math.max(size.x, size.y),
				    w1 = w0 * this.getZoomScale(startZoom, targetZoom),
				    u1 = to.distanceTo(from) || 1,
				    rho = 1.42,
				    rho2 = rho * rho;

				function r(i) {
					var s1 = i ? -1 : 1,
					    s2 = i ? w1 : w0,
					    t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
					    b1 = 2 * s2 * rho2 * u1,
					    b = t1 / b1,
					    sq = Math.sqrt(b * b + 1) - b;

					// workaround for floating point precision bug when sq = 0, log = -Infinite,
					// thus triggering an infinite loop in flyTo
					var log = sq < 0.000000001 ? -18 : Math.log(sq);

					return log;
				}

				function sinh(n) {
					return (Math.exp(n) - Math.exp(-n)) / 2;
				}
				function cosh(n) {
					return (Math.exp(n) + Math.exp(-n)) / 2;
				}
				function tanh(n) {
					return sinh(n) / cosh(n);
				}

				var r0 = r(0);

				function w(s) {
					return w0 * (cosh(r0) / cosh(r0 + rho * s));
				}
				function u(s) {
					return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2;
				}

				function easeOut(t) {
					return 1 - Math.pow(1 - t, 1.5);
				}

				var start = Date.now(),
				    S = (r(1) - r0) / rho,
				    duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

				function frame() {
					var t = (Date.now() - start) / duration,
					    s = easeOut(t) * S;

					if (t <= 1) {
						this._flyToFrame = requestAnimFrame(frame, this);

						this._move(this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom), this.getScaleZoom(w0 / w(s), startZoom), { flyTo: true });
					} else {
						this._move(targetCenter, targetZoom)._moveEnd(true);
					}
				}

				this._moveStart(true);

				frame.call(this);
				return this;
			},

			// @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
			// Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
			// but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
			flyToBounds: function flyToBounds(bounds, options) {
				var target = this._getBoundsCenterZoom(bounds, options);
				return this.flyTo(target.center, target.zoom, options);
			},

			// @method setMaxBounds(bounds: Bounds): this
			// Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
			setMaxBounds: function setMaxBounds(bounds) {
				bounds = toLatLngBounds(bounds);

				if (!bounds.isValid()) {
					this.options.maxBounds = null;
					return this.off('moveend', this._panInsideMaxBounds);
				} else if (this.options.maxBounds) {
					this.off('moveend', this._panInsideMaxBounds);
				}

				this.options.maxBounds = bounds;

				if (this._loaded) {
					this._panInsideMaxBounds();
				}

				return this.on('moveend', this._panInsideMaxBounds);
			},

			// @method setMinZoom(zoom: Number): this
			// Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
			setMinZoom: function setMinZoom(zoom) {
				this.options.minZoom = zoom;

				if (this._loaded && this.getZoom() < this.options.minZoom) {
					return this.setZoom(zoom);
				}

				return this;
			},

			// @method setMaxZoom(zoom: Number): this
			// Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
			setMaxZoom: function setMaxZoom(zoom) {
				this.options.maxZoom = zoom;

				if (this._loaded && this.getZoom() > this.options.maxZoom) {
					return this.setZoom(zoom);
				}

				return this;
			},

			// @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
			// Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
			panInsideBounds: function panInsideBounds(bounds, options) {
				this._enforcingBounds = true;
				var center = this.getCenter(),
				    newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));

				if (!center.equals(newCenter)) {
					this.panTo(newCenter, options);
				}

				this._enforcingBounds = false;
				return this;
			},

			// @method invalidateSize(options: Zoom/Pan options): this
			// Checks if the map container size changed and updates the map if so —
			// call it after you've changed the map size dynamically, also animating
			// pan by default. If `options.pan` is `false`, panning will not occur.
			// If `options.debounceMoveend` is `true`, it will delay `moveend` event so
			// that it doesn't happen often even if the method is called many
			// times in a row.

			// @alternative
			// @method invalidateSize(animate: Boolean): this
			// Checks if the map container size changed and updates the map if so —
			// call it after you've changed the map size dynamically, also animating
			// pan by default.
			invalidateSize: function invalidateSize(options) {
				if (!this._loaded) {
					return this;
				}

				options = extend({
					animate: false,
					pan: true
				}, options === true ? { animate: true } : options);

				var oldSize = this.getSize();
				this._sizeChanged = true;
				this._lastCenter = null;

				var newSize = this.getSize(),
				    oldCenter = oldSize.divideBy(2).round(),
				    newCenter = newSize.divideBy(2).round(),
				    offset = oldCenter.subtract(newCenter);

				if (!offset.x && !offset.y) {
					return this;
				}

				if (options.animate && options.pan) {
					this.panBy(offset);
				} else {
					if (options.pan) {
						this._rawPanBy(offset);
					}

					this.fire('move');

					if (options.debounceMoveend) {
						clearTimeout(this._sizeTimer);
						this._sizeTimer = setTimeout(bind(this.fire, this, 'moveend'), 200);
					} else {
						this.fire('moveend');
					}
				}

				// @section Map state change events
				// @event resize: ResizeEvent
				// Fired when the map is resized.
				return this.fire('resize', {
					oldSize: oldSize,
					newSize: newSize
				});
			},

			// @section Methods for modifying map state
			// @method stop(): this
			// Stops the currently running `panTo` or `flyTo` animation, if any.
			stop: function stop() {
				this.setZoom(this._limitZoom(this._zoom));
				if (!this.options.zoomSnap) {
					this.fire('viewreset');
				}
				return this._stop();
			},

			// @section Geolocation methods
			// @method locate(options?: Locate options): this
			// Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
			// event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
			// and optionally sets the map view to the user's location with respect to
			// detection accuracy (or to the world view if geolocation failed).
			// Note that, if your page doesn't use HTTPS, this method will fail in
			// modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
			// See `Locate options` for more details.
			locate: function locate(options) {

				options = this._locateOptions = extend({
					timeout: 10000,
					watch: false
					// setView: false
					// maxZoom: <Number>
					// maximumAge: 0
					// enableHighAccuracy: false
				}, options);

				if (!('geolocation' in navigator)) {
					this._handleGeolocationError({
						code: 0,
						message: 'Geolocation not supported.'
					});
					return this;
				}

				var onResponse = bind(this._handleGeolocationResponse, this),
				    onError = bind(this._handleGeolocationError, this);

				if (options.watch) {
					this._locationWatchId = navigator.geolocation.watchPosition(onResponse, onError, options);
				} else {
					navigator.geolocation.getCurrentPosition(onResponse, onError, options);
				}
				return this;
			},

			// @method stopLocate(): this
			// Stops watching location previously initiated by `map.locate({watch: true})`
			// and aborts resetting the map view if map.locate was called with
			// `{setView: true}`.
			stopLocate: function stopLocate() {
				if (navigator.geolocation && navigator.geolocation.clearWatch) {
					navigator.geolocation.clearWatch(this._locationWatchId);
				}
				if (this._locateOptions) {
					this._locateOptions.setView = false;
				}
				return this;
			},

			_handleGeolocationError: function _handleGeolocationError(error) {
				var c = error.code,
				    message = error.message || (c === 1 ? 'permission denied' : c === 2 ? 'position unavailable' : 'timeout');

				if (this._locateOptions.setView && !this._loaded) {
					this.fitWorld();
				}

				// @section Location events
				// @event locationerror: ErrorEvent
				// Fired when geolocation (using the [`locate`](#map-locate) method) failed.
				this.fire('locationerror', {
					code: c,
					message: 'Geolocation error: ' + message + '.'
				});
			},

			_handleGeolocationResponse: function _handleGeolocationResponse(pos) {
				var lat = pos.coords.latitude,
				    lng = pos.coords.longitude,
				    latlng = new LatLng(lat, lng),
				    bounds = latlng.toBounds(pos.coords.accuracy),
				    options = this._locateOptions;

				if (options.setView) {
					var zoom = this.getBoundsZoom(bounds);
					this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
				}

				var data = {
					latlng: latlng,
					bounds: bounds,
					timestamp: pos.timestamp
				};

				for (var i in pos.coords) {
					if (typeof pos.coords[i] === 'number') {
						data[i] = pos.coords[i];
					}
				}

				// @event locationfound: LocationEvent
				// Fired when geolocation (using the [`locate`](#map-locate) method)
				// went successfully.
				this.fire('locationfound', data);
			},

			// TODO handler.addTo
			// TODO Appropiate docs section?
			// @section Other Methods
			// @method addHandler(name: String, HandlerClass: Function): this
			// Adds a new `Handler` to the map, given its name and constructor function.
			addHandler: function addHandler(name, HandlerClass) {
				if (!HandlerClass) {
					return this;
				}

				var handler = this[name] = new HandlerClass(this);

				this._handlers.push(handler);

				if (this.options[name]) {
					handler.enable();
				}

				return this;
			},

			// @method remove(): this
			// Destroys the map and clears all related event listeners.
			remove: function remove() {

				this._initEvents(true);

				if (this._containerId !== this._container._leaflet_id) {
					throw new Error('Map container is being reused by another instance');
				}

				try {
					// throws error in IE6-8
					delete this._container._leaflet_id;
					delete this._containerId;
				} catch (e) {
					/*eslint-disable */
					this._container._leaflet_id = undefined;
					/*eslint-enable */
					this._containerId = undefined;
				}

				_remove(this._mapPane);

				if (this._clearControlPos) {
					this._clearControlPos();
				}

				this._clearHandlers();

				if (this._loaded) {
					// @section Map state change events
					// @event unload: Event
					// Fired when the map is destroyed with [remove](#map-remove) method.
					this.fire('unload');
				}

				var i;
				for (i in this._layers) {
					this._layers[i].remove();
				}
				for (i in this._panes) {
					_remove(this._panes[i]);
				}

				this._layers = [];
				this._panes = [];
				delete this._mapPane;
				delete this._renderer;

				return this;
			},

			// @section Other Methods
			// @method createPane(name: String, container?: HTMLElement): HTMLElement
			// Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
			// then returns it. The pane is created as a child of `container`, or
			// as a child of the main map pane if not set.
			createPane: function createPane(name, container) {
				var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
				    pane = create$1('div', className, container || this._mapPane);

				if (name) {
					this._panes[name] = pane;
				}
				return pane;
			},

			// @section Methods for Getting Map State

			// @method getCenter(): LatLng
			// Returns the geographical center of the map view
			getCenter: function getCenter() {
				this._checkIfLoaded();

				if (this._lastCenter && !this._moved()) {
					return this._lastCenter;
				}
				return this.layerPointToLatLng(this._getCenterLayerPoint());
			},

			// @method getZoom(): Number
			// Returns the current zoom level of the map view
			getZoom: function getZoom() {
				return this._zoom;
			},

			// @method getBounds(): LatLngBounds
			// Returns the geographical bounds visible in the current map view
			getBounds: function getBounds() {
				var bounds = this.getPixelBounds(),
				    sw = this.unproject(bounds.getBottomLeft()),
				    ne = this.unproject(bounds.getTopRight());

				return new LatLngBounds(sw, ne);
			},

			// @method getMinZoom(): Number
			// Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
			getMinZoom: function getMinZoom() {
				return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
			},

			// @method getMaxZoom(): Number
			// Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
			getMaxZoom: function getMaxZoom() {
				return this.options.maxZoom === undefined ? this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom : this.options.maxZoom;
			},

			// @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean): Number
			// Returns the maximum zoom level on which the given bounds fit to the map
			// view in its entirety. If `inside` (optional) is set to `true`, the method
			// instead returns the minimum zoom level on which the map view fits into
			// the given bounds in its entirety.
			getBoundsZoom: function getBoundsZoom(bounds, inside, padding) {
				// (LatLngBounds[, Boolean, Point]) -> Number
				bounds = toLatLngBounds(bounds);
				padding = toPoint(padding || [0, 0]);

				var zoom = this.getZoom() || 0,
				    min = this.getMinZoom(),
				    max = this.getMaxZoom(),
				    nw = bounds.getNorthWest(),
				    se = bounds.getSouthEast(),
				    size = this.getSize().subtract(padding),
				    boundsSize = toBounds(this.project(se, zoom), this.project(nw, zoom)).getSize(),
				    snap = any3d ? this.options.zoomSnap : 1,
				    scalex = size.x / boundsSize.x,
				    scaley = size.y / boundsSize.y,
				    scale = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);

				zoom = this.getScaleZoom(scale, zoom);

				if (snap) {
					zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
					zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
				}

				return Math.max(min, Math.min(max, zoom));
			},

			// @method getSize(): Point
			// Returns the current size of the map container (in pixels).
			getSize: function getSize() {
				if (!this._size || this._sizeChanged) {
					this._size = new Point(this._container.clientWidth || 0, this._container.clientHeight || 0);

					this._sizeChanged = false;
				}
				return this._size.clone();
			},

			// @method getPixelBounds(): Bounds
			// Returns the bounds of the current map view in projected pixel
			// coordinates (sometimes useful in layer and overlay implementations).
			getPixelBounds: function getPixelBounds(center, zoom) {
				var topLeftPoint = this._getTopLeftPoint(center, zoom);
				return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
			},

			// TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
			// the map pane? "left point of the map layer" can be confusing, specially
			// since there can be negative offsets.
			// @method getPixelOrigin(): Point
			// Returns the projected pixel coordinates of the top left point of
			// the map layer (useful in custom layer and overlay implementations).
			getPixelOrigin: function getPixelOrigin() {
				this._checkIfLoaded();
				return this._pixelOrigin;
			},

			// @method getPixelWorldBounds(zoom?: Number): Bounds
			// Returns the world's bounds in pixel coordinates for zoom level `zoom`.
			// If `zoom` is omitted, the map's current zoom level is used.
			getPixelWorldBounds: function getPixelWorldBounds(zoom) {
				return this.options.crs.getProjectedBounds(zoom === undefined ? this.getZoom() : zoom);
			},

			// @section Other Methods

			// @method getPane(pane: String|HTMLElement): HTMLElement
			// Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
			getPane: function getPane(pane) {
				return typeof pane === 'string' ? this._panes[pane] : pane;
			},

			// @method getPanes(): Object
			// Returns a plain object containing the names of all [panes](#map-pane) as keys and
			// the panes as values.
			getPanes: function getPanes() {
				return this._panes;
			},

			// @method getContainer: HTMLElement
			// Returns the HTML element that contains the map.
			getContainer: function getContainer() {
				return this._container;
			},

			// @section Conversion Methods

			// @method getZoomScale(toZoom: Number, fromZoom: Number): Number
			// Returns the scale factor to be applied to a map transition from zoom level
			// `fromZoom` to `toZoom`. Used internally to help with zoom animations.
			getZoomScale: function getZoomScale(toZoom, fromZoom) {
				// TODO replace with universal implementation after refactoring projections
				var crs = this.options.crs;
				fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
				return crs.scale(toZoom) / crs.scale(fromZoom);
			},

			// @method getScaleZoom(scale: Number, fromZoom: Number): Number
			// Returns the zoom level that the map would end up at, if it is at `fromZoom`
			// level and everything is scaled by a factor of `scale`. Inverse of
			// [`getZoomScale`](#map-getZoomScale).
			getScaleZoom: function getScaleZoom(scale, fromZoom) {
				var crs = this.options.crs;
				fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
				var zoom = crs.zoom(scale * crs.scale(fromZoom));
				return isNaN(zoom) ? Infinity : zoom;
			},

			// @method project(latlng: LatLng, zoom: Number): Point
			// Projects a geographical coordinate `LatLng` according to the projection
			// of the map's CRS, then scales it according to `zoom` and the CRS's
			// `Transformation`. The result is pixel coordinate relative to
			// the CRS origin.
			project: function project(latlng, zoom) {
				zoom = zoom === undefined ? this._zoom : zoom;
				return this.options.crs.latLngToPoint(toLatLng(latlng), zoom);
			},

			// @method unproject(point: Point, zoom: Number): LatLng
			// Inverse of [`project`](#map-project).
			unproject: function unproject(point, zoom) {
				zoom = zoom === undefined ? this._zoom : zoom;
				return this.options.crs.pointToLatLng(toPoint(point), zoom);
			},

			// @method layerPointToLatLng(point: Point): LatLng
			// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
			// returns the corresponding geographical coordinate (for the current zoom level).
			layerPointToLatLng: function layerPointToLatLng(point) {
				var projectedPoint = toPoint(point).add(this.getPixelOrigin());
				return this.unproject(projectedPoint);
			},

			// @method latLngToLayerPoint(latlng: LatLng): Point
			// Given a geographical coordinate, returns the corresponding pixel coordinate
			// relative to the [origin pixel](#map-getpixelorigin).
			latLngToLayerPoint: function latLngToLayerPoint(latlng) {
				var projectedPoint = this.project(toLatLng(latlng))._round();
				return projectedPoint._subtract(this.getPixelOrigin());
			},

			// @method wrapLatLng(latlng: LatLng): LatLng
			// Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
			// map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
			// CRS's bounds.
			// By default this means longitude is wrapped around the dateline so its
			// value is between -180 and +180 degrees.
			wrapLatLng: function wrapLatLng(latlng) {
				return this.options.crs.wrapLatLng(toLatLng(latlng));
			},

			// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
			// Returns a `LatLngBounds` with the same size as the given one, ensuring that
			// its center is within the CRS's bounds.
			// By default this means the center longitude is wrapped around the dateline so its
			// value is between -180 and +180 degrees, and the majority of the bounds
			// overlaps the CRS's bounds.
			wrapLatLngBounds: function wrapLatLngBounds(latlng) {
				return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
			},

			// @method distance(latlng1: LatLng, latlng2: LatLng): Number
			// Returns the distance between two geographical coordinates according to
			// the map's CRS. By default this measures distance in meters.
			distance: function distance(latlng1, latlng2) {
				return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
			},

			// @method containerPointToLayerPoint(point: Point): Point
			// Given a pixel coordinate relative to the map container, returns the corresponding
			// pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
			containerPointToLayerPoint: function containerPointToLayerPoint(point) {
				// (Point)
				return toPoint(point).subtract(this._getMapPanePos());
			},

			// @method layerPointToContainerPoint(point: Point): Point
			// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
			// returns the corresponding pixel coordinate relative to the map container.
			layerPointToContainerPoint: function layerPointToContainerPoint(point) {
				// (Point)
				return toPoint(point).add(this._getMapPanePos());
			},

			// @method containerPointToLatLng(point: Point): LatLng
			// Given a pixel coordinate relative to the map container, returns
			// the corresponding geographical coordinate (for the current zoom level).
			containerPointToLatLng: function containerPointToLatLng(point) {
				var layerPoint = this.containerPointToLayerPoint(toPoint(point));
				return this.layerPointToLatLng(layerPoint);
			},

			// @method latLngToContainerPoint(latlng: LatLng): Point
			// Given a geographical coordinate, returns the corresponding pixel coordinate
			// relative to the map container.
			latLngToContainerPoint: function latLngToContainerPoint(latlng) {
				return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
			},

			// @method mouseEventToContainerPoint(ev: MouseEvent): Point
			// Given a MouseEvent object, returns the pixel coordinate relative to the
			// map container where the event took place.
			mouseEventToContainerPoint: function mouseEventToContainerPoint(e) {
				return getMousePosition(e, this._container);
			},

			// @method mouseEventToLayerPoint(ev: MouseEvent): Point
			// Given a MouseEvent object, returns the pixel coordinate relative to
			// the [origin pixel](#map-getpixelorigin) where the event took place.
			mouseEventToLayerPoint: function mouseEventToLayerPoint(e) {
				return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
			},

			// @method mouseEventToLatLng(ev: MouseEvent): LatLng
			// Given a MouseEvent object, returns geographical coordinate where the
			// event took place.
			mouseEventToLatLng: function mouseEventToLatLng(e) {
				// (MouseEvent)
				return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
			},

			// map initialization methods

			_initContainer: function _initContainer(id) {
				var container = this._container = get(id);

				if (!container) {
					throw new Error('Map container not found.');
				} else if (container._leaflet_id) {
					throw new Error('Map container is already initialized.');
				}

				on(container, 'scroll', this._onScroll, this);
				this._containerId = stamp(container);
			},

			_initLayout: function _initLayout() {
				var container = this._container;

				this._fadeAnimated = this.options.fadeAnimation && any3d;

				addClass(container, 'leaflet-container' + (touch ? ' leaflet-touch' : '') + (retina ? ' leaflet-retina' : '') + (ielt9 ? ' leaflet-oldie' : '') + (safari ? ' leaflet-safari' : '') + (this._fadeAnimated ? ' leaflet-fade-anim' : ''));

				var position = getStyle(container, 'position');

				if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
					container.style.position = 'relative';
				}

				this._initPanes();

				if (this._initControlPos) {
					this._initControlPos();
				}
			},

			_initPanes: function _initPanes() {
				var panes = this._panes = {};
				this._paneRenderers = {};

				// @section
				//
				// Panes are DOM elements used to control the ordering of layers on the map. You
				// can access panes with [`map.getPane`](#map-getpane) or
				// [`map.getPanes`](#map-getpanes) methods. New panes can be created with the
				// [`map.createPane`](#map-createpane) method.
				//
				// Every map has the following default panes that differ only in zIndex.
				//
				// @pane mapPane: HTMLElement = 'auto'
				// Pane that contains all other map panes

				this._mapPane = this.createPane('mapPane', this._container);
				setPosition(this._mapPane, new Point(0, 0));

				// @pane tilePane: HTMLElement = 200
				// Pane for `GridLayer`s and `TileLayer`s
				this.createPane('tilePane');
				// @pane overlayPane: HTMLElement = 400
				// Pane for vector overlays (`Path`s), like `Polyline`s and `Polygon`s
				this.createPane('shadowPane');
				// @pane shadowPane: HTMLElement = 500
				// Pane for overlay shadows (e.g. `Marker` shadows)
				this.createPane('overlayPane');
				// @pane markerPane: HTMLElement = 600
				// Pane for `Icon`s of `Marker`s
				this.createPane('markerPane');
				// @pane tooltipPane: HTMLElement = 650
				// Pane for tooltip.
				this.createPane('tooltipPane');
				// @pane popupPane: HTMLElement = 700
				// Pane for `Popup`s.
				this.createPane('popupPane');

				if (!this.options.markerZoomAnimation) {
					addClass(panes.markerPane, 'leaflet-zoom-hide');
					addClass(panes.shadowPane, 'leaflet-zoom-hide');
				}
			},

			// private methods that modify map state

			// @section Map state change events
			_resetView: function _resetView(center, zoom) {
				setPosition(this._mapPane, new Point(0, 0));

				var loading = !this._loaded;
				this._loaded = true;
				zoom = this._limitZoom(zoom);

				this.fire('viewprereset');

				var zoomChanged = this._zoom !== zoom;
				this._moveStart(zoomChanged)._move(center, zoom)._moveEnd(zoomChanged);

				// @event viewreset: Event
				// Fired when the map needs to redraw its content (this usually happens
				// on map zoom or load). Very useful for creating custom overlays.
				this.fire('viewreset');

				// @event load: Event
				// Fired when the map is initialized (when its center and zoom are set
				// for the first time).
				if (loading) {
					this.fire('load');
				}
			},

			_moveStart: function _moveStart(zoomChanged) {
				// @event zoomstart: Event
				// Fired when the map zoom is about to change (e.g. before zoom animation).
				// @event movestart: Event
				// Fired when the view of the map starts changing (e.g. user starts dragging the map).
				if (zoomChanged) {
					this.fire('zoomstart');
				}
				return this.fire('movestart');
			},

			_move: function _move(center, zoom, data) {
				if (zoom === undefined) {
					zoom = this._zoom;
				}
				var zoomChanged = this._zoom !== zoom;

				this._zoom = zoom;
				this._lastCenter = center;
				this._pixelOrigin = this._getNewPixelOrigin(center);

				// @event zoom: Event
				// Fired repeatedly during any change in zoom level, including zoom
				// and fly animations.
				if (zoomChanged || data && data.pinch) {
					// Always fire 'zoom' if pinching because #3530
					this.fire('zoom', data);
				}

				// @event move: Event
				// Fired repeatedly during any movement of the map, including pan and
				// fly animations.
				return this.fire('move', data);
			},

			_moveEnd: function _moveEnd(zoomChanged) {
				// @event zoomend: Event
				// Fired when the map has changed, after any animations.
				if (zoomChanged) {
					this.fire('zoomend');
				}

				// @event moveend: Event
				// Fired when the center of the map stops changing (e.g. user stopped
				// dragging the map).
				return this.fire('moveend');
			},

			_stop: function _stop() {
				cancelAnimFrame(this._flyToFrame);
				if (this._panAnim) {
					this._panAnim.stop();
				}
				return this;
			},

			_rawPanBy: function _rawPanBy(offset) {
				setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
			},

			_getZoomSpan: function _getZoomSpan() {
				return this.getMaxZoom() - this.getMinZoom();
			},

			_panInsideMaxBounds: function _panInsideMaxBounds() {
				if (!this._enforcingBounds) {
					this.panInsideBounds(this.options.maxBounds);
				}
			},

			_checkIfLoaded: function _checkIfLoaded() {
				if (!this._loaded) {
					throw new Error('Set map center and zoom first.');
				}
			},

			// DOM event handling

			// @section Interaction events
			_initEvents: function _initEvents(remove$$1) {
				this._targets = {};
				this._targets[stamp(this._container)] = this;

				var onOff = remove$$1 ? off : on;

				// @event click: MouseEvent
				// Fired when the user clicks (or taps) the map.
				// @event dblclick: MouseEvent
				// Fired when the user double-clicks (or double-taps) the map.
				// @event mousedown: MouseEvent
				// Fired when the user pushes the mouse button on the map.
				// @event mouseup: MouseEvent
				// Fired when the user releases the mouse button on the map.
				// @event mouseover: MouseEvent
				// Fired when the mouse enters the map.
				// @event mouseout: MouseEvent
				// Fired when the mouse leaves the map.
				// @event mousemove: MouseEvent
				// Fired while the mouse moves over the map.
				// @event contextmenu: MouseEvent
				// Fired when the user pushes the right mouse button on the map, prevents
				// default browser context menu from showing if there are listeners on
				// this event. Also fired on mobile when the user holds a single touch
				// for a second (also called long press).
				// @event keypress: KeyboardEvent
				// Fired when the user presses a key from the keyboard while the map is focused.
				onOff(this._container, 'click dblclick mousedown mouseup ' + 'mouseover mouseout mousemove contextmenu keypress', this._handleDOMEvent, this);

				if (this.options.trackResize) {
					onOff(window, 'resize', this._onResize, this);
				}

				if (any3d && this.options.transform3DLimit) {
					(remove$$1 ? this.off : this.on).call(this, 'moveend', this._onMoveEnd);
				}
			},

			_onResize: function _onResize() {
				cancelAnimFrame(this._resizeRequest);
				this._resizeRequest = requestAnimFrame(function () {
					this.invalidateSize({ debounceMoveend: true });
				}, this);
			},

			_onScroll: function _onScroll() {
				this._container.scrollTop = 0;
				this._container.scrollLeft = 0;
			},

			_onMoveEnd: function _onMoveEnd() {
				var pos = this._getMapPanePos();
				if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
					// https://bugzilla.mozilla.org/show_bug.cgi?id=1203873 but Webkit also have
					// a pixel offset on very high values, see: http://jsfiddle.net/dg6r5hhb/
					this._resetView(this.getCenter(), this.getZoom());
				}
			},

			_findEventTargets: function _findEventTargets(e, type) {
				var targets = [],
				    target,
				    isHover = type === 'mouseout' || type === 'mouseover',
				    src = e.target || e.srcElement,
				    dragging = false;

				while (src) {
					target = this._targets[stamp(src)];
					if (target && (type === 'click' || type === 'preclick') && !e._simulated && this._draggableMoved(target)) {
						// Prevent firing click after you just dragged an object.
						dragging = true;
						break;
					}
					if (target && target.listens(type, true)) {
						if (isHover && !isExternalTarget(src, e)) {
							break;
						}
						targets.push(target);
						if (isHover) {
							break;
						}
					}
					if (src === this._container) {
						break;
					}
					src = src.parentNode;
				}
				if (!targets.length && !dragging && !isHover && isExternalTarget(src, e)) {
					targets = [this];
				}
				return targets;
			},

			_handleDOMEvent: function _handleDOMEvent(e) {
				if (!this._loaded || skipped(e)) {
					return;
				}

				var type = e.type;

				if (type === 'mousedown' || type === 'keypress') {
					// prevents outline when clicking on keyboard-focusable element
					preventOutline(e.target || e.srcElement);
				}

				this._fireDOMEvent(e, type);
			},

			_mouseEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu'],

			_fireDOMEvent: function _fireDOMEvent(e, type, targets) {

				if (e.type === 'click') {
					// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
					// @event preclick: MouseEvent
					// Fired before mouse click on the map (sometimes useful when you
					// want something to happen on click before any existing click
					// handlers start running).
					var synth = extend({}, e);
					synth.type = 'preclick';
					this._fireDOMEvent(synth, synth.type, targets);
				}

				if (e._stopped) {
					return;
				}

				// Find the layer the event is propagating from and its parents.
				targets = (targets || []).concat(this._findEventTargets(e, type));

				if (!targets.length) {
					return;
				}

				var target = targets[0];
				if (type === 'contextmenu' && target.listens(type, true)) {
					preventDefault(e);
				}

				var data = {
					originalEvent: e
				};

				if (e.type !== 'keypress') {
					var isMarker = target.options && 'icon' in target.options;
					data.containerPoint = isMarker ? this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
					data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
					data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
				}

				for (var i = 0; i < targets.length; i++) {
					targets[i].fire(type, data, true);
					if (data.originalEvent._stopped || targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type) !== -1) {
						return;
					}
				}
			},

			_draggableMoved: function _draggableMoved(obj) {
				obj = obj.dragging && obj.dragging.enabled() ? obj : this;
				return obj.dragging && obj.dragging.moved() || this.boxZoom && this.boxZoom.moved();
			},

			_clearHandlers: function _clearHandlers() {
				for (var i = 0, len = this._handlers.length; i < len; i++) {
					this._handlers[i].disable();
				}
			},

			// @section Other Methods

			// @method whenReady(fn: Function, context?: Object): this
			// Runs the given function `fn` when the map gets initialized with
			// a view (center and zoom) and at least one layer, or immediately
			// if it's already initialized, optionally passing a function context.
			whenReady: function whenReady(callback, context) {
				if (this._loaded) {
					callback.call(context || this, { target: this });
				} else {
					this.on('load', callback, context);
				}
				return this;
			},

			// private methods for getting map state

			_getMapPanePos: function _getMapPanePos() {
				return getPosition(this._mapPane) || new Point(0, 0);
			},

			_moved: function _moved() {
				var pos = this._getMapPanePos();
				return pos && !pos.equals([0, 0]);
			},

			_getTopLeftPoint: function _getTopLeftPoint(center, zoom) {
				var pixelOrigin = center && zoom !== undefined ? this._getNewPixelOrigin(center, zoom) : this.getPixelOrigin();
				return pixelOrigin.subtract(this._getMapPanePos());
			},

			_getNewPixelOrigin: function _getNewPixelOrigin(center, zoom) {
				var viewHalf = this.getSize()._divideBy(2);
				return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
			},

			_latLngToNewLayerPoint: function _latLngToNewLayerPoint(latlng, zoom, center) {
				var topLeft = this._getNewPixelOrigin(center, zoom);
				return this.project(latlng, zoom)._subtract(topLeft);
			},

			_latLngBoundsToNewLayerBounds: function _latLngBoundsToNewLayerBounds(latLngBounds, zoom, center) {
				var topLeft = this._getNewPixelOrigin(center, zoom);
				return toBounds([this.project(latLngBounds.getSouthWest(), zoom)._subtract(topLeft), this.project(latLngBounds.getNorthWest(), zoom)._subtract(topLeft), this.project(latLngBounds.getSouthEast(), zoom)._subtract(topLeft), this.project(latLngBounds.getNorthEast(), zoom)._subtract(topLeft)]);
			},

			// layer point of the current center
			_getCenterLayerPoint: function _getCenterLayerPoint() {
				return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
			},

			// offset of the specified place to the current center in pixels
			_getCenterOffset: function _getCenterOffset(latlng) {
				return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
			},

			// adjust center for view to get inside bounds
			_limitCenter: function _limitCenter(center, zoom, bounds) {

				if (!bounds) {
					return center;
				}

				var centerPoint = this.project(center, zoom),
				    viewHalf = this.getSize().divideBy(2),
				    viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
				    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

				// If offset is less than a pixel, ignore.
				// This prevents unstable projections from getting into
				// an infinite loop of tiny offsets.
				if (offset.round().equals([0, 0])) {
					return center;
				}

				return this.unproject(centerPoint.add(offset), zoom);
			},

			// adjust offset for view to get inside bounds
			_limitOffset: function _limitOffset(offset, bounds) {
				if (!bounds) {
					return offset;
				}

				var viewBounds = this.getPixelBounds(),
				    newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

				return offset.add(this._getBoundsOffset(newBounds, bounds));
			},

			// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
			_getBoundsOffset: function _getBoundsOffset(pxBounds, maxBounds, zoom) {
				var projectedMaxBounds = toBounds(this.project(maxBounds.getNorthEast(), zoom), this.project(maxBounds.getSouthWest(), zoom)),
				    minOffset = projectedMaxBounds.min.subtract(pxBounds.min),
				    maxOffset = projectedMaxBounds.max.subtract(pxBounds.max),
				    dx = this._rebound(minOffset.x, -maxOffset.x),
				    dy = this._rebound(minOffset.y, -maxOffset.y);

				return new Point(dx, dy);
			},

			_rebound: function _rebound(left, right) {
				return left + right > 0 ? Math.round(left - right) / 2 : Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
			},

			_limitZoom: function _limitZoom(zoom) {
				var min = this.getMinZoom(),
				    max = this.getMaxZoom(),
				    snap = any3d ? this.options.zoomSnap : 1;
				if (snap) {
					zoom = Math.round(zoom / snap) * snap;
				}
				return Math.max(min, Math.min(max, zoom));
			},

			_onPanTransitionStep: function _onPanTransitionStep() {
				this.fire('move');
			},

			_onPanTransitionEnd: function _onPanTransitionEnd() {
				removeClass(this._mapPane, 'leaflet-pan-anim');
				this.fire('moveend');
			},

			_tryAnimatedPan: function _tryAnimatedPan(center, options) {
				// difference between the new and current centers in pixels
				var offset = this._getCenterOffset(center)._floor();

				// don't animate too far unless animate: true specified in options
				if ((options && options.animate) !== true && !this.getSize().contains(offset)) {
					return false;
				}

				this.panBy(offset, options);

				return true;
			},

			_createAnimProxy: function _createAnimProxy() {

				var proxy = this._proxy = create$1('div', 'leaflet-proxy leaflet-zoom-animated');
				this._panes.mapPane.appendChild(proxy);

				this.on('zoomanim', function (e) {
					var prop = TRANSFORM,
					    transform = this._proxy.style[prop];

					setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

					// workaround for case when transform is the same and so transitionend event is not fired
					if (transform === this._proxy.style[prop] && this._animatingZoom) {
						this._onZoomTransitionEnd();
					}
				}, this);

				this.on('load moveend', function () {
					var c = this.getCenter(),
					    z = this.getZoom();
					setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
				}, this);

				this._on('unload', this._destroyAnimProxy, this);
			},

			_destroyAnimProxy: function _destroyAnimProxy() {
				_remove(this._proxy);
				delete this._proxy;
			},

			_catchTransitionEnd: function _catchTransitionEnd(e) {
				if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
					this._onZoomTransitionEnd();
				}
			},

			_nothingToAnimate: function _nothingToAnimate() {
				return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
			},

			_tryAnimatedZoom: function _tryAnimatedZoom(center, zoom, options) {

				if (this._animatingZoom) {
					return true;
				}

				options = options || {};

				// don't animate if disabled, not supported or zoom difference is too large
				if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() || Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) {
					return false;
				}

				// offset is the pixel coords of the zoom origin relative to the current center
				var scale = this.getZoomScale(zoom),
				    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

				// don't animate if the zoom origin isn't within one screen from the current center, unless forced
				if (options.animate !== true && !this.getSize().contains(offset)) {
					return false;
				}

				requestAnimFrame(function () {
					this._moveStart(true)._animateZoom(center, zoom, true);
				}, this);

				return true;
			},

			_animateZoom: function _animateZoom(center, zoom, startAnim, noUpdate) {
				if (startAnim) {
					this._animatingZoom = true;

					// remember what center/zoom to set after animation
					this._animateToCenter = center;
					this._animateToZoom = zoom;

					addClass(this._mapPane, 'leaflet-zoom-anim');
				}

				// @event zoomanim: ZoomAnimEvent
				// Fired on every frame of a zoom animation
				this.fire('zoomanim', {
					center: center,
					zoom: zoom,
					noUpdate: noUpdate
				});

				// Work around webkit not firing 'transitionend', see https://github.com/Leaflet/Leaflet/issues/3689, 2693
				setTimeout(bind(this._onZoomTransitionEnd, this), 250);
			},

			_onZoomTransitionEnd: function _onZoomTransitionEnd() {
				if (!this._animatingZoom) {
					return;
				}

				removeClass(this._mapPane, 'leaflet-zoom-anim');

				this._animatingZoom = false;

				this._move(this._animateToCenter, this._animateToZoom);

				// This anim frame should prevent an obscure iOS webkit tile loading race condition.
				requestAnimFrame(function () {
					this._moveEnd(true);
				}, this);
			}
		});

		// @section

		// @factory L.map(id: String, options?: Map options)
		// Instantiates a map object given the DOM ID of a `<div>` element
		// and optionally an object literal with `Map options`.
		//
		// @alternative
		// @factory L.map(el: HTMLElement, options?: Map options)
		// Instantiates a map object given an instance of a `<div>` HTML element
		// and optionally an object literal with `Map options`.
		function createMap(id, options) {
			return new Map(id, options);
		}

		/*
   * @class Control
   * @aka L.Control
   * @inherits Class
   *
   * L.Control is a base class for implementing map controls. Handles positioning.
   * All other controls extend from this class.
   */

		var Control = Class.extend({
			// @section
			// @aka Control options
			options: {
				// @option position: String = 'topright'
				// The position of the control (one of the map corners). Possible values are `'topleft'`,
				// `'topright'`, `'bottomleft'` or `'bottomright'`
				position: 'topright'
			},

			initialize: function initialize(options) {
				setOptions(this, options);
			},

			/* @section
    * Classes extending L.Control will inherit the following methods:
    *
    * @method getPosition: string
    * Returns the position of the control.
    */
			getPosition: function getPosition() {
				return this.options.position;
			},

			// @method setPosition(position: string): this
			// Sets the position of the control.
			setPosition: function setPosition(position) {
				var map = this._map;

				if (map) {
					map.removeControl(this);
				}

				this.options.position = position;

				if (map) {
					map.addControl(this);
				}

				return this;
			},

			// @method getContainer: HTMLElement
			// Returns the HTMLElement that contains the control.
			getContainer: function getContainer() {
				return this._container;
			},

			// @method addTo(map: Map): this
			// Adds the control to the given map.
			addTo: function addTo(map) {
				this.remove();
				this._map = map;

				var container = this._container = this.onAdd(map),
				    pos = this.getPosition(),
				    corner = map._controlCorners[pos];

				addClass(container, 'leaflet-control');

				if (pos.indexOf('bottom') !== -1) {
					corner.insertBefore(container, corner.firstChild);
				} else {
					corner.appendChild(container);
				}

				return this;
			},

			// @method remove: this
			// Removes the control from the map it is currently active on.
			remove: function remove() {
				if (!this._map) {
					return this;
				}

				_remove(this._container);

				if (this.onRemove) {
					this.onRemove(this._map);
				}

				this._map = null;

				return this;
			},

			_refocusOnMap: function _refocusOnMap(e) {
				// if map exists and event is not a keyboard event
				if (this._map && e && e.screenX > 0 && e.screenY > 0) {
					this._map.getContainer().focus();
				}
			}
		});

		var control = function control(options) {
			return new Control(options);
		};

		/* @section Extension methods
   * @uninheritable
   *
   * Every control should extend from `L.Control` and (re-)implement the following methods.
   *
   * @method onAdd(map: Map): HTMLElement
   * Should return the container DOM element for the control and add listeners on relevant map events. Called on [`control.addTo(map)`](#control-addTo).
   *
   * @method onRemove(map: Map)
   * Optional method. Should contain all clean up code that removes the listeners previously added in [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
   */

		/* @namespace Map
   * @section Methods for Layers and Controls
   */
		Map.include({
			// @method addControl(control: Control): this
			// Adds the given control to the map
			addControl: function addControl(control) {
				control.addTo(this);
				return this;
			},

			// @method removeControl(control: Control): this
			// Removes the given control from the map
			removeControl: function removeControl(control) {
				control.remove();
				return this;
			},

			_initControlPos: function _initControlPos() {
				var corners = this._controlCorners = {},
				    l = 'leaflet-',
				    container = this._controlContainer = create$1('div', l + 'control-container', this._container);

				function createCorner(vSide, hSide) {
					var className = l + vSide + ' ' + l + hSide;

					corners[vSide + hSide] = create$1('div', className, container);
				}

				createCorner('top', 'left');
				createCorner('top', 'right');
				createCorner('bottom', 'left');
				createCorner('bottom', 'right');
			},

			_clearControlPos: function _clearControlPos() {
				for (var i in this._controlCorners) {
					_remove(this._controlCorners[i]);
				}
				_remove(this._controlContainer);
				delete this._controlCorners;
				delete this._controlContainer;
			}
		});

		/*
   * @class Control.Layers
   * @aka L.Control.Layers
   * @inherits Control
   *
   * The layers control gives users the ability to switch between different base layers and switch overlays on/off (check out the [detailed example](http://leafletjs.com/examples/layers-control/)). Extends `Control`.
   *
   * @example
   *
   * ```js
   * var baseLayers = {
   * 	"Mapbox": mapbox,
   * 	"OpenStreetMap": osm
   * };
   *
   * var overlays = {
   * 	"Marker": marker,
   * 	"Roads": roadsLayer
   * };
   *
   * L.control.layers(baseLayers, overlays).addTo(map);
   * ```
   *
   * The `baseLayers` and `overlays` parameters are object literals with layer names as keys and `Layer` objects as values:
   *
   * ```js
   * {
   *     "<someName1>": layer1,
   *     "<someName2>": layer2
   * }
   * ```
   *
   * The layer names can contain HTML, which allows you to add additional styling to the items:
   *
   * ```js
   * {"<img src='my-layer-icon' /> <span class='my-layer-item'>My Layer</span>": myLayer}
   * ```
   */

		var Layers = Control.extend({
			// @section
			// @aka Control.Layers options
			options: {
				// @option collapsed: Boolean = true
				// If `true`, the control will be collapsed into an icon and expanded on mouse hover or touch.
				collapsed: true,
				position: 'topright',

				// @option autoZIndex: Boolean = true
				// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
				autoZIndex: true,

				// @option hideSingleBase: Boolean = false
				// If `true`, the base layers in the control will be hidden when there is only one.
				hideSingleBase: false,

				// @option sortLayers: Boolean = false
				// Whether to sort the layers. When `false`, layers will keep the order
				// in which they were added to the control.
				sortLayers: false,

				// @option sortFunction: Function = *
				// A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
				// that will be used for sorting the layers, when `sortLayers` is `true`.
				// The function receives both the `L.Layer` instances and their names, as in
				// `sortFunction(layerA, layerB, nameA, nameB)`.
				// By default, it sorts layers alphabetically by their name.
				sortFunction: function sortFunction(layerA, layerB, nameA, nameB) {
					return nameA < nameB ? -1 : nameB < nameA ? 1 : 0;
				}
			},

			initialize: function initialize(baseLayers, overlays, options) {
				setOptions(this, options);

				this._layerControlInputs = [];
				this._layers = [];
				this._lastZIndex = 0;
				this._handlingClick = false;

				for (var i in baseLayers) {
					this._addLayer(baseLayers[i], i);
				}

				for (i in overlays) {
					this._addLayer(overlays[i], i, true);
				}
			},

			onAdd: function onAdd(map) {
				this._initLayout();
				this._update();

				this._map = map;
				map.on('zoomend', this._checkDisabledLayers, this);

				for (var i = 0; i < this._layers.length; i++) {
					this._layers[i].layer.on('add remove', this._onLayerChange, this);
				}

				return this._container;
			},

			addTo: function addTo(map) {
				Control.prototype.addTo.call(this, map);
				// Trigger expand after Layers Control has been inserted into DOM so that is now has an actual height.
				return this._expandIfNotCollapsed();
			},

			onRemove: function onRemove() {
				this._map.off('zoomend', this._checkDisabledLayers, this);

				for (var i = 0; i < this._layers.length; i++) {
					this._layers[i].layer.off('add remove', this._onLayerChange, this);
				}
			},

			// @method addBaseLayer(layer: Layer, name: String): this
			// Adds a base layer (radio button entry) with the given name to the control.
			addBaseLayer: function addBaseLayer(layer, name) {
				this._addLayer(layer, name);
				return this._map ? this._update() : this;
			},

			// @method addOverlay(layer: Layer, name: String): this
			// Adds an overlay (checkbox entry) with the given name to the control.
			addOverlay: function addOverlay(layer, name) {
				this._addLayer(layer, name, true);
				return this._map ? this._update() : this;
			},

			// @method removeLayer(layer: Layer): this
			// Remove the given layer from the control.
			removeLayer: function removeLayer(layer) {
				layer.off('add remove', this._onLayerChange, this);

				var obj = this._getLayer(stamp(layer));
				if (obj) {
					this._layers.splice(this._layers.indexOf(obj), 1);
				}
				return this._map ? this._update() : this;
			},

			// @method expand(): this
			// Expand the control container if collapsed.
			expand: function expand() {
				addClass(this._container, 'leaflet-control-layers-expanded');
				this._form.style.height = null;
				var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
				if (acceptableHeight < this._form.clientHeight) {
					addClass(this._form, 'leaflet-control-layers-scrollbar');
					this._form.style.height = acceptableHeight + 'px';
				} else {
					removeClass(this._form, 'leaflet-control-layers-scrollbar');
				}
				this._checkDisabledLayers();
				return this;
			},

			// @method collapse(): this
			// Collapse the control container if expanded.
			collapse: function collapse() {
				removeClass(this._container, 'leaflet-control-layers-expanded');
				return this;
			},

			_initLayout: function _initLayout() {
				var className = 'leaflet-control-layers',
				    container = this._container = create$1('div', className),
				    collapsed = this.options.collapsed;

				// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
				container.setAttribute('aria-haspopup', true);

				disableClickPropagation(container);
				disableScrollPropagation(container);

				var form = this._form = create$1('form', className + '-list');

				if (collapsed) {
					this._map.on('click', this.collapse, this);

					if (!android) {
						on(container, {
							mouseenter: this.expand,
							mouseleave: this.collapse
						}, this);
					}
				}

				var link = this._layersLink = create$1('a', className + '-toggle', container);
				link.href = '#';
				link.title = 'Layers';

				if (touch) {
					on(link, 'click', stop);
					on(link, 'click', this.expand, this);
				} else {
					on(link, 'focus', this.expand, this);
				}

				if (!collapsed) {
					this.expand();
				}

				this._baseLayersList = create$1('div', className + '-base', form);
				this._separator = create$1('div', className + '-separator', form);
				this._overlaysList = create$1('div', className + '-overlays', form);

				container.appendChild(form);
			},

			_getLayer: function _getLayer(id) {
				for (var i = 0; i < this._layers.length; i++) {

					if (this._layers[i] && stamp(this._layers[i].layer) === id) {
						return this._layers[i];
					}
				}
			},

			_addLayer: function _addLayer(layer, name, overlay) {
				if (this._map) {
					layer.on('add remove', this._onLayerChange, this);
				}

				this._layers.push({
					layer: layer,
					name: name,
					overlay: overlay
				});

				if (this.options.sortLayers) {
					this._layers.sort(bind(function (a, b) {
						return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
					}, this));
				}

				if (this.options.autoZIndex && layer.setZIndex) {
					this._lastZIndex++;
					layer.setZIndex(this._lastZIndex);
				}

				this._expandIfNotCollapsed();
			},

			_update: function _update() {
				if (!this._container) {
					return this;
				}

				empty(this._baseLayersList);
				empty(this._overlaysList);

				this._layerControlInputs = [];
				var baseLayersPresent,
				    overlaysPresent,
				    i,
				    obj,
				    baseLayersCount = 0;

				for (i = 0; i < this._layers.length; i++) {
					obj = this._layers[i];
					this._addItem(obj);
					overlaysPresent = overlaysPresent || obj.overlay;
					baseLayersPresent = baseLayersPresent || !obj.overlay;
					baseLayersCount += !obj.overlay ? 1 : 0;
				}

				// Hide base layers section if there's only one layer.
				if (this.options.hideSingleBase) {
					baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
					this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
				}

				this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

				return this;
			},

			_onLayerChange: function _onLayerChange(e) {
				if (!this._handlingClick) {
					this._update();
				}

				var obj = this._getLayer(stamp(e.target));

				// @namespace Map
				// @section Layer events
				// @event baselayerchange: LayersControlEvent
				// Fired when the base layer is changed through the [layer control](#control-layers).
				// @event overlayadd: LayersControlEvent
				// Fired when an overlay is selected through the [layer control](#control-layers).
				// @event overlayremove: LayersControlEvent
				// Fired when an overlay is deselected through the [layer control](#control-layers).
				// @namespace Control.Layers
				var type = obj.overlay ? e.type === 'add' ? 'overlayadd' : 'overlayremove' : e.type === 'add' ? 'baselayerchange' : null;

				if (type) {
					this._map.fire(type, obj);
				}
			},

			// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
			_createRadioElement: function _createRadioElement(name, checked) {

				var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"' + (checked ? ' checked="checked"' : '') + '/>';

				var radioFragment = document.createElement('div');
				radioFragment.innerHTML = radioHtml;

				return radioFragment.firstChild;
			},

			_addItem: function _addItem(obj) {
				var label = document.createElement('label'),
				    checked = this._map.hasLayer(obj.layer),
				    input;

				if (obj.overlay) {
					input = document.createElement('input');
					input.type = 'checkbox';
					input.className = 'leaflet-control-layers-selector';
					input.defaultChecked = checked;
				} else {
					input = this._createRadioElement('leaflet-base-layers', checked);
				}

				this._layerControlInputs.push(input);
				input.layerId = stamp(obj.layer);

				on(input, 'click', this._onInputClick, this);

				var name = document.createElement('span');
				name.innerHTML = ' ' + obj.name;

				// Helps from preventing layer control flicker when checkboxes are disabled
				// https://github.com/Leaflet/Leaflet/issues/2771
				var holder = document.createElement('div');

				label.appendChild(holder);
				holder.appendChild(input);
				holder.appendChild(name);

				var container = obj.overlay ? this._overlaysList : this._baseLayersList;
				container.appendChild(label);

				this._checkDisabledLayers();
				return label;
			},

			_onInputClick: function _onInputClick() {
				var inputs = this._layerControlInputs,
				    input,
				    layer;
				var addedLayers = [],
				    removedLayers = [];

				this._handlingClick = true;

				for (var i = inputs.length - 1; i >= 0; i--) {
					input = inputs[i];
					layer = this._getLayer(input.layerId).layer;

					if (input.checked) {
						addedLayers.push(layer);
					} else if (!input.checked) {
						removedLayers.push(layer);
					}
				}

				// Bugfix issue 2318: Should remove all old layers before readding new ones
				for (i = 0; i < removedLayers.length; i++) {
					if (this._map.hasLayer(removedLayers[i])) {
						this._map.removeLayer(removedLayers[i]);
					}
				}
				for (i = 0; i < addedLayers.length; i++) {
					if (!this._map.hasLayer(addedLayers[i])) {
						this._map.addLayer(addedLayers[i]);
					}
				}

				this._handlingClick = false;

				this._refocusOnMap();
			},

			_checkDisabledLayers: function _checkDisabledLayers() {
				var inputs = this._layerControlInputs,
				    input,
				    layer,
				    zoom = this._map.getZoom();

				for (var i = inputs.length - 1; i >= 0; i--) {
					input = inputs[i];
					layer = this._getLayer(input.layerId).layer;
					input.disabled = layer.options.minZoom !== undefined && zoom < layer.options.minZoom || layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom;
				}
			},

			_expandIfNotCollapsed: function _expandIfNotCollapsed() {
				if (this._map && !this.options.collapsed) {
					this.expand();
				}
				return this;
			},

			_expand: function _expand() {
				// Backward compatibility, remove me in 1.1.
				return this.expand();
			},

			_collapse: function _collapse() {
				// Backward compatibility, remove me in 1.1.
				return this.collapse();
			}

		});

		// @factory L.control.layers(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
		// Creates an attribution control with the given layers. Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
		var layers = function layers(baseLayers, overlays, options) {
			return new Layers(baseLayers, overlays, options);
		};

		/*
   * @class Control.Zoom
   * @aka L.Control.Zoom
   * @inherits Control
   *
   * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
   */

		var Zoom = Control.extend({
			// @section
			// @aka Control.Zoom options
			options: {
				position: 'topleft',

				// @option zoomInText: String = '+'
				// The text set on the 'zoom in' button.
				zoomInText: '+',

				// @option zoomInTitle: String = 'Zoom in'
				// The title set on the 'zoom in' button.
				zoomInTitle: 'Zoom in',

				// @option zoomOutText: String = '&#x2212;'
				// The text set on the 'zoom out' button.
				zoomOutText: '&#x2212;',

				// @option zoomOutTitle: String = 'Zoom out'
				// The title set on the 'zoom out' button.
				zoomOutTitle: 'Zoom out'
			},

			onAdd: function onAdd(map) {
				var zoomName = 'leaflet-control-zoom',
				    container = create$1('div', zoomName + ' leaflet-bar'),
				    options = this.options;

				this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle, zoomName + '-in', container, this._zoomIn);
				this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle, zoomName + '-out', container, this._zoomOut);

				this._updateDisabled();
				map.on('zoomend zoomlevelschange', this._updateDisabled, this);

				return container;
			},

			onRemove: function onRemove(map) {
				map.off('zoomend zoomlevelschange', this._updateDisabled, this);
			},

			disable: function disable() {
				this._disabled = true;
				this._updateDisabled();
				return this;
			},

			enable: function enable() {
				this._disabled = false;
				this._updateDisabled();
				return this;
			},

			_zoomIn: function _zoomIn(e) {
				if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
					this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
				}
			},

			_zoomOut: function _zoomOut(e) {
				if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
					this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
				}
			},

			_createButton: function _createButton(html, title, className, container, fn) {
				var link = create$1('a', className, container);
				link.innerHTML = html;
				link.href = '#';
				link.title = title;

				/*
     * Will force screen readers like VoiceOver to read this as "Zoom in - button"
     */
				link.setAttribute('role', 'button');
				link.setAttribute('aria-label', title);

				disableClickPropagation(link);
				on(link, 'click', stop);
				on(link, 'click', fn, this);
				on(link, 'click', this._refocusOnMap, this);

				return link;
			},

			_updateDisabled: function _updateDisabled() {
				var map = this._map,
				    className = 'leaflet-disabled';

				removeClass(this._zoomInButton, className);
				removeClass(this._zoomOutButton, className);

				if (this._disabled || map._zoom === map.getMinZoom()) {
					addClass(this._zoomOutButton, className);
				}
				if (this._disabled || map._zoom === map.getMaxZoom()) {
					addClass(this._zoomInButton, className);
				}
			}
		});

		// @namespace Map
		// @section Control options
		// @option zoomControl: Boolean = true
		// Whether a [zoom control](#control-zoom) is added to the map by default.
		Map.mergeOptions({
			zoomControl: true
		});

		Map.addInitHook(function () {
			if (this.options.zoomControl) {
				this.zoomControl = new Zoom();
				this.addControl(this.zoomControl);
			}
		});

		// @namespace Control.Zoom
		// @factory L.control.zoom(options: Control.Zoom options)
		// Creates a zoom control
		var zoom = function zoom(options) {
			return new Zoom(options);
		};

		/*
   * @class Control.Scale
   * @aka L.Control.Scale
   * @inherits Control
   *
   * A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
   *
   * @example
   *
   * ```js
   * L.control.scale().addTo(map);
   * ```
   */

		var Scale = Control.extend({
			// @section
			// @aka Control.Scale options
			options: {
				position: 'bottomleft',

				// @option maxWidth: Number = 100
				// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
				maxWidth: 100,

				// @option metric: Boolean = True
				// Whether to show the metric scale line (m/km).
				metric: true,

				// @option imperial: Boolean = True
				// Whether to show the imperial scale line (mi/ft).
				imperial: true

				// @option updateWhenIdle: Boolean = false
				// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
			},

			onAdd: function onAdd(map) {
				var className = 'leaflet-control-scale',
				    container = create$1('div', className),
				    options = this.options;

				this._addScales(options, className + '-line', container);

				map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
				map.whenReady(this._update, this);

				return container;
			},

			onRemove: function onRemove(map) {
				map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
			},

			_addScales: function _addScales(options, className, container) {
				if (options.metric) {
					this._mScale = create$1('div', className, container);
				}
				if (options.imperial) {
					this._iScale = create$1('div', className, container);
				}
			},

			_update: function _update() {
				var map = this._map,
				    y = map.getSize().y / 2;

				var maxMeters = map.distance(map.containerPointToLatLng([0, y]), map.containerPointToLatLng([this.options.maxWidth, y]));

				this._updateScales(maxMeters);
			},

			_updateScales: function _updateScales(maxMeters) {
				if (this.options.metric && maxMeters) {
					this._updateMetric(maxMeters);
				}
				if (this.options.imperial && maxMeters) {
					this._updateImperial(maxMeters);
				}
			},

			_updateMetric: function _updateMetric(maxMeters) {
				var meters = this._getRoundNum(maxMeters),
				    label = meters < 1000 ? meters + ' m' : meters / 1000 + ' km';

				this._updateScale(this._mScale, label, meters / maxMeters);
			},

			_updateImperial: function _updateImperial(maxMeters) {
				var maxFeet = maxMeters * 3.2808399,
				    maxMiles,
				    miles,
				    feet;

				if (maxFeet > 5280) {
					maxMiles = maxFeet / 5280;
					miles = this._getRoundNum(maxMiles);
					this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);
				} else {
					feet = this._getRoundNum(maxFeet);
					this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
				}
			},

			_updateScale: function _updateScale(scale, text, ratio) {
				scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
				scale.innerHTML = text;
			},

			_getRoundNum: function _getRoundNum(num) {
				var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
				    d = num / pow10;

				d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

				return pow10 * d;
			}
		});

		// @factory L.control.scale(options?: Control.Scale options)
		// Creates an scale control with the given options.
		var scale = function scale(options) {
			return new Scale(options);
		};

		/*
   * @class Control.Attribution
   * @aka L.Control.Attribution
   * @inherits Control
   *
   * The attribution control allows you to display attribution data in a small text box on a map. It is put on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to `false`, and it fetches attribution texts from layers with the [`getAttribution` method](#layer-getattribution) automatically. Extends Control.
   */

		var Attribution = Control.extend({
			// @section
			// @aka Control.Attribution options
			options: {
				position: 'bottomright',

				// @option prefix: String = 'Leaflet'
				// The HTML text shown before the attributions. Pass `false` to disable.
				prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
			},

			initialize: function initialize(options) {
				setOptions(this, options);

				this._attributions = {};
			},

			onAdd: function onAdd(map) {
				map.attributionControl = this;
				this._container = create$1('div', 'leaflet-control-attribution');
				disableClickPropagation(this._container);

				// TODO ugly, refactor
				for (var i in map._layers) {
					if (map._layers[i].getAttribution) {
						this.addAttribution(map._layers[i].getAttribution());
					}
				}

				this._update();

				return this._container;
			},

			// @method setPrefix(prefix: String): this
			// Sets the text before the attributions.
			setPrefix: function setPrefix(prefix) {
				this.options.prefix = prefix;
				this._update();
				return this;
			},

			// @method addAttribution(text: String): this
			// Adds an attribution text (e.g. `'Vector data &copy; Mapbox'`).
			addAttribution: function addAttribution(text) {
				if (!text) {
					return this;
				}

				if (!this._attributions[text]) {
					this._attributions[text] = 0;
				}
				this._attributions[text]++;

				this._update();

				return this;
			},

			// @method removeAttribution(text: String): this
			// Removes an attribution text.
			removeAttribution: function removeAttribution(text) {
				if (!text) {
					return this;
				}

				if (this._attributions[text]) {
					this._attributions[text]--;
					this._update();
				}

				return this;
			},

			_update: function _update() {
				if (!this._map) {
					return;
				}

				var attribs = [];

				for (var i in this._attributions) {
					if (this._attributions[i]) {
						attribs.push(i);
					}
				}

				var prefixAndAttribs = [];

				if (this.options.prefix) {
					prefixAndAttribs.push(this.options.prefix);
				}
				if (attribs.length) {
					prefixAndAttribs.push(attribs.join(', '));
				}

				this._container.innerHTML = prefixAndAttribs.join(' | ');
			}
		});

		// @namespace Map
		// @section Control options
		// @option attributionControl: Boolean = true
		// Whether a [attribution control](#control-attribution) is added to the map by default.
		Map.mergeOptions({
			attributionControl: true
		});

		Map.addInitHook(function () {
			if (this.options.attributionControl) {
				new Attribution().addTo(this);
			}
		});

		// @namespace Control.Attribution
		// @factory L.control.attribution(options: Control.Attribution options)
		// Creates an attribution control.
		var attribution = function attribution(options) {
			return new Attribution(options);
		};

		Control.Layers = Layers;
		Control.Zoom = Zoom;
		Control.Scale = Scale;
		Control.Attribution = Attribution;

		control.layers = layers;
		control.zoom = zoom;
		control.scale = scale;
		control.attribution = attribution;

		/*
  	L.Handler is a base class for handler classes that are used internally to inject
  	interaction features like dragging to classes like Map and Marker.
  */

		// @class Handler
		// @aka L.Handler
		// Abstract class for map interaction handlers

		var Handler = Class.extend({
			initialize: function initialize(map) {
				this._map = map;
			},

			// @method enable(): this
			// Enables the handler
			enable: function enable() {
				if (this._enabled) {
					return this;
				}

				this._enabled = true;
				this.addHooks();
				return this;
			},

			// @method disable(): this
			// Disables the handler
			disable: function disable() {
				if (!this._enabled) {
					return this;
				}

				this._enabled = false;
				this.removeHooks();
				return this;
			},

			// @method enabled(): Boolean
			// Returns `true` if the handler is enabled
			enabled: function enabled() {
				return !!this._enabled;
			}

			// @section Extension methods
			// Classes inheriting from `Handler` must implement the two following methods:
			// @method addHooks()
			// Called when the handler is enabled, should add event hooks.
			// @method removeHooks()
			// Called when the handler is disabled, should remove the event hooks added previously.
		});

		var Mixin = { Events: Events };

		/*
   * @class Draggable
   * @aka L.Draggable
   * @inherits Evented
   *
   * A class for making DOM elements draggable (including touch support).
   * Used internally for map and marker dragging. Only works for elements
   * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
   *
   * @example
   * ```js
   * var draggable = new L.Draggable(elementToDrag);
   * draggable.enable();
   * ```
   */

		var START = touch ? 'touchstart mousedown' : 'mousedown';
		var END = {
			mousedown: 'mouseup',
			touchstart: 'touchend',
			pointerdown: 'touchend',
			MSPointerDown: 'touchend'
		};
		var MOVE = {
			mousedown: 'mousemove',
			touchstart: 'touchmove',
			pointerdown: 'touchmove',
			MSPointerDown: 'touchmove'
		};

		var Draggable = Evented.extend({

			options: {
				// @section
				// @aka Draggable options
				// @option clickTolerance: Number = 3
				// The max number of pixels a user can shift the mouse pointer during a click
				// for it to be considered a valid click (as opposed to a mouse drag).
				clickTolerance: 3
			},

			// @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
			// Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
			initialize: function initialize(element, dragStartTarget, preventOutline$$1, options) {
				setOptions(this, options);

				this._element = element;
				this._dragStartTarget = dragStartTarget || element;
				this._preventOutline = preventOutline$$1;
			},

			// @method enable()
			// Enables the dragging ability
			enable: function enable() {
				if (this._enabled) {
					return;
				}

				on(this._dragStartTarget, START, this._onDown, this);

				this._enabled = true;
			},

			// @method disable()
			// Disables the dragging ability
			disable: function disable() {
				if (!this._enabled) {
					return;
				}

				// If we're currently dragging this draggable,
				// disabling it counts as first ending the drag.
				if (Draggable._dragging === this) {
					this.finishDrag();
				}

				off(this._dragStartTarget, START, this._onDown, this);

				this._enabled = false;
				this._moved = false;
			},

			_onDown: function _onDown(e) {
				// Ignore simulated events, since we handle both touch and
				// mouse explicitly; otherwise we risk getting duplicates of
				// touch events, see #4315.
				// Also ignore the event if disabled; this happens in IE11
				// under some circumstances, see #3666.
				if (e._simulated || !this._enabled) {
					return;
				}

				this._moved = false;

				if (hasClass(this._element, 'leaflet-zoom-anim')) {
					return;
				}

				if (Draggable._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) {
					return;
				}
				Draggable._dragging = this; // Prevent dragging multiple objects at once.

				if (this._preventOutline) {
					preventOutline(this._element);
				}

				disableImageDrag();
				disableTextSelection();

				if (this._moving) {
					return;
				}

				// @event down: Event
				// Fired when a drag is about to start.
				this.fire('down');

				var first = e.touches ? e.touches[0] : e;

				this._startPoint = new Point(first.clientX, first.clientY);

				on(document, MOVE[e.type], this._onMove, this);
				on(document, END[e.type], this._onUp, this);
			},

			_onMove: function _onMove(e) {
				// Ignore simulated events, since we handle both touch and
				// mouse explicitly; otherwise we risk getting duplicates of
				// touch events, see #4315.
				// Also ignore the event if disabled; this happens in IE11
				// under some circumstances, see #3666.
				if (e._simulated || !this._enabled) {
					return;
				}

				if (e.touches && e.touches.length > 1) {
					this._moved = true;
					return;
				}

				var first = e.touches && e.touches.length === 1 ? e.touches[0] : e,
				    newPoint = new Point(first.clientX, first.clientY),
				    offset = newPoint.subtract(this._startPoint);

				if (!offset.x && !offset.y) {
					return;
				}
				if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) {
					return;
				}

				preventDefault(e);

				if (!this._moved) {
					// @event dragstart: Event
					// Fired when a drag starts
					this.fire('dragstart');

					this._moved = true;
					this._startPos = getPosition(this._element).subtract(offset);

					addClass(document.body, 'leaflet-dragging');

					this._lastTarget = e.target || e.srcElement;
					// IE and Edge do not give the <use> element, so fetch it
					// if necessary
					if (window.SVGElementInstance && this._lastTarget instanceof SVGElementInstance) {
						this._lastTarget = this._lastTarget.correspondingUseElement;
					}
					addClass(this._lastTarget, 'leaflet-drag-target');
				}

				this._newPos = this._startPos.add(offset);
				this._moving = true;

				cancelAnimFrame(this._animRequest);
				this._lastEvent = e;
				this._animRequest = requestAnimFrame(this._updatePosition, this, true);
			},

			_updatePosition: function _updatePosition() {
				var e = { originalEvent: this._lastEvent };

				// @event predrag: Event
				// Fired continuously during dragging *before* each corresponding
				// update of the element's position.
				this.fire('predrag', e);
				setPosition(this._element, this._newPos);

				// @event drag: Event
				// Fired continuously during dragging.
				this.fire('drag', e);
			},

			_onUp: function _onUp(e) {
				// Ignore simulated events, since we handle both touch and
				// mouse explicitly; otherwise we risk getting duplicates of
				// touch events, see #4315.
				// Also ignore the event if disabled; this happens in IE11
				// under some circumstances, see #3666.
				if (e._simulated || !this._enabled) {
					return;
				}
				this.finishDrag();
			},

			finishDrag: function finishDrag() {
				removeClass(document.body, 'leaflet-dragging');

				if (this._lastTarget) {
					removeClass(this._lastTarget, 'leaflet-drag-target');
					this._lastTarget = null;
				}

				for (var i in MOVE) {
					off(document, MOVE[i], this._onMove, this);
					off(document, END[i], this._onUp, this);
				}

				enableImageDrag();
				enableTextSelection();

				if (this._moved && this._moving) {
					// ensure drag is not fired after dragend
					cancelAnimFrame(this._animRequest);

					// @event dragend: DragEndEvent
					// Fired when the drag ends.
					this.fire('dragend', {
						distance: this._newPos.distanceTo(this._startPos)
					});
				}

				this._moving = false;
				Draggable._dragging = false;
			}

		});

		/*
   * @namespace LineUtil
   *
   * Various utility functions for polyine points processing, used by Leaflet internally to make polylines lightning-fast.
   */

		// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
		// Improves rendering performance dramatically by lessening the number of points to draw.

		// @function simplify(points: Point[], tolerance: Number): Point[]
		// Dramatically reduces the number of points in a polyline while retaining
		// its shape and returns a new array of simplified points, using the
		// [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
		// Used for a huge performance boost when processing/displaying Leaflet polylines for
		// each zoom level and also reducing visual noise. tolerance affects the amount of
		// simplification (lesser value means higher quality but slower and with more points).
		// Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
		function simplify(points, tolerance) {
			if (!tolerance || !points.length) {
				return points.slice();
			}

			var sqTolerance = tolerance * tolerance;

			// stage 1: vertex reduction
			points = _reducePoints(points, sqTolerance);

			// stage 2: Douglas-Peucker simplification
			points = _simplifyDP(points, sqTolerance);

			return points;
		}

		// @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
		// Returns the distance between point `p` and segment `p1` to `p2`.
		function pointToSegmentDistance(p, p1, p2) {
			return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
		}

		// @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
		// Returns the closest point from a point `p` on a segment `p1` to `p2`.
		function closestPointOnSegment(p, p1, p2) {
			return _sqClosestPointOnSegment(p, p1, p2);
		}

		// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
		function _simplifyDP(points, sqTolerance) {

			var len = points.length,
			    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
			    markers = new ArrayConstructor(len);

			markers[0] = markers[len - 1] = 1;

			_simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

			var i,
			    newPoints = [];

			for (i = 0; i < len; i++) {
				if (markers[i]) {
					newPoints.push(points[i]);
				}
			}

			return newPoints;
		}

		function _simplifyDPStep(points, markers, sqTolerance, first, last) {

			var maxSqDist = 0,
			    index,
			    i,
			    sqDist;

			for (i = first + 1; i <= last - 1; i++) {
				sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

				if (sqDist > maxSqDist) {
					index = i;
					maxSqDist = sqDist;
				}
			}

			if (maxSqDist > sqTolerance) {
				markers[index] = 1;

				_simplifyDPStep(points, markers, sqTolerance, first, index);
				_simplifyDPStep(points, markers, sqTolerance, index, last);
			}
		}

		// reduce points that are too close to each other to a single point
		function _reducePoints(points, sqTolerance) {
			var reducedPoints = [points[0]];

			for (var i = 1, prev = 0, len = points.length; i < len; i++) {
				if (_sqDist(points[i], points[prev]) > sqTolerance) {
					reducedPoints.push(points[i]);
					prev = i;
				}
			}
			if (prev < len - 1) {
				reducedPoints.push(points[len - 1]);
			}
			return reducedPoints;
		}

		var _lastCode;

		// @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
		// Clips the segment a to b by rectangular bounds with the
		// [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
		// (modifying the segment points directly!). Used by Leaflet to only show polyline
		// points that are on the screen or near, increasing performance.
		function clipSegment(a, b, bounds, useLastCode, round) {
			var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
			    codeB = _getBitCode(b, bounds),
			    codeOut,
			    p,
			    newCode;

			// save 2nd code to avoid calculating it on the next segment
			_lastCode = codeB;

			while (true) {
				// if a,b is inside the clip window (trivial accept)
				if (!(codeA | codeB)) {
					return [a, b];
				}

				// if a,b is outside the clip window (trivial reject)
				if (codeA & codeB) {
					return false;
				}

				// other cases
				codeOut = codeA || codeB;
				p = _getEdgeIntersection(a, b, codeOut, bounds, round);
				newCode = _getBitCode(p, bounds);

				if (codeOut === codeA) {
					a = p;
					codeA = newCode;
				} else {
					b = p;
					codeB = newCode;
				}
			}
		}

		function _getEdgeIntersection(a, b, code, bounds, round) {
			var dx = b.x - a.x,
			    dy = b.y - a.y,
			    min = bounds.min,
			    max = bounds.max,
			    x,
			    y;

			if (code & 8) {
				// top
				x = a.x + dx * (max.y - a.y) / dy;
				y = max.y;
			} else if (code & 4) {
				// bottom
				x = a.x + dx * (min.y - a.y) / dy;
				y = min.y;
			} else if (code & 2) {
				// right
				x = max.x;
				y = a.y + dy * (max.x - a.x) / dx;
			} else if (code & 1) {
				// left
				x = min.x;
				y = a.y + dy * (min.x - a.x) / dx;
			}

			return new Point(x, y, round);
		}

		function _getBitCode(p, bounds) {
			var code = 0;

			if (p.x < bounds.min.x) {
				// left
				code |= 1;
			} else if (p.x > bounds.max.x) {
				// right
				code |= 2;
			}

			if (p.y < bounds.min.y) {
				// bottom
				code |= 4;
			} else if (p.y > bounds.max.y) {
				// top
				code |= 8;
			}

			return code;
		}

		// square distance (to avoid unnecessary Math.sqrt calls)
		function _sqDist(p1, p2) {
			var dx = p2.x - p1.x,
			    dy = p2.y - p1.y;
			return dx * dx + dy * dy;
		}

		// return closest point on segment or distance to that point
		function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
			var x = p1.x,
			    y = p1.y,
			    dx = p2.x - x,
			    dy = p2.y - y,
			    dot = dx * dx + dy * dy,
			    t;

			if (dot > 0) {
				t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

				if (t > 1) {
					x = p2.x;
					y = p2.y;
				} else if (t > 0) {
					x += dx * t;
					y += dy * t;
				}
			}

			dx = p.x - x;
			dy = p.y - y;

			return sqDist ? dx * dx + dy * dy : new Point(x, y);
		}

		// @function isFlat(latlngs: LatLng[]): Boolean
		// Returns true if `latlngs` is a flat array, false is nested.
		function isFlat(latlngs) {
			return !isArray(latlngs[0]) || typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined';
		}

		function _flat(latlngs) {
			console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
			return isFlat(latlngs);
		}

		var LineUtil = (Object.freeze || Object)({
			simplify: simplify,
			pointToSegmentDistance: pointToSegmentDistance,
			closestPointOnSegment: closestPointOnSegment,
			clipSegment: clipSegment,
			_getEdgeIntersection: _getEdgeIntersection,
			_getBitCode: _getBitCode,
			_sqClosestPointOnSegment: _sqClosestPointOnSegment,
			isFlat: isFlat,
			_flat: _flat
		});

		/*
   * @namespace PolyUtil
   * Various utility functions for polygon geometries.
   */

		/* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
   * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgeman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
   * Used by Leaflet to only show polygon points that are on the screen or near, increasing
   * performance. Note that polygon points needs different algorithm for clipping
   * than polyline, so there's a seperate method for it.
   */
		function clipPolygon(points, bounds, round) {
			var clippedPoints,
			    edges = [1, 4, 2, 8],
			    i,
			    j,
			    k,
			    a,
			    b,
			    len,
			    edge,
			    p;

			for (i = 0, len = points.length; i < len; i++) {
				points[i]._code = _getBitCode(points[i], bounds);
			}

			// for each edge (left, bottom, right, top)
			for (k = 0; k < 4; k++) {
				edge = edges[k];
				clippedPoints = [];

				for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
					a = points[i];
					b = points[j];

					// if a is inside the clip window
					if (!(a._code & edge)) {
						// if b is outside the clip window (a->b goes out of screen)
						if (b._code & edge) {
							p = _getEdgeIntersection(b, a, edge, bounds, round);
							p._code = _getBitCode(p, bounds);
							clippedPoints.push(p);
						}
						clippedPoints.push(a);

						// else if b is inside the clip window (a->b enters the screen)
					} else if (!(b._code & edge)) {
						p = _getEdgeIntersection(b, a, edge, bounds, round);
						p._code = _getBitCode(p, bounds);
						clippedPoints.push(p);
					}
				}
				points = clippedPoints;
			}

			return points;
		}

		var PolyUtil = (Object.freeze || Object)({
			clipPolygon: clipPolygon
		});

		/*
   * @namespace Projection
   * @section
   * Leaflet comes with a set of already defined Projections out of the box:
   *
   * @projection L.Projection.LonLat
   *
   * Equirectangular, or Plate Carree projection — the most simple projection,
   * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
   * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
   * `EPSG:4326` and `Simple` CRS.
   */

		var LonLat = {
			project: function project(latlng) {
				return new Point(latlng.lng, latlng.lat);
			},

			unproject: function unproject(point) {
				return new LatLng(point.y, point.x);
			},

			bounds: new Bounds([-180, -90], [180, 90])
		};

		/*
   * @namespace Projection
   * @projection L.Projection.Mercator
   *
   * Elliptical Mercator projection — more complex than Spherical Mercator. Takes into account that Earth is a geoid, not a perfect sphere. Used by the EPSG:3395 CRS.
   */

		var Mercator = {
			R: 6378137,
			R_MINOR: 6356752.314245179,

			bounds: new Bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

			project: function project(latlng) {
				var d = Math.PI / 180,
				    r = this.R,
				    y = latlng.lat * d,
				    tmp = this.R_MINOR / r,
				    e = Math.sqrt(1 - tmp * tmp),
				    con = e * Math.sin(y);

				var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
				y = -r * Math.log(Math.max(ts, 1E-10));

				return new Point(latlng.lng * d * r, y);
			},

			unproject: function unproject(point) {
				var d = 180 / Math.PI,
				    r = this.R,
				    tmp = this.R_MINOR / r,
				    e = Math.sqrt(1 - tmp * tmp),
				    ts = Math.exp(-point.y / r),
				    phi = Math.PI / 2 - 2 * Math.atan(ts);

				for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
					con = e * Math.sin(phi);
					con = Math.pow((1 - con) / (1 + con), e / 2);
					dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
					phi += dphi;
				}

				return new LatLng(phi * d, point.x * d / r);
			}
		};

		/*
   * @class Projection
  
   * An object with methods for projecting geographical coordinates of the world onto
   * a flat surface (and back). See [Map projection](http://en.wikipedia.org/wiki/Map_projection).
  
   * @property bounds: Bounds
   * The bounds (specified in CRS units) where the projection is valid
  
   * @method project(latlng: LatLng): Point
   * Projects geographical coordinates into a 2D point.
   * Only accepts actual `L.LatLng` instances, not arrays.
  
   * @method unproject(point: Point): LatLng
   * The inverse of `project`. Projects a 2D point into a geographical location.
   * Only accepts actual `L.Point` instances, not arrays.
  
   */

		var index = (Object.freeze || Object)({
			LonLat: LonLat,
			Mercator: Mercator,
			SphericalMercator: SphericalMercator
		});

		/*
   * @namespace CRS
   * @crs L.CRS.EPSG3395
   *
   * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
   */
		var EPSG3395 = extend({}, Earth, {
			code: 'EPSG:3395',
			projection: Mercator,

			transformation: function () {
				var scale = 0.5 / (Math.PI * Mercator.R);
				return toTransformation(scale, 0.5, -scale, 0.5);
			}()
		});

		/*
   * @namespace CRS
   * @crs L.CRS.EPSG4326
   *
   * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
   *
   * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
   * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
   * with this CRS, ensure that there are two 256x256 pixel tiles covering the
   * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
   * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
   */

		var EPSG4326 = extend({}, Earth, {
			code: 'EPSG:4326',
			projection: LonLat,
			transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
		});

		/*
   * @namespace CRS
   * @crs L.CRS.Simple
   *
   * A simple CRS that maps longitude and latitude into `x` and `y` directly.
   * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
   * axis should still be inverted (going from bottom to top). `distance()` returns
   * simple euclidean distance.
   */

		var Simple = extend({}, CRS, {
			projection: LonLat,
			transformation: toTransformation(1, 0, -1, 0),

			scale: function scale(zoom) {
				return Math.pow(2, zoom);
			},

			zoom: function zoom(scale) {
				return Math.log(scale) / Math.LN2;
			},

			distance: function distance(latlng1, latlng2) {
				var dx = latlng2.lng - latlng1.lng,
				    dy = latlng2.lat - latlng1.lat;

				return Math.sqrt(dx * dx + dy * dy);
			},

			infinite: true
		});

		CRS.Earth = Earth;
		CRS.EPSG3395 = EPSG3395;
		CRS.EPSG3857 = EPSG3857;
		CRS.EPSG900913 = EPSG900913;
		CRS.EPSG4326 = EPSG4326;
		CRS.Simple = Simple;

		/*
   * @class Layer
   * @inherits Evented
   * @aka L.Layer
   * @aka ILayer
   *
   * A set of methods from the Layer base class that all Leaflet layers use.
   * Inherits all methods, options and events from `L.Evented`.
   *
   * @example
   *
   * ```js
   * var layer = L.Marker(latlng).addTo(map);
   * layer.addTo(map);
   * layer.remove();
   * ```
   *
   * @event add: Event
   * Fired after the layer is added to a map
   *
   * @event remove: Event
   * Fired after the layer is removed from a map
   */

		var Layer = Evented.extend({

			// Classes extending `L.Layer` will inherit the following options:
			options: {
				// @option pane: String = 'overlayPane'
				// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
				pane: 'overlayPane',

				// @option attribution: String = null
				// String to be shown in the attribution control, describes the layer data, e.g. "© Mapbox".
				attribution: null,

				bubblingMouseEvents: true
			},

			/* @section
    * Classes extending `L.Layer` will inherit the following methods:
    *
    * @method addTo(map: Map|LayerGroup): this
    * Adds the layer to the given map or layer group.
    */
			addTo: function addTo(map) {
				map.addLayer(this);
				return this;
			},

			// @method remove: this
			// Removes the layer from the map it is currently active on.
			remove: function remove() {
				return this.removeFrom(this._map || this._mapToAdd);
			},

			// @method removeFrom(map: Map): this
			// Removes the layer from the given map
			removeFrom: function removeFrom(obj) {
				if (obj) {
					obj.removeLayer(this);
				}
				return this;
			},

			// @method getPane(name? : String): HTMLElement
			// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
			getPane: function getPane(name) {
				return this._map.getPane(name ? this.options[name] || name : this.options.pane);
			},

			addInteractiveTarget: function addInteractiveTarget(targetEl) {
				this._map._targets[stamp(targetEl)] = this;
				return this;
			},

			removeInteractiveTarget: function removeInteractiveTarget(targetEl) {
				delete this._map._targets[stamp(targetEl)];
				return this;
			},

			// @method getAttribution: String
			// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
			getAttribution: function getAttribution() {
				return this.options.attribution;
			},

			_layerAdd: function _layerAdd(e) {
				var map = e.target;

				// check in case layer gets added and then removed before the map is ready
				if (!map.hasLayer(this)) {
					return;
				}

				this._map = map;
				this._zoomAnimated = map._zoomAnimated;

				if (this.getEvents) {
					var events = this.getEvents();
					map.on(events, this);
					this.once('remove', function () {
						map.off(events, this);
					}, this);
				}

				this.onAdd(map);

				if (this.getAttribution && map.attributionControl) {
					map.attributionControl.addAttribution(this.getAttribution());
				}

				this.fire('add');
				map.fire('layeradd', { layer: this });
			}
		});

		/* @section Extension methods
   * @uninheritable
   *
   * Every layer should extend from `L.Layer` and (re-)implement the following methods.
   *
   * @method onAdd(map: Map): this
   * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
   *
   * @method onRemove(map: Map): this
   * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
   *
   * @method getEvents(): Object
   * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
   *
   * @method getAttribution(): String
   * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
   *
   * @method beforeAdd(map: Map): this
   * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
   */

		/* @namespace Map
   * @section Layer events
   *
   * @event layeradd: LayerEvent
   * Fired when a new layer is added to the map.
   *
   * @event layerremove: LayerEvent
   * Fired when some layer is removed from the map
   *
   * @section Methods for Layers and Controls
   */
		Map.include({
			// @method addLayer(layer: Layer): this
			// Adds the given layer to the map
			addLayer: function addLayer(layer) {
				if (!layer._layerAdd) {
					throw new Error('The provided object is not a Layer.');
				}

				var id = stamp(layer);
				if (this._layers[id]) {
					return this;
				}
				this._layers[id] = layer;

				layer._mapToAdd = this;

				if (layer.beforeAdd) {
					layer.beforeAdd(this);
				}

				this.whenReady(layer._layerAdd, layer);

				return this;
			},

			// @method removeLayer(layer: Layer): this
			// Removes the given layer from the map.
			removeLayer: function removeLayer(layer) {
				var id = stamp(layer);

				if (!this._layers[id]) {
					return this;
				}

				if (this._loaded) {
					layer.onRemove(this);
				}

				if (layer.getAttribution && this.attributionControl) {
					this.attributionControl.removeAttribution(layer.getAttribution());
				}

				delete this._layers[id];

				if (this._loaded) {
					this.fire('layerremove', { layer: layer });
					layer.fire('remove');
				}

				layer._map = layer._mapToAdd = null;

				return this;
			},

			// @method hasLayer(layer: Layer): Boolean
			// Returns `true` if the given layer is currently added to the map
			hasLayer: function hasLayer(layer) {
				return !!layer && stamp(layer) in this._layers;
			},

			/* @method eachLayer(fn: Function, context?: Object): this
    * Iterates over the layers of the map, optionally specifying context of the iterator function.
    * ```
    * map.eachLayer(function(layer){
    *     layer.bindPopup('Hello');
    * });
    * ```
    */
			eachLayer: function eachLayer(method, context) {
				for (var i in this._layers) {
					method.call(context, this._layers[i]);
				}
				return this;
			},

			_addLayers: function _addLayers(layers) {
				layers = layers ? isArray(layers) ? layers : [layers] : [];

				for (var i = 0, len = layers.length; i < len; i++) {
					this.addLayer(layers[i]);
				}
			},

			_addZoomLimit: function _addZoomLimit(layer) {
				if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
					this._zoomBoundLayers[stamp(layer)] = layer;
					this._updateZoomLevels();
				}
			},

			_removeZoomLimit: function _removeZoomLimit(layer) {
				var id = stamp(layer);

				if (this._zoomBoundLayers[id]) {
					delete this._zoomBoundLayers[id];
					this._updateZoomLevels();
				}
			},

			_updateZoomLevels: function _updateZoomLevels() {
				var minZoom = Infinity,
				    maxZoom = -Infinity,
				    oldZoomSpan = this._getZoomSpan();

				for (var i in this._zoomBoundLayers) {
					var options = this._zoomBoundLayers[i].options;

					minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
					maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
				}

				this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
				this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

				// @section Map state change events
				// @event zoomlevelschange: Event
				// Fired when the number of zoomlevels on the map is changed due
				// to adding or removing a layer.
				if (oldZoomSpan !== this._getZoomSpan()) {
					this.fire('zoomlevelschange');
				}

				if (this.options.maxZoom === undefined && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
					this.setZoom(this._layersMaxZoom);
				}
				if (this.options.minZoom === undefined && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
					this.setZoom(this._layersMinZoom);
				}
			}
		});

		/*
   * @class LayerGroup
   * @aka L.LayerGroup
   * @inherits Layer
   *
   * Used to group several layers and handle them as one. If you add it to the map,
   * any layers added or removed from the group will be added/removed on the map as
   * well. Extends `Layer`.
   *
   * @example
   *
   * ```js
   * L.layerGroup([marker1, marker2])
   * 	.addLayer(polyline)
   * 	.addTo(map);
   * ```
   */

		var LayerGroup = Layer.extend({

			initialize: function initialize(layers) {
				this._layers = {};

				var i, len;

				if (layers) {
					for (i = 0, len = layers.length; i < len; i++) {
						this.addLayer(layers[i]);
					}
				}
			},

			// @method addLayer(layer: Layer): this
			// Adds the given layer to the group.
			addLayer: function addLayer(layer) {
				var id = this.getLayerId(layer);

				this._layers[id] = layer;

				if (this._map) {
					this._map.addLayer(layer);
				}

				return this;
			},

			// @method removeLayer(layer: Layer): this
			// Removes the given layer from the group.
			// @alternative
			// @method removeLayer(id: Number): this
			// Removes the layer with the given internal ID from the group.
			removeLayer: function removeLayer(layer) {
				var id = layer in this._layers ? layer : this.getLayerId(layer);

				if (this._map && this._layers[id]) {
					this._map.removeLayer(this._layers[id]);
				}

				delete this._layers[id];

				return this;
			},

			// @method hasLayer(layer: Layer): Boolean
			// Returns `true` if the given layer is currently added to the group.
			// @alternative
			// @method hasLayer(id: Number): Boolean
			// Returns `true` if the given internal ID is currently added to the group.
			hasLayer: function hasLayer(layer) {
				return !!layer && (layer in this._layers || this.getLayerId(layer) in this._layers);
			},

			// @method clearLayers(): this
			// Removes all the layers from the group.
			clearLayers: function clearLayers() {
				for (var i in this._layers) {
					this.removeLayer(this._layers[i]);
				}
				return this;
			},

			// @method invoke(methodName: String, …): this
			// Calls `methodName` on every layer contained in this group, passing any
			// additional parameters. Has no effect if the layers contained do not
			// implement `methodName`.
			invoke: function invoke(methodName) {
				var args = Array.prototype.slice.call(arguments, 1),
				    i,
				    layer;

				for (i in this._layers) {
					layer = this._layers[i];

					if (layer[methodName]) {
						layer[methodName].apply(layer, args);
					}
				}

				return this;
			},

			onAdd: function onAdd(map) {
				for (var i in this._layers) {
					map.addLayer(this._layers[i]);
				}
			},

			onRemove: function onRemove(map) {
				for (var i in this._layers) {
					map.removeLayer(this._layers[i]);
				}
			},

			// @method eachLayer(fn: Function, context?: Object): this
			// Iterates over the layers of the group, optionally specifying context of the iterator function.
			// ```js
			// group.eachLayer(function (layer) {
			// 	layer.bindPopup('Hello');
			// });
			// ```
			eachLayer: function eachLayer(method, context) {
				for (var i in this._layers) {
					method.call(context, this._layers[i]);
				}
				return this;
			},

			// @method getLayer(id: Number): Layer
			// Returns the layer with the given internal ID.
			getLayer: function getLayer(id) {
				return this._layers[id];
			},

			// @method getLayers(): Layer[]
			// Returns an array of all the layers added to the group.
			getLayers: function getLayers() {
				var layers = [];

				for (var i in this._layers) {
					layers.push(this._layers[i]);
				}
				return layers;
			},

			// @method setZIndex(zIndex: Number): this
			// Calls `setZIndex` on every layer contained in this group, passing the z-index.
			setZIndex: function setZIndex(zIndex) {
				return this.invoke('setZIndex', zIndex);
			},

			// @method getLayerId(layer: Layer): Number
			// Returns the internal ID for a layer
			getLayerId: function getLayerId(layer) {
				return stamp(layer);
			}
		});

		// @factory L.layerGroup(layers?: Layer[])
		// Create a layer group, optionally given an initial set of layers.
		var layerGroup = function layerGroup(layers) {
			return new LayerGroup(layers);
		};

		/*
   * @class FeatureGroup
   * @aka L.FeatureGroup
   * @inherits LayerGroup
   *
   * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
   *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
   *  * Events are propagated to the `FeatureGroup`, so if the group has an event
   * handler, it will handle events from any of the layers. This includes mouse events
   * and custom events.
   *  * Has `layeradd` and `layerremove` events
   *
   * @example
   *
   * ```js
   * L.featureGroup([marker1, marker2, polyline])
   * 	.bindPopup('Hello world!')
   * 	.on('click', function() { alert('Clicked on a member of the group!'); })
   * 	.addTo(map);
   * ```
   */

		var FeatureGroup = LayerGroup.extend({

			addLayer: function addLayer(layer) {
				if (this.hasLayer(layer)) {
					return this;
				}

				layer.addEventParent(this);

				LayerGroup.prototype.addLayer.call(this, layer);

				// @event layeradd: LayerEvent
				// Fired when a layer is added to this `FeatureGroup`
				return this.fire('layeradd', { layer: layer });
			},

			removeLayer: function removeLayer(layer) {
				if (!this.hasLayer(layer)) {
					return this;
				}
				if (layer in this._layers) {
					layer = this._layers[layer];
				}

				layer.removeEventParent(this);

				LayerGroup.prototype.removeLayer.call(this, layer);

				// @event layerremove: LayerEvent
				// Fired when a layer is removed from this `FeatureGroup`
				return this.fire('layerremove', { layer: layer });
			},

			// @method setStyle(style: Path options): this
			// Sets the given path options to each layer of the group that has a `setStyle` method.
			setStyle: function setStyle(style) {
				return this.invoke('setStyle', style);
			},

			// @method bringToFront(): this
			// Brings the layer group to the top of all other layers
			bringToFront: function bringToFront() {
				return this.invoke('bringToFront');
			},

			// @method bringToBack(): this
			// Brings the layer group to the top of all other layers
			bringToBack: function bringToBack() {
				return this.invoke('bringToBack');
			},

			// @method getBounds(): LatLngBounds
			// Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
			getBounds: function getBounds() {
				var bounds = new LatLngBounds();

				for (var id in this._layers) {
					var layer = this._layers[id];
					bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
				}
				return bounds;
			}
		});

		// @factory L.featureGroup(layers: Layer[])
		// Create a feature group, optionally given an initial set of layers.
		var featureGroup = function featureGroup(layers) {
			return new FeatureGroup(layers);
		};

		/*
   * @class Icon
   * @aka L.Icon
   *
   * Represents an icon to provide when creating a marker.
   *
   * @example
   *
   * ```js
   * var myIcon = L.icon({
   *     iconUrl: 'my-icon.png',
   *     iconRetinaUrl: 'my-icon@2x.png',
   *     iconSize: [38, 95],
   *     iconAnchor: [22, 94],
   *     popupAnchor: [-3, -76],
   *     shadowUrl: 'my-icon-shadow.png',
   *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
   *     shadowSize: [68, 95],
   *     shadowAnchor: [22, 94]
   * });
   *
   * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
   * ```
   *
   * `L.Icon.Default` extends `L.Icon` and is the blue icon Leaflet uses for markers by default.
   *
   */

		var Icon = Class.extend({

			/* @section
    * @aka Icon options
    *
    * @option iconUrl: String = null
    * **(required)** The URL to the icon image (absolute or relative to your script path).
    *
    * @option iconRetinaUrl: String = null
    * The URL to a retina sized version of the icon image (absolute or relative to your
    * script path). Used for Retina screen devices.
    *
    * @option iconSize: Point = null
    * Size of the icon image in pixels.
    *
    * @option iconAnchor: Point = null
    * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
    * will be aligned so that this point is at the marker's geographical location. Centered
    * by default if size is specified, also can be set in CSS with negative margins.
    *
    * @option popupAnchor: Point = null
    * The coordinates of the point from which popups will "open", relative to the icon anchor.
    *
    * @option shadowUrl: String = null
    * The URL to the icon shadow image. If not specified, no shadow image will be created.
    *
    * @option shadowRetinaUrl: String = null
    *
    * @option shadowSize: Point = null
    * Size of the shadow image in pixels.
    *
    * @option shadowAnchor: Point = null
    * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
    * as iconAnchor if not specified).
    *
    * @option className: String = ''
    * A custom class name to assign to both icon and shadow images. Empty by default.
    */

			initialize: function initialize(options) {
				setOptions(this, options);
			},

			// @method createIcon(oldIcon?: HTMLElement): HTMLElement
			// Called internally when the icon has to be shown, returns a `<img>` HTML element
			// styled according to the options.
			createIcon: function createIcon(oldIcon) {
				return this._createIcon('icon', oldIcon);
			},

			// @method createShadow(oldIcon?: HTMLElement): HTMLElement
			// As `createIcon`, but for the shadow beneath it.
			createShadow: function createShadow(oldIcon) {
				return this._createIcon('shadow', oldIcon);
			},

			_createIcon: function _createIcon(name, oldIcon) {
				var src = this._getIconUrl(name);

				if (!src) {
					if (name === 'icon') {
						throw new Error('iconUrl not set in Icon options (see the docs).');
					}
					return null;
				}

				var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
				this._setIconStyles(img, name);

				return img;
			},

			_setIconStyles: function _setIconStyles(img, name) {
				var options = this.options;
				var sizeOption = options[name + 'Size'];

				if (typeof sizeOption === 'number') {
					sizeOption = [sizeOption, sizeOption];
				}

				var size = toPoint(sizeOption),
				    anchor = toPoint(name === 'shadow' && options.shadowAnchor || options.iconAnchor || size && size.divideBy(2, true));

				img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

				if (anchor) {
					img.style.marginLeft = -anchor.x + 'px';
					img.style.marginTop = -anchor.y + 'px';
				}

				if (size) {
					img.style.width = size.x + 'px';
					img.style.height = size.y + 'px';
				}
			},

			_createImg: function _createImg(src, el) {
				el = el || document.createElement('img');
				el.src = src;
				return el;
			},

			_getIconUrl: function _getIconUrl(name) {
				return retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
			}
		});

		// @factory L.icon(options: Icon options)
		// Creates an icon instance with the given options.
		function icon(options) {
			return new Icon(options);
		}

		/*
   * @miniclass Icon.Default (Icon)
   * @aka L.Icon.Default
   * @section
   *
   * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
   * no icon is specified. Points to the blue marker image distributed with Leaflet
   * releases.
   *
   * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
   * (which is a set of `Icon options`).
   *
   * If you want to _completely_ replace the default icon, override the
   * `L.Marker.prototype.options.icon` with your own icon instead.
   */

		var IconDefault = Icon.extend({

			options: {
				iconUrl: 'marker-icon.png',
				iconRetinaUrl: 'marker-icon-2x.png',
				shadowUrl: 'marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				tooltipAnchor: [16, -28],
				shadowSize: [41, 41]
			},

			_getIconUrl: function _getIconUrl(name) {
				if (!IconDefault.imagePath) {
					// Deprecated, backwards-compatibility only
					IconDefault.imagePath = this._detectIconPath();
				}

				// @option imagePath: String
				// `Icon.Default` will try to auto-detect the absolute location of the
				// blue icon images. If you are placing these images in a non-standard
				// way, set this option to point to the right absolute path.
				return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
			},

			_detectIconPath: function _detectIconPath() {
				var el = create$1('div', 'leaflet-default-icon-path', document.body);
				var path = getStyle(el, 'background-image') || getStyle(el, 'backgroundImage'); // IE8

				document.body.removeChild(el);

				if (path === null || path.indexOf('url') !== 0) {
					path = '';
				} else {
					path = path.replace(/^url\([\"\']?/, '').replace(/marker-icon\.png[\"\']?\)$/, '');
				}

				return path;
			}
		});

		/*
   * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
   */

		/* @namespace Marker
   * @section Interaction handlers
   *
   * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
   *
   * ```js
   * marker.dragging.disable();
   * ```
   *
   * @property dragging: Handler
   * Marker dragging handler (by both mouse and touch). Only valid when the marker is on the map (Otherwise set [`marker.options.draggable`](#marker-draggable)).
   */

		var MarkerDrag = Handler.extend({
			initialize: function initialize(marker) {
				this._marker = marker;
			},

			addHooks: function addHooks() {
				var icon = this._marker._icon;

				if (!this._draggable) {
					this._draggable = new Draggable(icon, icon, true);
				}

				this._draggable.on({
					dragstart: this._onDragStart,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this).enable();

				addClass(icon, 'leaflet-marker-draggable');
			},

			removeHooks: function removeHooks() {
				this._draggable.off({
					dragstart: this._onDragStart,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this).disable();

				if (this._marker._icon) {
					removeClass(this._marker._icon, 'leaflet-marker-draggable');
				}
			},

			moved: function moved() {
				return this._draggable && this._draggable._moved;
			},

			_onDragStart: function _onDragStart() {
				// @section Dragging events
				// @event dragstart: Event
				// Fired when the user starts dragging the marker.

				// @event movestart: Event
				// Fired when the marker starts moving (because of dragging).

				this._oldLatLng = this._marker.getLatLng();
				this._marker.closePopup().fire('movestart').fire('dragstart');
			},

			_onDrag: function _onDrag(e) {
				var marker = this._marker,
				    shadow = marker._shadow,
				    iconPos = getPosition(marker._icon),
				    latlng = marker._map.layerPointToLatLng(iconPos);

				// update shadow position
				if (shadow) {
					setPosition(shadow, iconPos);
				}

				marker._latlng = latlng;
				e.latlng = latlng;
				e.oldLatLng = this._oldLatLng;

				// @event drag: Event
				// Fired repeatedly while the user drags the marker.
				marker.fire('move', e).fire('drag', e);
			},

			_onDragEnd: function _onDragEnd(e) {
				// @event dragend: DragEndEvent
				// Fired when the user stops dragging the marker.

				// @event moveend: Event
				// Fired when the marker stops moving (because of dragging).
				delete this._oldLatLng;
				this._marker.fire('moveend').fire('dragend', e);
			}
		});

		/*
   * @class Marker
   * @inherits Interactive layer
   * @aka L.Marker
   * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
   *
   * @example
   *
   * ```js
   * L.marker([50.5, 30.5]).addTo(map);
   * ```
   */

		var Marker = Layer.extend({

			// @section
			// @aka Marker options
			options: {
				// @option icon: Icon = *
				// Icon instance to use for rendering the marker.
				// See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
				// If not specified, a common instance of `L.Icon.Default` is used.
				icon: new IconDefault(),

				// Option inherited from "Interactive layer" abstract class
				interactive: true,

				// @option draggable: Boolean = false
				// Whether the marker is draggable with mouse/touch or not.
				draggable: false,

				// @option keyboard: Boolean = true
				// Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
				keyboard: true,

				// @option title: String = ''
				// Text for the browser tooltip that appear on marker hover (no tooltip by default).
				title: '',

				// @option alt: String = ''
				// Text for the `alt` attribute of the icon image (useful for accessibility).
				alt: '',

				// @option zIndexOffset: Number = 0
				// By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
				zIndexOffset: 0,

				// @option opacity: Number = 1.0
				// The opacity of the marker.
				opacity: 1,

				// @option riseOnHover: Boolean = false
				// If `true`, the marker will get on top of others when you hover the mouse over it.
				riseOnHover: false,

				// @option riseOffset: Number = 250
				// The z-index offset used for the `riseOnHover` feature.
				riseOffset: 250,

				// @option pane: String = 'markerPane'
				// `Map pane` where the markers icon will be added.
				pane: 'markerPane',

				// @option bubblingMouseEvents: Boolean = false
				// When `true`, a mouse event on this marker will trigger the same event on the map
				// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
				bubblingMouseEvents: false
			},

			/* @section
    *
    * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
    */

			initialize: function initialize(latlng, options) {
				setOptions(this, options);
				this._latlng = toLatLng(latlng);
			},

			onAdd: function onAdd(map) {
				this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

				if (this._zoomAnimated) {
					map.on('zoomanim', this._animateZoom, this);
				}

				this._initIcon();
				this.update();
			},

			onRemove: function onRemove(map) {
				if (this.dragging && this.dragging.enabled()) {
					this.options.draggable = true;
					this.dragging.removeHooks();
				}
				delete this.dragging;

				if (this._zoomAnimated) {
					map.off('zoomanim', this._animateZoom, this);
				}

				this._removeIcon();
				this._removeShadow();
			},

			getEvents: function getEvents() {
				return {
					zoom: this.update,
					viewreset: this.update
				};
			},

			// @method getLatLng: LatLng
			// Returns the current geographical position of the marker.
			getLatLng: function getLatLng() {
				return this._latlng;
			},

			// @method setLatLng(latlng: LatLng): this
			// Changes the marker position to the given point.
			setLatLng: function setLatLng(latlng) {
				var oldLatLng = this._latlng;
				this._latlng = toLatLng(latlng);
				this.update();

				// @event move: Event
				// Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
				return this.fire('move', { oldLatLng: oldLatLng, latlng: this._latlng });
			},

			// @method setZIndexOffset(offset: Number): this
			// Changes the [zIndex offset](#marker-zindexoffset) of the marker.
			setZIndexOffset: function setZIndexOffset(offset) {
				this.options.zIndexOffset = offset;
				return this.update();
			},

			// @method setIcon(icon: Icon): this
			// Changes the marker icon.
			setIcon: function setIcon(icon) {

				this.options.icon = icon;

				if (this._map) {
					this._initIcon();
					this.update();
				}

				if (this._popup) {
					this.bindPopup(this._popup, this._popup.options);
				}

				return this;
			},

			getElement: function getElement() {
				return this._icon;
			},

			update: function update() {

				if (this._icon) {
					var pos = this._map.latLngToLayerPoint(this._latlng).round();
					this._setPos(pos);
				}

				return this;
			},

			_initIcon: function _initIcon() {
				var options = this.options,
				    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

				var icon = options.icon.createIcon(this._icon),
				    addIcon = false;

				// if we're not reusing the icon, remove the old one and init new one
				if (icon !== this._icon) {
					if (this._icon) {
						this._removeIcon();
					}
					addIcon = true;

					if (options.title) {
						icon.title = options.title;
					}
					if (options.alt) {
						icon.alt = options.alt;
					}
				}

				addClass(icon, classToAdd);

				if (options.keyboard) {
					icon.tabIndex = '0';
				}

				this._icon = icon;

				if (options.riseOnHover) {
					this.on({
						mouseover: this._bringToFront,
						mouseout: this._resetZIndex
					});
				}

				var newShadow = options.icon.createShadow(this._shadow),
				    addShadow = false;

				if (newShadow !== this._shadow) {
					this._removeShadow();
					addShadow = true;
				}

				if (newShadow) {
					addClass(newShadow, classToAdd);
					newShadow.alt = '';
				}
				this._shadow = newShadow;

				if (options.opacity < 1) {
					this._updateOpacity();
				}

				if (addIcon) {
					this.getPane().appendChild(this._icon);
				}
				this._initInteraction();
				if (newShadow && addShadow) {
					this.getPane('shadowPane').appendChild(this._shadow);
				}
			},

			_removeIcon: function _removeIcon() {
				if (this.options.riseOnHover) {
					this.off({
						mouseover: this._bringToFront,
						mouseout: this._resetZIndex
					});
				}

				_remove(this._icon);
				this.removeInteractiveTarget(this._icon);

				this._icon = null;
			},

			_removeShadow: function _removeShadow() {
				if (this._shadow) {
					_remove(this._shadow);
				}
				this._shadow = null;
			},

			_setPos: function _setPos(pos) {
				setPosition(this._icon, pos);

				if (this._shadow) {
					setPosition(this._shadow, pos);
				}

				this._zIndex = pos.y + this.options.zIndexOffset;

				this._resetZIndex();
			},

			_updateZIndex: function _updateZIndex(offset) {
				this._icon.style.zIndex = this._zIndex + offset;
			},

			_animateZoom: function _animateZoom(opt) {
				var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

				this._setPos(pos);
			},

			_initInteraction: function _initInteraction() {

				if (!this.options.interactive) {
					return;
				}

				addClass(this._icon, 'leaflet-interactive');

				this.addInteractiveTarget(this._icon);

				if (MarkerDrag) {
					var draggable = this.options.draggable;
					if (this.dragging) {
						draggable = this.dragging.enabled();
						this.dragging.disable();
					}

					this.dragging = new MarkerDrag(this);

					if (draggable) {
						this.dragging.enable();
					}
				}
			},

			// @method setOpacity(opacity: Number): this
			// Changes the opacity of the marker.
			setOpacity: function setOpacity(opacity) {
				this.options.opacity = opacity;
				if (this._map) {
					this._updateOpacity();
				}

				return this;
			},

			_updateOpacity: function _updateOpacity() {
				var opacity = this.options.opacity;

				_setOpacity(this._icon, opacity);

				if (this._shadow) {
					_setOpacity(this._shadow, opacity);
				}
			},

			_bringToFront: function _bringToFront() {
				this._updateZIndex(this.options.riseOffset);
			},

			_resetZIndex: function _resetZIndex() {
				this._updateZIndex(0);
			},

			_getPopupAnchor: function _getPopupAnchor() {
				return this.options.icon.options.popupAnchor || [0, 0];
			},

			_getTooltipAnchor: function _getTooltipAnchor() {
				return this.options.icon.options.tooltipAnchor || [0, 0];
			}
		});

		// factory L.marker(latlng: LatLng, options? : Marker options)

		// @factory L.marker(latlng: LatLng, options? : Marker options)
		// Instantiates a Marker object given a geographical point and optionally an options object.
		function marker(latlng, options) {
			return new Marker(latlng, options);
		}

		/*
   * @class Path
   * @aka L.Path
   * @inherits Interactive layer
   *
   * An abstract class that contains options and constants shared between vector
   * overlays (Polygon, Polyline, Circle). Do not use it directly. Extends `Layer`.
   */

		var Path = Layer.extend({

			// @section
			// @aka Path options
			options: {
				// @option stroke: Boolean = true
				// Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
				stroke: true,

				// @option color: String = '#3388ff'
				// Stroke color
				color: '#3388ff',

				// @option weight: Number = 3
				// Stroke width in pixels
				weight: 3,

				// @option opacity: Number = 1.0
				// Stroke opacity
				opacity: 1,

				// @option lineCap: String= 'round'
				// A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
				lineCap: 'round',

				// @option lineJoin: String = 'round'
				// A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
				lineJoin: 'round',

				// @option dashArray: String = null
				// A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
				dashArray: null,

				// @option dashOffset: String = null
				// A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
				dashOffset: null,

				// @option fill: Boolean = depends
				// Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
				fill: false,

				// @option fillColor: String = *
				// Fill color. Defaults to the value of the [`color`](#path-color) option
				fillColor: null,

				// @option fillOpacity: Number = 0.2
				// Fill opacity.
				fillOpacity: 0.2,

				// @option fillRule: String = 'evenodd'
				// A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
				fillRule: 'evenodd',

				// className: '',

				// Option inherited from "Interactive layer" abstract class
				interactive: true,

				// @option bubblingMouseEvents: Boolean = true
				// When `true`, a mouse event on this path will trigger the same event on the map
				// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
				bubblingMouseEvents: true
			},

			beforeAdd: function beforeAdd(map) {
				// Renderer is set here because we need to call renderer.getEvents
				// before this.getEvents.
				this._renderer = map.getRenderer(this);
			},

			onAdd: function onAdd() {
				this._renderer._initPath(this);
				this._reset();
				this._renderer._addPath(this);
			},

			onRemove: function onRemove() {
				this._renderer._removePath(this);
			},

			// @method redraw(): this
			// Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
			redraw: function redraw() {
				if (this._map) {
					this._renderer._updatePath(this);
				}
				return this;
			},

			// @method setStyle(style: Path options): this
			// Changes the appearance of a Path based on the options in the `Path options` object.
			setStyle: function setStyle(style) {
				setOptions(this, style);
				if (this._renderer) {
					this._renderer._updateStyle(this);
				}
				return this;
			},

			// @method bringToFront(): this
			// Brings the layer to the top of all path layers.
			bringToFront: function bringToFront() {
				if (this._renderer) {
					this._renderer._bringToFront(this);
				}
				return this;
			},

			// @method bringToBack(): this
			// Brings the layer to the bottom of all path layers.
			bringToBack: function bringToBack() {
				if (this._renderer) {
					this._renderer._bringToBack(this);
				}
				return this;
			},

			getElement: function getElement() {
				return this._path;
			},

			_reset: function _reset() {
				// defined in child classes
				this._project();
				this._update();
			},

			_clickTolerance: function _clickTolerance() {
				// used when doing hit detection for Canvas layers
				return (this.options.stroke ? this.options.weight / 2 : 0) + (touch ? 10 : 0);
			}
		});

		/*
   * @class CircleMarker
   * @aka L.CircleMarker
   * @inherits Path
   *
   * A circle of a fixed size with radius specified in pixels. Extends `Path`.
   */

		var CircleMarker = Path.extend({

			// @section
			// @aka CircleMarker options
			options: {
				fill: true,

				// @option radius: Number = 10
				// Radius of the circle marker, in pixels
				radius: 10
			},

			initialize: function initialize(latlng, options) {
				setOptions(this, options);
				this._latlng = toLatLng(latlng);
				this._radius = this.options.radius;
			},

			// @method setLatLng(latLng: LatLng): this
			// Sets the position of a circle marker to a new location.
			setLatLng: function setLatLng(latlng) {
				this._latlng = toLatLng(latlng);
				this.redraw();
				return this.fire('move', { latlng: this._latlng });
			},

			// @method getLatLng(): LatLng
			// Returns the current geographical position of the circle marker
			getLatLng: function getLatLng() {
				return this._latlng;
			},

			// @method setRadius(radius: Number): this
			// Sets the radius of a circle marker. Units are in pixels.
			setRadius: function setRadius(radius) {
				this.options.radius = this._radius = radius;
				return this.redraw();
			},

			// @method getRadius(): Number
			// Returns the current radius of the circle
			getRadius: function getRadius() {
				return this._radius;
			},

			setStyle: function setStyle(options) {
				var radius = options && options.radius || this._radius;
				Path.prototype.setStyle.call(this, options);
				this.setRadius(radius);
				return this;
			},

			_project: function _project() {
				this._point = this._map.latLngToLayerPoint(this._latlng);
				this._updateBounds();
			},

			_updateBounds: function _updateBounds() {
				var r = this._radius,
				    r2 = this._radiusY || r,
				    w = this._clickTolerance(),
				    p = [r + w, r2 + w];
				this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
			},

			_update: function _update() {
				if (this._map) {
					this._updatePath();
				}
			},

			_updatePath: function _updatePath() {
				this._renderer._updateCircle(this);
			},

			_empty: function _empty() {
				return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
			},

			// Needed by the `Canvas` renderer for interactivity
			_containsPoint: function _containsPoint(p) {
				return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
			}
		});

		// @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
		// Instantiates a circle marker object given a geographical point, and an optional options object.
		function circleMarker(latlng, options) {
			return new CircleMarker(latlng, options);
		}

		/*
   * @class Circle
   * @aka L.Circle
   * @inherits CircleMarker
   *
   * A class for drawing circle overlays on a map. Extends `CircleMarker`.
   *
   * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
   *
   * @example
   *
   * ```js
   * L.circle([50.5, 30.5], {radius: 200}).addTo(map);
   * ```
   */

		var Circle = CircleMarker.extend({

			initialize: function initialize(latlng, options, legacyOptions) {
				if (typeof options === 'number') {
					// Backwards compatibility with 0.7.x factory (latlng, radius, options?)
					options = extend({}, legacyOptions, { radius: options });
				}
				setOptions(this, options);
				this._latlng = toLatLng(latlng);

				if (isNaN(this.options.radius)) {
					throw new Error('Circle radius cannot be NaN');
				}

				// @section
				// @aka Circle options
				// @option radius: Number; Radius of the circle, in meters.
				this._mRadius = this.options.radius;
			},

			// @method setRadius(radius: Number): this
			// Sets the radius of a circle. Units are in meters.
			setRadius: function setRadius(radius) {
				this._mRadius = radius;
				return this.redraw();
			},

			// @method getRadius(): Number
			// Returns the current radius of a circle. Units are in meters.
			getRadius: function getRadius() {
				return this._mRadius;
			},

			// @method getBounds(): LatLngBounds
			// Returns the `LatLngBounds` of the path.
			getBounds: function getBounds() {
				var half = [this._radius, this._radiusY || this._radius];

				return new LatLngBounds(this._map.layerPointToLatLng(this._point.subtract(half)), this._map.layerPointToLatLng(this._point.add(half)));
			},

			setStyle: Path.prototype.setStyle,

			_project: function _project() {

				var lng = this._latlng.lng,
				    lat = this._latlng.lat,
				    map = this._map,
				    crs = map.options.crs;

				if (crs.distance === Earth.distance) {
					var d = Math.PI / 180,
					    latR = this._mRadius / Earth.R / d,
					    top = map.project([lat + latR, lng]),
					    bottom = map.project([lat - latR, lng]),
					    p = top.add(bottom).divideBy(2),
					    lat2 = map.unproject(p).lat,
					    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) / (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

					if (isNaN(lngR) || lngR === 0) {
						lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
					}

					this._point = p.subtract(map.getPixelOrigin());
					this._radius = isNaN(lngR) ? 0 : Math.max(Math.round(p.x - map.project([lat2, lng - lngR]).x), 1);
					this._radiusY = Math.max(Math.round(p.y - top.y), 1);
				} else {
					var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

					this._point = map.latLngToLayerPoint(this._latlng);
					this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
				}

				this._updateBounds();
			}
		});

		// @factory L.circle(latlng: LatLng, options?: Circle options)
		// Instantiates a circle object given a geographical point, and an options object
		// which contains the circle radius.
		// @alternative
		// @factory L.circle(latlng: LatLng, radius: Number, options?: Circle options)
		// Obsolete way of instantiating a circle, for compatibility with 0.7.x code.
		// Do not use in new applications or plugins.
		function circle(latlng, options, legacyOptions) {
			return new Circle(latlng, options, legacyOptions);
		}

		/*
   * @class Polyline
   * @aka L.Polyline
   * @inherits Path
   *
   * A class for drawing polyline overlays on a map. Extends `Path`.
   *
   * @example
   *
   * ```js
   * // create a red polyline from an array of LatLng points
   * var latlngs = [
   * 	[45.51, -122.68],
   * 	[37.77, -122.43],
   * 	[34.04, -118.2]
   * ];
   *
   * var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
   *
   * // zoom the map to the polyline
   * map.fitBounds(polyline.getBounds());
   * ```
   *
   * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
   *
   * ```js
   * // create a red polyline from an array of arrays of LatLng points
   * var latlngs = [
   * 	[[45.51, -122.68],
   * 	 [37.77, -122.43],
   * 	 [34.04, -118.2]],
   * 	[[40.78, -73.91],
   * 	 [41.83, -87.62],
   * 	 [32.76, -96.72]]
   * ];
   * ```
   */

		var Polyline = Path.extend({

			// @section
			// @aka Polyline options
			options: {
				// @option smoothFactor: Number = 1.0
				// How much to simplify the polyline on each zoom level. More means
				// better performance and smoother look, and less means more accurate representation.
				smoothFactor: 1.0,

				// @option noClip: Boolean = false
				// Disable polyline clipping.
				noClip: false
			},

			initialize: function initialize(latlngs, options) {
				setOptions(this, options);
				this._setLatLngs(latlngs);
			},

			// @method getLatLngs(): LatLng[]
			// Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
			getLatLngs: function getLatLngs() {
				return this._latlngs;
			},

			// @method setLatLngs(latlngs: LatLng[]): this
			// Replaces all the points in the polyline with the given array of geographical points.
			setLatLngs: function setLatLngs(latlngs) {
				this._setLatLngs(latlngs);
				return this.redraw();
			},

			// @method isEmpty(): Boolean
			// Returns `true` if the Polyline has no LatLngs.
			isEmpty: function isEmpty() {
				return !this._latlngs.length;
			},

			closestLayerPoint: function closestLayerPoint(p) {
				var minDistance = Infinity,
				    minPoint = null,
				    closest = _sqClosestPointOnSegment,
				    p1,
				    p2;

				for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
					var points = this._parts[j];

					for (var i = 1, len = points.length; i < len; i++) {
						p1 = points[i - 1];
						p2 = points[i];

						var sqDist = closest(p, p1, p2, true);

						if (sqDist < minDistance) {
							minDistance = sqDist;
							minPoint = closest(p, p1, p2);
						}
					}
				}
				if (minPoint) {
					minPoint.distance = Math.sqrt(minDistance);
				}
				return minPoint;
			},

			// @method getCenter(): LatLng
			// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
			getCenter: function getCenter() {
				// throws error when not yet added to map as this center calculation requires projected coordinates
				if (!this._map) {
					throw new Error('Must add layer to map before using getCenter()');
				}

				var i,
				    halfDist,
				    segDist,
				    dist,
				    p1,
				    p2,
				    ratio,
				    points = this._rings[0],
				    len = points.length;

				if (!len) {
					return null;
				}

				// polyline centroid algorithm; only uses the first ring if there are multiple

				for (i = 0, halfDist = 0; i < len - 1; i++) {
					halfDist += points[i].distanceTo(points[i + 1]) / 2;
				}

				// The line is so small in the current view that all points are on the same pixel.
				if (halfDist === 0) {
					return this._map.layerPointToLatLng(points[0]);
				}

				for (i = 0, dist = 0; i < len - 1; i++) {
					p1 = points[i];
					p2 = points[i + 1];
					segDist = p1.distanceTo(p2);
					dist += segDist;

					if (dist > halfDist) {
						ratio = (dist - halfDist) / segDist;
						return this._map.layerPointToLatLng([p2.x - ratio * (p2.x - p1.x), p2.y - ratio * (p2.y - p1.y)]);
					}
				}
			},

			// @method getBounds(): LatLngBounds
			// Returns the `LatLngBounds` of the path.
			getBounds: function getBounds() {
				return this._bounds;
			},

			// @method addLatLng(latlng: LatLng, latlngs? LatLng[]): this
			// Adds a given point to the polyline. By default, adds to the first ring of
			// the polyline in case of a multi-polyline, but can be overridden by passing
			// a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
			addLatLng: function addLatLng(latlng, latlngs) {
				latlngs = latlngs || this._defaultShape();
				latlng = toLatLng(latlng);
				latlngs.push(latlng);
				this._bounds.extend(latlng);
				return this.redraw();
			},

			_setLatLngs: function _setLatLngs(latlngs) {
				this._bounds = new LatLngBounds();
				this._latlngs = this._convertLatLngs(latlngs);
			},

			_defaultShape: function _defaultShape() {
				return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
			},

			// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
			_convertLatLngs: function _convertLatLngs(latlngs) {
				var result = [],
				    flat = isFlat(latlngs);

				for (var i = 0, len = latlngs.length; i < len; i++) {
					if (flat) {
						result[i] = toLatLng(latlngs[i]);
						this._bounds.extend(result[i]);
					} else {
						result[i] = this._convertLatLngs(latlngs[i]);
					}
				}

				return result;
			},

			_project: function _project() {
				var pxBounds = new Bounds();
				this._rings = [];
				this._projectLatlngs(this._latlngs, this._rings, pxBounds);

				var w = this._clickTolerance(),
				    p = new Point(w, w);

				if (this._bounds.isValid() && pxBounds.isValid()) {
					pxBounds.min._subtract(p);
					pxBounds.max._add(p);
					this._pxBounds = pxBounds;
				}
			},

			// recursively turns latlngs into a set of rings with projected coordinates
			_projectLatlngs: function _projectLatlngs(latlngs, result, projectedBounds) {
				var flat = latlngs[0] instanceof LatLng,
				    len = latlngs.length,
				    i,
				    ring;

				if (flat) {
					ring = [];
					for (i = 0; i < len; i++) {
						ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
						projectedBounds.extend(ring[i]);
					}
					result.push(ring);
				} else {
					for (i = 0; i < len; i++) {
						this._projectLatlngs(latlngs[i], result, projectedBounds);
					}
				}
			},

			// clip polyline by renderer bounds so that we have less to render for performance
			_clipPoints: function _clipPoints() {
				var bounds = this._renderer._bounds;

				this._parts = [];
				if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
					return;
				}

				if (this.options.noClip) {
					this._parts = this._rings;
					return;
				}

				var parts = this._parts,
				    i,
				    j,
				    k,
				    len,
				    len2,
				    segment,
				    points;

				for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
					points = this._rings[i];

					for (j = 0, len2 = points.length; j < len2 - 1; j++) {
						segment = clipSegment(points[j], points[j + 1], bounds, j, true);

						if (!segment) {
							continue;
						}

						parts[k] = parts[k] || [];
						parts[k].push(segment[0]);

						// if segment goes out of screen, or it's the last one, it's the end of the line part
						if (segment[1] !== points[j + 1] || j === len2 - 2) {
							parts[k].push(segment[1]);
							k++;
						}
					}
				}
			},

			// simplify each clipped part of the polyline for performance
			_simplifyPoints: function _simplifyPoints() {
				var parts = this._parts,
				    tolerance = this.options.smoothFactor;

				for (var i = 0, len = parts.length; i < len; i++) {
					parts[i] = simplify(parts[i], tolerance);
				}
			},

			_update: function _update() {
				if (!this._map) {
					return;
				}

				this._clipPoints();
				this._simplifyPoints();
				this._updatePath();
			},

			_updatePath: function _updatePath() {
				this._renderer._updatePoly(this);
			},

			// Needed by the `Canvas` renderer for interactivity
			_containsPoint: function _containsPoint(p, closed) {
				var i,
				    j,
				    k,
				    len,
				    len2,
				    part,
				    w = this._clickTolerance();

				if (!this._pxBounds || !this._pxBounds.contains(p)) {
					return false;
				}

				// hit detection for polylines
				for (i = 0, len = this._parts.length; i < len; i++) {
					part = this._parts[i];

					for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
						if (!closed && j === 0) {
							continue;
						}

						if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
							return true;
						}
					}
				}
				return false;
			}
		});

		// @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
		// Instantiates a polyline object given an array of geographical points and
		// optionally an options object. You can create a `Polyline` object with
		// multiple separate lines (`MultiPolyline`) by passing an array of arrays
		// of geographic points.
		function polyline(latlngs, options) {
			return new Polyline(latlngs, options);
		}

		// Retrocompat. Allow plugins to support Leaflet versions before and after 1.1.
		Polyline._flat = _flat;

		/*
   * @class Polygon
   * @aka L.Polygon
   * @inherits Polyline
   *
   * A class for drawing polygon overlays on a map. Extends `Polyline`.
   *
   * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one — it's better to filter out such points.
   *
   *
   * @example
   *
   * ```js
   * // create a red polygon from an array of LatLng points
   * var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
   *
   * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
   *
   * // zoom the map to the polygon
   * map.fitBounds(polygon.getBounds());
   * ```
   *
   * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
   *
   * ```js
   * var latlngs = [
   *   [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
   *   [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
   * ];
   * ```
   *
   * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
   *
   * ```js
   * var latlngs = [
   *   [ // first polygon
   *     [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
   *     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
   *   ],
   *   [ // second polygon
   *     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
   *   ]
   * ];
   * ```
   */

		var Polygon = Polyline.extend({

			options: {
				fill: true
			},

			isEmpty: function isEmpty() {
				return !this._latlngs.length || !this._latlngs[0].length;
			},

			getCenter: function getCenter() {
				// throws error when not yet added to map as this center calculation requires projected coordinates
				if (!this._map) {
					throw new Error('Must add layer to map before using getCenter()');
				}

				var i,
				    j,
				    p1,
				    p2,
				    f,
				    area,
				    x,
				    y,
				    center,
				    points = this._rings[0],
				    len = points.length;

				if (!len) {
					return null;
				}

				// polygon centroid algorithm; only uses the first ring if there are multiple

				area = x = y = 0;

				for (i = 0, j = len - 1; i < len; j = i++) {
					p1 = points[i];
					p2 = points[j];

					f = p1.y * p2.x - p2.y * p1.x;
					x += (p1.x + p2.x) * f;
					y += (p1.y + p2.y) * f;
					area += f * 3;
				}

				if (area === 0) {
					// Polygon is so small that all points are on same pixel.
					center = points[0];
				} else {
					center = [x / area, y / area];
				}
				return this._map.layerPointToLatLng(center);
			},

			_convertLatLngs: function _convertLatLngs(latlngs) {
				var result = Polyline.prototype._convertLatLngs.call(this, latlngs),
				    len = result.length;

				// remove last point if it equals first one
				if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
					result.pop();
				}
				return result;
			},

			_setLatLngs: function _setLatLngs(latlngs) {
				Polyline.prototype._setLatLngs.call(this, latlngs);
				if (isFlat(this._latlngs)) {
					this._latlngs = [this._latlngs];
				}
			},

			_defaultShape: function _defaultShape() {
				return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
			},

			_clipPoints: function _clipPoints() {
				// polygons need a different clipping algorithm so we redefine that

				var bounds = this._renderer._bounds,
				    w = this.options.weight,
				    p = new Point(w, w);

				// increase clip padding by stroke width to avoid stroke on clip edges
				bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

				this._parts = [];
				if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
					return;
				}

				if (this.options.noClip) {
					this._parts = this._rings;
					return;
				}

				for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
					clipped = clipPolygon(this._rings[i], bounds, true);
					if (clipped.length) {
						this._parts.push(clipped);
					}
				}
			},

			_updatePath: function _updatePath() {
				this._renderer._updatePoly(this, true);
			},

			// Needed by the `Canvas` renderer for interactivity
			_containsPoint: function _containsPoint(p) {
				var inside = false,
				    part,
				    p1,
				    p2,
				    i,
				    j,
				    k,
				    len,
				    len2;

				if (!this._pxBounds.contains(p)) {
					return false;
				}

				// ray casting algorithm for detecting if point is in polygon
				for (i = 0, len = this._parts.length; i < len; i++) {
					part = this._parts[i];

					for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
						p1 = part[j];
						p2 = part[k];

						if (p1.y > p.y !== p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x) {
							inside = !inside;
						}
					}
				}

				// also check if it's on polygon stroke
				return inside || Polyline.prototype._containsPoint.call(this, p, true);
			}

		});

		// @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
		function polygon(latlngs, options) {
			return new Polygon(latlngs, options);
		}

		/*
   * @class GeoJSON
   * @aka L.GeoJSON
   * @inherits FeatureGroup
   *
   * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
   * GeoJSON data and display it on the map. Extends `FeatureGroup`.
   *
   * @example
   *
   * ```js
   * L.geoJSON(data, {
   * 	style: function (feature) {
   * 		return {color: feature.properties.color};
   * 	}
   * }).bindPopup(function (layer) {
   * 	return layer.feature.properties.description;
   * }).addTo(map);
   * ```
   */

		var GeoJSON = FeatureGroup.extend({

			/* @section
    * @aka GeoJSON options
    *
    * @option pointToLayer: Function = *
    * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
    * called when data is added, passing the GeoJSON point feature and its `LatLng`.
    * The default is to spawn a default `Marker`:
    * ```js
    * function(geoJsonPoint, latlng) {
    * 	return L.marker(latlng);
    * }
    * ```
    *
    * @option style: Function = *
    * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
    * called internally when data is added.
    * The default value is to not override any defaults:
    * ```js
    * function (geoJsonFeature) {
    * 	return {}
    * }
    * ```
    *
    * @option onEachFeature: Function = *
    * A `Function` that will be called once for each created `Feature`, after it has
    * been created and styled. Useful for attaching events and popups to features.
    * The default is to do nothing with the newly created layers:
    * ```js
    * function (feature, layer) {}
    * ```
    *
    * @option filter: Function = *
    * A `Function` that will be used to decide whether to include a feature or not.
    * The default is to include all features:
    * ```js
    * function (geoJsonFeature) {
    * 	return true;
    * }
    * ```
    * Note: dynamically changing the `filter` option will have effect only on newly
    * added data. It will _not_ re-evaluate already included features.
    *
    * @option coordsToLatLng: Function = *
    * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
    * The default is the `coordsToLatLng` static method.
    */

			initialize: function initialize(geojson, options) {
				setOptions(this, options);

				this._layers = {};

				if (geojson) {
					this.addData(geojson);
				}
			},

			// @method addData( <GeoJSON> data ): this
			// Adds a GeoJSON object to the layer.
			addData: function addData(geojson) {
				var features = isArray(geojson) ? geojson : geojson.features,
				    i,
				    len,
				    feature;

				if (features) {
					for (i = 0, len = features.length; i < len; i++) {
						// only add this if geometry or geometries are set and not null
						feature = features[i];
						if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
							this.addData(feature);
						}
					}
					return this;
				}

				var options = this.options;

				if (options.filter && !options.filter(geojson)) {
					return this;
				}

				var layer = geometryToLayer(geojson, options);
				if (!layer) {
					return this;
				}
				layer.feature = asFeature(geojson);

				layer.defaultOptions = layer.options;
				this.resetStyle(layer);

				if (options.onEachFeature) {
					options.onEachFeature(geojson, layer);
				}

				return this.addLayer(layer);
			},

			// @method resetStyle( <Path> layer ): this
			// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
			resetStyle: function resetStyle(layer) {
				// reset any custom styles
				layer.options = extend({}, layer.defaultOptions);
				this._setLayerStyle(layer, this.options.style);
				return this;
			},

			// @method setStyle( <Function> style ): this
			// Changes styles of GeoJSON vector layers with the given style function.
			setStyle: function setStyle(style) {
				return this.eachLayer(function (layer) {
					this._setLayerStyle(layer, style);
				}, this);
			},

			_setLayerStyle: function _setLayerStyle(layer, style) {
				if (typeof style === 'function') {
					style = style(layer.feature);
				}
				if (layer.setStyle) {
					layer.setStyle(style);
				}
			}
		});

		// @section
		// There are several static functions which can be called without instantiating L.GeoJSON:

		// @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
		// Creates a `Layer` from a given GeoJSON feature. Can use a custom
		// [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
		// functions if provided as options.
		function geometryToLayer(geojson, options) {

			var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
			    coords = geometry ? geometry.coordinates : null,
			    layers = [],
			    pointToLayer = options && options.pointToLayer,
			    _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng,
			    latlng,
			    latlngs,
			    i,
			    len;

			if (!coords && !geometry) {
				return null;
			}

			switch (geometry.type) {
				case 'Point':
					latlng = _coordsToLatLng(coords);
					return pointToLayer ? pointToLayer(geojson, latlng) : new Marker(latlng);

				case 'MultiPoint':
					for (i = 0, len = coords.length; i < len; i++) {
						latlng = _coordsToLatLng(coords[i]);
						layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new Marker(latlng));
					}
					return new FeatureGroup(layers);

				case 'LineString':
				case 'MultiLineString':
					latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
					return new Polyline(latlngs, options);

				case 'Polygon':
				case 'MultiPolygon':
					latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
					return new Polygon(latlngs, options);

				case 'GeometryCollection':
					for (i = 0, len = geometry.geometries.length; i < len; i++) {
						var layer = geometryToLayer({
							geometry: geometry.geometries[i],
							type: 'Feature',
							properties: geojson.properties
						}, options);

						if (layer) {
							layers.push(layer);
						}
					}
					return new FeatureGroup(layers);

				default:
					throw new Error('Invalid GeoJSON object.');
			}
		}

		// @function coordsToLatLng(coords: Array): LatLng
		// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
		// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
		function coordsToLatLng(coords) {
			return new LatLng(coords[1], coords[0], coords[2]);
		}

		// @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
		// Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
		// `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
		// Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
		function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
			var latlngs = [];

			for (var i = 0, len = coords.length, latlng; i < len; i++) {
				latlng = levelsDeep ? coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) : (_coordsToLatLng || coordsToLatLng)(coords[i]);

				latlngs.push(latlng);
			}

			return latlngs;
		}

		// @function latLngToCoords(latlng: LatLng, precision?: Number): Array
		// Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
		function latLngToCoords(latlng, precision) {
			precision = typeof precision === 'number' ? precision : 6;
			return latlng.alt !== undefined ? [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] : [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
		}

		// @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
		// Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
		// `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
		function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
			var coords = [];

			for (var i = 0, len = latlngs.length; i < len; i++) {
				coords.push(levelsDeep ? latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) : latLngToCoords(latlngs[i], precision));
			}

			if (!levelsDeep && closed) {
				coords.push(coords[0]);
			}

			return coords;
		}

		function getFeature(layer, newGeometry) {
			return layer.feature ? extend({}, layer.feature, { geometry: newGeometry }) : asFeature(newGeometry);
		}

		// @function asFeature(geojson: Object): Object
		// Normalize GeoJSON geometries/features into GeoJSON features.
		function asFeature(geojson) {
			if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
				return geojson;
			}

			return {
				type: 'Feature',
				properties: {},
				geometry: geojson
			};
		}

		var PointToGeoJSON = {
			toGeoJSON: function toGeoJSON(precision) {
				return getFeature(this, {
					type: 'Point',
					coordinates: latLngToCoords(this.getLatLng(), precision)
				});
			}
		};

		// @namespace Marker
		// @method toGeoJSON(): Object
		// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
		Marker.include(PointToGeoJSON);

		// @namespace CircleMarker
		// @method toGeoJSON(): Object
		// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
		Circle.include(PointToGeoJSON);
		CircleMarker.include(PointToGeoJSON);

		// @namespace Polyline
		// @method toGeoJSON(): Object
		// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
		Polyline.include({
			toGeoJSON: function toGeoJSON(precision) {
				var multi = !isFlat(this._latlngs);

				var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

				return getFeature(this, {
					type: (multi ? 'Multi' : '') + 'LineString',
					coordinates: coords
				});
			}
		});

		// @namespace Polygon
		// @method toGeoJSON(): Object
		// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
		Polygon.include({
			toGeoJSON: function toGeoJSON(precision) {
				var holes = !isFlat(this._latlngs),
				    multi = holes && !isFlat(this._latlngs[0]);

				var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

				if (!holes) {
					coords = [coords];
				}

				return getFeature(this, {
					type: (multi ? 'Multi' : '') + 'Polygon',
					coordinates: coords
				});
			}
		});

		// @namespace LayerGroup
		LayerGroup.include({
			toMultiPoint: function toMultiPoint(precision) {
				var coords = [];

				this.eachLayer(function (layer) {
					coords.push(layer.toGeoJSON(precision).geometry.coordinates);
				});

				return getFeature(this, {
					type: 'MultiPoint',
					coordinates: coords
				});
			},

			// @method toGeoJSON(): Object
			// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
			toGeoJSON: function toGeoJSON(precision) {

				var type = this.feature && this.feature.geometry && this.feature.geometry.type;

				if (type === 'MultiPoint') {
					return this.toMultiPoint(precision);
				}

				var isGeometryCollection = type === 'GeometryCollection',
				    jsons = [];

				this.eachLayer(function (layer) {
					if (layer.toGeoJSON) {
						var json = layer.toGeoJSON(precision);
						if (isGeometryCollection) {
							jsons.push(json.geometry);
						} else {
							var feature = asFeature(json);
							// Squash nested feature collections
							if (feature.type === 'FeatureCollection') {
								jsons.push.apply(jsons, feature.features);
							} else {
								jsons.push(feature);
							}
						}
					}
				});

				if (isGeometryCollection) {
					return getFeature(this, {
						geometries: jsons,
						type: 'GeometryCollection'
					});
				}

				return {
					type: 'FeatureCollection',
					features: jsons
				};
			}
		});

		// @namespace GeoJSON
		// @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
		// Creates a GeoJSON layer. Optionally accepts an object in
		// [GeoJSON format](http://geojson.org/geojson-spec.html) to display on the map
		// (you can alternatively add it later with `addData` method) and an `options` object.
		function geoJSON(geojson, options) {
			return new GeoJSON(geojson, options);
		}

		// Backward compatibility.
		var geoJson = geoJSON;

		/*
   * @class ImageOverlay
   * @aka L.ImageOverlay
   * @inherits Interactive layer
   *
   * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
   *
   * @example
   *
   * ```js
   * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
   * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
   * L.imageOverlay(imageUrl, imageBounds).addTo(map);
   * ```
   */

		var ImageOverlay = Layer.extend({

			// @section
			// @aka ImageOverlay options
			options: {
				// @option opacity: Number = 1.0
				// The opacity of the image overlay.
				opacity: 1,

				// @option alt: String = ''
				// Text for the `alt` attribute of the image (useful for accessibility).
				alt: '',

				// @option interactive: Boolean = false
				// If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
				interactive: false,

				// @option crossOrigin: Boolean = false
				// If true, the image will have its crossOrigin attribute set to ''. This is needed if you want to access image pixel data.
				crossOrigin: false,

				// @option errorOverlayUrl: String = ''
				// URL to the overlay image to show in place of the overlay that failed to load.
				errorOverlayUrl: '',

				// @option zIndex: Number = 1
				// The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the tile layer.
				zIndex: 1,

				// @option className: String = ''
				// A custom class name to assign to the image. Empty by default.
				className: ''
			},

			initialize: function initialize(url, bounds, options) {
				// (String, LatLngBounds, Object)
				this._url = url;
				this._bounds = toLatLngBounds(bounds);

				setOptions(this, options);
			},

			onAdd: function onAdd() {
				if (!this._image) {
					this._initImage();

					if (this.options.opacity < 1) {
						this._updateOpacity();
					}
				}

				if (this.options.interactive) {
					addClass(this._image, 'leaflet-interactive');
					this.addInteractiveTarget(this._image);
				}

				this.getPane().appendChild(this._image);
				this._reset();
			},

			onRemove: function onRemove() {
				_remove(this._image);
				if (this.options.interactive) {
					this.removeInteractiveTarget(this._image);
				}
			},

			// @method setOpacity(opacity: Number): this
			// Sets the opacity of the overlay.
			setOpacity: function setOpacity(opacity) {
				this.options.opacity = opacity;

				if (this._image) {
					this._updateOpacity();
				}
				return this;
			},

			setStyle: function setStyle(styleOpts) {
				if (styleOpts.opacity) {
					this.setOpacity(styleOpts.opacity);
				}
				return this;
			},

			// @method bringToFront(): this
			// Brings the layer to the top of all overlays.
			bringToFront: function bringToFront() {
				if (this._map) {
					toFront(this._image);
				}
				return this;
			},

			// @method bringToBack(): this
			// Brings the layer to the bottom of all overlays.
			bringToBack: function bringToBack() {
				if (this._map) {
					toBack(this._image);
				}
				return this;
			},

			// @method setUrl(url: String): this
			// Changes the URL of the image.
			setUrl: function setUrl(url) {
				this._url = url;

				if (this._image) {
					this._image.src = url;
				}
				return this;
			},

			// @method setBounds(bounds: LatLngBounds): this
			// Update the bounds that this ImageOverlay covers
			setBounds: function setBounds(bounds) {
				this._bounds = toLatLngBounds(bounds);

				if (this._map) {
					this._reset();
				}
				return this;
			},

			getEvents: function getEvents() {
				var events = {
					zoom: this._reset,
					viewreset: this._reset
				};

				if (this._zoomAnimated) {
					events.zoomanim = this._animateZoom;
				}

				return events;
			},

			// @method: setZIndex(value: Number) : this
			// Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
			setZIndex: function setZIndex(value) {
				this.options.zIndex = value;
				this._updateZIndex();
				return this;
			},

			// @method getBounds(): LatLngBounds
			// Get the bounds that this ImageOverlay covers
			getBounds: function getBounds() {
				return this._bounds;
			},

			// @method getElement(): HTMLElement
			// Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
			// used by this overlay.
			getElement: function getElement() {
				return this._image;
			},

			_initImage: function _initImage() {
				var img = this._image = create$1('img', 'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : '') + (this.options.className || ''));

				img.onselectstart = falseFn;
				img.onmousemove = falseFn;

				// @event load: Event
				// Fired when the ImageOverlay layer has loaded its image
				img.onload = bind(this.fire, this, 'load');
				img.onerror = bind(this._overlayOnError, this, 'error');

				if (this.options.crossOrigin) {
					img.crossOrigin = '';
				}

				if (this.options.zIndex) {
					this._updateZIndex();
				}

				img.src = this._url;
				img.alt = this.options.alt;
			},

			_animateZoom: function _animateZoom(e) {
				var scale = this._map.getZoomScale(e.zoom),
				    offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;

				setTransform(this._image, offset, scale);
			},

			_reset: function _reset() {
				var image = this._image,
				    bounds = new Bounds(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
				    size = bounds.getSize();

				setPosition(image, bounds.min);

				image.style.width = size.x + 'px';
				image.style.height = size.y + 'px';
			},

			_updateOpacity: function _updateOpacity() {
				_setOpacity(this._image, this.options.opacity);
			},

			_updateZIndex: function _updateZIndex() {
				if (this._image && this.options.zIndex !== undefined && this.options.zIndex !== null) {
					this._image.style.zIndex = this.options.zIndex;
				}
			},

			_overlayOnError: function _overlayOnError() {
				// @event error: Event
				// Fired when the ImageOverlay layer has loaded its image
				this.fire('error');

				var errorUrl = this.options.errorOverlayUrl;
				if (errorUrl && this._url !== errorUrl) {
					this._url = errorUrl;
					this._image.src = errorUrl;
				}
			}
		});

		// @factory L.imageOverlay(imageUrl: String, bounds: LatLngBounds, options?: ImageOverlay options)
		// Instantiates an image overlay object given the URL of the image and the
		// geographical bounds it is tied to.
		var imageOverlay = function imageOverlay(url, bounds, options) {
			return new ImageOverlay(url, bounds, options);
		};

		/*
   * @class VideoOverlay
   * @aka L.VideoOverlay
   * @inherits ImageOverlay
   *
   * Used to load and display a video player over specific bounds of the map. Extends `ImageOverlay`.
   *
   * A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)
   * HTML5 element.
   *
   * @example
   *
   * ```js
   * var videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
   * 	videoBounds = [[ 32, -130], [ 13, -100]];
   * L.VideoOverlay(videoUrl, videoBounds ).addTo(map);
   * ```
   */

		var VideoOverlay = ImageOverlay.extend({

			// @section
			// @aka VideoOverlay options
			options: {
				// @option autoplay: Boolean = true
				// Whether the video starts playing automatically when loaded.
				autoplay: true,

				// @option loop: Boolean = true
				// Whether the video will loop back to the beginning when played.
				loop: true
			},

			_initImage: function _initImage() {
				var wasElementSupplied = this._url.tagName === 'VIDEO';
				var vid = this._image = wasElementSupplied ? this._url : create$1('video');

				vid.class = vid.class || '';
				vid.class += 'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : '');

				vid.onselectstart = falseFn;
				vid.onmousemove = falseFn;

				// @event load: Event
				// Fired when the video has finished loading the first frame
				vid.onloadeddata = bind(this.fire, this, 'load');

				if (wasElementSupplied) {
					return;
				}

				if (!isArray(this._url)) {
					this._url = [this._url];
				}

				vid.autoplay = !!this.options.autoplay;
				vid.loop = !!this.options.loop;
				for (var i = 0; i < this._url.length; i++) {
					var source = create$1('source');
					source.src = this._url[i];
					vid.appendChild(source);
				}
			}

			// @method getElement(): HTMLVideoElement
			// Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
			// used by this overlay.
		});

		// @factory L.videoOverlay(video: String|Array|HTMLVideoElement, bounds: LatLngBounds, options?: VideoOverlay options)
		// Instantiates an image overlay object given the URL of the video (or array of URLs, or even a video element) and the
		// geographical bounds it is tied to.

		function videoOverlay(video, bounds, options) {
			return new VideoOverlay(video, bounds, options);
		}

		/*
   * @class DivOverlay
   * @inherits Layer
   * @aka L.DivOverlay
   * Base model for L.Popup and L.Tooltip. Inherit from it for custom popup like plugins.
   */

		// @namespace DivOverlay
		var DivOverlay = Layer.extend({

			// @section
			// @aka DivOverlay options
			options: {
				// @option offset: Point = Point(0, 7)
				// The offset of the popup position. Useful to control the anchor
				// of the popup when opening it on some overlays.
				offset: [0, 7],

				// @option className: String = ''
				// A custom CSS class name to assign to the popup.
				className: '',

				// @option pane: String = 'popupPane'
				// `Map pane` where the popup will be added.
				pane: 'popupPane'
			},

			initialize: function initialize(options, source) {
				setOptions(this, options);

				this._source = source;
			},

			onAdd: function onAdd(map) {
				this._zoomAnimated = map._zoomAnimated;

				if (!this._container) {
					this._initLayout();
				}

				if (map._fadeAnimated) {
					_setOpacity(this._container, 0);
				}

				clearTimeout(this._removeTimeout);
				this.getPane().appendChild(this._container);
				this.update();

				if (map._fadeAnimated) {
					_setOpacity(this._container, 1);
				}

				this.bringToFront();
			},

			onRemove: function onRemove(map) {
				if (map._fadeAnimated) {
					_setOpacity(this._container, 0);
					this._removeTimeout = setTimeout(bind(_remove, undefined, this._container), 200);
				} else {
					_remove(this._container);
				}
			},

			// @namespace Popup
			// @method getLatLng: LatLng
			// Returns the geographical point of popup.
			getLatLng: function getLatLng() {
				return this._latlng;
			},

			// @method setLatLng(latlng: LatLng): this
			// Sets the geographical point where the popup will open.
			setLatLng: function setLatLng(latlng) {
				this._latlng = toLatLng(latlng);
				if (this._map) {
					this._updatePosition();
					this._adjustPan();
				}
				return this;
			},

			// @method getContent: String|HTMLElement
			// Returns the content of the popup.
			getContent: function getContent() {
				return this._content;
			},

			// @method setContent(htmlContent: String|HTMLElement|Function): this
			// Sets the HTML content of the popup. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the popup.
			setContent: function setContent(content) {
				this._content = content;
				this.update();
				return this;
			},

			// @method getElement: String|HTMLElement
			// Alias for [getContent()](#popup-getcontent)
			getElement: function getElement() {
				return this._container;
			},

			// @method update: null
			// Updates the popup content, layout and position. Useful for updating the popup after something inside changed, e.g. image loaded.
			update: function update() {
				if (!this._map) {
					return;
				}

				this._container.style.visibility = 'hidden';

				this._updateContent();
				this._updateLayout();
				this._updatePosition();

				this._container.style.visibility = '';

				this._adjustPan();
			},

			getEvents: function getEvents() {
				var events = {
					zoom: this._updatePosition,
					viewreset: this._updatePosition
				};

				if (this._zoomAnimated) {
					events.zoomanim = this._animateZoom;
				}
				return events;
			},

			// @method isOpen: Boolean
			// Returns `true` when the popup is visible on the map.
			isOpen: function isOpen() {
				return !!this._map && this._map.hasLayer(this);
			},

			// @method bringToFront: this
			// Brings this popup in front of other popups (in the same map pane).
			bringToFront: function bringToFront() {
				if (this._map) {
					toFront(this._container);
				}
				return this;
			},

			// @method bringToBack: this
			// Brings this popup to the back of other popups (in the same map pane).
			bringToBack: function bringToBack() {
				if (this._map) {
					toBack(this._container);
				}
				return this;
			},

			_updateContent: function _updateContent() {
				if (!this._content) {
					return;
				}

				var node = this._contentNode;
				var content = typeof this._content === 'function' ? this._content(this._source || this) : this._content;

				if (typeof content === 'string') {
					node.innerHTML = content;
				} else {
					while (node.hasChildNodes()) {
						node.removeChild(node.firstChild);
					}
					node.appendChild(content);
				}
				this.fire('contentupdate');
			},

			_updatePosition: function _updatePosition() {
				if (!this._map) {
					return;
				}

				var pos = this._map.latLngToLayerPoint(this._latlng),
				    offset = toPoint(this.options.offset),
				    anchor = this._getAnchor();

				if (this._zoomAnimated) {
					setPosition(this._container, pos.add(anchor));
				} else {
					offset = offset.add(pos).add(anchor);
				}

				var bottom = this._containerBottom = -offset.y,
				    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

				// bottom position the popup in case the height of the popup changes (images loading etc)
				this._container.style.bottom = bottom + 'px';
				this._container.style.left = left + 'px';
			},

			_getAnchor: function _getAnchor() {
				return [0, 0];
			}

		});

		/*
   * @class Popup
   * @inherits DivOverlay
   * @aka L.Popup
   * Used to open popups in certain places of the map. Use [Map.openPopup](#map-openpopup) to
   * open popups while making sure that only one popup is open at one time
   * (recommended for usability), or use [Map.addLayer](#map-addlayer) to open as many as you want.
   *
   * @example
   *
   * If you want to just bind a popup to marker click and then open it, it's really easy:
   *
   * ```js
   * marker.bindPopup(popupContent).openPopup();
   * ```
   * Path overlays like polylines also have a `bindPopup` method.
   * Here's a more complicated way to open a popup on a map:
   *
   * ```js
   * var popup = L.popup()
   * 	.setLatLng(latlng)
   * 	.setContent('<p>Hello world!<br />This is a nice popup.</p>')
   * 	.openOn(map);
   * ```
   */

		// @namespace Popup
		var Popup = DivOverlay.extend({

			// @section
			// @aka Popup options
			options: {
				// @option maxWidth: Number = 300
				// Max width of the popup, in pixels.
				maxWidth: 300,

				// @option minWidth: Number = 50
				// Min width of the popup, in pixels.
				minWidth: 50,

				// @option maxHeight: Number = null
				// If set, creates a scrollable container of the given height
				// inside a popup if its content exceeds it.
				maxHeight: null,

				// @option autoPan: Boolean = true
				// Set it to `false` if you don't want the map to do panning animation
				// to fit the opened popup.
				autoPan: true,

				// @option autoPanPaddingTopLeft: Point = null
				// The margin between the popup and the top left corner of the map
				// view after autopanning was performed.
				autoPanPaddingTopLeft: null,

				// @option autoPanPaddingBottomRight: Point = null
				// The margin between the popup and the bottom right corner of the map
				// view after autopanning was performed.
				autoPanPaddingBottomRight: null,

				// @option autoPanPadding: Point = Point(5, 5)
				// Equivalent of setting both top left and bottom right autopan padding to the same value.
				autoPanPadding: [5, 5],

				// @option keepInView: Boolean = false
				// Set it to `true` if you want to prevent users from panning the popup
				// off of the screen while it is open.
				keepInView: false,

				// @option closeButton: Boolean = true
				// Controls the presence of a close button in the popup.
				closeButton: true,

				// @option autoClose: Boolean = true
				// Set it to `false` if you want to override the default behavior of
				// the popup closing when another popup is opened.
				autoClose: true,

				// @option closeOnClick: Boolean = *
				// Set it if you want to override the default behavior of the popup closing when user clicks
				// on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.

				// @option className: String = ''
				// A custom CSS class name to assign to the popup.
				className: ''
			},

			// @namespace Popup
			// @method openOn(map: Map): this
			// Adds the popup to the map and closes the previous one. The same as `map.openPopup(popup)`.
			openOn: function openOn(map) {
				map.openPopup(this);
				return this;
			},

			onAdd: function onAdd(map) {
				DivOverlay.prototype.onAdd.call(this, map);

				// @namespace Map
				// @section Popup events
				// @event popupopen: PopupEvent
				// Fired when a popup is opened in the map
				map.fire('popupopen', { popup: this });

				if (this._source) {
					// @namespace Layer
					// @section Popup events
					// @event popupopen: PopupEvent
					// Fired when a popup bound to this layer is opened
					this._source.fire('popupopen', { popup: this }, true);
					// For non-path layers, we toggle the popup when clicking
					// again the layer, so prevent the map to reopen it.
					if (!(this._source instanceof Path)) {
						this._source.on('preclick', stopPropagation);
					}
				}
			},

			onRemove: function onRemove(map) {
				DivOverlay.prototype.onRemove.call(this, map);

				// @namespace Map
				// @section Popup events
				// @event popupclose: PopupEvent
				// Fired when a popup in the map is closed
				map.fire('popupclose', { popup: this });

				if (this._source) {
					// @namespace Layer
					// @section Popup events
					// @event popupclose: PopupEvent
					// Fired when a popup bound to this layer is closed
					this._source.fire('popupclose', { popup: this }, true);
					if (!(this._source instanceof Path)) {
						this._source.off('preclick', stopPropagation);
					}
				}
			},

			getEvents: function getEvents() {
				var events = DivOverlay.prototype.getEvents.call(this);

				if (this.options.closeOnClick !== undefined ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
					events.preclick = this._close;
				}

				if (this.options.keepInView) {
					events.moveend = this._adjustPan;
				}

				return events;
			},

			_close: function _close() {
				if (this._map) {
					this._map.closePopup(this);
				}
			},

			_initLayout: function _initLayout() {
				var prefix = 'leaflet-popup',
				    container = this._container = create$1('div', prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-animated');

				var wrapper = this._wrapper = create$1('div', prefix + '-content-wrapper', container);
				this._contentNode = create$1('div', prefix + '-content', wrapper);

				disableClickPropagation(wrapper);
				disableScrollPropagation(this._contentNode);
				on(wrapper, 'contextmenu', stopPropagation);

				this._tipContainer = create$1('div', prefix + '-tip-container', container);
				this._tip = create$1('div', prefix + '-tip', this._tipContainer);

				if (this.options.closeButton) {
					var closeButton = this._closeButton = create$1('a', prefix + '-close-button', container);
					closeButton.href = '#close';
					closeButton.innerHTML = '&#215;';

					on(closeButton, 'click', this._onCloseButtonClick, this);
				}
			},

			_updateLayout: function _updateLayout() {
				var container = this._contentNode,
				    style = container.style;

				style.width = '';
				style.whiteSpace = 'nowrap';

				var width = container.offsetWidth;
				width = Math.min(width, this.options.maxWidth);
				width = Math.max(width, this.options.minWidth);

				style.width = width + 1 + 'px';
				style.whiteSpace = '';

				style.height = '';

				var height = container.offsetHeight,
				    maxHeight = this.options.maxHeight,
				    scrolledClass = 'leaflet-popup-scrolled';

				if (maxHeight && height > maxHeight) {
					style.height = maxHeight + 'px';
					addClass(container, scrolledClass);
				} else {
					removeClass(container, scrolledClass);
				}

				this._containerWidth = this._container.offsetWidth;
			},

			_animateZoom: function _animateZoom(e) {
				var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
				    anchor = this._getAnchor();
				setPosition(this._container, pos.add(anchor));
			},

			_adjustPan: function _adjustPan() {
				if (!this.options.autoPan || this._map._panAnim && this._map._panAnim._inProgress) {
					return;
				}

				var map = this._map,
				    marginBottom = parseInt(getStyle(this._container, 'marginBottom'), 10) || 0,
				    containerHeight = this._container.offsetHeight + marginBottom,
				    containerWidth = this._containerWidth,
				    layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);

				layerPos._add(getPosition(this._container));

				var containerPos = map.layerPointToContainerPoint(layerPos),
				    padding = toPoint(this.options.autoPanPadding),
				    paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding),
				    paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding),
				    size = map.getSize(),
				    dx = 0,
				    dy = 0;

				if (containerPos.x + containerWidth + paddingBR.x > size.x) {
					// right
					dx = containerPos.x + containerWidth - size.x + paddingBR.x;
				}
				if (containerPos.x - dx - paddingTL.x < 0) {
					// left
					dx = containerPos.x - paddingTL.x;
				}
				if (containerPos.y + containerHeight + paddingBR.y > size.y) {
					// bottom
					dy = containerPos.y + containerHeight - size.y + paddingBR.y;
				}
				if (containerPos.y - dy - paddingTL.y < 0) {
					// top
					dy = containerPos.y - paddingTL.y;
				}

				// @namespace Map
				// @section Popup events
				// @event autopanstart: Event
				// Fired when the map starts autopanning when opening a popup.
				if (dx || dy) {
					map.fire('autopanstart').panBy([dx, dy]);
				}
			},

			_onCloseButtonClick: function _onCloseButtonClick(e) {
				this._close();
				stop(e);
			},

			_getAnchor: function _getAnchor() {
				// Where should we anchor the popup on the source layer?
				return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
			}

		});

		// @namespace Popup
		// @factory L.popup(options?: Popup options, source?: Layer)
		// Instantiates a `Popup` object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the popup with a reference to the Layer to which it refers.
		var popup = function popup(options, source) {
			return new Popup(options, source);
		};

		/* @namespace Map
   * @section Interaction Options
   * @option closePopupOnClick: Boolean = true
   * Set it to `false` if you don't want popups to close when user clicks the map.
   */
		Map.mergeOptions({
			closePopupOnClick: true
		});

		// @namespace Map
		// @section Methods for Layers and Controls
		Map.include({
			// @method openPopup(popup: Popup): this
			// Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
			// @alternative
			// @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
			// Creates a popup with the specified content and options and opens it in the given point on a map.
			openPopup: function openPopup(popup, latlng, options) {
				if (!(popup instanceof Popup)) {
					popup = new Popup(options).setContent(popup);
				}

				if (latlng) {
					popup.setLatLng(latlng);
				}

				if (this.hasLayer(popup)) {
					return this;
				}

				if (this._popup && this._popup.options.autoClose) {
					this.closePopup();
				}

				this._popup = popup;
				return this.addLayer(popup);
			},

			// @method closePopup(popup?: Popup): this
			// Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
			closePopup: function closePopup(popup) {
				if (!popup || popup === this._popup) {
					popup = this._popup;
					this._popup = null;
				}
				if (popup) {
					this.removeLayer(popup);
				}
				return this;
			}
		});

		/*
   * @namespace Layer
   * @section Popup methods example
   *
   * All layers share a set of methods convenient for binding popups to it.
   *
   * ```js
   * var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
   * layer.openPopup();
   * layer.closePopup();
   * ```
   *
   * Popups will also be automatically opened when the layer is clicked on and closed when the layer is removed from the map or another popup is opened.
   */

		// @section Popup methods
		Layer.include({

			// @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
			// Binds a popup to the layer with the passed `content` and sets up the
			// necessary event listeners. If a `Function` is passed it will receive
			// the layer as the first argument and should return a `String` or `HTMLElement`.
			bindPopup: function bindPopup(content, options) {

				if (content instanceof Popup) {
					setOptions(content, options);
					this._popup = content;
					content._source = this;
				} else {
					if (!this._popup || options) {
						this._popup = new Popup(options, this);
					}
					this._popup.setContent(content);
				}

				if (!this._popupHandlersAdded) {
					this.on({
						click: this._openPopup,
						keypress: this._onKeyPress,
						remove: this.closePopup,
						move: this._movePopup
					});
					this._popupHandlersAdded = true;
				}

				return this;
			},

			// @method unbindPopup(): this
			// Removes the popup previously bound with `bindPopup`.
			unbindPopup: function unbindPopup() {
				if (this._popup) {
					this.off({
						click: this._openPopup,
						keypress: this._onKeyPress,
						remove: this.closePopup,
						move: this._movePopup
					});
					this._popupHandlersAdded = false;
					this._popup = null;
				}
				return this;
			},

			// @method openPopup(latlng?: LatLng): this
			// Opens the bound popup at the specificed `latlng` or at the default popup anchor if no `latlng` is passed.
			openPopup: function openPopup(layer, latlng) {
				if (!(layer instanceof Layer)) {
					latlng = layer;
					layer = this;
				}

				if (layer instanceof FeatureGroup) {
					for (var id in this._layers) {
						layer = this._layers[id];
						break;
					}
				}

				if (!latlng) {
					latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
				}

				if (this._popup && this._map) {
					// set popup source to this layer
					this._popup._source = layer;

					// update the popup (content, layout, ect...)
					this._popup.update();

					// open the popup on the map
					this._map.openPopup(this._popup, latlng);
				}

				return this;
			},

			// @method closePopup(): this
			// Closes the popup bound to this layer if it is open.
			closePopup: function closePopup() {
				if (this._popup) {
					this._popup._close();
				}
				return this;
			},

			// @method togglePopup(): this
			// Opens or closes the popup bound to this layer depending on its current state.
			togglePopup: function togglePopup(target) {
				if (this._popup) {
					if (this._popup._map) {
						this.closePopup();
					} else {
						this.openPopup(target);
					}
				}
				return this;
			},

			// @method isPopupOpen(): boolean
			// Returns `true` if the popup bound to this layer is currently open.
			isPopupOpen: function isPopupOpen() {
				return this._popup ? this._popup.isOpen() : false;
			},

			// @method setPopupContent(content: String|HTMLElement|Popup): this
			// Sets the content of the popup bound to this layer.
			setPopupContent: function setPopupContent(content) {
				if (this._popup) {
					this._popup.setContent(content);
				}
				return this;
			},

			// @method getPopup(): Popup
			// Returns the popup bound to this layer.
			getPopup: function getPopup() {
				return this._popup;
			},

			_openPopup: function _openPopup(e) {
				var layer = e.layer || e.target;

				if (!this._popup) {
					return;
				}

				if (!this._map) {
					return;
				}

				// prevent map click
				stop(e);

				// if this inherits from Path its a vector and we can just
				// open the popup at the new location
				if (layer instanceof Path) {
					this.openPopup(e.layer || e.target, e.latlng);
					return;
				}

				// otherwise treat it like a marker and figure out
				// if we should toggle it open/closed
				if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
					this.closePopup();
				} else {
					this.openPopup(layer, e.latlng);
				}
			},

			_movePopup: function _movePopup(e) {
				this._popup.setLatLng(e.latlng);
			},

			_onKeyPress: function _onKeyPress(e) {
				if (e.originalEvent.keyCode === 13) {
					this._openPopup(e);
				}
			}
		});

		/*
   * @class Tooltip
   * @inherits DivOverlay
   * @aka L.Tooltip
   * Used to display small texts on top of map layers.
   *
   * @example
   *
   * ```js
   * marker.bindTooltip("my tooltip text").openTooltip();
   * ```
   * Note about tooltip offset. Leaflet takes two options in consideration
   * for computing tooltip offseting:
   * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
   *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
   *   move it to the bottom. Negatives will move to the left and top.
   * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
   *   should adapt this value if you use a custom icon.
   */

		// @namespace Tooltip
		var Tooltip = DivOverlay.extend({

			// @section
			// @aka Tooltip options
			options: {
				// @option pane: String = 'tooltipPane'
				// `Map pane` where the tooltip will be added.
				pane: 'tooltipPane',

				// @option offset: Point = Point(0, 0)
				// Optional offset of the tooltip position.
				offset: [0, 0],

				// @option direction: String = 'auto'
				// Direction where to open the tooltip. Possible values are: `right`, `left`,
				// `top`, `bottom`, `center`, `auto`.
				// `auto` will dynamicaly switch between `right` and `left` according to the tooltip
				// position on the map.
				direction: 'auto',

				// @option permanent: Boolean = false
				// Whether to open the tooltip permanently or only on mouseover.
				permanent: false,

				// @option sticky: Boolean = false
				// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
				sticky: false,

				// @option interactive: Boolean = false
				// If true, the tooltip will listen to the feature events.
				interactive: false,

				// @option opacity: Number = 0.9
				// Tooltip container opacity.
				opacity: 0.9
			},

			onAdd: function onAdd(map) {
				DivOverlay.prototype.onAdd.call(this, map);
				this.setOpacity(this.options.opacity);

				// @namespace Map
				// @section Tooltip events
				// @event tooltipopen: TooltipEvent
				// Fired when a tooltip is opened in the map.
				map.fire('tooltipopen', { tooltip: this });

				if (this._source) {
					// @namespace Layer
					// @section Tooltip events
					// @event tooltipopen: TooltipEvent
					// Fired when a tooltip bound to this layer is opened.
					this._source.fire('tooltipopen', { tooltip: this }, true);
				}
			},

			onRemove: function onRemove(map) {
				DivOverlay.prototype.onRemove.call(this, map);

				// @namespace Map
				// @section Tooltip events
				// @event tooltipclose: TooltipEvent
				// Fired when a tooltip in the map is closed.
				map.fire('tooltipclose', { tooltip: this });

				if (this._source) {
					// @namespace Layer
					// @section Tooltip events
					// @event tooltipclose: TooltipEvent
					// Fired when a tooltip bound to this layer is closed.
					this._source.fire('tooltipclose', { tooltip: this }, true);
				}
			},

			getEvents: function getEvents() {
				var events = DivOverlay.prototype.getEvents.call(this);

				if (touch && !this.options.permanent) {
					events.preclick = this._close;
				}

				return events;
			},

			_close: function _close() {
				if (this._map) {
					this._map.closeTooltip(this);
				}
			},

			_initLayout: function _initLayout() {
				var prefix = 'leaflet-tooltip',
				    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

				this._contentNode = this._container = create$1('div', className);
			},

			_updateLayout: function _updateLayout() {},

			_adjustPan: function _adjustPan() {},

			_setPosition: function _setPosition(pos) {
				var map = this._map,
				    container = this._container,
				    centerPoint = map.latLngToContainerPoint(map.getCenter()),
				    tooltipPoint = map.layerPointToContainerPoint(pos),
				    direction = this.options.direction,
				    tooltipWidth = container.offsetWidth,
				    tooltipHeight = container.offsetHeight,
				    offset = toPoint(this.options.offset),
				    anchor = this._getAnchor();

				if (direction === 'top') {
					pos = pos.add(toPoint(-tooltipWidth / 2 + offset.x, -tooltipHeight + offset.y + anchor.y, true));
				} else if (direction === 'bottom') {
					pos = pos.subtract(toPoint(tooltipWidth / 2 - offset.x, -offset.y, true));
				} else if (direction === 'center') {
					pos = pos.subtract(toPoint(tooltipWidth / 2 + offset.x, tooltipHeight / 2 - anchor.y + offset.y, true));
				} else if (direction === 'right' || direction === 'auto' && tooltipPoint.x < centerPoint.x) {
					direction = 'right';
					pos = pos.add(toPoint(offset.x + anchor.x, anchor.y - tooltipHeight / 2 + offset.y, true));
				} else {
					direction = 'left';
					pos = pos.subtract(toPoint(tooltipWidth + anchor.x - offset.x, tooltipHeight / 2 - anchor.y - offset.y, true));
				}

				removeClass(container, 'leaflet-tooltip-right');
				removeClass(container, 'leaflet-tooltip-left');
				removeClass(container, 'leaflet-tooltip-top');
				removeClass(container, 'leaflet-tooltip-bottom');
				addClass(container, 'leaflet-tooltip-' + direction);
				setPosition(container, pos);
			},

			_updatePosition: function _updatePosition() {
				var pos = this._map.latLngToLayerPoint(this._latlng);
				this._setPosition(pos);
			},

			setOpacity: function setOpacity(opacity) {
				this.options.opacity = opacity;

				if (this._container) {
					_setOpacity(this._container, opacity);
				}
			},

			_animateZoom: function _animateZoom(e) {
				var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
				this._setPosition(pos);
			},

			_getAnchor: function _getAnchor() {
				// Where should we anchor the tooltip on the source layer?
				return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
			}

		});

		// @namespace Tooltip
		// @factory L.tooltip(options?: Tooltip options, source?: Layer)
		// Instantiates a Tooltip object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the tooltip with a reference to the Layer to which it refers.
		var tooltip = function tooltip(options, source) {
			return new Tooltip(options, source);
		};

		// @namespace Map
		// @section Methods for Layers and Controls
		Map.include({

			// @method openTooltip(tooltip: Tooltip): this
			// Opens the specified tooltip.
			// @alternative
			// @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
			// Creates a tooltip with the specified content and options and open it.
			openTooltip: function openTooltip(tooltip, latlng, options) {
				if (!(tooltip instanceof Tooltip)) {
					tooltip = new Tooltip(options).setContent(tooltip);
				}

				if (latlng) {
					tooltip.setLatLng(latlng);
				}

				if (this.hasLayer(tooltip)) {
					return this;
				}

				return this.addLayer(tooltip);
			},

			// @method closeTooltip(tooltip?: Tooltip): this
			// Closes the tooltip given as parameter.
			closeTooltip: function closeTooltip(tooltip) {
				if (tooltip) {
					this.removeLayer(tooltip);
				}
				return this;
			}

		});

		/*
   * @namespace Layer
   * @section Tooltip methods example
   *
   * All layers share a set of methods convenient for binding tooltips to it.
   *
   * ```js
   * var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
   * layer.openTooltip();
   * layer.closeTooltip();
   * ```
   */

		// @section Tooltip methods
		Layer.include({

			// @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
			// Binds a tooltip to the layer with the passed `content` and sets up the
			// necessary event listeners. If a `Function` is passed it will receive
			// the layer as the first argument and should return a `String` or `HTMLElement`.
			bindTooltip: function bindTooltip(content, options) {

				if (content instanceof Tooltip) {
					setOptions(content, options);
					this._tooltip = content;
					content._source = this;
				} else {
					if (!this._tooltip || options) {
						this._tooltip = new Tooltip(options, this);
					}
					this._tooltip.setContent(content);
				}

				this._initTooltipInteractions();

				if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
					this.openTooltip();
				}

				return this;
			},

			// @method unbindTooltip(): this
			// Removes the tooltip previously bound with `bindTooltip`.
			unbindTooltip: function unbindTooltip() {
				if (this._tooltip) {
					this._initTooltipInteractions(true);
					this.closeTooltip();
					this._tooltip = null;
				}
				return this;
			},

			_initTooltipInteractions: function _initTooltipInteractions(remove$$1) {
				if (!remove$$1 && this._tooltipHandlersAdded) {
					return;
				}
				var onOff = remove$$1 ? 'off' : 'on',
				    events = {
					remove: this.closeTooltip,
					move: this._moveTooltip
				};
				if (!this._tooltip.options.permanent) {
					events.mouseover = this._openTooltip;
					events.mouseout = this.closeTooltip;
					if (this._tooltip.options.sticky) {
						events.mousemove = this._moveTooltip;
					}
					if (touch) {
						events.click = this._openTooltip;
					}
				} else {
					events.add = this._openTooltip;
				}
				this[onOff](events);
				this._tooltipHandlersAdded = !remove$$1;
			},

			// @method openTooltip(latlng?: LatLng): this
			// Opens the bound tooltip at the specificed `latlng` or at the default tooltip anchor if no `latlng` is passed.
			openTooltip: function openTooltip(layer, latlng) {
				if (!(layer instanceof Layer)) {
					latlng = layer;
					layer = this;
				}

				if (layer instanceof FeatureGroup) {
					for (var id in this._layers) {
						layer = this._layers[id];
						break;
					}
				}

				if (!latlng) {
					latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
				}

				if (this._tooltip && this._map) {

					// set tooltip source to this layer
					this._tooltip._source = layer;

					// update the tooltip (content, layout, ect...)
					this._tooltip.update();

					// open the tooltip on the map
					this._map.openTooltip(this._tooltip, latlng);

					// Tooltip container may not be defined if not permanent and never
					// opened.
					if (this._tooltip.options.interactive && this._tooltip._container) {
						addClass(this._tooltip._container, 'leaflet-clickable');
						this.addInteractiveTarget(this._tooltip._container);
					}
				}

				return this;
			},

			// @method closeTooltip(): this
			// Closes the tooltip bound to this layer if it is open.
			closeTooltip: function closeTooltip() {
				if (this._tooltip) {
					this._tooltip._close();
					if (this._tooltip.options.interactive && this._tooltip._container) {
						removeClass(this._tooltip._container, 'leaflet-clickable');
						this.removeInteractiveTarget(this._tooltip._container);
					}
				}
				return this;
			},

			// @method toggleTooltip(): this
			// Opens or closes the tooltip bound to this layer depending on its current state.
			toggleTooltip: function toggleTooltip(target) {
				if (this._tooltip) {
					if (this._tooltip._map) {
						this.closeTooltip();
					} else {
						this.openTooltip(target);
					}
				}
				return this;
			},

			// @method isTooltipOpen(): boolean
			// Returns `true` if the tooltip bound to this layer is currently open.
			isTooltipOpen: function isTooltipOpen() {
				return this._tooltip.isOpen();
			},

			// @method setTooltipContent(content: String|HTMLElement|Tooltip): this
			// Sets the content of the tooltip bound to this layer.
			setTooltipContent: function setTooltipContent(content) {
				if (this._tooltip) {
					this._tooltip.setContent(content);
				}
				return this;
			},

			// @method getTooltip(): Tooltip
			// Returns the tooltip bound to this layer.
			getTooltip: function getTooltip() {
				return this._tooltip;
			},

			_openTooltip: function _openTooltip(e) {
				var layer = e.layer || e.target;

				if (!this._tooltip || !this._map) {
					return;
				}
				this.openTooltip(layer, this._tooltip.options.sticky ? e.latlng : undefined);
			},

			_moveTooltip: function _moveTooltip(e) {
				var latlng = e.latlng,
				    containerPoint,
				    layerPoint;
				if (this._tooltip.options.sticky && e.originalEvent) {
					containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
					layerPoint = this._map.containerPointToLayerPoint(containerPoint);
					latlng = this._map.layerPointToLatLng(layerPoint);
				}
				this._tooltip.setLatLng(latlng);
			}
		});

		/*
   * @class DivIcon
   * @aka L.DivIcon
   * @inherits Icon
   *
   * Represents a lightweight icon for markers that uses a simple `<div>`
   * element instead of an image. Inherits from `Icon` but ignores the `iconUrl` and shadow options.
   *
   * @example
   * ```js
   * var myIcon = L.divIcon({className: 'my-div-icon'});
   * // you can set .my-div-icon styles in CSS
   *
   * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
   * ```
   *
   * By default, it has a 'leaflet-div-icon' CSS class and is styled as a little white square with a shadow.
   */

		var DivIcon = Icon.extend({
			options: {
				// @section
				// @aka DivIcon options
				iconSize: [12, 12], // also can be set through CSS

				// iconAnchor: (Point),
				// popupAnchor: (Point),

				// @option html: String = ''
				// Custom HTML code to put inside the div element, empty by default.
				html: false,

				// @option bgPos: Point = [0, 0]
				// Optional relative position of the background, in pixels
				bgPos: null,

				className: 'leaflet-div-icon'
			},

			createIcon: function createIcon(oldIcon) {
				var div = oldIcon && oldIcon.tagName === 'DIV' ? oldIcon : document.createElement('div'),
				    options = this.options;

				div.innerHTML = options.html !== false ? options.html : '';

				if (options.bgPos) {
					var bgPos = toPoint(options.bgPos);
					div.style.backgroundPosition = -bgPos.x + 'px ' + -bgPos.y + 'px';
				}
				this._setIconStyles(div, 'icon');

				return div;
			},

			createShadow: function createShadow() {
				return null;
			}
		});

		// @factory L.divIcon(options: DivIcon options)
		// Creates a `DivIcon` instance with the given options.
		function divIcon(options) {
			return new DivIcon(options);
		}

		Icon.Default = IconDefault;

		/*
   * @class GridLayer
   * @inherits Layer
   * @aka L.GridLayer
   *
   * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and replaces `TileLayer.Canvas`.
   * GridLayer can be extended to create a tiled grid of HTML elements like `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
   *
   *
   * @section Synchronous usage
   * @example
   *
   * To create a custom layer, extend GridLayer and implement the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
   *
   * ```js
   * var CanvasLayer = L.GridLayer.extend({
   *     createTile: function(coords){
   *         // create a <canvas> element for drawing
   *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
   *
   *         // setup tile width and height according to the options
   *         var size = this.getTileSize();
   *         tile.width = size.x;
   *         tile.height = size.y;
   *
   *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
   *         var ctx = tile.getContext('2d');
   *
   *         // return the tile so it can be rendered on screen
   *         return tile;
   *     }
   * });
   * ```
   *
   * @section Asynchronous usage
   * @example
   *
   * Tile creation can also be asynchronous, this is useful when using a third-party drawing library. Once the tile is finished drawing it can be passed to the `done()` callback.
   *
   * ```js
   * var CanvasLayer = L.GridLayer.extend({
   *     createTile: function(coords, done){
   *         var error;
   *
   *         // create a <canvas> element for drawing
   *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
   *
   *         // setup tile width and height according to the options
   *         var size = this.getTileSize();
   *         tile.width = size.x;
   *         tile.height = size.y;
   *
   *         // draw something asynchronously and pass the tile to the done() callback
   *         setTimeout(function() {
   *             done(error, tile);
   *         }, 1000);
   *
   *         return tile;
   *     }
   * });
   * ```
   *
   * @section
   */

		var GridLayer = Layer.extend({

			// @section
			// @aka GridLayer options
			options: {
				// @option tileSize: Number|Point = 256
				// Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
				tileSize: 256,

				// @option opacity: Number = 1.0
				// Opacity of the tiles. Can be used in the `createTile()` function.
				opacity: 1,

				// @option updateWhenIdle: Boolean = (depends)
				// Load new tiles only when panning ends.
				// `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
				// `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
				// [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
				updateWhenIdle: mobile,

				// @option updateWhenZooming: Boolean = true
				// By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
				updateWhenZooming: true,

				// @option updateInterval: Number = 200
				// Tiles will not update more than once every `updateInterval` milliseconds when panning.
				updateInterval: 200,

				// @option zIndex: Number = 1
				// The explicit zIndex of the tile layer.
				zIndex: 1,

				// @option bounds: LatLngBounds = undefined
				// If set, tiles will only be loaded inside the set `LatLngBounds`.
				bounds: null,

				// @option minZoom: Number = 0
				// The minimum zoom level down to which this layer will be displayed (inclusive).
				minZoom: 0,

				// @option maxZoom: Number = undefined
				// The maximum zoom level up to which this layer will be displayed (inclusive).
				maxZoom: undefined,

				// @option maxNativeZoom: Number = undefined
				// Maximum zoom number the tile source has available. If it is specified,
				// the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
				// from `maxNativeZoom` level and auto-scaled.
				maxNativeZoom: undefined,

				// @option minNativeZoom: Number = undefined
				// Minimum zoom number the tile source has available. If it is specified,
				// the tiles on all zoom levels lower than `minNativeZoom` will be loaded
				// from `minNativeZoom` level and auto-scaled.
				minNativeZoom: undefined,

				// @option noWrap: Boolean = false
				// Whether the layer is wrapped around the antimeridian. If `true`, the
				// GridLayer will only be displayed once at low zoom levels. Has no
				// effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
				// in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
				// tiles outside the CRS limits.
				noWrap: false,

				// @option pane: String = 'tilePane'
				// `Map pane` where the grid layer will be added.
				pane: 'tilePane',

				// @option className: String = ''
				// A custom class name to assign to the tile layer. Empty by default.
				className: '',

				// @option keepBuffer: Number = 2
				// When panning the map, keep this many rows and columns of tiles before unloading them.
				keepBuffer: 2
			},

			initialize: function initialize(options) {
				setOptions(this, options);
			},

			onAdd: function onAdd() {
				this._initContainer();

				this._levels = {};
				this._tiles = {};

				this._resetView();
				this._update();
			},

			beforeAdd: function beforeAdd(map) {
				map._addZoomLimit(this);
			},

			onRemove: function onRemove(map) {
				this._removeAllTiles();
				_remove(this._container);
				map._removeZoomLimit(this);
				this._container = null;
				this._tileZoom = null;
			},

			// @method bringToFront: this
			// Brings the tile layer to the top of all tile layers.
			bringToFront: function bringToFront() {
				if (this._map) {
					toFront(this._container);
					this._setAutoZIndex(Math.max);
				}
				return this;
			},

			// @method bringToBack: this
			// Brings the tile layer to the bottom of all tile layers.
			bringToBack: function bringToBack() {
				if (this._map) {
					toBack(this._container);
					this._setAutoZIndex(Math.min);
				}
				return this;
			},

			// @method getContainer: HTMLElement
			// Returns the HTML element that contains the tiles for this layer.
			getContainer: function getContainer() {
				return this._container;
			},

			// @method setOpacity(opacity: Number): this
			// Changes the [opacity](#gridlayer-opacity) of the grid layer.
			setOpacity: function setOpacity(opacity) {
				this.options.opacity = opacity;
				this._updateOpacity();
				return this;
			},

			// @method setZIndex(zIndex: Number): this
			// Changes the [zIndex](#gridlayer-zindex) of the grid layer.
			setZIndex: function setZIndex(zIndex) {
				this.options.zIndex = zIndex;
				this._updateZIndex();

				return this;
			},

			// @method isLoading: Boolean
			// Returns `true` if any tile in the grid layer has not finished loading.
			isLoading: function isLoading() {
				return this._loading;
			},

			// @method redraw: this
			// Causes the layer to clear all the tiles and request them again.
			redraw: function redraw() {
				if (this._map) {
					this._removeAllTiles();
					this._update();
				}
				return this;
			},

			getEvents: function getEvents() {
				var events = {
					viewprereset: this._invalidateAll,
					viewreset: this._resetView,
					zoom: this._resetView,
					moveend: this._onMoveEnd
				};

				if (!this.options.updateWhenIdle) {
					// update tiles on move, but not more often than once per given interval
					if (!this._onMove) {
						this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
					}

					events.move = this._onMove;
				}

				if (this._zoomAnimated) {
					events.zoomanim = this._animateZoom;
				}

				return events;
			},

			// @section Extension methods
			// Layers extending `GridLayer` shall reimplement the following method.
			// @method createTile(coords: Object, done?: Function): HTMLElement
			// Called only internally, must be overriden by classes extending `GridLayer`.
			// Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
			// is specified, it must be called when the tile has finished loading and drawing.
			createTile: function createTile() {
				return document.createElement('div');
			},

			// @section
			// @method getTileSize: Point
			// Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
			getTileSize: function getTileSize() {
				var s = this.options.tileSize;
				return s instanceof Point ? s : new Point(s, s);
			},

			_updateZIndex: function _updateZIndex() {
				if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
					this._container.style.zIndex = this.options.zIndex;
				}
			},

			_setAutoZIndex: function _setAutoZIndex(compare) {
				// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

				var layers = this.getPane().children,
				    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

				for (var i = 0, len = layers.length, zIndex; i < len; i++) {

					zIndex = layers[i].style.zIndex;

					if (layers[i] !== this._container && zIndex) {
						edgeZIndex = compare(edgeZIndex, +zIndex);
					}
				}

				if (isFinite(edgeZIndex)) {
					this.options.zIndex = edgeZIndex + compare(-1, 1);
					this._updateZIndex();
				}
			},

			_updateOpacity: function _updateOpacity() {
				if (!this._map) {
					return;
				}

				// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
				if (ielt9) {
					return;
				}

				_setOpacity(this._container, this.options.opacity);

				var now = +new Date(),
				    nextFrame = false,
				    willPrune = false;

				for (var key in this._tiles) {
					var tile = this._tiles[key];
					if (!tile.current || !tile.loaded) {
						continue;
					}

					var fade = Math.min(1, (now - tile.loaded) / 200);

					_setOpacity(tile.el, fade);
					if (fade < 1) {
						nextFrame = true;
					} else {
						if (tile.active) {
							willPrune = true;
						} else {
							this._onOpaqueTile(tile);
						}
						tile.active = true;
					}
				}

				if (willPrune && !this._noPrune) {
					this._pruneTiles();
				}

				if (nextFrame) {
					cancelAnimFrame(this._fadeFrame);
					this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
				}
			},

			_onOpaqueTile: falseFn,

			_initContainer: function _initContainer() {
				if (this._container) {
					return;
				}

				this._container = create$1('div', 'leaflet-layer ' + (this.options.className || ''));
				this._updateZIndex();

				if (this.options.opacity < 1) {
					this._updateOpacity();
				}

				this.getPane().appendChild(this._container);
			},

			_updateLevels: function _updateLevels() {

				var zoom = this._tileZoom,
				    maxZoom = this.options.maxZoom;

				if (zoom === undefined) {
					return undefined;
				}

				for (var z in this._levels) {
					if (this._levels[z].el.children.length || z === zoom) {
						this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
						this._onUpdateLevel(z);
					} else {
						_remove(this._levels[z].el);
						this._removeTilesAtZoom(z);
						this._onRemoveLevel(z);
						delete this._levels[z];
					}
				}

				var level = this._levels[zoom],
				    map = this._map;

				if (!level) {
					level = this._levels[zoom] = {};

					level.el = create$1('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
					level.el.style.zIndex = maxZoom;

					level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
					level.zoom = zoom;

					this._setZoomTransform(level, map.getCenter(), map.getZoom());

					// force the browser to consider the newly added element for transition
					falseFn(level.el.offsetWidth);

					this._onCreateLevel(level);
				}

				this._level = level;

				return level;
			},

			_onUpdateLevel: falseFn,

			_onRemoveLevel: falseFn,

			_onCreateLevel: falseFn,

			_pruneTiles: function _pruneTiles() {
				if (!this._map) {
					return;
				}

				var key, tile;

				var zoom = this._map.getZoom();
				if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
					this._removeAllTiles();
					return;
				}

				for (key in this._tiles) {
					tile = this._tiles[key];
					tile.retain = tile.current;
				}

				for (key in this._tiles) {
					tile = this._tiles[key];
					if (tile.current && !tile.active) {
						var coords = tile.coords;
						if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
							this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
						}
					}
				}

				for (key in this._tiles) {
					if (!this._tiles[key].retain) {
						this._removeTile(key);
					}
				}
			},

			_removeTilesAtZoom: function _removeTilesAtZoom(zoom) {
				for (var key in this._tiles) {
					if (this._tiles[key].coords.z !== zoom) {
						continue;
					}
					this._removeTile(key);
				}
			},

			_removeAllTiles: function _removeAllTiles() {
				for (var key in this._tiles) {
					this._removeTile(key);
				}
			},

			_invalidateAll: function _invalidateAll() {
				for (var z in this._levels) {
					_remove(this._levels[z].el);
					this._onRemoveLevel(z);
					delete this._levels[z];
				}
				this._removeAllTiles();

				this._tileZoom = null;
			},

			_retainParent: function _retainParent(x, y, z, minZoom) {
				var x2 = Math.floor(x / 2),
				    y2 = Math.floor(y / 2),
				    z2 = z - 1,
				    coords2 = new Point(+x2, +y2);
				coords2.z = +z2;

				var key = this._tileCoordsToKey(coords2),
				    tile = this._tiles[key];

				if (tile && tile.active) {
					tile.retain = true;
					return true;
				} else if (tile && tile.loaded) {
					tile.retain = true;
				}

				if (z2 > minZoom) {
					return this._retainParent(x2, y2, z2, minZoom);
				}

				return false;
			},

			_retainChildren: function _retainChildren(x, y, z, maxZoom) {

				for (var i = 2 * x; i < 2 * x + 2; i++) {
					for (var j = 2 * y; j < 2 * y + 2; j++) {

						var coords = new Point(i, j);
						coords.z = z + 1;

						var key = this._tileCoordsToKey(coords),
						    tile = this._tiles[key];

						if (tile && tile.active) {
							tile.retain = true;
							continue;
						} else if (tile && tile.loaded) {
							tile.retain = true;
						}

						if (z + 1 < maxZoom) {
							this._retainChildren(i, j, z + 1, maxZoom);
						}
					}
				}
			},

			_resetView: function _resetView(e) {
				var animating = e && (e.pinch || e.flyTo);
				this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
			},

			_animateZoom: function _animateZoom(e) {
				this._setView(e.center, e.zoom, true, e.noUpdate);
			},

			_clampZoom: function _clampZoom(zoom) {
				var options = this.options;

				if (undefined !== options.minNativeZoom && zoom < options.minNativeZoom) {
					return options.minNativeZoom;
				}

				if (undefined !== options.maxNativeZoom && options.maxNativeZoom < zoom) {
					return options.maxNativeZoom;
				}

				return zoom;
			},

			_setView: function _setView(center, zoom, noPrune, noUpdate) {
				var tileZoom = this._clampZoom(Math.round(zoom));
				if (this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom || this.options.minZoom !== undefined && tileZoom < this.options.minZoom) {
					tileZoom = undefined;
				}

				var tileZoomChanged = this.options.updateWhenZooming && tileZoom !== this._tileZoom;

				if (!noUpdate || tileZoomChanged) {

					this._tileZoom = tileZoom;

					if (this._abortLoading) {
						this._abortLoading();
					}

					this._updateLevels();
					this._resetGrid();

					if (tileZoom !== undefined) {
						this._update(center);
					}

					if (!noPrune) {
						this._pruneTiles();
					}

					// Flag to prevent _updateOpacity from pruning tiles during
					// a zoom anim or a pinch gesture
					this._noPrune = !!noPrune;
				}

				this._setZoomTransforms(center, zoom);
			},

			_setZoomTransforms: function _setZoomTransforms(center, zoom) {
				for (var i in this._levels) {
					this._setZoomTransform(this._levels[i], center, zoom);
				}
			},

			_setZoomTransform: function _setZoomTransform(level, center, zoom) {
				var scale = this._map.getZoomScale(zoom, level.zoom),
				    translate = level.origin.multiplyBy(scale).subtract(this._map._getNewPixelOrigin(center, zoom)).round();

				if (any3d) {
					setTransform(level.el, translate, scale);
				} else {
					setPosition(level.el, translate);
				}
			},

			_resetGrid: function _resetGrid() {
				var map = this._map,
				    crs = map.options.crs,
				    tileSize = this._tileSize = this.getTileSize(),
				    tileZoom = this._tileZoom;

				var bounds = this._map.getPixelWorldBounds(this._tileZoom);
				if (bounds) {
					this._globalTileRange = this._pxBoundsToTileRange(bounds);
				}

				this._wrapX = crs.wrapLng && !this.options.noWrap && [Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x), Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)];
				this._wrapY = crs.wrapLat && !this.options.noWrap && [Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x), Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)];
			},

			_onMoveEnd: function _onMoveEnd() {
				if (!this._map || this._map._animatingZoom) {
					return;
				}

				this._update();
			},

			_getTiledPixelBounds: function _getTiledPixelBounds(center) {
				var map = this._map,
				    mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
				    scale = map.getZoomScale(mapZoom, this._tileZoom),
				    pixelCenter = map.project(center, this._tileZoom).floor(),
				    halfSize = map.getSize().divideBy(scale * 2);

				return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
			},

			// Private method to load tiles in the grid's active zoom level according to map bounds
			_update: function _update(center) {
				var map = this._map;
				if (!map) {
					return;
				}
				var zoom = this._clampZoom(map.getZoom());

				if (center === undefined) {
					center = map.getCenter();
				}
				if (this._tileZoom === undefined) {
					return;
				} // if out of minzoom/maxzoom

				var pixelBounds = this._getTiledPixelBounds(center),
				    tileRange = this._pxBoundsToTileRange(pixelBounds),
				    tileCenter = tileRange.getCenter(),
				    queue = [],
				    margin = this.options.keepBuffer,
				    noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]), tileRange.getTopRight().add([margin, -margin]));

				// Sanity check: panic if the tile range contains Infinity somewhere.
				if (!(isFinite(tileRange.min.x) && isFinite(tileRange.min.y) && isFinite(tileRange.max.x) && isFinite(tileRange.max.y))) {
					throw new Error('Attempted to load an infinite number of tiles');
				}

				for (var key in this._tiles) {
					var c = this._tiles[key].coords;
					if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
						this._tiles[key].current = false;
					}
				}

				// _update just loads more tiles. If the tile zoom level differs too much
				// from the map's, let _setView reset levels and prune old tiles.
				if (Math.abs(zoom - this._tileZoom) > 1) {
					this._setView(center, zoom);return;
				}

				// create a queue of coordinates to load tiles from
				for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
					for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
						var coords = new Point(i, j);
						coords.z = this._tileZoom;

						if (!this._isValidTile(coords)) {
							continue;
						}

						if (!this._tiles[this._tileCoordsToKey(coords)]) {
							queue.push(coords);
						}
					}
				}

				// sort tile queue to load tiles in order of their distance to center
				queue.sort(function (a, b) {
					return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
				});

				if (queue.length !== 0) {
					// if it's the first batch of tiles to load
					if (!this._loading) {
						this._loading = true;
						// @event loading: Event
						// Fired when the grid layer starts loading tiles.
						this.fire('loading');
					}

					// create DOM fragment to append tiles in one batch
					var fragment = document.createDocumentFragment();

					for (i = 0; i < queue.length; i++) {
						this._addTile(queue[i], fragment);
					}

					this._level.el.appendChild(fragment);
				}
			},

			_isValidTile: function _isValidTile(coords) {
				var crs = this._map.options.crs;

				if (!crs.infinite) {
					// don't load tile if it's out of bounds and not wrapped
					var bounds = this._globalTileRange;
					if (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x) || !crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y)) {
						return false;
					}
				}

				if (!this.options.bounds) {
					return true;
				}

				// don't load tile if it doesn't intersect the bounds in options
				var tileBounds = this._tileCoordsToBounds(coords);
				return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
			},

			_keyToBounds: function _keyToBounds(key) {
				return this._tileCoordsToBounds(this._keyToTileCoords(key));
			},

			// converts tile coordinates to its geographical bounds
			_tileCoordsToBounds: function _tileCoordsToBounds(coords) {

				var map = this._map,
				    tileSize = this.getTileSize(),
				    nwPoint = coords.scaleBy(tileSize),
				    sePoint = nwPoint.add(tileSize),
				    nw = map.unproject(nwPoint, coords.z),
				    se = map.unproject(sePoint, coords.z),
				    bounds = new LatLngBounds(nw, se);

				if (!this.options.noWrap) {
					map.wrapLatLngBounds(bounds);
				}

				return bounds;
			},

			// converts tile coordinates to key for the tile cache
			_tileCoordsToKey: function _tileCoordsToKey(coords) {
				return coords.x + ':' + coords.y + ':' + coords.z;
			},

			// converts tile cache key to coordinates
			_keyToTileCoords: function _keyToTileCoords(key) {
				var k = key.split(':'),
				    coords = new Point(+k[0], +k[1]);
				coords.z = +k[2];
				return coords;
			},

			_removeTile: function _removeTile(key) {
				var tile = this._tiles[key];
				if (!tile) {
					return;
				}

				_remove(tile.el);

				delete this._tiles[key];

				// @event tileunload: TileEvent
				// Fired when a tile is removed (e.g. when a tile goes off the screen).
				this.fire('tileunload', {
					tile: tile.el,
					coords: this._keyToTileCoords(key)
				});
			},

			_initTile: function _initTile(tile) {
				addClass(tile, 'leaflet-tile');

				var tileSize = this.getTileSize();
				tile.style.width = tileSize.x + 'px';
				tile.style.height = tileSize.y + 'px';

				tile.onselectstart = falseFn;
				tile.onmousemove = falseFn;

				// update opacity on tiles in IE7-8 because of filter inheritance problems
				if (ielt9 && this.options.opacity < 1) {
					_setOpacity(tile, this.options.opacity);
				}

				// without this hack, tiles disappear after zoom on Chrome for Android
				// https://github.com/Leaflet/Leaflet/issues/2078
				if (android && !android23) {
					tile.style.WebkitBackfaceVisibility = 'hidden';
				}
			},

			_addTile: function _addTile(coords, container) {
				var tilePos = this._getTilePos(coords),
				    key = this._tileCoordsToKey(coords);

				var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));

				this._initTile(tile);

				// if createTile is defined with a second argument ("done" callback),
				// we know that tile is async and will be ready later; otherwise
				if (this.createTile.length < 2) {
					// mark tile as ready, but delay one frame for opacity animation to happen
					requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
				}

				setPosition(tile, tilePos);

				// save tile in cache
				this._tiles[key] = {
					el: tile,
					coords: coords,
					current: true
				};

				container.appendChild(tile);
				// @event tileloadstart: TileEvent
				// Fired when a tile is requested and starts loading.
				this.fire('tileloadstart', {
					tile: tile,
					coords: coords
				});
			},

			_tileReady: function _tileReady(coords, err, tile) {
				if (!this._map) {
					return;
				}

				if (err) {
					// @event tileerror: TileErrorEvent
					// Fired when there is an error loading a tile.
					this.fire('tileerror', {
						error: err,
						tile: tile,
						coords: coords
					});
				}

				var key = this._tileCoordsToKey(coords);

				tile = this._tiles[key];
				if (!tile) {
					return;
				}

				tile.loaded = +new Date();
				if (this._map._fadeAnimated) {
					_setOpacity(tile.el, 0);
					cancelAnimFrame(this._fadeFrame);
					this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
				} else {
					tile.active = true;
					this._pruneTiles();
				}

				if (!err) {
					addClass(tile.el, 'leaflet-tile-loaded');

					// @event tileload: TileEvent
					// Fired when a tile loads.
					this.fire('tileload', {
						tile: tile.el,
						coords: coords
					});
				}

				if (this._noTilesToLoad()) {
					this._loading = false;
					// @event load: Event
					// Fired when the grid layer loaded all visible tiles.
					this.fire('load');

					if (ielt9 || !this._map._fadeAnimated) {
						requestAnimFrame(this._pruneTiles, this);
					} else {
						// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
						// to trigger a pruning.
						setTimeout(bind(this._pruneTiles, this), 250);
					}
				}
			},

			_getTilePos: function _getTilePos(coords) {
				return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
			},

			_wrapCoords: function _wrapCoords(coords) {
				var newCoords = new Point(this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x, this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y);
				newCoords.z = coords.z;
				return newCoords;
			},

			_pxBoundsToTileRange: function _pxBoundsToTileRange(bounds) {
				var tileSize = this.getTileSize();
				return new Bounds(bounds.min.unscaleBy(tileSize).floor(), bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
			},

			_noTilesToLoad: function _noTilesToLoad() {
				for (var key in this._tiles) {
					if (!this._tiles[key].loaded) {
						return false;
					}
				}
				return true;
			}
		});

		// @factory L.gridLayer(options?: GridLayer options)
		// Creates a new instance of GridLayer with the supplied options.
		function gridLayer(options) {
			return new GridLayer(options);
		}

		/*
   * @class TileLayer
   * @inherits GridLayer
   * @aka L.TileLayer
   * Used to load and display tile layers on the map. Extends `GridLayer`.
   *
   * @example
   *
   * ```js
   * L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);
   * ```
   *
   * @section URL template
   * @example
   *
   * A string of the following form:
   *
   * ```
   * 'http://{s}.somedomain.com/blabla/{z}/{x}/{y}{r}.png'
   * ```
   *
   * `{s}` means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation; subdomain values are specified in options; `a`, `b` or `c` by default, can be omitted), `{z}` — zoom level, `{x}` and `{y}` — tile coordinates. `{r}` can be used to add "&commat;2x" to the URL to load retina tiles.
   *
   * You can use custom keys in the template, which will be [evaluated](#util-template) from TileLayer options, like this:
   *
   * ```
   * L.tileLayer('http://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', {foo: 'bar'});
   * ```
   */

		var TileLayer = GridLayer.extend({

			// @section
			// @aka TileLayer options
			options: {
				// @option minZoom: Number = 0
				// The minimum zoom level down to which this layer will be displayed (inclusive).
				minZoom: 0,

				// @option maxZoom: Number = 18
				// The maximum zoom level up to which this layer will be displayed (inclusive).
				maxZoom: 18,

				// @option subdomains: String|String[] = 'abc'
				// Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
				subdomains: 'abc',

				// @option errorTileUrl: String = ''
				// URL to the tile image to show in place of the tile that failed to load.
				errorTileUrl: '',

				// @option zoomOffset: Number = 0
				// The zoom number used in tile URLs will be offset with this value.
				zoomOffset: 0,

				// @option tms: Boolean = false
				// If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
				tms: false,

				// @option zoomReverse: Boolean = false
				// If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
				zoomReverse: false,

				// @option detectRetina: Boolean = false
				// If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
				detectRetina: false,

				// @option crossOrigin: Boolean = false
				// If true, all tiles will have their crossOrigin attribute set to ''. This is needed if you want to access tile pixel data.
				crossOrigin: false
			},

			initialize: function initialize(url, options) {

				this._url = url;

				options = setOptions(this, options);

				// detecting retina displays, adjusting tileSize and zoom levels
				if (options.detectRetina && retina && options.maxZoom > 0) {

					options.tileSize = Math.floor(options.tileSize / 2);

					if (!options.zoomReverse) {
						options.zoomOffset++;
						options.maxZoom--;
					} else {
						options.zoomOffset--;
						options.minZoom++;
					}

					options.minZoom = Math.max(0, options.minZoom);
				}

				if (typeof options.subdomains === 'string') {
					options.subdomains = options.subdomains.split('');
				}

				// for https://github.com/Leaflet/Leaflet/issues/137
				if (!android) {
					this.on('tileunload', this._onTileRemove);
				}
			},

			// @method setUrl(url: String, noRedraw?: Boolean): this
			// Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
			setUrl: function setUrl(url, noRedraw) {
				this._url = url;

				if (!noRedraw) {
					this.redraw();
				}
				return this;
			},

			// @method createTile(coords: Object, done?: Function): HTMLElement
			// Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
			// to return an `<img>` HTML element with the appropiate image URL given `coords`. The `done`
			// callback is called when the tile has been loaded.
			createTile: function createTile(coords, done) {
				var tile = document.createElement('img');

				on(tile, 'load', bind(this._tileOnLoad, this, done, tile));
				on(tile, 'error', bind(this._tileOnError, this, done, tile));

				if (this.options.crossOrigin) {
					tile.crossOrigin = '';
				}

				/*
     Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
     http://www.w3.org/TR/WCAG20-TECHS/H67
    */
				tile.alt = '';

				/*
     Set role="presentation" to force screen readers to ignore this
     https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
    */
				tile.setAttribute('role', 'presentation');

				tile.src = this.getTileUrl(coords);

				return tile;
			},

			// @section Extension methods
			// @uninheritable
			// Layers extending `TileLayer` might reimplement the following method.
			// @method getTileUrl(coords: Object): String
			// Called only internally, returns the URL for a tile given its coordinates.
			// Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
			getTileUrl: function getTileUrl(coords) {
				var data = {
					r: retina ? '@2x' : '',
					s: this._getSubdomain(coords),
					x: coords.x,
					y: coords.y,
					z: this._getZoomForUrl()
				};
				if (this._map && !this._map.options.crs.infinite) {
					var invertedY = this._globalTileRange.max.y - coords.y;
					if (this.options.tms) {
						data['y'] = invertedY;
					}
					data['-y'] = invertedY;
				}

				return template(this._url, extend(data, this.options));
			},

			_tileOnLoad: function _tileOnLoad(done, tile) {
				// For https://github.com/Leaflet/Leaflet/issues/3332
				if (ielt9) {
					setTimeout(bind(done, this, null, tile), 0);
				} else {
					done(null, tile);
				}
			},

			_tileOnError: function _tileOnError(done, tile, e) {
				var errorUrl = this.options.errorTileUrl;
				if (errorUrl && tile.src !== errorUrl) {
					tile.src = errorUrl;
				}
				done(e, tile);
			},

			_onTileRemove: function _onTileRemove(e) {
				e.tile.onload = null;
			},

			_getZoomForUrl: function _getZoomForUrl() {
				var zoom = this._tileZoom,
				    maxZoom = this.options.maxZoom,
				    zoomReverse = this.options.zoomReverse,
				    zoomOffset = this.options.zoomOffset;

				if (zoomReverse) {
					zoom = maxZoom - zoom;
				}

				return zoom + zoomOffset;
			},

			_getSubdomain: function _getSubdomain(tilePoint) {
				var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
				return this.options.subdomains[index];
			},

			// stops loading all tiles in the background layer
			_abortLoading: function _abortLoading() {
				var i, tile;
				for (i in this._tiles) {
					if (this._tiles[i].coords.z !== this._tileZoom) {
						tile = this._tiles[i].el;

						tile.onload = falseFn;
						tile.onerror = falseFn;

						if (!tile.complete) {
							tile.src = emptyImageUrl;
							_remove(tile);
						}
					}
				}
			}
		});

		// @factory L.tilelayer(urlTemplate: String, options?: TileLayer options)
		// Instantiates a tile layer object given a `URL template` and optionally an options object.

		function tileLayer(url, options) {
			return new TileLayer(url, options);
		}

		/*
   * @class TileLayer.WMS
   * @inherits TileLayer
   * @aka L.TileLayer.WMS
   * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services as tile layers on the map. Extends `TileLayer`.
   *
   * @example
   *
   * ```js
   * var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
   * 	layers: 'nexrad-n0r-900913',
   * 	format: 'image/png',
   * 	transparent: true,
   * 	attribution: "Weather data © 2012 IEM Nexrad"
   * });
   * ```
   */

		var TileLayerWMS = TileLayer.extend({

			// @section
			// @aka TileLayer.WMS options
			// If any custom options not documented here are used, they will be sent to the
			// WMS server as extra parameters in each request URL. This can be useful for
			// [non-standard vendor WMS parameters](http://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
			defaultWmsParams: {
				service: 'WMS',
				request: 'GetMap',

				// @option layers: String = ''
				// **(required)** Comma-separated list of WMS layers to show.
				layers: '',

				// @option styles: String = ''
				// Comma-separated list of WMS styles.
				styles: '',

				// @option format: String = 'image/jpeg'
				// WMS image format (use `'image/png'` for layers with transparency).
				format: 'image/jpeg',

				// @option transparent: Boolean = false
				// If `true`, the WMS service will return images with transparency.
				transparent: false,

				// @option version: String = '1.1.1'
				// Version of the WMS service to use
				version: '1.1.1'
			},

			options: {
				// @option crs: CRS = null
				// Coordinate Reference System to use for the WMS requests, defaults to
				// map CRS. Don't change this if you're not sure what it means.
				crs: null,

				// @option uppercase: Boolean = false
				// If `true`, WMS request parameter keys will be uppercase.
				uppercase: false
			},

			initialize: function initialize(url, options) {

				this._url = url;

				var wmsParams = extend({}, this.defaultWmsParams);

				// all keys that are not TileLayer options go to WMS params
				for (var i in options) {
					if (!(i in this.options)) {
						wmsParams[i] = options[i];
					}
				}

				options = setOptions(this, options);

				wmsParams.width = wmsParams.height = options.tileSize * (options.detectRetina && retina ? 2 : 1);

				this.wmsParams = wmsParams;
			},

			onAdd: function onAdd(map) {

				this._crs = this.options.crs || map.options.crs;
				this._wmsVersion = parseFloat(this.wmsParams.version);

				var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
				this.wmsParams[projectionKey] = this._crs.code;

				TileLayer.prototype.onAdd.call(this, map);
			},

			getTileUrl: function getTileUrl(coords) {

				var tileBounds = this._tileCoordsToBounds(coords),
				    nw = this._crs.project(tileBounds.getNorthWest()),
				    se = this._crs.project(tileBounds.getSouthEast()),
				    bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ? [se.y, nw.x, nw.y, se.x] : [nw.x, se.y, se.x, nw.y]).join(','),
				    url = TileLayer.prototype.getTileUrl.call(this, coords);

				return url + getParamString(this.wmsParams, url, this.options.uppercase) + (this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
			},

			// @method setParams(params: Object, noRedraw?: Boolean): this
			// Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
			setParams: function setParams(params, noRedraw) {

				extend(this.wmsParams, params);

				if (!noRedraw) {
					this.redraw();
				}

				return this;
			}
		});

		// @factory L.tileLayer.wms(baseUrl: String, options: TileLayer.WMS options)
		// Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
		function tileLayerWMS(url, options) {
			return new TileLayerWMS(url, options);
		}

		TileLayer.WMS = TileLayerWMS;
		tileLayer.wms = tileLayerWMS;

		/*
   * @class Renderer
   * @inherits Layer
   * @aka L.Renderer
   *
   * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
   * DOM container of the renderer, its bounds, and its zoom animation.
   *
   * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
   * itself can be added or removed to the map. All paths use a renderer, which can
   * be implicit (the map will decide the type of renderer and use it automatically)
   * or explicit (using the [`renderer`](#path-renderer) option of the path).
   *
   * Do not use this class directly, use `SVG` and `Canvas` instead.
   *
   * @event update: Event
   * Fired when the renderer updates its bounds, center and zoom, for example when
   * its map has moved
   */

		var Renderer = Layer.extend({

			// @section
			// @aka Renderer options
			options: {
				// @option padding: Number = 0.1
				// How much to extend the clip area around the map view (relative to its size)
				// e.g. 0.1 would be 10% of map view in each direction
				padding: 0.1
			},

			initialize: function initialize(options) {
				setOptions(this, options);
				stamp(this);
				this._layers = this._layers || {};
			},

			onAdd: function onAdd() {
				if (!this._container) {
					this._initContainer(); // defined by renderer implementations

					if (this._zoomAnimated) {
						addClass(this._container, 'leaflet-zoom-animated');
					}
				}

				this.getPane().appendChild(this._container);
				this._update();
				this.on('update', this._updatePaths, this);
			},

			onRemove: function onRemove() {
				this.off('update', this._updatePaths, this);
				this._destroyContainer();
			},

			getEvents: function getEvents() {
				var events = {
					viewreset: this._reset,
					zoom: this._onZoom,
					moveend: this._update,
					zoomend: this._onZoomEnd
				};
				if (this._zoomAnimated) {
					events.zoomanim = this._onAnimZoom;
				}
				return events;
			},

			_onAnimZoom: function _onAnimZoom(ev) {
				this._updateTransform(ev.center, ev.zoom);
			},

			_onZoom: function _onZoom() {
				this._updateTransform(this._map.getCenter(), this._map.getZoom());
			},

			_updateTransform: function _updateTransform(center, zoom) {
				var scale = this._map.getZoomScale(zoom, this._zoom),
				    position = getPosition(this._container),
				    viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
				    currentCenterPoint = this._map.project(this._center, zoom),
				    destCenterPoint = this._map.project(center, zoom),
				    centerOffset = destCenterPoint.subtract(currentCenterPoint),
				    topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

				if (any3d) {
					setTransform(this._container, topLeftOffset, scale);
				} else {
					setPosition(this._container, topLeftOffset);
				}
			},

			_reset: function _reset() {
				this._update();
				this._updateTransform(this._center, this._zoom);

				for (var id in this._layers) {
					this._layers[id]._reset();
				}
			},

			_onZoomEnd: function _onZoomEnd() {
				for (var id in this._layers) {
					this._layers[id]._project();
				}
			},

			_updatePaths: function _updatePaths() {
				for (var id in this._layers) {
					this._layers[id]._update();
				}
			},

			_update: function _update() {
				// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
				// Subclasses are responsible of firing the 'update' event.
				var p = this.options.padding,
				    size = this._map.getSize(),
				    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

				this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

				this._center = this._map.getCenter();
				this._zoom = this._map.getZoom();
			}
		});

		/*
   * @class Canvas
   * @inherits Renderer
   * @aka L.Canvas
   *
   * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
   * Inherits `Renderer`.
   *
   * Due to [technical limitations](http://caniuse.com/#search=canvas), Canvas is not
   * available in all web browsers, notably IE8, and overlapping geometries might
   * not display properly in some edge cases.
   *
   * @example
   *
   * Use Canvas by default for all paths in the map:
   *
   * ```js
   * var map = L.map('map', {
   * 	renderer: L.canvas()
   * });
   * ```
   *
   * Use a Canvas renderer with extra padding for specific vector geometries:
   *
   * ```js
   * var map = L.map('map');
   * var myRenderer = L.canvas({ padding: 0.5 });
   * var line = L.polyline( coordinates, { renderer: myRenderer } );
   * var circle = L.circle( center, { renderer: myRenderer } );
   * ```
   */

		var Canvas = Renderer.extend({
			getEvents: function getEvents() {
				var events = Renderer.prototype.getEvents.call(this);
				events.viewprereset = this._onViewPreReset;
				return events;
			},

			_onViewPreReset: function _onViewPreReset() {
				// Set a flag so that a viewprereset+moveend+viewreset only updates&redraws once
				this._postponeUpdatePaths = true;
			},

			onAdd: function onAdd() {
				Renderer.prototype.onAdd.call(this);

				// Redraw vectors since canvas is cleared upon removal,
				// in case of removing the renderer itself from the map.
				this._draw();
			},

			_initContainer: function _initContainer() {
				var container = this._container = document.createElement('canvas');

				on(container, 'mousemove', throttle(this._onMouseMove, 32, this), this);
				on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this);
				on(container, 'mouseout', this._handleMouseOut, this);

				this._ctx = container.getContext('2d');
			},

			_destroyContainer: function _destroyContainer() {
				delete this._ctx;
				_remove(this._container);
				off(this._container);
				delete this._container;
			},

			_updatePaths: function _updatePaths() {
				if (this._postponeUpdatePaths) {
					return;
				}

				var layer;
				this._redrawBounds = null;
				for (var id in this._layers) {
					layer = this._layers[id];
					layer._update();
				}
				this._redraw();
			},

			_update: function _update() {
				if (this._map._animatingZoom && this._bounds) {
					return;
				}

				this._drawnLayers = {};

				Renderer.prototype._update.call(this);

				var b = this._bounds,
				    container = this._container,
				    size = b.getSize(),
				    m = retina ? 2 : 1;

				setPosition(container, b.min);

				// set canvas size (also clearing it); use double size on retina
				container.width = m * size.x;
				container.height = m * size.y;
				container.style.width = size.x + 'px';
				container.style.height = size.y + 'px';

				if (retina) {
					this._ctx.scale(2, 2);
				}

				// translate so we use the same path coordinates after canvas element moves
				this._ctx.translate(-b.min.x, -b.min.y);

				// Tell paths to redraw themselves
				this.fire('update');
			},

			_reset: function _reset() {
				Renderer.prototype._reset.call(this);

				if (this._postponeUpdatePaths) {
					this._postponeUpdatePaths = false;
					this._updatePaths();
				}
			},

			_initPath: function _initPath(layer) {
				this._updateDashArray(layer);
				this._layers[stamp(layer)] = layer;

				var order = layer._order = {
					layer: layer,
					prev: this._drawLast,
					next: null
				};
				if (this._drawLast) {
					this._drawLast.next = order;
				}
				this._drawLast = order;
				this._drawFirst = this._drawFirst || this._drawLast;
			},

			_addPath: function _addPath(layer) {
				this._requestRedraw(layer);
			},

			_removePath: function _removePath(layer) {
				var order = layer._order;
				var next = order.next;
				var prev = order.prev;

				if (next) {
					next.prev = prev;
				} else {
					this._drawLast = prev;
				}
				if (prev) {
					prev.next = next;
				} else {
					this._drawFirst = next;
				}

				delete layer._order;

				delete this._layers[L.stamp(layer)];

				this._requestRedraw(layer);
			},

			_updatePath: function _updatePath(layer) {
				// Redraw the union of the layer's old pixel
				// bounds and the new pixel bounds.
				this._extendRedrawBounds(layer);
				layer._project();
				layer._update();
				// The redraw will extend the redraw bounds
				// with the new pixel bounds.
				this._requestRedraw(layer);
			},

			_updateStyle: function _updateStyle(layer) {
				this._updateDashArray(layer);
				this._requestRedraw(layer);
			},

			_updateDashArray: function _updateDashArray(layer) {
				if (layer.options.dashArray) {
					var parts = layer.options.dashArray.split(','),
					    dashArray = [],
					    i;
					for (i = 0; i < parts.length; i++) {
						dashArray.push(Number(parts[i]));
					}
					layer.options._dashArray = dashArray;
				}
			},

			_requestRedraw: function _requestRedraw(layer) {
				if (!this._map) {
					return;
				}

				this._extendRedrawBounds(layer);
				this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
			},

			_extendRedrawBounds: function _extendRedrawBounds(layer) {
				if (layer._pxBounds) {
					var padding = (layer.options.weight || 0) + 1;
					this._redrawBounds = this._redrawBounds || new Bounds();
					this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
					this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
				}
			},

			_redraw: function _redraw() {
				this._redrawRequest = null;

				if (this._redrawBounds) {
					this._redrawBounds.min._floor();
					this._redrawBounds.max._ceil();
				}

				this._clear(); // clear layers in redraw bounds
				this._draw(); // draw layers

				this._redrawBounds = null;
			},

			_clear: function _clear() {
				var bounds = this._redrawBounds;
				if (bounds) {
					var size = bounds.getSize();
					this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
				} else {
					this._ctx.clearRect(0, 0, this._container.width, this._container.height);
				}
			},

			_draw: function _draw() {
				var layer,
				    bounds = this._redrawBounds;
				this._ctx.save();
				if (bounds) {
					var size = bounds.getSize();
					this._ctx.beginPath();
					this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
					this._ctx.clip();
				}

				this._drawing = true;

				for (var order = this._drawFirst; order; order = order.next) {
					layer = order.layer;
					if (!bounds || layer._pxBounds && layer._pxBounds.intersects(bounds)) {
						layer._updatePath();
					}
				}

				this._drawing = false;

				this._ctx.restore(); // Restore state before clipping.
			},

			_updatePoly: function _updatePoly(layer, closed) {
				if (!this._drawing) {
					return;
				}

				var i,
				    j,
				    len2,
				    p,
				    parts = layer._parts,
				    len = parts.length,
				    ctx = this._ctx;

				if (!len) {
					return;
				}

				this._drawnLayers[layer._leaflet_id] = layer;

				ctx.beginPath();

				for (i = 0; i < len; i++) {
					for (j = 0, len2 = parts[i].length; j < len2; j++) {
						p = parts[i][j];
						ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
					}
					if (closed) {
						ctx.closePath();
					}
				}

				this._fillStroke(ctx, layer);

				// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
			},

			_updateCircle: function _updateCircle(layer) {

				if (!this._drawing || layer._empty()) {
					return;
				}

				var p = layer._point,
				    ctx = this._ctx,
				    r = layer._radius,
				    s = (layer._radiusY || r) / r;

				this._drawnLayers[layer._leaflet_id] = layer;

				if (s !== 1) {
					ctx.save();
					ctx.scale(1, s);
				}

				ctx.beginPath();
				ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

				if (s !== 1) {
					ctx.restore();
				}

				this._fillStroke(ctx, layer);
			},

			_fillStroke: function _fillStroke(ctx, layer) {
				var options = layer.options;

				if (options.fill) {
					ctx.globalAlpha = options.fillOpacity;
					ctx.fillStyle = options.fillColor || options.color;
					ctx.fill(options.fillRule || 'evenodd');
				}

				if (options.stroke && options.weight !== 0) {
					if (ctx.setLineDash) {
						ctx.setLineDash(layer.options && layer.options._dashArray || []);
					}
					ctx.globalAlpha = options.opacity;
					ctx.lineWidth = options.weight;
					ctx.strokeStyle = options.color;
					ctx.lineCap = options.lineCap;
					ctx.lineJoin = options.lineJoin;
					ctx.stroke();
				}
			},

			// Canvas obviously doesn't have mouse events for individual drawn objects,
			// so we emulate that by calculating what's under the mouse on mousemove/click manually

			_onClick: function _onClick(e) {
				var point = this._map.mouseEventToLayerPoint(e),
				    layer,
				    clickedLayer;

				for (var order = this._drawFirst; order; order = order.next) {
					layer = order.layer;
					if (layer.options.interactive && layer._containsPoint(point) && !this._map._draggableMoved(layer)) {
						clickedLayer = layer;
					}
				}
				if (clickedLayer) {
					fakeStop(e);
					this._fireEvent([clickedLayer], e);
				}
			},

			_onMouseMove: function _onMouseMove(e) {
				if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) {
					return;
				}

				var point = this._map.mouseEventToLayerPoint(e);
				this._handleMouseHover(e, point);
			},

			_handleMouseOut: function _handleMouseOut(e) {
				var layer = this._hoveredLayer;
				if (layer) {
					// if we're leaving the layer, fire mouseout
					removeClass(this._container, 'leaflet-interactive');
					this._fireEvent([layer], e, 'mouseout');
					this._hoveredLayer = null;
				}
			},

			_handleMouseHover: function _handleMouseHover(e, point) {
				var layer, candidateHoveredLayer;

				for (var order = this._drawFirst; order; order = order.next) {
					layer = order.layer;
					if (layer.options.interactive && layer._containsPoint(point)) {
						candidateHoveredLayer = layer;
					}
				}

				if (candidateHoveredLayer !== this._hoveredLayer) {
					this._handleMouseOut(e);

					if (candidateHoveredLayer) {
						addClass(this._container, 'leaflet-interactive'); // change cursor
						this._fireEvent([candidateHoveredLayer], e, 'mouseover');
						this._hoveredLayer = candidateHoveredLayer;
					}
				}

				if (this._hoveredLayer) {
					this._fireEvent([this._hoveredLayer], e);
				}
			},

			_fireEvent: function _fireEvent(layers, e, type) {
				this._map._fireDOMEvent(e, type || e.type, layers);
			},

			_bringToFront: function _bringToFront(layer) {
				var order = layer._order;
				var next = order.next;
				var prev = order.prev;

				if (next) {
					next.prev = prev;
				} else {
					// Already last
					return;
				}
				if (prev) {
					prev.next = next;
				} else if (next) {
					// Update first entry unless this is the
					// signle entry
					this._drawFirst = next;
				}

				order.prev = this._drawLast;
				this._drawLast.next = order;

				order.next = null;
				this._drawLast = order;

				this._requestRedraw(layer);
			},

			_bringToBack: function _bringToBack(layer) {
				var order = layer._order;
				var next = order.next;
				var prev = order.prev;

				if (prev) {
					prev.next = next;
				} else {
					// Already first
					return;
				}
				if (next) {
					next.prev = prev;
				} else if (prev) {
					// Update last entry unless this is the
					// signle entry
					this._drawLast = prev;
				}

				order.prev = null;

				order.next = this._drawFirst;
				this._drawFirst.prev = order;
				this._drawFirst = order;

				this._requestRedraw(layer);
			}
		});

		// @factory L.canvas(options?: Renderer options)
		// Creates a Canvas renderer with the given options.
		function canvas$1(options) {
			return canvas ? new Canvas(options) : null;
		}

		/*
   * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
   */

		var vmlCreate = function () {
			try {
				document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
				return function (name) {
					return document.createElement('<lvml:' + name + ' class="lvml">');
				};
			} catch (e) {
				return function (name) {
					return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
				};
			}
		}();

		/*
   * @class SVG
   *
   * Although SVG is not available on IE7 and IE8, these browsers support [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language), and the SVG renderer will fall back to VML in this case.
   *
   * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
   * with old versions of Internet Explorer.
   */

		// mixin to redefine some SVG methods to handle VML syntax which is similar but with some differences
		var vmlMixin = {

			_initContainer: function _initContainer() {
				this._container = create$1('div', 'leaflet-vml-container');
			},

			_update: function _update() {
				if (this._map._animatingZoom) {
					return;
				}
				Renderer.prototype._update.call(this);
				this.fire('update');
			},

			_initPath: function _initPath(layer) {
				var container = layer._container = vmlCreate('shape');

				addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));

				container.coordsize = '1 1';

				layer._path = vmlCreate('path');
				container.appendChild(layer._path);

				this._updateStyle(layer);
				this._layers[stamp(layer)] = layer;
			},

			_addPath: function _addPath(layer) {
				var container = layer._container;
				this._container.appendChild(container);

				if (layer.options.interactive) {
					layer.addInteractiveTarget(container);
				}
			},

			_removePath: function _removePath(layer) {
				var container = layer._container;
				_remove(container);
				layer.removeInteractiveTarget(container);
				delete this._layers[stamp(layer)];
			},

			_updateStyle: function _updateStyle(layer) {
				var stroke = layer._stroke,
				    fill = layer._fill,
				    options = layer.options,
				    container = layer._container;

				container.stroked = !!options.stroke;
				container.filled = !!options.fill;

				if (options.stroke) {
					if (!stroke) {
						stroke = layer._stroke = vmlCreate('stroke');
					}
					container.appendChild(stroke);
					stroke.weight = options.weight + 'px';
					stroke.color = options.color;
					stroke.opacity = options.opacity;

					if (options.dashArray) {
						stroke.dashStyle = isArray(options.dashArray) ? options.dashArray.join(' ') : options.dashArray.replace(/( *, *)/g, ' ');
					} else {
						stroke.dashStyle = '';
					}
					stroke.endcap = options.lineCap.replace('butt', 'flat');
					stroke.joinstyle = options.lineJoin;
				} else if (stroke) {
					container.removeChild(stroke);
					layer._stroke = null;
				}

				if (options.fill) {
					if (!fill) {
						fill = layer._fill = vmlCreate('fill');
					}
					container.appendChild(fill);
					fill.color = options.fillColor || options.color;
					fill.opacity = options.fillOpacity;
				} else if (fill) {
					container.removeChild(fill);
					layer._fill = null;
				}
			},

			_updateCircle: function _updateCircle(layer) {
				var p = layer._point.round(),
				    r = Math.round(layer._radius),
				    r2 = Math.round(layer._radiusY || r);

				this._setPath(layer, layer._empty() ? 'M0 0' : 'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + 65535 * 360);
			},

			_setPath: function _setPath(layer, path) {
				layer._path.v = path;
			},

			_bringToFront: function _bringToFront(layer) {
				toFront(layer._container);
			},

			_bringToBack: function _bringToBack(layer) {
				toBack(layer._container);
			}
		};

		var create$2 = vml ? vmlCreate : svgCreate;

		/*
   * @class SVG
   * @inherits Renderer
   * @aka L.SVG
   *
   * Allows vector layers to be displayed with [SVG](https://developer.mozilla.org/docs/Web/SVG).
   * Inherits `Renderer`.
   *
   * Due to [technical limitations](http://caniuse.com/#search=svg), SVG is not
   * available in all web browsers, notably Android 2.x and 3.x.
   *
   * Although SVG is not available on IE7 and IE8, these browsers support
   * [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language)
   * (a now deprecated technology), and the SVG renderer will fall back to VML in
   * this case.
   *
   * @example
   *
   * Use SVG by default for all paths in the map:
   *
   * ```js
   * var map = L.map('map', {
   * 	renderer: L.svg()
   * });
   * ```
   *
   * Use a SVG renderer with extra padding for specific vector geometries:
   *
   * ```js
   * var map = L.map('map');
   * var myRenderer = L.svg({ padding: 0.5 });
   * var line = L.polyline( coordinates, { renderer: myRenderer } );
   * var circle = L.circle( center, { renderer: myRenderer } );
   * ```
   */

		var SVG = Renderer.extend({

			getEvents: function getEvents() {
				var events = Renderer.prototype.getEvents.call(this);
				events.zoomstart = this._onZoomStart;
				return events;
			},

			_initContainer: function _initContainer() {
				this._container = create$2('svg');

				// makes it possible to click through svg root; we'll reset it back in individual paths
				this._container.setAttribute('pointer-events', 'none');

				this._rootGroup = create$2('g');
				this._container.appendChild(this._rootGroup);
			},

			_destroyContainer: function _destroyContainer() {
				_remove(this._container);
				off(this._container);
				delete this._container;
				delete this._rootGroup;
			},

			_onZoomStart: function _onZoomStart() {
				// Drag-then-pinch interactions might mess up the center and zoom.
				// In this case, the easiest way to prevent this is re-do the renderer
				//   bounds and padding when the zooming starts.
				this._update();
			},

			_update: function _update() {
				if (this._map._animatingZoom && this._bounds) {
					return;
				}

				Renderer.prototype._update.call(this);

				var b = this._bounds,
				    size = b.getSize(),
				    container = this._container;

				// set size of svg-container if changed
				if (!this._svgSize || !this._svgSize.equals(size)) {
					this._svgSize = size;
					container.setAttribute('width', size.x);
					container.setAttribute('height', size.y);
				}

				// movement: update container viewBox so that we don't have to change coordinates of individual layers
				setPosition(container, b.min);
				container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));

				this.fire('update');
			},

			// methods below are called by vector layers implementations

			_initPath: function _initPath(layer) {
				var path = layer._path = create$2('path');

				// @namespace Path
				// @option className: String = null
				// Custom class name set on an element. Only for SVG renderer.
				if (layer.options.className) {
					addClass(path, layer.options.className);
				}

				if (layer.options.interactive) {
					addClass(path, 'leaflet-interactive');
				}

				this._updateStyle(layer);
				this._layers[stamp(layer)] = layer;
			},

			_addPath: function _addPath(layer) {
				if (!this._rootGroup) {
					this._initContainer();
				}
				this._rootGroup.appendChild(layer._path);
				layer.addInteractiveTarget(layer._path);
			},

			_removePath: function _removePath(layer) {
				_remove(layer._path);
				layer.removeInteractiveTarget(layer._path);
				delete this._layers[stamp(layer)];
			},

			_updatePath: function _updatePath(layer) {
				layer._project();
				layer._update();
			},

			_updateStyle: function _updateStyle(layer) {
				var path = layer._path,
				    options = layer.options;

				if (!path) {
					return;
				}

				if (options.stroke) {
					path.setAttribute('stroke', options.color);
					path.setAttribute('stroke-opacity', options.opacity);
					path.setAttribute('stroke-width', options.weight);
					path.setAttribute('stroke-linecap', options.lineCap);
					path.setAttribute('stroke-linejoin', options.lineJoin);

					if (options.dashArray) {
						path.setAttribute('stroke-dasharray', options.dashArray);
					} else {
						path.removeAttribute('stroke-dasharray');
					}

					if (options.dashOffset) {
						path.setAttribute('stroke-dashoffset', options.dashOffset);
					} else {
						path.removeAttribute('stroke-dashoffset');
					}
				} else {
					path.setAttribute('stroke', 'none');
				}

				if (options.fill) {
					path.setAttribute('fill', options.fillColor || options.color);
					path.setAttribute('fill-opacity', options.fillOpacity);
					path.setAttribute('fill-rule', options.fillRule || 'evenodd');
				} else {
					path.setAttribute('fill', 'none');
				}
			},

			_updatePoly: function _updatePoly(layer, closed) {
				this._setPath(layer, pointsToPath(layer._parts, closed));
			},

			_updateCircle: function _updateCircle(layer) {
				var p = layer._point,
				    r = layer._radius,
				    r2 = layer._radiusY || r,
				    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

				// drawing a circle with two half-arcs
				var d = layer._empty() ? 'M0 0' : 'M' + (p.x - r) + ',' + p.y + arc + r * 2 + ',0 ' + arc + -r * 2 + ',0 ';

				this._setPath(layer, d);
			},

			_setPath: function _setPath(layer, path) {
				layer._path.setAttribute('d', path);
			},

			// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
			_bringToFront: function _bringToFront(layer) {
				toFront(layer._path);
			},

			_bringToBack: function _bringToBack(layer) {
				toBack(layer._path);
			}
		});

		if (vml) {
			SVG.include(vmlMixin);
		}

		// @factory L.svg(options?: Renderer options)
		// Creates a SVG renderer with the given options.
		function svg$1(options) {
			return svg || vml ? new SVG(options) : null;
		}

		Map.include({
			// @namespace Map; @method getRenderer(layer: Path): Renderer
			// Returns the instance of `Renderer` that should be used to render the given
			// `Path`. It will ensure that the `renderer` options of the map and paths
			// are respected, and that the renderers do exist on the map.
			getRenderer: function getRenderer(layer) {
				// @namespace Path; @option renderer: Renderer
				// Use this specific instance of `Renderer` for this path. Takes
				// precedence over the map's [default renderer](#map-renderer).
				var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;

				if (!renderer) {
					// @namespace Map; @option preferCanvas: Boolean = false
					// Whether `Path`s should be rendered on a `Canvas` renderer.
					// By default, all `Path`s are rendered in a `SVG` renderer.
					renderer = this._renderer = this.options.preferCanvas && canvas$1() || svg$1();
				}

				if (!this.hasLayer(renderer)) {
					this.addLayer(renderer);
				}
				return renderer;
			},

			_getPaneRenderer: function _getPaneRenderer(name) {
				if (name === 'overlayPane' || name === undefined) {
					return false;
				}

				var renderer = this._paneRenderers[name];
				if (renderer === undefined) {
					renderer = SVG && svg$1({ pane: name }) || Canvas && canvas$1({ pane: name });
					this._paneRenderers[name] = renderer;
				}
				return renderer;
			}
		});

		/*
   * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
   */

		/*
   * @class Rectangle
   * @aka L.Retangle
   * @inherits Polygon
   *
   * A class for drawing rectangle overlays on a map. Extends `Polygon`.
   *
   * @example
   *
   * ```js
   * // define rectangle geographical bounds
   * var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
   *
   * // create an orange rectangle
   * L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
   *
   * // zoom the map to the rectangle bounds
   * map.fitBounds(bounds);
   * ```
   *
   */

		var Rectangle = Polygon.extend({
			initialize: function initialize(latLngBounds, options) {
				Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
			},

			// @method setBounds(latLngBounds: LatLngBounds): this
			// Redraws the rectangle with the passed bounds.
			setBounds: function setBounds(latLngBounds) {
				return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
			},

			_boundsToLatLngs: function _boundsToLatLngs(latLngBounds) {
				latLngBounds = toLatLngBounds(latLngBounds);
				return [latLngBounds.getSouthWest(), latLngBounds.getNorthWest(), latLngBounds.getNorthEast(), latLngBounds.getSouthEast()];
			}
		});

		// @factory L.rectangle(latLngBounds: LatLngBounds, options?: Polyline options)
		function rectangle(latLngBounds, options) {
			return new Rectangle(latLngBounds, options);
		}

		SVG.create = create$2;
		SVG.pointsToPath = pointsToPath;

		GeoJSON.geometryToLayer = geometryToLayer;
		GeoJSON.coordsToLatLng = coordsToLatLng;
		GeoJSON.coordsToLatLngs = coordsToLatLngs;
		GeoJSON.latLngToCoords = latLngToCoords;
		GeoJSON.latLngsToCoords = latLngsToCoords;
		GeoJSON.getFeature = getFeature;
		GeoJSON.asFeature = asFeature;

		/*
   * L.Handler.BoxZoom is used to add shift-drag zoom interaction to the map
   * (zoom to a selected bounding box), enabled by default.
   */

		// @namespace Map
		// @section Interaction Options
		Map.mergeOptions({
			// @option boxZoom: Boolean = true
			// Whether the map can be zoomed to a rectangular area specified by
			// dragging the mouse while pressing the shift key.
			boxZoom: true
		});

		var BoxZoom = Handler.extend({
			initialize: function initialize(map) {
				this._map = map;
				this._container = map._container;
				this._pane = map._panes.overlayPane;
				this._resetStateTimeout = 0;
				map.on('unload', this._destroy, this);
			},

			addHooks: function addHooks() {
				on(this._container, 'mousedown', this._onMouseDown, this);
			},

			removeHooks: function removeHooks() {
				off(this._container, 'mousedown', this._onMouseDown, this);
			},

			moved: function moved() {
				return this._moved;
			},

			_destroy: function _destroy() {
				_remove(this._pane);
				delete this._pane;
			},

			_resetState: function _resetState() {
				this._resetStateTimeout = 0;
				this._moved = false;
			},

			_clearDeferredResetState: function _clearDeferredResetState() {
				if (this._resetStateTimeout !== 0) {
					clearTimeout(this._resetStateTimeout);
					this._resetStateTimeout = 0;
				}
			},

			_onMouseDown: function _onMouseDown(e) {
				if (!e.shiftKey || e.which !== 1 && e.button !== 1) {
					return false;
				}

				// Clear the deferred resetState if it hasn't executed yet, otherwise it
				// will interrupt the interaction and orphan a box element in the container.
				this._clearDeferredResetState();
				this._resetState();

				disableTextSelection();
				disableImageDrag();

				this._startPoint = this._map.mouseEventToContainerPoint(e);

				on(document, {
					contextmenu: stop,
					mousemove: this._onMouseMove,
					mouseup: this._onMouseUp,
					keydown: this._onKeyDown
				}, this);
			},

			_onMouseMove: function _onMouseMove(e) {
				if (!this._moved) {
					this._moved = true;

					this._box = create$1('div', 'leaflet-zoom-box', this._container);
					addClass(this._container, 'leaflet-crosshair');

					this._map.fire('boxzoomstart');
				}

				this._point = this._map.mouseEventToContainerPoint(e);

				var bounds = new Bounds(this._point, this._startPoint),
				    size = bounds.getSize();

				setPosition(this._box, bounds.min);

				this._box.style.width = size.x + 'px';
				this._box.style.height = size.y + 'px';
			},

			_finish: function _finish() {
				if (this._moved) {
					_remove(this._box);
					removeClass(this._container, 'leaflet-crosshair');
				}

				enableTextSelection();
				enableImageDrag();

				off(document, {
					contextmenu: stop,
					mousemove: this._onMouseMove,
					mouseup: this._onMouseUp,
					keydown: this._onKeyDown
				}, this);
			},

			_onMouseUp: function _onMouseUp(e) {
				if (e.which !== 1 && e.button !== 1) {
					return;
				}

				this._finish();

				if (!this._moved) {
					return;
				}
				// Postpone to next JS tick so internal click event handling
				// still see it as "moved".
				this._clearDeferredResetState();
				this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);

				var bounds = new LatLngBounds(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point));

				this._map.fitBounds(bounds).fire('boxzoomend', { boxZoomBounds: bounds });
			},

			_onKeyDown: function _onKeyDown(e) {
				if (e.keyCode === 27) {
					this._finish();
				}
			}
		});

		// @section Handlers
		// @property boxZoom: Handler
		// Box (shift-drag with mouse) zoom handler.
		Map.addInitHook('addHandler', 'boxZoom', BoxZoom);

		/*
   * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
   */

		// @namespace Map
		// @section Interaction Options

		Map.mergeOptions({
			// @option doubleClickZoom: Boolean|String = true
			// Whether the map can be zoomed in by double clicking on it and
			// zoomed out by double clicking while holding shift. If passed
			// `'center'`, double-click zoom will zoom to the center of the
			//  view regardless of where the mouse was.
			doubleClickZoom: true
		});

		var DoubleClickZoom = Handler.extend({
			addHooks: function addHooks() {
				this._map.on('dblclick', this._onDoubleClick, this);
			},

			removeHooks: function removeHooks() {
				this._map.off('dblclick', this._onDoubleClick, this);
			},

			_onDoubleClick: function _onDoubleClick(e) {
				var map = this._map,
				    oldZoom = map.getZoom(),
				    delta = map.options.zoomDelta,
				    zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

				if (map.options.doubleClickZoom === 'center') {
					map.setZoom(zoom);
				} else {
					map.setZoomAround(e.containerPoint, zoom);
				}
			}
		});

		// @section Handlers
		//
		// Map properties include interaction handlers that allow you to control
		// interaction behavior in runtime, enabling or disabling certain features such
		// as dragging or touch zoom (see `Handler` methods). For example:
		//
		// ```js
		// map.doubleClickZoom.disable();
		// ```
		//
		// @property doubleClickZoom: Handler
		// Double click zoom handler.
		Map.addInitHook('addHandler', 'doubleClickZoom', DoubleClickZoom);

		/*
   * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
   */

		// @namespace Map
		// @section Interaction Options
		Map.mergeOptions({
			// @option dragging: Boolean = true
			// Whether the map be draggable with mouse/touch or not.
			dragging: true,

			// @section Panning Inertia Options
			// @option inertia: Boolean = *
			// If enabled, panning of the map will have an inertia effect where
			// the map builds momentum while dragging and continues moving in
			// the same direction for some time. Feels especially nice on touch
			// devices. Enabled by default unless running on old Android devices.
			inertia: !android23,

			// @option inertiaDeceleration: Number = 3000
			// The rate with which the inertial movement slows down, in pixels/second².
			inertiaDeceleration: 3400, // px/s^2

			// @option inertiaMaxSpeed: Number = Infinity
			// Max speed of the inertial movement, in pixels/second.
			inertiaMaxSpeed: Infinity, // px/s

			// @option easeLinearity: Number = 0.2
			easeLinearity: 0.2,

			// TODO refactor, move to CRS
			// @option worldCopyJump: Boolean = false
			// With this option enabled, the map tracks when you pan to another "copy"
			// of the world and seamlessly jumps to the original one so that all overlays
			// like markers and vector layers are still visible.
			worldCopyJump: false,

			// @option maxBoundsViscosity: Number = 0.0
			// If `maxBounds` is set, this option will control how solid the bounds
			// are when dragging the map around. The default value of `0.0` allows the
			// user to drag outside the bounds at normal speed, higher values will
			// slow down map dragging outside bounds, and `1.0` makes the bounds fully
			// solid, preventing the user from dragging outside the bounds.
			maxBoundsViscosity: 0.0
		});

		var Drag = Handler.extend({
			addHooks: function addHooks() {
				if (!this._draggable) {
					var map = this._map;

					this._draggable = new Draggable(map._mapPane, map._container);

					this._draggable.on({
						dragstart: this._onDragStart,
						drag: this._onDrag,
						dragend: this._onDragEnd
					}, this);

					this._draggable.on('predrag', this._onPreDragLimit, this);
					if (map.options.worldCopyJump) {
						this._draggable.on('predrag', this._onPreDragWrap, this);
						map.on('zoomend', this._onZoomEnd, this);

						map.whenReady(this._onZoomEnd, this);
					}
				}
				addClass(this._map._container, 'leaflet-grab leaflet-touch-drag');
				this._draggable.enable();
				this._positions = [];
				this._times = [];
			},

			removeHooks: function removeHooks() {
				removeClass(this._map._container, 'leaflet-grab');
				removeClass(this._map._container, 'leaflet-touch-drag');
				this._draggable.disable();
			},

			moved: function moved() {
				return this._draggable && this._draggable._moved;
			},

			moving: function moving() {
				return this._draggable && this._draggable._moving;
			},

			_onDragStart: function _onDragStart() {
				var map = this._map;

				map._stop();
				if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
					var bounds = toLatLngBounds(this._map.options.maxBounds);

					this._offsetLimit = toBounds(this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1), this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1).add(this._map.getSize()));

					this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
				} else {
					this._offsetLimit = null;
				}

				map.fire('movestart').fire('dragstart');

				if (map.options.inertia) {
					this._positions = [];
					this._times = [];
				}
			},

			_onDrag: function _onDrag(e) {
				if (this._map.options.inertia) {
					var time = this._lastTime = +new Date(),
					    pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;

					this._positions.push(pos);
					this._times.push(time);

					if (time - this._times[0] > 50) {
						this._positions.shift();
						this._times.shift();
					}
				}

				this._map.fire('move', e).fire('drag', e);
			},

			_onZoomEnd: function _onZoomEnd() {
				var pxCenter = this._map.getSize().divideBy(2),
				    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

				this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
				this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
			},

			_viscousLimit: function _viscousLimit(value, threshold) {
				return value - (value - threshold) * this._viscosity;
			},

			_onPreDragLimit: function _onPreDragLimit() {
				if (!this._viscosity || !this._offsetLimit) {
					return;
				}

				var offset = this._draggable._newPos.subtract(this._draggable._startPos);

				var limit = this._offsetLimit;
				if (offset.x < limit.min.x) {
					offset.x = this._viscousLimit(offset.x, limit.min.x);
				}
				if (offset.y < limit.min.y) {
					offset.y = this._viscousLimit(offset.y, limit.min.y);
				}
				if (offset.x > limit.max.x) {
					offset.x = this._viscousLimit(offset.x, limit.max.x);
				}
				if (offset.y > limit.max.y) {
					offset.y = this._viscousLimit(offset.y, limit.max.y);
				}

				this._draggable._newPos = this._draggable._startPos.add(offset);
			},

			_onPreDragWrap: function _onPreDragWrap() {
				// TODO refactor to be able to adjust map pane position after zoom
				var worldWidth = this._worldWidth,
				    halfWidth = Math.round(worldWidth / 2),
				    dx = this._initialWorldOffset,
				    x = this._draggable._newPos.x,
				    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
				    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
				    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

				this._draggable._absPos = this._draggable._newPos.clone();
				this._draggable._newPos.x = newX;
			},

			_onDragEnd: function _onDragEnd(e) {
				var map = this._map,
				    options = map.options,
				    noInertia = !options.inertia || this._times.length < 2;

				map.fire('dragend', e);

				if (noInertia) {
					map.fire('moveend');
				} else {

					var direction = this._lastPos.subtract(this._positions[0]),
					    duration = (this._lastTime - this._times[0]) / 1000,
					    ease = options.easeLinearity,
					    speedVector = direction.multiplyBy(ease / duration),
					    speed = speedVector.distanceTo([0, 0]),
					    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
					    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),
					    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
					    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

					if (!offset.x && !offset.y) {
						map.fire('moveend');
					} else {
						offset = map._limitOffset(offset, map.options.maxBounds);

						requestAnimFrame(function () {
							map.panBy(offset, {
								duration: decelerationDuration,
								easeLinearity: ease,
								noMoveStart: true,
								animate: true
							});
						});
					}
				}
			}
		});

		// @section Handlers
		// @property dragging: Handler
		// Map dragging handler (by both mouse and touch).
		Map.addInitHook('addHandler', 'dragging', Drag);

		/*
   * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
   */

		// @namespace Map
		// @section Keyboard Navigation Options
		Map.mergeOptions({
			// @option keyboard: Boolean = true
			// Makes the map focusable and allows users to navigate the map with keyboard
			// arrows and `+`/`-` keys.
			keyboard: true,

			// @option keyboardPanDelta: Number = 80
			// Amount of pixels to pan when pressing an arrow key.
			keyboardPanDelta: 80
		});

		var Keyboard = Handler.extend({

			keyCodes: {
				left: [37],
				right: [39],
				down: [40],
				up: [38],
				zoomIn: [187, 107, 61, 171],
				zoomOut: [189, 109, 54, 173]
			},

			initialize: function initialize(map) {
				this._map = map;

				this._setPanDelta(map.options.keyboardPanDelta);
				this._setZoomDelta(map.options.zoomDelta);
			},

			addHooks: function addHooks() {
				var container = this._map._container;

				// make the container focusable by tabbing
				if (container.tabIndex <= 0) {
					container.tabIndex = '0';
				}

				on(container, {
					focus: this._onFocus,
					blur: this._onBlur,
					mousedown: this._onMouseDown
				}, this);

				this._map.on({
					focus: this._addHooks,
					blur: this._removeHooks
				}, this);
			},

			removeHooks: function removeHooks() {
				this._removeHooks();

				off(this._map._container, {
					focus: this._onFocus,
					blur: this._onBlur,
					mousedown: this._onMouseDown
				}, this);

				this._map.off({
					focus: this._addHooks,
					blur: this._removeHooks
				}, this);
			},

			_onMouseDown: function _onMouseDown() {
				if (this._focused) {
					return;
				}

				var body = document.body,
				    docEl = document.documentElement,
				    top = body.scrollTop || docEl.scrollTop,
				    left = body.scrollLeft || docEl.scrollLeft;

				this._map._container.focus();

				window.scrollTo(left, top);
			},

			_onFocus: function _onFocus() {
				this._focused = true;
				this._map.fire('focus');
			},

			_onBlur: function _onBlur() {
				this._focused = false;
				this._map.fire('blur');
			},

			_setPanDelta: function _setPanDelta(panDelta) {
				var keys = this._panKeys = {},
				    codes = this.keyCodes,
				    i,
				    len;

				for (i = 0, len = codes.left.length; i < len; i++) {
					keys[codes.left[i]] = [-1 * panDelta, 0];
				}
				for (i = 0, len = codes.right.length; i < len; i++) {
					keys[codes.right[i]] = [panDelta, 0];
				}
				for (i = 0, len = codes.down.length; i < len; i++) {
					keys[codes.down[i]] = [0, panDelta];
				}
				for (i = 0, len = codes.up.length; i < len; i++) {
					keys[codes.up[i]] = [0, -1 * panDelta];
				}
			},

			_setZoomDelta: function _setZoomDelta(zoomDelta) {
				var keys = this._zoomKeys = {},
				    codes = this.keyCodes,
				    i,
				    len;

				for (i = 0, len = codes.zoomIn.length; i < len; i++) {
					keys[codes.zoomIn[i]] = zoomDelta;
				}
				for (i = 0, len = codes.zoomOut.length; i < len; i++) {
					keys[codes.zoomOut[i]] = -zoomDelta;
				}
			},

			_addHooks: function _addHooks() {
				on(document, 'keydown', this._onKeyDown, this);
			},

			_removeHooks: function _removeHooks() {
				off(document, 'keydown', this._onKeyDown, this);
			},

			_onKeyDown: function _onKeyDown(e) {
				if (e.altKey || e.ctrlKey || e.metaKey) {
					return;
				}

				var key = e.keyCode,
				    map = this._map,
				    offset;

				if (key in this._panKeys) {

					if (map._panAnim && map._panAnim._inProgress) {
						return;
					}

					offset = this._panKeys[key];
					if (e.shiftKey) {
						offset = toPoint(offset).multiplyBy(3);
					}

					map.panBy(offset);

					if (map.options.maxBounds) {
						map.panInsideBounds(map.options.maxBounds);
					}
				} else if (key in this._zoomKeys) {
					map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);
				} else if (key === 27 && map._popup) {
					map.closePopup();
				} else {
					return;
				}

				stop(e);
			}
		});

		// @section Handlers
		// @section Handlers
		// @property keyboard: Handler
		// Keyboard navigation handler.
		Map.addInitHook('addHandler', 'keyboard', Keyboard);

		/*
   * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
   */

		// @namespace Map
		// @section Interaction Options
		Map.mergeOptions({
			// @section Mousewheel options
			// @option scrollWheelZoom: Boolean|String = true
			// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
			// it will zoom to the center of the view regardless of where the mouse was.
			scrollWheelZoom: true,

			// @option wheelDebounceTime: Number = 40
			// Limits the rate at which a wheel can fire (in milliseconds). By default
			// user can't zoom via wheel more often than once per 40 ms.
			wheelDebounceTime: 40,

			// @option wheelPxPerZoomLevel: Number = 60
			// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
			// mean a change of one full zoom level. Smaller values will make wheel-zooming
			// faster (and vice versa).
			wheelPxPerZoomLevel: 60
		});

		var ScrollWheelZoom = Handler.extend({
			addHooks: function addHooks() {
				on(this._map._container, 'mousewheel', this._onWheelScroll, this);

				this._delta = 0;
			},

			removeHooks: function removeHooks() {
				off(this._map._container, 'mousewheel', this._onWheelScroll, this);
			},

			_onWheelScroll: function _onWheelScroll(e) {
				var delta = getWheelDelta(e);

				var debounce = this._map.options.wheelDebounceTime;

				this._delta += delta;
				this._lastMousePos = this._map.mouseEventToContainerPoint(e);

				if (!this._startTime) {
					this._startTime = +new Date();
				}

				var left = Math.max(debounce - (+new Date() - this._startTime), 0);

				clearTimeout(this._timer);
				this._timer = setTimeout(bind(this._performZoom, this), left);

				stop(e);
			},

			_performZoom: function _performZoom() {
				var map = this._map,
				    zoom = map.getZoom(),
				    snap = this._map.options.zoomSnap || 0;

				map._stop(); // stop panning and fly animations if any

				// map the delta with a sigmoid function to -4..4 range leaning on -1..1
				var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
				    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
				    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
				    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

				this._delta = 0;
				this._startTime = null;

				if (!delta) {
					return;
				}

				if (map.options.scrollWheelZoom === 'center') {
					map.setZoom(zoom + delta);
				} else {
					map.setZoomAround(this._lastMousePos, zoom + delta);
				}
			}
		});

		// @section Handlers
		// @property scrollWheelZoom: Handler
		// Scroll wheel zoom handler.
		Map.addInitHook('addHandler', 'scrollWheelZoom', ScrollWheelZoom);

		/*
   * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
   */

		// @namespace Map
		// @section Interaction Options
		Map.mergeOptions({
			// @section Touch interaction options
			// @option tap: Boolean = true
			// Enables mobile hacks for supporting instant taps (fixing 200ms click
			// delay on iOS/Android) and touch holds (fired as `contextmenu` events).
			tap: true,

			// @option tapTolerance: Number = 15
			// The max number of pixels a user can shift his finger during touch
			// for it to be considered a valid tap.
			tapTolerance: 15
		});

		var Tap = Handler.extend({
			addHooks: function addHooks() {
				on(this._map._container, 'touchstart', this._onDown, this);
			},

			removeHooks: function removeHooks() {
				off(this._map._container, 'touchstart', this._onDown, this);
			},

			_onDown: function _onDown(e) {
				if (!e.touches) {
					return;
				}

				preventDefault(e);

				this._fireClick = true;

				// don't simulate click or track longpress if more than 1 touch
				if (e.touches.length > 1) {
					this._fireClick = false;
					clearTimeout(this._holdTimeout);
					return;
				}

				var first = e.touches[0],
				    el = first.target;

				this._startPos = this._newPos = new Point(first.clientX, first.clientY);

				// if touching a link, highlight it
				if (el.tagName && el.tagName.toLowerCase() === 'a') {
					addClass(el, 'leaflet-active');
				}

				// simulate long hold but setting a timeout
				this._holdTimeout = setTimeout(bind(function () {
					if (this._isTapValid()) {
						this._fireClick = false;
						this._onUp();
						this._simulateEvent('contextmenu', first);
					}
				}, this), 1000);

				this._simulateEvent('mousedown', first);

				on(document, {
					touchmove: this._onMove,
					touchend: this._onUp
				}, this);
			},

			_onUp: function _onUp(e) {
				clearTimeout(this._holdTimeout);

				off(document, {
					touchmove: this._onMove,
					touchend: this._onUp
				}, this);

				if (this._fireClick && e && e.changedTouches) {

					var first = e.changedTouches[0],
					    el = first.target;

					if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
						removeClass(el, 'leaflet-active');
					}

					this._simulateEvent('mouseup', first);

					// simulate click if the touch didn't move too much
					if (this._isTapValid()) {
						this._simulateEvent('click', first);
					}
				}
			},

			_isTapValid: function _isTapValid() {
				return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
			},

			_onMove: function _onMove(e) {
				var first = e.touches[0];
				this._newPos = new Point(first.clientX, first.clientY);
				this._simulateEvent('mousemove', first);
			},

			_simulateEvent: function _simulateEvent(type, e) {
				var simulatedEvent = document.createEvent('MouseEvents');

				simulatedEvent._simulated = true;
				e.target._simulatedClick = true;

				simulatedEvent.initMouseEvent(type, true, true, window, 1, e.screenX, e.screenY, e.clientX, e.clientY, false, false, false, false, 0, null);

				e.target.dispatchEvent(simulatedEvent);
			}
		});

		// @section Handlers
		// @property tap: Handler
		// Mobile touch hacks (quick tap and touch hold) handler.
		if (touch && !pointer) {
			Map.addInitHook('addHandler', 'tap', Tap);
		}

		/*
   * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
   */

		// @namespace Map
		// @section Interaction Options
		Map.mergeOptions({
			// @section Touch interaction options
			// @option touchZoom: Boolean|String = *
			// Whether the map can be zoomed by touch-dragging with two fingers. If
			// passed `'center'`, it will zoom to the center of the view regardless of
			// where the touch events (fingers) were. Enabled for touch-capable web
			// browsers except for old Androids.
			touchZoom: touch && !android23,

			// @option bounceAtZoomLimits: Boolean = true
			// Set it to false if you don't want the map to zoom beyond min/max zoom
			// and then bounce back when pinch-zooming.
			bounceAtZoomLimits: true
		});

		var TouchZoom = Handler.extend({
			addHooks: function addHooks() {
				addClass(this._map._container, 'leaflet-touch-zoom');
				on(this._map._container, 'touchstart', this._onTouchStart, this);
			},

			removeHooks: function removeHooks() {
				removeClass(this._map._container, 'leaflet-touch-zoom');
				off(this._map._container, 'touchstart', this._onTouchStart, this);
			},

			_onTouchStart: function _onTouchStart(e) {
				var map = this._map;
				if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) {
					return;
				}

				var p1 = map.mouseEventToContainerPoint(e.touches[0]),
				    p2 = map.mouseEventToContainerPoint(e.touches[1]);

				this._centerPoint = map.getSize()._divideBy(2);
				this._startLatLng = map.containerPointToLatLng(this._centerPoint);
				if (map.options.touchZoom !== 'center') {
					this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
				}

				this._startDist = p1.distanceTo(p2);
				this._startZoom = map.getZoom();

				this._moved = false;
				this._zooming = true;

				map._stop();

				on(document, 'touchmove', this._onTouchMove, this);
				on(document, 'touchend', this._onTouchEnd, this);

				preventDefault(e);
			},

			_onTouchMove: function _onTouchMove(e) {
				if (!e.touches || e.touches.length !== 2 || !this._zooming) {
					return;
				}

				var map = this._map,
				    p1 = map.mouseEventToContainerPoint(e.touches[0]),
				    p2 = map.mouseEventToContainerPoint(e.touches[1]),
				    scale = p1.distanceTo(p2) / this._startDist;

				this._zoom = map.getScaleZoom(scale, this._startZoom);

				if (!map.options.bounceAtZoomLimits && (this._zoom < map.getMinZoom() && scale < 1 || this._zoom > map.getMaxZoom() && scale > 1)) {
					this._zoom = map._limitZoom(this._zoom);
				}

				if (map.options.touchZoom === 'center') {
					this._center = this._startLatLng;
					if (scale === 1) {
						return;
					}
				} else {
					// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
					var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
					if (scale === 1 && delta.x === 0 && delta.y === 0) {
						return;
					}
					this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
				}

				if (!this._moved) {
					map._moveStart(true);
					this._moved = true;
				}

				cancelAnimFrame(this._animRequest);

				var moveFn = bind(map._move, map, this._center, this._zoom, { pinch: true, round: false });
				this._animRequest = requestAnimFrame(moveFn, this, true);

				preventDefault(e);
			},

			_onTouchEnd: function _onTouchEnd() {
				if (!this._moved || !this._zooming) {
					this._zooming = false;
					return;
				}

				this._zooming = false;
				cancelAnimFrame(this._animRequest);

				off(document, 'touchmove', this._onTouchMove);
				off(document, 'touchend', this._onTouchEnd);

				// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
				if (this._map.options.zoomAnimation) {
					this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
				} else {
					this._map._resetView(this._center, this._map._limitZoom(this._zoom));
				}
			}
		});

		// @section Handlers
		// @property touchZoom: Handler
		// Touch zoom handler.
		Map.addInitHook('addHandler', 'touchZoom', TouchZoom);

		Map.BoxZoom = BoxZoom;
		Map.DoubleClickZoom = DoubleClickZoom;
		Map.Drag = Drag;
		Map.Keyboard = Keyboard;
		Map.ScrollWheelZoom = ScrollWheelZoom;
		Map.Tap = Tap;
		Map.TouchZoom = TouchZoom;

		// misc

		var oldL = window.L;
		function noConflict() {
			window.L = oldL;
			return this;
		}

		// Always export us to window global (see #2364)
		window.L = exports;

		Object.freeze = freeze;

		exports.version = version;
		exports.noConflict = noConflict;
		exports.Control = Control;
		exports.control = control;
		exports.Browser = Browser;
		exports.Evented = Evented;
		exports.Mixin = Mixin;
		exports.Util = Util;
		exports.Class = Class;
		exports.Handler = Handler;
		exports.extend = extend;
		exports.bind = bind;
		exports.stamp = stamp;
		exports.setOptions = setOptions;
		exports.DomEvent = DomEvent;
		exports.DomUtil = DomUtil;
		exports.PosAnimation = PosAnimation;
		exports.Draggable = Draggable;
		exports.LineUtil = LineUtil;
		exports.PolyUtil = PolyUtil;
		exports.Point = Point;
		exports.point = toPoint;
		exports.Bounds = Bounds;
		exports.bounds = toBounds;
		exports.Transformation = Transformation;
		exports.transformation = toTransformation;
		exports.Projection = index;
		exports.LatLng = LatLng;
		exports.latLng = toLatLng;
		exports.LatLngBounds = LatLngBounds;
		exports.latLngBounds = toLatLngBounds;
		exports.CRS = CRS;
		exports.GeoJSON = GeoJSON;
		exports.geoJSON = geoJSON;
		exports.geoJson = geoJson;
		exports.Layer = Layer;
		exports.LayerGroup = LayerGroup;
		exports.layerGroup = layerGroup;
		exports.FeatureGroup = FeatureGroup;
		exports.featureGroup = featureGroup;
		exports.ImageOverlay = ImageOverlay;
		exports.imageOverlay = imageOverlay;
		exports.VideoOverlay = VideoOverlay;
		exports.videoOverlay = videoOverlay;
		exports.DivOverlay = DivOverlay;
		exports.Popup = Popup;
		exports.popup = popup;
		exports.Tooltip = Tooltip;
		exports.tooltip = tooltip;
		exports.Icon = Icon;
		exports.icon = icon;
		exports.DivIcon = DivIcon;
		exports.divIcon = divIcon;
		exports.Marker = Marker;
		exports.marker = marker;
		exports.TileLayer = TileLayer;
		exports.tileLayer = tileLayer;
		exports.GridLayer = GridLayer;
		exports.gridLayer = gridLayer;
		exports.SVG = SVG;
		exports.svg = svg$1;
		exports.Renderer = Renderer;
		exports.Canvas = Canvas;
		exports.canvas = canvas$1;
		exports.Path = Path;
		exports.CircleMarker = CircleMarker;
		exports.circleMarker = circleMarker;
		exports.Circle = Circle;
		exports.circle = circle;
		exports.Polyline = Polyline;
		exports.polyline = polyline;
		exports.Polygon = Polygon;
		exports.polygon = polygon;
		exports.Rectangle = Rectangle;
		exports.rectangle = rectangle;
		exports.Map = Map;
		exports.map = createMap;
	});
	
});

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class GlimmerMap extends Component {
    constructor(options) {
        super(options);
        this.map = {};
        this.mapTarget = null;
        this.height = '400';
        this.x = 11.6020;
        this.y = 48.1351;
        this.accessToken = 'pk.eyJ1IjoiamVzc2ljYS1qb3JkYW4iLCJhIjoiY2o2NTRtM3JqMXV5MzMzcG8yazJsdXljYSJ9.h7WynTH9txlgxs8faviw1w';
    }
    createObserver() {
        var target = this.element;
        var observerCallback = this.setMapDimensions.bind(this);
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'width' || mutation.attributeName === 'height')) {
                    observerCallback();
                }
            });
        });
        // configuration of the observer:
        var config = { attributes: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }
    didInsertElement() {
        this.setMapDimensions();
        this.createMapInstance();
        this.setMapCoordinates();
        this.renderMap();
        this.createObserver();
    }
    setMapDimensions() {
        const mapTarget = this.element.children[0];
        const width = this.element.getAttribute('width');
        const height = this.element.getAttribute('height') || this.height;
        if (width) {
            mapTarget.style.width = `${width}px`;
        }
        mapTarget.style.height = `${height}px`;
        this.mapTarget = mapTarget;
    }
    createMapInstance() {
        const mymap = leafletSrc.map(this.mapTarget);
        this.map = mymap;
    }
    renderMap() {
        var accessToken = this.accessToken;
        leafletSrc.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken
        }).addTo(this.map);
    }
    setView() {
        this.updateCoordinates();
        this.setMapCoordinates();
    }
    updateCoordinates() {
        this.x = this.element.getElementsByClassName('x-coord')[0].value;
        this.y = this.element.getElementsByClassName('y-coord')[0].value;
    }
    setMapCoordinates() {
        this.map.setView([this.y, this.x], 12);
    }
}
__decorate([tracked], GlimmerMap.prototype, "height", void 0);
__decorate([tracked], GlimmerMap.prototype, "x", void 0);
__decorate([tracked], GlimmerMap.prototype, "y", void 0);

var __ui_components_glimmer_map_template__ = { "id": "/PDGW6FJ", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"glimmer-map\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"id\",\"map\"],[7],[8],[0,\"\\n  E: \"],[6,\"input\"],[9,\"class\",\"x-coord\"],[9,\"type\",\"number\"],[9,\"step\",\"0.0001\"],[10,\"value\",[18,\"x\"],null],[10,\"oninput\",[25,\"action\",[[19,0,[\"setView\"]],[19,0,[\"x\"]],[19,0,[\"y\"]]],null],null],[7],[8],[0,\"\\n  N: \"],[6,\"input\"],[9,\"class\",\"y-coord\"],[9,\"type\",\"number\"],[9,\"step\",\"0.0001\"],[10,\"value\",[18,\"y\"],null],[10,\"oninput\",[25,\"action\",[[19,0,[\"setView\"]],[19,0,[\"x\"]],[19,0,[\"y\"]]],null],null],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "specifier": "template:/glimmer-map/components/glimmer-map" } };

var moduleMap = { 'component:/glimmer-map/components/glimmer-map': GlimmerMap, 'template:/glimmer-map/components/glimmer-map': __ui_components_glimmer_map_template__ };

var resolverConfiguration = { "app": { "name": "glimmer-map", "rootName": "glimmer-map" }, "types": { "application": { "definitiveCollection": "main" }, "component": { "definitiveCollection": "components" }, "component-test": { "unresolvable": true }, "helper": { "definitiveCollection": "components" }, "helper-test": { "unresolvable": true }, "renderer": { "definitiveCollection": "main" }, "template": { "definitiveCollection": "components" } }, "collections": { "main": { "types": ["application", "renderer"] }, "components": { "group": "ui", "types": ["component", "component-test", "template", "helper", "helper-test"], "defaultType": "component", "privateCollections": ["utils"] }, "styles": { "group": "ui", "unresolvable": true }, "utils": { "unresolvable": true } } };

class App extends Application {
    constructor() {
        let moduleRegistry = new BasicRegistry(moduleMap);
        let resolver = new Resolver(resolverConfiguration, moduleRegistry);
        super({
            rootName: resolverConfiguration.app.rootName,
            resolver
        });
    }
}

function initializeCustomElements(app, customElementDefinitions) {
    customElementDefinitions.forEach(name => {
        initializeCustomElement(app, name);
    });
}
function initializeCustomElement(app, name) {
    function GlimmerElement() {
        return Reflect.construct(HTMLElement, [], GlimmerElement);
    }
    GlimmerElement.prototype = Object.create(HTMLElement.prototype, {
        constructor: { value: GlimmerElement },
        connectedCallback: {
            value: function connectedCallback() {
                let placeholder = document.createElement('span');
                let parent = this.parentNode;
                parent.insertBefore(placeholder, this);
                parent.removeChild(this);
                app.renderComponent(name, parent, placeholder);
                whenRendered(app, () => {
                    let customElement = this;
                    let glimmerElement = placeholder.previousElementSibling;
                    placeholder.remove();
                    assignAttributes(customElement, glimmerElement);
                });
            }
        }
    });
    window.customElements.define(name, GlimmerElement);
}
function assignAttributes(fromElement, toElement) {
    let attributes = fromElement.attributes;
    for (let i = 0; i < attributes.length; i++) {
        var _attributes$item = attributes.item(i);

        let name = _attributes$item.name,
            value = _attributes$item.value;

        toElement.setAttribute(name, value);
    }
}
function whenRendered(app, callback) {
    if (app['_rendering']) {
        setTimeout(whenRendered, 10, app, callback);
    } else {
        callback();
    }
}

const app = new App();
const containerElement = document.getElementById('app');
setPropertyDidChange(() => {
    app.scheduleRerender();
});
app.registerInitializer({
    initialize(registry) {
        registry.register(`component-manager:/${app.rootName}/component-managers/main`, ComponentManager);
    }
});
app.renderComponent('glimmer-map', containerElement, null);
app.boot();
initializeCustomElements(app, ['glimmer-map']);

})));

//# sourceMappingURL=app.js.map
