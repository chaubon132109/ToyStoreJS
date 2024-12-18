import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Fireworks } from "@fireworks-js/react";
import { Card } from "../ui/card";

const targetDate = new Date("2025-01-01T00:00:00");

export default function NewYearCountdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Fireworks
        options={{
          rocketsPoint: {
            min: 0,
            max: 100,
          },
        }}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 1,
        }}
      />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-16 z-10"
      >
        <img
          src="https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513862/toystore/logo.png"
          alt="Larkon Logo"
          className="h-12 invert"
        />
      </motion.div>

      <Card className="bg-white/10 backdrop-blur-md border-none text-white p-8 rounded-xl z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="absolute -top-6 -left-2 bg-yellow-400 text-blue-900 text-sm font-bold py-1 px-3 -rotate-6">
              COUNTDOWN TO
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="bg-yellow-400 text-blue-900 text-4xl md:text-6xl font-bold py-2 px-4 transform -skew-x-12">
                2025
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 md:gap-8 mb-12">
            {[
              { value: timeLeft.days, label: "DAYS" },
              { value: timeLeft.hours, label: "HOURS" },
              { value: timeLeft.minutes, label: "MINUTES" },
              { value: timeLeft.seconds, label: "SECONDS" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-2xl md:text-4xl font-bold mb-1">
                  {item.value.toString().padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm text-yellow-400">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
          >
            Hãy sẵn sàng chào đón năm 2025 cùng ToyStore ! Chúng tôi đang chuẩn
            bị một điều gì đó thật hoành tráng để khởi đầu cho năm sắp tới. Hãy
            theo dõi một lễ kỷ niệm khó quên sẽ thắp sáng thế giới của bạn với
            niềm vui và những khả năng mới.
          </motion.p>
        </motion.div>
      </Card>
    </div>
  );
}
