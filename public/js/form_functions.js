$(function(){
	var startdate = $('#startdate').datepicker(
		"setValue", new Date()
	).on('changeDate', function(ev) {
		var newDate = new Date(ev.date)
		newDate.setDate(newDate.getDate());
		enddate.setValue(newDate);
		startdate.hide();
	}).data('datepicker');

	var enddate = $('#enddate').datepicker().data('datepicker');;
});

$("#envoyer").click(function(){

	var type = $('button[name="type"].active').val()
		,title = $("#title").val()
		,url = $("#url").val()
		,location = $("#location").val()
		,text = $("#text").val()
		,startdate_str = $("#startdate-input").val()
		,enddate_str = $("#enddate-input").val();

	var startdate = new moment.utc(startdate_str,'MM/DD/YYYY').toDate().toString();

	var enddate = new moment.utc(enddate_str,'MM/DD/YYYY').toDate().toString();

	$.post("/api/evt", { type: type, title: title, type: type, url: url, location: location, text: text, startdate: startdate, enddate: enddate },
   		function(data) {
     		$("#form").append('<div class="alert alert-success alert-block"><button type="button" class="close" data-dismiss="alert">×</button>Event was added to the DB .</div>')
   	});

});