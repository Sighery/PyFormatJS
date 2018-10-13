# PyFormatJS
I've always liked [Python's format functionality](https://docs.python.org/3.4
/library/string.html#format-string-syntax), and always found annoying and ugly
having to concatenate things manually in JavaScript, especially when you had to
concatenate the same thing multiple times.

For that reason, I decided to try and implement Python's format as closely as
possible in JavaScript.

This started off as [this Gist I created](https://gist.github.com/Sighery
/feddf87a45215ead08ae8c3321a2083d), from taking the code from [this Stack
Overflow answer](https://stackoverflow.com/a/4673436).

That answer was a good starting point, but it would take the same amount of
arguments as the replacement fields, meaning that if you wanted a single
argument in multiple places, you'd still have to provide it multiple times.

It also had the issue of being very basic. Just replacing `{}` in a string by
the matching argument, or not replacing it if that matching argument wasn't
found.

---

# Current Implementation

This current version is the first step towards implementing Python's format as
closely as possible in JavaScript. It works by expanding the JavaScript string
prototype to add this format method so every string has it. So far it supports:

1. Automatic conversion of types

```Javascript
"{} + {} is {}".format(1, 1.5, 1 + 1.5);
// Would return: "1 + 1.5 is 2.5"
```

It seems as though the `replace` method I use on the background uses
`String(argument)` to convert types. I haven't found any edge cases so far, but
it can act funky sometimes. For instance, if you were to pass it a function
you'd get no error, just this:

```Javascript
"{}".format(function() {});
// Would return: "function() {}"
```

However, this shouldn't be an issue because **PyFormatJS** has no need of any
function or callbacks of any kind. It will simply take whatever argument you
give it and replace it literally on the input string if possible.

2. Manual field specification

```Javascript
"{0} multiplied by {1} is still {0}".format(10, 1);
// Would return: "10 multiplied by 1 is still 10"
```

3. Automatic field numbering

```Javascript
// This is technically the same as "Good morning, {0} {1}"
"Good morning, {} {}".format("Mr.", "Smith");
// Would return: "Good morning, Mr. Smith"
```

4. Using literal `{}` in your strings

As in Python, you can use `{{}}` to escape your square brackets so they aren't
matched and replaced.

```JavaScript
"You can pass in named arguments by using {{argName}}".format('test');
// Will not replace and will return:
// "You can pass in named arguments by using {argName}"
```

5. Replacing with named arguments

This is one of Python's implementation I quite like. On Python, you can do this:

```Python
"This is {city}!".format(city = "Sparta")
# Would return: "This is Sparta!"
```

However, JavaScript does not implement named arguments. A function does not
know the name of a given argument, it just knows its value. That is why, in
order to implement this feature in JavaScript I decided to go a different route.

The way this `format()` works in regards to named arguments, is that it will try
to find an object as the last argument given to it. If it can find it, then it
will be able to replace your named replacement fields in your input string.

Which means you'd do this to use named arguments:

```Javascript
"{team1} ({0} : {0}) {team2}".format(20, {
	team1: "Atlanta Hawks",
	team2: "Boston Celtics"
});
// Would return: "Atlanta Hawks 20 : 20 Boston Celtics"
```

As you can see, you can pick and mix however you want. That being said, there
are some illegal things. Let's see them now.

---

# Exceptions

The same way I'm keeping this functionality as close as Python's one, I'm also
trying to replicate the exact same behaviour and exceptions. To do this, I
also implement my own error classes, and throw them when necessary. These errors
are also similar to Python's ones.

So for instance, some things that can and will throw errors:

1. Mixing automatic field numbering and manual field specification.

Python does simply not allow mixing these two types. If you want to use either
positional or named arguments, you won't be able to use just `{}` later on in
the string and let `format()` try and figure out what argument is supposed to go
there.

2. Invalid escaping

Obviously, if you try to just make it break by passing in square brackets not
escaped correctly it will just throw an error at you saying your string has the
squared brackets escaped wrong.

3. Index and key errors

If your input string asks to be replaced by some positional argument that is
simply not provided, it will throw an `IndexError` telling you which positional
argument was missing.

If your input string asks to be replaced by some named argument that is not
provided (either because that one argument wasn't declared, or because the
function wasn't passed named arguments at all in the way of the object last
argument), it will throw a `KeyError` telling you which named argument was
missing.

---

# TODO

This is just the first version. So far it does the basic replacing, but it does
none of the formatting Python's `format()` does. That will come at some point
when I get to it.
