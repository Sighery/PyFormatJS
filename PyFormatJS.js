(function(){
// Constants
const FIELD_TYPE_AUTOMATIC = 0;
const FIELD_TYPE_MANUAL = 1;
// Error messages
let MIXED_FIELDS_MSG = "Cannot switch between automatic field " +
						"numbering and manual field specification";
let INVALID_ESCAPE_MSG = "Single '}' encountered in format string";
let MISSING_KEY_MSG = "Missing key '{}'";
let MISSING_ARG_MSG = "Missing argument for replacement field {}";

// Util functions
function checkIfArgExistsOrError(args, index) {
	// Check if the given arg to replace for even exists or throw error
	if (typeof args[index] === 'undefined') {
		throw new IndexError(MISSING_ARG_MSG.pyformat(index));
	}
}

// Error classes for exceptions
class ValueError extends Error {
	constructor(msg) {
		super(msg);
		this.name = "ValueError";
	}
}

class KeyError extends Error {
	constructor(msg) {
		super(msg);
		this.name = "KeyError";
	}
}

class IndexError extends Error {
	constructor(msg) {
		super(msg);
		this.name = "IndexError";
	}
}

String.prototype.pyformat = function(...args) {
	let firstRun = true;
	let fieldType;
	// In case of automatic field numbering, keep a count to know the next
	// argument to use for the next replacement
	let count = 0;
	// Since JavaScript has no named arguments like Python does, I'll implement
	// that feature as the last argument being an object with those named args
	let namedArgs = {};

	if (args[args.length - 1] instanceof Object &&
	args[args.length - 1].constructor === Object) {
		namedArgs = args[args.length - 1];
		args = args.slice(0, args.length - 1);
	}


	return this.replace(/(\{{1,}.*?\}{1,})/g, function(match, number) {
		let strippedField = match.substr(1, match.length - 2);

		// If even stripped it still contains more {} inside, it means they
		// want this one NOT replaced. {{}} used to escape.
		// But be careful of user fuck ups where they just send one { or }
		if (strippedField[0] === "{" &&
		strippedField[strippedField.length - 1] === "}") {
			return strippedField;
		} else if (strippedField[0] === "{" || strippedField[0] === "}") {
			throw new ValueError(INVALID_ESCAPE_MSG);
		}

		// Do first run setup
		if (firstRun === true) {
			fieldType = match === "{}" ?
								FIELD_TYPE_AUTOMATIC : FIELD_TYPE_MANUAL;
			firstRun = false;
		}

		// If this next field type doesn't match first one throw error
		if (
			(fieldType === FIELD_TYPE_AUTOMATIC && match !== "{}") ||
			(fieldType === FIELD_TYPE_MANUAL && match === "{}")
		) {
			throw new ValueError(MIXED_FIELDS_MSG);
		}

		if (fieldType === FIELD_TYPE_AUTOMATIC) {
			checkIfArgExistsOrError(args, count);

			// If it does exist just up count and return the proper arg
			count++;

			return args[count - 1];
		}

		if (fieldType === FIELD_TYPE_MANUAL) {
			// Check if it's a number field
			if (/^\d+$/.test(strippedField) === true) {
				let index = parseInt(strippedField, 10);

				checkIfArgExistsOrError(args, index);

				return args[index];
			}

			// It wasn't a number so just assume it was a named argument. First
			// check if it even exists or else throw an error
			if (namedArgs.hasOwnProperty(strippedField) === false) {
				throw new KeyError(MISSING_KEY_MSG.pyformat(strippedField));
			} else {
				return namedArgs[strippedField];
			}
		}
	});
};
})();
