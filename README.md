# 📱 Study Buddy Mobile (Expo App)

Welcome to the Study Buddy mobile app! This project is built with [Expo](https://expo.dev) and uses [file-based routing](https://docs.expo.dev/router/introduction/).

---

## 🚀 Quick Start

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Configure Environment Variables**

- Find your **device's IPv4 address** (for backend API access).
- Create a `.env` file in the project root with:

  ```env
  EXPO_PUBLIC_STUDDY_BUDDY_API_URL=http://<YOUR_IPV4_ADDRESS>:8000
  ```

  > **Tip:** On most systems, you can find your IP with `ipconfig` (Windows) or `ifconfig`/`ip a` (Mac/Linux).

### 3. **Start the App**

```bash
npm run dev
```

- Choose to run on:
  - Android emulator
  - iOS simulator
  - [Expo Go](https://expo.dev/go) (scan QR code)
  - Web browser

---

## 🛠 Development

- Edit files in the **app/** directory.
- Uses [file-based routing](https://docs.expo.dev/router/introduction/).
- API requests are configured to use the URL in your `.env` file.

### Reset to a Fresh Project

```bash
npm run reset-project
```

- Moves starter code to **app-example/**
- Creates a blank **app/** directory

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)

---

## 💬 Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)

---

## 📝 Notes

- Make sure your backend server is accessible from your device.
- If you change the API URL, restart the Expo server.

---

Happy coding! 🎉
