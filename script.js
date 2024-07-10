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
            this.updateDisplay();
            this.createLetterButtons();
            this.messageElement.textContent = '';
            this.enableLetterButtons();
            this.clearCanvas();
            this.drawGallows();
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
    checkGameStatus() {
        if (this.normalizedWord === this.normalizeWord(this.wordContainer.textContent.replace(/ /g, ''))) {
            this.messageElement.textContent = '¡Felicidades! Has ganado.';
            this.endGame();
        } else if (this.remainingAttempts === 0) {
            this.messageElement.textContent = `Perdiste. La palabra era: ${this.word}`;
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
}

// Inicializar el juego
const game = new Ahorcado();
game.startNewGame();