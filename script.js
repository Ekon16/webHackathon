document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const personalizationSection = document.getElementById('personalizacion');
    const personalizationForm = document.getElementById('personalization-form');
    const recommendationsSection = document.getElementById('recomendaciones');
    const recommendationsContainer = document.getElementById('recommendations-container');
    const interestBtns = document.querySelectorAll('.interest-btn');
    const budgetInput = document.getElementById('budget');
    const budgetOutput = document.querySelector('output[for="budget"]');

    startBtn.addEventListener('click', () => {
        personalizationSection.classList.remove('hidden');
        personalizationSection.scrollIntoView({ behavior: 'smooth' });
    });

    interestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    budgetInput.addEventListener('input', (e) => {
        budgetOutput.textContent = e.target.value;
    });

    personalizationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(personalizationForm);
        const interests = Array.from(interestBtns)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.dataset.interest);
        
        const userData = {
            interests: interests,
            schedule: formData.get('schedule'),
            budget: formData.get('budget')
        };

        // Aquí se enviarían los datos al backend y se recibirían las recomendaciones
        // Por ahora, simularemos este proceso con datos de ejemplo
        const recommendations = getRecommendations(userData);
        displayRecommendations(recommendations);
    });

    function getRecommendations(userData) {
        // Simulación de recomendaciones basadas en las preferencias del usuario
        const recommendations = [
            {
                title: 'Tour gastronómico por el centro histórico',
                description: 'Descubre los sabores locales en un recorrido por los mejores restaurantes y mercados de la ciudad.',
                price: 75,
                image: './Mercados.jpg'
            },
            {
                title: 'Senderismo en el Parque Nacional',
                description: 'Disfruta de la naturaleza en una ruta guiada por los senderos más espectaculares del parque.',
                price: 45,
                image: './Senderismo.jpg'
            },
            {
                title: 'Clase de cocina tradicional',
                description: 'Aprende a cocinar platos típicos de la región con un chef local en un ambiente acogedor.',
                price: 60,
                image: './ClaseCocina.jpg'
            }
        ];

        return recommendations.filter(rec => rec.price <= userData.budget);
    }

    function displayRecommendations(recommendations) {
        recommendationsContainer.innerHTML = '';
        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.classList.add('activity-card');
            card.innerHTML = `
                <img src="${rec.image}" alt="${rec.title}">
                <div class="activity-card-content">
                    <h3>${rec.title}</h3>
                    <p>${rec.description}</p>
                    <p class="price">${rec.price}€</p>
                    <button class="cta-button">Reservar ahora</button>
                </div>
            `;
            recommendationsContainer.appendChild(card);
        });

        recommendationsSection.classList.remove('hidden');
        recommendationsSection.scrollIntoView({ behavior: 'smooth' });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Código previo sin cambios
    
    // ...

    // Chatbot functionality
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');

    chatbotToggle.addEventListener('click', () => {
        chatbotWidget.classList.toggle('minimized');
    });

    chatbotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            addMessage('user', userMessage);
            chatbotInput.value = '';
            const botResponse = await getBotResponse(userMessage);
            addMessage('bot', botResponse);
        }
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', `${sender}-message`);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function getBotResponse(message) {
        try {
            // Nota: En un entorno de producción, esta llamada a la API debería hacerse desde el backend
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [
                    {"role": "system", "content": "Eres un asistente virtual de Compack, una plataforma de actividades personalizadas para viajes. Proporciona información útil y amigable sobre viajes y actividades."},
                    {"role": "user", "content": message}
                ]
            }, {
                headers: {
                    'Authorization': 'Bearer TU_API_KEY_DE_OPENAI',
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error al obtener respuesta del chatbot:', error);
            return 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde.';
        }
    }

    // Mensaje de bienvenida
    addMessage('bot', '¡Hola! Soy el asistente virtual de Compack. ¿En qué puedo ayudarte hoy?');
});