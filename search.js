/**
 * This is the Search Component
 *
 * To use it, you just have to create an input with a data attribute called "data-search", like this:
 * <input type='text' data-search ></input>
 * 
 * This component will only be loaded when the user interacts with the input, not before.
 *
*/
(function($, Mustache){
	var Search = function(el) {
		this.$el = $(el);
		this.$resultSetContainer = $('[data-search-result-set]');
		this.template = $('#' + this.$resultSetContainer.data('templateId')).html();
		this.data = null;
		this.dataFiltered = null;
		
		// get the data 
		$.getJSON('data.json', $.proxy(this, 'setData'));

		// parse mustache template, to optimize rendering
		Mustache.parse(this.template);

		// start event listeners
		this.startListeners();
	};

	Search.prototype.startListeners = function() {

		// listen to end key presses (keyup) and filter data when it happens
		this.$el.on('keyup', $.proxy(this, 'filterData'));
		this.$el.on('data-filtered', $.proxy(this, 'renderResultSet'));
	}

	Search.prototype.setData = function(data) {
		this.data = data;
	};


	// filter the data.json according to the user input
	// then 
	Search.prototype.filterData = function(e) {
		// if ajax didn't ended, data is null, so do nothing
		if (this.data == null) return;
		this.dataFiltered = new Array();

		// get string of the input and slipt it to get the words typed
		var words = this.$el.val().split(" ");

		for (var i=0; i < this.data.length; i++) {
			var record = this.data[i];

			// Find the words in the 
			for (var j=0; j < words.length; j++) {
				var word = words[j].toLowerCase();

				if (record.Name.toLowerCase().indexOf(word) > -1) {
					this.dataFiltered.push(record);
					break;
				};

				if (record.Type.toLowerCase().indexOf(word) > -1) {
					this.dataFiltered.push(record);
					break;
				};

				if (record['Designed by'].toLowerCase().indexOf(word) > -1) {
					this.dataFiltered.push(record);
					break;
				};
			};
		};

		// trigger event to tell that there is new data filtered
		this.$el.trigger('data-filtered');
	};

	Search.prototype.renderResultSet = function(e) {
		var rendered = Mustache.render(this.template, {resultSet: this.dataFiltered});
		this.$resultSetContainer.html(rendered);
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