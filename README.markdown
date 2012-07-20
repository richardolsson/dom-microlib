# DOM micro-lib
A small, nameless javascript micro-lib to simplify DOM operations that are 
common in micro-site production. Based on extensive experience creating Flash
sites, this library is an attempt to give the programmer the best of both
worlds, by providing a more "Flash-like" wrapper for DOM objects in
situations where that is desirable, while not taking away the strengths of
the HTML DOM when it comes to flowing layouts.

## Example
```javascript
var body = new DOM.Element(document.body),
	header = new DOM.Element('h1'),
	text = new DOM.Text('Hello, World!');

header.add(text);
body.add(header);

// All elements are absolutely positioned, and units
// are always pixels.
header.x = 200;
header.y = 100;

// Internally translates to CSS transforms, dealing
// automatically with vendor prefixes et c.
header.scaleX = 2;
header.scaleY = 2;

var animate = function() {
	header.rotation += 2;
	requestAnimationFrame(animate);
};
requestAnimationFrame(animate);
```
By providing properties like this, it is easier to animate these properties
using tweening engines, and to read back values with less fuzz, e.g. to animate
by incrementing them over time.

## Combine with regular DOM objects and HTML
Using the `DOM.fromNodeTree()` function, a full Element tree representation of
the DOM sub-tree can be created from it's root node. This allows for marking
up the structure of a document, and then "converting" it into the wrapper's
representation.

However, it would be a shame not to take advantage of the strengths of the
flow layouts that the DOM natively supports. For that reason, it's encouraged
to use this library only for the container boxes and then use regular HTML
to lay out text, images, or inline SVG, within these boxes.

