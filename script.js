let supabaseClient;

async function initSupabase() {
    const supabaseUrl = 'https://qvvrmlfxqzawshotgmmk.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dnJtbGZ4cXphd3Nob3RnbW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4OTg4MDgsImV4cCI6MjAzODQ3NDgwOH0.U4RK_t2xMjJTfQpFv6VNnJFyfeToFG3ZwwrlhnCcRlY';
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
}

// Clase para manejar el juego del Ahorcado
class Ahorcado {
    constructor() {
        this.word = '';
        this.normalizedWord = '';
        this.guessedLetters = [];
        this.remainingAttempts = 6;
        this.wordContainer = document.getElementById('word-container');
        this.lettersContainer = document.getElementById('letters-container');
        this.messageElement = document.getElementById('message');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.canvas = document.getElementById('hangman-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.startTime = null;
        this.endTime = null;
        this.score = 0;

        this.newGameBtn.addEventListener('click', () => this.startNewGame());
    }

    // Iniciar un nuevo juego
    async startNewGame() {
        try {
            // Obtener una palabra aleatoria de la API
            const response = await fetch('https://random-word-api.herokuapp.com/word?lang=es');
            const data = await response.json();
            this.word = data[0].toUpperCase();
            this.normalizedWord = this.normalizeWord(this.word);
            this.guessedLetters = [];
            this.remainingAttempts = 6;
            this.startTime = new Date(); // Registrar el tiempo de inicio
            this.score = 0; // Reiniciar la puntuación
            this.updateDisplay();
            this.createLetterButtons();
            this.messageElement.textContent = '';
            this.enableLetterButtons();
            this.clearCanvas();
            this.drawGallows();
            this.showScoreTable();
        } catch (error) {
            console.error('Error al obtener la palabra:', error);
            this.messageElement.textContent = 'Error al iniciar el juego. Inténtalo de nuevo.';
        }
    }

    // Normalizar una palabra (quitar tildes)
    normalizeWord(word) {
        return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Actualizar la pantalla del juego
    updateDisplay() {
        this.wordContainer.innerHTML = this.word
            .split('')
            .map(letter => this.guessedLetters.includes(this.normalizeWord(letter)) ? letter : '_')
            .join(' ');
    }

    // Crear botones para las letras
    createLetterButtons() {
        this.lettersContainer.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement('button');
            button.textContent = letter;
            button.addEventListener('click', () => this.guessLetter(letter));
            this.lettersContainer.appendChild(button);
        }
    }

    // Manejar el intento de adivinar una letra
    guessLetter(letter) {
        const normalizedLetter = this.normalizeWord(letter);
        if (!this.guessedLetters.includes(normalizedLetter)) {
            this.guessedLetters.push(normalizedLetter);
            if (!this.normalizedWord.includes(normalizedLetter)) {
                this.remainingAttempts--;
                this.markIncorrectLetter(letter);
                this.drawNextPart();
            }
            this.updateDisplay();
            this.checkGameStatus();
        }
    }

    // Marcar una letra incorrecta
    markIncorrectLetter(letter) {
        const buttons = this.lettersContainer.getElementsByTagName('button');
        for (let button of buttons) {
            if (button.textContent === letter) {
                button.classList.add('incorrect');
                break;
            }
        }
    }

    // Verificar el estado del juego
    async checkGameStatus() {
        if (this.normalizedWord === this.normalizeWord(this.wordContainer.textContent.replace(/ /g, ''))) {
            this.calcularPuntuacion(); // Calcular la puntuación al ganar
            const playerNombre = prompt(`¡Felicidades! Has ganado con ${this.score} puntos. Ingresa tu nombre:`);
            if (playerNombre) {
                await this.savePlayerData(playerNombre, this.score);
            }
            this.messageElement.textContent = `¡Felicidades! Has ganado con ${this.score} puntos.`;
            this.endGame();
        } else if (this.remainingAttempts === 0) {
            this.calcularPuntuacion(); // Calcular la puntuación al perder
            this.messageElement.textContent = `Perdiste. La palabra era: ${this.word}. Tu puntuación: ${this.score} puntos.`;
            this.endGame();
        }
    }

    // Finalizar el juego
    endGame() {
        this.disableLetterButtons();
        // Asegurarse de que el botón de nuevo juego esté habilitado
        this.newGameBtn.disabled = false;
    }

    // Deshabilitar los botones de letras al finalizar el juego
    disableLetterButtons() {
        const buttons = this.lettersContainer.getElementsByTagName('button');
        for (let button of buttons) {
            button.disabled = true;
        }
    }

    // Habilitar los botones de letras al iniciar un nuevo juego
    enableLetterButtons() {
        const buttons = this.lettersContainer.getElementsByTagName('button');
        for (let button of buttons) {
            button.disabled = false;
            button.classList.remove('incorrect');
        }
    }

    // Limpiar el canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Dibujar la horca
    drawGallows() {
        this.ctx.strokeStyle = '#444';
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(175, 225);
        this.ctx.lineTo(5, 225);
        this.ctx.moveTo(40, 225);
        this.ctx.lineTo(25, 5);
        this.ctx.lineTo(100, 5);
        this.ctx.lineTo(100, 25);
        this.ctx.stroke();
    }

    // Dibujar la siguiente parte del ahorcado
    drawNextPart() {
        this.ctx.strokeStyle = '#444';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        switch (this.remainingAttempts) {
            case 5: // cabeza
                this.ctx.arc(100, 50, 25, 0, Math.PI * 2, true);
                break;
            case 4: // cuerpo
                this.ctx.moveTo(100, 75);
                this.ctx.lineTo(100, 140);
                break;
            case 3: // brazo izquierdo
                this.ctx.moveTo(100, 85);
                this.ctx.lineTo(60, 100);
                break;
            case 2: // brazo derecho
                this.ctx.moveTo(100, 85);
                this.ctx.lineTo(140, 100);
                break;
            case 1: // pierna izquierda
                this.ctx.moveTo(100, 140);
                this.ctx.lineTo(80, 190);
                break;
            case 0: // pierna derecha
                this.ctx.moveTo(100, 140);
                this.ctx.lineTo(120, 190);
                break;
        }
        this.ctx.stroke();
    }

    calcularPuntuacion() {
        this.endTime = new Date(); // Registrar el tiempo de finalización
        const tiempoTranscurrido = (this.endTime - this.startTime) / 1000; // en segundos
        this.score = Math.max(1000 - Math.floor(tiempoTranscurrido) * 10, 100);
    }

    async savePlayerData(nombre, puntos) {
        try {
            console.log('Intentando guardar datos del jugador:', {
                nombre,
                puntos
            });
            const {
                data,
                error
            } = await supabaseClient
                .from('score')
                .insert([{
                    nombre,
                    puntos,
                    fecha: new Date().toISOString()
                }, ]);

            if (error) {
                console.error('Error al guardar los datos del jugador:', error);
                this.messageElement.textContent = `Error al guardar los datos: ${error.message}`;
            } else {
                console.log('Datos del jugador guardados correctamente:', data);
                this.messageElement.textContent = `¡Felicidades ${nombre}! Tu puntuación de ${puntos} puntos ha sido registrada.`;
            }
        } catch (error) {
            console.error('Error inesperado al guardar los datos del jugador:', error);
            this.messageElement.textContent = `Error inesperado: ${error.message}`;
        }
    }

    /**
 * Muestra la tabla de puntuaciones
 */
    async showScoreTable() {
        try {
            console.log('Intentando obtener datos de la tabla de posiciones...');
            let { data, error } = await supabaseClient
                .from('score')
                .select('*')
                .order('puntos', { ascending: false })
                .limit(1000);
    
            if (error) {
                throw error;
            }
    
            if (data && data.length > 0) {
                let scoreTableHtml = '<h2>Tabla de Posiciones</h2><table>';
                scoreTableHtml += '<tr><th>Puesto</th><th>Nombre</th><th>Puntos</th><th>Fecha</th></tr>';
    
                data.forEach((score, index) => {
                    scoreTableHtml += `<tr>
                        <td>${index + 1}</td>
                        <td>${score.nombre}</td>
                        <td>${score.puntos}</td>
                        <td>${new Date(score.fecha).toLocaleDateString()}</td>
                    </tr>`;
                });
    
                scoreTableHtml += '</table>';
                this.messageElement.innerHTML = scoreTableHtml;
                console.log('Tabla de posiciones renderizada correctamente');
            } else {
                this.messageElement.textContent = 'No hay datos de puntuación disponibles.';
                console.log('No se encontraron datos de puntuación');
            }
        } catch (error) {
            console.error('Error al obtener los datos de la tabla de posiciones:', error);
            if (error instanceof TypeError && error.message.includes('fetch')) {
                this.messageElement.textContent = 'Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.';
            } else {
                this.messageElement.textContent = `Error al cargar la tabla de posiciones: ${error.message}`;
            }
        }
    }
}

// Inicializar el juego
async function initGame() {
    await initSupabase();
    const game = new Ahorcado();
    await game.startNewGame();
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initGame);
