import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import numpy as np

g = 9.80665  # Gravity

def calculate_prediction():
    v0 = float(v0_pred_entry.get())
    theta = np.radians(float(theta_pred_entry.get()))
    h0 = float(h0_pred_entry.get())

    T = (v0 * np.sin(theta) + np.sqrt(v0**2 * np.sin(theta)**2 + 2 * g * h0)) / g
    R = v0 * np.cos(theta) * T
    H = h0 + (v0**2 * np.sin(theta)**2) / (2 * g)
    X_max = (v0**2 * np.sin(2 * theta)) / (2 * g)

    prediction_results_label.config(text=f"Range: {R:.2f} m\nMax Height: {H:.2f} m\nDistance at Max Height: {X_max:.2f} m")
    draw_trajectory(v0, theta, h0)

def calculate_calibration():
    R = float(range_cal_entry.get())
    theta = np.radians(float(theta_cal_entry.get()))
    h0 = float(h0_cal_entry.get())

    v0 = R * np.sqrt(g / (2 * np.cos(theta)**2 * (h0 + R * np.tan(theta))))

    calibration_results_label.config(text=f"Initial Velocity: {v0:.2f} m/s")
    draw_trajectory(v0, theta, h0)
    return v0

def calculate_targeting():
    x = float(target_x_entry.get())
    y = float(target_y_entry.get())
    h0 = float(h0_target_entry.get())

    a = -g * x**2
    b = 2 * x * (y - h0)
    c = -g * x**2 + 2 * (y - h0)**2

    discriminant = b**2 - 4 * a * c

    if discriminant < 0:
        targeting_results_label.config(text="Target Unreachable (No real solutions)")
        draw_trajectory(0, 0, 0)
        return

    u1 = (-b + np.sqrt(discriminant)) / (2 * a)
    u2 = (-b - np.sqrt(discriminant)) / (2 * a)

    u = u1
    if u2 > 0 and u1 < 0:
        u = u2

    theta = np.arctan(u)
    v0 = np.sqrt((g * x**2) / (2 * np.cos(theta)**2 * (x * u + h0 - y)))

    targeting_results_label.config(text=f"Initial Velocity: {v0:.2f} m/s\nLaunch Angle: {np.degrees(theta):.2f} degrees")
    draw_trajectory(v0, theta, h0)

def draw_trajectory(v0, theta, h0):
    plt.clf()

    if np.isnan(v0) or np.isnan(theta) or np.isnan(h0):
        return

    t = np.linspace(0, 10, 1000)
    x_values = v0 * np.cos(theta) * t
    y_values = h0 + v0 * np.sin(theta) * t - 0.5 * g * t**2

    valid_indices = y_values >= 0
    x_values = x_values[valid_indices]
    y_values = y_values[valid_indices]

    plt.plot(x_values, y_values)

    T_max = v0 * np.sin(theta) / g
    H = h0 + (v0**2 * np.sin(theta)**2) / (2 * g)
    X_max = (v0**2 * np.sin(2 * theta)) / (2 * g)
    T_range = (v0 * np.sin(theta) + np.sqrt(v0**2 * np.sin(theta)**2 + 2 * g * h0)) / g
    R = v0 * np.cos(theta) * T_range

    plt.plot(X_max, H, 'ro', label='Max Height')
    plt.plot(R, 0, 'bo', label='Range')

    if tab_control.index(tab_control.select()) == 2:  # Targeting Tab
        plt.plot(float(target_x_entry.get()), float(target_y_entry.get()), 'go', label='Target')

    plt.xlabel('Distance (m)')
    plt.ylabel('Height (m)')
    plt.title('Projectile Trajectory')
    plt.legend()
    plt.grid(True)

    canvas.draw()

# --- Tkinter UI Code ---
root = tk.Tk()
root.title("Projectile Trajectory Calculator")

tab_control = ttk.Notebook(root)
tab_prediction = ttk.Frame(tab_control)
tab_calibration = ttk.Frame(tab_control)
tab_targeting = ttk.Frame(tab_control)

tab_control.add(tab_prediction, text='Prediction Mode')
tab_control.add(tab_calibration, text='Calibration Mode')
tab_control.add(tab_targeting, text='Targeting Mode')
tab_control.pack(expand=1, fill='both')

# Prediction Mode
v0_pred_label = tk.Label(tab_prediction, text="Initial Velocity (m/s):")
v0_pred_label.pack()
v0_pred_entry = tk.Entry(tab_prediction)
v0_pred_entry.insert(0, "20")
v0_pred_entry.pack()

theta_pred_label = tk.Label(tab_prediction, text="Launch Angle (degrees):")
theta_pred_label.pack()
theta_pred_entry = tk.Entry(tab_prediction)
theta_pred_entry.insert(0, "45")
theta_pred_entry.pack()

h0_pred_label = tk.Label(tab_prediction, text="Initial Height (m):")
h0_pred_label.pack()
h0_pred_entry = tk.Entry(tab_prediction)
h0_pred_entry.insert(0, "0")
h0_pred_entry.pack()

prediction_button = tk.Button(tab_prediction, text="Calculate", command=calculate_prediction)
prediction_button.pack()

prediction_results_label = tk.Label(tab_prediction, text="")
prediction_results_label.pack()

# Calibration Mode
range_cal_label = tk.Label(tab_calibration, text="Horizontal Range (m):")
range_cal_label.pack()
range_cal_entry = tk.Entry(tab_calibration)
range_cal_entry.insert(0, "30")
range_cal_entry.pack()

theta_cal_label = tk.Label(tab_calibration, text="Launch Angle (degrees):")
theta_cal_label.pack()
theta_cal_entry = tk.Entry(tab_calibration)
theta_cal_entry.insert(0, "45")
theta_cal_entry.pack()

h0_cal_label = tk.Label(tab_calibration, text="Initial Height (m):")
h0_cal_label.pack()
h0_cal_entry = tk.Entry(tab_calibration)
h0_cal_entry.insert(0, "0")
h0_cal_entry.pack()

calibration_button = tk.Button(tab_calibration, text="Calculate", command=calculate_calibration)
calibration_button.pack()

calibration_results_label = tk.Label(tab_calibration, text="")
calibration_results_label.pack()

# Targeting Mode
target_x_label = tk.Label(tab_targeting, text="Target X (m):")
target_x_label.pack()
target_x_entry = tk.Entry(tab_targeting)
target_x_entry.insert(0, "25")
target_x_entry.pack()

target_y_label = tk.Label(tab_targeting, text="Target Y (m):")
target_y_label.pack()
target_y_entry = tk.Entry(tab_targeting)
target_y_entry.insert(0, "5")
target_y_entry.pack()

h0_target_label = tk.Label(tab_targeting, text="Initial Height (m):")
h0_target_label.pack()
h0_target_entry = tk.Entry(tab_targeting)
h0_target_entry.insert(0, "0")
h0_target_entry.pack()

targeting_button = tk.Button(tab_targeting, text="Calculate", command=calculate_targeting)
targeting_button.pack()

targeting_results_label = tk.Label(tab_targeting, text="")
targeting_results_label.pack()

# Matplotlib embedding
fig = plt.Figure(figsize=(6, 4), dpi=100)
ax = fig.add_subplot(111)
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.get_tk_widget().pack(side=tk.BOTTOM, fill=tk.BOTH, expand=1)

# Initialize plot
draw_trajectory(20, np.radians(45), 0)

root.mainloop()