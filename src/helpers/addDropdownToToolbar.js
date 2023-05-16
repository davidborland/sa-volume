export function addDropdownToToolbar(props) {
  const { values, defaultValue } = props.options;
  const select = document.createElement('select');

  select.id = props.id;

  values.forEach((value) => {
    const optionElement = document.createElement('option');

    optionElement.value = String(value);
    optionElement.innerText = String(value);

    if (value === defaultValue) {
      optionElement.selected = true;
    }

    select.append(optionElement);
  });

  select.onchange = (evt) => {
    const selectElement = evt.target;

    if (selectElement) {
      props.onSelectedValueChange(selectElement.value);
    }
  };

  props.container = props.container ?? document.getElementById('demo-toolbar');
  props.container.append(select);
}