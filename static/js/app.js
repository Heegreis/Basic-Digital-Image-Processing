document.write("<script src='/static/js/drag.js'></script>");

function readUrl(input) {
	imagebox = $('#input_img')
	console.log("evoked readUrl")
	if (input.files && input.files[0]) {
		let reader = new FileReader();
		reader.onload = function (e) {
			// console.log(e)
			imagebox.attr('src', e.target.result);
			// imagebox.height(300);
			// imagebox.width(300);
		}
		reader.readAsDataURL(input.files[0]);
	}
}

$("#process").submit(function (e) {
	$("#submit").addClass('disabled');
	$("#loading").removeClass('d-none');
	
	var form = $(this);
	var url = form.attr('action');
	
	imagebox = $('#output_img')
	input_img = $('#input_img')
	if (input_img.attr('src') != '') {
		input_img_base64 = input_img.attr('src').split(',')[1]

		var tmpInput = $("<input type='hidden' name='image' id='image'/>");
		tmpInput.attr("value", input_img_base64);
		form.append(tmpInput);
		// tmpInput.remove();

		$.ajax({
			type: "POST",
			url: url,
			data: form.serialize(), // serializes the form's elements.
			cache: false,
			// processData: false,
			// contentType: false,
			success: function (data) {
				$("#submit").removeClass('disabled');
				$("#loading").addClass('d-none');
				tmpInput.remove();
				// alert("hello"); // if it's failing on actual server check your server FIREWALL + SET UP CORS
				bytestring = data['status']
				image = bytestring.split('\'')[1]
				imagebox.attr('src', 'data:image/jpeg;base64,' + image)
			},
			error: function (data) {
				tmpInput.remove();

				console.log("upload error", data);
				console.log(data.getAllResponseHeaders());
			}
		});
	}
	e.preventDefault(); // avoid to execute the actual submit of the form.
	$('#submit').blur()
});

function addAlgorithm(myObj) {
	// alert("id 為: " + myObj.id);
	if ($('#' + myObj.id).is(":checked")) {
		$("#todo").append($("#" + myObj.id + "-Form"))
	} else {
		$("#" + myObj.id + "-Row").append($("#" + myObj.id + "-Form"))
	}
	enableDragSort('drag-sort-enable')
}