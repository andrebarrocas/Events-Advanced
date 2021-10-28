const map_path = 'data/countries.json';
const data_path = 'data/data.csv';

const width = 500;
const height = 500;
const margin = { top: 20, right: 20, left: 60, bottom: 40 };
const radius = 5;

var dataset;

const x_var = 'lifeexpectancy';
const y_var = 'alcconsumption';

var countries = [];

/* 
Meter uma tooltip sempre que passas com o rato por cima de um país que mostra a alcohol consuption e a 
life expectancy e sempre que clickas num país o nome do país é adicionado a uma lista que fica ao lado 
e o país fica destacado (se clickares de novo no mesmo o nome é removido da lista e o país deixa de estar destacado)   
*/

Promise.all([d3.json(map_path), d3.csv(data_path)]).then(([map, data]) => {
    dataset = data;
    createGeoMap(map);
    createScatterPlot(dataset);
    addZoom();
});

function createGeoMap(map) {
    const cVar = 'armedforcesrate';

    const projection = d3
        .geoMercator()
        .scale(height / 2)
        .rotate([0, 0])
        .center([0, 0])
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // const colorScale = d3
    //     .scaleLinear()
    //     // ["#f7fbff","#f6faff","#f5fafe","#f5f9fe","#f4f9fe","#f3f8fe","#f2f8fd","#f2f7fd","#f1f7fd","#f0f6fd","#eff6fc","#eef5fc","#eef5fc","#edf4fc","#ecf4fb","#ebf3fb","#eaf3fb","#eaf2fb","#e9f2fa","#e8f1fa","#e7f1fa","#e7f0fa","#e6f0f9","#e5eff9","#e4eff9","#e3eef9","#e3eef8","#e2edf8","#e1edf8","#e0ecf8","#e0ecf7","#dfebf7","#deebf7","#ddeaf7","#ddeaf6","#dce9f6","#dbe9f6","#dae8f6","#d9e8f5","#d9e7f5","#d8e7f5","#d7e6f5","#d6e6f4","#d6e5f4","#d5e5f4","#d4e4f4","#d3e4f3","#d2e3f3","#d2e3f3","#d1e2f3","#d0e2f2","#cfe1f2","#cee1f2","#cde0f1","#cce0f1","#ccdff1","#cbdff1","#cadef0","#c9def0","#c8ddf0","#c7ddef","#c6dcef","#c5dcef","#c4dbee","#c3dbee","#c2daee","#c1daed","#c0d9ed","#bfd9ec","#bed8ec","#bdd8ec","#bcd7eb","#bbd7eb","#b9d6eb","#b8d5ea","#b7d5ea","#b6d4e9","#b5d4e9","#b4d3e9","#b2d3e8","#b1d2e8","#b0d1e7","#afd1e7","#add0e7","#acd0e6","#abcfe6","#a9cfe5","#a8cee5","#a7cde5","#a5cde4","#a4cce4","#a3cbe3","#a1cbe3","#a0cae3","#9ec9e2","#9dc9e2","#9cc8e1","#9ac7e1","#99c6e1","#97c6e0","#96c5e0","#94c4df","#93c3df","#91c3df","#90c2de","#8ec1de","#8dc0de","#8bc0dd","#8abfdd","#88bedc","#87bddc","#85bcdc","#84bbdb","#82bbdb","#81badb","#7fb9da","#7eb8da","#7cb7d9","#7bb6d9","#79b5d9","#78b5d8","#76b4d8","#75b3d7","#73b2d7","#72b1d7","#70b0d6","#6fafd6","#6daed5","#6caed5","#6badd5","#69acd4","#68abd4","#66aad3","#65a9d3","#63a8d2","#62a7d2","#61a7d1","#5fa6d1","#5ea5d0","#5da4d0","#5ba3d0","#5aa2cf","#59a1cf","#57a0ce","#569fce","#559ecd","#549ecd","#529dcc","#519ccc","#509bcb","#4f9acb","#4d99ca","#4c98ca","#4b97c9","#4a96c9","#4895c8","#4794c8","#4693c7","#4592c7","#4492c6","#4391c6","#4190c5","#408fc4","#3f8ec4","#3e8dc3","#3d8cc3","#3c8bc2","#3b8ac2","#3a89c1","#3988c1","#3787c0","#3686c0","#3585bf","#3484bf","#3383be","#3282bd","#3181bd","#3080bc","#2f7fbc","#2e7ebb","#2d7dbb","#2c7cba","#2b7bb9","#2a7ab9","#2979b8","#2878b8","#2777b7","#2676b6","#2574b6","#2473b5","#2372b4","#2371b4","#2270b3","#216fb3","#206eb2","#1f6db1","#1e6cb0","#1d6bb0","#1c6aaf","#1c69ae","#1b68ae","#1a67ad","#1966ac","#1865ab","#1864aa","#1763aa","#1662a9","#1561a8","#1560a7","#145fa6","#135ea5","#135da4","#125ca4","#115ba3","#115aa2","#1059a1","#1058a0","#0f579f","#0e569e","#0e559d","#0e549c","#0d539a","#0d5299","#0c5198","#0c5097","#0b4f96","#0b4e95","#0b4d93","#0b4c92","#0a4b91","#0a4a90","#0a498e","#0a488d","#09478c","#09468a","#094589","#094487","#094386","#094285","#094183","#084082","#083e80","#083d7f","#083c7d","#083b7c","#083a7a","#083979","#083877","#083776","#083674","#083573","#083471","#083370","#08326e","#08316d","#08306b"]
    //     .range(['#f7fbff', '#08306b']) 
    //     .domain(d3.extent(dataset.map((d) => +d[cVar])));


    const geo = d3
        .select('#geo')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .selectAll('path')
        .data(topojson.feature(map, map.objects.countries).features)
        .join('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('id', (d, i) => d.properties.name)
        // .attr('fill', (d) => {
        //     var country = dataset.filter((da) => da.country === d.properties.name);
        //     if (country.length === 0) {
        //         return 'grey';
        //     } else {
        //         return colorScale(country[0][cVar]);
        //     }
        // })
        .style("fill", calculateFill)
        .on('mouseover', handleMouseOver)
        .on('mouseleave', handleMouseLeave)
        .on('click', handleClick)
        .append('title')
        .text((d) => { 
            var country = dataset.filter((d1) => d1.country === d.properties.name);
            // console.log(country)
            if (country.length != 0) {
                return "Alcool Consumption: "+country[0]['alcconsumption']+" \n"
            }
        })
        .append('title')
        .text((d) => { 
            var country = dataset.filter((d1) => d1.country === d.properties.name);
            if (country.length != 0) {
                return "Life Expectancy: "+country[0]['lifeexpectancy']
            }
        });
    // console.log(d3.max(dataset.map((d) => +d[cVar])))

    // const scale = ['NA', 2, 4,6, 8 , 10];

    // d3.select('div#geo-label')
    //     .append('svg')
    //     .attr('id', 'legend')
    //     .attr('width', 400)
    //     .attr('height', 400);

    // d3.select('div#geo-label')
    //     .select('#legend')
    //     .append('text')
    //     .attr('x', 50)
    //     .attr('y', 40)
    //     .text('Armed Forces Rate');
   
    // for (let i = 0; i < scale.length; i++) {
    //     d3.select('#legend')
    //         .append('rect')
    //         .attr('x', 50 + 40 * i)
    //         .attr('y', 50)
    //         .attr('rx', 4)
    //         .attr('ry', 4)
    //         .attr('width', 30)
    //         .attr('height', 20)
    //         .style('fill', () => {
    //             return i === 0 ? 'grey' : colorScale(scale[i]);
    //         });
    // }
  
    // for (let i = 0; i < scale.length; i++) {
    //     d3.select('#legend')
    //         .append('text')
    //         .attr('x', 55 + 40 * i)
    //         .attr('y', 90)
    //         .text(scale[i]);
           
    // }
}

function addZoom() {
    d3.select('#geo')
        .selectAll('svg')
        .call(d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed));
}

