/**
 * Parser
 *
 * */
class Parser {
    constructor(){
        this._parsedData = undefined;
        this._dataType = new Map();
    }
    setDataType(name, val, forceUpdate = false) {
        this._dataType.set(name, val);
    }
    getDataType(name) {
        return this._dataType.get(name);
    }
}

const DataParser = class extends Parser {
    constructor (){
        super();
        this._componentParseFunc = new Map();
    }

    setParseFunc (name, fn, forceUpdate = false){
        forceUpdate? this._componentParseFunc.set(name, fn) : !(this._componentParseFunc.has(name)) && this._componentParseFunc.set(name, fn);
    }

    getParseFunc (name){
        return this._componentParseFunc.get(name);
    }

    parse(name, ...arg){
        return (arg.length > 1)? this.getParseFunc(name)(...arg) : this.getParseFunc(name)(arg[0]);
    }
};

export default new DataParser();