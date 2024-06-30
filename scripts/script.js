$(document).ready(function () {
    $('#visualizeButton').click(function () {
        const inputSchemaText = $('#inputSchema').val();
        let inputSchema;
        try {
            inputSchema = JSON.parse(inputSchemaText);
        } catch (e) {
            alert('Invalid JSON');
            return;
        }

        const formContainer = $('#formContainer');
        formContainer.html('');

        if (inputSchema && inputSchema.properties) {
            for (const key in inputSchema.properties) {
                if (inputSchema.properties.hasOwnProperty(key)) {
                    const property = inputSchema.properties[key];
                    const formElement = generateFormElement(key, property);
                    formContainer.append(formElement);
                }
            }
        }
    });

    $('[data-toggle="tooltip"]').tooltip();
});

function generateFormElement(name, schema) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    let inputGroup;
    let inputElement;

    switch (schema.type) {
        case 'string':
            inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';

            switch(schema.editor) {
                case 'textarea':
                    inputElement = document.createElement('textarea');
                    inputElement.placeholder = schema.default || '';
                    inputElement.value = schema.prefill || '';
                    break;
                case 'javascript':
                    inputElement = document.createElement('textarea');
                    inputElement.setAttribute('data-editor', 'javascript');
                    inputElement.placeholder = schema.default || '';
                    inputElement.value = schema.prefill || '';
                    break;
                case 'python':
                    inputElement = document.createElement('textarea');
                    inputElement.setAttribute('data-editor', 'python');
                    inputElement.placeholder = schema.default || '';
                    inputElement.value = schema.prefill || '';
                    break;
                case 'datepicker':
                    inputElement = document.createElement('input');
                    inputElement.type = 'date';
                    inputElement.placeholder = schema.default || '';
                    inputElement.value = schema.prefill || '';
                    break;
                case 'hidden':
                    inputElement = document.createElement('input');
                    inputElement.type = 'hidden';
                    inputElement.placeholder = schema.default || '';
                    inputElement.value = schema.prefill || '';
                    break;
                default:
                    if(schema.enum && schema.enum.length > 0) {
                        inputElement = document.createElement('select');

                        for (let i = 0; i < schema.enum.length; i++) {
                            const optionElement = document.createElement('option');

                            const value = schema.enum[i];
                            const title = schema.enumTitles[i];

                            optionElement.value = value;
                            optionElement.innerText = title || value;
                            
                            if (schema.prefill === value || schema.default === value) {
                                optionElement.selected = true;
                            }

                            inputElement.appendChild(optionElement);
                        }
                    } else {
                        inputElement = document.createElement('input');
                        inputElement.type = 'text';
                        inputElement.placeholder = schema.default || '';
                        inputElement.value = schema.prefill || '';
                    }
            }

            inputElement.className = 'form-control';
            inputGroup.appendChild(inputElement);
            wrapper.appendChild(inputGroup);

            break;
        case 'integer':
            inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';

            const inputGroupPrepend = document.createElement('div');
            inputGroupPrepend.className = 'input-group-prepend';

            const numberLabel = document.createElement('label');
            numberLabel.className = 'font-weight-bold';
            numberLabel.innerText = schema.title || name;

            const numberTooltip = document.createElement('span');
            numberTooltip.setAttribute('data-toggle', 'tooltip');
            numberTooltip.setAttribute('title', schema.description);
            numberTooltip.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" color="var(--color-Neutral_IconSubtle)">
                            <path fill="currentColor" d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11M8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-6a2.76 2.76 0 0 1 1.637.525c.503.377.863.965.863 1.725 0 .448-.115.83-.329 1.15-.205.307-.47.513-.692.662-.109.072-.22.138-.313.195l-.006.004a6 6 0 0 0-.26.16 1 1 0 0 0-.276.245.75.75 0 0 1-1.248-.832c.184-.264.42-.489.692-.66q.154-.102.313-.196l.007-.004c.1-.06.182-.11.258-.16a1 1 0 0 0 .277-.246C8.96 6.514 9 6.428 9 6.25a.61.61 0 0 0-.262-.525A1.27 1.27 0 0 0 8 5.5c-.369 0-.595.09-.74.187a1 1 0 0 0-.34.398.748.748 0 0 1-1.381-.097.75.75 0 0 1 .04-.573c.169-.339.436-.7.849-.977C6.845 4.16 7.369 4 8 4"></path>
                        </svg>`;

            numberLabel.appendChild(numberTooltip);

            inputGroupPrepend.appendChild(numberLabel);

            inputElement = document.createElement('input');
            inputElement.type = 'number';
            inputElement.className = 'form-control';

            if (schema.default != null || schema.prefill != null){
                inputElement.value = schema.default ?? schema.prefill;
            }

            inputGroup.appendChild(inputGroupPrepend);
            inputGroup.appendChild(inputElement);

            wrapper.appendChild(inputGroup);
            break;
        case 'boolean':
            inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.className = 'custom-control-input';
            inputElement.checked = schema.default || false;

            const switchWrapper = document.createElement('div');
            switchWrapper.className = 'custom-control custom-switch';

            const switchLabel = document.createElement('label');
            switchLabel.className = 'custom-control-label';
            switchLabel.htmlFor = name;
            switchLabel.innerText = schema.title || name;

            inputElement.id = name;

            const tooltip = document.createElement('span');
            tooltip.setAttribute('data-toggle', 'tooltip');
            tooltip.setAttribute('title', schema.description);
            tooltip.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" color="var(--color-Neutral_IconSubtle)">
                            <path fill="currentColor" d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11M8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-6a2.76 2.76 0 0 1 1.637.525c.503.377.863.965.863 1.725 0 .448-.115.83-.329 1.15-.205.307-.47.513-.692.662-.109.072-.22.138-.313.195l-.006.004a6 6 0 0 0-.26.16 1 1 0 0 0-.276.245.75.75 0 0 1-1.248-.832c.184-.264.42-.489.692-.66q.154-.102.313-.196l.007-.004c.1-.06.182-.11.258-.16a1 1 0 0 0 .277-.246C8.96 6.514 9 6.428 9 6.25a.61.61 0 0 0-.262-.525A1.27 1.27 0 0 0 8 5.5c-.369 0-.595.09-.74.187a1 1 0 0 0-.34.398.748.748 0 0 1-1.381-.097.75.75 0 0 1 .04-.573c.169-.339.436-.7.849-.977C6.845 4.16 7.369 4 8 4"></path>
                        </svg>`;
            switchLabel.appendChild(tooltip);

            switchWrapper.appendChild(inputElement);
            switchWrapper.appendChild(switchLabel);

            if (schema.groupCaption || schema.groupDescription) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'form-group';

                const groupHeader = document.createElement('div');
                groupHeader.className = 'd-flex justify-content-between align-items-center font-weight-bold';

                const groupLabel = document.createElement('label');
                groupLabel.innerText = schema.groupCaption || '';

                const groupTooltip = document.createElement('span');
                groupTooltip.className = 'ml-2';
                groupTooltip.setAttribute('data-toggle', 'tooltip');
                groupTooltip.setAttribute('title', schema.groupDescription);
                groupTooltip.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" color="var(--color-Neutral_IconSubtle)">
                        <path fill="currentColor" d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m0 1.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11M8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-6a2.76 2.76 0 0 1 1.637.525c.503.377.863.965.863 1.725 0 .448-.115.83-.329 1.15-.205.307-.47.513-.692.662-.109.072-.22.138-.313.195l-.006.004a6 6 0 0 0-.26.16 1 1 0 0 0-.276.245.75.75 0 0 1-1.248-.832c.184-.264.42-.489.692-.66q.154-.102.313-.196l.007-.004c.1-.06.182-.11.258-.16a1 1 0 0 0 .277-.246C8.96 6.514 9 6.428 9 6.25a.61.61 0 0 0-.262-.525A1.27 1.27 0 0 0 8 5.5c-.369 0-.595.09-.74.187a1 1 0 0 0-.34.398.748.748 0 0 1-1.381-.097.75.75 0 0 1 .04-.573c.169-.339.436-.7.849-.977C6.845 4.16 7.369 4 8 4"></path>
                    </svg>`;

                if (schema.groupDescription) {
                    groupHeader.appendChild(groupTooltip);
                }

                groupLabel.append(groupTooltip);
                groupHeader.appendChild(groupLabel);

                groupDiv.appendChild(groupHeader);
                groupDiv.appendChild(switchWrapper);
                wrapper.appendChild(groupDiv);
            } else {
                wrapper.appendChild(switchWrapper);
            }
            break;
        case 'array':
            inputElement = document.createElement('textarea');
            inputElement.className = 'form-control';
            break;
        case 'enum':
            inputElement = document.createElement('select');
            inputElement.className = 'form-control';

            if (schema.enum && schema.enum.length > 0) {
                schema.enum.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.innerText = option.title || option.value;

                    if (schema.prefill === option.value || schema.default === option.value) {
                        optionElement.selected = true;
                    }

                    inputElement.appendChild(optionElement);
                });
            }
            break;
        default:
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.className = 'form-control';
    }

    inputElement.name = name;
    inputElement.id = name;

    if (schema.type !== 'boolean' && schema.type !== 'number') {
        wrapper.appendChild(inputElement);
    }

    return wrapper;
}
