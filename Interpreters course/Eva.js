const assert = require('assert');
const Environment = require('./Environment');

/**
 * Eva interpreter.
 */
class Eva
{

    constructor(global = new Environment())
    {
        this.global = global;
    }

    eval(exp, env = this.global)
    {
        //Self Evaluating Expressions
        if(isNumber(exp))
        {
            return exp;
        }

        if(isString(exp))
        {
            return exp.slice(1, -1);
        }

        //Math operations 

        if(exp[0] === '+')
        {
            return this.eval(exp[1]) + this.eval(exp[2]);
        }

        if(exp[0] === '-')
        {
            return this.eval(exp[1]) - this.eval(exp[2]);
        }

        if(exp[0] === '*')
        {
            return this.eval(exp[1]) * this.eval(exp[2]);
        }

        if(exp[0] === '/')
        {
            return this.eval(exp[1]) / this.eval(exp[2]);
        }

        if(exp[0] === '%')
        {
            return this.eval(exp[1]) % this.eval(exp[2]);
        }

        //Variable declaration
        if(exp[0] === 'var')
        {
            const[_, name, value] = exp;
            return env.define(name, this.eval(value));
        }

        //Variable access
        if(isVariableName(exp))
        {
            return env.lookup(exp);
        }

        throw 'Unimplemented: ${JSON.stringify(exp)}';
    }
}

function isNumber(exp)
{
    return typeof exp === 'number';
}

function isString(exp)
{
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
    //return typeof exp === 'string' 
}
function isVariableName(exp)
{
    return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]$/.test(exp);
}

const eva = new Eva();
assert.strictEqual(eva.eval(42.13), 42.13);
assert.strictEqual(eva.eval('"hello"'), 'hello');

assert.strictEqual(eva.eval(['+', 1, 5]), 6);
assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10);
assert.strictEqual(eva.eval(['+', 1, 5]), 6);

assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
assert.strictEqual(eva.eval('x'), 10)


console.log("All assertions passed!")