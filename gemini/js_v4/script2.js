const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const g = 9.80665; // Gravity m/s^2

function calculatePrediction() {
    const v0 = parseFloat(document.getElementById('v0_pred').value);
    const theta = parseFloat(document.getElementById('theta_pred').value) * Math.PI / 180;
    const h0 = parseFloat(document.getElementById('h0_pred').value);

    const T = (v0 * Math.sin(theta) + Math.sqrt(Math.pow(v0 * Math.sin(theta), 2) + 2 * g * h0)) / g;
    const R = v0 * Math.cos(theta) * T;
    const H = h0 + (Math.pow(v0 * Math.sin(theta), 2) / (2 * g));
    const X_max = (Math.pow(v0, 2) * Math.sin(2 * theta)) / (2 * g);

    document.getElementById('prediction_results').innerHTML = `
        Range: ${R.toFixed(2)} m<br>
        Max Height: ${H.toFixed(2)} m<br>
        Distance at Max Height: ${X_max.toFixed(2)} m
    `;
    drawTrajectory(v0, theta, h0);
}

function calculateCalibration() {
    const R = parseFloat(document.getElementById('range_cal').value);
    const theta = parseFloat(document.getElementById('theta_cal').value) * Math.PI / 180;
    const h0 = parseFloat(document.getElementById('h0_cal').value);

    const v0 = R * Math.sqrt(g / (2 * Math.pow(Math.cos(theta), 2) * (h0 + R * Math.tan(theta))));

    document.getElementById('calibration_results').innerHTML = `
        Initial Velocity: ${v0.toFixed(2)} m/s
    `;
    drawTrajectory(v0, theta, h0);
    return v0; // Return velocity so it can be used on tab switch
}

function calculateTargeting() {
    const x = parseFloat(document.getElementById('target_x').value);
    const y = parseFloat(document.getElementById('target_y').value);
    const h0 = parseFloat(document.getElementById('h0_target').value);

    const a = -g * x * x;
    const b = 2 * x * (y - h0);
    const c = -g * x * x + 2 * (y - h0) * (y - h0);

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        document.getElementById('targeting_results').innerHTML = `Target Unreachable (No real solutions, discriminant: ${discriminant})`;
        drawTrajectory(0, 0, 0);
        return;
    }

    const u1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const u2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    let u = u1;
    if (u2 > 0 && u1 < 0) {
        u = u2;
    }

    const theta = Math.atan(u);
    const v0 = Math.sqrt((g * x * x) / (2 * Math.pow(Math.cos(theta), 2) * (x * u + h0 - y)));

    document.getElementById('targeting_results').innerHTML = `
        Initial Velocity: ${v0.toFixed(2)} m/s<br>
        Launch Angle: ${(theta * 180 / Math.PI).toFixed(2)} degrees
    `;
    drawTrajectory(v0, theta, h0);
}

function drawTrajectory(v0, theta, h0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isNaN(v0) || isNaN(theta) || isNaN(h0)) return;

    let x = 0;
    let y = h0;
    const points = [];

    for (let t = 0; y >= 0; t += 0.01) {
        x = v0 * Math.cos(theta) * t;
        y = h0 + v0 * Math.sin(theta) * t - 0.5 * g * t * t;
        points.push({ x: x, y: y });
    }

    const xScale = canvas.width / Math.max(...points.map(p => p.x));
    const yScale = canvas.height / Math.max(...points.map(p => p.y));

    ctx.beginPath();
    ctx.moveTo(0, canvas.height - h0 * yScale);

    points.forEach(p => {
        ctx.lineTo(p.x * xScale, canvas.height - p.y * yScale);
    });

    ctx.stroke();

    // Draw markers
    const T_max = v0 * Math.sin(theta) / g;
    const H = h0 + (Math.pow(v0 * Math.sin(theta), 2) / (2 * g));
    const X_max = (Math.pow(v0, 2) * Math.sin(2 * theta)) / (2 * g);
    const T_range = (v0 * Math.sin(theta) + Math.sqrt(Math.pow(v0 * Math.sin(theta), 2) + 2 * g * h0)) / g;
    const R = v0 * Math.cos(theta) * T_range;

    ctx.fillStyle = 'red';
    ctx.fillRect(X_max * xScale - 3, canvas.height - H * yScale - 3, 6, 6);
    ctx.fillStyle = 'blue';
    ctx.fillRect(R * xScale - 3, canvas.height - 3, 6, 6);

    //Draw target
    if(document.getElementById('targeting') && document.getElementById('targeting').classList.contains('active')){
        ctx.fillStyle = 'green';
        ctx.fillRect(document.getElementById('target_x').value * xScale - 3, canvas.height - document.getElementById('target_y').value * yScale - 3, 6, 6);
    }
}

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');

        if(document.getElementById('prediction') && document.getElementById('prediction').classList.contains('active')){
            drawTrajectory(parseFloat(document.getElementById('v0_pred').value), parseFloat(document.getElementById('theta_pred').value) * Math.PI / 180, parseFloat(document.getElementById('h0_pred').value));
        } else if (document.getElementById('calibration')&& document.getElementById('calibration').classList.contains('active')){
            drawTrajectory(calculateCalibration(), parseFloat(document.getElementById('theta_cal').value) * Math.PI / 180, parseFloat(document.getElementById('h0_cal').value));
        } else if (document.getElementById('targeting')&& document.getElementById('targeting').classList.contains('active')){
            calculateTargeting();
        } else {
            drawTrajectory(0, 0, 0);
        }
    });
});

drawTrajectory(parseFloat(document.getElementById('v0_pred').value), parseFloat(document.getElementById('theta_pred').value) * Math.PI / 180, parseFloat(document.getElementById('h0_pred').value));