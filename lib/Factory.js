/**
 * Author: Jeremy Guyet
 * Date: 22/08/2018
 */
(function(global) {
    'use strict';
//#################################################################
// CONSTANTS
//#################################################################
    var GET = 'get',
        SET = 'set',
		ADD = 'add';
	//#################################################################
	// METHOD ADDED ON YOUR CLASS FOR SET ATTRIBUTES
	//#################################################################
    var setAttr = function(key, val) {
        var oldVal;
        oldVal = this.attrs[key];
        if (oldVal === val) {
            return;
        }
        if (val === undefined || val === null) {
            delete this.attrs[key];
        } else {
            this.attrs[key] = val;
        }
        this._fireChangeEvent(key, oldVal, val);
    };
	//#################################################################
	// METHOD ADDED ON YOUR CLASS FOR GET ATTRIBUTES
	//#################################################################
    var getAttr = function(attr) {
        var method = GET + Factory._private_capitalize(attr);

        var isf = !!(this[method] && this[method].constructor && this[method].call && this[method].apply);
        if (isf) {
            return this[method]();
        }
        // otherwise get directly
        return this.attrs[attr];
    }
	//#################################################################
	// DEFAULT FIRE CHANGE TRIGGER for overload this add on your class a method 
	// _fireChangeEvent
	//#################################################################
    var defaultFireChangeTrigger = function(key, oldVal, val) {
        console.log("CHANGE TRIGGER (key :" + key + ", oldVal :" + oldVal + ", newVal :" + val + ")");
    };
	//#################################################################
	//CALL YOUR METHOD DESTRUCTOR BEGIN delete create a method ___destructor on your class
	//#################################################################
    var destroy = function() {
        var tmp = [null, null, null];
        if (this.__proto__.___destructor != undefined) {//save first destructor
            tmp[0] = this.__proto__.___destructor;
            delete this.__proto__.___destructor;
        }
        if (this.__proto__.__proto__ != undefined && this.__proto__.__proto__.___destructor != undefined) {//save second destructor
            tmp[1] = this.__proto__.__proto__.___destructor;
            delete this.__proto__.__proto__.___destructor;
        }
        if (this.__proto__.__proto__ != undefined && this.__proto__.__proto__.__proto__ != undefined && this.__proto__.__proto__.__proto__.___destructor != undefined) {//save three destructor
            tmp[2] = this.__proto__.__proto__.__proto__.___destructor;
            delete this.__proto__.__proto__.__proto__.___destructor;
        }
        if (tmp[2] != null) {//call three destructor
            this.__proto__.__proto__.__proto__.___destructor = tmp[2];
            this.___destructor();
        }
        if (tmp[1] != null) {//call second destructor
            this.__proto__.__proto__.___destructor = tmp[1];
            this.___destructor();
        }
        if (tmp[0] != null) {//call first destructor
            this.__proto__.___destructor = tmp[0];
            this.___destructor();
        }
    }
	//#################################################################
	//#################################################################
	
	
//#################################################################
//FACTORY LIBRARY
//#################################################################
    var Factory = {
		//#################################################################
		//CALL THIS FOR CREATE NEW CLASS
		//#################################################################
        newClass: function(constructor) {
            constructor.prototype.attrs = [];
            if (constructor.prototype._fireChangeEvent === undefined)
                constructor.prototype._fireChangeEvent = defaultFireChangeTrigger;
            constructor.prototype._setAttr = setAttr;
            constructor.prototype._getAttr = getAttr;
            constructor.prototype.destroy = destroy;
        },
		//#################################################################
		//CALL THIS FOR ADD get(attr) and set(attr)
		//#################################################################
        addGetterSetter: function(constructor, attr, def, validator, after) {
			
			var getter = GET + this._private_capitalize(attr);
			var setter = SET + this._private_capitalize(attr);

			constructor.prototype[attr] = def;
			
			constructor.prototype[getter] = function() {
                return constructor.prototype[attr];
            }
			
			constructor.prototype[setter] = function(value) {
                constructor.prototype[attr] = value;
            }
			
			if (def !== undefined) {
				constructor.prototype[setter](def);
			}
        },
		//#################################################################
		//CALL THIS FOR ADD new Object var
		//#################################################################
        addComponentsGetterSetter: function(constructor, attr, components, def) {
            var len = components.length,
                capitalize = this._private_capitalize,
                getter = GET + capitalize(attr),
                setter = SET + capitalize(attr),
                n,
                component;

            // var
            constructor.prototype[attr] = {};
            for (n = 0; n < len; n++) {
                component = components[n];

                constructor.prototype[attr][component] = undefined;
            }

            constructor.prototype[getter] = function() {
                return constructor.prototype[attr];
            }
            constructor.prototype[setter] = function(values) {
                var vals = Object.values(values);
                var keys = Object.keys(values);
                var len = Object.values(values).length;
                for (n = 0; n < len; n++) {
                    var key = keys[n];
                    var val = vals[n];
                    constructor.prototype[attr][key] = val;
                }
            }

            if (def !== undefined) {
                constructor.prototype[setter](def);
            }

        },
		//#################################################################
		// CALL THIS FOR ADD overloadedgetterandsetter
		//#################################################################
        addOverloadedGetterSetter: function(constructor, attr) {
            var capitalizedAttr = this._private_capitalize(attr),
                setter = SET + capitalizedAttr,
                getter = GET + capitalizedAttr;

            constructor.prototype[attr] = function() {
                // setting
                if (arguments.length) {
                    this[setter](arguments[0]);
                    return this;
                }
                // getting
                return this[getter]();
            };
        },
		//#################################################################
		//CALL THIS FOR ADD DEPRECATED GETTER SETTER
		//#################################################################
        addDeprecatedGetterSetter: function(constructor, attr, def, validator) {
            var getter = GET + this._private_capitalize(attr);
			var setter = SET + this._private_capitalize(attr);
            var message = attr +
                ' property is deprecated and will be removed soon. Look at documentation change log for more information.';
			constructor.prototype[attr] = def;
			
            constructor.prototype[getter] = function() {
                console.error(message);
                return constructor.prototype[attr];
            };
			constructor.prototype[setter] = function(value) {
				console.error(message);
				constructor.prototype[attr] = value;
			}
        },
		//#################################################################
		//CALL THIS FOR ADD LIST
		//#################################################################
        addList: function(constructor, attr, def, condition) {
                var capitalized_attr = this._private_capitalize(attr);
                var getter = GET + capitalized_attr;
                var setter = SET + capitalized_attr;
                var adder = ADD + capitalized_attr.substr(0, capitalized_attr.length - 1);

                if (condition !== undefined)
                    condition = condition.replace("<", "").replace(">", "");
                constructor.prototype.attrs[attr] = [];
                if (def !== undefined)
                    constructor.prototype.attrs[attr] = def;

                constructor.prototype[getter] = function() {
                    return (this.attrs[attr]);
                };

                constructor.prototype[setter] = function(list) {
                    this.attrs[attr] = list;
                };

                constructor.prototype[adder] = function(element) {
                    if (condition !== undefined) {
                        var valid = false;
                        var split = condition.split("|");
                        for (var i = 0; i < split.length; i++) {
                            var typeOfObject = window;
                            var tmpsplit = split[i].split(".");

                            for (var o = 0; o < tmpsplit.length; o++)
                                typeOfObject = typeOfObject[tmpsplit[o]];
                            if (element instanceof typeOfObject)
                                valid = true;
                        }
                        if (valid == false)
                            return ;
                    }
                    this.attrs[attr].push(element);
                };
        },
		//#################################################################
		//
		//#################################################################
        backCompat: function(constructor, methods) {

            var func = function(oldMethodName, newMethodName) {
                var method = constructor.prototype[newMethodName];
                constructor.prototype[oldMethodName] = function() {
                    method.apply(this, arguments);
                    console.error(
                        oldMethodName +
                        ' method is deprecated and will be removed soon. Use ' +
                        newMethodName +
                        ' instead'
                    );
                };
            }
            for (var key in methods) {
                func(key, methods[key]);
            }
        },
		//#################################################################
		//CALL THIS FOR ADD METHODS ON YOUR CLASS
		//#################################################################
        addMethods: function(constructor, methods) {
            var key;

            for (key in methods) {
                constructor.prototype[key] = methods[key];
            }
        },
		//#################################################################
		//CALL THIS FOR EXTENDS YOUR CLASS WITH OTHER CLASS
		//#################################################################
        extend: function(child, parent) {
            function Ctor() {
                this.constructor = child;
            }
            Ctor.prototype = parent.prototype;
            var oldProto = child.prototype;
            child.prototype = new Ctor();
            for (var key in oldProto) {
                if (oldProto.hasOwnProperty(key)) {
                    child.prototype[key] = oldProto[key];
                }
            }
            child.__super__ = parent.prototype;
            // create reference to parent
            child.super = parent;
        },
		//#################################################################
		//private method capitalise first character after set and get
		//#################################################################
        _private_capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
		setMultipleValues: function(object, values) {
			for (var k in values){
				console.log(object);
				var setter = SET + this._private_capitalize(k);
				if (values.hasOwnProperty(k) && object[setter] != undefined) {
					 object[setter](values[k]);
				}
			}
		}
    };
	//#################################################################
	
	
	//#################################################################
	// SET TO GLOBAL VAR
	//#################################################################
	var glob = typeof global !== 'undefined' ?
        global :
        typeof window !== 'undefined' ?
        window :
        typeof WorkerGlobalScope !== 'undefined' ? self : {};

    glob.Factory = Factory;
    Factory.global = glob;
	//#################################################################
})();