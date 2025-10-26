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