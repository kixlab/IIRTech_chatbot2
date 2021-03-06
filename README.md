# Korean Language Learning Chatbot
This is a chatbot that helps korean language learners to improve on vocabulary and develop communicative skills.

### How to run chatbot for development on local server
To run the application, you need two running shells.

- On one of the terminal shells
  ```
  npm start
  ```
- In the other shell (example with port 8000)
  
  *If you want to run on a remote server, change the BASE_URL in ./src/configs/constants.js*
  ```
  python manage.py runserver 8000
  ```
  

### React Component Sturcture
- MainScreen
  - ActivityBox
  - Chatbot

Intially, in the MainScreen component users select one topic from given a list of dialogue topics.
Upon the selection of topic, activities are rendered by ActivityBox. Then, Chatbot is rendered after all the activities are completed. See each of the component file for more information. 

### Quick Note

Please refer to [Chatbot API Markdown](chatbot_api.md) for more information on API usage.

#### Tested with Python v3.6.2
#### If you are seeing any python ImportError, run the following 
```
pip install -r requirement.txt
```