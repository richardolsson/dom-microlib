"use strict"

var DOM = (function()
{
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

		this.$ = {
			children: []
		};
	};

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
