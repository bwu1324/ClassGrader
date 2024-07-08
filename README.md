# ClassGrader

## About

10 Pi Hacks 2021 submission. A web application for students write and view reviews for school courses. 

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
    docker run -v ./data:/app/data -p 8080:8080 classgrader
    ```
    Change `8080:8080` to `8080:<YOUR DESIRED PORT>` if you'd like to change the port the application listens on
3. Access the application at `localhost:8080`
* Note: You can copy the `example_data` folder to the `./data` directory to use example data.
  
## Developing Locally

### Prerequisites

* Node.js (Tested with Node 18)

### Starting the Application

1. Install dependencies
    ```bash
    npm install
    ```
2. Start server
    ```bash
    node server.js
    ```
