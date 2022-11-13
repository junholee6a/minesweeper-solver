# Minesweeper Solver
This is a browser Minesweeper game with a button that will automatically select a next move if an obvious one exists.

The following is about my development process.

## Minesweeper Game
I had previously followed a tutorial for a simple snake game, so I decided to make Minesweeper next since they are both grid-based.

Challenges:
- Nuances in CSS, such as making an element responsive but setting size limits so that it doesn't get too big or small
- Keeping my JavaScript organized, as it was all in one file. I fix this later

## Solver
The solving algorithm is straightforward because it only looks for obvious moves, but it was more work to code and debug it than I expected.

Debugging was challenging, so I wrote tests for them and learned about test driven development. The tests made it much easier to debug logical errors that didn't crash the program but caused incorrect results.

## React
I thought my script structure could be improved, so I read tutorials on JavaScript and React, then rewrote the app using create-react-app.

Challenges:
- Planning a file structure and separating UI from "business logic". I ended up making a main component to handle UI, a custom hook to handle the game logic, and a util file containing functions with no global states or side effects (which are easier to debug).
- I tried to make a class to represent possible "moves" that can be made in Minesweeper. For example, the solver function would return a Move object containing the position and whether to flag or reveal a space. But there were so many exceptions to this, such as making no move or losing the game, that I decided it would be better to have functions return multiple values and write comments explaining the return values.