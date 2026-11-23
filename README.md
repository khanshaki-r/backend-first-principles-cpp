# Backend From First Principles — in C/C++

**Live site:** https://khanshaki-r.github.io/backend-first-principles-cpp/

A 30-day, concept-first backend engineering course. It follows the lesson order of Sriniously's
YouTube series ["Backend from first principles"](https://www.youtube.com/playlist?list=PLui3EUkuMTPgZcV0QhQrOcwMPcBCcd_Q1)
but explains every idea from the operating system up and illustrates it in C and modern C++.

Every day answers the same five questions:

1. **Why** does this exist?
2. **When** do you need it, and when don't you?
3. **How** does it work, from kernel and bytes upward?
4. **Use cases**: where it's used, and how real tools do it internally.
5. **What if** it's missing, done wrong, or the usual tool isn't available?

## Layout

| Path | Purpose |
|------|---------|
| `docs/` | The website (GitHub Pages, no build step). `docs/index.html` is the syllabus. |
| `docs/days/dayNN.html` | One page per day. `_template.html` is the page skeleton. |
| `docs/assets/` | Shared stylesheet and script. |
| `COURSE_PROMPT.md` | The master prompt used to generate the course, two days per session. |
| `PROGRESS.md` | Which days are done. |

## Running the code

Copy any code block from a day page into your editor. The C samples target C17 and the C++
samples target C++20, written for POSIX/Linux semantics. Nothing on the site needs to be
installed to read it.

## Credits

Lesson order and ideas: [Sriniously](https://www.youtube.com/@sriniously). Explanations,
diagrams and code here are original material written for this course.
