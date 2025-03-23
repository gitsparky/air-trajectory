
const g = 9.80665 // gravity (m/s^2)

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
}