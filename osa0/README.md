0.4: uusi muistiinpano

    sequenceDiagram
        participant browser
        participant server

        browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
        activate server
        server->>browser: redirect request
        server deactivate

        Note: The server requests browser to redirect. server requests browser to automatically send another HTTP GET request to the location specified in the header, in this case to /exampleapp/notes

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/note
        activate server
        server->>browser: HTML document
        server deactivate

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
        activate server
        server-->>browser: the css file
        deactivate server
    
        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
        activate server
        server-->>browser: the JavaScript file
        deactivate server
    
        Note: The browser starts executing the JavaScript code that fetches the JSON from the server
    
        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
        activate server
        server-->>browser: [{"content": "Será","date": "2025-09-25T18:24:38.565Z"}, ... ]
        deactivate server

        Note: The browser executes the callback function that renders the notes

0.5: Single Page App

    sequenceDiagram
        participant browser
        participant server

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
        activate server
        server->>browser: HTML document
        server deactivate

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
        activate server
        server-->>browser: the css file
        deactivate server

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
        activate server
        server-->>browser: the JavaScript file
        deactivate server

        Note: The browser starts executing the JavaScript code that fetches the JSON from the server

        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
        activate server
        server-->>browser: [{"content": "l;","date": "2025-09-25T19:22:30.848Z"}, ... ]
        deactivate server

        Note: The browser executes the callback function that renders the notes

0.6: Uusi muistiinpano

    sequenceDiagram
        participant browser
        participant server

        browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
        activate server
        server->>browser: HTML document
        server deactivate