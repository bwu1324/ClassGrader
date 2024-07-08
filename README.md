# ClassGrader

## About

10 Pi Hacks 2021 submission. A web application for reviewing school courses. 

## Built With

* Node.js
* EJS

## Running with Docker

### Prerequisites 

* Docker

### Building and Running Container

1. Build the container
    ```bash
    docker build --tag classgrader .
    ```
2. Start the container
    ```
    docker run -p 8080:8080 classgrader
    ```
    Change `8080:8080` to `8080:<YOUR DESIRED PORT>` if you'd like to change the port the application listens on
3. Access the application at `localhost:8080`
