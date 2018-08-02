# KIXLAB Chatbot Template

### Component Sturcture
- Chatbot.jsx
  - MessageBox.jsx
    - Message.jsx
      - BotMessage.jsx
      - SystemMessage.jsx
      - UserMessage.jsx
  - InputBox.jsx

### HOW-TO add message
- All messages are managed in Chatbot.jsx
- Use appendMessage function to add messages
  - The argument should be in json [{type: integer, content: string},{type: integer, content: string}]

### HOW-TO run chatbot for development
- Clone the repository to a directory
- On terminal shell
  ```
  npm start
  ```
- Open another shell
  ```
  python manage.py runserver 8000
  ```

### HOW-TO run chatbot for deployment
- Run the following in the directory respectively
  ```
  npm run build
  mv build ./backend
  cd backend && python manage.py collectstatic
  mv build/manifest.json static
  ```
- Then open index.html in backend/build directory and reference static files (css, js, etc)
- If everything is set, python manage.py runserver
- For more information, refer to https://medium.com/@nicholaskajoh/heres-a-dead-simple-react-django-setup-for-your-next-project-c0b0036663c6