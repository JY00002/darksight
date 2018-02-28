var myChart = window.echarts.init(document.getElementById('mnist_test'));
var dataSet = {};
var orgininal = [];
d3.csv("./res-mnist.csv", function(data) {
    data.forEach(function(d, i) {
        d.id = Math.round(Number(+d.id));
        d.dim1 = +d.dim1;
        d.dim2 = +d.dim2;
        d.index = i;
        d.label = parseInt(d.label_pred);
        d.p_y = +d.p_y;
        d.p_y_ = [+d.p_y_0, +d.p_y_1, +d.p_y_2, +d.p_y_3, +d.p_y_4,
            +d.p_y_5, +d.p_y_6, +d.p_y_7, +d.p_y_8, +d.p_y_9];
        if (!dataSet[d.label]) {
            dataSet[d.label] = [];
        }
        orgininal.push(d);
        dataSet[d.label].push(d);
    });
    var labels = Object.keys(dataSet);
    var series = [];
    var legends = labels.map(function (el) {
        return {
            name: el.toString()
        }
    });
    console.log(legends);
    labels.forEach(function (l, i) {
        var temp = {};
        temp['name'] = l;
        temp['type'] = 'scatter';
        temp['symbolSize'] = 5;
        temp['data'] = dataSet[l].map(function (d) {
            return [d.dim1, d.dim2, d.index];
        });
        // temp['animation'] = false;
        series.push(temp);
    });
    var option = {
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        toolbox: {
            feature: {
                dataZoom: {},
                brush: {
                    type: ['rect', 'polygon', 'clear']
                }
            }
        },
        brush: {
        },
        legend: {
            data: legends
        },
        xAxis : {show: false},
        yAxis : {show: false},
        series : series
    };

    myChart.setOption(option);
    var colorMap = myChart.getOption().color;

    console.log(colorMap.length);

    colorMap.forEach(function (el, i) {
        var _id = '#chart-label-' + i;
        $(_id).css('background-color', el);
    });

    myChart.on('click', function (params) {
        var dataIndex = params['data'][2];
        console.log(params, orgininal[dataIndex]);
        var dataPoint = orgininal[dataIndex];
        $("#img-container").attr('src', '../images/mnist/test/' + dataPoint.id + '.jpg');
        dataPoint.p_y_.forEach(function (c, i) {
            var label_indicator_id = "#chart-label-" + i;
            var _label_id = "#label-" + i;
            var label_value_id = "#value-" + i;
            var new_width = 120*c + 'px';
            $(label_indicator_id).css('width', new_width);
            $(label_value_id).text(c);
            $(_label_id).css('font-size', '12px');
        });
        var label_id = "#label-" + dataPoint.label;
        $(label_id).css('font-size', '18px');
        $(label_id).css('color', dataPoint.color);
    });

});
