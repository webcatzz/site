function create(tag, options = {}) {
  let el = document.createElement(tag);
  if (options.text) el.textContent = getAndDelete(options.text);
  if (options.class) el.className = getAndDelete(options.class);
  if (options.children) for (const child of getAndDelete(options.children)) el.appendChild(child);
  for (const property in options) el[property] = options[property];
  return el;

  function getAndDelete(property) {var value = property; delete property; return value}
}