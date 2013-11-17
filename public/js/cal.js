$(function(){

	var now_float = new moment.utc();
	var current = new moment.utc([now_float.format("YYYY"), now_float.format("MM") - 1, now_float.format("DD"), 0, 0, 0, 0]);
	var begin = new moment.utc([2010, 1, 1, 0, 0, 0, 0]);	//may 1 2013

	//Difference in months
	var diff = current.diff(begin, 'months');

	$.getJSON('/api/evts-summary', function(data){

		//removes the loader

		$('.loader').addClass('hidden');

		$('.explain').removeClass('hidden');

		//creates the calendar
		var quarter_id = "quarter_0";
		for (var month=0; month<=diff; month++){

			var month_str = current.format("MMMM 'YY");
			var month_id = current.format("MM") + "-" + current.format("YYYY");
			
			var offset = 'offset1';

			//changes line every quarter
			if (month % 4 == 0) {

				offset = '';

				quarter_id = "quarter_" + month;

				$("#cal-heatmap").append(
					$('<div/>', {
			            class: 'row-fluid',
			            id: quarter_id
			        })
				);
			}

			$("#"+quarter_id).append(
					$('<div/>', {
			            class: 'month-cal span2 ' + offset,
			            id: month_id,
			        })
				);

			$("#"+month_id).append(
					$('<div/>', {
			            class: 'month-str',
			            text: month_str,
			        })
				);

			var weekNumber = 1;

			//checks if we are in the current (unfinished) month
			var daysInMonth = current.format("D");

			if (current.format("MM") != now_float.format("MM")) {
				current.daysInMonth();
			}

			//loops through the days
			for (var day=0; day< daysInMonth; day++){

				$("#" + month_id).prepend(
						$('<div/>', {
				            class: 'day-cal ' + current.format("dd") + " week" + weekNumber,
				            title: current.format("dddd, MMMM Do YYYY"),
				            id: current.format("X")
			        	})
					);

				//increments the week number
				if (current.format("dd") == "Mo") {
					weekNumber++;
				}

				current.subtract('day', 1);
			
			}

		}

		//fills the calendar with the data
		$.each(data, function(day, evt) {
			if (evt.count > 0) {

				var current_date = $("#" + day).attr("title");

				$("#" + day).addClass("active-day " + evt.type).attr("title", evt.title + " on " + current_date);
			}
		});

	});

});


$(document).on('click', '.active-day', function(event){

	// Excludes the demo points
	if (!$(event.target).is(".demo")) {

		var date = $(this).attr("id");
		date = date * 1000;
		console.log(date * 1000);

		$.getJSON('/api/evts/' + date, function(data){

			var fromnow = moment(date).fromNow();
			var date_format = moment(date).format("MMM Do YYYY");

			$("#details_date").modal('show')
				.find('.date').text(fromnow + ', on ' + date_format);
			$('.deeds_list').html('');
			
			$.each(data, function(i,item){

				//prepares the HTML to be shown in the modal box
				var htmlModal = '<h4>' + item.title + '</h4>' + '<p>' + item.type + ' in ' + item.location + '</p>';

				// Adds text if need be
				if (item.text != "") {
					htmlModal += '<p>' + item.text + '</p>';
				}

				// Adds a link if need be
				if (item.url != "") {
					htmlModal += '<p><a href="' + item.url + '">' + item.url + '</a></p>';
				}

	    		$('.deeds_list').append(
	    			$('<li/>', {
				        'class': 'event' + item.type,
				        html: htmlModal
			    	}));
	    	});

		});
	}
});