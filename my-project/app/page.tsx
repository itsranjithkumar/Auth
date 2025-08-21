export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-4">Welcome to Deep Learning Practice!</h1>
      <p className="text-lg mb-8 text-muted-foreground">
        Your interactive hub for mastering deep learning with videos, quizzes, and flashcards.
      </p>
      <a
        href="/sign-in"
        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition"
      >
        Sign In to Continue
      </a>
    </div>
  );
}