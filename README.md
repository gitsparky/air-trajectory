# Air trajectory app

This repo contains attempts to build a toy app to help with NY Science Olympiad Air trajectory project. This is also my excuse to try out the 'vibe coding' hype on a simple app.

There are attempts to use a plain JS app (that is runnable in a browser) as well as
an app in Python, since at some point Gemini said one of the JS calc was not stable. Regardless, not all variants of the apps work.

*WARNING*: The equations look reasonable but have not been thoroughly verified, so use at your own risk!

## Gemini
My first attempt was to use [Gemini](https://gemini.google.com) for coding. At some point the app got too large and it kept getting truncated. I did manage to cobble it together by asking Gemini to give me a file at a time.

The apps have 3 parts:

- Prediction mode: this is the straightforward application of the projectile motion laws, given initial conditions, predict the path and final setup of the projectile

- Calibation mode: this is meant to try to infer the launch velocity given the launch
angle and the distance traveled. The intended use is to build a mapping from the drop
height of the mass to the velocity, to be used in the competition to come up with
usable settings.

- Targeting mode: given a desired target location (in X and Y), determine one (or more) launch velocity and angle settings to hit the target. This tab does not work,
the equations seem wrong but I haven't debugged it.

## Copilot

v1: Simplified the app, especially removing the last tab from the Gemini attempt, and
removed the plot (for now)