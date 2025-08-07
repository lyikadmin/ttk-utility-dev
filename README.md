# TTK UTILITY FOR DEVELOPERS AND TESTERS

## Run with Docker Compose

1. **Build and start the SPA:**
   ```sh
   docker-compose up --build
   ```
   (or, if already built: `docker-compose up`)

2. **Open the app:**
   Visit [http://localhost:9000](http://localhost:9000) in your browser.

---

## Run with Docker (standalone)

1. **Build the Docker image:**
   ```sh
   docker build -t ttk-jwt-spa .
   ```

2. **Run the container:**
   ```sh
   docker run --rm -p 9000:8080 ttk-jwt-spa
   ```

3. **Open the app:**
   Visit [http://localhost:9000](http://localhost:9000) in your browser.

---

This will serve the SPA using a lightweight Node.js http-server. No Node.js or Python is required on your host machine—just Docker!
