document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');

    let brushSize = 5;
    let brushColor = '#000000';
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let isErasing = false;
    let storedImages = []; // Armazena as imagens do canvas antes de cada ação

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        if (isErasing) {
            ctx.clearRect(offsetX - brushSize/2, offsetY - brushSize/2, brushSize, brushSize);
        } else {
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }

        lastX = offsetX;
        lastY = offsetY;
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);

        canvas.addEventListener('mousemove', draw);
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        storeCanvas(); // Armazena a imagem atual do canvas quando o desenho é concluído
        canvas.removeEventListener('mousemove', draw);
    });

    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
        storeCanvas(); // Armazena a imagem atual do canvas quando o desenho é concluído
        canvas.removeEventListener('mousemove', draw);
    });

    const brushSizeInput = document.getElementById('brush-size');
    brushSizeInput.addEventListener('input', () => {
        brushSize = brushSizeInput.value;
        ctx.lineWidth = brushSize;
    });

    const colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', () => {
        brushColor = colorPicker.value;
        ctx.strokeStyle = brushColor;
    });

    const eraserButton = document.getElementById('eraser');
    eraserButton.addEventListener('click', () => {
        isErasing = !isErasing; // Alterna entre modo de borracha e desenho normal
        eraserButton.classList.toggle('active');
    });

    const undoButton = document.getElementById('undo');
    undoButton.addEventListener('click', () => {
        undoLastDrawing();
    });

    resizeCanvas(); // Chame resizeCanvas após a inicialização para evitar o erro

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - document.getElementById('controls').offsetHeight;
        storeCanvas(); // Atualiza a imagem armazenada quando o canvas é redimensionado
    }

    function storeCanvas() {
        storedImages.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Armazena a imagem atual do canvas
    }

    function undoLastDrawing() {
        if (storedImages.length > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
            storedImages.pop(); // Remove a última imagem da lista
            if (storedImages.length > 0) {
                ctx.putImageData(storedImages[storedImages.length - 1], 0, 0); // Restaura a imagem anterior
            }
        }
    }
});
