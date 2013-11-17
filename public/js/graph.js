$(function () {
    var xAxis_labels = [];
    var dataGuardianAsia = [];
    var dataGuardianAfrica = [];
    var dataNYTAsia = [];
    var dataNYTAfrica = [];

    //Grabs the data
    $.getJSON( "/api/data", function( data ) {
        
        var count = data.length;

        $.each(data, function(key, evt) {
            var startdate = moment(evt.startdate);

            if (evt.brand == "The Guardian"){
                xAxis_labels.push("Week of " + startdate.subtract('days', 7).format("MMM Do"));
                dataGuardianAsia.push(Math.round(evt.proportion_Asia * 1000));
                dataGuardianAfrica.push(Math.round(evt.proportion_Africa * 1000));
            } else if(evt.brand == "The New-York Times") {
                dataNYTAsia.push(Math.round(evt.proportion_Asia * 1000));
                dataNYTAfrica.push(Math.round(evt.proportion_Africa * 1000));
            }

            if (!--count) drawChart();
        });
    });

    //Draws
    var drawChart = function(){
        Highcharts.setOptions({
            chart: {
                style: {
                    fontFamily: 'Helvetica, Arial',
                    color: '#999'
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            }
        });
        $('#graph').highcharts({
            
            title: {
                text: 'Articles about "Africa"',
                style: { color: "rgb(51, 51, 51)"},
                x: -20
            },
            xAxis: {
                categories: xAxis_labels
            },
            yAxis: {
                title: {
                    text: 'Frequency (per 1000 articles)',
                    style: { fontWeight: "normal", color: "rgb(51, 51, 51)"}
                },
                min: 0,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#ccc'
                }]
            },
            credits: {
                enabled: false
            },
            tooltip: {
                valueSuffix: ' articles per 1000'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                itemStyle: { color: "rgb(51, 51, 51)"}
            },
            series: [{
                name: '"Asia" in The Guardian',
                color: '#B2A39B',
                data: dataGuardianAsia
            }, {
                name: '"Africa" in The Guardian',
                color: '#7F170E',
                data: dataGuardianAfrica
            },{
                name: '"Asia" in The New-York Times',
                color: '#E3D0C5',
                data: dataNYTAsia
            }, {
                name: '"Africa" in The New-York Times',
                color: '#BF2316',
                data: dataNYTAfrica
            }]
        });
    };
});