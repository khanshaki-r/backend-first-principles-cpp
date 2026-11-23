# Backend From First Principles — Concepts Explained Through C/C++ (Learning Website Build Prompt)

> This file is the master prompt. Keep it at the root of the repo.
> Each new Claude session starts with the SHORT per-session message in Section 4.
> Claude reads this file for all rules, so the per-session message stays tiny and cheap.

---

## 1. Goal

Build a static learning website (GitHub Pages) that re-teaches Sriniously's YouTube series
**"Backend from first principles"** (playlist `PLui3EUkuMTPgZcV0QhQrOcwMPcBCcd_Q1`, 31 videos),
with every concept explained in depth and illustrated in **C and C++**.

**Concepts are the priority, not tooling.** Every topic must answer, in this order:

1. **WHY** does this exist? What problem was there before it?
2. **WHEN** do you need it, and when do you NOT need it?
3. **HOW** does it work, from the lowest layer that matters (OS, kernel, TCP, bytes, memory) up?
4. **USE CASES** — real situations where it is used, with concrete examples.
5. **WHAT IF it's missing?** — what goes wrong if you skip it, do it badly, or the dependency is
   not available (no Redis, no load balancer, no auth layer, no graceful shutdown…). Show the
   failure, then the alternatives / fallbacks.

Code is there to make the concept concrete, not to be a project. I will run code myself in my
own IDE or laptop. Claude does NOT need to compile, run, install anything, or set up toolchains.

The course is split into **30 days**. Each Claude session builds **exactly 2 days**, then commits
and pushes to GitHub. Never generate more than 2 days in one session.

---

## 2. Repository Layout (create in Session 0, then keep stable)

```
backend-first-principles-cpp/     # its own git repo, sibling of systems-mastery-course
├── COURSE_PROMPT.md          # this file
├── PROGRESS.md               # checklist: which days are done, date
├── README.md                 # what this repo is + link to the live site
└── docs/                     # GitHub Pages site (plain HTML/CSS/JS, no build step)
    ├── index.html            # course home: syllabus table, progress, links to each day
    ├── .nojekyll
    ├── assets/
    │   ├── style.css         # one shared stylesheet (light + dark via prefers-color-scheme)
    │   └── site.js           # nav, code-copy buttons, collapsible sections, quiz toggles
    └── days/
        ├── day01.html
        ├── day02.html
        └── ...
```

Rules:
- Static site only. No frameworks, no npm, no bundler. Syntax highlighting via a pinned CDN copy
  of highlight.js (cdnjs). Everything else inline/local.
- One shared stylesheet. Every day page must look identical in structure.
- `docs/index.html` is updated every session (mark new days as done, link them).
- All code lives inside the day's HTML page as highlighted code blocks with a copy button.
  No separate code folders, no Makefiles, no build instructions.

---

## 3. Content Rules for Every Day Page

Each `docs/days/dayNN.html` must contain these sections, in this order:

1. **Title + "What Sriniously teaches in this video"** — 3–6 bullets summarising the original
   lesson's ideas (concepts, not his JS/TS code).

2. **The problem before this existed (WHY)** — tell the story: what did engineers do before,
   what hurt, what broke. Start from the lowest layer that matters. Analogies welcome.

3. **When you need it / when you don't (WHEN)** — decision guidance. Small app vs large app,
   one server vs many, internal tool vs public API. Be honest about over-engineering.

4. **How it works (HOW)** — the mechanism, bottom-up: OS and kernel level (syscalls like
   `socket`, `accept`, `read`, `epoll`), what the bytes look like on the wire or in memory,
   data structures involved, the algorithm. At least one diagram per day (ASCII in `<pre>` or
   inline SVG). This is the deepest section.

5. **See it in C** — a short, complete, readable C program that shows the core mechanism with
   no libraries (hand-written HTTP parser, function-pointer router, LRU with a linked list…).
   Heavily commented. Explain the important lines in prose below the code. Keep it focused:
   show the concept, not a full product.

