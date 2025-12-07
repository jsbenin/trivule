import { Trivule, FormErrorData } from 'trivule';

declare global {
    interface Window {
        Trivule: typeof Trivule;
    }
}

window.Trivule = Trivule;
Trivule.init();
console.log('Trivule initialized successfully!');

const form = Trivule.form('form');

form.onSuccess((data) => {
    console.log('Form validation passed!', data);
    alert('Form is valid! Check console for validated data.');
});

form.onError((data: FormErrorData) => {
    console.log('Form validation failed:', data.errors);
    console.log('Form values:', data.values);
});
