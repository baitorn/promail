self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("SW activé");
});

// réception notifications
self.addEventListener("message", (event) => {
  if (event.data?.type === "NOTIFICATION") {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: "logo.png"
    });
  }
});