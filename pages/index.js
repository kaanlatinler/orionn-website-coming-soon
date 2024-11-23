import { useState, useEffect, useRef } from "react";

const ParticleNetwork = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // İlk boyutlandırma
    resizeCanvas();

    // Pencere boyutu değiştiğinde yeniden boyutlandırma
    window.addEventListener("resize", resizeCanvas);

    // Mouse pozisyonunu güncelle
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Parçacıkları oluştur
    const createParticles = () => {
      const particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 2,
        });
      }
      particlesRef.current = particles;
    };

    createParticles();

    // Animasyon döngüsü
    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Parçacıkları güncelle ve çiz
      particlesRef.current.forEach((particle, i) => {
        // Parçacık hareketini güncelle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Ekran sınırlarını kontrol et
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Parçacığı çiz
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 255, 255, 0.5)";
        context.fill();

        // Mouse ve diğer parçacıklarla bağlantıları çiz
        const mouseDistance = Math.hypot(
          mouseRef.current.x - particle.x,
          mouseRef.current.y - particle.y
        );
        if (mouseDistance < 150) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(mouseRef.current.x, mouseRef.current.y);
          context.strokeStyle = `rgba(255, 255, 255, ${
            0.2 * (1 - mouseDistance / 150)
          })`;
          context.stroke();
        }

        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const distance = Math.hypot(
            otherParticle.x - particle.x,
            otherParticle.y - particle.y
          );
          if (distance < 100) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(otherParticle.x, otherParticle.y);
            context.strokeStyle = `rgba(255, 255, 255, ${
              0.2 * (1 - distance / 100)
            })`;
            context.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10" />;
};

const ComingSoonPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = new Date().getTime() + 24 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-800/90 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Interactive Background */}
      <ParticleNetwork />

      {/* Logo Container */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-wider">ORIONN</h1>
        <p className="text-xl text-gray-400 mt-2 text-center">DEVELOPMENT</p>
      </div>

      {/* Coming Soon Text */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold mb-4">Çok Yakında</h2>
        <p className="text-gray-400 text-lg">
          Yeni websitemiz için geri sayım başladı!
        </p>
      </div>

      {/* Timer Container */}
      <div className="flex space-x-6">
        <div className="flex flex-col items-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <span className="text-4xl font-bold">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
          </div>
          <span className="text-sm mt-2 text-gray-400">SAAT</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <span className="text-4xl font-bold">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
          </div>
          <span className="text-sm mt-2 text-gray-400">DAKİKA</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <span className="text-4xl font-bold">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
          <span className="text-sm mt-2 text-gray-400">SANİYE</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-12 space-x-6">
        <a
          href="https://www.instagram.com/orionndevelopment/"
          className="text-gray-400 hover:text-white transition-colors"
        >
          Instagram
        </a>
      </div>
    </div>
  );
};

export default ComingSoonPage;
