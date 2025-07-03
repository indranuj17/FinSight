// app/(auth)/layout.js
import React from "react";

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
