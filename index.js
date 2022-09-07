/**
 * Scap is a JS implementation of arguments parser using Microsoft Command Line Standard
 * Author: Ibrahim Sharaf
 * Email: ibrahimsharaf3@gmail.com
 */

'use strict'

function helper(argList) {
	return argList.slice(2);
}

function _getBoolean(str) {
	 return str == 'true'? true: str == "false"? false : str;
}

function _convert_argument(argument, type) {

	let result = argument.split(",");

	if(type === Array) {
		return result.map(a => isNaN(a)? _getBoolean(a) : +a);
	}

	else if(result.length > 1) {
		throw new Error(`can't assign an array argument to a scalar`);
	}

	return type(result[0]);
}


function parse(arglist, signature) {

	const argsLength = arglist.length;
	const result     = {};
	const rest       = [];

	//regex for argument of type -foo: bar or -foor= bar) 
	const OPTION_WITH_VALUE_REG1	= /^-([a-zA-Z][a-zA-Z0-9]*)[:=]$/;
	
	//regex for argument of type -foo:bar or -foor=bar
	const OPTION_WITH_VALUE_REG2 	= /^-([a-zA-Z][a-zA-Z0-9]*)[:=](.+)$/;

	//regex for argument of type -foo
	const POSITIONAL_ARGUMENT_REG   = /^-([a-zA-z][a-zA-Z0-9]*)$/;

	//regex for end options endicator --
	const END_OPTIONS_INDICATOR_REG = /^--$/;

	let i = 0, current, argName, match, argument, type;

	loop:
	while(i < arglist.length) {

		current = arglist[i];

		switch(true) {


			case OPTION_WITH_VALUE_REG1.test(current):
				match = current.match(OPTION_WITH_VALUE_REG1);
				argName = match[1]
				type = signature[argName];
				if(!type) {
					throw new Error(`-${argName} is not a valid argument`)
				}

				i += 1;

				if(i >= arglist.length) {
					throw new Error(`missing argument to -${argName}`);
				}

				result[argName] = _convert_argument(arglist[i], type);
				break;

			case OPTION_WITH_VALUE_REG2.test(current):
				match = current.match(OPTION_WITH_VALUE_REG2);
				argName = match[1]
				argument = match[2]
				type = signature[argName];

				if(!type) {
					throw new Error(`-${argName} is not a valid argument`)
				}

				result[argName] = _convert_argument(argument, type);
				break;

			case POSITIONAL_ARGUMENT_REG.test(current):
				match = current.match(POSITIONAL_ARGUMENT_REG);
				argName = match[1]
				type = signature[argName];

				if(!type) {
					rest.push(current);
				}

				else if(type === Boolean) {
					result[argName] = true;
				}

				else {
					i += 1;

					if(i >= arglist.length) {
					throw new Error(`missing argument to -${argName}`);
					}

					result[argName] = _convert_argument(arglist[i], type);
				}
				break;

			case END_OPTIONS_INDICATOR_REG.test(current):
				
				i += 1;
				break loop;

			default:
				rest.push(current);
		}
		i += 1;
	}

	while(i < arglist.length) {
		
		rest.push(arglist[i]);
		i += 1;
	}

	result["__rest"] = rest;
	return result;
}

module.exports = {parse, helper}