const g = 9.80665; // gravity (m/s^2)
const canvas = document.getElementById('trajectoryCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

function predict() {
    const launchHeight = parseFloat(document.getElementById('launchHeight').value);
    const launchVelocity = parseFloat(document.getElementById('launchVelocity').value);
    const launchAngle = parseFloat(document.getElementById('launchAngle').value);

    const launchAngleRad = launchAngle * (Math.PI / 180);

    const timeOfFlight = (launchVelocity * Math.sin(launchAngleRad) + Math.sqrt(Math.pow(launchVelocity * Math.sin(launchAngleRad), 2) + 2 * g * launchHeight)) / g;
    const horizontalDistance = launchVelocity * Math.cos(launchAngleRad) * timeOfFlight;
    const maxHeight = launchHeight + Math.pow(launchVelocity * Math.sin(launchAngleRad), 2) / (2 * g);
    const distanceAtMaxHeight = launchVelocity * Math.cos(launchAngleRad) * (launchVelocity * Math.sin(launchAngleRad) / g);

    document.getElementById('predictResults').innerHTML = `
        <p>Horizontal Distance: ${horizontalDistance.toFixed(2)} m</p>
        <p>Maximum Height: ${maxHeight.toFixed(2)} m</p>
        <p>Distance at Maximum Height: ${distanceAtMaxHeight.toFixed(2)} m</p>
    `;

    drawTrajectory(launchVelocity, launchAngleRad, launchHeight, timeOfFlight, horizontalDistance, maxHeight, distanceAtMaxHeight);
}

function drawTrajectory(launchVelocity, launchAngleRad, launchHeight, timeOfFlight, horizontalDistance, maxHeight, distanceAtMaxHeight) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const points = [];
    for (let t = 0; t <= timeOfFlight; t += 0.01) {
        const x = launchVelocity * Math.cos(launchAngleRad) * t;
        const y = launchHeight + launchVelocity * Math.sin(launchAngleRad) * t - 0.5 * g * t * t;
        points.push({ x, y });
    }

    const xScale = (canvas.width - 2 * padding) / horizontalDistance;
    const yScale = (canvas.height - 2 * padding) / maxHeight;

    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding - launchHeight * yScale);

    points.forEach(point => {
        ctx.lineTo(padding + point.x * xScale, canvas.height - padding - point.y * yScale);
    });

    ctx.stroke();

    // Draw markers and drop lines
    ctx.fillStyle = 'red';
    ctx.fillRect(padding + distanceAtMaxHeight * xScale - 3, canvas.height - padding - maxHeight * yScale - 3, 6, 6); // Max height marker
    ctx.fillStyle = 'blue';
    ctx.fillRect(padding + horizontalDistance * xScale - 3, canvas.height - padding - 3, 6, 6); // Range marker

    ctx.strokeStyle = 'red';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding + distanceAtMaxHeight * xScale, canvas.height - padding - maxHeight * yScale);
    ctx.lineTo(padding + distanceAtMaxHeight * xScale, canvas.height - padding);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding - maxHeight * yScale);
    ctx.lineTo(padding + horizontalDistance * xScale, canvas.height - padding - maxHeight * yScale);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('Distance (m)', canvas.width / 2 - 30, canvas.height - 5);
    ctx.save();
    ctx.translate(15, canvas.height / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Height (m)', 0, 0);
    ctx.restore();

    // Draw labels for max height and distance at max height
    ctx.fillText(`Max Height: ${maxHeight.toFixed(2)} m`, padding + distanceAtMaxHeight * xScale + 5, canvas.height - padding - maxHeight * yScale - 10);
    ctx.fillText(`Distance: ${distanceAtMaxHeight.toFixed(2)} m`, padding + distanceAtMaxHeight * xScale + 5, canvas.height - padding - 15);

    // Draw ticks, tick labels, and grid lines
    const xTickSpacing = 0.25;
    const yTickSpacing = 0.1;

    ctx.strokeStyle = 'lightgray';
    ctx.setLineDash([2, 2]);

    for (let i = 0; i <= horizontalDistance / xTickSpacing; i++) {
        const x = padding + i * xTickSpacing * xScale;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - padding);
        ctx.lineTo(x, padding);
        ctx.stroke();
        if (i % 2 === 0) {
            ctx.fillText((i * xTickSpacing).toFixed(2), x - 10, canvas.height - padding + 15);
        }
    }

    for (let i = 0; i <= maxHeight / yTickSpacing; i++) {
        const y = canvas.height - padding - i * yTickSpacing * yScale;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        if (i % 2 === 0) {
            ctx.fillText((i * yTickSpacing).toFixed(2), padding - 30, y + 3);
        }
    }

    ctx.setLineDash([]);
}

function calibrateVelocity() {
    const launchHeight = parseFloat(document.getElementById('launchHeight').value);
    const targetDistance = parseFloat(document.getElementById('targetDistance').value);
    const targetHeight = parseFloat(document.getElementById('targetHeight').value);
    const launchAngle = parseFloat(document.getElementById('calibrateAngle').value);

    const launchAngleRad = launchAngle * (Math.PI / 180);

    const velocity = Math.sqrt((g * targetDistance ** 2) / (2 * Math.cos(launchAngleRad) ** 2 * (targetDistance * Math.tan(launchAngleRad) - targetHeight + launchHeight)));
    const maxHeight = launchHeight + Math.pow(velocity * Math.sin(launchAngleRad), 2) / (2 * g);
    const distanceAtMaxHeight = velocity * Math.cos(launchAngleRad) * (velocity * Math.sin(launchAngleRad) / g);

    document.getElementById('calibrateVelocityResults').innerHTML = `
        <p>Launch Velocity: ${velocity.toFixed(2)} m/s</p>
        <p>Maximum Height: ${maxHeight.toFixed(2)} m</p>
        <p>Distance at Maximum Height: ${distanceAtMaxHeight.toFixed(2)} m</p>
    `;

    drawTrajectory(velocity, launchAngleRad, launchHeight, (2 * velocity * Math.sin(launchAngleRad)) / g, targetDistance, maxHeight, distanceAtMaxHeight);
}

function calibrateAngle() {
    const launchHeight = parseFloat(document.getElementById('launchHeight').value);
    const targetDistance = parseFloat(document.getElementById('targetDistanceAngle').value);
    const targetHeight = parseFloat(document.getElementById('targetHeightAngle').value);
    const launchVelocity = parseFloat(document.getElementById('calibrateVelocity').value);

    const angleRad = Math.atan((Math.pow(launchVelocity, 2) + Math.sqrt(Math.pow(launchVelocity, 4) - g * (g * targetDistance ** 2 + 2 * (targetHeight - launchHeight) * Math.pow(launchVelocity, 2)))) / (g * targetDistance));
    const angle = angleRad * (180 / Math.PI);
    const maxHeight = launchHeight + Math.pow(launchVelocity * Math.sin(angleRad), 2) / (2 * g);
    const distanceAtMaxHeight = launchVelocity * Math.cos(angleRad) * (launchVelocity * Math.sin(angleRad) / g);

    document.getElementById('calibrateAngleResults').innerHTML = `
        <p>Launch Angle: ${angle.toFixed(2)} degrees</p>
        <p>Maximum Height: ${maxHeight.toFixed(2)} m</p>
        <p>Distance at Maximum Height: ${distanceAtMaxHeight.toFixed(2)} m</p>
    `;

    drawTrajectory(launchVelocity, angleRad, launchHeight, (2 * launchVelocity * Math.sin(angleRad)) / g, targetDistance, maxHeight, distanceAtMaxHeight);
}