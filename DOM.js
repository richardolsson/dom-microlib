"use strict"

var DOM = (function()
{
	var setPrefixedProperty,
		transformValue;
	
	// Initialize array with all fields that need to be concatenated
	// together into the transform style property value.
	transformValue = ['rotate(', 0, 'deg) scale(', 1, ',', 1, ')'];


	// Initializes "global" library functionality without polluting
	// the general library (or global) scope.
	(function initLib() {
		var createPrefixer, dummy = document.createElement('div');

		// Creates a function that can be used to set style
		// properties with browser prefixes.
		createPrefixer = function(prefix) {
			return function(style, property, value) {
				var prefixable = property.charAt(0).toUpperCase()+property.substr(1);
				style[property] = value;
				style[prefix+prefixable] = value;
			};
		}

		if (dummy.style.webkitTransform !== undefined)
			setPrefixedProperty = createPrefixer('webkit');
		else if (dummy.style.MozTransform !== undefined)
			setPrefixedProperty = createPrefixer('Moz');
		else if (dummy.style.OTransform !== undefined)
			setPrefixedProperty = createPrefixer('O');
	})();


	var Element = function(element)
	{
		if (element == undefined) {
			// Default behavior is to create a div DOM element
			element = 'div';
		}

		if (element.substring) {
			// If element is a string, create element of that type
			this.domElement = document.createElement(element);
		}
		else if (element.childNodes && element.appendChild) {
			// If element is actual DOM element, use it directly
			this.domElement = element;
		}

		// Set up basic style
		var style = this.domElement.style;
		this.domElement.style.position = 'absolute';
		this.domElement.style.left = 0;
		this.domElement.style.top = 0;
		this.domElement.style.opacity = 1;
		setPrefixedProperty(this.domElement.style, 'transform', 'rotate(0) scale(1,1)')

		// Internal ("private") state
		this.$ = {
			x: 0,
			y: 0,
			scaleX: 0,
			scaleY: 0,
			opacity: 1,
			children: []
		};
	};


	Object.defineProperty(Element.prototype, 'x', {
		get: function() { return this.$.x; },
		set: function(value) {
			this.$.x = value;
			this.domElement.style.left = value+'px';
		}
	});


	Object.defineProperty(Element.prototype, 'y', {
		get: function() { return this.$.y; },
		set: function(value) {
			this.$.y = value;
			this.domElement.style.top = value+'px';
		}
	});


	Object.defineProperty(Element.prototype, 'scaleX', {
		get: function() { return this.$.scaleX; },
		set: function(value) {
			this.$.scaleX = value;

			// Update transform property
			transformValue[3] = value;
			setPrefixedProperty(this.domElement.style, 'transform', transformValue.join(''));
		}
	});


	Object.defineProperty(Element.prototype, 'scaleY', {
		get: function() { return this.$.scaleY; },
		set: function(value) {
			this.$.scaleY = value;

			// Update transform property
			transformValue[5] = value;
			setPrefixedProperty(this.domElement.style, 'transform', transformValue.join(''));
		}
	});


	Object.defineProperty(Element.prototype, 'rotation', {
		get: function() { return this.$.rotation; },
		set: function(value) {
			this.$.rotation = value;

			// Update transform property
			transformValue[1] = value;
			setPrefixedProperty(this.domElement.style, 'transform', transformValue.join(''));
		}
	});


	Object.defineProperty(Element.prototype, 'opacity', {
		get: function() { return this.$.opacity; },
		set: function(value) {
			this.$.opacity = value;
			this.domElement.style.opacity = value;
		}
	});


	Element.prototype.add = function(child)
	{
		this.$.children.push(child);

		if (child.domElement.parentNode != this.domElement)
			this.domElement.appendChild(child.domElement);
	};



	var Text = function(element)
	{
		if (element.substring) {
			this.text = str;
			this.domElement = document.createTextNode(str);
		}
		else {
			this.domElement = element;
			this.text = element.nodeValue;
		}
	};


	var fromNodeTree = function(root)
	{
		var element, child = root.firstChild;

		element = (root.nodeType==3)? new Text(root) : new Element(root);

		while (child) {
			// Only create elements for non-text nodes or text nodes with
			// content that is not entirely whitespace.
			if (child.nodeType != 3 || /\S/.exec(child.nodeValue)!=null)
				element.add(fromNodeTree(child));

			child = child.nextSibling;
		}

		return element;
	};


	return {
		Element: Element,
		Text: Text,
		fromNodeTree: fromNodeTree
	}
})();
