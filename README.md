# **Marina's Digital Garden**

An interactive full-stack web application built with Python, Flask, and JavaScript that allows users to manage a virtual garden. The application features a persistent database, a complete RESTful API for all plant operations, and is served by a production-grade Gunicorn server.

[View the live demo here](https://github.com/tpercival01/Marinas-Garden)

---

## 🚀 Tech Stack

This project demonstrates a full-stack architecture, separating concerns between the backend API and the frontend UI.

| Category      | Technology                                      |
| :------------ | :---------------------------------------------- |
| **Frontend**  | `HTML5`, `CSS3`, `JavaScript (ES6+)`            |
| **Backend**   | `Python 3`, `Flask`                             |
| **Database**  | `SQLite` / `PostgreSQL`, `SQLAlchemy` (ORM)     |
| **API**       | `RESTful`, `JSON`                               |
| **Deployment**| `Gunicorn` (WSGI Server)                        |

---

## ✨ Key Features

-   **Full CRUD Functionality:** Users can Create, Read, Update, and Delete plants in their garden.
-   **RESTful API:** A complete API backend handles all data manipulation. All communication between the front-end and back-end is done asynchronously via `fetch()` requests.
-   **Persistent Data Storage:** Plant data is stored in a SQLite database and managed with the SQLAlchemy ORM, ensuring user data is saved across sessions.
-   **Dynamic UI:** The front-end is built with vanilla JavaScript and manipulates the DOM to provide a seamless, real-time user experience without page reloads.
-   **Self-Contained & Served:** The application is served as a single unit by a production-ready Gunicorn server, with Flask handling both API requests and the rendering of the front-end application.

---

## 🛠️ Installation & Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/marinas-garden-project.git
    cd marinas-garden-project/backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

3.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Initialize the database:**
    -   Open the Python interpreter in your terminal by typing `python`.
    -   Run the following commands to create the `garden.db` file and tables:
    ```python
    from app import app, db
    with app.app_context():
        db.create_all()
    exit()
    ```

5.  **Run the application using Gunicorn:**
    ```bash
    gunicorn --bind 0.0.0.0:8000 app:app
    ```

6.  **Open your browser** and navigate to `http://127.0.0.1:8000`.

---

## 🔌 API Endpoints

The backend provides the following RESTful API endpoints:

| Method   | Endpoint            | Description                                        |
| :------- | :------------------ | :------------------------------------------------- |
| `GET`    | `/api/plants`       | Retrieves a list of all plants in the garden.      |
| `POST`   | `/api/plants`       | Creates a new plant with data from the request body. |
| `PUT`    | `/api/plants/<id>`  | Updates the details of a specific plant by its ID. |
| `DELETE` | `/api/plants/<id>`  | Deletes a specific plant by its ID.                |

---

## **License**

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---

## **Acknowledgments**

- **Marina**: The inspiration behind the project and the goddess of the garden. 🌸
- **Open Source Community**: For providing tools, libraries, and resources that made this project possible.
- **Plant Enthusiasts**: For their love of greenery and dedication to plant care.

---