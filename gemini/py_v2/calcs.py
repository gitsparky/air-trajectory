import numpy as np

g = 9.80665  # Gravity

def calculate_prediction(v0, theta, h0):
    theta_rad = np.radians(theta)
    T = (v0 * np.sin(theta_rad) + np.sqrt(v0**2 * np.sin(theta_rad)**2 + 2 * g * h0)) / g
    R = v0 * np.cos(theta_rad) * T
    H = h0 + (v0**2 * np.sin(theta_rad)**2) / (2 * g)
    X_max = (v0**2 * np.sin(2 * theta_rad)) / (2 * g)
    return R, H, X_max

def calculate_calibration(R, theta, h0):
    theta_rad = np.radians(theta)
    v0 = R * np.sqrt(g / (2 * np.cos(theta_rad)**2 * (h0 + R * np.tan(theta_rad))))
    return v0

def calculate_targeting(x, y, h0):
    a = -g * x**2
    b = 2 * x * (y - h0)
    c = -g * x**2 + 2 * (y - h0)**2

    discriminant = b**2 - 4 * a * c

    if discriminant < 0:
        return None, None  # Indicate no real solutions

    u1 = (-b + np.sqrt(discriminant)) / (2 * a)
    u2 = (-b - np.sqrt(discriminant)) / (2 * a)

    u = u1
    if u2 > 0 and u1 < 0:
        u = u2

    theta = np.arctan(u)
    v0 = np.sqrt((g * x**2) / (2 * np.cos(theta)**2 * (x * u + h0 - y)))

    return v0, np.degrees(theta)