function zoomed({ transform }) {
    d3.select('#geo')
        .selectAll('svg')
        .selectAll('path')
        .attr('transform', transform);
}




function createScatterPlot(data, update = false) {
    const xValue = (d) => +d[x_var];
    const yValue = (d) => +d[y_var];
    const rValue = (d) => +d["incomeperperson"];

    data = data.filter(
        (d) =>
        !isNaN(xValue(d) && !isNaN(yValue(d))) &&
        !isNaN(rValue(d)) &&
        xValue(d) > 0 &&
        yValue(d) > 0 &&
        rValue(d) > 0

    );

    data = data.filter(function (d) {
          return d["incomeperperson"]=d["incomeperperson"]/5000;  
      });

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(d3.map(data, (d) => +xValue(d))))
        .range([margin.left, width - margin.right])
        .nice();

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(d3.map(data, (d) => +yValue(d))))
        .range([height - margin.bottom, margin.top])
        .nice();

    const rScale = d3
        .scaleLinear()
        .domain(d3.extent(d3.map(dataset, (d) => +rValue(d))));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const scatter = d3.select('#scatter');
       
    if (!update) {
        const svg = scatter
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .append('text')
            .attr('id', 'x-label')
            .attr('x', width / 2)
            .attr('y', margin.bottom - 5)
            .attr('fill', 'black')
            .style('font-size', '1.3em');

        svg
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .append('text')
            .attr('id', 'y-label')
            .attr('x', -height / 2 + margin.top + margin.bottom)
            .attr('y', -30)
            .attr('fill', 'black')
            .style('font-size', '1.3em')
            .attr('transform', 'rotate(-90)');

        svg
            .append('g')
            .attr('fill', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('class', 'scatter');
    }

    scatter.select('g.x-axis').transition().duration(500).call(xAxis);
    scatter.select('g.y-axis').transition().duration(500).call(yAxis);
    scatter.select('#x-label').text(x_var);
    scatter.select('#y-label').text(y_var);

    const radius = d3
        .select('g.scatter')
        .attr('fill', 'steelblue')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(data)
        .join(
            (enter) => {
                return (
                    enter
                    .append('circle')
                    .on('mouseover', handleMouseOver)
                    .on('mouseleave', handleMouseLeave)
                    .on('click', handleClick)
                    .attr('cx', (d) => xScale(xValue(d)))
                    .attr('cy', (d) => yScale(yValue(d)))
                    .attr('r', (d) => Math.ceil(rValue(d)))
                );
            },
            (update) => {
                update
                    .transition()
                    .duration(1000)
                    .attr('cx', (d) => xScale(xValue(d)))
                    .attr('cy', (d) => yScale(yValue(d)))
                    .attr('r', (d) => Math.ceil(rValue(d)));
            },
            (exit) => {
                return exit.remove();
            }
        );

    // const scale = [3, 7, 10];

    // d3.select('div#scatter-label')
    //     .append('svg')
    //     .attr('id', 'legend')
    //     .attr('width', 400)
    //     .attr('height', 400);

    // d3.select('div#scatter-label')
    //     .select('#legend')
    //     .append('text')
    //     .attr('x', 200)
    //     .attr('y', 40)
    //     .text('Income Per Person (/5000)');

    // for (let i = 0; i < scale.length; i++) {
    //     d3.select('div#scatter-label')
    //         .select('#legend')
    //         .append('text')
    //         .attr('x', 170+ i * 70+40)
    //         .attr('y', 64)
    //         .text(scale[i] + ' = ');

    //     d3.select('div#scatter-label')
    //         .select('#legend')
    //         .append('circle')
    //         .attr('cx', 200 + i * 70+50)
    //         .attr('cy', 60)
    //         .attr('r', scale[i])
    //         .attr('fill', 'steelblue');
    // }


}



