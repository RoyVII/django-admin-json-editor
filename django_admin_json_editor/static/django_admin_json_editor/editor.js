var jsonEditors = {};
var $ = django.jQuery;

var enable_json_editor = function(element){
	var id = element.id;
	var idSelector = "id_"+element.id.replace('_json_editor', '');
	var selector = $('#'+idSelector);

	try {
		var filename = "/static/json/" + selector.val() +".json";
	} catch(err) {
		if (id.indexOf('__prefix__') === -1) { // activate editor only if it is not an inline template row

			var textarea_id = "id_"+element.id.replace('_editor', '');
			var data = JSON.parse(element.getAttribute('data-data'));
			var options = JSON.parse(element.getAttribute('data-options'));
			
			jsonEditors[id] = new JSONEditor(element, options);


			jsonEditors[id].on('change', function () {
				var errors = jsonEditors[id].validate();
				if (errors.length) {
					console.log(errors);
				}
				else {
					var json = jsonEditors[id].getValue();
					$('#'+textarea_id)[0].value = JSON.stringify(json);
					var label = "label[for='"+ textarea_id +"']";
					$(label).remove();
				}
			});

			if (data != null) {
				jsonEditors[id].setValue(data);
			}
		}

		return;
	}

	django.jQuery.getJSON(filename, function(schema) {
		// Only runs this part if the json file and content is successfully loaded
		console.log("Successfully loaded schema");

		
		if (id.indexOf('__prefix__') === -1) { // activate editor only if it is not an inline template row

			var textarea_id = "id_"+element.id.replace('_editor', '');

			var data = JSON.parse(element.getAttribute('data-data'));
			//var options = JSON.parse(element.getAttribute('data-options'));
			var options = {"theme": "bootstrap4", "iconlib": "fontawesome4", "disable_edit_json": true, "disable_collapse": true, "disable_properties": true, "schema":  schema, "options": {"collapsed": 0}};
			
			jsonEditors[id] = new JSONEditor(element, options);


			jsonEditors[id].on('change', function () {
				var errors = jsonEditors[id].validate();
				if (errors.length) {
					console.log(errors);
				}
				else {
					var json = jsonEditors[id].getValue();
					$('#'+textarea_id)[0].value = JSON.stringify(json);
					var label = "label[for='"+ textarea_id +"']";
					$(label).remove();
				}
			});

			if (data != null) {
				jsonEditors[id].setValue(data);
			}
			
		}
	}).fail( function(data, textStatus, error){
        console.log("getJSON failed, status: " + textStatus + ", error: "+error)
    });
}


$(document).ready(function() {
	$(document).find("[id$=_editor]").each(function(){
		enable_json_editor(this);			
	});	
});

$(document).on('formset:added', function(event, $row, formsetName) {
	$row.find("[id$=_editor]").each(function(){
		enable_json_editor(this);			
	});		
});


$(document).ready(function(){
	$('.submit-row :input').click(function() {

		var ret = true;
		var keys = Object.keys(jsonEditors);

		for (i = 0; i < keys.length; i++) {
			var validation_errors = jsonEditors[keys[i]].validate();
				if (validation_errors.length) {
						console.log(validation_errors);
						ret = false;
				}
		}

		return ret;
	});
});
