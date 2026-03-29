import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, Dumbbell, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Workout tracking and calorie counting in one place.
        </h1>

        <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-5">
          Track your workouts, count your daily calories, and monitor your progress.
        </p>

        <div className="flex justify-center gap-4 flex-wrap"></div>
      </section>

      <section className="container mx-auto px-6 py-1">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition">
            <button
              type="button"
              onClick={() => navigate("/training-request")}
              className="w-full text-left cursor-pointer"
            >
              <CardHeader>
                <Dumbbell className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Find a Coach</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Choose a coach and request a training plan for your goals.
              </CardContent>
            </button>
          </Card>

          <Card className="hover:shadow-lg transition">
            <button
              type="button"
              onClick={() => navigate("/calorie-counter")}
              className="w-full text-left cursor-pointer"
            >
              <CardHeader>
                <Flame className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Calorie Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Set a daily target and follow your macros.
              </CardContent>
            </button>
          </Card>

          <Card className="hover:shadow-lg transition">
            <button
              type="button"
              onClick={() => navigate("/training-requests")}
              className="w-full text-left cursor-pointer"
            >
              <CardHeader>
                <ArrowRightLeft className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Training Requests</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Track the status of incoming or sent training plan requests.
              </CardContent>
            </button>
          </Card>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground mt-auto">
        © {new Date().getFullYear()} CalorieX
      </footer>
    </div>
  );
}
