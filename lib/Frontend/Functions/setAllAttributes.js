export default function setAllAtributes(elem, attr, values) {
  attr.forEach((attr, i) => {
    elem.setAttribute(attr, `${values[i]}`);
  });
}
