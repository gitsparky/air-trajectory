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
    // Get all tab contents and tab items
    const tabs = document.querySelectorAll('.tab-content');
    const tabItems = document.querySelectorAll('.tab-item');

    // Remove the active class from all tabs and tab items
    tabs.forEach(tab => tab.classList.remove('active'));
    tabItems.forEach(tabItem => tabItem.classList.remove('active'));

    // Add the active class to the clicked tab content and corresponding tab item
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');
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
    const points = [];
    const tDelta = timeOfFlight / 100; // Number of points to plot
    for (let t = 0; t <= timeOfFlight; t += tDelta) {
        const x = launchVelocity * Math.cos(launchAngleRad) * t;
        const y = launchHeight + launchVelocity * Math.sin(launchAngleRad) * t - 0.5 * g * t * t;
        points.push({ x, y });
    }

    const labels = points.map(point => point.x); // X-axis labels (distance)
    const data = points.map(point => point.y); // Y-axis data (height)

    // Destroy the existing chart if it exists
    if (window.trajectoryChart) {
        window.trajectoryChart.destroy();
    }

    // Create a new Chart.js chart
    const ctx = document.getElementById('trajectoryCanvas').getContext('2d');
    window.trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Projectile Trajectory',
                    data: data,
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Distance (m)',
                    },
                    grid: {
                        drawTicks: true,
                        color: (context) => (context.tick.value % 0.5 === 0 ? '#ccc' : '#eee'), // Major ticks darker
                    },
                    ticks: {
                        stepSize: 0.1, // Minor ticks
                        callback: function (value) {
                            return value % 0.5 === 0 ? value.toFixed(1) : ''; // Show labels only for major ticks
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Height (m)',
                    },
                    grid: {
                        drawTicks: true,
                        color: (context) => (context.tick.value % 0.5 === 0 ? '#ccc' : '#eee'), // Major ticks darker
                    },
                    ticks: {
                        stepSize: 0.1, // Minor ticks
                        callback: function (value) {
                            return value % 0.5 === 0 ? value.toFixed(1) : ''; // Show labels only for major ticks
                        },
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const x = labels[context.dataIndex];
                            const y = data[context.dataIndex];
                            return `(${x.toFixed(2)}, ${y.toFixed(2)})`;
                        },
                    },
                },
                annotation: {
                    annotations: {
                        distanceAtMaxHeight: {
                            type: 'line',
                            xMin: distanceAtMaxHeight,
                            xMax: distanceAtMaxHeight,
                            borderColor: 'red',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: `Distance at Max Height: ${distanceAtMaxHeight.toFixed(2)} m`,
                                display: true,
                                position: 'start',
                                color: 'red',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            },
                        },
                        horizontalDistance: {
                            type: 'line',
                            xMin: horizontalDistance,
                            xMax: horizontalDistance,
                            borderColor: 'blue',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: `Horizontal Distance: ${horizontalDistance.toFixed(2)} m`,
                                display: true,
                                position: 'start',
                            },
                        },
                        maxHeight: {
                            type: 'line',
                            yMin: maxHeight,
                            yMax: maxHeight,
                            borderColor: 'green',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: `Max Height: ${maxHeight.toFixed(2)} m`,
                                display: true,
                                position: 'start',
                            },
                        },
                    },
                },
            },
        },
    });
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

function predictMultiple() {
    const velocities = document.getElementById('launchVelocities').value.split(',').map(v => parseFloat(v.trim()));
    const angles = document.getElementById('launchAngles').value.split(',').map(a => parseFloat(a.trim()));
    const launchHeight = parseFloat(document.getElementById('launchHeight').value);

    if (velocities.some(isNaN) || angles.some(isNaN) || isNaN(launchHeight)) {
        alert('Please enter valid inputs for velocities, angles, and launch height.');
        return;
    }

    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'pink', 'cyan', 'magenta'];
    const datasets = [];

    velocities.forEach((velocity, vIndex) => {
        angles.forEach((angle, aIndex) => {
            const angleRad = angle * (Math.PI / 180);
            const timeOfFlight = (velocity * Math.sin(angleRad) + Math.sqrt(Math.pow(velocity * Math.sin(angleRad), 2) + 2 * g * launchHeight)) / g;
            const points = [];
            const tDelta = timeOfFlight / 100;

            for (let t = 0; t <= timeOfFlight; t += tDelta) {
                const x = velocity * Math.cos(angleRad) * t;
                const y = launchHeight + velocity * Math.sin(angleRad) * t - 0.5 * g * t * t;
                points.push({ x, y });
            }

            datasets.push({
                label: `v=${velocity} m/s, θ=${angle}°`,
                data: points.map(p => ({ x: p.x, y: p.y })),
                borderColor: colors[(vIndex * angles.length + aIndex) % colors.length],
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
            });
        });
    });

    // Destroy the existing chart if it exists
    if (window.trajectoryChart) {
        window.trajectoryChart.destroy();
    }

    // Create a new Chart.js chart
    const ctx = document.getElementById('trajectoryCanvas').getContext('2d');
    window.trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Distance (m)',
                    },
                    grid: {
                        drawTicks: true,
                        color: (context) => (context.tick.value % 0.5 === 0 ? '#ccc' : '#eee'), // Major ticks darker
                    },
                    ticks: {
                        stepSize: 0.1, // Minor ticks
                        callback: function (value) {
                            return value % 0.5 === 0 ? value.toFixed(1) : ''; // Show labels only for major ticks
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Height (m)',
                    },
                    grid: {
                        drawTicks: true,
                        color: (context) => (context.tick.value % 0.5 === 0 ? '#ccc' : '#eee'), // Major ticks darker
                    },
                    ticks: {
                        stepSize: 0.1, // Minor ticks
                        callback: function (value) {
                            return value % 0.5 === 0 ? value.toFixed(1) : ''; // Show labels only for major ticks
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
        },
    });
}