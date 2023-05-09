const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment" }
            });
            video.srcObject = stream;
        } catch (error) {
            console.error('Error starting video:', error);
        }
    }
}


async function detectObjects() {
    const model = await cocoSsd.load();
    setInterval(async () => {
        if (video && canvas) {
            const predictions = await model.detect(video);
            drawPredictions(predictions);
        }
    }, 100);
}

function drawPredictions(predictions) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.font = '18px Arial';
        ctx.fillStyle = '#00FF00';
        ctx.fillText(prediction.class, x, y - 5);
    });
}

video.onloadedmetadata = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    detectObjects();
};

startVideo();
