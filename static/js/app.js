const file = "data/samples.json";
function buildCharts(samplechoice) {
  d3.json(file).then((data) => {
    var sample = data.samples.filter(a => a.id == samplechoice);
    var sampleotuids = sample[0].otu_ids;
    var samplevalues = sample[0].sample_values;
    var samplelabels = sample[0].otu_labels;

    // console.log(sampleotuids)

    //Top Ten Bar - need labels on y access to be Top10 OTUs, scale to stay consistent
    var trace1 = [{
      type: 'bar',
      x: samplevalues.slice(0, 10),
      y: sampleotuids.slice(0, 10).map(x => `OTU ID ${x}`),
      text: samplelabels,
      orientation: 'h',
      autoscale: true,
      transforms: [{
        type: 'sort',
        target: 'x',
        order: 'ascending',
      }],
      marker: {
        color: 'rgb(252, 106, 106)',
        opacity: 0.6,
        line: {
          color: 'rgb(8,48,107)',
          width: 1.5
        }
      }
    }]

    var layout1 = {
      title: 'Top 10 Bacteria per Sample',
      showlegend: false,
      height: 600,
      width: 600,
      text: samplelabels.slice(0, 10),
      // colorscale: 'Picnic',
      xaxis: {
        title: 'Sample Values',
        range: [0, 300]

      },
      yaxis: { range: [-1, 10] },
      font: {
        family: 'Segoe UI',
        size: 11,
  
      },
    };
    Plotly.newPlot('bar', trace1, layout1);

    //Bubble --ok
    var trace2 = [{
      x: sampleotuids,
      y: samplevalues,
      text: samplelabels,
      mode: 'markers',
      marker: {
        color: sampleotuids,
        size: samplevalues,
        showscale: 'True'
      }
    }];
    var layout2 = {
      font: {
        family: 'Segoe UI',
        size: 11,

      }, 
      title: 'Bacteria Found in this Sample',
      showlegend: false,
      height: 600,
      width: 1200,


    };
    Plotly.newPlot('bubble', trace2, layout2);




  })
}
//Updates in console.log but not table, need to display key-value of the json 'metadata'
function meta(samplechoice) {
  d3.json(file).then((data) => {
    var metadata = data.metadata.filter(a => a.id == samplechoice);
    var ethnicity = metadata[0].ethnicity;
    var gender = metadata[0].gender;
    var age = metadata[0].age;
    var location = metadata[0].location;
    var bbtype = metadata[0].bbtype;
    var wfreq = metadata[0].wfreq;
    // console.log(wfreq)
    var demographics = [{
      ethnicity: ethnicity,
      gender: gender,
      age: age,
      location: location,
      bbtype: bbtype,
      wfreq: wfreq
    }]
    var location = d3.select("#sample-metadata")
    location.html("")
    d3.select("#sample-metadata")
      .selectAll("tr")
      .data(demographics)
      .enter()
      .append("tr")
      .html(function (d) {
        return `<tr>Ethnicity: ${d.ethnicity}</tr><br>
      <tr>Gender: ${d.gender}</tr><br>
      <tr>Age: ${d.age}</tr><br>
      <tr>Location: ${d.location}</tr><br>
      <tr>Innie/Outie: ${d.bbtype}</tr><br>
      <tr>Weekly Washes: ${d.wfreq}</tr><br>`
      })

    //This variable changes but chart doesn't update on page
    console.log(demographics)

    //Gauge - adjust colorscale, add arrow as in example
    var trace3 = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Washes per Week" },
      titlefont: 'Segoe UI',
      type: "indicator",
      mode: "gauge+number",
      bar: { color: 'black' },

      gauge: {
        axis: { range: [null, 9] },
        bar: {

          color: 'rgb(252, 106, 106)',
          opacity: 0.6,
        },
        // showarrow: true,
        // steps: [
        //   { range: [0, 2], color: 'red' },
        //   { range: [2, 5], color: 'orange' },
        //   { range: [5, 8], color: 'yellow' },
        //   { range: [8, 9], color: 'green' }
        // ],
      }
    }

    ];
    var layout3 = {
      
      width: 600,
      height: 600,
      margin: { t: 0, b: 0 },
      font: {
        family: 'Segoe UI',
        size: 11,
  
      },
    };
    
    Plotly.newPlot('gauge', trace3, layout3);

  })
}

function optionChanged(samplechoice) {
  buildCharts(samplechoice);
  meta(samplechoice);
}

function init() {
  d3.json(file).then((data) => {
    var selector = d3.select("#selDataset");
    // console.log(data.names);
    data.names.forEach(element => {
      selector.append("option").text(element).property("value", element);
    });
  })
  buildCharts(940);
  meta(940);
}
init();
