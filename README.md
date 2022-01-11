# Calculator

## Purpose
Calculator functionality implemented in JavaScript as part of [The Odin Project](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/calculator) curriculum.

## Requirements
- Does not follow BODMAS, i.e `12 + 7 - 5 * 3` should add up to  `42` instead of `4`
- The above statement means chained calculations are operated on `a pair at a time`
 + `12 + 7 - 5 * 3`
 + `19 - 5 * 3`
 + `14 * 3`
 + `42`
- Avoid numbers from overflowing the screen, for me this only applies to answer. The chained operations can overflow because the design inspiration is from my phone's calculator and my phone's calculator has chained operations #overflowing.
- Pressing "Clear" / "AC" should reset all the data allowing the user to start afresh.
- Display a snarky message when division by 0 is attempted
- Allow calculations on floating point numbers, and prevent users from entering numbers such as `12.3.56.5.`
 + Disable `.` if it already exists on current operand
- Add a backspace button for the user to undo if they click the wrong number.
- Add keyboard support

## Design
<div style = "display: flex; flex-direction: column; align-items: center;">
    <div>
    <img src = "images/design.png" width = 130 style = "border: lightblue 1px solid;">
    <img src = "images/design3.png" width = 130 style = "border: lightblue 1px solid;">
    <img src = "images/design2.png" width = 130 style = "border: lightblue 1px solid;">
    </div>
    <p>Screenshots from my phone calculator</p>
</div>