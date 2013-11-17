$(function(){
	
	$.get('/api/evts/', function(events){

		$.each(events, function (index, evt){
			var event_html = "<div class = 'row event well'>";
				event_html += "	<div class = 'span9'>";
				event_html += "		<div class = 'title'>Title: ";
				event_html += 			evt.title;
				event_html += "		</div>";
				event_html += "		<div class = 'location'>Location: ";
				event_html += 			evt.location;
				event_html += "		</div>";
				event_html += "		<div class = 'url'>URL: ";
				event_html += 			evt.url;
				event_html += "		</div>";
				event_html += "		<div class = 'text'>Text: ";
				event_html += 			evt.text;
				event_html += "		</div>";
				event_html += "		<div class = 'startdate'>Start date: ";
				event_html += 			evt.startdate;
				event_html += "		</div>";
				event_html += "		<div class = 'enddate'>End date: ";
				event_html += 			evt.enddate;
				event_html += "		</div>";
				event_html += "	</div>";
				event_html += "	<div class='delete' data-id='" + evt._id + "'>";
				event_html += " 	<i class='icon-trash'></i>";
				event_html += " </div>";
				event_html += "</div>";
			$("#events").append(event_html);

		});

	});

});

$(document).on('click', '.delete', function() { 
	var id = $(this).attr("data-id");
	$.ajax({
	    url: '/api/evt/' + id,
	    type: 'DELETE',
	    success: function(result) {
	    	console.log($(this).parent().parent());
	        $(this).parent().parent().fadeOut().remove();
	    }
	});
});