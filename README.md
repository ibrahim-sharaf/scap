## opparse

opparse is an argument parser that uses Microsoft Command Line Standard. 


### DESCRIPTION

Simple JS implementation of Microsoft command line argument parsing standards
[Command Line Standard](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-powershell-1.0/ee156811(v=technet.10)?redirectedfrom=MSDN)


### Installation

```
npm install opparse
```

### USAGE


```
$node ./script.js -k:hello -num:1,2,3 -b other
```

```javascript

const parser = require('opparse');

//Getting rid of node path and called script
const args = parser.helper(process.argv)

const result = parser.parse(args, {"k": String, "num": Array, b:Boolean});
```
The first argument is an array of strings to be parsed, the second argument
is an object describing the signature for the command Entries take the form of:

```name = Type
```
Type can be an String, Number, Boolean or Array.

The result of the parse will be to return an object (hash table)
mapping actual parameters to their values, including the type conversions

for example the result of the above example would be:
```
{
	"k": "hello",
	"num":[1,2,3],
	"b": true,
	 __rest: ["other"]}
```
\__rest member is just an array holding unclaimed arguments 

the following command line arguments give similar results as the above:
```
$node ./script.js -k: hello -num:1,2,3 -b other
```
```
$node ./script.js -k=hello -num:1,2,3 -b other
```
```
$node ./script.js -k= hello -num:1,2,3 -b other
```
```
$node ./script.js -k hello -num:1,2,3 -b other
```