import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={stagger}
        className="px-4 md:px-20 py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to Gentle Finance
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              Your Trusted Partner for Financial Solutions
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Get Started
            </button>
            <button className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
        className="px-4 md:px-20 py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Why Choose Us
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Secure Transactions",
                description:
                  "Bank-grade security for all your financial transactions",
                icon: "🔒",
              },
              {
                title: "24/7 Support",
                description:
                  "Round-the-clock customer support for your peace of mind",
                icon: "💬",
              },
              {
                title: "Smart Analytics",
                description:
                  "Detailed insights to help you make informed decisions",
                icon: "📊",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 rounded-xl border border-gray-200 hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
        className="px-4 md:px-20 py-16 bg-primary/5"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Join thousands of satisfied customers who trust Gentle Finance
            </p>
            <button className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Create Account
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
