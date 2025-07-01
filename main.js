
  // Get the toggle input
  const toggle = document.getElementById('themeToggle');

  // Get all the <h1 class="glow"> elements
  const headings = document.querySelectorAll('.glow');

  // Add event listener to toggle
  toggle.addEventListener('change', function () {
    if (toggle.checked) {
      // Toggle ON - change styles
      headings.forEach(heading => {
        heading.style.backgroundColor = 'black';
        heading.style.color = 'white';
        heading.style.textShadow = '0 0 10px cyan';
        heading.style.fontSize = '30px';
      });
    } else {
      // Toggle OFF - reset styles
      headings.forEach(heading => {
        heading.style.backgroundColor = 'white';
        heading.style.color = 'black';
        heading.style.textShadow = 'none';
        heading.style.fontSize = '100px';
      });
    }
  });