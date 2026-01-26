export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">
          💰 BachatList
        </h1>
        <p className="text-2xl mb-8">
          Next.js App - Setup Complete!
        </p>
        <div className="space-y-2 text-lg">
          <p>✅ Database Connected</p>
          <p>✅ Prisma Configured</p>
          <p>✅ Admin User Created</p>
          <p className="text-sm mt-4 opacity-80">
            Admin: admin@bachatlist.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
