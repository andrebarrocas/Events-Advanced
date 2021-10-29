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
Tootip
    Aparece junto ao cursor (pais do mapa e circulo):
        - nome pais
        - alcoolconsumption
        - lifeexpentensy

Lista lado direito
    Clicar em paises e adicionar/remover da lista
    Destacar paises selecionados    
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
        .style("fill", calculateFill)
        .on('mouseover', handleMouseOver)
        .on('mouseleave', handleMouseLeave)
        .on('click', handleClick)
        .append('title')
        .text((d) => { 
            var country = dataset.filter((d1) => d1.country === d.properties.name);
            // console.log(country)
            if (country.length != 0) {
                return d.properties.name+"\n"+"Alcool Consumption: "+country[0]['alcconsumption']+" \n"+"Life Expectancy: "+country[0]['lifeexpectancy']
            }
        });

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
                    .append('title')
                    .text((d) => { 
                        // console.log(d)
                        return d.country+"\n"+"Alcool Consumption: "+d.alcconsumption+" \n"+"Life Expectancy: "+d.lifeexpectancy
                    })
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

}



function handleMouseOver(e, d) {
    var name = Object.keys(d).includes('country') ? d.country : d.properties.name;
    if (countries.includes(name)===false)
        changeColor(d, 'red');
}

function handleMouseLeave(e, d) {
    var name = Object.keys(d).includes('country') ? d.country : d.properties.name;
    if (countries.includes(name)===false)
        changeColor(d, 'steelblue');
}


function handleClick(e, d) {
    var name = Object.keys(d).includes('country') ? d.country : d.properties.name;
    // console.log(name);
    if (countries.includes(name)===false){
        addCountry(name);
        changeColor(d, 'orange');
        countries.push(name);
    }
    else{
        removeCountry(name);
        changeColor(d, 'steelblue');
        
        const index = countries.indexOf(name);
        if (index > -1) {
            countries.splice(index, 1);
        }
    }
}   

function calculateFill(dataItem, i) {
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


function changeColor(d, color) {
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
}