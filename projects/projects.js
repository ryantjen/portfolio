import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
  const projectsContainer = document.querySelector('.projects');
  const projectsTitle = document.querySelector('.projects-title'); // select the <h1>

  // Clear the container
  projectsContainer.innerHTML = '';

  // Fetch projects from JSON
  const projects = await fetchJSON('../lib/projects.json');

  // Update the heading with the project count
  projectsTitle.textContent = `${projects.length} Projects`;

  // Render each project
  projects.forEach(proj => renderProjects(proj, projectsContainer));
}

loadProjects();

let projects = await fetchJSON('../lib/projects.json');
let selectedIndex = -1; // tracks which wedge is selected

function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let data = rolledData.map(([year, count]) => ({ value: count, label: year }));
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select('svg');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.html(''); // clear previous legend

  // Draw wedges and attach click handlers
  arcData.forEach((d, i) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i; // toggle selection

        // update wedges
        svg.selectAll('path')
          .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

        // update legend
        legend.selectAll('li')
          .attr('class', (_, idx) => idx === selectedIndex ? 'selected legend-item' : 'legend-item');
        projectsContainer.innerHTML = '';
        if (selectedIndex === -1) {
          projects.forEach(proj => renderProjects(proj, projectsContainer, 'h2'));
        } else {
          const selectedYear = data[selectedIndex].label;
          const filteredProjects = projects.filter(proj => proj.year === selectedYear);
          filteredProjects.forEach(proj => renderProjects(proj, projectsContainer, 'h2'));
        }
      });

    // create legend item
    legend.append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color:${colors(i)}`)
      .html(`<span class="swatch"></span> ${d.data.label} <em>(${d.data.value})</em>`);
  });
}

// initial render
renderPieChart(projects);

// handle search input
let searchInput = document.querySelector('.searchBar');
let projectsContainer = document.querySelector('.projects');

searchInput.addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();

  const filteredProjects = projects.filter((project) => {
    return Object.values(project).join('\n').toLowerCase().includes(query);
  });

  // render projects
  projectsContainer.innerHTML = '';
  filteredProjects.forEach((proj) => renderProjects(proj, projectsContainer));

  // render pie chart for filtered projects
  renderPieChart(filteredProjects);
});
