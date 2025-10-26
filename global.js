console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add("current");

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"              // Local server (e.g., http://localhost:5500/)
    : "/portfolio/";     // Replace "website" with your GitHub Pages repo name

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "Resume" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/ryantjen", title: "GitHub"}
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !url.startsWith("http") ? BASE_PATH + url : url;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  if (a.host !== location.host) {
    a.target = "_blank";
  }
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
      <select id="color-scheme-select">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

const select = document.querySelector('#color-scheme-select');

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value
});

if ("colorScheme" in localStorage) {
  const savedScheme = localStorage.colorScheme;
  select.value = savedScheme;
  document.documentElement.style.setProperty("color-scheme", savedScheme);
}

const form = document.querySelector('form');

form?.addEventListener('submit', function(event) {
  event.preventDefault();
  const data = new FormData(form);
  const params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const url = `${form.action}?${params.join('&')}`;
  location.href = url;
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  // Validate containerElement
  if (!(containerElement instanceof HTMLElement)) {
    console.error('Invalid container element:', containerElement);
    return;
  }

  // Validate headingLevel
  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadings.includes(headingLevel)) {
    console.warn(`Invalid heading level "${headingLevel}", defaulting to h2`);
    headingLevel = 'h2';
  }

  // Create a new <article> element
  const article = document.createElement('article');

  // Populate the <article> with dynamic content and dynamic heading
  article.innerHTML = `
    <${headingLevel}>${project.title || 'Untitled Project'}</${headingLevel}>
    ${project.image ? `<img src="${project.image}" alt="${project.title || 'Project image'}">` : ''}
    <p>${project.description || 'No description available.'}</p>
  `;

  // Append the <article> to the container
  containerElement.appendChild(article);
}

export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}