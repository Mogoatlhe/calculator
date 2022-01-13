# Calculator

## Purpose
Calculator functionality implemented in JavaScript as part of [The Odin Project](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/calculator) curriculum.

## Requirements
- [x]  Does not follow BODMAS, i.e `12 + 7 - 5 * 3` should add up to  `42` instead of `4`
  - The above statement means chained calculations are operated on `a pair at a time`
  + `12 + 7 - 5 * 3`
  + `19 - 5 * 3`
  + `14 * 3`
  + `42`
- [x] Avoid numbers from overflowing the screen, for me this only applies to answer. The chained operations can overflow because the design inspiration is from my phone's calculator and my phone's calculator has chained operations #overflowing.
- [x] Pressing "Clear" / "AC" should reset all the data allowing the user to start afresh.
- [x] Display a snarky message when division by 0 is attempted
- [x] Allow calculations on floating point numbers, and prevent users from entering numbers such as `12.3.56.5.`
  + Disable `.` if it already exists on current operand
- [x] Add a backspace button for the user to undo if they click the wrong number.
- [x] Add keyboard support

## Live Version
https://mogoatlhe.github.io/calculator

## Design
<div style = "display: flex; flex-direction: column; align-items: center;">
    <div>
    <img src = "images/design.png" width = 130 style = "border: lightblue 1px solid;">
    <img src = "images/design3.png" width = 130 style = "border: lightblue 1px solid;">
    <img src = "images/design2.png" width = 130 style = "border: lightblue 1px solid;">
    </div>
    <p>Screenshots from my phone calculator</p>
</div>

## Lessons Learnt

Read the spec thoroughly.

I started coding the calculator based on my phone's calculator design. Only to later realise that only `basic math operations` are required.

As a result I only implemented the required functionality, [with the intentions of coming back to it](https://www.youtube.com/watch?v=hr7Yww-3Y7E) once I've finished the curriculum so that I don't spend a lot time busy with "nice to haves" 