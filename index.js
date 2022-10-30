const cols = document.querySelectorAll('.col');

document.addEventListener('keydown', (e) => {
  e.preventDefault();
  if (e.code.toLocaleLowerCase() === 'space') {
    setRandomColors();
  }
});

document.addEventListener('click', (e) => {
  const type = e.target.dataset.type;
  if (type === 'lock') {
    const node = e.target.tagName.toLowerCase() === 'i' ? e.target : e.target.children[0];

    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
  } else if (type === 'copy') {
    copyToClipboard(e.target.textContent);
  }
});

// function generateRandomColor() {
//   const hex = '0123456789ABCDEF';
//   let color = '';
//   for (let i = 0; i < 6; i++) {
//     color += hex[Math.floor(Math.random() * hex.length)];
//   }
//   return '#' + color;
// }

function setRandomColors(isInitialized) {
  const colors = isInitialized ? getColorFromHash() : [];
  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock');

    const color = isInitialized
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();
    const text = col.querySelector('h2');
    const button = col.querySelector('button');

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    if (!isInitialized) {
      colors.push(color);
    }

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
    updateLocationHash(colors);
  });
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? 'black' : 'white';
}

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

function updateLocationHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join('-');
}

function getColorFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map((color) => '#' + color);
  }
  return [];
}

setRandomColors(true);
