import math
import matplotlib.pyplot as plt

def projectile_trajectory(initial_velocity, launch_angle_degrees, gravity=9.81, initial_height=0):
    """Calculates projectile trajectory with initial height."""

    launch_angle_radians = math.radians(launch_angle_degrees)
    velocity_x = initial_velocity * math.cos(launch_angle_radians)
    velocity_y = initial_velocity * math.sin(launch_angle_radians)

    a = -0.5 * gravity
    b = velocity_y
    c = initial_height

    time_of_flight = (-b - math.sqrt(b**2 - 4 * a * c)) / (2 * a)

    max_height = initial_height + (velocity_y**2) / (2 * gravity)
    range_val = velocity_x * time_of_flight
    trajectory_points = []
    time_steps = 100
    time_to_max_height = velocity_y / gravity
    distance_to_max_height = velocity_x * time_to_max_height

    for i in range(time_steps + 1):
        time = (i / time_steps) * time_of_flight
        x = velocity_x * time
        y = initial_height + velocity_y * time - 0.5 * gravity * time**2
        trajectory_points.append((x, y))

    return {
        "time_of_flight": time_of_flight,
        "max_height": max_height,
        "range": range_val,
        "trajectory_points": trajectory_points,
        "distance_to_max_height": distance_to_max_height,
    }

def calculate_initial_velocity(distance, launch_angle_degrees, gravity=9.81, initial_height=0):
    """Calculates initial velocity given distance, launch angle, and initial height."""

    launch_angle_radians = math.radians(launch_angle_degrees)
    a = -0.5 * gravity
    b = distance * math.tan(launch_angle_radians)
    c = distance**2 * gravity / (2 * math.cos(launch_angle_radians)**2) + initial_height

    #Solve using the quadratic formula.
    initial_velocity = math.sqrt(c / (b - initial_height))

    return initial_velocity

def main():
    while True:
        print("\nProjectile Trajectory Calculator")
        print("1. Calculate Trajectory")
        print("2. Calculate Initial Velocity")
        print("3. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            initial_velocity = float(input("Initial Velocity (m/s): "))
            launch_angle_degrees = float(input("Launch Angle (degrees): "))
            gravity = float(input("Gravity (m/s^2): "))
            initial_height = float(input("Initial Height (m): "))

            trajectory = projectile_trajectory(initial_velocity, launch_angle_degrees, gravity, initial_height)

            print("Time of Flight:", trajectory["time_of_flight"])
            print("Maximum Height:", trajectory["max_height"])
            print("Range:", trajectory["range"])
            print("Distance to Max Height:", trajectory["distance_to_max_height"])

            x_values = [point[0] for point in trajectory["trajectory_points"]]
            y_values = [point[1] for point in trajectory["trajectory_points"]]

            plt.plot(x_values, y_values)
            plt.xlabel("Horizontal Distance (m)")
            plt.ylabel("Vertical Distance (m)")
            plt.title("Projectile Trajectory")
            plt.grid(True)
            plt.show()

        elif choice == "2":
            distance = float(input("Distance Traveled (m): "))
            launch_angle_degrees = float(input("Launch Angle (degrees): "))
            gravity = float(input("Gravity (m/s^2): "))
            initial_height = float(input("Initial Height (m): "))

            initial_velocity = calculate_initial_velocity(distance, launch_angle_degrees, gravity, initial_height)
            print("Initial Velocity:", initial_velocity)

        elif choice == "3":
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()