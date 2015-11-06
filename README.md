### Search Component


## Usage

To use it, you just have to create an input with a data attribute called "data-search", like this:
<input type='text' data-search ></input>

This component will only be loaded when the user interacts with this input, not before.
 
The result of the search will be rendered in a container with "data-search-result-set" attribute, that you must set as follow:
<div data-search-result-set data-template-id="search-result">
	<p> No search results yet </p>
</div>

The content maybe whatever you want, it will be override by the result set and reloaded when no results are found 

The "data-template-id" indicates the element id of the mustache template that you want to use to render the result set
it would be something like this:
<script id="search-result" type="x-tmpl-mustache">
	//your template here ...
</script>


The data set must be in the following format:
	[
		{
			"property1" : "searchable text"
			"property2" : "searchable text"
			"property3" : "searchable text"
			...
		},
		{
			"property1" : "searchable text"
			"property2" : "searchable text"
			...
		},
		{
			...
		},
		...
	]

When a searchable text has a match, the entire object will be retrieved and sent to your
Mustache template.

In your mustache template you can loop a 'resultSet' array as the following example:
	{{#resultSet}}
		Found {{ property1 }}
		Its about {{ property2 }} and {{ property3 }}
	{{/resultSet}}