6. **See it in modern C++** — the same idea done the way a production C++ backend would:
   RAII, `std::string_view`, `std::optional`, `std::variant`, `std::expected`, smart pointers,
   STL containers, C++17/20. Explain *why* the C++ version is safer or clearer than the C one.
   Where a real library is the honest answer (libpq, hiredis, OpenSSL, nlohmann/json,
   Boost.Asio, cpp-httplib…), show how it is used AND explain what it does internally.

7. **Real-world use cases** — 3–5 concrete scenarios (e.g. "an e-commerce checkout", "a chat
   app with 50k users", "a bank transfer") showing how the concept is applied, and how real
   tools (Nginx, Postgres, Redis, Elasticsearch, RabbitMQ, Docker, S3, Prometheus…) implement
   it internally, described in C/C++ terms.

8. **What if it's missing? (WHAT IF)** — the most important section after HOW.
   - What breaks if you skip this concept entirely (show the failure, with a short example).
   - What breaks if you do it wrong (common anti-patterns).
   - What to do when the usual tool is NOT available: no Redis → in-process cache? no message
     broker → DB-backed queue? no load balancer → DNS round robin? no TLS cert → ? Give the
     fallback, its trade-offs, and when the fallback is actually fine.

9. **Common mistakes & gotchas** — memory leaks, buffer overflows, partial reads, endianness,
   blocking calls, UB, thread-safety, etc. relevant to the day's topic. C/C++ specific.

10. **Think about it (exercises)** — 3–5 thought exercises or small coding tasks (easy → hard),
    each with a collapsible answer/hint. At least two must be "what would happen if…" questions.

11. **Quiz** — 5 questions with collapsible answers, focused on why/when, not trivia.

12. **Summary + key terms** — one-paragraph recap and a glossary table for the day.

13. **Nav** — Prev day / Home / Next day.

Code style rules (so the code is correct when I run it myself):
- Target POSIX / Linux semantics (that's where backends run). Where Windows differs, one short
  note is enough; don't duplicate code.
- C: C17. C++: C++20. Code should compile cleanly with `-Wall -Wextra` in principle, but Claude
  does not compile or run anything. Just write it carefully.
- No placeholder code, no `// TODO`, no pseudo-code in the "See it" sections.
- Prefer one complete, focused example (50–150 lines) over several fragments.
- Each day page roughly 500–900 lines of HTML. Depth over breadth, no padding.

---

## 4. Per-Session Workflow (what Claude does every time)

**My per-session message will be just:**

```
Read COURSE_PROMPT.md and PROGRESS.md. Build Day N and Day N+1. Then commit and push.
```

When Claude receives that, it must:

1. Read `COURSE_PROMPT.md` (this file) and `PROGRESS.md`. Open the previous day's HTML so
   style, nav and conventions stay consistent. Do NOT re-read all earlier days.
2. Build Day N: `docs/days/dayNN.html`, update `docs/index.html`.
3. Build Day N+1 the same way.
4. Update `PROGRESS.md` (mark both days done with today's date).
5. `git add -A`, commit as `Day NN-MM: <topic A> / <topic B>`, then `git push origin main`.
6. Final message: what was built, anything skipped and why, and the next command to run
   (`Build Day N+2 and Day N+3`).

Token discipline: never generate more than 2 days per session, never regenerate finished days
unless I explicitly ask for a fix. No compiling, no installing, no environment setup.

---

## 5. Session 0 (one-time setup) — run this ONCE before Day 1

```
Read COURSE_PROMPT.md. Do Session 0 setup only: create the repo layout, docs/index.html with the
full 30-day syllabus table (all days marked "not started"), docs/.nojekyll, assets/style.css,
assets/site.js, README.md, PROGRESS.md and a day page template. Then git init (branch main),
commit, add the remote and push. Do NOT build any day content yet.
```

GitHub rules for Session 0:
- GitHub user: `khanshaki-r`. Repo name: `backend-first-principles-cpp`.
- `gh` CLI is not installed. After the local commit, add the remote
  `https://github.com/khanshaki-r/backend-first-principles-cpp.git` and try `git push -u origin main`.
  If the push fails because the repo does not exist yet, tell me to create an empty public repo
  with that exact name at https://github.com/new (no README, no .gitignore) and stop; I will
  re-run the push.
- GitHub Pages: tell me the exact clicks once: Settings -> Pages -> Source "Deploy from a
  branch" -> Branch `main`, folder `/docs`.
- Live site URL will be `https://khanshaki-r.github.io/backend-first-principles-cpp/`.
  Put it at the top of `README.md` and `docs/index.html`.

---

## 6. The 30-Day Syllabus (maps the 31 videos to days)

| Day | Source video(s) | Topic |
|----:|-----------------|-------|
| 1 | 1, 2 | Roadmap and the mindset of a backend engineer. What "first principles" means. How a request travels: browser → DNS → TCP → your process → response. Why most tutorials skip this and what that costs you. |
| 2 | 3, 4 | What a backend *is*: client, network, process, OS. What a server literally is (a process blocked in `accept()`). Minimal TCP server in C and the same with RAII sockets in C++. What if there is no backend at all (static sites, local-only apps, P2P)? |
| 3 | 5 | HTTP from the wire up: request/response format, methods, status codes, headers, keep-alive, chunked encoding, HTTP/1.1 vs 2 vs 3. Hand-written HTTP/1.1 parser in C, `std::string_view` parser in C++. What if you ignore the spec (partial reads, no Content-Length)? |
| 4 | 6 | Routing: how a request finds its handler. Path matching, params, trie/radix routers, method dispatch, route conflicts. Function-pointer table in C, trie router in C++. What if there's no router (giant if/else, one endpoint for everything)? |
| 5 | 7 | Serialization & deserialization: text vs binary, JSON, Protobuf/MessagePack ideas, endianness, zero-copy, schema evolution. JSON writer/parser in C; nlohmann/json in C++ and what it does internally. What if you just `memcpy` structs across the network? |
| 6 | 8 | Authentication & authorization: sessions, cookies, JWT, HMAC/SHA-256, password hashing (bcrypt/argon2), RBAC vs ABAC. HMAC-signed tokens with OpenSSL. What if auth is missing, weak, or only on the frontend? |
| 7 | 9 | Validation & transformation: trust boundaries, schema validation, sanitization, DTOs, canonical forms. Declarative validator in C++ (templates/variants). What if you trust input (overflows, injection, garbage in DB)? |
| 8 | 10 | Controllers, services, repositories, middlewares, request context: layered architecture, middleware chains as function composition, per-request context without globals. What if it's all in one function? When is layering over-engineering? |
| 9 | 11 | Complete REST API design: resources, verbs, status codes, pagination, filtering, versioning, idempotency, HATEOAS. CRUD API in C++. What if you break REST (RPC-over-POST, no versioning, no idempotency)? |
| 10 | 12 | Databases with Postgres: wire protocol, connections, prepared statements, transactions, isolation levels, indexes, N+1. libpq in C, RAII wrapper in C++. What if there's no DB (files, in-memory) and what if there's no index / no transaction? |
| 11 | 13 | Caching: memory hierarchy, LRU/LFU, TTL, cache-aside vs write-through, invalidation, stampedes, Redis protocol (RESP). LRU in C++, raw RESP over a socket, hiredis. What if there's no Redis (in-process cache) and what if there's no cache at all? |
| 12 | 14 | Task queues & background jobs: producer/consumer, worker pools, retries, dead-letter, at-least-once vs at-most-once. Thread-safe queue in C++ (mutex/condvar). RabbitMQ/Redis queues. What if there's no broker (DB-backed queue, cron) and what if you do slow work inline? |
| 13 | 15 | Full-text search: inverted indexes, tokenization, stemming, TF-IDF, BM25. Inverted index in C++. How Elasticsearch/Lucene does it. What if there's no search engine (`LIKE '%x%'`, Postgres FTS)? |
| 14 | 16 | Error handling & fault tolerance: errno, return codes vs exceptions, `std::expected`, retries with backoff, timeouts, circuit breakers, bulkheads, idempotent recovery. What if errors are swallowed or every failure cascades? |
| 15 | 17 | Production configuration management: env vars, config files, secrets, layering, validation at startup, hot reload. Typed config loader in C++. What if config is hard-coded, or secrets are in git? |
| 16 | 18 | Logging, monitoring, observability: structured logs, levels, async logging, metrics (counters/histograms), Prometheus format, tracing/spans, correlation IDs. In C++. What if you only have `printf`? Debugging production blind. |
| 17 | 19 | Graceful shutdown: signals (`SIGTERM`), draining connections, in-flight requests, timeouts, resource cleanup. Signal-safe handling in C, RAII shutdown in C++. What if you just `kill -9` (lost requests, corrupted state, half-written files)? |
| 18 | 20 | Backend security: TLS (OpenSSL handshake walkthrough), injection, XSS/CSRF, rate limiting, secrets, hashing, OWASP top 10, memory safety in C/C++. What if there's no TLS, no rate limit, no input escaping? |
| 19 | 21.1 | Scaling & performance part 1: latency vs throughput, profiling (perf, valgrind), benchmarking, blocking vs non-blocking IO, `epoll`, event loops, thread-per-connection vs reactor. What if you stay blocking (C10K)? |
| 20 | 21.2 | Scaling & performance part 2: vertical vs horizontal, load balancing, stateless design, sticky sessions, connection pooling, zero-copy, memory pools, lock-free basics. What if there's no load balancer, no pool? |
| 21 | 22 | Concurrency & parallelism: IO-bound vs CPU-bound, processes vs threads vs async, `std::thread`, atomics, data races, thread pools, `epoll` + thread pool reactor. What if you use the wrong model for the workload? |
| 22 | 23 | Object storage part 1: blobs vs files vs DB, S3 model, buckets/keys, multipart upload, content addressing, durability. Simple object store in C++. What if you store files in the DB or on local disk of one server? |
| 23 | 24 | Object storage part 2: presigned URLs, streaming large files, checksums, CDN, lifecycle rules, MinIO/S3 API from C++ (libcurl). What if uploads go through your API server? |
| 24 | 25 | Real-time backends: polling vs long polling vs SSE vs WebSockets (handshake + framing by hand in C/C++), pub/sub fan-out, backpressure. What if you just poll? When is polling actually fine? |
| 25 | 26 | Testing: unit/integration/e2e, mocks and fakes, TDD, coverage, GoogleTest/Catch2, testing sockets and DB code. What if there are no tests, or only mocks? |
| 26 | 27 | The Twelve-Factor App: each factor — why it exists, what breaks without it, how it applies to a C++ service. |
| 27 | 28 | OpenAPI: contract-first design, writing a spec, validating requests against it, generating clients/servers. What if there's no contract (drift, undocumented APIs)? |
| 28 | 29 | Webhooks: server-to-client callbacks, signing payloads (HMAC), retries, idempotency keys, receiver implementation in C++. What if the receiver is down, slow, or replays? |
| 29 | 30 | DevOps for backend engineers: Docker (multi-stage builds for C++), CI, deploying, health checks, reverse proxies, zero-downtime deploys. What if you deploy by hand / with no health check? |
| 30 | — | Capstone: how all the pieces fit into one production-style C++ backend (request lifecycle end to end through router, middleware, DB, cache, queue, logging, shutdown). Course recap and "what next". |

---

## 7. Style of Explanation (how to write)

- Write like a patient senior engineer explaining to a motivated junior. Short sentences.
- Every section should make the reader able to answer: *Why? When? How? Where is it used?
  What happens without it?*
- Prefer one deep, complete explanation over several shallow ones.
- Every acronym expanded on first use on each page.
- No marketing fluff, no "in this exciting lesson". Just teach.
