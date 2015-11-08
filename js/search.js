/**
 * This is the Search Component
 * Author: Luiz Guilherme
 * https://github.com/luizguilhermesj/search-tool
 *
 * Go to README.md to se how to use it
 * note: for better understanding reasons, the code below is all commented
 * 
 * Licensed under MIT (https://github.com/luizguilhermesj/search-tool/blob/master/LICENSE)
*/
(function($, Mustache){
	
	'use strict';
	
	// The component flow starts at the bottom, in an event listener for "focus" event, roll down and start reading from there.
	
	var Search = function(el) {
		// making searches on DOM in the component initalization and store the found elements
		// this improves performance, because we don't need to search for the elements again after this
		this.$el = $(el);
		this.$resultSetContainer = $('#' + this.$el.data('resultSetId'));
		this.template = $('#' + this.$el.data('templateId')).html();
		
		// get the default content
		this.defaultTemplate = this.$resultSetContainer.html();
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
		// listen to when key press ends (keyup) and filter data when it happens
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
		
		// clear dataFiltered, removing previous search
		this.dataFiltered = new Array();
		
		// The value of the search input (What the user has typed)
		var inputValue = this.$el.val();
		
		// if input is empty, render empty result set (dataFiltered)
		if (inputValue == "") return this.$el.trigger('data-filtered');
		
		// prevent strange behavior when user starts typing exact match
		inputValue = (inputValue.split('"').length - 1) % 2 == 0 ? inputValue : inputValue.replace(/"([^"]*)$/,'$1');
				
		// exact matches regex
		var exactMatchRegex = /".*?"/g;
		
		// find exact matches and add to words
		var words = inputValue.match(exactMatchRegex) || new Array();
		if (words.length > 0) {
			words = words.map(function(s) {
				return s.replace(/"/g,'');
			});
		}
		
		// remove exact matches from inputValue
		inputValue = inputValue.replace(exactMatchRegex, '');
		
		// get the rest of the words divided by whitespace in inputValue and merge
		// with exact matches, that are already stored in the `words` array
		words = $.merge(words, inputValue.match(/[^ ]+/g) || []);
		
		// loop all records provided by data.json
		for (var i in this.data) {
			var record = this.data[i];
			var countMatches = 0;
			var countNegativeMatches = 0;

			// Loop all words of the input and search for it in the current record being looped
			// count how many words and negative matches are found
			for (var j in words) {
				var word = words[j].toLowerCase();
				// if is a negative search
				(word.charAt(0) == '-') ? countMatches++ : null;

				for (var k in record) {
					// if is a negative match search, the logic is a little different 
					if (word.charAt(0) == '-') {
						//search the negative match
						var realWord = word.slice(1);
						if (record[k].toLowerCase().indexOf(realWord) > -1) {
							// increment negative match counter
							countNegativeMatches++;
							break;
						}
						
						//prevent normal search of the word
						continue;
					}
					
					// search the word and increment counter
					if (record[k].toLowerCase().indexOf(word) > -1) {
						countMatches++;
						break;
					}
				}
				
			};
			
			// if all the words are found and there is no negative match, add it to data filtered, wich will be displayed as the resultset
			if (countNegativeMatches == 0 && countMatches == words.length) this.dataFiltered.push(record);			
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