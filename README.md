# Production Order Tracking System

## 1. Design Approach
For this prototype, I prioritized a clear separation of concerns and ease of deployment.
* **Backend:** I chose **FastAPI (Python)** for its speed and automatic Swagger documentation generation. It uses **SQLAlchemy** as an ORM to interact with the database, ensuring that if we switch from SQLite to PostgreSQL in production, the code changes are minimal.
* **Frontend:** I used **React with Vite**. React allows for a responsive component-based UI, making state management (like updating order statuses instantly) seamless.

## 2. Architecture & Components
* **Database:** SQLite (local file) for zero-config persistence.
* **API Layer:** RESTful endpoints (`GET /orders`, `POST /orders`, `PUT /orders/{id}`).
* **UI Layer:** A Single Page Application (SPA) consuming the API via Axios.

## 3. Challenges Faced
* **CORS:** Enabling communication between the frontend (port 5173) and backend (port 8000) required configuring CORS middleware in FastAPI.
* **State Management:** Ensuring the UI table updates immediately after a status change required re-fetching data asynchronously.

## 4. Improvements (If given more time)
* **Input Validation:** Add stricter checks on the backend for negative quantities.
* **WebSockets:** Implement real-time updates so if one user updates an order, other screens update automatically without refreshing.
* **Dockerization:** Create a `docker-compose.yml` to spin up both services with one command.

## 5. Scaling for Real Manufacturing
To scale this for a real factory:
1.  **Database:** Migrate to **PostgreSQL** for better concurrency and reliability.
2.  **Caching:** Use **Redis** to cache the "List Orders" endpoint, as reading order lists happens more often than writing.
3.  **Infrastructure:** Deploy the backend on **Kubernetes** with horizontal auto-scaling to handle high traffic during shift changes.