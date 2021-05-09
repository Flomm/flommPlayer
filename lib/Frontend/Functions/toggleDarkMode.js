export default function toggleDarkMode(checkbox, root) {
  if (checkbox.checked) {
    root.style.setProperty('--body', '#242121');
    root.style.setProperty('--shadow', 'rgb(29, 27, 27)');
    root.style.setProperty('--text', 'rgb(231, 229, 227)');
    root.style.setProperty('--main', 'rgb(24, 23, 22)');
    root.style.setProperty('--deep', 'rgb(32, 31, 31)');
    root.style.setProperty('--deeper', 'rgb(221, 211, 200)');
  } else {
    root.style.setProperty('--body', '#fcf8f8');
    root.style.setProperty('--shadow', 'black');
    root.style.setProperty('--text', 'rgb(15, 14, 14)');
    root.style.setProperty('--main', 'rgb(231, 229, 227)');
    root.style.setProperty('--deep', 'rgb(153, 151, 148)');
    root.style.setProperty('--deeper', 'rgb(90, 88, 86)');
  }
}
