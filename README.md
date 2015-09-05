# Knockout promise extender [![Build Status](https://travis-ci.org/skyh/knockout-promise-extender.svg?branch=master)](https://travis-ci.org/skyh/knockout-promise-extender)

Knockout extender for handling promises.

## Installation

```sh
npm install knockout-promise-extender
```

## Adding to knockout

```js
var ko = require('knockout');
ko.extenders.promise = require('knockout-promise-extender');
```

## Usage

```js
var x = ko.observable().extend({promise: true});

console.log(
    x, // observable
    x() // PromiseState
);

console.log(
    x().pending, // true
    x().resolved, // false
    x().rejected, // false
    x().value // undefined
);

x(Promise.resolve('some value'));

console.log(
    x().pending, // true, because Promise.resolve is async
    x().resolved, // false
    x().rejected, // false
    x().value // undefined
);

setTimeout(function () {
    console.log(
        x().pending, // false
        x().resolved, // true
        x().rejected, // false
        x().value // "some value"
    );
}, 0);
```

## Usage in bindings

```html
<div class="promised-model-view">
    <!-- ko if: x().pending -->
        <span class="wait-message">
            Loading data...
        </span>
    <!-- /ko -->

    <!-- ko if: x().resolved -->
        <span class="data" data-bind="text: x().value"></span>
    <!-- /ko -->

    <!-- ko if: x().rejected -->
        <span class="error-message">
            Something went wrong. Error is
            <span data-bind="text: x().value"></span>
        </span>
    <!-- /ko -->
</div>
```
