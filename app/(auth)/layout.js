// app/(auth)/layout.js
export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      {children}
    </div>
  );
}
