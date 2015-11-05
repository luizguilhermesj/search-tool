/**
 * This is the Search Component
 *
 * To use it, you just have to create an input with a data attribute called "data-search", like this:
 * <input type='text' data-search ></input>
 * 
 * This component will only be loaded when the user interacts with the input, not before.
 *
*/
(function(){
	var Search = function() {

		// get the data 
		$.getJSON('data.json', $.proxy(this, 'dataLoaded'));

	};

	Search.prototype.dataLoaded = function(data) {
		console.log(data);
	};




	// Load on focus event
	// listen on document, so we don't have to worry if the data-search was loaded before or after this component
	$(document).on('focus', '[data-search]', function(){
		// if the component isn't loaded, load it and put its instance on the data attribute, but only in memory, not the DOM.
		// this way we can check later if the component is already loaded.
		if ($(this).data('search') == '') {
			$(this).data('search', new Search());
		}

		// I could use "one" instead of "on", to listen only one time and unbind the event listener
		// but if you have two search inputs in the same page, only one would work
	})
})();