# Search Component

### Dependencies
- jquery     :^2.1.4
- mustache ^2.2.0
- bootstrap ^3.3.5 (optional, just for the index.html example)

To install the dependencies, at the root of the project, run:

```shell
npm install
```

### Usage

IMPORTANT: in most broswers, for security reasons, you cannot run AJAX calls on file:/// protocol.
So you probably have to setup a local web server to test the Search Component on a http:// protocol.

The index.html is an example of implementation. You can always do it your way, just follow the instructions below.

To use it, you just have to create an input with a data attribute called `data-search`, like this:
```html
<input data-search ... type='text' ></input>
```

This component will only be loaded when the user interacts with this input, not before.

There are some options that you have to declare as data attributes too:

```html
<input 
    data-search
    data-url="js/data.json"
    data-result-set-id="result-set"
    data-template-id="search-result"
    ...
    type='text' >
</input>
```

- `data-url`: the url that will retrive the data set
- `data-result-set-id`: the element id that will be the container for the result set
- `data-template-id`: the element id that contains the Mustache template


#### The searchable data
The data set offered by the indicated `data-url` must be in the following format:
```javascript
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
    ...
]
```

#### Result Set
The result of the search will be rendered in the container indicated by `data-result-set-id` attribute, that you must set as follow:
```html
<input data-result-set-id="result-set" ... type='text' ></input>
<div id="result-set">
	<p> No search results yet </p>
</div>
```
The content maybe whatever you want, it will be override by the result set and reloaded when no results are found 

#### Template
The `data-template-id` indicates the element id of the mustache template that you want to use to render the result set
it would be something like this:
```html
<input data-template-id="search-result" ... type='text' ></input>
<script id="search-result" type="x-tmpl-mustache">
	//your template here ...
</script>
```

When a searchable text has a match, the entire object will be retrieved and sent to your
Mustache template.

In your Mustache template you can loop a `resultSet` array as the following example:
```javascript
{{#resultSet}}
	Found {{ property1 }}
	Its about {{ property2 }} and {{ property3 }}
{{/resultSet}}
```