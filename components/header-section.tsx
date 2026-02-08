"use client"

import { Heart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface HeaderSectionProps {
  userName: string
  avatarUrl: string
  heartsCount: number
}

export function HeaderSection({ userName, avatarUrl, heartsCount }: HeaderSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 px-6 pt-10 pb-6"
    >
      {/* Avatar with glowing pink border */}
      <div className="animate-pulse-glow relative h-24 w-24 rounded-full p-[3px]"
        style={{ background: "linear-gradient(135deg, #ff0844, #ffb199)" }}
      >
        <div className="h-full w-full overflow-hidden rounded-full">
          <Image
            src={avatarUrl || "/placeholder.svg"}
            alt={`${userName}'s avatar`}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Name and Badge */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-extrabold text-foreground">{userName}</h1>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-foreground"
          style={{ background: "linear-gradient(135deg, rgba(255,8,68,0.3), rgba(255,177,153,0.2))" }}
        >
          <Heart className="h-3 w-3 fill-current text-[#ff0844]" />
          Secret Valentine
        </span>
      </div>

      {/* Hearts Counter */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="flex items-center gap-2 rounded-full px-5 py-2 glass"
      >
        <Heart className="h-5 w-5 fill-[#ff0844] text-[#ff0844]" />
        <span className="text-lg font-extrabold text-foreground">{heartsCount}</span>
        <span className="text-sm text-muted-foreground">cards received</span>
      </motion.div>
    </motion.div>
  )
}
