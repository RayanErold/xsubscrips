import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background" />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo Mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-20 h-20 bg-foreground rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
            <span className="text-background text-4xl font-bold italic tracking-tighter">X</span>
          </div>
          
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-primary rounded-2xl blur-xl"
          />
        </motion.div>

        <div className="flex flex-col items-center gap-3">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            X Subscrips
          </motion.h2>
          
          {/* Minimalist loading bar */}
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              animate={{ x: [-192, 192] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full bg-primary"
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium"
          >
            Preparing your experience
          </motion.p>
        </div>
      </div>
    </div>
  );
}