function handleMouseOver(e, d) {
    var name = Object.keys(d).includes('country') ? d.country : d.properties.name;
    if (countries.includes(name)===false)
        changeColor(d, 'red', 10);
}

function handleMouseLeave(e, d) {
    var name = Object.keys(d).includes('country') ? d.country : d.properties.name;
    if (countries.includes(name)===false)
        changeColor(d, 'steelblue', 3);
}

function changeColor(d, color, r) {
    var name;
    name = Object.keys(d).includes('country') ? d.country : d.properties.name;

    const paths = () =>
        d3
        .select('div#geo')
        .selectAll('path')
        .filter((c) => {
            if (name === c.properties.name) return c;
        })
        .style('fill', color);
    const circles = d3.select('div#scatter').selectAll('circle');

    circles
        .filter((c) => {
            if (name === c.country) {
                paths();
                return c;
            }
        })
        .transition()
        .duration(300)
        .style('fill', color)
        // .attr('r', r);

    const rects = d3.select('div#bar').selectAll('rect');

    rects
        .filter((c) => {
            if (name === c.country) {
                paths();
                return c;
            }
        })
        .transition()
        .duration(300)
        .style('fill', color);

    const outliers = d3.select('div#box').selectAll('circle');

    outliers
        .filter((c) => {
            if (name === c.country) {
                paths();
                return c;
            }
        })
        .transition()
        .duration(300)
        .style('fill', color)
        // .attr('r', r);
}

function handleClick(e, d) {
    var name = Object.keys(d).includes('country') ? d.country : d.properties.name;
    // console.log(name);
    if (countries.includes(name)===false){
        addCountry(name);
        changeColor(d, 'orange', 10);
        countries.push(name);
    }
    else{
        removeCountry(name);
        changeColor(d, 'steelblue', 10);
        
        const index = countries.indexOf(name);
        if (index > -1) {
            countries.splice(index, 1);
        }
    }
}   

function calculateFill(dataItem, i) {
    // var scale = d3
    //   .scaleLinear()
    //   .domain([1, d3.max(dataSet, (d) => d.budget)])
    //   .range([0, 1]);
    // return d3.interpolateBlues(scale(dataItem.budget));
    return "steelblue";
  }

function addCountry(country) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(country);
    node.appendChild(textnode);
    document.getElementById("myList").appendChild(node);
}

function removeCountry(country) {
    var list = document.getElementById("myList");
    list.removeChild(list.childNodes[countries.indexOf(country)]);
  }