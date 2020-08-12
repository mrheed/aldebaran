const DOM = function(elm) {
	"use strict"
	this.elem = document.createElement(elm)
	this.append = function(elm) {
		this.elem.appendChild(elm)
	}
}

const TEST_DOMParser = function() {
	"use strict"
	var DOMParser_proto = DOMParser.prototype;
	var real_parseFromString = DOMParser_proto.parseFromString;

	// Firefox/Opera/IE throw errors on unsupported types
	try {
		// WebKit returns null on unsupported types
		if ((new DOMParser).parseFromString("", "text/html")) {
			// text/html parsing is natively supported
			return;
		}
	} catch (ex) { throw(ex) }

	DOMParser_proto.parseFromString = function(markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var doc = document.implementation.createHTMLDocument("");
	      		doc.documentElement.innerHTML = markup;
			return doc;
		} else {
			return real_parseFromString.apply(this, arguments);
		}
	};
}
