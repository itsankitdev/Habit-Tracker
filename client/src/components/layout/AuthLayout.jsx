function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;