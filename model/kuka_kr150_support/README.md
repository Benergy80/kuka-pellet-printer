# KUKA KR 150 robot model (`kr150_2`)

Vendored from **ROS-Industrial** [`kuka_experimental`](https://github.com/ros-industrial/kuka_experimental) → `kuka_kr150_support` (branch `melodic-devel`).

- **License:** Apache-2.0 (ROS-Industrial). Original copyright retained.
- **Contents:** URDF/xacro + meshes — `visual/*.dae` (textured/colored) and `collision/*.stl` (decimated) for the **`kr150_2`** arm, the older 2-series arm that is the closest match to a **KR C2-era** machine.

## Where it's used
- **`/twin.html`** — interactive browser 3D twin. Uses the **collision STLs** (small, fast, no Collada up-axis quirks) assembled with the kinematics below.
- **RViz / MoveIt / Gazebo** — drop the package into a catkin/colcon workspace and use the xacro directly.
- **RoboDK / CAD** — import the **visual DAE** meshes for a higher-fidelity render.

## Kinematic chain (from the package URDF — units: m, °)

| Joint | Origin (xyz) | Axis | Limits |
|-------|--------------|------|--------|
| A1 | 0, 0, 0.75    | (0, 0, −1) | −185 … 185 |
| A2 | 0.35, 0, 0    | (0, 1, 0)  | −146 … 0 |
| A3 | 1.25, 0, 0    | (0, 1, 0)  | −119 … 155 |
| A4 | 0, 0, −0.055  | (−1, 0, 0) | −350 … 350 |
| A5 | 1.1, 0, 0     | (0, 1, 0)  | −125 … 125 |
| A6 | 0.23, 0, 0    | (−1, 0, 0) | −350 … 350 |
| flange → tool0 | fixed | rpy (0, 90°, 0) | — |

Note: the `kr150_2` arm geometry approximates the KR C2-era robot. For a different reach/payload variant (e.g. KR 150 L, KR 210), confirm against the robot's rating plate and swap the matching ROS-Industrial support package.
