/**
 * This is the Search Component
 *
 * Go to README.md to se how to use it
 *
*/
(function($, Mustache){
	// The component flow starts at the bottom, in an event listener for "focus" event, roll down and start reading from there.
	
	var Search = function(el) {
		// making searches on DOM in the component initalization and storing it
		// this improves performance, because whe don't need to search for the elements again after this
		this.$el = $(el);
		this.$resultSetContainer = $('[data-search-result-set]');
		
		// get the default content
		this.defaultTemplate = this.$resultSetContainer.html();
		this.template = $('#' + this.$resultSetContainer.data('templateId')).html();
		this.data = null;
		this.dataFiltered = null;
		
		// get the data 
		$.getJSON(this.$el.data('url'), $.proxy(this, 'setData'));

		// parse mustache template, to optimize rendering
		Mustache.parse(this.template);

		// start event listeners
		this.startListeners();
	};

	Search.prototype.startListeners = function() {

		// listen to end key presses (keyup) and filter data when it happens
		this.$el.on('keyup', $.proxy(this, 'filterData'));
		
		// listen to new data filtered, then start to render the result set
		this.$el.on('data-filtered', $.proxy(this, 'renderResultSet'));
	}

	Search.prototype.setData = function(data) {
		this.data = data;
	};

	// render the template provided with the data filtered by the search
	Search.prototype.renderResultSet = function(e) {
		// if there is no data filtered, set the template as the previous content of the result set container
		var template = (this.dataFiltered.length > 0) ? this.template : this.defaultTemplate;
		
		// render the template using Mustache
		var rendered = Mustache.render(template, {resultSet: this.dataFiltered});
		this.$resultSetContainer.html(rendered);
	};


	// filter the data.json according to the user input
	// then trigger data-filtered event
	Search.prototype.filterData = function(e) {
		// if ajax didn't ended, data is null, so do nothing
		if (this.data == null) return;
		this.dataFiltered = new Array();
		
		// The value of the search input (What the user has typed)
		var inputValue = this.$el.val();
		
		// if input is empty, render empty result set (dataFiltered)
		if (inputValue == "") return this.$el.trigger('data-filtered');
		
		// exact matches regex
		var exactMatchRegex = /".*?"/g;
		// find exact matches and add to words
		var words = inputValue.match(exactMatchRegex);
		words = words === null ? new Array() : words.map(function(s){ return s.replace(/"/g,'') });
		// remove exact matches from inputValue
		inputValue = inputValue.replace(exactMatchRegex, '');
		
		// get the rest of the words in inputValue and concat with exact matches
		words = $.merge(words, inputValue.match(/[^ ]+/g) || []);
		
		// loop all records provided by data.json
		for (var i in this.data) {
			var record = this.data[i];

			// Loop all words of the input and search for it in the current record being looped,
			// at the first match, add it to dataFiltered
			// then break the words loop
			for (var j in words) {
				var word = words[j].toLowerCase();
				var stopWordsLoop = false;

				for (var k in record) {
					if (record[k].toLowerCase().indexOf(word) > -1) {
						this.dataFiltered.push(record);
						stopWordsLoop = true;
						break;
					}
				}
				
				if (stopWordsLoop) break;
			};
		};

		// trigger event to tell that there is new data filtered
		this.$el.trigger('data-filtered');
	};

	// Load on focus event
	// listen on document, so we don't have to worry if the data-search was loaded before or after this component
	$(document).on('focus', '[data-search]', function(){
		// if the component isn't loaded, load it and put its instance on the data attribute, but only in memory, not the DOM.
		// this way we can check later if the component is already loaded.
		if ($(this).data('search') == '') {
			$(this).data('search', new Search(this));
		}

		// I could use "one" instead of "on", to listen only one time and unbind the event listener
		// but if you have two search inputs in the same page, only one would work
	})

})(jQuery, Mustache);