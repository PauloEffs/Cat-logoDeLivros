const contactForm = document.getElementById('contactForm');
const contactType = document.getElementById('contactType');
const emailGroup = document.getElementById('emailGroup');
const whatsappGroup = document.getElementById('whatsappGroup');
const successMessage = document.getElementById('successMessage');

contactType.addEventListener('change', function() {
    emailGroup.style.display = 'none';
    whatsappGroup.style.display = 'none';
    
    if (this.value === 'email') {
        emailGroup.style.display = 'block';
        document.getElementById('email').required = true;
        document.getElementById('whatsapp').required = false;
    } else if (this.value === 'whatsapp') {
        whatsappGroup.style.display = 'block';
        document.getElementById('whatsapp').required = true;
        document.getElementById('email').required = false;
    }
});

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        contactType: contactType.value,
        contact: contactType.value === 'email' 
            ? document.getElementById('email').value 
            : document.getElementById('whatsapp').value,
        message: document.getElementById('message').value
    };

    console.log('Dados do formulário:', formData);
    

    successMessage.style.display = 'block';
    contactForm.reset();
    

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
});